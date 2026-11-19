import os
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import permissions, status

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_SIZE = (160, 160)

model = tf.keras.models.load_model(os.path.join(MODEL_DIR, 'strawberry_disease_model.keras'))
with open(os.path.join(MODEL_DIR, 'strawberry_class_names.json')) as f:
    class_names = json.load(f)

# Info shown to the farmer once a disease is predicted.
# Keyed by the RAW class name (as it appears in class_names.json), not the display label.
DISEASE_INFO = {
    'healthy': {
        'description': 'This leaf shows no visible signs of disease.',
        'symptoms': 'Green, uniform leaf color with no spots, wilting, or discoloration.',
        'treatment': 'No treatment needed. Continue regular watering, fertilization, and monitoring.',
    },
    'leaf_scorch': {
        'description': 'Strawberry Leaf Scorch is a fungal disease caused by Diplocarpon earlianum.',
        'symptoms': 'Small dark purple spots on leaves that enlarge and merge, giving leaves a scorched/burnt appearance. Leaves may curl and dry out.',
        'treatment': 'Remove and destroy infected leaves. Improve air circulation between plants. Avoid overhead watering (keeps leaves dry). Apply a fungicide labeled for leaf scorch if the infection is severe. Rotate crops in future seasons.',
    },
}


class DiseasePredictionView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser]

    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

        img = Image.open(image_file).convert('RGB').resize(IMG_SIZE)
        img_array = np.expand_dims(np.array(img), axis=0)

        predictions = model.predict(img_array)[0]
        top_index = int(np.argmax(predictions))
        top_class = class_names[top_index]

        results = [
            {'label': class_names[i].replace('_', ' ').title(), 'confidence': round(float(predictions[i]) * 100, 1)}
            for i in np.argsort(predictions)[::-1]
        ]

        info = DISEASE_INFO.get(top_class, {
            'description': 'No additional information available for this class yet.',
            'symptoms': '',
            'treatment': '',
        })

        return Response({
            'crop': 'Strawberry',
            'prediction': top_class.replace('_', ' ').title(),
            'confidence': round(float(predictions[top_index]) * 100, 1),
            'all_results': results,
            'info': info,
        })