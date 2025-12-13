from django.urls import path
from .views import (
    sweets_list_create,
    sweet_update_delete,
    purchase_sweet,
    restock_sweet,
)

urlpatterns = [
    path('', sweets_list_create),
    path('<int:id>/', sweet_update_delete),
    path('<int:id>/purchase/', purchase_sweet),
    path('<int:id>/restock/', restock_sweet),
]
