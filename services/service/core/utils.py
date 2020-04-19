def calc_effective_interest_rate(r, n):
    return (1 + (r / n))**n - 1

def calculate_mortgage_pmt(debt, r, n):
    return (r * debt * (1 + r)**n) / ((1 + r)**n - 1)

def calc_vacancy_loss(rentalIncome, periodsPerYear, vacancyRate):
    return (rentalIncome*periodsPerYear*vacancyRate) # Returns the amount lost to vacancy

def calc_net_income(rentalIncome, periodsPerYear, annualOpEx, vacancyLoss):
    return (rentalIncome*periodsPerYear-annualOpEx-vacancyLoss)


def merge(source, destination):
    for key, value in source.items():
        if isinstance(value, dict):
            # get node or create one
            node = destination.setdefault(key, {})
            merge(value, node)
        else:
            destination[key] = value

    return destination
