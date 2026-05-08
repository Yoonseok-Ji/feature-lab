from sqlalchemy.orm import Session
import models, schemas

# 조회 (Read)
def get_memos(db: Session):
    return db.query(models.Memo).all()

# 생성 (Create)
def create_memo(db: Session, memo_data: schemas.MemoCreate):
    new_memo = models.Memo(content=memo_data.content)
    db.add(new_memo)
    db.commit()
    db.refresh(new_memo) # DB가 생성한 ID를 확인하기 위해 최신화
    return new_memo

# 수정 (Update)
def update_memo(db: Session, memo_id: int, content: str):
    db_memo = db.query(models.Memo).filter(models.Memo.id == memo_id).first()
    if db_memo:
        db_memo.content = content
        db.commit()
    return db_memo

# 삭제 (Delete)
def delete_memo(db: Session, memo_id: int):
    db_memo = db.query(models.Memo).filter(models.Memo.id == memo_id).first()
    if db_memo:
        db.delete(db_memo)
        db.commit()
        return True
    return False