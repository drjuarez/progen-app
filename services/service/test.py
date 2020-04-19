
from models.ProjectModel import ProjectModel
from core.appInitializer import create_app

t = {
    'name': 'daves dope dive',
    'periodType': 'month',
    'numberPeriods': 60,
    'financings': [{
        'propertyCost': 100000,
        'interestRate': .1,
        'equityDown': 20000,
        'loanMaturity': 30
    }],
    'revenues': [{
        'duration': 20,
        'vacancyRate': 90,
        'rentalIncome': 1500,
        'annualOpEx': 100,
        'opex': 90
    }]
}

create_app().app_context().push()

pro = ProjectModel(t)
print(vars(pro))
# pro.save()
# p.initialize_project(financing_values, property_cost_values)


# from Project import Project
#
# name = 'test'
# n_periods = 10
# period_type = 'year'
# p = Project(name, period_type, n_periods)
#
# financing_values = {
#     'loan_maturity': 30,
#     'property_cost': 250000,
#     'equity_down': 60000,
#     'interest_rate': .05
# }
#
# p.calculate_values(financing_values)
#
# # TODO: Value of property at refinance;
#  # --- What percentage of Refinance
#  # ---
# new_assumptions = {
#     'type': 'refinance',
#     'interest_rate': .05,
# }
#
# p.update_financing(new_assumptions,  4)
# p.generate_statement()

