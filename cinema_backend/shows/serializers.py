from rest_framework import serializers
from .models import Shows, Reservations


class ShowsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shows
        fields = ["id", "movie_title", "room", "price", "available_seats"]
        
        
class ReservationsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reservations
        fields = ["id", "show_id", "customer_name", "seats", "status", "created_at"]