from app.connection_requests.models import ConnectionRequest
from app.dao.base import BaseDAO


class ConnectionRequestDAO(BaseDAO):
    model = ConnectionRequest
