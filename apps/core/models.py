# apps/core/models.py
"""
Core models for the FeastFlow application.

This module contains base models and mixins that are shared across
multiple apps in the project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    """
    Abstract base model with created and modified timestamps.

    This model provides automatic tracking of when records are created
    and last modified. All models that need this functionality should
    inherit from this class.

    Attributes:
        created_at: DateTime when the record was created (auto-set on creation).
        updated_at: DateTime when the record was last modified (auto-updated).
    """

    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    class Meta:
        abstract = True
