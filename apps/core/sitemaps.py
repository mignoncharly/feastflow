# apps/core/sitemaps.py

from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from apps.events.models import Event, Category

class StaticViewSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return ['core:home', 'core:about', 'core:contact', 'events:event_list']

    def location(self, item):
        return reverse(item)

class EventSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.7

    def items(self):
        return Event.objects.all()

    def lastmod(self, obj):
        return obj.updated_at

class CategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6

    def items(self):
        return Category.objects.all()

    def lastmod(self, obj):
        return obj.updated_at