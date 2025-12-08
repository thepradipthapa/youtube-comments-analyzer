from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from models import Settings
from dotenv import load_dotenv

load_dotenv()

settings = Settings()

app = FastAPI(title="Youtube Comments Analyzer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", response_class=JSONResponse)
def root():
    return JSONResponse(
        content={"message": "Youtube Comments Analyzer!"},
        status_code=status.HTTP_200_OK,
    )
    