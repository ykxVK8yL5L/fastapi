from typing import Union
import os
import importlib
from fastapi import FastAPI, Depends, Request, Body, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi_utilities import repeat_at, repeat_every
from sqlalchemy import select, desc
from fastapi_pagination import Page, add_pagination
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from setting.setting import get_settings
from database import get_db, engine
import models, schemas, crud


models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
add_pagination(app)


app.mount("/assets", StaticFiles(directory="assets"), name="static")
templates = Jinja2Templates(directory="templates")
headers = {
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36"
}


# def check_permission(method, api, auth):
#     # The following paths are always allowed:
#     if method == "GET" and api[1:] in ["docs", "openapi.json", "favicon.ico"]:
#         return True
#     # Parse auth header and check scheme, username and password
#     scheme, data = (auth or " ").split(" ", 1)
#     if scheme != "Basic":
#         return False
#     username, password = base64.b64decode(data).decode().split(":", 1)
#     if username == "john" and password == "test123":
#         return True


# @app.middleware("http")
# async def check_authentication(request: Request, call_next):
#     auth = request.headers.get("Authorization")
#     if not check_permission(request.method, request.url.path, auth):
#         return JSONResponse(None, 401, {"WWW-Authenticate": "Basic"})
#     return await call_next(request)


@app.on_event("startup")
@repeat_at(cron="0 0 * * *")  # 每天0点重置下载限额
async def reset_downloads(db: Session = Depends(get_db)):
    print("计划任务...")
    # 手动调用 get_db() 并获取会话
    db_generator = get_db()
    db: Session = next(db_generator)  # 使用 next() 获取会话对象
    try:
        print("数据库连接已打开并开始更新限额")
        crud.update_field_value(db, models.User, "status", 1)
    except Exception as e:
        print(f"更新时发生错误: {e}")
    finally:
        # 关闭数据库会话
        db_generator.close()
        print("数据库连接已关闭")


# @app.on_event("startup")
# @repeat_every(seconds=3)
# async def print_hello():
#     print("hello")


def register_routes(app: FastAPI, routes_package: str):
    # 遍历指定的目录
    for filename in os.listdir(routes_package):
        if filename.endswith(".py") and filename != "__init__.py":
            # 构造模块名并导入模块
            module_name = f"{routes_package.replace('/', '.')}.{filename[:-3]}"
            module = importlib.import_module(module_name)
            # 注册路由
            if hasattr(module, "router"):
                app.include_router(module.router)


# 从 routes 目录加载路由
register_routes(app, "routes")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.jinja2", {"request": request})


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/setting")
def read_setting():
    setting = get_settings()
    # setting.debug_mode = False
    # setting.save()
    return setting
