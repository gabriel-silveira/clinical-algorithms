from models.index import algorithms as algorithm_model
from schemas.algorithm import AlgorithmSchema
from db import conn
from .data_handler import to_dict, to_iso_date


def index():
    all_algorithms = conn.execute(
        algorithm_model.select()
    ).fetchall()

    return to_dict(all_algorithms)


def search(keyword: str):
    algorithms_found = conn.execute(
        algorithm_model.select().where(algorithm_model.c.title.like("%"+keyword+"%"))
    ).fetchall()

    return to_dict(algorithms_found)


def show(algorithm_id: int):
    algorithm = conn.execute(
        algorithm_model.select().where(algorithm_model.c.id == algorithm_id)
    ).fetchall()

    if len(algorithm):
        return to_dict(algorithm)[0]


def store(algorithm: AlgorithmSchema):
    algorithm = conn.execute(
        algorithm_model.update()
        .where(algorithm_model.c.id == algorithm.id)
        .values(
            title=algorithm.title,
            description=algorithm.description,
            author=algorithm.author,
            version=algorithm.version,
            updated_at=to_iso_date(algorithm.updated_at)
        )
    )

    return algorithm


def delete(algorithm_id: int):
    return conn.execute(
        algorithm_model.delete().where(algorithm_model.c.id == algorithm_id)
    )
