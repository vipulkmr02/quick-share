# Generated by Django 5.1.7 on 2025-03-31 00:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quickshare', '0004_alter_file_uploaded_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='file',
            old_name='uploaded_by',
            new_name='uploaded_y',
        ),
    ]
