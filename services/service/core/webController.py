from flask import Blueprint, jsonify, request, current_app
from dao.ProjectDao import ProjectDao
from models.ProjectModel import ProjectModel
from dao.FinancingDao import FinancingDao
from core import modelController


ProjectBlueprint = Blueprint('project', __name__, url_prefix='/projects')


@ProjectBlueprint.route('/', methods=['GET'])
def handle_get_projects():
    if request.method == 'GET':
        projects = modelController.get_projects()
        datp = [p.to_dict() for p in projects]
        return jsonify(datp)

@ProjectBlueprint.route('/run', methods=['POST'], strict_slashes=False)
def handlerun():
    payload = request.get_json()
    project_model = ProjectModel(payload)
    # project_model = modelController.create_new_project(payload)
    return jsonify(project_model.to_dict())

@ProjectBlueprint.route('/init', methods=['POST'], strict_slashes=False)
def handleinit():
    payload = request.get_json()
    project = ProjectDao.create_new(payload)
    # project = modelController.create_new_project(payload)
    return jsonify(project.to_dict())


@ProjectBlueprint.route('/income_statement', methods=['POST'], strict_slashes=False)
def handle_make_is():
    project = request.get_json()
    income_statement = modelController.make_is(project)
    return income_statement


# @ProjectBlueprint.route('/<project_id>', strict_slashes=False, methods=['GET', 'PUT', 'PATCH'])
# def handle_get_project(project_id):
#     project = modelController.get_project(project_id)
#
#     if request.method == 'GET':
#         return jsonify(project.to_dict())
#
#     if request.method == 'PUT':
#         updates = request.get_json()
#         project.update(updates)
#         return jsonify(project.to_dict())
#
#     if request.method == 'PATCH':
#         # TODO: Implement the patch request
#         print("implement my itchb ass")


@ProjectBlueprint.route('/<project_id>/is', methods=['GET'])
def handle_get_is(project_id):
    cf_statement = modelController.get_is(project_id)
    return jsonify(cf_statement)
