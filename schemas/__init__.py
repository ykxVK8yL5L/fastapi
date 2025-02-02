from typing import Union, Optional

from pydantic import BaseModel, computed_field
from pydantic import Extra


# ==============================
# 账户相关
# ==============================
class UserBase(BaseModel):
    username: str
    password: str


class UserCreate(UserBase):
    sort: int
    status: int


class UserEdit(UserBase):
    id: int
    sort: int
    status: int


class User(UserBase):
    id: int
    sort: int
    status: int

    class Config:
        orm_mode = True


class PostRequest(BaseModel):
    class Config:
        extra = Extra.allow
