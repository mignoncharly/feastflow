# apps/accounts/views.py
import logging

from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import (
    LoginView,
    LogoutView,
    PasswordResetCompleteView,
    PasswordResetConfirmView,
    PasswordResetDoneView,
    PasswordResetView,
)
from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.utils.http import url_has_allowed_host_and_scheme
from django.utils.translation import gettext_lazy as _
from django.views.generic import CreateView, TemplateView, UpdateView

from apps.contributions.models import Contribution
from apps.events.models import Event

from .forms import CustomAuthenticationForm, ProfileUpdateForm, UserRegistrationForm
from .models import User

logger = logging.getLogger(__name__)



class CustomLoginView(LoginView):
    """Custom login view that handles username/email authentication"""
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True
    form_class = CustomAuthenticationForm  
    
    def get_success_url(self):
        """Redirect to dashboard if next parameter is not provided."""
        next_url = self.request.GET.get('next')
        if next_url and url_has_allowed_host_and_scheme(
            url=next_url,
            allowed_hosts={self.request.get_host()},
            require_https=self.request.is_secure(),
        ):
            return next_url
        return reverse_lazy('accounts:dashboard')
    
    def form_valid(self, form):
        """Override to add success message after login"""
        response = super().form_valid(form)
        messages.success(self.request, _("Login successful! Welcome to FeastFlow."))
        return response


class RegisterView(CreateView):
    """View for user registration"""
    form_class = UserRegistrationForm
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('core:home')
    
    def form_valid(self, form):
        # Save the user and log them in
        user = form.save()
        login(self.request, user, backend='apps.accounts.backends.EmailOrUsernameModelBackend')
        messages.success(self.request, _("Registration successful! Welcome to FeastFlow."))  
        return redirect(self.success_url)
    
    def form_invalid(self, form):
        """Handle invalid registration form submission."""
        logger.warning("Registration form errors: %s", form.errors)
        return super().form_invalid(form)
    

class ProfileView(LoginRequiredMixin, TemplateView):
    """View for displaying user profile"""
    template_name = 'accounts/profile.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # Get user's contributions
        contributions = user.contributions.select_related(
            'item__category__event'
        ).order_by('-created_at')[:5]
        
        # Get user's organized events
        organized_events = user.organized_events.all().order_by('-start_date')[:3] 
         
        context.update({
            'contributions': contributions,
            'organized_events': organized_events,
        })
        
        return context


class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    """View for updating user profile"""
    model = User
    form_class = ProfileUpdateForm
    template_name = 'accounts/profile_update.html'
    success_url = reverse_lazy('accounts:profile')
    
    def get_object(self, queryset=None):
        # Return the current user
        return self.request.user
    
    def form_valid(self, form):
        # Save the user and profile
        response = super().form_valid(form)
        messages.success(self.request, _("Profile updated successfully."))
        return response
        
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs.update({'files': self.request.FILES})
        return kwargs
    


@login_required
def dashboard(request):
    """Display user dashboard with events and contributions."""
    user = request.user

    # Get user's events with a single optimized query
    # Use a base queryset to avoid duplicate queries
    user_events_qs = Event.objects.filter(organizer=user)
    user_events = list(user_events_qs.order_by('-start_date')[:5])
    user_events_count = user_events_qs.count()

    # Get user's contributions with optimized query
    user_contributions_qs = Contribution.objects.filter(user=user)
    recent_contributions = list(
        user_contributions_qs.select_related(
            'item__category__event'
        ).order_by('-created_at')[:5]
    )
    user_contributions_count = user_contributions_qs.count()

    # Get upcoming events the user might like
    upcoming_events = Event.objects.filter(
        status='upcoming'
    ).exclude(organizer=user).order_by('start_date')[:3]

    # Build activity feed
    # Note: In production, consider using a dedicated Activity model
    activities = []

    # Add contribution activities (data already loaded via select_related)
    for contrib in recent_contributions:
        activities.append({
            'type': 'contribution',
            'description': (
                f'You contributed {contrib.quantity} {contrib.item.name} '
                f'to {contrib.item.category.event.name}'
            ),
            'timestamp': contrib.created_at,
        })

    # Add event creation activities
    for event in user_events[:2]:
        activities.append({
            'type': 'event_created',
            'description': f'You created the event {event.name}',
            'timestamp': event.created_at,
        })

    # Sort activities by timestamp
    activities = sorted(activities, key=lambda x: x['timestamp'], reverse=True)
    
    context = {
        'user_events': user_events,
        'user_events_count': user_events_count,
        'recent_contributions': recent_contributions,
        'user_contributions_count': user_contributions_count,
        'upcoming_events': upcoming_events,
        'activities': activities,
    }
    
    return render(request, 'accounts/dashboard.html', context)



class CustomPasswordResetView(PasswordResetView):
    template_name = 'accounts/password_reset.html'
    email_template_name = 'accounts/password_reset_email.html'
    subject_template_name = 'accounts/password_reset_subject.txt'
    success_url = reverse_lazy('accounts:password_reset_done')



class CustomPasswordResetDoneView(PasswordResetDoneView):
    template_name = 'accounts/password_reset_done.html'



class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'accounts/password_reset_confirm.html'
    success_url = reverse_lazy('accounts:password_reset_complete')



class CustomPasswordResetCompleteView(PasswordResetCompleteView):
    template_name = 'accounts/password_reset_complete.html'




class CustomLogoutView(LogoutView):
    """Custom logout view with confirmation page."""
    template_name = 'accounts/logout.html'
    next_page = reverse_lazy('core:home')
    http_method_names = ['get', 'post', 'head', 'options']  # Allow GET requests

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.info(request, _("You are not logged in."))
            return redirect(self.get_next_page())
        return self.render_to_response(context={})

    def post(self, request, *args, **kwargs):
        messages.success(request, _("You have been successfully logged out."))
        return super().post(request, *args, **kwargs)
