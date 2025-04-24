from pydantic import BaseModel


class BaseSchema(BaseModel):
    model_config = {"from_attributes": True, "use_enum_values": True}
