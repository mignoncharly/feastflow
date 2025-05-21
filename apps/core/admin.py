# apps/core/admin.py

from django.contrib import admin

# Customize admin site
admin.site.site_header = 'FeastFlow Administration'
admin.site.site_title = 'FeastFlow Admin'
admin.site.index_title = 'Dashboard'

# Note: Do not register the Site model here as it's already registered