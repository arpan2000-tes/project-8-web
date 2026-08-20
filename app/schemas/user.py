from pydantic import BaseModel , EmailStr

class SignUpSchema(BaseModel):
    name: str = "user123"
    email: str = "emailuser123@gmail.com"
    password: str = "pass123user"
    
class SignInSchema(BaseModel):
    email: str = "emailuser123@gmail.com"
    password: str = "pass123user"
    
class VerifyOTPSchema(BaseModel):
    email: EmailStr
    otp_code: str