from flask import current_app
from db.database import db
from sqlalchemy import inspect
from core.utils import merge

class Base(db.Model):
    __tablename__ = 'base'
    __abstract__ = True

    def update(self, updates):
        # TODO: recursively update the properties so this works in the nested case as well
        for k, v in updates.items():
            setattr(self, k, v)

        current_app.db.session.add(self)
        current_app.db.session.commit()

# TODO: only works on one to many relatinpships. WIll not return a one - one relationship
    def to_dict(self):
        columns = {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
        relationships = {}
        for c in inspect(self).mapper.relationships:

            attr = getattr(self, c.key)
            if(type(attr).__name__ == 'InstrumentedList'):
                relationships[c.key] = attr
                relationships[c.key] = [i.to_dict() for i in relationships[c.key]]
        return merge(columns, relationships)
        # if len(relationships > 0):
            # return merge(columns, c)
        # else:
        #     return columns
