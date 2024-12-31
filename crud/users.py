from sqlalchemy import desc
from sqlalchemy.orm import Session
import models, schemas

# ==============================
# 用户操作
# ==============================


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.User)
        .order_by(desc(models.User.sort), desc(models.User.id))
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_id(db: Session, id: int):
    return db.query(models.User).filter(models.User.id == id).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        password=user.password,
        sort=user.sort,
        status=user.status,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    delete_user = db.query(models.User).filter(models.User.id == user_id).first()
    db.delete(delete_user)
    db.commit()
    return delete_user


def update_user(db: Session, user: schemas.UserEdit):
    db_user = db.query(models.User).filter(models.User.id == user.id).first()

    print(user.status)
    # Update model class variable from requested fields
    for var, value in vars(user).items():
        setattr(db_user, var, value) if value is not None else None

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
