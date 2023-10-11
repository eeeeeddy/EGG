from pydantic import BaseModel
from typing import List
from Dto.nodeDTO import NodeDTO
from Dto.LinkDTO import LinkDTO

class GraphDTO(BaseModel):
    nodes: List[NodeDTO]
    links: List[LinkDTO]

