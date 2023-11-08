from pydantic import BaseModel
from typing import Optional

class AuthorDTO(BaseModel):
    id: int
    authorID : str
    author1Name : str
    author1Inst : str
    articleIDs : list
    titleKor : list
    with_author2IDs : list
    citations : list
    journalIDs : list
    pubYears : list
    word_cloud : list
    category : list
    kiiscArticles : float
    totalArticles : float
    impactfactor : float
    H_index : float
    scaled_impactfactor : float
