from models.constants import PERIOD_TYPES
import pandas as pd
import numpy as np
from core.errors import stupid_args_err
from core.utils import calc_effective_interest_rate, calculate_mortgage_pmt, calc_vacancy_loss, calc_net_income

import pandas as pd
import numpy as np
import pdb

class RevenueModel(object):
    def __init__(self, initializer):
        self.rentalIncome = initializer['rentalIncome']
        self.annualRent = self.rentalIncome * 12
        self.vacancyRate = initializer['vacancyRate']
        self.opex = initializer['opex']
        self.duration = initializer['duration']
        self.growthRate = initializer.get('growthRate', 0)
        self.vacancyLoss = calc_vacancy_loss(self.rentalIncome, 12, self.vacancyRate)
        self.netIncome = calc_net_income(self.rentalIncome, 12, self.opex, self.vacancyLoss)
        self.schedule = pd.DataFrame()

    def init_revenue_schedule(self):
        init = np.zeros(self.duration)
        f_df = pd.DataFrame({
            'annualRent': init,
            'vacancyLoss': init,
            'opex': init,
            'netIncome': init
        })
        f_df.loc[0, 'annualRent'] = self.annualRent
        f_df.loc[0, 'vacancyLoss'] = self.vacancyLoss
        f_df.loc[0, 'opex'] = self.opex
        f_df.loc[0, 'netIncome'] = f_df.loc[0, 'annualRent'] - f_df.loc[0, 'vacancyLoss'] - f_df.loc[0, 'opex']
        self.schedule = f_df
        self.build_revenue_schedule(from_period=1)

    def build_revenue_schedule(self, from_period=0):
        if(from_period < 1 or from_period > self.duration):
            stupid_args_err(from_period, 'build_revenue_schedule')

        for i in range(from_period, self.duration):
            self.schedule.loc[i, 'annualRent'] = \
                self.schedule.loc[i - 1, 'annualRent'] * (1 + self.growthRate)

            self.schedule.loc[i, 'vacancyLoss'] = \
                calc_vacancy_loss(self.schedule.loc[i, 'annualRent'], 1, self.vacancyRate)

            self.schedule.loc[i, 'opex'] = \
                self.schedule.loc[i - 1, 'opex']

            self.schedule.loc[i, 'netIncome'] = \
                calc_net_income(self.schedule.loc[i, 'annualRent'], 1, self.schedule.loc[i, 'opex'], self.vacancyLoss)

    def to_dict(self):
        out = {}
        for k, v in self.__dict__.items():
            if k == "schedule":
                continue
            out[k] = v
        return out
