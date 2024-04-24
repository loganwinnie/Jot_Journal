import datetime
from unittest import TestCase, mock
import uuid
from fastapi import HTTPException
import models, pytest, crud
from sqlalchemy.exc import IntegrityError, InvalidRequestError, PendingRollbackError
from _test_utilities import (
    create_fake_user,
    drop_and_recreate_tables,
    create_fake_entry,
)
from crud import openai_client


db = models.SessionLocal()


class TestGetUser(TestCase):
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


class TestGetUserByEmail(TestCase):
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


class TestCreateUser(TestCase):
    def setUp(self):
        drop_and_recreate_tables()
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.close()
        drop_and_recreate_tables()

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

    def test_missing_field(self):
        with pytest.raises(
            KeyError,
            match="email",
        ):
            user = crud.create_user(
                self.db_session,
                user=(
                    {
                        "password": "user_password",
                        "first_name": "Unique",
                        "last_name": "User",
                    }
                ),
            )
            if user:
                self.db_session.delete(user)
                self.db_session.commit()

    def test_fails_unique_constraint(self):
        with pytest.raises(
            (IntegrityError, InvalidRequestError),
        ):
            crud.create_user(
                self.db_session,
                user=(
                    {
                        "email": self.user.email,
                        "password": "user_password",
                        "first_name": "Duplicate",
                        "last_name": "User",
                    }
                ),
            )


class Test_delete_user(TestCase):

    def setUp(self):
        drop_and_recreate_tables()
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.db_session.commit()
        self.db_session.refresh(self.user)

    def tearDown(self) -> None:
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        user = self.user
        crud.delete_user(db=self.db_session, user_id=self.user.id)
        assert not (
            self.db_session.query(models.User).filter(models.User.id == user.id).first()
        )

    def test_fails_non_existent_user(self):
        fake_uuid = uuid.uuid4()
        with pytest.raises(
            HTTPException,
            match="404: User not found.",
        ):
            crud.delete_user(db=self.db_session, user_id=fake_uuid)


class TestCreateUserEntry(TestCase):
    def setUp(self):
        drop_and_recreate_tables()
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        entry = crud.create_user_entry(
            db=self.db_session,
            entry=(
                {
                    "title": "Test Entry",
                    "content": "Hello World",
                    "emoji": "😩",
                    "emoji_name": "Weary Face",
                }
            ),
            user_id=self.user.id,
        )
        assert bool(entry) == True

    def test_can_be_created_all_null(self):
        """This is for creating blank entries for users"""
        entry = crud.create_user_entry(
            db=self.db_session,
            entry=(
                {
                    "title": None,
                    "content": None,
                    "emoji": None,
                    "emoji_name": None,
                }
            ),
            user_id=self.user.id,
        )
        assert bool(entry) == True

    def test_missing_field(self):
        with pytest.raises(
            KeyError,
            match="title",
        ):
            crud.create_user_entry(
                self.db_session,
                entry=(
                    {
                        "content": None,
                        "emoji": None,
                        "emoji_name": None,
                    }
                ),
                user_id=self.user.id,
            )


class TestGetAllUserEntries(TestCase):
    def setUp(self):
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.other_user = create_fake_user(db=self.db_session, email="other@email.com")
        self.db_session.flush()
        self.entry_one = create_fake_entry(
            user=self.user, db=self.db_session, title="Entry One"
        )
        self.entry_two = create_fake_entry(
            user=self.user, db=self.db_session, title="Entry Two"
        )
        self.entry_other = create_fake_entry(
            user=self.other_user, db=self.db_session, title="Entry Other user"
        )
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()

    # Test Cases:
    def test_works(self):
        entries = crud.get_all_user_entries(db=self.db_session, user_id=self.user.id)
        assert len(entries) == 2
        assert entries[0]["id"] == self.entry_one.id
        assert entries[1]["id"] == self.entry_two.id
        # Asserting that other users entry is not present in list
        assert False if self.entry_other in entries else True
        # Asserting that content is decrypted before being returned to user
        assert entries[0]["content"] == "Hello World"


class TestGetEntry(TestCase):
    def setUp(self):
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.other_user = create_fake_user(db=self.db_session, email="other@email.com")
        self.db_session.flush()
        self.entry_one = create_fake_entry(
            user=self.user, db=self.db_session, title="Entry One"
        )
        self.entry_other = create_fake_entry(
            user=self.other_user, db=self.db_session, title="Entry Other user"
        )
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()

    # Test Cases:
    def test_works(self):
        entry = crud.get_entry(
            db=self.db_session, user_id=self.user.id, entry_id=self.entry_one.id
        )
        assert entry["id"] == self.entry_one.id
        assert entry["content"] == "Hello World"

    def test_404_no_entry(self):
        fake_uuid = uuid.uuid4()

        with pytest.raises(
            HTTPException,
            match="Entry not found.",
        ):
            crud.get_entry(db=self.db_session, user_id=self.user.id, entry_id=fake_uuid)

    def test_401_other_user_entry(self):

        with pytest.raises(
            HTTPException,
            match="Cannot view other user entries.",
        ):
            crud.get_entry(
                db=self.db_session, user_id=self.user.id, entry_id=self.entry_other.id
            )


class TestPatchEntry(TestCase):
    def setUp(self):
        drop_and_recreate_tables()
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.other_user = create_fake_user(db=self.db_session, email="other@email.com")
        self.db_session.flush()
        self.entry_one = create_fake_entry(
            user=self.user, db=self.db_session, title="Entry One"
        )
        self.entry_other = create_fake_entry(
            user=self.other_user, db=self.db_session, title="Entry Other user"
        )
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):

        entry = crud.patch_user_entry(
            db=self.db_session,
            entry={"content": "updated content"},
            user_id=self.user.id,
            entry_id=self.entry_one.id,
        )

        assert entry["id"] == self.entry_one.id
        assert entry["content"] == "updated content"

    def test_updated_at_updates(self):
        timestamp = datetime.datetime.now(
            tz=datetime.timezone(datetime.timedelta(days=-1, seconds=72000))
        )
        entry = crud.patch_user_entry(
            db=self.db_session,
            entry={"content": "updated content"},
            user_id=self.user.id,
            entry_id=self.entry_one.id,
        )
        self.db_session.flush()
        assert entry["id"] == self.entry_one.id
        assert entry["updated_at"].date() >= timestamp.date()

    def test_404_no_entry(self):
        fake_uuid = uuid.uuid4()

        with pytest.raises(
            HTTPException,
            match="Entry not found.",
        ):
            crud.patch_user_entry(
                db=self.db_session,
                entry={"content": "updated content"},
                user_id=self.user.id,
                entry_id=fake_uuid,
            )

    def test_401_other_user_entry(self):

        with pytest.raises(
            HTTPException,
            match="401: Cannot modify other user entries.",
        ):
            crud.patch_user_entry(
                db=self.db_session,
                entry={"content": "updated content"},
                user_id=self.user.id,
                entry_id=self.entry_other.id,
            )


class TestDeleteEntry(TestCase):
    def setUp(self):
        drop_and_recreate_tables()
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.other_user = create_fake_user(db=self.db_session, email="other@email.com")
        self.db_session.flush()
        self.entry_one = create_fake_entry(
            user=self.user, db=self.db_session, title="Entry One"
        )
        self.entry_other = create_fake_entry(
            user=self.other_user, db=self.db_session, title="Entry Other user"
        )
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:
    def test_works(self):
        entry_id = self.entry_one.id
        entry = crud.delete_user_entry(
            db=self.db_session, user_id=self.user.id, entry_id=self.entry_one.id
        )
        assert entry == self.entry_one.id

        entry_exists = (
            self.db_session.query(models.Entry)
            .filter(models.Entry.id == entry_id)
            .first()
        )
        print("Entry Exist", entry_exists)
        assert entry_exists == None

    def test_404_no_entry(self):
        fake_uuid = uuid.uuid4()

        with pytest.raises(
            HTTPException,
            match="Entry not found.",
        ):
            crud.delete_user_entry(
                db=self.db_session, user_id=self.user.id, entry_id=fake_uuid
            )

    def test_401_other_user_entry(self):

        with pytest.raises(
            HTTPException,
            match="Cannot delete other user entries.",
        ):
            crud.delete_user_entry(
                db=self.db_session, user_id=self.user.id, entry_id=self.entry_other.id
            )


class Chat:
    def __init__(self):
        self.completions = self.Completions()

    class Completions:
        def __init__(self):
            self._response = self.Response()

        def create(self, *arg, **kwargs):
            return self._response

        class Response:
            def __init__(self):
                self.choices = {"message": {"content": "test API return"}}
                self.id = "1"


class TestGeneratePrompt(TestCase):
    def setUp(self):
        self.mock_client = mock.patch.object(openai_client, "chat", Chat())

        drop_and_recreate_tables()
        models.Base.metadata.create_all(bind=models.engine)
        self.db_session = models.SessionLocal()
        self.user = create_fake_user(db=self.db_session)
        self.other_user = create_fake_user(db=self.db_session, email="other@email.com")
        self.db_session.flush()

    def tearDown(self) -> None:
        self.db_session.rollback()
        self.db_session.close()
        drop_and_recreate_tables()

    # Test Cases:

    def test_works(self):
        with self.mock_client:
            prompt = crud.generate_prompt(
                db=self.db_session, prompt="test query", user_id=self.user.id
            )
            assert prompt == "test API return"

    # def test_404_no_entry(self):
    #     fake_uuid = uuid.uuid4()

    #     with pytest.raises(
    #         HTTPException,
    #         match="Entry not found.",
    #     ):
    #         crud.delete_user_entry(
    #             db=self.db_session, user_id=self.user.id, entry_id=fake_uuid
    #         )

    # def test_401_other_user_entry(self):

    #     with pytest.raises(
    #         HTTPException,
    #         match="Cannot delete other user entries.",
    #     ):
    #         crud.delete_user_entry(
    #             db=self.db_session, user_id=self.user.id, entry_id=self.entry_other.id
    #         )
