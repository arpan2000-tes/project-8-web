from pydantic import BaseModel

class SignUpSchema(BaseModel):
    name: str = "user123"
    email: str = "emailuser123@gmail.com"
    password: str = "pass123user"
    
class SignInSchema(BaseModel):
    email: str = "emailuser123@gmail.com"
    password: str = "pass123user"