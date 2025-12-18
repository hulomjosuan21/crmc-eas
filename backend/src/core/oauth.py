from authlib.integrations.starlette_client import OAuth

from src.core.config import settings

oauth = OAuth()

# callbacks
# http://localhost:5000/department/oauth/callback
# http://localhost:5000/officer/oauth/callback

oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile',
    }
)