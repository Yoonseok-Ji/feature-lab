import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.crud import memo as memo_crud
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.memo import MemoCreate, MemoRead

router = APIRouter()

UPLOAD_DIR = Path("/app/static/uploads")
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> dict:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="JPG, PNG, GIF, WEBP 이미지만 업로드 가능합니다.")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="파일 크기는 5MB 이하여야 합니다.")

    ext = (file.filename or "image").rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "gif", "webp"):
        ext = "jpg"

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4()}.{ext}"
    (UPLOAD_DIR / filename).write_bytes(content)

    return {"url": f"/static/uploads/{filename}"}


@router.get("", response_model=List[MemoRead])
def list_memos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return memo_crud.get_all(db)


@router.post("", response_model=MemoRead, status_code=status.HTTP_201_CREATED)
def create_memo(
    data: MemoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memo = memo_crud.create(db, data, current_user.id)
    return {
        "id": memo.id,
        "content": memo.content,
        "image_url": memo.image_url,
        "owner_id": memo.owner_id,
        "owner_email": current_user.email,
    }


@router.put("/{memo_id}", response_model=MemoRead)
def update_memo(
    memo_id: int,
    data: MemoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memo = memo_crud.update(db, memo_id, data, current_user.id)
    if not memo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="메모를 찾을 수 없습니다.")
    return {
        "id": memo.id,
        "content": memo.content,
        "image_url": memo.image_url,
        "owner_id": memo.owner_id,
        "owner_email": current_user.email,
    }


@router.delete("/{memo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memo(
    memo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not memo_crud.delete(db, memo_id, current_user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="메모를 찾을 수 없습니다.")
