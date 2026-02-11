from rest_framework import serializers
from .models import Shows


class ShowsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shows
        fields = ["id", "movie_title", "room", "price", "available_seats"]