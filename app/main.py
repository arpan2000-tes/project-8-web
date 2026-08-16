from fastapi import FastAPI
from app.api.v1.routers import api_router
from app.db.base import Base
from app.db.session import Engine

Base.metadata.create_all(bind=Engine)

app = FastAPI()

app.include_router(api_router, prefix="/api/v1")

@app.get("/about")
def get():
   return{"say" : "hai bro"}