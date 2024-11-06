from fastapi import APIRouter, Depends
from app.services import algorithms, graphs
from app.schemas.algorithm import AlgorithmSchema, AlgorithmGraphSchema
from app.schemas.algorithm_category import AlgorithmCategorySchema
from app.dependencies import get_token_header

router = APIRouter(
    prefix="/algorithms",
    tags=["algorithms"],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)

public_router = APIRouter(
    prefix="/algorithms",
    tags=["algorithms"],
    dependencies=[],
    responses={404: {"description": "Not found"}},
)


@public_router.get("")
def index(list_all_algorithms: bool):
    return algorithms.index(list_all_algorithms)


@public_router.get("/thorough-search")
def thorough_search(keyword: str | None = None):
    if keyword:
        return algorithms.thorough_search(keyword)
    return None


@public_router.get("/search")
def search(
        keyword: str | None = None,
        category_id: int | None = None,
        user_id: int | None = None,
):
    if keyword or category_id or user_id:
        return algorithms.search(keyword, category_id, user_id)
    return True


@public_router.get("/categories")
def show_algorithms_categories():
    return algorithms.categories_index()


@public_router.get("/{algorithm_id}")
def show(algorithm_id: int):
    return algorithms.show(algorithm_id)


@public_router.get("/user/{user_id}")
def user_algorithms(user_id: int):
    return algorithms.user_algorithms(user_id)


@public_router.get("/graph/{algorithm_id}")
def show_graph(algorithm_id: int):
    return graphs.show(algorithm_id)


@public_router.get("/algorithm-categories/{algorithm_id}")
def algorithm_categories(algorithm_id: int):
    return algorithms.algorithm_categories(algorithm_id)


@router.post("")
def store_algorithm(algorithm: AlgorithmSchema):
    return algorithms.store(algorithm)


@router.post("/categories")
def store_algorithm_category(algorithm_category: AlgorithmCategorySchema):
    return algorithms.store_category(algorithm_category)


@router.put("/categories/{algorithm_id}")
def update_algorithm_category(algorithm_category: AlgorithmCategorySchema):
    return algorithms.update_algorithm_category(algorithm_category)


@router.put("/{algorithm_id}")
def update_algorithm(algorithm: AlgorithmSchema):
    return algorithms.update_algorithm(algorithm)


@router.put("/graph/{graph_id}")
def update_graph(algorithm_graph: AlgorithmGraphSchema):
    return graphs.update_graph(algorithm_graph)


@router.delete("/categories/{category_id}")
def delete_category(category_id: int):
    return algorithms.delete_category(category_id)


@router.delete("/{algorithm_id}")
def delete_algorithm(algorithm_id: int):
    return algorithms.delete_algorithm(algorithm_id)
