from models import ProjectModel
from dao.ProjectDao import ProjectDao


def create_new_project(payload):
    project = ProjectDao.save_new(payload)
    return project


def save_project(project):
    project = ProjectDao.save_new(payload)
    return project


def get_projects():
    return ProjectDao.query.all()


def get_project(project_id):
    return ProjectDao.query.get_or_404(project_id)


def make_is(project):
    statement = ProjectModel.generate_statement(project)
    statement['periodType'] = project.periodType
    return statement


def get_is(project_id):
    project = ProjectDao.query.get_or_404(project_id)
    statement = ProjectModel.generate_statement(project)
    statement['periodType'] = project.periodType
    return statement
