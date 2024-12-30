from fastapi import APIRouter

router = APIRouter()


@router.get("/users")
async def get_users():
    return [{"username": "user1"}, {"username": "user2"}]


# @app.get("/users", response_model=Page[schemas.User])
# async def read_users(kw: str = "", db: Session = Depends(get_db)):
#     return paginate(
#         db,
#         select(models.User)
#         .where(models.User.username.like(f"%{kw}%"))
#         .order_by(desc(models.User.id)),
#     )
