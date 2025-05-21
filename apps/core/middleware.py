from django.conf import settings
from django.utils import translation
from django.urls import resolve, reverse
from django.http import HttpResponseRedirect



class UserLanguageMiddleware:
    """
    Middleware to set language based on user preferences or session
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __process_request(self, request):
        # Check if user is authenticated and has language preference
        if hasattr(request, 'user') and request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.language:
            user_language = request.user.profile.language
            current_language = translation.get_language()
            
            # Set language only if it differs from current
            if user_language != current_language:
                translation.activate(user_language)
                request.LANGUAGE_CODE = user_language

    def __call__(self, request):
        self.__process_request(request)
        response = self.get_response(request)
        return response