from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.logging_config import configure_logging
from app.routers import enquiry, health


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging(settings.log_level)
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    description=(
        "SignalDesk enquiry-handling workflow API. Inbound messages are stored "
        "immediately and matched against hardcoded SOP playbooks in a background task."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(enquiry.router)
