import os
import joblib
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(MODEL_DIR, 'crop_model.pkl'))
soil_encoder = joblib.load(os.path.join(MODEL_DIR, 'soil_encoder.pkl'))
season_encoder = joblib.load(os.path.join(MODEL_DIR, 'season_encoder.pkl'))
crop_encoder = joblib.load(os.path.join(MODEL_DIR, 'crop_encoder.pkl'))


class CropRecommendationView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'soil_types': list(soil_encoder.classes_),
            'seasons': list(season_encoder.classes_),
        })

    def post(self, request):
        soil = request.data.get('soil_type')
        season = request.data.get('season')

        if not soil or not season:
            return Response({'error': 'soil_type and season are required'}, status=status.HTTP_400_BAD_REQUEST)

        if soil not in soil_encoder.classes_:
            return Response({'error': f'Unknown soil_type. Choose from: {list(soil_encoder.classes_)}'}, status=status.HTTP_400_BAD_REQUEST)
        if season not in season_encoder.classes_:
            return Response({'error': f'Unknown season. Choose from: {list(season_encoder.classes_)}'}, status=status.HTTP_400_BAD_REQUEST)

        soil_enc = soil_encoder.transform([soil])[0]
        season_enc = season_encoder.transform([season])[0]

        probs = model.predict_proba([[soil_enc, season_enc]])[0]
        top_indices = probs.argsort()[-5:][::-1]

        recommendations = [
            {'crop': crop_encoder.inverse_transform([i])[0], 'confidence': round(float(probs[i]) * 100, 1)}
            for i in top_indices if probs[i] > 0
        ]

        return Response({
            'soil_type': soil,
            'season': season,
            'recommendations': recommendations,
        })