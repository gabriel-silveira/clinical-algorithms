from fastapi import APIRouter
from pydantic import BaseModel
from app.services import account

router = APIRouter(
    prefix="/account",
    tags=["account"],
    dependencies=[],
    responses={404: {"description": "Not found"}},
)


class LoginData(BaseModel):
    username: str
    password: str


@router.post("/login")
async def index(login_data: LoginData):
    user = account.login(login_data.username, login_data.password)

    if user:
        return {
            "id": user['id'],
            "user_name": user['name'],
            "token": '89745cfd55cf9181b253981a65dbafe7',
        }

    return {"user": 0, "token": ''}
