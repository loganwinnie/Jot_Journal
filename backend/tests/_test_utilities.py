import bcrypt
import models
from util import hash_password


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
