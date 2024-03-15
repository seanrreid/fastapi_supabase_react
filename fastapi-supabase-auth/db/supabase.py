from supabase import Client, create_client
from config import api, url, service_role

api_url: str = url
key: str = api
service_key: str = service_role

def create_supabase_client():
    supabase: Client = create_client(url, service_key)
    return supabase