from pydantic import BaseModel


class MemoCreate(BaseModel):
    content: str
    image_url: str | None = None


class MemoRead(BaseModel):
    id: int
    content: str
    image_url: str | None = None
    owner_id: int
    owner_email: str

    model_config = {"from_attributes": True}
