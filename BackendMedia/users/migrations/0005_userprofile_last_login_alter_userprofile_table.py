# Generated by Django 4.2.15 on 2024-09-09 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_rename_user_id_userprofile_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True, verbose_name='last login'),
        ),
        migrations.AlterModelTable(
            name='userprofile',
            table=None,
        ),
    ]
