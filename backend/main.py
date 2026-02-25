from fastapi import FastAPI
from routes.weather import router as weather_router
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()

app.include_router(weather_router, prefix="/weather")

## Define allowed origins. Instead of this, I will proxy
## traffic of frontend on the same domain/port as python
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(name)s %(asctime)s %(message)s",
)


@app.get("/")
async def root():
    return {"message": "Hello World"}
