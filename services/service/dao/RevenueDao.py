from db.database import db
from core.errors import raise_payload_validation
from dao.base import Base
# from sqlalchemy.dialects.postgresql import JSON


class RevenueDao(Base):

    __tablename__ = 'revenues'
    id = db.Column(db.Integer, primary_key=True)
    rentalIncome = db.Column(db.Integer())
    vacancyRate = db.Column(db.Float())
    opex = db.Column(db.Integer())
    duration = db.Column(db.Integer())
    growthRate = db.Column(db.Float())
    projectId = db.Column(db.Integer(), db.ForeignKey('projects.id',
            onupdate="CASCADE",
            ondelete="CASCADE"),
        nullable=False)

    def __init__(self, payload):
        # payload = RevenueDao.validate(payload)
        self.projectId = int(payload['projectId'])
        self.rentalIncome = int(payload['rentalIncome'])
        self.vacancyRate = float(payload['vacancyRate'])
        self.opex = int(payload['opex'])
        self.duration = int(payload['duration'])
        self.growthRate = float(payload['growthRate'])

    # @staticmethod
    # def validate(payload):
    #     projectId = payload['projectId']
    #     rentalIncome = payload['rentalIncome']
    #     vacancyRate = payload['vacancyRate']
    #     opex = payload['opex']
    #     analysisDuraion = payload['analysisDuraion']
    #     growthRate = payload['growthRate']
    #
    #     # need to implement validation steps
    #     #if(not isinstance(rentalIncome, int)):
    #     #    raise_payload_validation("initialDebt", initialDebt, "Financing")
    #     #if(not isinstance(vacancyRate, float)):
    #     #    raise_payload_validation("loanMaturity", loanMaturity, "Financing")
    #     #if(not isinstance(interestRate, float)):
    #     #    raise_payload_validation("interestRate", interestRate, "Financing")
    #     #if(not isinstance(equityDown, int)):
    #     #    raise_payload_validation("equityDown", equityDown, "Financing")
    #     #if(not isinstance(projectId, int)):
    #     #    raise_payload_validation("projectId", projectId, "Financing")
    #     return payload
