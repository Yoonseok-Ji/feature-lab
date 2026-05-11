from pydantic import BaseModel


class MemoCreate(BaseModel):
    content: str


class MemoRead(BaseModel):
    id: int
    content: str
    owner_id: int

    model_config = {"from_attributes": True}
