from app.messages.dao import MessageDAO
from app.messages.models import Message


async def test_find_one_or_none_existing(prepare_database):
    message = await MessageDAO.find_one_or_none(filters=[Message.id == 1])
    assert message is not None
    assert message.id == 1


async def test_find_one_or_none_not_existing(prepare_database):
    message = await MessageDAO.find_one_or_none(filters=[Message.id == 9999])
    assert message is None


async def test_find_by_id_existing(prepare_database):
    message = await MessageDAO.find_by_id(1)
    assert message is not None
    assert message.id == 1


async def test_find_all_with_pagination(prepare_database):
    messages = await MessageDAO.find_all(limit=2, offset=0)
    assert len(messages) == 2


async def test_add_record_and_delete_record(prepare_database):
    new_message = await MessageDAO.add_record(chat_id=1, id=11, content="Hello from test")
    assert new_message.id is not None

    fetched = await MessageDAO.find_by_id(new_message.id)
    assert fetched is not None
    assert fetched.content == "Hello from test"

    deleted_count = await MessageDAO.delete_record(filters=[Message.id == new_message.id])
    assert deleted_count == 1

    should_be_none = await MessageDAO.find_by_id(new_message.id)
    assert should_be_none is None


async def test_update_record(prepare_database):
    new_message = await MessageDAO.add_record(chat_id=1, id=11, content="Old Text")
    assert new_message.content == "Old Text"

    updated_count = await MessageDAO.update_record(
        filters=[Message.id == new_message.id], update_data={"content": "New Text"}
    )
    assert updated_count == 1

    updated = await MessageDAO.find_by_id(new_message.id)
    assert updated.content == "New Text"
