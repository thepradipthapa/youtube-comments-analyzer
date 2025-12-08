from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

app = FastAPI(title="Youtube Comments Analyzer", version="1.0.0")


@app.get("/", response_class=JSONResponse)
def root():
    return JSONResponse(
        content={"message": "Youtube Comments Analyzer!"},
        status_code=status.HTTP_200_OK,
    )