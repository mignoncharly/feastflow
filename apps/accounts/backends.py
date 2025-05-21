# apps/accounts/backends.py
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Authentication backend that allows users to log in with either username or email
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Check if the provided credential is an email or username
        try:
            # Try to find a user that matches either username or email
            user = User.objects.get(Q(username=username) | Q(email=username))
            
            # Check the password
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            # No user found with that username or email
            return None
        
        # Password didn't match
        return None