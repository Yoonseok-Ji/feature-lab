from __future__ import annotations

from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.memo import Memo
from app.models.user import User
from app.schemas.memo import MemoCreate


def get_all(db: Session) -> List[dict]:
    rows = (
        db.query(Memo, User.email)
        .join(User, Memo.owner_id == User.id)
        .order_by(Memo.id.desc())
        .all()
    )
    return [
        {
            "id": memo.id,
            "content": memo.content,
            "image_url": memo.image_url,
            "owner_id": memo.owner_id,
            "owner_email": email,
        }
        for memo, email in rows
    ]


def create(db: Session, data: MemoCreate, owner_id: int) -> Memo:
    memo = Memo(content=data.content, image_url=data.image_url, owner_id=owner_id)
    db.add(memo)
    db.commit()
    db.refresh(memo)
    return memo


def update(db: Session, memo_id: int, data: MemoCreate, owner_id: int) -> Optional[Memo]:
    memo = db.query(Memo).filter(Memo.id == memo_id, Memo.owner_id == owner_id).first()
    if memo:
        memo.content = data.content
        memo.image_url = data.image_url
        db.commit()
        db.refresh(memo)
    return memo


def delete(db: Session, memo_id: int, owner_id: int) -> bool:
    memo = db.query(Memo).filter(Memo.id == memo_id, Memo.owner_id == owner_id).first()
    if memo:
        db.delete(memo)
        db.commit()
        return True
    return False
