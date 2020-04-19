import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

def create_session():
    print("CREATING", os.environ['DATABASE_URL'])
    e = create_engine(os.environ['DATABASE_URL'])
    # create a configured "Session" class for interacting with DB
    s = sessionmaker(bind=e)
    return s()
