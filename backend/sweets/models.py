from django.db import models

class Sweet(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField()
    image = models.ImageField(upload_to='sweets/', blank=True, null=True)  # NEW
    description = models.TextField(blank=True, null=True)  # Optional

    def __str__(self):
        return f"{self.name} ({self.category})"
