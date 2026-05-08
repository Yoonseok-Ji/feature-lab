from pydantic import BaseModel

# [입력용] 메모를 생성하거나 수정할 때 클라이언트가 보내야 하는 양식
class MemoCreate(BaseModel):
    content: str

# [출력용] DB에서 데이터를 꺼내 사용자에게 보여줄 때의 양식
class Memo(BaseModel):
    id: int
    content: str

    class Config:
        # SQLAlchemy 객체를 Pydantic 모델로 자동 변환 (매우 중요)
        from_attributes = True