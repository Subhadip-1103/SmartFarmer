from django.contrib import admin
from .models import Category, Product, Cart, CartItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'section']
    list_filter = ['section']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'seller', 'price', 'stock_quantity', 'is_active']
    list_filter = ['category__section', 'category', 'is_active']
    search_fields = ['title', 'seller__username']


admin.site.register(Cart)
admin.site.register(CartItem)