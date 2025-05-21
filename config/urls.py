# config/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from django.utils.translation import gettext_lazy as _
import debug_toolbar


urlpatterns = [
    # URLs that shouldn't have language prefix
    path('i18n/', include('django.conf.urls.i18n')),
    path('admin/', admin.site.urls),
    # Add other non-i18n URLs here
]

# URLs with language prefix
urlpatterns += i18n_patterns(
    path('', include('apps.core.urls')),
    path('events/', include('apps.events.urls')),
    path('contributions/', include('apps.contributions.urls')),
    path('accounts/', include('apps.accounts.urls')),
    # Add other i18n URLs here
    prefix_default_language=False,  # Don't add prefix for default language
)

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    path('__debug__/', include(debug_toolbar.urls)),


handler404 = 'apps.core.views.handle_404'
handler500 = 'apps.core.views.handle_500'
handler403 = 'apps.core.views.handle_403'