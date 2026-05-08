from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 도커 컴포즈에 적은 정보와 일치해야 합니다.
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@db:5432/archive_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()