from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import memo as memo_crud
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.memo import MemoCreate, MemoRead

router = APIRouter()


@router.get("", response_model=List[MemoRead])
def list_memos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return memo_crud.get_all(db, current_user.id)


@router.post("", response_model=MemoRead, status_code=status.HTTP_201_CREATED)
def create_memo(
    data: MemoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return memo_crud.create(db, data, current_user.id)


@router.put("/{memo_id}", response_model=MemoRead)
def update_memo(
    memo_id: int,
    data: MemoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memo = memo_crud.update(db, memo_id, data.content, current_user.id)
    if not memo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="메모를 찾을 수 없습니다.")
    return memo


@router.delete("/{memo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memo(
    memo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not memo_crud.delete(db, memo_id, current_user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="메모를 찾을 수 없습니다.")
