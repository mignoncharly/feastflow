# apps/contributions/admin.py

from django.contrib import admin
from .models import Contribution

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ('name', 'item', 'quantity', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'comment', 'item__name')
    date_hierarchy = 'created_at'