class Input(object):
    def set_attributes(self, properties_to_set, has_been_touched=False):
        for property, value in properties_to_set.items():
            try:
                setattr(self, property, value)
                # self[property] = (value, has_been_touched)
            except KeyError as k:
                print('invalid property', k)

class Financing(Input):
    def __init__(self):
        self.has_been_touched = False
        self.loan_maturity = (0, False)
        self.equity_available = (0, False)
        self.loan_rate = (0, False)
        self.payment = (0, False)
        self.loan_balance = (0, False)

    # def initialize_payment_schedule(self):



class PropertyCost(Input):
    def __init__(self):
        self.has_been_touched = False
        self.land_cost = (0, False)
        self.plot_size = (0, False)

    def update_value_based_on(self, last_period):
        self.land_cost = last_period.land_cost * ()
