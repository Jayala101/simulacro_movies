from django.db import models

class Shows(models.Model):
    
    movie_title = models.CharField(max_length=120,null=False)
    room = models.CharField(max_length=20,null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_seats = models.IntegerField(null=False)
    
    def __str__(self):
        return f"{self.movie_title} {self.room} {self.price} {self.available_seats}"