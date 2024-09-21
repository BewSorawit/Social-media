from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import BlacklistedAccessToken


class BlacklistTokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth = JWTAuthentication()
        header = auth.get_header(request)
        if header:
            token = auth.get_raw_token(header)
            if BlacklistedAccessToken.objects.filter(token=token).exists():
                raise AuthenticationFailed('Access token has been blacklisted.')
