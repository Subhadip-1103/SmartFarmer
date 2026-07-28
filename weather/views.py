import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status


class CurrentWeatherView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        city = request.query_params.get('city')
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')

        if city:
            params = {'q': city, 'appid': settings.OPENWEATHER_API_KEY, 'units': 'metric'}
        elif lat and lon:
            params = {'lat': lat, 'lon': lon, 'appid': settings.OPENWEATHER_API_KEY, 'units': 'metric'}
        else:
            return Response({'error': 'Provide city or lat/lon'}, status=status.HTTP_400_BAD_REQUEST)

        response = requests.get('https://api.openweathermap.org/data/2.5/weather', params=params)

        if response.status_code != 200:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)

        data = response.json()
        result = {
            'city': data.get('name'),
            'country': data.get('sys', {}).get('country'),
            'temperature': data.get('main', {}).get('temp'),
            'feels_like': data.get('main', {}).get('feels_like'),
            'humidity': data.get('main', {}).get('humidity'),
            'wind_speed': data.get('wind', {}).get('speed'),
            'condition': data.get('weather', [{}])[0].get('main'),
            'description': data.get('weather', [{}])[0].get('description'),
            'icon': data.get('weather', [{}])[0].get('icon'),
            'rain': data.get('rain', {}).get('1h', 0),
            'lat': data.get('coord', {}).get('lat'),
            'lon': data.get('coord', {}).get('lon'),
        }
        return Response(result)


class ForecastView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        city = request.query_params.get('city')
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')

        if city:
            params = {'q': city, 'appid': settings.OPENWEATHER_API_KEY, 'units': 'metric'}
        elif lat and lon:
            params = {'lat': lat, 'lon': lon, 'appid': settings.OPENWEATHER_API_KEY, 'units': 'metric'}
        else:
            return Response({'error': 'Provide city or lat/lon'}, status=status.HTTP_400_BAD_REQUEST)

        response = requests.get('https://api.openweathermap.org/data/2.5/forecast', params=params)

        if response.status_code != 200:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)

        data = response.json()

        # The API returns forecasts every 3 hours; let's pick one entry per day (around midday)
        daily = {}
        for entry in data.get('list', []):
            date = entry['dt_txt'].split(' ')[0]
            time = entry['dt_txt'].split(' ')[1]
            if date not in daily and time == '12:00:00':
                daily[date] = {
                    'date': date,
                    'temp': entry['main']['temp'],
                    'temp_min': entry['main']['temp_min'],
                    'temp_max': entry['main']['temp_max'],
                    'humidity': entry['main']['humidity'],
                    'condition': entry['weather'][0]['main'],
                    'description': entry['weather'][0]['description'],
                    'icon': entry['weather'][0]['icon'],
                    'rain': entry.get('rain', {}).get('3h', 0),
                }

        # Fallback: if no exact 12:00 entry found for a date, just take the first entry of that date
        if len(daily) < 5:
            daily = {}
            for entry in data.get('list', []):
                date = entry['dt_txt'].split(' ')[0]
                if date not in daily:
                    daily[date] = {
                        'date': date,
                        'temp': entry['main']['temp'],
                        'temp_min': entry['main']['temp_min'],
                        'temp_max': entry['main']['temp_max'],
                        'humidity': entry['main']['humidity'],
                        'condition': entry['weather'][0]['main'],
                        'description': entry['weather'][0]['description'],
                        'icon': entry['weather'][0]['icon'],
                        'rain': entry.get('rain', {}).get('3h', 0),
                    }

        result = {
            'city': data.get('city', {}).get('name'),
            'country': data.get('city', {}).get('country'),
            'forecast': list(daily.values())[:5],
        }
        return Response(result)