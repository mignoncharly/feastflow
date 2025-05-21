# config/settings/pythonanywhere.py

from .production import *
import os

# Override specific settings for PythonAnywhere environment

# Update allowed hosts for PythonAnywhere domain
ALLOWED_HOSTS = [
    'mignoncity.pythonanywhere.com',  # Replace with your actual username
    os.environ.get('DOMAIN_NAME', 'feastflow.com'),
    'www.' + os.environ.get('DOMAIN_NAME', 'feastflow.com'),
]

# Disable SSL redirect on PythonAnywhere free tier (if applicable)
# If you have a paid account with HTTPS, keep this as True
SECURE_SSL_REDIRECT = False if os.environ.get('PYTHONANYWHERE_DOMAIN', '').endswith('.pythonanywhere.com') else True

# Database configuration for MySQL (PythonAnywhere provides MySQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'mignoncity$feastflow'),
        'USER': os.environ.get('DB_USER', 'mignoncity'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'Generator@!1'),
        'HOST': os.environ.get('DB_HOST', 'mignoncity.mysql.pythonanywhere-services.com'),
        'PORT': os.environ.get('DB_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# Static and Media file configuration
STATIC_ROOT = '/home/mignoncity/feastflow/staticfiles'
MEDIA_ROOT = '/home/mignoncity/feastflow/mediafiles'

# Simplify cache configuration if Redis isn't available
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/home/mignoncity/feastflow/logs/django-error.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}