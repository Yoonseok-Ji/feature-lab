from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, database, schemas, crud

# 설계도 대로 창고(테이블) 짓기
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# DB 세션 가져오기 (트럭 대여소)
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. 메모 저장 (Create)
# response_model을 설정하면 Pydantic이 응답 데이터를 JSON으로 예쁘게 포장합니다.
@app.post("/memos", response_model=schemas.Memo)
def create_memo(memo_in: schemas.MemoCreate, db: Session = Depends(get_db)):
    return crud.create_memo(db=db, memo_data=memo_in)

# 2. 메모 조회 (Read)
@app.get("/memos", response_model=list[schemas.Memo])
def get_memos(db: Session = Depends(get_db)):
    return crud.get_memos(db)

# 3. 메모 수정 (Update)
@app.put("/memos/{memo_id}")
def update_memo(memo_id: int, memo_in: schemas.MemoCreate, db: Session = Depends(get_db)):
    db_memo = crud.update_memo(db, memo_id=memo_id, content=memo_in.content)
    if db_memo is None:
        raise HTTPException(status_code=404, detail="메모를 찾을 수 없습니다.")
    return {"status": "updated", "memo_id": memo_id}

# 4. 메모 삭제 (Delete)
@app.delete("/memos/{memo_id}")
def delete_memo(memo_id: int, db: Session = Depends(get_db)):
    success = crud.delete_memo(db, memo_id=memo_id)
    if not success:
        raise HTTPException(status_code=404, detail="메모를 찾을 수 없습니다.")
    return {"status": "deleted", "memo_id": memo_id}