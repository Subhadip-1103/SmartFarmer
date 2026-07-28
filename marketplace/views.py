from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
import razorpay
from django.conf import settings
from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, OrderSerializer

# ---------- Public browsing ----------

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Category.objects.all()
        section = self.request.query_params.get('section')
        if section:
            queryset = queryset.filter(section=section)
        return queryset


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).order_by('-created_at')
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


# ---------- Cart (requires login) ----------

class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity
        cart_item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(id=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity is not None:
            if int(quantity) <= 0:
                cart_item.delete()
                return Response({'message': 'Item removed'}, status=status.HTTP_200_OK)
            cart_item.quantity = int(quantity)
            cart_item.save()

        cart = cart_item.cart if quantity and int(quantity) > 0 else Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class RemoveFromCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            cart_item = CartItem.objects.get(id=pk, cart__user=request.user)
            cart_item.delete()
            return Response({'message': 'Item removed'}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)


# ---------- Farmer product management (Phase 2 groundwork) ----------

class MyProductsView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class MyProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Golden rule: farmers only ever touch their own products
        return Product.objects.filter(seller=self.request.user)

# ---------- Checkout & Orders ----------

class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.all()

        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = sum(item.quantity * item.product.price for item in cart_items)
        shipping_address = request.data.get('shipping_address', '')

        # Create the Order record (status: pending)
        order = Order.objects.create(
            buyer=request.user,
            total_amount=total_amount,
            shipping_address=shipping_address,
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price_at_purchase=item.product.price,
            )

        # Create a Razorpay order
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        razorpay_order = client.order.create({
            'amount': int(total_amount * 100),  # Razorpay uses paise, not rupees
            'currency': 'INR',
            'payment_capture': 1,
        })

        order.razorpay_order_id = razorpay_order['id']
        order.save()

        return Response({
            'order_id': order.id,
            'razorpay_order_id': razorpay_order['id'],
            'amount': int(total_amount * 100),
            'currency': 'INR',
            'razorpay_key': settings.RAZORPAY_KEY_ID,
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        try:
            order = Order.objects.get(id=order_id, buyer=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature,
        }

        try:
            client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            order.status = 'failed'
            order.save()
            return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)

        # Payment verified successfully
        order.status = 'paid'
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.save()

        # Reduce stock for each ordered product
        for item in order.items.all():
            if item.product:
                item.product.stock_quantity = max(0, item.product.stock_quantity - item.quantity)
                item.product.save()

        # Clear the cart
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user).order_by('-created_at')


class FarmerOrdersView(APIView):
    """Orders containing products sold by the logged-in farmer (rules.md golden rule)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        order_items = OrderItem.objects.filter(
            product__seller=request.user,
            order__status='paid'
        ).select_related('order', 'product').order_by('-order__created_at')

        data = [{
            'order_id': item.order.id,
            'product_title': item.product.title if item.product else 'Deleted Product',
            'quantity': item.quantity,
            'price_at_purchase': item.price_at_purchase,
            'buyer': item.order.buyer.username,
            'shipping_address': item.order.shipping_address,
            'created_at': item.order.created_at,
        } for item in order_items]

        return Response(data)