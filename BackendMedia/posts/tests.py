from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import UserProfile
from posts.models import Post
from follows.models import UserFollow
from datetime import date


class FollowedPostsTestCase(APITestCase):

    def setUp(self):
        self.user1 = UserProfile.objects.create_user(
            username='user1',
            password='pass123',
            first_name='User',
            last_name='One',
            date_of_birth=date(1990, 1, 1),
            gender='M'
        )
        self.user2 = UserProfile.objects.create_user(
            username='user2',
            password='pass123',
            first_name='User',
            last_name='Two',
            date_of_birth=date(1992, 2, 2),
            gender='F'
        )
        self.user3 = UserProfile.objects.create_user(
            username='user3',
            password='pass123',
            first_name='User',
            last_name='Three',
            date_of_birth=date(1995, 3, 3),
            gender='O'
        )

        # Create posts for each user
        self.post1 = Post.objects.create(
            author=self.user1, visibility='public', content='User 1 Public Post'
        )
        self.post2 = Post.objects.create(
            author=self.user2, visibility='private', content='User 2 Private Post'
        )
        self.post3 = Post.objects.create(
            author=self.user3, visibility='private', content='User 3 Private Post'
        )

        # User1 follows User2
        UserFollow.objects.create(follower=self.user1, followed=self.user2)
        UserFollow.objects.create(
            follower=self.user2, followed=self.user1)  # Mutual follow

        # URL for testing
        self.url = reverse('followed-posts', kwargs={'user_id': self.user1.id})

        # Authenticate user1 for the test
        self.client.force_authenticate(user=self.user1)

    def test_get_followed_posts(self):
        print(f"Testing URL: {self.url}")  # Debug information
        response = self.client.get(self.url)
        # Debug information
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content}")  # Debug information

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        post_contents = [post['content'] for post in data]
        self.assertIn('User 1 Public Post', post_contents)
        # User 1 follows User 2, so this should be included
        self.assertIn('User 2 Private Post', post_contents)
        # User 1 does not follow User 3
        self.assertNotIn('User 3 Private Post', post_contents)
