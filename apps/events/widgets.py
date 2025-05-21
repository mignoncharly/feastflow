# apps/events/widgets.py

from django import forms
from django.utils.translation import gettext_lazy as _
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.forms.widgets import RadioSelect


class GalleryImageWidget(RadioSelect):
    """Custom widget for selecting images from a gallery."""
    template_name = 'events/widgets/gallery_image_widget.html'
    option_template_name = 'events/widgets/gallery_image_option.html'
    
    def __init__(self, attrs=None, image_type='all'):
        super().__init__(attrs)
        self.image_type = image_type
    
    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['widget']['image_type'] = self.image_type
        
        # Group options by folder
        grouped_options = {'all': [], 'event': [], 'category': [], 'item': []}
        
        for group, options, index in context['widget']['optgroups']:
            for option in options:
                # Skip empty option (for "Upload your own")
                if not option['value']:
                    continue
                
                # Get image type from the value (would come from the queryset)
                try:
                    from .models import PredefinedImage
                    image = PredefinedImage.objects.get(id=option['value'])
                    image_type = image.image_type
                    option['image'] = image
                    
                    # Add to appropriate group
                    if image_type == 'all':
                        grouped_options['all'].append(option)
                    else:
                        grouped_options[image_type].append(option)
                        
                except Exception:
                    # If error, just add to all
                    grouped_options['all'].append(option)
        
        context['widget']['grouped_options'] = grouped_options
        context['widget']['has_folders'] = any(len(opts) > 0 for folder, opts in grouped_options.items() if folder != 'all')
        
        return context


class GalleryTabsWidget(GalleryImageWidget):
    """Widget with tabs for different image categories."""
    template_name = 'events/widgets/gallery_tabs_widget.html'
    
    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        
        # Add folder information
        context['widget']['folders'] = [
            {'id': 'all', 'name': _('All Images')},
            {'id': 'event', 'name': _('Event Images')},
            {'id': 'category', 'name': _('Category Images')},
            {'id': 'item', 'name': _('Item Images')}
        ]
        
        # Count images in each folder
        for folder in context['widget']['folders']:
            folder_id = folder['id']
            if folder_id in context['widget']['grouped_options']:
                folder['count'] = len(context['widget']['grouped_options'][folder_id])
            else:
                folder['count'] = 0
        
        return context