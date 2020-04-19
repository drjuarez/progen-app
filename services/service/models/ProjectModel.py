from models.updater import updater
from models.FinancingModel import FinancingModel
from models.RevenueModel import RevenueModel
from dao.ProjectDao import ProjectDao
import pandas as pd

period_types = ['month', 'year']

class ProjectModel:
    def __init__(self, initializer):
        self.name = initializer['name']
        self.periodType = initializer['periodType']
        self.numberPeriods = int(initializer['numberPeriods'])
        self.financings = []
        self.revenues = []
        try:
            self.currency = initializer['currency']
        except KeyError:
            self.currency = 'USD'

        if initializer['financings']:
            for financing in initializer['financings']:
                financing['periodType'] = self.periodType
                financing['loanMaturity'] = financing['loanMaturity'] if financing['loanMaturity'] else self.numberPeriods
                self.financings.append(FinancingModel(financing))

        if initializer['revenues']:
            for revenue in initializer['revenues']:
                revenue['duration'] = revenue.get('duration', self.numberPeriods)
                self.revenues.append(RevenueModel(revenue))
        if len(self.financings) == 0 and len(self.revenues) == 0:
            raise ValueError("no valid inputs received from project. check call to ProjectModel.__init__")
        self.proforma = self.generate_statement()

    #  ProjectModel is top level calculator for building out the Income Statement
    def generate_statement(self):
        schedules = []
        for financing in self.financings:
            financing.init_payment_schedule()
            schedules.append(financing.schedule)

        for revenue in self.revenues:
            revenue.init_revenue_schedule()
            schedules.append(revenue.schedule)

        # proforma = pd.DataFrame(columns=make_period_names(self.numberPeriods, self.periodType))
        proforma = pd.concat(schedules, axis=1)
        proforma = proforma.fillna(-1)
        return proforma.to_dict(orient='list')

    def to_dict(self):
        out = {}
        for k, v in self.__dict__.items():
            print("----> ", k)
            if k == "financings" or k == "revenues":
                nested_attrs = []
                for nested in v:
                    nested_attrs.append(nested.to_dict())
                out[k] = nested_attrs
            else:
                out[k] = v
        return out

    def save(self):
        ProjectDao.save(self)


    @staticmethod
    def validate(payload):
        # print("project dao now", payload)
        # payload = merge(payload, projectDefault)
        if payload['name'] == '' or payload['name'] == None:
            raise_payload_validation('name', payload['name'], 'Project')

        payload['periodType'] = payload['periodType'].lower()
        if payload['periodType'] not in ProjectDao.period_types:
            raise_payload_validation('periodType', payload['periodType'], 'Project')
        return payload


def make_period_names(number_of_periods, period_type):
    period_names = []
    for i in range(1, number_of_periods):
        period_names.append('{}{}'.format(period_type, i))
    return period_names


