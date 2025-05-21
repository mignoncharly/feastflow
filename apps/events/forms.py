# apps/events/forms.py
from django import forms
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify

from .models import Event, Category, Item, ContributionLink, PredefinedImage
from .fields import PredefinedImageField


class EventForm(forms.ModelForm): 
    """Form for creating and updating events."""
    # Use the custom field for predefined images
    predefined_image = PredefinedImageField(
        image_type='event',
        label=_("Select from gallery"),
        required=False,
        use_tabs=True
    )
    
    class Meta:
        model = Event
        fields = [
            'name', 'description', 'event_type', 'start_date', 'end_date', 
            'start_time', 'end_time', 'image', 'predefined_image', 'access_mode', 'access_code', 'timezone', 'location'  
        ]
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
            'start_time': forms.TimeInput(attrs={'type': 'time'}),
            'end_time': forms.TimeInput(attrs={'type': 'time'}),
            'description': forms.Textarea(attrs={'rows': 5}),
            'access_code': forms.TextInput(attrs={'placeholder': _('Leave blank to auto-generate')}),
            'image': forms.FileInput(attrs={'class': 'custom-file-input', 'id': 'event-image-upload'}),
            'event_type': forms.Select(attrs={'class': 'form-control'})
        }
        help_texts = {
            'event_type': _('Select the type of event you are organizing'),
            'access_mode': _('Choose who can contribute to this event'),
            'access_code': _('Required if "Code Required" is selected. Leave blank to auto-generate.'),
            'image': _('Upload your own image or select from gallery below')
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Add Bootstrap classes
        for field_name, field in self.fields.items():
            if field_name not in ['image', 'predefined_image']:  # Skip file input and radio buttons
                field.widget.attrs.update({'class': 'form-control'})
        
        # Add dependency: Show/hide access code field based on access mode
        self.fields['access_mode'].widget.attrs.update({
            'class': 'form-control',
            'id': 'access_mode_field',
            'onchange': 'toggleAccessCodeField()'
        })
        
        self.fields['access_code'].widget.attrs.update({
            'id': 'access_code_field'
        })
        
        # If we have an instance with an image, don't require the image field
        if self.instance and self.instance.pk and self.instance.image:
            self.fields['image'].required = False
    
    def clean(self):
        cleaned_data = super().clean()
        access_mode = cleaned_data.get('access_mode')
        access_code = cleaned_data.get('access_code')
        
        # Check for either uploaded image or predefined image
        image = cleaned_data.get('image')
        predefined_image = cleaned_data.get('predefined_image')
        
        # If predefined image is selected, use that instead of uploaded image
        if predefined_image and not self.instance.image:
            # We'll handle this in the view by copying the predefined image
            pass
            
        # Ensure end date is after start date
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')
        if start_date and end_date and end_date < start_date:
            self.add_error('end_date', _('End date must be after start date'))
        
        # Validate access code if mode is 'code'
        if access_mode == 'code':
            # If access_code is empty, it will be auto-generated in the model save method
            if access_code and len(access_code) < 4:
                self.add_error('access_code', _('Access code must be at least 4 characters'))
        
        return cleaned_data
        
    def clean_slug(self):
        slug = self.cleaned_data.get('slug')
        name = self.cleaned_data.get('name', '')
        
        # Generate slug from name if not provided
        if not slug and name:
            slug = slugify(name)
            
        return slug



class CategoryForm(forms.ModelForm):
    """Form for creating/editing categories."""
    # Use the custom field for predefined images
    predefined_image = PredefinedImageField(
        image_type='category',
        label=_("Select from gallery"),
        required=False,
        use_tabs=True
    )
    
    class Meta:
        model = Category
        fields = ['name', 'category_type', 'slug', 'description', 'image', 'predefined_image']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'slug': forms.TextInput(attrs={'placeholder': _('URL-friendly name (leave empty to auto-generate)')}),
            'image': forms.FileInput(attrs={'class': 'custom-file-input', 'id': 'category-image-upload'}),
            'category_type': forms.Select(attrs={'class': 'form-control'})
        }
        help_texts = {
            'category_type': _('Select the type of category you are creating'),
            'image': _('Upload your own image or select from gallery below')
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make slug optional
        self.fields['slug'].required = False
        
        # Add Bootstrap classes
        for field_name, field in self.fields.items():
            if field_name not in ['image', 'predefined_image']:  # Skip file input and radio buttons
                if isinstance(field.widget, (forms.TextInput, forms.EmailInput, forms.Select)):
                    field.widget.attrs.update({'class': 'form-control'})
                elif isinstance(field.widget, forms.Textarea):
                    field.widget.attrs.update({'class': 'form-control', 'rows': 3})
        
        # If we have an instance with an image, don't require the image field
        if self.instance and self.instance.pk and self.instance.image:
            self.fields['image'].required = False
    
    def clean(self):
        cleaned_data = super().clean()
        # We'll handle the predefined image in the view
        return cleaned_data
    
    

class ItemForm(forms.ModelForm):
    """Form for creating/editing items."""
    # Use the custom field for predefined images
    predefined_image = PredefinedImageField(
        image_type='item',
        label=_("Select from gallery"),
        required=False,
        use_tabs=True
    )
    
    class Meta:
        model = Item
        fields = ['name', 'required_quantity', 'comments', 'image', 'predefined_image']
        widgets = {
            'comments': forms.Textarea(attrs={'rows': 3}),
            'image': forms.FileInput(attrs={'class': 'custom-file-input', 'id': 'item-image-upload'})
        }
        help_texts = {
            'image': _('Upload your own image or select from gallery below')
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Add Bootstrap classes
        for field_name, field in self.fields.items():
            if field_name not in ['image', 'predefined_image']:  # Skip file input and radio buttons
                if isinstance(field.widget, (forms.TextInput, forms.NumberInput, forms.Select)):
                    field.widget.attrs.update({'class': 'form-control'})
                elif isinstance(field.widget, forms.Textarea):
                    field.widget.attrs.update({'class': 'form-control', 'rows': 3})
        
        # If we have an instance with an image, don't require the image field
        if self.instance and self.instance.pk and self.instance.image:
            self.fields['image'].required = False
    
    def clean_required_quantity(self):
        quantity = self.cleaned_data.get('required_quantity')
        if quantity <= 0:
            raise forms.ValidationError(_("Quantity must be greater than zero."))
        return quantity
    
    def clean(self):
        cleaned_data = super().clean()
        # We'll handle the predefined image in the view
        return cleaned_data


class ContributionLinkForm(forms.ModelForm):
    """Form for creating contribution links."""
    class Meta:
        model = ContributionLink
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': _('Optional: Name this link (e.g. "Facebook friends", "Email")')
            }),
        }


class AccessCodeForm(forms.Form):
    """Form for validating event access codes."""
    access_code = forms.CharField(
        label=_('Access Code'),
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': _('Enter access code'),
            'autocomplete': 'off'
        })
    )
    
    def __init__(self, *args, event=None, **kwargs):
        self.event = event
        super().__init__(*args, **kwargs)
    
    def clean_access_code(self):
        access_code = self.cleaned_data.get('access_code')
        
        if not self.event:
            raise forms.ValidationError(_("Event not found"))
        
        if not self.event.is_code_required():
            raise forms.ValidationError(_("This event does not require an access code"))
        
        if not self.event.check_access_code(access_code):
            raise forms.ValidationError(_("Invalid access code"))
        
        return access_code