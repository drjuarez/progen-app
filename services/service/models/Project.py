from Period import Period
import pandas as pd

def calculate_mortgage_pmt(principal, r, n):
    return principal * ((r * (1 + r)**n) / ((1 + r)**n - 1))

class Project(object):
    def __init__(self, name, period_type='months', n_periods=12):
        self.name = name
        self.periods = []
        self.period_type = period_type
        period_names = []

        for n in range(n_periods):
            period_names.append('{}{}'.format(period_type, n))
            self.periods.append(Period())

        self.income_statement = pd.DataFrame(period_names)

    def initialize_project(self, financing, property_cost):
        balance = property_cost['land_cost'] - financing['equity_available']
        pmt = calculate_mortgage_pmt(balance,
            financing['loan_rate'], financing['loan_maturity'])

        for period in periods:
            print(period)


        # first_period = self.periods[0]
        # first_period.set_property_cost(property_cost, False)
        # first_period.initialize_financing(financing)
        # first_period._calculate_loan_balance()
        #
        # # Set toucuhed to False to initialize the income statement
        # self.fill_out_is(1, touched=False)

    def update_period_input():
        print('i will update periods one day')

    def fill_out_is(self, from_period, touched=True):
        # For every property
        for i in range(from_period, len(self.periods)):
            this_period = self.periods[i]
            last_period = self.periods[i-1]
            this_period.calculate_inputs(last_period)
