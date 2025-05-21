# apps/events/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import Event, Category, Item, PredefinedImage
# At the top of your admin.py file, add:
from django.utils.translation import gettext_lazy as _



@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'status', 'popularity')
    list_filter = ('status', 'start_date')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    date_hierarchy = 'start_date'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'event')
    list_filter = ('event',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}



@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'required_quantity', 'image_preview')
    list_filter = ('category__event', 'category')
    search_fields = ('name', 'comments')

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: auto;" />', obj.image.url)
        return "-"
    image_preview.short_description = 'Image'


@admin.register(PredefinedImage)
class PredefinedImageAdmin(admin.ModelAdmin):
    list_display = ('name', 'image_type', 'is_active', 'display_image')
    list_filter = ('image_type', 'is_active')
    search_fields = ('name',)
    
    def display_image(self, obj):
        """Display a thumbnail of the image."""
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return "-"
    display_image.short_description = _('Thumbnail')