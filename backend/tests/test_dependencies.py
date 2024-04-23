from unittest import TestCase
from fastapi import HTTPException
import jwt
from config import HASH_ALGORITHM, JWT_SECRET_KEY
from util import create_token
import pytest, asyncio, models
from _test_utilities import create_fake_user
from dependencies import get_current_user

pytest_plugins = ("pytest_asyncio",)


class testGetCurrentUser(TestCase):
    def setUp(self):
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()

    @pytest.mark.asyncio
    def test_works(self):
        """Gets current user from token"""
        token = create_token(data=self.user, expires=20)
        decode = jwt.decode(token, key=JWT_SECRET_KEY, algorithms=[HASH_ALGORITHM])
        loop = asyncio.get_event_loop()
        current_user = loop.run_until_complete(get_current_user(token=token))
        print("Current User", decode)
        assert {
            "user": decode["sub"],
            "user_id": decode["id"],
        } == current_user

    @pytest.mark.asyncio
    def test_fails_tampered(self):
        """Test throws tampered token."""
        token = create_token(data=self.user, expires=20) + "0"

        with pytest.raises(
            HTTPException,
            match="Failed to authenticate user.",
        ):
            loop = asyncio.get_event_loop()
            current_user = loop.run_until_complete(get_current_user(token=token))
            print(current_user)

    @pytest.mark.asyncio
    def test_fails_incomplete_token(self):
        """Test throws token missing id."""
        encode = {
            "sub": {
                "email": self.user.email,
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
            }
        }
        token = jwt.encode(
            encode,
            JWT_SECRET_KEY,
            algorithm=HASH_ALGORITHM,
        )
        with pytest.raises(
            HTTPException,
            match="Failed to authenticate user.",
        ):
            loop = asyncio.get_event_loop()
            current_user = loop.run_until_complete(get_current_user(token=token))
