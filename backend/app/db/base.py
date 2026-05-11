# 이 파일을 import하면 모든 모델이 Base.metadata에 등록됩니다 (Alembic 마이그레이션용)
from app.db.base_class import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.memo import Memo  # noqa: F401
