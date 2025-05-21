# apps/events/templatetags/event_tags.py

from django import template
from django.utils.safestring import mark_safe
from ..models import PredefinedImage

register = template.Library()

@register.filter
def get_predefined_image(image_id):
    """Get a PredefinedImage object by its ID."""
    try:
        return PredefinedImage.objects.get(id=image_id)
    except (PredefinedImage.DoesNotExist, ValueError):
        return None

@register.filter
def folder_name(image_type):
    """Get a human-readable folder name for an image type."""
    if image_type == 'event':
        return 'Events'
    elif image_type == 'category':
        return 'Categories'
    elif image_type == 'item':
        return 'Items'
    else:
        return 'General'

@register.simple_tag
def image_count(queryset, image_type):
    """Count images of a specific type in a queryset."""
    return queryset.filter(image_type=image_type).count()

@register.inclusion_tag('events/tags/image_gallery.html')
def render_image_gallery(predefined_images, selected_id=None):
    """Render a gallery of predefined images."""
    return {
        'predefined_images': predefined_images,
        'selected_id': selected_id
    }