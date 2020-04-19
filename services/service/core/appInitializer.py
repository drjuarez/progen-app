from db.database import db
from core.webController import ProjectBlueprint
import os
from flask import Flask, current_app
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, support_credentials=True)
    app.url_map.strict_slashes = False
    app.config.from_object(os.environ['APP_SETTINGS'])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
    db.init_app(app)
    with app.app_context():
        current_app.db = db
        db.create_all()
    app.register_blueprint(ProjectBlueprint)

    #  Rollback migrations that get fucked up
    @app.teardown_request
    def teardown_request(exception):
        if exception:
            db.session.rollback()
        db.session.remove()

    @app.after_request
    def set_cors(response):
        # response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    return app
