from pydantic import BaseModel
from typing import List


class AlgorithmSchema(BaseModel):
    id: int
    user_id: int | None = None
    title: str
    description: str
    public: bool
    categories: List[int] | None = None
    version: str
    updated_at: str


class AlgorithmGraphSchema(BaseModel):
    id: int
    algorithm_id: int | None = None
    graph: str
    updated_at: str | None = None


class AlgorithmGraphUpdateSchema(BaseModel):
    id: int
    graph: str
