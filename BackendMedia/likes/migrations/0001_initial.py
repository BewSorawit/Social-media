# Generated by Django 4.2.15 on 2024-09-05 19:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("posts", "0002_alter_post_table"),
        ("comments", "0001_initial"),
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Like",
            fields=[
                ("like_id", models.AutoField(primary_key=True, serialize=False)),
                (
                    "comment",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="likes",
                        to="comments.comment",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="likes",
                        to="posts.post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="likes",
                        to="users.userprofile",
                    ),
                ),
            ],
            options={
                "db_table": "likes",
                "unique_together": {("user", "post", "comment")},
            },
        ),
    ]
