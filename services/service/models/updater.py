from core.utils import calc_effective_interest_rate, calculate_mortgage_pmt

class updater(object):
    @staticmethod
    def financing_change(financing, new_inputs, from_period):
        if from_period < 2:
            stupid_args_err('from_period', 'run_update')

        if new_inputs['type'] == 'refinance':
            outstanding_debt = financing.vals.loc[from_period - 1, 'eop_principal']
            periods_remaining = financing.loan_maturity - from_period

            financing.interest_rate = calc_effective_interest_rate(financing.interest_rate, periods_remaining)
            financing.payment = calculate_mortgage_pmt(outstanding_debt, financing.interest_rate, periods_remaining)
            financing.build_financing_schedule(from_period)
