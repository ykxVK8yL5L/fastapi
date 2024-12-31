from sqlalchemy import desc
from sqlalchemy.orm import Session


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
