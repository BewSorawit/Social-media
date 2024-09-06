from django.shortcuts import render

# Create your views here.


# def add_access_to_post(post_id, user_ids):
#     post = get_object_or_404(Post, id=post_id)
#     users = UserProfile.objects.filter(id__in=user_ids)
#     for user in users:
#         PostAccess.objects.get_or_create(post=post, user=user)
