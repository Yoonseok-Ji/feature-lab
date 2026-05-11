from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, database, schemas, crud

models.Base.metadata.create_all(bind=database.engine)
# models에 등록된 클래스들(DB테이블)을 만들어줘, database에 있는 engine 쓸거고, Base의 metadata에는 내가 models에 만든 테이블 정보가 있어.

app = FastAPI()

# DB 세션 가져오기 (트럭 대여소)
def get_db():
    db = database.SessionLocal()
    # 
    try:
        yield db # db를 반환하고 함수는 죽지않고 살아있음. 왜냐면 나중에 이걸 다쓰고 db연결 닫아야하니까.
    finally:
        db.close()

# 1. 메모 저장 (Create)
# response_model을 설정하면 Pydantic이 응답 데이터를 JSON으로 예쁘게 포장합니다.
@app.post("/memos", response_model=schemas.Memo) # response model은 DB에서 한번 필터링해서 이 schemas.Memo에 맞게 변환해서 보내는거야.
def create_memo(memo_in: schemas.MemoCreate, db: Session = Depends(get_db)): 
    # 사용자가 보낸 body를 보고 이 매개변수는 Pydantic 모델이니까 request body JSON을 꺼내서 검증 + 변환해서 넣어줌.
    return crud.create_memo(db=db, memo_data=memo_in)
    # 이 MemoCreate 형식의 인스턴스를 memo_data에 넣어줌. 왜냐면 create_memo 함수는 memo_data를 받으니까

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