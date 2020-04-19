from db.database import db
from core.errors import raise_payload_validation
from dao.base import Base
# from sqlalchemy.dialects.postgresql import JSON

class FinancingDao(Base):
    __tablename__ = 'financings'
    item_type = 'loan'
    id = db.Column(db.Integer, primary_key=True)
    initialDebt = db.Column(db.Integer())
    loanMaturity = db.Column(db.Integer())
    interestRate = db.Column(db.Float())
    equityDown = db.Column(db.Integer())
    projectId = db.Column(db.Integer(), db.ForeignKey('projects.id',
            onupdate="CASCADE",
            ondelete="CASCADE"),
        nullable=False)

    def __init__(self, payload):
        # payload = FinancingDao.validate(payload)
        self.projectId = int(payload['projectId'])
        self.initialDebt = int(payload['initialDebt'])
        self.loanMaturity = int(payload['loanMaturity'])
        self.interestRate = float(payload['interestRate'])
        self.equityDown = int(payload['equityDown'])

    # @staticmethod
    # def validate(payload):
    #     projectId = payload['projectId']
    #     initialDebt = payload['initialDebt']
    #     loanMaturity = payload['loanMaturity']
    #     interestRate = payload['interestRate']
    #     equityDown = payload['equityDown']
    #     if(not isinstance(initialDebt, int)):
    #         raise_payload_validation("initialDebt", initialDebt, "Financing")
    #     if(not isinstance(loanMaturity, int)):
    #         raise_payload_validation("loanMaturity", loanMaturity, "Financing")
    #     if(not isinstance(interestRate, float)):
    #         raise_payload_validation("interestRate", interestRate, "Financing")
    #     if(not isinstance(equityDown, int)):
    #         raise_payload_validation("equityDown", equityDown, "Financing")
    #     if(not isinstance(projectId, int)):
    #         raise_payload_validation("projectId", projectId, "Financing")
    #     return payload
