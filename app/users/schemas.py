from pydantic import BaseModel


class SUserAuth(BaseModel):
    login: str
    password: str