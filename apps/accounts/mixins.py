# apps/accounts/mixins.py

from django.contrib.auth.mixins import UserPassesTestMixin
from django.shortcuts import redirect
from django.contrib import messages
from django.utils.translation import gettext_lazy as _

class OrganizerRequiredMixin(UserPassesTestMixin):
    """Mixin to restrict views to event organizer users only."""
    
    permission_denied_message = _("You must be an Event Organizer to access this page.")
    
    def test_func(self):
        # Check if user is authenticated and is an organizer
        return self.request.user.is_authenticated and self.request.user.is_organizer()
    
    def handle_no_permission(self):
        messages.error(self.request, self.permission_denied_message) 
        return redirect('core:home') 