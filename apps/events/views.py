# apps/events/views.py - Updated class-based views for image selection
import logging
import os

from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.core.files.base import ContentFile
from django.db.models import Count, Q, Sum
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.utils.translation import gettext_lazy as _
from django.views.generic import (
    CreateView,
    DetailView,
    FormView,
    ListView,
    UpdateView,
)

from apps.accounts.mixins import OrganizerRequiredMixin
from apps.contributions.models import Contribution

from .forms import (
    AccessCodeForm,
    CategoryForm,
    ContributionLinkForm,
    EventForm,
    ItemForm,
)
from .models import Category, ContributionLink, Event, Item, PredefinedImage

logger = logging.getLogger(__name__)


class EventListView(ListView):
    """View for listing all events.""" 
    model = Event
    template_name = 'events/event_list.html'  
    context_object_name = 'events'
    paginate_by = 9
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status if provided
        status = self.request.GET.get('status')
        if status in dict(Event.STATUS_CHOICES).keys():
            queryset = queryset.filter(status=status)
            
        # Filter by search query if provided
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query)
            )
            
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_status'] = self.request.GET.get('status', '')
        context['current_query'] = self.request.GET.get('q', '')
        return context


class EventDetailView(DetailView):
    """Detailed view of a single event."""
    model = Event
    template_name = 'events/event_detail.html'
    context_object_name = 'event'
    slug_url_kwarg = 'slug'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Get categories
        categories = list(self.object.categories.all().prefetch_related('items__contributions'))
        context['categories'] = categories
        
        # Check if the user has access to contribute
        user = self.request.user
        session = self.request.session
        
        # Add access control information to context
        context['has_access'] = self.object.can_user_contribute(user, session)
        context['is_code_required'] = self.object.is_code_required()
        context['is_invite_only'] = self.object.is_invite_only()
        context['is_public'] = self.object.is_public()
        
        # Add access code form if needed
        if self.object.is_code_required() and not context['has_access']:
            context['access_code_form'] = AccessCodeForm(event=self.object)
        
        return context


class CategoryDetailView(DetailView):
    """Detailed view of a category with its items."""
    model = Category
    template_name = 'events/category_detail.html'
    context_object_name = 'category'
    slug_url_kwarg = 'category_slug'
    
    def get_object(self, queryset=None):
        event_slug = self.kwargs.get('event_slug')
        category_slug = self.kwargs.get('category_slug')  
        return get_object_or_404(
            Category, 
            event__slug=event_slug, 
            slug=category_slug
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Get items with contributions prefetched to avoid N+1 queries
        items = list(
            self.object.items.prefetch_related('contributions').annotate(
                contributed_total=Sum('contributions__quantity'),
                contributors_total=Count('contributions'),
            )
        )

        # Calculate progress for each item using annotated data
        for item in items:
            contributed_quantity = item.contributed_total or 0
            item.contributed = contributed_quantity
            item.contributors_count = item.contributors_total or 0

            # Calculate progress percentage
            if item.required_quantity > 0:
                item.progress_percentage = min(
                    100,
                    int((contributed_quantity / item.required_quantity) * 100)
                )
            else:
                item.progress_percentage = 0

        context['items'] = items

        # Add event to context
        event = self.object.event

        context['event'] = event
        context['has_access'] = event.can_user_contribute(
            self.request.user, self.request.session
        )
        context['is_code_required'] = event.is_code_required()
        context['is_invite_only'] = event.is_invite_only()

        # Add access code form if needed
        if event.is_code_required() and not context['has_access']:
            context['access_code_form'] = AccessCodeForm(event=event)

        return context


class EventCreateView(LoginRequiredMixin, OrganizerRequiredMixin, CreateView):  
    """View for creating a new event."""
    model = Event
    form_class = EventForm
    template_name = 'events/event_form.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
    
    def form_valid(self, form):
        form.instance.organizer = self.request.user
        
        # Handle predefined image if selected
        predefined_image = form.cleaned_data.get('predefined_image')
        if predefined_image and not form.cleaned_data.get('image'):
            # Save the form first without committing to get the object
            event = form.save(commit=False)
            
            # Copy the predefined image to the event image field
            img_name = os.path.basename(predefined_image.image.name)
            img_content = predefined_image.image.read()
            event.image.save(img_name, ContentFile(img_content), save=False)
            
            # Now save the event
            event.save()
            messages.success(self.request, _('Event created successfully!'))
            return HttpResponseRedirect(event.get_absolute_url())
        
        messages.success(self.request, _('Event created successfully!')) 
        return super().form_valid(form)


class EventUpdateView(LoginRequiredMixin, OrganizerRequiredMixin, UpdateView):
    """View for updating an existing event."""
    model = Event
    form_class = EventForm
    template_name = 'events/event_form.html'
    
    def get_queryset(self):
        # Only allow editing of own events
        return Event.objects.filter(organizer=self.request.user)
    
    def form_valid(self, form):
        # Handle predefined image if selected
        predefined_image = form.cleaned_data.get('predefined_image')
        if predefined_image:
            # Only replace image if a predefined one is selected and no new upload
            if not form.cleaned_data.get('image'):
                event = form.save(commit=False)
                
                # Delete existing image if any (Django-cleanup will handle file deletion)
                if event.image:
                    event.image = None
                
                # Copy the predefined image to the event image field
                img_name = os.path.basename(predefined_image.image.name)
                img_content = predefined_image.image.read()
                event.image.save(img_name, ContentFile(img_content), save=False)
                
                # Save the event
                event.save()
                messages.success(self.request, _('Event updated successfully!'))
                return HttpResponseRedirect(event.get_absolute_url())
        
        messages.success(self.request, _('Event updated successfully!'))
        return super().form_valid(form)


class CategoryCreateView(LoginRequiredMixin, OrganizerRequiredMixin, CreateView):
    """View for creating a new category under an event."""
    model = Category
    form_class = CategoryForm
    template_name = 'events/category_form.html'
    
    def get_event(self):
        event_slug = self.kwargs.get('event_slug')
        return get_object_or_404(Event, slug=event_slug, organizer=self.request.user)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['event'] = self.get_event()
        return context
    
    def form_valid(self, form):
        form.instance.event = self.get_event()
        
        # Handle predefined image if selected
        predefined_image = form.cleaned_data.get('predefined_image')
        if predefined_image and not form.cleaned_data.get('image'):
            # Save the category first without committing
            category = form.save(commit=False)
            
            # Copy the predefined image to the category image field
            img_name = os.path.basename(predefined_image.image.name)
            img_content = predefined_image.image.read()
            category.image.save(img_name, ContentFile(img_content), save=False)
            
            # Now save the category
            category.save()
            messages.success(self.request, _('Category created successfully!'))
            return HttpResponseRedirect(category.get_absolute_url())
        
        messages.success(self.request, _('Category created successfully!'))
        return super().form_valid(form)


class CategoryUpdateView(LoginRequiredMixin, OrganizerRequiredMixin, UpdateView):
    """View for updating an existing category."""
    model = Category
    form_class = CategoryForm
    template_name = 'events/category_form.html'
    slug_url_kwarg = 'category_slug'
    
    def get_object(self, queryset=None):
        event_slug = self.kwargs.get('event_slug')
        category_slug = self.kwargs.get('category_slug')
        return get_object_or_404(
            Category,
            event__slug=event_slug,
            slug=category_slug,
            event__organizer=self.request.user
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['event'] = self.object.event
        return context
    
    def form_valid(self, form):
        # Handle predefined image if selected
        predefined_image = form.cleaned_data.get('predefined_image')
        if predefined_image:
            # Only replace image if a predefined one is selected and no new upload
            if not form.cleaned_data.get('image'):
                category = form.save(commit=False)
                
                # Delete existing image if any
                if category.image:
                    category.image = None
                
                # Copy the predefined image to the category image field
                img_name = os.path.basename(predefined_image.image.name)
                img_content = predefined_image.image.read()
                category.image.save(img_name, ContentFile(img_content), save=False)
                
                # Save the category
                category.save()
                messages.success(self.request, _('Category updated successfully!'))
                return HttpResponseRedirect(category.get_absolute_url())
        
        messages.success(self.request, _('Category updated successfully!'))
        return super().form_valid(form)


class ItemCreateView(LoginRequiredMixin, OrganizerRequiredMixin, CreateView): 
    """View for creating a new item under a category."""
    model = Item
    form_class = ItemForm
    template_name = 'events/item_form.html'
    
    def get_category(self):
        event_slug = self.kwargs.get('event_slug')
        category_slug = self.kwargs.get('category_slug')
        return get_object_or_404(
            Category, 
            event__slug=event_slug, 
            slug=category_slug,
            event__organizer=self.request.user
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.get_category()
        return context
    
    def form_valid(self, form):
        form.instance.category = self.get_category()
        
        # Handle predefined image if selected
        predefined_image = form.cleaned_data.get('predefined_image')
        if predefined_image and not form.cleaned_data.get('image'):
            # Save the item first without committing
            item = form.save(commit=False)
            
            # Copy the predefined image to the item image field
            img_name = os.path.basename(predefined_image.image.name)
            img_content = predefined_image.image.read()
            item.image.save(img_name, ContentFile(img_content), save=False)
            
            # Now save the item
            item.save()
            messages.success(self.request, _('Item created successfully!'))
            return redirect('events:category_detail', 
                          event_slug=item.category.event.slug,
                          category_slug=item.category.slug)
        
        messages.success(self.request, _('Item created successfully!'))
        return super().form_valid(form)


class ItemUpdateView(LoginRequiredMixin, OrganizerRequiredMixin, UpdateView):
    """View for updating an existing item."""
    model = Item
    form_class = ItemForm
    template_name = 'events/item_form.html'
    pk_url_kwarg = 'item_id'
    
    def get_object(self, queryset=None):
        event_slug = self.kwargs.get('event_slug')
        category_slug = self.kwargs.get('category_slug')
        item_id = self.kwargs.get('item_id')
        return get_object_or_404(
            Item,
            id=item_id,
            category__slug=category_slug,
            category__event__slug=event_slug,
            category__event__organizer=self.request.user 
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.object.category
        context['event'] = self.object.category.event
        return context
    
    def form_valid(self, form):
        # Handle predefined image if selected
        predefined_image = form.cleaned_data.get('predefined_image')
        if predefined_image:
            # Only replace image if a predefined one is selected and no new upload
            if not form.cleaned_data.get('image'):
                item = form.save(commit=False)
                
                # Delete existing image if any
                if item.image:
                    item.image = None
                
                # Copy the predefined image to the item image field
                img_name = os.path.basename(predefined_image.image.name)
                img_content = predefined_image.image.read()
                item.image.save(img_name, ContentFile(img_content), save=False)
                
                # Save the item
                item.save()
                messages.success(self.request, _('Item updated successfully!'))
                return redirect('events:category_detail',
                              event_slug=item.category.event.slug,
                              category_slug=item.category.slug)
        
        messages.success(self.request, _('Item updated successfully!'))
        return super().form_valid(form)


class GenerateContributionLinkView(LoginRequiredMixin, OrganizerRequiredMixin, FormView):
    """View for generating a contribution link for an event."""
    template_name = 'events/generate_link.html'
    form_class = ContributionLinkForm
    
    def get_success_url(self):
        return reverse('events:event_detail', kwargs={'slug': self.event.slug})
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        self.event = get_object_or_404(Event, slug=self.kwargs['slug'], organizer=self.request.user)
        return kwargs
    
    def form_valid(self, form):
        # Create the contribution link
        link_name = form.cleaned_data.get('name', '')
        contribution_link = ContributionLink.generate_for_event(self.event, name=link_name)
        
        # Add the link to the context for display
        self.contribution_link = contribution_link
        
        messages.success(self.request, _("Contribution link generated successfully!"))
        return super().form_valid(form)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['event'] = self.event
        
        # If form was submitted and valid, add the new link
        if hasattr(self, 'contribution_link'):
            context['contribution_link'] = self.contribution_link
            context['full_link_url'] = self.contribution_link.get_full_url(self.request)
        
        # Get existing contribution links for this event
        context['existing_links'] = ContributionLink.objects.filter(
            event=self.event, is_active=True
        ).order_by('-created_at')
        
        return context


class VerifyAccessCodeView(FormView):
    """View to validate an event access code."""
    form_class = AccessCodeForm
    template_name = 'events/access_code_form.html'
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        self.event = get_object_or_404(Event, slug=self.kwargs.get('slug'))
        kwargs['event'] = self.event
        return kwargs
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['event'] = self.event
        return context
    
    def form_valid(self, form):
        # Store access in session
        self.request.session[f'event_access_{self.event.id}'] = True

        messages.success(
            self.request,
            _("Access code verified successfully. You can now contribute to this event!")
        )

        # Redirect back to the event or category (with validation)
        redirect_url = self.request.GET.get('next')
        if redirect_url and url_has_allowed_host_and_scheme(
            url=redirect_url,
            allowed_hosts={self.request.get_host()},
            require_https=self.request.is_secure(),
        ):
            return HttpResponseRedirect(redirect_url)
        return HttpResponseRedirect(self.event.get_absolute_url())
    
    def form_invalid(self, form):
        messages.error(self.request, _("Invalid access code. Please try again."))
        return super().form_invalid(form)


class ContributionLinkDetailView(DetailView):
    """View for accessing an event through a contribution link."""
    model = ContributionLink
    template_name = 'events/contribution_link_detail.html'
    context_object_name = 'link'
    slug_field = 'code'
    slug_url_kwarg = 'code'
    
    def get_object(self, queryset=None):
        # Get the link by its code
        link = super().get_object(queryset)
        
        # Check if the link is active
        if not link.is_active:
            raise Http404(_("This contribution link is no longer active."))
            
        return link
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        event = self.object.event
        
        # Get categories
        categories = event.categories.all()
        
        # Store access in session
        self.request.session[f'event_access_{event.id}'] = True
        
        context['event'] = event
        context['categories'] = categories
        context['has_access'] = True  # They have access via the link
        
        return context


class EventContributorSummaryView(LoginRequiredMixin, OrganizerRequiredMixin, DetailView):
    """View that displays a summary of all contributors to an event."""
    model = Event
    template_name = 'events/event_contributors.html'
    context_object_name = 'event'
    slug_url_kwarg = 'slug'
    
    def get_queryset(self):
        # Only allow viewing contributor summary for own events
        return Event.objects.filter(organizer=self.request.user)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        event = self.object
        
        # Get all items in this event with their categories
        items = Item.objects.filter(category__event=event).select_related('category')
        
        # Get all contributions grouped by contributor (both registered and anonymous)
        registered_contributors = Contribution.objects.filter(
            item__category__event=event,
            user__isnull=False
        ).values(
            'user__id', 
            'user__username',
            'user__first_name',
            'user__last_name',
            'user__email'
        ).annotate(
            total_contributions=Count('id'),
            total_quantity=Sum('quantity')
        ).order_by('-total_quantity')
        
        anonymous_contributors = Contribution.objects.filter(
            item__category__event=event,
            user__isnull=True
        ).values(
            'name', 
            'email'
        ).annotate(
            total_contributions=Count('id'),
            total_quantity=Sum('quantity')
        ).order_by('-total_quantity')
        
        # Get detailed contributions per contributor
        contributor_details = {}
        
        # For registered users
        for contributor in registered_contributors:
            user_id = contributor['user__id']
            contributor_details[f'user_{user_id}'] = {
                'name': (contributor['user__first_name'] + ' ' + contributor['user__last_name']).strip() or contributor['user__username'],
                'email': contributor['user__email'],
                'is_registered': True,
                'total_quantity': contributor['total_quantity'],
                'contributions': []
            }
            
            # Get individual contributions
            user_contributions = Contribution.objects.filter(
                item__category__event=event,
                user__id=user_id
            ).select_related('item', 'item__category')
            
            for contrib in user_contributions:
                contributor_details[f'user_{user_id}']['contributions'].append({
                    'item_name': contrib.item.name,
                    'category_name': contrib.item.category.name,
                    'quantity': contrib.quantity,
                    'date': contrib.created_at,
                    'comment': contrib.comment
                })
        
        # For anonymous contributors
        for contributor in anonymous_contributors:
            key = f"anon_{contributor['name']}_{contributor['email'] or 'noemail'}" 
            contributor_details[key] = {
                'name': contributor['name'],
                'email': contributor['email'] or '-',
                'is_registered': False,
                'total_quantity': contributor['total_quantity'],
                'contributions': []
            }
            
            # Get individual contributions
            anon_filter = {
                'item__category__event': event,
                'user__isnull': True,
                'name': contributor['name']
            }
            # Only add email filter if email exists
            if contributor['email']:
                anon_filter['email'] = contributor['email']
                
            anon_contributions = Contribution.objects.filter(
                **anon_filter
            ).select_related('item', 'item__category')
            
            for contrib in anon_contributions:
                contributor_details[key]['contributions'].append({
                    'item_name': contrib.item.name,
                    'category_name': contrib.item.category.name,
                    'quantity': contrib.quantity,
                    'date': contrib.created_at,
                    'comment': contrib.comment
                })
        
        context['registered_contributors'] = registered_contributors
        context['anonymous_contributors'] = anonymous_contributors
        context['contributor_details'] = contributor_details
        
        # Calculate total stats
        context['total_contributors'] = len(registered_contributors) + len(anonymous_contributors)
        context['total_contributions'] = sum(c['total_contributions'] for c in registered_contributors) + sum(c['total_contributions'] for c in anonymous_contributors)
        context['total_items_contributed'] = sum(c['total_quantity'] for c in registered_contributors) + sum(c['total_quantity'] for c in anonymous_contributors)
        
        return context
