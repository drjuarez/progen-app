from db.database import db
from core.errors import raise_payload_validation
from dao.base import Base
from sqlalchemy.dialects.postgresql import JSON


class UpdatesDao(Base):

    __tablename__ = 'updates'
    id = db.Column(db.Integer, primary_key=True)
    period = db.Column(db.Integer())
    updates = db.Column(db.ARRAY(JSON))
    projectId = db.Column(db.Integer(), db.ForeignKey('projects.id',
            onupdate="CASCADE",
            ondelete="CASCADE"),
        nullable=False)
