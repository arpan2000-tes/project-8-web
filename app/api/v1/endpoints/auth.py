from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from app.api.deps import get_db
from app.schemas.user import SignInSchema, SignUpSchema , VerifyOTPSchema, ResendOTPSchema
from app.models.user import user as DBUser
from app.core.security import (
   sign, decode, 
   generate_otp_secret, generate_otp_code, 
   verify_otp_code, send_otp_email )

router = APIRouter()

@router.post("/signup")
def sign_up(request: SignUpSchema, db: Session = Depends(get_db)):
   user_exists = db.query(DBUser).filter(DBUser.email == request.email).first()
   if user_exists:
      raise HTTPException(status_code=400, detail="Email already registered")
      
   secret_key = generate_otp_secret()
   
   new_user = DBUser(
      name=request.name,
      email=request.email,
      password=request.password, 
      otp_secret=secret_key,     
      is_verified=False          
   )
   
   db.add(new_user)
   db.commit()
   db.refresh(new_user)
   
   code_to_send = generate_otp_code(secret_key)
   send_otp_email(receiver_email=request.email, otp_code=code_to_send)
   
   token = sign(new_user.email)
   
   return {"message": "User registered successfully. Please check your email for OTP.",
         "token" : token}

   

@router.post("/signin")
def sign_in(request: SignInSchema, db: Session = Depends(get_db)):
   user = db.query(DBUser).filter(DBUser.email == request.email).first()
   if not user:
      raise HTTPException(status_code=400, detail="email not reqistered")
   
   if  user.password != request.password:
      raise HTTPException(status_code=400, detail="incorrect password")
   
   if not user.is_verified:
      raise HTTPException(
         status_code=403, 
         detail="Akun Anda belum diverifikasi. Silakan lakukan verifikasi OTP terlebih dahulu."
      )
   
   token = sign(user.email)
   return {"token": token}
   
@router.post("/authtest")
def auth_test(decode: str = Depends(decode)):
   return decode

@router.post("/verifyOTP")
def verify_otp(request: VerifyOTPSchema, db: Session = Depends(get_db)):
   user = db.query(DBUser).filter(DBUser.email == request.email).first()
   if not user:
      raise HTTPException(status_code=404, detail="User not found")
   
   if user.is_verified:
      return {"message": "User is already verified"}

   is_valid = verify_otp_code(user.otp_secret, request.otp_code)
   
   if not is_valid:
      raise HTTPException(status_code=400, detail="Invalid or expired OTP code")

   user.is_verified = True
   user.otp_secret = None
   db.commit()
   
   return {"message": "Email verified successfully!"}

@router.post("/resendOTP")
def resend_otp(request: ResendOTPSchema, db: Session = Depends(get_db)):
   user = db.query(DBUser).filter(DBUser.email == request.email).first()
   if not user:
      raise HTTPException(status_code=404, detail="User tidak ditemukan")
   
   if user.is_verified:
      raise HTTPException(status_code=400, detail="Akun sudah terverifikasi")

   # Buat secret baru jika kosong, lalu generate kode baru
   if not user.otp_secret:
      user.otp_secret = generate_otp_secret()
      
   code_to_send = generate_otp_code(user.otp_secret)
   send_otp_email(receiver_email=user.email, otp_code=code_to_send)
   
   db.commit()
   return {"message": "Kode OTP baru telah berhasil dikirim ke email kamu."}
