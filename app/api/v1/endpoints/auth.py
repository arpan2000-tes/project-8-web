from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.core.security import decode, sign
from app.schemas.user import SignInSchema, SignUpSchema

router = APIRouter()

from app.models.user import user as DBUser

@router.post("/signup")
def sign_up(request: SignUpSchema, db: Session = Depends(get_db)):
   user_exists = db.query(DBUser).filter(DBUser.email == request.email).first()
   if user_exists:
         raise HTTPException(status_code=400, detail="email already registered")
      
   new_user = DBUser(
      name = request.name,
      email = request.email,
      password = request.password
   )
   db.add(new_user)
   db.commit()
   db.refresh(new_user)

   token = sign(new_user.email)
   return {"token": token}

@router.post("/signin")
def sign_in(request: SignInSchema, db: Session = Depends(get_db)):
   user = db.query(DBUser).filter(DBUser.email == request.email).first()
   if not user:
      raise HTTPException(status_code=400, detail="email not reqistered")
   
   if  user.password != request.password:
      raise HTTPException(status_code=400, detail="incorrect password")
   
   token = sign(user.email)
   return {"token": token}
   
@router.post("/authtest")
def auth_test(decode: str = Depends(decode)):
   return decode