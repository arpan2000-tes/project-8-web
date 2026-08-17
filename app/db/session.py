from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://neondb_owner:npg_IUfJ29VsyYxk@ep-noisy-lab-ax74s2yp-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

Engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit= False, autoflush= False, bind= Engine)