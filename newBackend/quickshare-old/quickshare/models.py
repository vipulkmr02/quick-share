import uuid
from django.db import models
from django.conf import settings


class File(models.Model):
    file = models.FileField(upload_to='files/')
    file_uuid = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False)
    uploaded_at = models.DateField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                                    on_delete=models.CASCADE,
                                    related_name='files')

    def __repr__(self):
        return f'File<name: {self.file.name}>'


class Profile(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    full_name = models.CharField(max_length=50)
    dob = models.DateTimeField()
    created_on = models.DateTimeField(auto_now_add=True)
    display_picture = models.FileField(upload_to='dps/')

    def __repr__(self):
        return f'''[
            full_name: {self.full_name},
            dob: {self.dob},
            created_on: {self.created_on.ctime()},
        ]'''
