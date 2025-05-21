# apps/contributions/forms.py
from django import forms
from django.utils.translation import gettext_lazy as _
from .models import Contribution

class ContributionForm(forms.ModelForm):
    """Form for making contributions."""
    class Meta:
        model = Contribution
        fields = ['name', 'email', 'quantity', 'comment']
        widgets = {
            'comment': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': _('Any additional information...')  
            }),
            'name': forms.TextInput(attrs={
                'placeholder': _('Your name')
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': _('your@email.com')
            }),
            'quantity': forms.NumberInput(attrs={'min': 1}), 
        }

    def __init__(self, *args, **kwargs):
        self.item = kwargs.pop('item', None)
        self.user = kwargs.pop('user', None)
        # New parameter to check if user has valid access via link/code
        self.has_valid_access = kwargs.pop('has_valid_access', False)
        super().__init__(*args, **kwargs)

        if self.user and self.user.is_authenticated:
            # Remove fields for authenticated users
            del self.fields['name']
            del self.fields['email']
            
            # Set initial values from user
            self.initial['name'] = self.user.get_full_name() or self.user.username
            self.initial['email'] = self.user.email
        else:
            # Make name field required for anonymous users
            self.fields['name'].required = True
            
            # Only require email if the user doesn't have valid access
            self.fields['email'].required = not self.has_valid_access
            
            # Change the email field placeholder if it's optional
            if not self.fields['email'].required:
                self.fields['email'].widget.attrs['placeholder'] = _('Optional: your@email.com')

        # Add Bootstrap classes
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})

    def clean_quantity(self):
        quantity = self.cleaned_data.get('quantity')
        if quantity <= 0:
            raise forms.ValidationError(_("Quantity must be greater than zero."))
        return quantity

    def clean(self):
        cleaned_data = super().clean()
        # For authenticated users, auto-fill name/email
        if self.user and self.user.is_authenticated:
            cleaned_data['name'] = self.user.get_full_name() or self.user.username
            cleaned_data['email'] = self.user.email
        return cleaned_data