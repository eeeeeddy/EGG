from pydantic import BaseModel
from typing import Optional

class NodeDTO(BaseModel):
    id: int
    article_id: str
    title_ko : str
    author_name : str
    author_id : str
    author_inst : str
    author2_id : list
    author2_name : list
    author2_inst : list
    journal_name : str
    pub_year : int
    citation : int
    category : str
    keys : list
    abstract_ko : str
    Similarity_AVG : float
    origin_check : int
