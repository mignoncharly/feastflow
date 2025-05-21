# apps/contributions/urls.py

from django.urls import path
from . import views

app_name = 'contributions'

urlpatterns = [
    path('item/<int:item_id>/', views.ContributeView.as_view(), name='contribute'),
    path('my-contributions/', views.UserContributionsView.as_view(), name='user_contributions'),    
]