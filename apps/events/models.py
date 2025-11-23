# apps/events/models.py
import logging
import uuid

from django.conf import settings
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from timezone_field import TimeZoneField

from apps.core.models import TimeStampedModel

logger = logging.getLogger(__name__)


class Event(TimeStampedModel):
    """Events that users can contribute to."""
    STATUS_CHOICES = [
        ('ongoing', _('Ongoing')),
        ('upcoming', _('Upcoming')),
        ('completed', _('Completed')),
    ]
    
    ACCESS_MODE_CHOICES = [
        ('public', _('Public - Anyone can contribute')),
        ('code', _('Code Required - Require an access code to contribute')),
        ('invite', _('Invite Only - Only people with invite links can contribute')), 
    ]
    
    EVENT_TYPE_CHOICES = [
        ('association', _('Association')),
        ('grill_bbq', _('Grill/BBQ')),
        ('church', _('Church Community')),
        ('wedding', _('Wedding')),
        ('birthday', _('Birthday')),
        ('corporate', _('Corporate Event')),
    ]
    
    name = models.CharField(_('Name'), max_length=200)
    slug = models.SlugField(_('Slug'), unique=True, max_length=200)
    description = models.TextField(_('Description'))
    start_date = models.DateField(_('Start date'))
    end_date = models.DateField(_('End date'))
    start_time = models.TimeField(_('Start time'), default='00:00')
    end_time = models.TimeField(_('End time'), default='23:59')
    image = models.ImageField(_('Image'), upload_to='event_images/', blank=True, null=True)
    location = models.CharField(_('Location'), max_length=200, blank=True)
    timezone = TimeZoneField(_('Timezone'), default='UTC')
    event_type = models.CharField(
        _('Event Type'),
        max_length=20,
        choices=EVENT_TYPE_CHOICES,
        default='association',
    )
    status = models.CharField(
        _('Status'),
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='upcoming'
    )
    popularity = models.PositiveIntegerField(_('Popularity'), default=0)
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_('Organizer'),
        on_delete=models.CASCADE,
        related_name='organized_events'
    )
    
    access_mode = models.CharField(
        _('Access Mode'),
        max_length=10,
        choices=ACCESS_MODE_CHOICES,
        default='public',
        help_text=_('Control who can contribute to this event')
    )
    access_code = models.CharField(
        _('Access Code'),
        max_length=20,
        blank=True,
        help_text=_('Access code required to contribute to this event')
    )
    
    class Meta:
        verbose_name = _('Event')
        verbose_name_plural = _('Events')
        ordering = ['start_date', 'name']
        indexes = [
            models.Index(fields=['status', 'start_date']),
        ]
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('events:event_detail', kwargs={'slug': self.slug})
    
    def save(self, *args, **kwargs):
        """Update event status, generate slug if needed, and create access code if needed."""
        # Update status based on dates
        self.update_status()
        
        # Generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.name)
        
        # Generate access code if mode is 'code' and no code exists
        if self.access_mode == 'code' and not self.access_code:
            self.access_code = self.generate_access_code()
            
        super().save(*args, **kwargs)
    
    def update_status(self):
        """Update event status based on current date."""
        today = timezone.now().date()
        
        if self.end_date < today:
            self.status = 'completed'
        elif self.start_date <= today <= self.end_date:
            self.status = 'ongoing'
        else:
            self.status = 'upcoming'
    
    def is_ongoing(self):
        """Check if event is currently active."""
        today = timezone.now().date()
        now = timezone.now().time()
        
        if self.start_date < today < self.end_date:
            return True
        elif self.start_date == today and now >= self.start_time:
            return True
        elif self.end_date == today and now <= self.end_time:
            return True
        return False
    
    def get_event_duration(self):
        """Calculate and return event duration in days/hours format."""
        from datetime import datetime, timedelta
        
        start_datetime = datetime.combine(self.start_date, self.start_time) 
        end_datetime = datetime.combine(self.end_date, self.end_time)
        duration = end_datetime - start_datetime
        
        days, seconds = duration.days, duration.seconds
        hours = seconds // 3600
        
        if days > 0:
            return _("{days} days, {hours} hours").format(days=days, hours=hours)
        else:
            return _("{hours} hours").format(hours=hours)
    
    @classmethod
    def get_featured_events(cls, limit=3):
        """Get featured events for homepage."""
        return cls.objects.filter(status='ongoing').order_by('-popularity')[:limit]

    @classmethod
    def get_upcoming_events(cls, limit=3):
        """Get upcoming events for homepage."""
        return cls.objects.filter(status='upcoming').order_by('start_date')[:limit]
    
    def is_public(self):
        """Check if event is open for public contributions."""
        return self.access_mode == 'public'
    
    def is_invite_only(self):
        """Check if event is invite-only."""
        return self.access_mode == 'invite'
    
    def is_code_required(self):
        """Check if event requires an access code."""
        return self.access_mode == 'code'
    
    def generate_access_code(self):
        """Generate a random access code for the event."""
        # Create a random alphanumeric code (6 characters)
        return get_random_string(6).upper()
    
    def check_access_code(self, code):
        """Verify if the provided access code is valid."""
        return self.access_mode == 'code' and self.access_code == code
    
    def can_user_contribute(self, user, session=None, access_code=None): 
        """
        Check if the user can contribute to this event.
        
        Args:
            user: The user trying to contribute
            session: The current session object (to check for invite access)
            access_code: An access code provided by the user
            
        Returns:
            bool: True if the user can contribute, False otherwise
        """
        # Organizers can always contribute to their own events
        if user and user.is_authenticated and user == self.organizer:
            return True
            
        # Public events are open to everyone
        if self.is_public():
            return True
            
        # Check access code
        if self.is_code_required() and access_code and self.check_access_code(access_code):  
            return True
            
        # Check session for invite link access
        if session and session.get(f'event_access_{self.id}') == True:
            return True
            
        return False

    def get_total_contributors(self):
        """Get the total number of unique contributors to this event."""
        from django.db.models import Count
        # Import locally to avoid circular imports
        from apps.contributions.models import Contribution
        
        # Count registered users
        registered_count = Contribution.objects.filter(
            item__category__event=self,
            user__isnull=False
        ).values('user').distinct().count()
        
        # Count anonymous users
        anonymous_count = Contribution.objects.filter(
            item__category__event=self,
            user__isnull=True
        ).values('name', 'email').distinct().count()
        
        return registered_count + anonymous_count



class Category(TimeStampedModel):
    """Categories under a specific Event."""
    CATEGORY_TYPE_CHOICES = [
        ('side_dish', _('Side Dish')),
        ('cutlery', _('Cutlery')),
        ('dessert', _('Dessert')),
        ('meat', _('Meat')),
        ('fruits', _('Fruits')),
        ('vegetables', _('Vegetables')),
        ('drinks', _('Drinks')),
        ('grill_accessories', _('Grill Accessories')),
        ('good_vibes', _('Good Vibes')),
        ('salad', _('Salad')),
        ('sauce', _('Sauce')),
    ]
    
    event = models.ForeignKey(
        Event, 
        verbose_name=_('Event'),
        on_delete=models.CASCADE, 
        related_name='categories'
    )
    name = models.CharField(_('Name'), max_length=100)
    slug = models.SlugField(_('Slug'), max_length=100)
    description = models.TextField(_('Description'), blank=True, null=True)
    image = models.ImageField(_('Image'), upload_to='category_images/', blank=True, null=True)
    category_type = models.CharField(
        _('Category Type'),
        max_length=20,
        choices=CATEGORY_TYPE_CHOICES,
        default='side_dish',
    )
    
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'slug'],
                name='unique_event_category_slug',
            ),
        ]
        
    def __str__(self):
        return f'{self.event.name} - {self.name}'
    
    def get_absolute_url(self):
        return reverse('events:category_detail', kwargs={
            'event_slug': self.event.slug,
            'category_slug': self.slug
        })
    
    def save(self, *args, **kwargs):
        """Generate slug if needed."""
        if not self.slug:
            self.slug = slugify(self.name)
            
        super().save(*args, **kwargs)



class Item(TimeStampedModel):
    """Items needed under a Category."""
    category = models.ForeignKey(
        Category, 
        verbose_name=_('Category'),
        on_delete=models.CASCADE, 
        related_name='items'
    )
    name = models.CharField(_('Name'), max_length=100)
    required_quantity = models.PositiveIntegerField(_('Required quantity'), default=1) 
    comments = models.TextField(_('Comments'), blank=True, null=True)
    image = models.ImageField(_('Image'), upload_to='item_images/', blank=True, null=True)  
    
    class Meta:
        verbose_name = _('Item')
        verbose_name_plural = _('Items')
        ordering = ['name']
        
    def __str__(self):
        return f'{self.category.name} - {self.name}'
    
    def get_absolute_url(self):
        return reverse('contributions:contribute', kwargs={'item_id': self.id})
    
    def get_contributed_quantity(self):
        """Get total quantity contributed by volunteers."""
        # Don't use caching to ensure we always get the latest data
        from django.db.models import Sum
        result = self.contributions.aggregate(
            total=Sum('quantity')
        )['total'] or 0
        return result

    def is_fulfilled(self):
        """Check if required quantity has been met."""
        return self.get_contributed_quantity() >= self.required_quantity
        
    def get_fulfillment_percentage(self):
        """Calculate the percentage of fulfillment for this item."""
        contributed = self.get_contributed_quantity()
        required = self.required_quantity
        
        if required <= 0:
            return 100
            
        percentage = min(100, int((contributed / required) * 100))
        return percentage


class ContributionLink(TimeStampedModel):
    """Shareable link for event contributions."""
    event = models.ForeignKey(
        Event, 
        verbose_name=_('Event'),
        on_delete=models.CASCADE, 
        related_name='contribution_links'
    )
    code = models.UUIDField(
        _('Code'),
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    name = models.CharField(_('Name'), max_length=100, blank=True) 
    is_active = models.BooleanField(_('Active'), default=True)
    
    class Meta:
        verbose_name = _('Contribution Link')
        verbose_name_plural = _('Contribution Links')
        
    def __str__(self):
        return f"{self.event.name} - {self.name or self.code}"
    
    def get_absolute_url(self):
        """Get the shareable URL for this link."""
        return reverse('events:contribution_link', kwargs={'code': self.code})
    
    def get_full_url(self, request=None):
        """Get the full URL including domain."""
        if request:
            return request.build_absolute_uri(self.get_absolute_url()) 
        return self.get_absolute_url()
    
    @classmethod
    def generate_for_event(cls, event, name=''):
        """Generate a new contribution link for an event."""
        return cls.objects.create(event=event, name=name)



def predefined_image_upload_path(instance, filename):
    """Generate upload path for predefined images based on type."""
    if instance.image_type == 'event':
        return f'predefined_images/events/{filename}'
    elif instance.image_type == 'category':
        return f'predefined_images/categories/{filename}'
    elif instance.image_type == 'item':
        return f'predefined_images/items/{filename}'
    else:
        return f'predefined_images/general/{filename}'


class PredefinedImage(TimeStampedModel):
    """Predefined images that can be used in events, categories, and items.""" 
    TYPE_CHOICES = [
        ('event', _('Event')),
        ('category', _('Category')),
        ('item', _('Item')),
        ('all', _('All Types')),
    ]
    
    name = models.CharField(_('Name'), max_length=100)
    image = models.ImageField(_('Image'), upload_to=predefined_image_upload_path)
    image_type = models.CharField(
        _('Image Type'),
        max_length=10,
        choices=TYPE_CHOICES,
        default='all',
        help_text=_('Type of content this image can be used for')
    )
    is_active = models.BooleanField(_('Active'), default=True)
    
    class Meta:
        verbose_name = _('Predefined Image')
        verbose_name_plural = _('Predefined Images')
        ordering = ['name']
        
    def __str__(self):
        return self.name
        
    def get_thumbnail_url(self):
        """Get thumbnail URL for this image."""
        # Using sorl-thumbnail if available
        try:
            from sorl.thumbnail import get_thumbnail

            return get_thumbnail(
                self.image, '150x150', crop='center', quality=85
            ).url
        except ImportError:
            # sorl-thumbnail not installed
            return self.image.url
        except (IOError, OSError, ValueError) as e:
            # Image file issues (missing file, invalid format, etc.)
            import logging

            logger = logging.getLogger(__name__)
            logger.warning(
                "Failed to generate thumbnail for PredefinedImage %s: %s",
                self.pk,
                e
            )
            return self.image.url
    
    def get_folder_name(self):
        """Get the folder name for this image type."""
        if self.image_type == 'event':
            return _('Events')
        elif self.image_type == 'category':
            return _('Categories')
        elif self.image_type == 'item':
            return _('Items')
        else:
            return _('General')
