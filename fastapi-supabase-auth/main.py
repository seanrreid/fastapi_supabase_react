from typing import Annotated

from fastapi import FastAPI, status, HTTPException, Depends, Response, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from models.users import User
from db.supabase import create_supabase_client

# Replacing uvicorn with hypercorn, b/c freezing sucks
import asyncio
from hypercorn.asyncio import serve
from hypercorn.config import Config
config = Config()
config.bind = ["localhost:8000"]

# Initialize supabase client
supabase = create_supabase_client()

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Setup our origins...
# ...for now it's just our local environments
origins = [
    "http://localhost:5173"
]

# Add the CORS middleware...
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
This middleware insures that the sessions are per user, otherwise it defaults to the server-side session.

Server-side sessions are updated with each login, and are one-at-a-time.
This means, all currently logged in users will see the same data.

Setting this up lets the frontend manage each user session, not the server.
"""
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = supabase.auth.get_user()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    """
    This passes the correct auth information from the frontend to Supbase.

    This was found via this issue, and NOT in the docs. :angry_face_emoji:
    https://github.com/orgs/supabase/discussions/3479#discussioncomment-7934745

    """
    supabase.postgrest.auth(
        # verified that this was real
        token=token
    )  # this
    return user


@app.get("/")
def default_route():
    return {"detail": "Root Route"}


@app.post("/register")
def register(request: User):
    response = supabase.auth.sign_up(
        {"email": request.email, "password": request.password})
    user = response.user
    return {"user_id": user.id}


@app.post("/login")
def login(request: User, response: Response):
    try:
        auth_user = supabase.auth.sign_in_with_password(
            {"email": request.email,  "password": request.password})
        return auth_user
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )


@app.post("/logout")
def logout():
    response = supabase.auth.sign_out()
    return "success"


@app.post("/refresh")
async def refresh_token(request: Request):
    data = await request.json()
    token = data.get('refresh_token')

    session = supabase.auth.refresh_session(token)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
        )
    return session


@app.get("/protected")
async def protected_route(user: User = Depends(get_current_user)):
    if user is not None:
        return {"detail": "PROTECTED ROUTE IS ACCESSIBLE!"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )


if __name__ == '__main__':
    asyncio.run(serve(app, config))
