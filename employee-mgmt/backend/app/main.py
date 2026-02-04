import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db import Base, engine
from app.api.routes.employees import router as employees_router

# Setup logging for debugging
logging.basicConfig(level=logging.DEBUG if settings.DEBUG else logging.INFO)
logger = logging.getLogger("employee_mgmt")

# Create tables (simple dev approach; for prod use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)

# ---- CORS configuration ----
# Support comma-separated origins in .env, e.g.:
# BACKEND_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
origins_raw = (settings.BACKEND_CORS_ORIGINS or "").strip()
origins = [o.strip() for o in origins_raw.split(",") if o.strip()]

allow_all = (len(origins) == 1 and origins[0] == "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    # allow localhost and 127.0.0.1 in dev via regex as a fallback (optional)
    allow_origin_regex=None if origins else r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=not allow_all,  # must be False if allow_origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(employees_router, prefix=settings.API_V1_PREFIX)

@app.get("/health")
def health():
    return {"status": "ok"}
