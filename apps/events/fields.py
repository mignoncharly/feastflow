# apps/events/fields.py

from django import forms
from django.utils.translation import gettext_lazy as _
from .widgets import GalleryImageWidget, GalleryTabsWidget


class PredefinedImageField(forms.ModelChoiceField):
    """Custom form field for selecting predefined images."""
    
    def __init__(self, *args, **kwargs):
        from .models import PredefinedImage
        
        # Get image type and whether to use tabs
        self.image_type = kwargs.pop('image_type', 'all')
        use_tabs = kwargs.pop('use_tabs', True)
        
        # Set widget based on tabs preference
        if 'widget' not in kwargs:
            widget_class = GalleryTabsWidget if use_tabs else GalleryImageWidget
            kwargs['widget'] = widget_class(attrs={'class': 'image-selection-radio'}, 
                                          image_type=self.image_type)
        
        # Set queryset based on image type
        if 'queryset' not in kwargs:
            if self.image_type == 'all':
                kwargs['queryset'] = PredefinedImage.objects.filter(is_active=True)
            else:
                kwargs['queryset'] = PredefinedImage.objects.filter(
                    image_type__in=[self.image_type, 'all'], 
                    is_active=True
                )
        
        # Set empty label
        if 'empty_label' not in kwargs:
            kwargs['empty_label'] = _("Upload your own image")
        
        # Set required to False by default
        if 'required' not in kwargs:
            kwargs['required'] = False
        
        # Set label
        if 'label' not in kwargs:
            kwargs['label'] = _("Select from gallery")
        
        super().__init__(*args, **kwargs)
        
    def label_from_instance(self, obj):
        """Custom label for each option."""
        return obj.name