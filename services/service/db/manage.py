import sys
import os.path
parent = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent)
from flask_migrate import Manager
from flask_migrate import Migrate, MigrateCommand
import sys
import os.path
from core.appInitializer import create_app
from db.database import db
from alembic.util import CommandError

# this should give you absolute location of this file folder.
parent = os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
sys.path.append(parent)
app = create_app()

app.config.from_object(os.environ['APP_SETTINGS'])
migrate = Migrate(app, db, compare_type=True)

#  Need to import code into scope to run db
manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    try:
        manager.run()
    except CommandError as e:
        print("Received Command Error from Migration: ", e)
        print("Skipping .\n.\n.\n.\n.")
