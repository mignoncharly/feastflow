# config/settings/development.py

from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Additional development apps
INSTALLED_APPS += [
  #  'debug_toolbar',
]

# Additional middleware
MIDDLEWARE += [
   ## 'debug_toolbar.middleware.DebugToolbarMiddleware',
]

# Debug toolbar settings
INTERNAL_IPS = ['127.0.0.1']

# Simplified email settings for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'