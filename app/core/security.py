import pyotp
import os
import smtplib
import secrets
import jwt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = secrets.token_hex(16)
JWT_ALGORITHM = "HS256"


EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_APP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD")


print(JWT_SECRET)

def sign(email):
    payload ={
        "email": email,
    }
    token =jwt.encode(payload,JWT_SECRET, algorithm= JWT_ALGORITHM)
    
    return token

def decode(token):
    try:
        decode_token = jwt.decode(
            token,JWT_SECRET, algorithms=[JWT_ALGORITHM]
        )
        return decode_token
    
    except jwt.PyJWKError:
        raise HTTPException(status_code=401, detail="invalid token")
    
    
def generate_otp_secret() -> str:
    return pyotp.random_base32()

def generate_otp_code(secret: str) -> str:
    totp = pyotp.TOTP(secret, interval=120) # 2 menit
    return totp.now()

def verify_otp_code(secret: str, user_input_code: str) -> bool:
    totp = pyotp.TOTP(secret, interval=120)
    return totp.verify(user_input_code)

def send_otp_email(receiver_email: str, otp_code: str):
    """Fungsi mengirim email OTP"""
    subject = "Kode Verifikasi OTP Anda"
    body = f"Kode OTP Anda adalah: {otp_code}\nKode ini hanya berlaku selama 2 menit."
    
    msg = MIMEMultipart()
    msg['From'] = EMAIL_SENDER
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_APP_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Gagal kirim email: {e}")