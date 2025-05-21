
# apps/events/urls.py

from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('', views.EventListView.as_view(), name='event_list'),
    path('create/', views.EventCreateView.as_view(), name='event_create'),
    path('<slug:slug>/', views.EventDetailView.as_view(), name='event_detail'),
    path('<slug:slug>/edit/', views.EventUpdateView.as_view(), name='event_update'),
    path('<slug:event_slug>/categories/create/', views.CategoryCreateView.as_view(), name='category_create'),
    path('<slug:event_slug>/categories/<slug:category_slug>/', views.CategoryDetailView.as_view(), name='category_detail'),
    path('<slug:event_slug>/categories/<slug:category_slug>/edit/', views.CategoryUpdateView.as_view(), name='category_update'),  # Added CategoryUpdateView
    path('<slug:event_slug>/categories/<slug:category_slug>/items/create/', views.ItemCreateView.as_view(), name='item_create'),
    path('<slug:event_slug>/categories/<slug:category_slug>/items/<int:item_id>/edit/', views.ItemUpdateView.as_view(), name='item_update'),  # Added ItemUpdateView
    
    # Add contribution link routes
    path('<slug:slug>/generate-link/', views.GenerateContributionLinkView.as_view(), name='generate_link'),
    path('contribute/<uuid:code>/', views.ContributionLinkDetailView.as_view(), name='contribution_link'),  

    path('<slug:slug>/verify-access/', views.VerifyAccessCodeView.as_view(), name='verify_access'), 

    path('<slug:slug>/contributors/', views.EventContributorSummaryView.as_view(), name='event_contributors'),  
]