# apps/core/context_processors.py

from django.conf import settings

def settings_context(request):
    """Add useful settings variables to the template context."""
    return {
        'DEBUG': settings.DEBUG,
        'MEDIA_URL': settings.MEDIA_URL,
    }