from datetime import datetime
from app.schemas.algorithm import AlgorithmGraphSchema
from app.services import nodes
from app.services.pymsql import insert, update, select, delete, db_error
from pymysql import Error


def update_graph(algorithm_graph: AlgorithmGraphSchema):
    try:
        now = datetime.now()

        fields = ["graph", "updated_at"]
        values = [algorithm_graph.graph, now]

        update("graphs", fields, values, "id", algorithm_graph.id)

        nodes.map_nodes(algorithm_graph.graph, algorithm_graph.algorithm_id)

        # update algorithm updated_at
        update("algorithms", ["public", "updated_at"], [algorithm_graph.public, now], "id", algorithm_graph.algorithm_id)

        return show(algorithm_graph.algorithm_id)
    except Error as e:
        db_error(e)


def show(algorithm_id: int):
    try:
        graphs = select("SELECT * FROM graphs WHERE algorithm_id = %s", algorithm_id)

        if len(graphs):
            return graphs[0]

        return {}
    except Error as e:
        db_error(e)


def store(algorithm_id: int):
    try:
        graph_id = insert(
            "graphs",
            ["algorithm_id", "graph", "updated_at"],
            [algorithm_id, None, datetime.now()],
        )

        return graph_id
    except Error as e:
        db_error(e)


def delete_algorithm_graphs(algorithm_id: int):
    try:
        return delete("graphs", "algorithm_id", algorithm_id)
    except Error as e:
        db_error(e)
