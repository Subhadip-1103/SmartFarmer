from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='courses')
    content = models.TextField(help_text="Course text content or instructions")
    video_url = models.URLField(blank=True, null=True, help_text="Optional YouTube/video link")
    video_file = models.FileField(upload_to='course_videos/', blank=True, null=True, help_text="Optional: upload your own video file")
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    extra_image_1 = models.ImageField(upload_to='course_images/', blank=True, null=True)
    extra_image_2 = models.ImageField(upload_to='course_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title