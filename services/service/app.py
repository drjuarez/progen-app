import os
import sys
from core.appInitializer import create_app
from flask_cors import CORS, cross_origin

port = os.getenv("SERVICE_PORT")
app = create_app()

if __name__ == '__main__':
    print("starting app")
    app.run(host='0.0.0.0', port=port)
