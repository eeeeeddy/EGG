from pydantic import BaseModel
from typing import Optional

class NodeDTO(BaseModel):
    id: int
    article_id: str
    title_ko : str
    author_name : str
    author_id : str
    journal_name : str
    pub_year : int
    citation : int
    #category : Optional[str]
    abstract_ko : str
