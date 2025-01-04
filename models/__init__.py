from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    String,
    Table,
    Float,
    JSON,
    inspect,
    text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.exc import ProgrammingError
from pydantic import BaseModel, Field, create_model as create_pydantic_model
from typing import Dict, Type, Any, Tuple
from database import Base, engine


# 动态模型类型映射
FIELD_TYPE_MAPPING = {
    "string": String,
    "text": Text,
    "int": Integer,
    "bool": Boolean,
    "float": Float,
}


# 模型操作开始
# 已注册的模型表
models_registry: Dict[str, Type[Base]] = {}
pydantic_models_registry: Dict[str, Type[BaseModel]] = {}


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
        "__table_args__": {"extend_existing": True},
        "id": Column(Integer, primary_key=True, index=True),
    }
    columns = []
    for field_name, field_type in fields.items():
        sqlalchemy_type = FIELD_TYPE_MAPPING.get(field_type)
        if not sqlalchemy_type:
            raise ValueError(f"Unsupported field type: {field_type}")
        column = Column(field_name, sqlalchemy_type)
        attrs[field_name] = column
        columns.append(column)

    # 动态生成模型类
    new_model = type(model_name, (Base,), attrs)

    table = Table(model_name.lower(), Base.metadata, *columns, extend_existing=True)
    new_model.__table__ = table

    # 注册模型到全局注册表
    # 先清空之前的，要不然之前遗留字段会影响
    models_registry[model_name] = {}
    models_registry[model_name] = new_model

    # 创建对应的数据库表
    # Base.metadata.create_all(bind=engine)
    # 检查表是否已存在，如果存在，则跳过创建
    with engine.connect() as connection:
        # 检查表是否已存在，如果存在，则跳过创建
        connection.execute(
            text(
                f"CREATE TABLE IF NOT EXISTS {model_name.lower()} (id INTEGER PRIMARY KEY AUTOINCREMENT)"
            )
        )
        existing_columns = inspect(engine).get_columns(model_name.lower())
        existing_column_names = {col["name"] for col in existing_columns}
        for field_name, field_type in fields.items():
            if field_name not in existing_column_names:
                # 添加新字段
                connection.execute(
                    text(
                        f"ALTER TABLE {model_name.lower()} ADD COLUMN {field_name} {FIELD_TYPE_MAPPING[field_type].__visit_name__.upper()}"
                    )
                )
        for field_name in existing_column_names:
            if field_name != "id" and field_name not in fields:
                # 删除字段（如果需要支持删除字段）
                connection.execute(
                    text(f"ALTER TABLE {model_name.lower()} DROP COLUMN {field_name}")
                )

    # 动态生成 Pydantic 模型
    pydantic_model = create_pydantic_model(
        f"{model_name}Schema",
        **{field: (Any, ...) for field in fields.keys()},
        id=(int, None),
        __config__=type("Config", (), {"orm_mode": True}),
    )
    pydantic_models_registry[model_name] = {}
    pydantic_models_registry[model_name] = pydantic_model

    return new_model


# 模型操作结束


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    sort = Column(Integer, default=0)
    status = Column(Integer, default=1)
