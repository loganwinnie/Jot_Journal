from unittest import TestCase, mock
from fastapi.testclient import TestClient
import jwt
from config import HASH_ALGORITHM, JWT_SECRET_KEY
from dependencies import get_db
import models
from _test_utilities import (
    create_fake_user,
    drop_and_recreate_tables,
)
from main import app
from util import create_token


class TestGetUsers(TestCase):
    def setUp(self):
        self.db_session = models.SessionLocal()
        self.client = TestClient(app)

        def override_get_db():
            yield self.db_session

        app.dependency_overrides[get_db] = override_get_db
        self.user = create_fake_user(db=self.db_session, email="user1@email.com")
        self.db_session.flush()
        self.token = create_token(self.user)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()

    # Test Cases:
    def test_works(self):
        response = self.client.get(
            f"/users/",
            headers={"authorization": f"Bearer {self.token}"},
        )

        assert response.status_code == 200
        resp_user = response.json()
        assert resp_user["user"]
