from flask import current_app
from db.database import db
from core.errors import raise_payload_validation
from dao.FinancingDao import FinancingDao
from dao.RevenueDao import RevenueDao
from dao.UpdatesDao import UpdatesDao
from dao.base import Base
import pandas as pd


class ProjectDao(Base):
    """
    - Holds Database Object Relational Mapping
    -
    """
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    periodType = db.Column(db.String())
    numberPeriods = db.Column(db.Integer())
    currency = db.Column(db.String())
    financings = db.relationship('FinancingDao', cascade="all,delete", backref='project', lazy=True)
    revenues = db.relationship('RevenueDao', cascade="all,delete", backref='project', lazy=True)
    updates = db.relationship('UpdatesDao', cascade="all,delete", backref='project', lazy=True)

    period_types = ['month', 'year']
    income_statement = pd.DataFrame()

    def __init__(self, initializer):
        self.name = initializer['name']
        self.periodType = initializer['periodType']
        self.numberPeriods = int(initializer['numberPeriods'])
        self.currency = initializer['currency']

    @staticmethod
    def save(project):
        project_attrs = {
            "name": project.name,
            "periodType": project.periodType,
            "numberPeriods": project.numberPeriods,
            "currency": project.currency,
        }

        project_entry = ProjectDao(project_attrs)
        current_app.db.session.add(project_entry)
        current_app.db.session.commit()

        for financing in project.financings:
            fin_attrs = {
                'projectId': project_entry.id,
                'initialDebt': int(financing.initialDebt),
                'loanMaturity': int(financing.loanMaturity),
                'interestRate': float(financing.interestRate),
                'equityDown': int(financing.equityDown),
            }
            fin_entry = FinancingDao(fin_attrs)
            current_app.db.session.add(fin_entry)
            current_app.db.session.commit()

        for revenue in project.revenues:
            rev_attrs = {
                'projectId': project_entry.id,
                'rentalIncome': revenue.rentalIncome,
                'vacancyRate': revenue.vacancyRate,
                'opex': revenue.opex,
                'duration': revenue.duration,
                'growthRate': revenue.growthRate,
            }
            rev_entry = RevenueDao(rev_attrs)
            current_app.db.session.add(rev_entry)
            current_app.db.session.commit()

        return project

    @staticmethod
    def save_new(payload):
        payload = ProjectDao.validate(payload)
        project = ProjectDao(payload)
        current_app.db.session.add(project)
        current_app.db.session.commit()

        financing_payload = payload['financings'][0]
        financing_payload['initialDebt'] = financing_payload['propertyCost'] - financing_payload['equityDown']
        financing_payload['projectId'] = project.id
        financing = FinancingDao(financing_payload)
        financing_payload['projectId'] = project.id
        current_app.db.session.add(financing)
        current_app.db.session.commit()

        rev_payload = payload['rev_schedule'][0]
        project.save_revenue_data(rev_payload)
        return project


    def save_revenue_data(self, rev_schedule_payload):
        # cast payload into correct types
        rev_schedule_payload['projectId'] = self.id
        rev_schedule_payload['analysisDuraion'] = self.numberPeriods or rev_schedule_payload['analysisDuraion']
        rev_schedule_payload['growthRate'] = rev_schedule_payload.get('growthRate') or 0
        rev = RevenueDao(rev_schedule_payload)
        current_app.db.session.add(rev)
        current_app.db.session.commit()

    def update(self, updates):
        for k, v in updates.items():
            if(k == 'financing'):
                self.financings[0].update(v)
            setattr(self, k, v)
            current_app.db.session.add(self)
            current_app.db.session.commit()

    # TODO: Move Validate over to the base class
    # @staticmethod
    # def validate(payload):
    #     # print("project dao now", payload)
    #     # payload = merge(payload, projectDefault)
    #     if payload['name'] == '' or payload['name'] == None:
    #         raise_payload_validation('name', payload['name'], 'Project')
    #
    #     payload['periodType'] = payload['periodType'].lower()
    #     if payload['periodType'] not in ProjectDao.period_types:
    #         raise_payload_validation('periodType', payload['periodType'], 'Project')
    #     return payload
