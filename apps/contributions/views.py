# apps/contributions/views

from django.shortcuts import render, redirect, get_object_or_404
from django.shortcuts import redirect
from django.views.generic import CreateView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.db.models import Count, Q
from apps.events.models import Item, Event
from .models import Contribution
from .forms import ContributionForm



class ContributeView(CreateView):
    """View for making contributions to items."""
    model = Contribution
    form_class = ContributionForm
    template_name = 'contributions/contribute.html'
    
    def get_item(self):
        return get_object_or_404(Item, id=self.kwargs.get('item_id')) 
    
    def dispatch(self, request, *args, **kwargs):
        self.item = self.get_item()
        self.event = self.item.category.event
        
        if self.event.status == 'completed':
            messages.error(request, _("This event has ended and is no longer accepting contributions.")) 
            return redirect('events:event_detail', slug=self.event.slug)
            
        if not self.event.can_user_contribute(user=request.user, session=request.session):
            messages.error(request, _("You don't have permission to contribute to this event.")) 
            return redirect('events:event_detail', slug=self.event.slug)
            
        return super().dispatch(request, *args, **kwargs)
    

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        
        # Check if user has access via session or is the organizer
        has_valid_access = self.event.can_user_contribute(
            user=self.request.user, 
            session=self.request.session
        )
        
        kwargs.update({
            'item': self.item,
            'user': self.request.user if self.request.user.is_authenticated else None,
            'has_valid_access': has_valid_access
        })
        return kwargs
    
    def form_valid(self, form):
        form.instance.item = self.item
        form.instance.user = self.request.user if self.request.user.is_authenticated else None
        
        # Save the contribution
        response = super().form_valid(form)
        
        # Save parent objects without recalculation
        self.item.save()
        self.item.category.save()
        self.event.save()
        
        # Update user profile statistics for authenticated users
        if self.request.user.is_authenticated:
            # Update profile statistics
            profile = self.request.user.profile
            profile.update_contribution_stats()
        
        messages.success(self.request, _("Thank you for your contribution!"))
        return response
    
    def get_success_url(self):
        return reverse('events:category_detail', kwargs={
            'event_slug': self.event.slug,
            'category_slug': self.item.category.slug
        })
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'item': self.item,
            'category': self.item.category,
            'event': self.event,
            'contributions': self.item.contributions.all().order_by('-created_at'),
            'has_access': True
        })
        return context



class UserContributionsView(LoginRequiredMixin, ListView):
    """View for listing user's contributions."""
    model = Contribution
    template_name = 'contributions/user_contributions.html'
    context_object_name = 'contributions'
    paginate_by = 10
    
    def get_queryset(self):
        return Contribution.objects.filter(user=self.request.user)\
            .select_related('item__category__event')\
            .order_by('-created_at')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Make sure user profile stats are up-to-date
        self.request.user.profile.update_contribution_stats()
        
        context['event_participations'] = Event.objects.filter(
            categories__items__contributions__user=self.request.user
        ).distinct().annotate(
            contribution_count=Count('categories__items__contributions',
                filter=Q(categories__items__contributions__user=self.request.user))
        ).order_by('-start_date')[:5]
        
        for event in context['event_participations']:
            total_items = event.categories.aggregate(total=Count('items'))['total'] or 1
            event.contribution_percentage = min(100, int((event.contribution_count / total_items) * 100)) 
        
        context.update({
            'total_contributions': self.request.user.contributions.count(),
            'total_events': context['event_participations'].count(),
            'contribution_streak': self.request.user.profile.contribution_streak
        })
        return context