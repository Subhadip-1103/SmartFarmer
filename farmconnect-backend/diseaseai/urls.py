from django.urls import path
from .views import DiseasePredictionView

urlpatterns = [
    path('predict/', DiseasePredictionView.as_view(), name='disease-predict'),
]