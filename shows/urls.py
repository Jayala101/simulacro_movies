from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ShowsViewSet

router = DefaultRouter()
router.register(r"shows", ShowsViewSet, basename="shows")

urlpatterns = []
urlpatterns += router.urls