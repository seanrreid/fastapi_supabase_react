from typing import Union

from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import OAuth2PasswordBearer
from models.users import User
from db.supabase import create_supabase_client

import uvicorn

# Initialize supabase client
supabase = create_supabase_client()

app = FastAPI()

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


async def get_current_user():
    try:
        res = supabase.auth.get_session()
        print(res)
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )


@app.get("/")
def default_route():
    return {"detail": "Root Route"}


@app.post("/register")
def register(request: User):
    response = supabase.auth.sign_up({"email": request.email,
                                      "password": request.password})
    user = response.user
    return {"user_id": user.id}


@app.post("/login")
def login(request: User):
    try:
        auth_user = supabase.auth.sign_in_with_password({"email": request.email,
                                                        "password": request.password})
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


@app.get("/protected")
async def protected_route(user: User = Depends(get_current_user)):
    if user is not None:
        return user
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )


if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
