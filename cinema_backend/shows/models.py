from django.db import models

class Shows(models.Model):
    
    movie_title = models.CharField(max_length=120,null=False)
    room = models.CharField(max_length=20,null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_seats = models.IntegerField(null=False)
    
    def __str__(self):
        return f"{self.movie_title} {self.room} {self.price} {self.available_seats}"
    
    
class Reservations(models.Model):
    show_id = models.ForeignKey(Shows, on_delete=models.PROTECT, related_name="shows")
    customer_name = models.CharField(max_length=120,null=False)
    seats = models.IntegerField(null=False)
    class Estado(models.TextChoices):
        RESERVED = "Reservado"
        COMFIRMED = "Confirmado"
        CANCELLED = "Cancelado"
    status = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.RESERVED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.customer_name} {self.seats} {self.status}"