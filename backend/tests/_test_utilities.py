import bcrypt
import models
from util import hash_password

"""Run tests with:
python -m pytest tests/
"""


def drop_and_recreate_tables():
    """Function for dropping all tables during testing, good for clearing db after when
    modifying data during test.
    """
    models.Base.metadata.drop_all(bind=models.engine)
    models.Base.metadata.create_all(bind=models.engine)


def create_fake_user(db):
    salt = bcrypt.gensalt()
    hashed_password = hash_password("password", salt=salt)

    db_user = models.User(
        email="test@email.com",
        password=str(hashed_password, "utf-8"),
        first_name="Test",
        last_name="User",
        salt=salt,
    )
    db.add(db_user)
    return db_user


def create_fake_entry(db, user):
    db_entry = models.Entry(
        title="Test Entry",
        content="Hello World",
        emoji=None,
        emoji_name=None,
        owner_id=user.id,
    )
    db.add(db_entry)
    return db_entry
