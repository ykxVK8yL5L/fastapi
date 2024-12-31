from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
import crud.users
import schemas, crud, models
from database import get_db

router = APIRouter()


# ==============================
# 用户相关
# ==============================
# @router.get("/users", response_model=list[schemas.User])
# async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     users = crud.users.get_users(db, skip=skip, limit=limit)
#     return users


# http://localhost:8000/users?kw=test&page=1
@router.get("/users", response_model=Page[schemas.User])
async def read_users(kw: str = "", db: Session = Depends(get_db)):
    return paginate(
        db,
        select(models.User)
        .where(models.User.username.like(f"%{kw}%"))
        .order_by(desc(models.User.id)),
    )


@router.post("/users", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.users.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="用户已经存在")
    return crud.users.create_user(db=db, user=user)


@router.patch("/users", response_model=schemas.User)
async def update_user(user: schemas.UserEdit, db: Session = Depends(get_db)):
    db_user = crud.users.get_user_by_id(db, id=user.id)
    if db_user is None:
        raise HTTPException(status_code=400, detail="用户不存在")
    return crud.users.update_user(db=db, user=user)


@router.delete("/users/{user_id}", response_model=schemas.User)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.users.delete_user(db, user_id=user_id)
    return user
