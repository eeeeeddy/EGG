from pydantic import BaseModel
from typing import List
from Dto.AuthorDTO import AuthorDTO
from Dto.LinkDTO import LinkDTO

class AuGraphDTO(BaseModel):
    nodes: List[AuthorDTO]
    links: List[LinkDTO]
