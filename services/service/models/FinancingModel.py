from models.constants import PERIOD_TYPES
import pandas as pd
import numpy as np
from core.errors import stupid_args_err, raise_payload_validation
from core.utils import calc_effective_interest_rate, calculate_mortgage_pmt


class FinancingModel(object):
    def __init__(self, initializer):
        initializer = FinancingModel.validate(initializer)
        self.loanMaturity = initializer['loanMaturity']
        self.interestRate = calc_effective_interest_rate(
            initializer['interestRate'],
            PERIOD_TYPES[initializer['periodType']]
         )

        self.equityDown = initializer['equityDown']
        self.initialDebt = initializer['propertyCost'] - self.equityDown
        self.payment = calculate_mortgage_pmt(
            self.initialDebt,
            self.interestRate,
            self.loanMaturity
        )

        self.schedule = pd.DataFrame()

    def init_payment_schedule(self):
        init = np.zeros(self.loanMaturity)
        f_df = pd.DataFrame({
            'beginningPrincipal': init,
            'interestPayment': init,
            'principalPayment': init,
            'endingPrincipal': init
        })
        f_df.loc[0, 'beginningPrincipal'] = self.initialDebt
        f_df.loc[0, 'interestPayment'] = self.initialDebt * self.interestRate
        f_df.loc[0, 'principalPayment'] = self.payment - f_df.loc[0, 'interestPayment']
        f_df.loc[0, 'endingPrincipal'] = f_df.loc[0, 'beginningPrincipal'] - f_df.loc[0, 'principalPayment']
        self.schedule = f_df
        self.build_financing_schedule(from_period=1)

    def build_financing_schedule(self, from_period=0):
        if(from_period < 1 or from_period > self.loanMaturity):
            stupid_args_err(from_period, 'build_financing_schedule')

        for i in range(from_period, self.loanMaturity):
            self.schedule.loc[i, 'beginningPrincipal'] = \
                self.schedule.loc[i - 1, 'endingPrincipal']

            self.schedule.loc[i, 'interestPayment'] = \
                self.schedule.loc[i, 'beginningPrincipal'] * self.interestRate

            self.schedule.loc[i, 'principalPayment'] = \
                self.payment - self.schedule.loc[i, 'interestPayment']

            self.schedule.loc[i, 'endingPrincipal'] = \
                self.schedule.loc[i, 'beginningPrincipal'] - self.schedule.loc[i, 'principalPayment']

    def to_dict(self):
        out = {}
        for k, v in self.__dict__.items():
            if k == "schedule":
                continue
            out[k] = v
        return out

    @staticmethod
    def validate(payload):
        try:
            payload['loanMaturity'] = int(payload['loanMaturity'])
            payload['interestRate'] = float(payload['interestRate'])
            payload['equityDown'] = int(payload['equityDown'])
            return payload
        except Exception as e:
            raise ValueError("bad arguments given to FinancingModel.__init__. check call")
