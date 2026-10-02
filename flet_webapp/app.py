from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, PlainTextResponse

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = PROJECT_ROOT / "dist"
INDEX_FILE = DIST_DIR / "index.html"

web_app = FastAPI(title="CampusLink React Host")


def get_dist_file(request_path: str) -> Optional[Path]:
    normalized = request_path.lstrip("/")
    if not normalized:
        return None

    candidate = (DIST_DIR / normalized).resolve()
    try:
        candidate.relative_to(DIST_DIR.resolve())
    except ValueError:
        return None

    if candidate.is_file():
        return candidate
    return None


def should_use_spa_fallback(request_path: str) -> bool:
    normalized = request_path.lstrip("/")
    if not normalized:
        return True
    return "." not in Path(normalized).name


@web_app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@web_app.get("/{full_path:path}")
def serve_react_app(full_path: str = ""):
    if not DIST_DIR.exists():
        raise HTTPException(
            status_code=500,
            detail="React build folder not found. Run `npm run build` first.",
        )

    direct_file = get_dist_file(full_path)
    if direct_file:
        return FileResponse(direct_file)

    if should_use_spa_fallback(full_path):
        if not INDEX_FILE.exists():
            raise HTTPException(
                status_code=500,
                detail="React index.html not found. Run `npm run build` first.",
            )
        return FileResponse(INDEX_FILE)

    raise HTTPException(status_code=404, detail="Asset not found.")


@web_app.exception_handler(HTTPException)
async def http_exception_handler(_, exc: HTTPException):
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)


def main() -> None:
    port = int(os.getenv("CAMPUSLINK_PORT", "8551"))
    uvicorn.run(web_app, host="0.0.0.0", port=port, log_level="info")


if __name__ == "__main__":
    main()
