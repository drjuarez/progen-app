import sys
import os.path
parent = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent)
from db.database import create_session
from dao.ProjectDao import ProjectDao
from dao.FinancingDao import FinancingDao
from dao.RevenueDao import RevenueDao


test_projects = [
    {
        "financings": [
            {
                "equityDown": 30000,
                "initialDebt": 20000,
                "interestRate": 0.1,
                "loanMaturity": 12,
            }
        ],
        "revenue": [
            {
                "analysisDuraion": 2000,
                "annualOpEx": 3000,
                "id": 2,
                "rentalIncome": 2000,
                "growthRate": 0.02,
                "vacancyRate": 0.05
            }
        ],
        "initPropertyCost": 20000,
        "name": "test",
        "numberPeriods": 12,
        "periodType": "month"
    },
    {
        "financings": [
            {
                "equityDown": 200000,
                "initialDebt": 20000,
                "interestRate": 0.1,
                "loanMaturity": 12,
            }
        ],
        "revenue": [
            {
                "analysisDuraion": 2000,
                "annualOpEx": 3000,
                "id": 2,
                "rentalIncome": 2000,
                "growthRate": 0.02,
                "vacancyRate": 0.05
            }
        ],
        "initPropertyCost": 1000000,
        "name": "Dope ass hauz",
        "numberPeriods": 120,
        "periodType": "month"
    },
]

db_connection = create_session()
t = db_connection.query(ProjectDao).delete()
db_connection.query(FinancingDao).delete()
db_connection.commit()
print("------- MIGRATE: Tables Cleared\n\n")

records = 0
for p in test_projects:
    project = ProjectDao(p)
    db_connection.add(project)
    db_connection.commit()

    f_payload = p['financings'][0]
    f_payload['initialDebt'] = project.initPropertyCost
    f_payload['projectId'] = project.id
    f = FinancingDao(f_payload)
    db_connection.add(f)
    db_connection.commit()

    r_payload = p['revenue'][0]
    r_payload['projectId'] = project.id
    f = RevenueDao(r_payload)
    db_connection.add(f)
    db_connection.commit()
    records += 1

print("------- MIGRATE: {} Records Loaded".format(records))
