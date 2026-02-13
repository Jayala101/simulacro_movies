from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ShowsViewSet, ReservationsViewSet
from .movie_catalog_types_views import movie_types_list_create, movie_types_detail
from .reservations_events_services_views import reservation_services_list_create, reservation_services_detail

router = DefaultRouter()
router.register(r"shows", ShowsViewSet, basename="shows")
router.register(r"reservations", ReservationsViewSet, basename="reservations")

urlpatterns = [
    # Mongo
    path("movie-types/", movie_types_list_create),
    path("movie-types/<str:id>/", movie_types_detail),
    path("reservations-services/", reservation_services_list_create),
    path("reservations-services/<str:id>/", reservation_services_detail),
]
urlpatterns += router.urls