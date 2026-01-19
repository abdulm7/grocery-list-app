from django.urls import path
from . import views


urlpatterns = [
    path('grocery-items/', views.grocery_item_list, name='grocery-item-list'),
    path('grocery-items/update-purchased/', views.bulk_update_purchased, name='bulk-update'),
    path('grocery-items/<int:pk>/', views.grocery_item_detail, name='grocery-item-detail'),
]