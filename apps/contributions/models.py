from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

# Create a new TimeStampedModel class here instead of importing it
class TimeStampedModel(models.Model):
    """Abstract base model with created and modified timestamps.""" 
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)  
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    class Meta:
        abstract = True

class Contribution(TimeStampedModel):
    """Model for handling contributions per item.""" 
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        verbose_name=_('User'),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contributions'
    )
    # Use a string reference instead of direct import
    item = models.ForeignKey(
        'events.Item', 
        verbose_name=_('Item'),
        related_name='contributions', 
        on_delete=models.CASCADE
    )
    name = models.CharField(_('Name'), max_length=100)
    email = models.EmailField(_('Email'), blank=True, null=True)
    quantity = models.PositiveIntegerField(_('Quantity'), default=1)  
    comment = models.TextField(_('Comment'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('Contribution')
        verbose_name_plural = _('Contributions')
        ordering = ['-created_at']
        unique_together = ('user', 'item')
        
    def __str__(self):
        return f'{self.name} - {self.item.name} ({self.quantity})'
    
    def save(self, *args, **kwargs):
        """Auto-populate name/email for authenticated users and update stats""" 
        is_new = self.pk is None
        
        if self.user and self.user.is_authenticated:
            if not self.name:
                self.name = self.user.get_full_name() or self.user.username
            if not self.email and self.user.email:
                self.email = self.user.email
                    
        # Save the contribution
        super().save(*args, **kwargs)
        
        # Update event popularity if this is a new contribution
        if is_new:
            event = self.item.category.event
            event.popularity += 1
            event.save(update_fields=['popularity'])
            
            # Update user profile statistics
            if self.user and hasattr(self.user, 'profile'):
                self.user.profile.update_contribution_stats()