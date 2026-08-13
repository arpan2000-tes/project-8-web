from Fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import SignUpSchema, SignInSchema
from app.core.security import sign, decode

router = APIRouter()

@router.post("/signup")
def sign_up(request: SignUpSchema):
  for user in userlist:
    if user.email == request.email:
      raise HTTPException(status_code=400, detail="email already registered")
  userlist.append(request)

token = sign(request.email)

for user in userlist:
  print(user.name, user.email, user.password)

return token

@router.post("/signin")
def sign_in(request: SignInSchema):
   for user in userlist:
      if user.email == request.email:
         if user.password == request.password:
            token = sign(user.email)
            return token
         else:
            raise HTTPException(status_code=400, detail="incorrect password")
   raise HTTPException(status_code=400, detail="emailnl not reqistered")
   
@router.post("/authtest")
def auth_test(decode: str = Depends(decode)):
   return decode