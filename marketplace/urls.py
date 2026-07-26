from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView,
    CartView, AddToCartView, UpdateCartItemView, RemoveFromCartView,
    MyProductsView, MyProductDetailView,
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('cart/item/<int:pk>/', UpdateCartItemView.as_view(), name='cart-item-update'),
    path('cart/item/<int:pk>/remove/', RemoveFromCartView.as_view(), name='cart-item-remove'),

    path('my-products/', MyProductsView.as_view(), name='my-products'),
    path('my-products/<int:pk>/', MyProductDetailView.as_view(), name='my-product-detail'),
]