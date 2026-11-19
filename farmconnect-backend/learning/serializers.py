from rest_framework import serializers
from .models import Category, Course


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CourseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    thumbnail = serializers.SerializerMethodField()
    extra_image_1 = serializers.SerializerMethodField()
    extra_image_2 = serializers.SerializerMethodField()
    video_file = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'category', 'category_name', 'content', 'video_url', 'video_file', 'thumbnail', 'extra_image_1', 'extra_image_2', 'created_at']

    def get_thumbnail(self, obj):
        return self._get_file_url(obj.thumbnail)

    def get_extra_image_1(self, obj):
        return self._get_file_url(obj.extra_image_1)

    def get_extra_image_2(self, obj):
        return self._get_file_url(obj.extra_image_2)

    def get_video_file(self, obj):
        return self._get_file_url(obj.video_file)

    def _get_file_url(self, file_field):
        request = self.context.get('request')
        if file_field and request:
            return request.build_absolute_uri(file_field.url)
        return None