import os
from dotenv import load_dotenv

from pathlib import Path
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)


url = os.getenv("URL")
api = os.getenv("API_KEY")
service_role = os.getenv("SERVICE_ROLE_KEY")
