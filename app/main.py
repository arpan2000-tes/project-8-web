from fastapi import FastAPI , Depends , HTTPException , Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from app.api.v1.routers import api_router
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY_SECRET = os.getenv("API_KEY")

API_KEY_HEADER = APIKeyHeader(name="X-API-key", auto_error=False)

async def verify_api_key(api_key: str = Security(API_KEY_HEADER)):
    if api_key != API_KEY_SECRET:
        raise HTTPException (status_code=403, detail="akses ditolak: api key tidak valid")
    return api_key

app = FastAPI()

origin = [
   "http://localhost:5173",
   "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

