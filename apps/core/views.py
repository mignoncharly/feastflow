# apps/core/views

from django.db import models
from django.shortcuts import render
from django.views.generic import TemplateView, ListView
from django.contrib.sitemaps.views import sitemap
from django.urls import reverse
from .sitemaps import StaticViewSitemap, EventSitemap, CategorySitemap
from apps.events.models import Event
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger



class HomeView(ListView):
    template_name = 'core/home.html'
    context_object_name = 'ongoing_events'
    paginate_by = 6  # Show 6 events per page (2 rows of 3)
    
    def get_queryset(self):
        return Event.get_featured_events()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Get upcoming events
        upcoming_events = Event.get_upcoming_events()
        
        # Paginate upcoming events
        paginator = Paginator(upcoming_events, self.paginate_by)
        page = self.request.GET.get('page')
        
        try:
            context['upcoming_events'] = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page
            context['upcoming_events'] = paginator.page(1)
        except EmptyPage:
            # If page is out of range, deliver last page
            context['upcoming_events'] = paginator.page(paginator.num_pages)
            
        return context


class AboutView(TemplateView):
    template_name = 'core/about.html'


class ContactView(TemplateView):
    template_name = 'core/contact.html'


class SearchView(ListView):
    template_name = 'core/search.html'
    context_object_name = 'results'
    
    def get_queryset(self):
        query = self.request.GET.get('q', '')
        if query:
            return Event.objects.filter(
                models.Q(name__icontains=query) |
                models.Q(description__icontains=query)
            ).distinct()
        return Event.objects.none()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['query'] = self.request.GET.get('q', '')
        return context


def handle_404(request, exception):
    """Custom 404 page handler"""
    return render(request, 'core/404.html', status=404)


def handle_500(request):
    """Custom 500 page handler"""
    return render(request, 'core/500.html', status=500)


def handle_403(request, exception):
    """Custom 403 page handler"""
    return render(request, 'core/403.html', status=403)


def sitemap_view(request):
    sitemaps = {
        'static': StaticViewSitemap,
        'events': EventSitemap,
        'categories': CategorySitemap,
    }
    return sitemap(request, sitemaps)



def privacy_policy(request):
    """
    Renders the Privacy Policy page.
    """
    return render(request, 'core/privacy-policy.html')


def terms_of_service(request):
    """
    Renders the Terms of Service page.
    """
    return render(request, 'core/terms-of-service.html')