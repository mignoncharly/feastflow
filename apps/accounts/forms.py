# apps/accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from .models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate



class CustomAuthenticationForm(AuthenticationForm):
    """Custom authentication form that supports login with either username or email"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].label = _("Username or Email")
        self.fields['username'].widget.attrs.update({'placeholder': _("Enter your username or email")})
        
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if username is not None and password:
            # Use Django's authenticate function instead of self.authenticate
            self.user_cache = authenticate(self.request, username=username, password=password)
            if self.user_cache is None:
                raise self.get_invalid_login_error()
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data



class UserRegistrationForm(UserCreationForm):
    """Extended user registration form with email and role"""
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False) 
    role = forms.ChoiceField(
        choices=User.ROLE_CHOICES,
        required=True,
        widget=forms.RadioSelect,
        initial='contributor',
        label=_("Account Type")
    )
    terms_agreed = forms.BooleanField(
        required=True,
        error_messages={'required': _('You must agree to the Terms of Service and Privacy Policy')}
    )
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'role', 'password1', 'password2', 'terms_agreed')
    

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError(_("A user with that email already exists."))
        return email
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add help text for role selection
        self.fields['role'].help_text = _(
            "Choose your account type. Event Organizers can create and manage events. "
            "Contributors can only participate in events."
        )



class ProfileUpdateForm(forms.ModelForm):
    """Form for updating user profile"""
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    profile_picture = forms.ImageField(
        required=False,
        widget=forms.FileInput(attrs={'class': 'form-control'}),
        help_text=_("Upload a profile picture (optional)")
    )
    bio = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4}),
        required=False,
        max_length=500,
        help_text=_("Tell others a bit about yourself")
    )
    location = forms.CharField(max_length=100, required=False)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If user has a profile, populate profile fields
        if hasattr(self.instance, 'profile'):
            self.fields['profile_picture'].initial = self.instance.profile.profile_picture 
            self.fields['bio'].initial = self.instance.profile.bio
            self.fields['location'].initial = self.instance.profile.location
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        user_id = self.instance.id
        
        if User.objects.filter(email=email).exclude(id=user_id).exists():
            raise ValidationError(_("A user with that email already exists."))
        return email
    
    def save(self, commit=True):
        user = super().save(commit=commit)
        
        # Update profile fields
        if hasattr(user, 'profile'):
            profile = user.profile
            if 'profile_picture' in self.cleaned_data and self.cleaned_data['profile_picture']:
                profile.profile_picture = self.cleaned_data['profile_picture']
            if 'bio' in self.cleaned_data:
                profile.bio = self.cleaned_data['bio']
            if 'location' in self.cleaned_data:
                profile.location = self.cleaned_data['location']
            
            if commit:
                profile.save()
                
        return user