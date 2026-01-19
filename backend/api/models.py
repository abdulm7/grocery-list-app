from django.db import models
from django.core.validators import MinValueValidator

class GroceryItem(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100, default='Other')
    purchased = models.BooleanField(default=False)
    quantity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )

    def __str__(self):
        return f"{self.name} ({self.quantity})"

    class Meta:
        verbose_name = 'Grocery Item'
        verbose_name_plural = 'Grocery Items'