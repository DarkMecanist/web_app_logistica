from django.contrib import admin
from .models import Order, Shipping, Part

admin.site.register(Order)
admin.site.register(Shipping)
admin.site.register(Part)