import bcrypt
import models
from util import encrypt, hash_password

"""Run tests with:
python -m pytest tests/
"""


def drop_and_recreate_tables():
    """Function for dropping all tables during testing, good for clearing db after when
    modifying data during test.
    """
    models.Base.metadata.drop_all(bind=models.engine)
    models.Base.metadata.create_all(bind=models.engine)


def create_fake_user(db, email="test@email.com"):
    salt = bcrypt.gensalt()
    hashed_password = hash_password("password", salt=salt)

    db_user = models.User(
        email=email,
        password=str(hashed_password, "utf-8"),
        first_name="Test",
        last_name="User",
        salt=salt,
    )
    db.add(db_user)
    return db_user


def create_fake_entry(db, user, title="TestEntry"):
    content = encrypt("Hello World")

    db_entry = models.Entry(
        title=title,
        content=content,
        emoji=None,
        emoji_name=None,
        owner_id=user.id,
    )
    db.add(db_entry)
    return db_entry


def create_fake_resp(id="1"):
    class Empty:
        pass

    response = Empty()
    choice = Empty()
    message = Empty()
    message.content = "test prompt"
    choice.message = message
    response.choices = [choice]
    response.id = id

    return response
