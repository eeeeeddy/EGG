from pydantic import BaseModel

class LinkDTO(BaseModel):
    source: int
    target: int
    distance: float
