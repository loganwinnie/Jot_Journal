from unittest import TestCase, mock
from fastapi.testclient import TestClient
from dependencies import get_db
import models
from _test_utilities import (
    create_fake_user,
    drop_and_recreate_tables,
)
from main import app


class TestRegister(TestCase):
    def setUp(self):
        drop_and_recreate_tables()
        self.db_session = models.SessionLocal()
        self.client = TestClient(app)

        def override_get_db():
            yield self.db_session

        app.dependency_overrides[get_db] = override_get_db

        self.db_session = self.db_session
        self.user = create_fake_user(db=self.db_session)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        response = self.client.post(
            "/auth/register/",
            json={
                "email": "user@email.com",
                "password": "password",
                "first_name": "Test",
                "last_name": "User",
            },
        )
        assert response.status_code == 200
        assert type(response.json()["access_token"]) == str

    def test_fails_duplicate_email(self):
        response = self.client.post(
            "/auth/register",
            json={
                "email": "test@email.com",
                "password": "password",
                "first_name": "Test",
                "last_name": "User",
            },
        )
        assert response.status_code == 400
        assert response.json() == {
            "detail": "An account already exists with this email."
        }

    def test_fails_incomplete_fields(self):
        response = self.client.post(
            "/auth/register",
            json={
                "email": "user@email.com",
                "first_name": "Test",
                "last_name": "User",
            },
        )
        assert response.status_code == 422
        assert response.json() == {
            "detail": [
                {
                    "type": "missing",
                    "loc": ["body", "password"],
                    "msg": "Field required",
                    "input": {
                        "email": "user@email.com",
                        "first_name": "Test",
                        "last_name": "User",
                    },
                    "url": "https://errors.pydantic.dev/2.6/v/missing",
                }
            ]
        }

    def test_fails_misformed_email(self):
        response = self.client.post(
            "/auth/register",
            json={
                "email": "user@bad",
                "password": "password",
                "first_name": "Test",
                "last_name": "User",
            },
        )
        assert response.status_code == 422
        assert response.json() == {
            "detail": [
                {
                    "type": "value_error",
                    "loc": ["body", "email"],
                    "msg": "value is not a valid email address: The part after the @-sign is not valid. It should have a period.",
                    "input": "user@bad",
                    "ctx": {
                        "reason": "The part after the @-sign is not valid. It should have a period."
                    },
                }
            ]
        }


class TestLogin(TestCase):
    def setUp(self):
        drop_and_recreate_tables()
        self.db_session = models.SessionLocal()
        self.client = TestClient(app)

        def override_get_db():
            yield self.db_session

        app.dependency_overrides[get_db] = override_get_db

        self.db_session = self.db_session
        self.user = create_fake_user(db=self.db_session)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        form_data = {
            "username": self.user.email,
            "password": "password",
        }
        response = self.client.post(
            "/auth/token/",
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert response.status_code == 200
        assert type(response.json()["access_token"]) == str

    def test_fails_invalid_password(self):
        form_data = {
            "username": self.user.email,
            "password": "wrong_password",
        }
        response = self.client.post(
            "/auth/token/",
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert response.status_code == 400
        assert response.json() == {"detail": "Invalid email or password."}

    def test_fails_invalid_email(self):
        form_data = {
            "username": "not@a.email",
            "password": "password",
        }
        response = self.client.post(
            "/auth/token/",
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert response.status_code == 404
        assert response.json() == {"detail": "User not found."}

    def test_fails_incomplete_field(self):
        form_data = (
            {
                "username": self.user.email,
            },
        )

        response = self.client.post(
            "/auth/token",
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert response.status_code == 400
        print(response.json())
        assert response.json() == {"detail": "There was an error parsing the body"}
