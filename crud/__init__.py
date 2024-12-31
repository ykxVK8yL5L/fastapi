from sqlalchemy import desc
from sqlalchemy.orm import Session
from typing import Type
from models import Base


def create_model_item(db: Session, model: Type[Base], obj_data: dict):
    """创建记录"""
    db_obj = model(**obj_data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_model_items(db: Session, model: Type[Base], skip: int = 0, limit: int = 10):
    """获取多条记录"""
    return db.query(model).offset(skip).limit(limit).all()


def get_model_item(db: Session, model: Type[Base], model_id: int):
    """获取单条记录"""
    return db.query(model).filter(model.id == model_id).first()


def update_model_item(db: Session, model: Type[Base], model_id: int, update_data: dict):
    """更新记录"""
    db_obj = db.query(model).filter(model.id == model_id).first()
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_model_item(db: Session, model: Type[Base], model_id: int):
    """删除记录"""
    db_obj = db.query(model).filter(model.id == model_id).first()
    db.delete(db_obj)
    db.commit()
    return db_obj


# ==============================
# 辅助方法
# ==============================
def update_field_value(db: Session, model, field_name, new_value):
    """
    批量更新数据库表中指定字段的值。

    参数:
    db:数据库Session
    model: 数据库表的模型类，如 Models.User。
    field_name: 要更新的字段名称，必须是字符串。
    new_value: 要设置的新值，可以是任何有效类型。
    """
    field = getattr(model, field_name, None)
    if field is None:
        raise ValueError(f"字段 {field_name} 不存在于模型 {model.__name__}")
    db.query(model).update({field: new_value})
    db.commit()
