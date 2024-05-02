from unittest import TestCase, mock
import uuid
from fastapi.testclient import TestClient
import jwt
from config import HASH_ALGORITHM, JWT_SECRET_KEY
from dependencies import get_db
import models
from _test_utilities import (
    create_fake_user,
    drop_and_recreate_tables,
    create_fake_entry,
)
from main import app
from util import create_token


class TestGetEntries(TestCase):
    def setUp(self):
        self.db_session = models.SessionLocal()
        self.client = TestClient(app)

        def override_get_db():
            yield self.db_session

        app.dependency_overrides[get_db] = override_get_db
        self.user = create_fake_user(db=self.db_session, email="user1@email.com")
        self.db_session.flush()
        self.entry1 = create_fake_entry(db=self.db_session, user=self.user)
        self.entry2 = create_fake_entry(
            db=self.db_session, user=self.user, title="entry2"
        )
        self.token1 = create_token(self.user)
        self.user2 = create_fake_user(db=self.db_session, email="user2@email.com")
        self.db_session.flush()
        self.token2 = create_token(self.user2)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()

    # Test Cases:
    def test_works(self):
        response = self.client.get(
            f"/entries/",
            headers={"authorization": f"Bearer {self.token1}"},
        )

        assert response.status_code == 200
        resp_entries = response.json()
        assert len(resp_entries["entries"]) == 2

    def test_works_no_entries(self):
        response = self.client.get(
            f"/entries/",
            headers={"authorization": f"Bearer {self.token2}"},
        )

        assert response.status_code == 200
        resp_entries = response.json()
        assert len(resp_entries["entries"]) == 0


class TestGetEntry(TestCase):
    def setUp(self):
        drop_and_recreate_tables()

        self.db_session = models.SessionLocal()
        self.client = TestClient(app)

        def override_get_db():
            yield self.db_session

        app.dependency_overrides[get_db] = override_get_db
        self.user = create_fake_user(db=self.db_session, email="user1@email.com")
        self.db_session.flush()
        self.entry1 = create_fake_entry(db=self.db_session, user=self.user)
        self.entry2 = create_fake_entry(
            db=self.db_session, user=self.user, title="entry2"
        )
        self.token1 = create_token(self.user)
        self.user2 = create_fake_user(db=self.db_session, email="user2@email.com")
        self.db_session.flush()
        self.token2 = create_token(self.user2)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        response = self.client.get(
            f"/entries/{self.entry1.id}",
            headers={"authorization": f"Bearer {self.token1}"},
        )

        assert response.status_code == 200
        resp_entry = response.json()
        assert resp_entry["entry"]

    def test_fails_not_authenticated(self):
        response = self.client.get(
            f"/entries/{self.entry1.id}",
            headers={"authorization": f"Bearer {self.token2}"},
        )

        assert response.status_code == 401
        resp_entry = response.json()
        assert resp_entry == {"detail": "Cannot view other user entries."}

    def test_fails_no_entry(self):
        fake_uuid = uuid.uuid4()
        response = self.client.get(
            f"/entries/{fake_uuid}",
            headers={"authorization": f"Bearer {self.token1}"},
        )

        assert response.status_code == 404
        resp_entry = response.json()
        assert resp_entry == {"detail": "Entry not found."}


class TestPostEntry(TestCase):
    def setUp(self):
        drop_and_recreate_tables()

        self.db_session = models.SessionLocal()
        self.client = TestClient(app)

        def override_get_db():
            yield self.db_session

        app.dependency_overrides[get_db] = override_get_db
        self.user = create_fake_user(db=self.db_session, email="user1@email.com")
        self.db_session.flush()
        self.token1 = create_token(self.user)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        response = self.client.post(
            f"/entries/",
            headers={"authorization": f"Bearer {self.token1}"},
            json={
                "title": "test title",
                "content": "change in content",
                "emoji": "😏",
                "emoji_name": "smirk",
            },
        )

        assert response.status_code == 200
        resp_entry = response.json()
        assert resp_entry["entry"]["title"] == "test title"
        assert resp_entry["entry"]["content"] == "change in content"
        assert resp_entry["entry"]["emoji"] == "😏"
        assert resp_entry["entry"]["emoji_name"] == "smirk"

    def test_works_fields_set_none(self):
        """This test is for creating blank entries"""
        response = self.client.post(
            f"/entries/",
            headers={"authorization": f"Bearer {self.token1}"},
            json={
                "title": None,
                "content": None,
                "emoji": None,
                "emoji_name": None,
            },
        )

        assert response.status_code == 200
        resp_entry = response.json()
        assert resp_entry["entry"]["title"] == None
        assert resp_entry["entry"]["content"] == None
        assert resp_entry["entry"]["emoji"] == None
        assert resp_entry["entry"]["emoji_name"] == None

    def test_fails_invalid_field(self):
        response = self.client.post(
            f"/entries",
            headers={"authorization": f"Bearer {self.token1}"},
            json={
                "content": "change in content",
                "emoji": "😏",
                "emoji_name": "smirk",
            },
        )

        assert response.status_code == 422
        resp_entry = response.json()
        assert resp_entry == {
            "detail": [
                {
                    "type": "missing",
                    "loc": ["body", "title"],
                    "msg": "Field required",
                    "input": {
                        "content": "change in content",
                        "emoji": "😏",
                        "emoji_name": "smirk",
                    },
                    "url": "https://errors.pydantic.dev/2.6/v/missing",
                }
            ]
        }


class TestPatchEntry(TestCase):
    def setUp(self):
        drop_and_recreate_tables()

        self.db_session = models.SessionLocal()
        self.client = TestClient(app)

        def override_get_db():
            yield self.db_session

        app.dependency_overrides[get_db] = override_get_db
        self.user = create_fake_user(db=self.db_session, email="user1@email.com")
        self.db_session.flush()
        self.entry1 = create_fake_entry(db=self.db_session, user=self.user)
        self.entry2 = create_fake_entry(
            db=self.db_session, user=self.user, title="entry2"
        )
        self.token1 = create_token(self.user)
        self.user2 = create_fake_user(db=self.db_session, email="user2@email.com")
        self.db_session.flush()
        self.token2 = create_token(self.user2)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        response = self.client.patch(
            f"/entries/{self.entry1}",
            headers={"authorization": f"Bearer {self.token1}"},
            json={
                "title": self.entry1.title,
                "content": "change in content",
                "emoji": "😏",
                "emoji_name": "smirk",
            },
        )

        assert response.status_code == 200
        resp_entry = response.json()
        assert resp_entry["entry"]["title"] == self.entry1.title
        assert resp_entry["entry"]["content"] == "change in content"
        assert resp_entry["entry"]["emoji"] == "😏"
        assert resp_entry["entry"]["emoji_name"] == "smirk"

    def test_fails_not_authenticated(self):
        response = self.client.patch(
            f"/entries/{self.entry1.id}",
            headers={"authorization": f"Bearer {self.token2}"},
            json={
                "title": self.entry1.title,
                "content": "change in content",
                "emoji": "😏",
                "emoji_name": "smirk",
            },
        )

        assert response.status_code == 401
        resp_entry = response.json()
        assert resp_entry == {"detail": "Cannot modify other user entries."}

    def test_fails_no_entry(self):
        fake_uuid = uuid.uuid4()
        response = self.client.patch(
            f"/entries/{fake_uuid}",
            headers={"authorization": f"Bearer {self.token1}"},
            json={
                "title": self.entry1.title,
                "content": "change in content",
                "emoji": "😏",
                "emoji_name": "smirk",
            },
        )

        assert response.status_code == 404
        resp_entry = response.json()
        assert resp_entry == {"detail": "Entry not found."}


class TestDeleteEntry(TestCase):
    def setUp(self):
        drop_and_recreate_tables()

        self.db_session = models.SessionLocal()
        self.client = TestClient(app)

        def override_get_db():
            yield self.db_session

        app.dependency_overrides[get_db] = override_get_db
        self.user = create_fake_user(db=self.db_session, email="user1@email.com")
        self.db_session.flush()
        self.entry1 = create_fake_entry(db=self.db_session, user=self.user)
        self.entry2 = create_fake_entry(
            db=self.db_session, user=self.user, title="entry2"
        )
        self.token1 = create_token(self.user)
        self.user2 = create_fake_user(db=self.db_session, email="user2@email.com")
        self.db_session.flush()
        self.token2 = create_token(self.user2)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        response = self.client.delete(
            f"/entries/{self.entry1.id}",
            headers={"authorization": f"Bearer {self.token1}"},
        )

        assert response.status_code == 200
        resp_entry = response.json()
        assert resp_entry == {"deleted entry": str(self.entry1.id)}

    def test_fails_not_authenticated(self):
        response = self.client.get(
            f"/entries/{self.entry1.id}",
            headers={"authorization": f"Bearer {self.token2}"},
        )

        assert response.status_code == 401
        resp_entry = response.json()
        assert resp_entry == {"detail": "Cannot view other user entries."}

    def test_fails_no_entry(self):
        fake_uuid = uuid.uuid4()
        response = self.client.get(
            f"/entries/{fake_uuid}",
            headers={"authorization": f"Bearer {self.token1}"},
        )

        assert response.status_code == 404
        resp_entry = response.json()
        assert resp_entry == {"detail": "Entry not found."}
