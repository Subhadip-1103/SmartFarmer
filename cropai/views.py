import os
import json
import joblib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(MODEL_DIR, 'crop_model_v3.pkl'))
state_encoder = joblib.load(os.path.join(MODEL_DIR, 'state_encoder.pkl'))
district_encoder = joblib.load(os.path.join(MODEL_DIR, 'district_encoder.pkl'))
soil_encoder = joblib.load(os.path.join(MODEL_DIR, 'soil_encoder.pkl'))
season_encoder = joblib.load(os.path.join(MODEL_DIR, 'season_encoder.pkl'))
crop_encoder = joblib.load(os.path.join(MODEL_DIR, 'crop_encoder.pkl'))

with open(os.path.join(MODEL_DIR, 'state_districts.json')) as f:
    STATE_DISTRICTS = json.load(f)

# District -> typical soil type, derived once from the training data itself
# so this always stays in sync with what the model was actually trained on.
import pandas as pd
_df = pd.read_csv(os.path.join(MODEL_DIR, 'crop_data_v3.csv'))
DISTRICT_SOIL = dict(_df.drop_duplicates('district')[['district', 'soil_type']].values)


class CropRecommendationView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'states': list(state_encoder.classes_),
            'state_districts': STATE_DISTRICTS,
            'district_soil': DISTRICT_SOIL,
            'seasons': list(season_encoder.classes_),
        })

    def post(self, request):
        state = request.data.get('state')
        district = request.data.get('district')
        season = request.data.get('season')
        temperature = request.data.get('temperature')

        if not all([state, district, season, temperature is not None]):
            return Response(
                {'error': 'state, district, season and temperature are all required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if state not in state_encoder.classes_:
            return Response({'error': f'Unknown state. Choose from: {list(state_encoder.classes_)}'}, status=400)
        if district not in district_encoder.classes_:
            return Response({'error': f'Unknown district. Choose from: {list(district_encoder.classes_)}'}, status=400)
        if season not in season_encoder.classes_:
            return Response({'error': f'Unknown season. Choose from: {list(season_encoder.classes_)}'}, status=400)

        try:
            temperature = float(temperature)
        except (TypeError, ValueError):
            return Response({'error': 'temperature must be a number'}, status=400)

        soil = DISTRICT_SOIL.get(district)
        if soil is None or soil not in soil_encoder.classes_:
            return Response({'error': f'No soil data for district {district}'}, status=400)

        state_enc = state_encoder.transform([state])[0]
        district_enc = district_encoder.transform([district])[0]
        soil_enc = soil_encoder.transform([soil])[0]
        season_enc = season_encoder.transform([season])[0]

        probs = model.predict_proba([[state_enc, district_enc, soil_enc, season_enc, temperature]])[0]
        top_indices = probs.argsort()[-5:][::-1]

        recommendations = [
            {'crop': crop_encoder.inverse_transform([i])[0], 'confidence': round(float(probs[i]) * 100, 1)}
            for i in top_indices if probs[i] > 0
        ]

        return Response({
            'state': state,
            'district': district,
            'soil_type': soil,
            'season': season,
            'temperature': temperature,
            'recommendations': recommendations,
        })