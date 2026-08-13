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
