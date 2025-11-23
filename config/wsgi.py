"""
WSGI config for FeastFlow project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/

Usage:
    - For local development: Set DJANGO_SETTINGS_MODULE=config.settings.settings_local
    - For PythonAnywhere: Set DJANGO_SETTINGS_MODULE=config.settings.settings_pythonanywhere

The settings module MUST be set via environment variable before this file is loaded.
"""

import os

from django.core.wsgi import get_wsgi_application

# Default to local settings if not specified
# In production (PythonAnywhere), set this in the WSGI configuration file
os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'config.settings.settings_local'
)

application = get_wsgi_application()
