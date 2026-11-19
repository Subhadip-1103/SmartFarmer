from django.contrib import admin
from .models import Category, Product, Cart, CartItem, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'section']
    list_filter = ['section']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'seller', 'price', 'stock_quantity', 'is_active']
    list_filter = ['category__section', 'category', 'is_active']
    search_fields = ['title', 'seller__username']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'buyer', 'total_amount', 'status', 'created_at']
    list_filter = ['status']
    inlines = [OrderItemInline]

admin.site.register(Cart)
admin.site.register(CartItem)