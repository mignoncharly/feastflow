from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.db.models import Count, Q
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from apps.events.models import TimeStampedModel, Event
from django.conf import settings



class User(AbstractUser):
    """Custom user model with email as username and role.""" 
    
    # Add user role choices
    ROLE_CHOICES = [
        ('organizer', _('Event Organizer')),
        ('contributor', _('Contributor')),
    ]
    
    email = models.EmailField(_('email address'), unique=True) 
    role = models.CharField(
        _('Role'),
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='contributor'
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the full name or username if not available."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def is_organizer(self):
        """Check if user is an event organizer."""
        return self.role == 'organizer'
    
    def is_contributor(self):
        """Check if user is a contributor."""
        return self.role == 'contributor'
    
    def total_contributions(self):
        """Get total number of contributions by user."""
        return self.contributions.count()

    def total_events(self):
        """Get total number of events user has contributed to."""
        return Event.objects.filter(
            categories__items__contributions__user=self
        ).distinct().count()

    def contribution_streak(self):
        """Calculate user's contribution streak in days."""
        from django.utils import timezone
        from datetime import timedelta
        
        contributions = self.contributions.order_by('-created_at')
        if not contributions:
            return 0
        
        streak = 1
        last_date = contributions[0].created_at.date()
        
        for contribution in contributions[1:]:
            contrib_date = contribution.created_at.date()
            if (last_date - contrib_date).days == 1:
                streak += 1
                last_date = contrib_date
            else:
                break
        return streak



class Profile(TimeStampedModel):
    """Extended user profile information."""
    user = models.OneToOneField(
        User, 
        verbose_name=_('User'),
        on_delete=models.CASCADE, 
        related_name='profile'
    )
    profile_picture = models.ImageField(
        _('Profile picture'),
        upload_to='profile_pics/', 
        default='profile_pics/default.png'
    )
    location = models.CharField(_('Location'), max_length=100, blank=True, null=True) 
    bio = models.TextField(_('Bio'), max_length=500, blank=True, null=True)
    language = models.CharField(
        _('Language'),
        max_length=10,
        choices=settings.LANGUAGES,
        default=settings.LANGUAGE_CODE,
        help_text=_('Preferred language for the interface')
    )
    
    # Contribution statistics
    contribution_streak = models.IntegerField(_('Contribution Streak'), default=0)
    last_contribution_date = models.DateField(_('Last Contribution Date'), null=True, blank=True)
    total_contributions = models.PositiveIntegerField(_('Total Contributions'), default=0)
    total_events = models.PositiveIntegerField(_('Total Events'), default=0)

    class Meta:
        verbose_name = _('Profile')
        verbose_name_plural = _('Profiles')
        
    def __str__(self):
        return f'{self.user.username} {_("Profile")}'
    
    def update_contribution_stats(self):
        """Update all contribution-related statistics for the user."""
        # Update total contributions count
        self.total_contributions = self.user.contributions.count()
        
        # Update total unique events participated in
        self.total_events = Event.objects.filter(
            categories__items__contributions__user=self.user
        ).distinct().count()
        
        # Update streak information
        today = timezone.now().date()
        
        # If this is the first contribution or contribution was made on a different day
        if not self.last_contribution_date or self.last_contribution_date != today:
            # If there was a previous contribution
            if self.last_contribution_date:
                # If the last contribution was yesterday, increase streak
                if (today - self.last_contribution_date).days == 1:
                    self.contribution_streak += 1
                # If the last contribution was more than a day ago, reset streak to 1
                elif (today - self.last_contribution_date).days > 1:
                    self.contribution_streak = 1
            else:
                # First contribution ever, set streak to 1
                self.contribution_streak = 1
                
            # Update the last contribution date to today
            self.last_contribution_date = today
        
        # Save the updated profile
        self.save(update_fields=['total_contributions', 'total_events', 
                                'contribution_streak', 'last_contribution_date'])



@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()