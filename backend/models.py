from sqlalchemy import Column, Integer, String
from database import Base

# 1. 테이블 설계도(클래스) 정의
class Memo(Base):
    # 2. DB에서의 실제 테이블 이름
    __tablename__ = "memos"

    # 3. 각 열(Column) 설정
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)