from unittest import TestCase
import uuid
from fastapi import HTTPException
from config import DATABASE_URL, HASH_ALGORITHM, JWT_SECRET_KEY
import models, util, pytest, crud, jwt, bcrypt
from _test_utilities import create_fake_user
from util import create_token, decrypt, encrypt, hash_password

db = models.SessionLocal()


class testGetUser(TestCase):
    def setUp(self):
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()

    # Test Cases:
    def test_works(self):
        user = crud.get_user(self.db_session, user_id=self.user.id)
        assert user == {
            "created_at": self.user.created_at,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "id": self.user.id,
            "last_name": self.user.last_name,
        }

    def test_error_on_not_found(self):
        fake_uuid = uuid.uuid4()
        with pytest.raises(
            HTTPException,
            match="404: User not found.",
        ):
            crud.get_user(self.db_session, user_id=fake_uuid)


class testGetUserByEmail(TestCase):
    def setUp(self):
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()

    # Test Cases:
    def test_works(self):
        user = crud.get_user_by_email(self.db_session, email=self.user.email)
        assert user == {
            "created_at": self.user.created_at,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "id": self.user.id,
            "last_name": self.user.last_name,
        }

    def test_error_on_not_found(self):
        with pytest.raises(
            HTTPException,
            match="404: User not found.",
        ):
            crud.get_user_by_email(self.db_session, email="fake@email.com")


class testCreateUser(TestCase):
    def setUp(self):
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.delete(self.user)
        self.db_session.commit()
        self.db_session.close()

    # Test Cases:
    def test_works(self):
        user = crud.create_user(
            self.db_session,
            user=(
                {
                    "email": "unique@email.com",
                    "password": "user_password",
                    "first_name": "Unique",
                    "last_name": "User",
                }
            ),
        )
        assert bool(user) == True
        self.db_session.delete(user)
        self.db_session.commit()
