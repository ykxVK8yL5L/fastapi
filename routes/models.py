import json
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path, Query, Body
from pydantic import BaseModel, Extra
from sqlalchemy import inspect, select, desc, text
from sqlalchemy.orm import Session
from fastapi_pagination import Params, Page, paginate, set_page
from fastapi_pagination.ext.sqlalchemy import paginate
from database import get_db, engine, SessionLocal
from models import (
    FIELD_TYPE_MAPPING,
    RegisteredModel,
    create_model,
    models_registry,
    pydantic_models_registry,
)
import crud


router = APIRouter(
    prefix="/api/models",
    tags=["模型"],
    responses={404: {"description": "Not found"}},
)


# 字段定义模型
class FieldDefinition(BaseModel):
    name: str
    type: str


# 模型注册请求体
class ModelDefinition(BaseModel):
    model_name: str
    fields: list[FieldDefinition]


@router.post("/register_model/", tags=["模型"], summary="动态注册模型并持久化到数据库")
async def register_model(definition: ModelDefinition, db: Session = Depends(get_db)):
    """
    动态注册模型并持久化到数据库
    字段类型: text,int,bool,float
    """
    # 校验字段类型
    field_dict = {}
    for field in definition.fields:
        if field.type not in FIELD_TYPE_MAPPING:
            raise HTTPException(
                status_code=400, detail=f"Unsupported field type: {field.type}"
            )
        field_dict[field.name] = field.type

    # 检查是否重复注册
    existing_model = (
        db.query(RegisteredModel)
        .filter(RegisteredModel.model_name == definition.model_name)
        .first()
    )
    if existing_model:
        raise HTTPException(status_code=400, detail="Model already exists")

    # 动态创建模型并保存到数据库
    create_model(definition.model_name, field_dict)
    model_definition = RegisteredModel(
        model_name=definition.model_name, fields=field_dict
    )
    db.add(model_definition)
    db.commit()
    db.refresh(model_definition)
    return {"message": f"Model '{definition.model_name}' created successfully"}


@router.put("/update_model_name/{model_name}/", tags=["模型"], summary="修改模型名称")
async def update_model_name(
    model_name: str = Path(..., description="源模型名称"),
    new_model_name: str = Query(..., description="更改后的名称"),
    db: Session = Depends(get_db),
):
    """
    修改模型名称
    :param model_name: 当前模型名称
    :param new_model_name: 新的模型名称
    """
    # 检查模型是否存在
    existing_model = (
        db.query(RegisteredModel)
        .filter(RegisteredModel.model_name == model_name)
        .first()
    )
    if not existing_model:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")

    # 检查新模型名称是否被占用
    if (
        db.query(RegisteredModel)
        .filter(RegisteredModel.model_name == new_model_name)
        .first()
    ):
        raise HTTPException(
            status_code=400, detail=f"Model name '{new_model_name}' is already in use"
        )

    # 修改数据库表名
    old_table_name = model_name.lower()
    new_table_name = new_model_name.lower()
    with engine.connect() as connection:
        connection.execute(
            text(f"ALTER TABLE {old_table_name} RENAME TO {new_table_name}")
        )

    # 更新 RegisteredModel 表中的模型名称
    existing_model.model_name = new_model_name
    db.commit()

    # 动态更新模型注册表
    # 移除旧的模型
    if model_name in models_registry:
        models_registry.pop(model_name)
        pydantic_models_registry.pop(f"{model_name}Schema")

    updated_fields = existing_model.fields
    new_model = create_model(new_model_name, updated_fields)
    models_registry[new_model_name] = new_model

    return {
        "message": f"Model '{model_name}' renamed to '{new_model_name}' successfully"
    }


@router.put(
    "/update_model_fields/{model_name}/",
    tags=["模型"],
    summary="更新模型字段信息",
)
async def update_model_fields(
    model_name: str = Path(..., description="模型名称"),
    updated_fields: list[FieldDefinition] = Body(
        ..., description="模型字段信息,字段type类型: text,int,bool,float"
    ),
    db: Session = Depends(get_db),
):
    """
    更新模型字段信息
    :param model_name: 需要更新的模型名称
    :param updated_fields: 新的字段定义,字段type类型: text,int,bool,float
    """
    # 检查模型是否存在
    existing_model = (
        db.query(RegisteredModel)
        .filter(RegisteredModel.model_name == model_name)
        .first()
    )
    if not existing_model:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")

    # 校验新的字段定义是否合法
    new_field_dict = {}
    for field in updated_fields:
        if field.type not in FIELD_TYPE_MAPPING:
            raise HTTPException(
                status_code=400, detail=f"Unsupported field type: {field.type}"
            )
        new_field_dict[field.name] = field.type

    # 获取模型类和表名
    model_class = models_registry.get(model_name)
    if not model_class:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not loaded")

    # 更新数据库表结构
    table_name = model_class.__tablename__
    existing_columns = inspect(engine).get_columns(table_name)
    existing_column_names = {col["name"] for col in existing_columns}

    with engine.connect() as connection:
        for field_name, field_type in new_field_dict.items():
            if field_name not in existing_column_names:
                # 添加新字段
                connection.execute(
                    text(
                        f"ALTER TABLE {table_name} ADD COLUMN {field_name} {FIELD_TYPE_MAPPING[field_type].__visit_name__.upper()}"
                    )
                )
        for field_name in existing_column_names:
            if field_name != "id" and field_name not in new_field_dict:
                # 删除字段（如果需要支持删除字段）
                connection.execute(
                    text(f"ALTER TABLE {table_name} DROP COLUMN {field_name}")
                )

    # 更新 RegisteredModel 表中的字段定义
    existing_model.fields = new_field_dict
    db.commit()

    # 动态重新加载模型
    create_model(model_name, new_field_dict)
    return {"message": f"Model '{model_name}' fields updated successfully"}


@router.post("/{model_name}/", tags=["模型"], summary="创建模型记录")
async def create(model_name: str, item: dict, db: Session = Depends(get_db)):
    """创建记录"""
    model = models_registry.get(model_name)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return crud.create_model_item(db, model, item)


@router.get(
    "/{model_name}/",
    tags=["模型"],
    summary="读取模型所有记录",
)
async def read(
    model_name: str, params: Annotated[Params, Depends()], db: Session = Depends(get_db)
):
    """读取所有记录"""
    model = models_registry.get(model_name)
    pydantic_model = pydantic_models_registry.get(model_name)

    set_page(Page[pydantic_model])
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return paginate(db, select(model).order_by(desc(model.id)), params=params)


@router.get("/{model_name}/{model_id}", tags=["模型"], summary="读取模型单条记录")
async def read_one(model_name: str, model_id: int, db: Session = Depends(get_db)):
    """读取单条记录"""
    model = models_registry.get(model_name)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return crud.get_model_item(db, model, model_id)


@router.put("/{model_name}/{model_id}", tags=["模型"], summary="更新模型记录")
async def update(
    model_name: str, model_id: int, update_data: dict, db: Session = Depends(get_db)
):
    """更新记录"""
    model = models_registry.get(model_name)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return crud.update_model_item(db, model, model_id, update_data)


@router.delete("/{model_name}/{model_id}", tags=["模型"], summary="删除模型记录")
async def delete(model_name: str, model_id: int, db: Session = Depends(get_db)):
    """删除记录"""
    model = models_registry.get(model_name)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return crud.delete_model_item(db, model, model_id)
