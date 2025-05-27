import pytest
from app.messages.dao import MessageDAO
from app.messages.models import Message


@pytest.mark.parametrize(
    "chat_id, limit, offset",
    [
        (1, 3, 0)
    ]
)
async def test_get_messages(chat_id, limit, offset, prepare_database):
    messages = await MessageDAO.get_messages(chat_id=chat_id, limit=limit, offset=offset)

    assert len(messages) <= limit
    for message in messages:
        assert isinstance(message, Message)
        assert message.chat_id == chat_id

    created_times = [msg.created_at for msg in messages]
    assert created_times == sorted(created_times, reverse=True)
