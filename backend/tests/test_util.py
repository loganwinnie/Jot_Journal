from unittest import TestCase

from fastapi import HTTPException
from config import DATABASE_URL, HASH_ALGORITHM, JWT_SECRET_KEY
import models, util
import jwt
from _test_utilities import create_fake_user
import bcrypt
from util import create_token, decrypt, encrypt, hash_password
import pytest

db = models.SessionLocal()


class hashPasswordTestCase(TestCase):

    # Test Cases:

    def test_works(self):
        """Test case works."""
        password = "someValidPassword"
        salt = bcrypt.gensalt()
        hashed = hash_password(password, salt)
        assert isinstance(hashed, bytes)

    def test_bad_salt(self):
        """Test throws Typeerror bad salt."""
        password = "someValidPassword"
        salt = None
        with pytest.raises(
            TypeError,
            match="argument 'salt': 'NoneType' object cannot be converted to 'PyBytes'",
        ):
            hash_password(password, salt)

    def test_bad_password(self):
        """Test throws Attribute error no password."""
        password = None
        salt = bcrypt.gensalt()
        with pytest.raises(
            AttributeError,
            match="'NoneType' object has no attribute 'encode'",
        ):
            hash_password(password, salt)


class authenticate_user(TestCase):
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
        res = util.authenticate_user(self.user.email, "password", self.db_session)
        print(res)
        assert res == self.user

    def test_works_email_wrong_case(self):
        res = util.authenticate_user(
            self.user.email.capitalize(), "password", self.db_session
        )
        print(res)
        assert res == self.user

    def test_fails_account_nonexistent(self):
        with pytest.raises(
            HTTPException,
            match="404: Account does not exist.",
        ):
            util.authenticate_user("wrong email", "password", self.db_session)

    def test_fails_bad_password(self):
        with pytest.raises(
            HTTPException,
            match="400: Invalid email or password.",
        ):
            util.authenticate_user(self.user.email, "badPassword", self.db_session)


class createTokenTestCase(TestCase):
    def setUp(self):
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()

    # Test Cases:

    def test_creates(self):
        token = create_token(data=self.user, expires=20)
        decode = jwt.decode(token, key=JWT_SECRET_KEY, algorithms=[HASH_ALGORITHM])
        assert {
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        } == decode["sub"]


class encryptAndDecryptTestCase(TestCase):
    def setUp(self):
        self.message = "Test encryption message"

    # Test Cases:

    def test_encrypts(self):
        encrypted_message = encrypt(message=self.message)
        assert encrypted_message != self.message

    def test_encrypts(self):
        encrypted_message = encrypt(message=self.message)
        assert encrypted_message != self.message
        decrypted_message = decrypt(encrypted_message=encrypted_message)
        assert decrypted_message == self.message
