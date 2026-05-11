from __future__ import annotations

from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.memo import Memo
from app.schemas.memo import MemoCreate


def get_all(db: Session, owner_id: int) -> List[Memo]:
    return db.query(Memo).filter(Memo.owner_id == owner_id).all()


def create(db: Session, data: MemoCreate, owner_id: int) -> Memo:
    memo = Memo(content=data.content, owner_id=owner_id)
    db.add(memo)
    db.commit()
    db.refresh(memo)
    return memo


def update(db: Session, memo_id: int, content: str, owner_id: int) -> Optional[Memo]:
    memo = db.query(Memo).filter(Memo.id == memo_id, Memo.owner_id == owner_id).first()
    if memo:
        memo.content = content
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
