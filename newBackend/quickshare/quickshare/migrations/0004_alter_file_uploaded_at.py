# Generated by Django 5.1.7 on 2025-03-31 00:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickshare', '0003_file_file_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='uploaded_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
