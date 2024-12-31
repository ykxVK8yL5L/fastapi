from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    String,
    Float,
    JSON,
)
from sqlalchemy.orm import relationship
from typing import Dict, Type
from database import Base, engine

# 动态模型类型映射
FIELD_TYPE_MAPPING = {"text": String, "int": Integer, "bool": Boolean, "float": Float}


# 模型操作开始
# 已注册的模型表
models_registry: Dict[str, Type[Base]] = {}


class RegisteredModel(Base):
    """
    存储动态注册的模型及其字段定义
    """

    __tablename__ = "registered_models"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, unique=True, index=True)
    fields = Column(JSON)


def create_model(model_name: str, fields: Dict[str, str]):
    """
    动态创建 SQLAlchemy 模型
    :param model_name: 模型名称
    :param fields: 字段名称和类型的字典，例如 {"title": "text", "is_published": "bool"}
    """
    # 转换字段为 SQLAlchemy 列
    attrs = {
        "__tablename__": model_name.lower(),
        "id": Column(Integer, primary_key=True, index=True),
    }
    for field_name, field_type in fields.items():
        sqlalchemy_type = FIELD_TYPE_MAPPING.get(field_type)
        if not sqlalchemy_type:
            raise ValueError(f"Unsupported field type: {field_type}")
        attrs[field_name] = Column(sqlalchemy_type)

    # 动态生成模型类
    new_model = type(model_name, (Base,), attrs)

    # 注册模型到全局注册表
    models_registry[model_name] = new_model

    # 创建对应的数据库表
    Base.metadata.create_all(bind=engine)
    return new_model


from sqlalchemy import inspect


# 模型操作结束


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    sort = Column(Integer, default=0)
    status = Column(Integer, default=1)
