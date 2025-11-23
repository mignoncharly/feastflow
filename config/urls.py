# config/urls.py

from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # URLs that shouldn't have language prefix
    path('i18n/', include('django.conf.urls.i18n')),
    path('admin/', admin.site.urls),
]

# URLs with language prefix
urlpatterns += i18n_patterns(
    path('', include('apps.core.urls')),
    path('events/', include('apps.events.urls')),
    path('contributions/', include('apps.contributions.urls')),
    path('accounts/', include('apps.accounts.urls')),
    prefix_default_language=False,
)

# Serve media and static files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    # Debug toolbar (only if installed and in INSTALLED_APPS)
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns


handler404 = 'apps.core.views.handle_404'
handler500 = 'apps.core.views.handle_500'
handler403 = 'apps.core.views.handle_403'
