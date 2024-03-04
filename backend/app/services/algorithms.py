from app.services import nodes
from app.schemas.algorithm import AlgorithmSchema
from app.schemas.algorithm_category import AlgorithmCategorySchema
from app.services import graphs
from app.services.pymsql import insert, update, select, delete, db_error
from pymysql import Error
from datetime import datetime
from typing import List

algorithm_fields = ['id', 'title', 'description', 'version', 'updated_at']


def index():
    try:
        return select("SELECT * FROM algorithms ORDER BY id DESC")
    except Error as e:
        db_error(e)


def algorithm_categories(algorithm_id: int):
    try:
        return select("""SELECT c.*
            FROM algorithms_categories ac
            LEFT JOIN categories c ON c.id = ac.category_id
            WHERE algorithm_id = %s""", [algorithm_id])
    except Error as e:
        db_error(e)


def search(keyword: str, category_id=0, user_id=0, thorough=False):
    try:
        if thorough:
            # return select("SELECT * FROM algorithms WHERE title REGEXP %s", "[[:<:]]"+keyword+"[[:>:]]")
            return select("SELECT * FROM algorithms WHERE title REGEXP %s", keyword)
        else:
            # search by category only
            if not keyword and category_id and not user_id:
                query = """SELECT a.*
                        FROM algorithms_categories ac
                        LEFT JOIN algorithms a ON a.id = ac.algorithm_id
                        WHERE ac.category_id = %s"""

                return select(query, [category_id])

            # search by keyword and category
            if keyword and category_id and not user_id:
                query = """SELECT a.*
                        FROM algorithms_categories ac
                        LEFT JOIN algorithms a ON a.id = ac.algorithm_id
                        WHERE a.title LIKE %s
                        AND ac.category_id = %s"""

                return select(query, ["%"+keyword+"%", category_id])

            # search by category and user
            if not keyword and category_id and user_id:
                query = """SELECT a.*
                        FROM algorithms_categories ac
                        LEFT JOIN algorithms a ON a.id = ac.algorithm_id
                        WHERE ac.category_id = %s
                        AND a.user_id = %s"""

                return select(query, [category_id, user_id])

            # search by keyword and user
            if keyword and not category_id and user_id:
                query = """SELECT * FROM algorithms WHERE title LIKE %s AND user_id = %s"""

                return select(query, ["%"+keyword+"%", user_id])

            # search by user only
            if not keyword and not category_id and user_id:
                query = """SELECT * FROM algorithms WHERE user_id = %s"""

                return select(query, [user_id])

            # search by keyword, category and user_id
            if keyword and category_id and user_id:
                query = """SELECT a.*
                        FROM algorithms_categories ac
                        LEFT JOIN algorithms a ON a.id = ac.algorithm_id
                        WHERE a.title LIKE %s
                        AND ac.category_id = %s
                        AND a.user_id = %s"""

                return select(query, ["%"+keyword+"%", category_id, user_id])

            return select("SELECT * FROM algorithms WHERE title LIKE %s", "%"+keyword+"%")
    except Error as e:
        db_error(e)


def thorough_search(keyword: str):
    try:
        nodes_found = nodes.search(keyword)

        algorithms_found = search(keyword, 0, 0, True)

        results = {}

        for algorithm_found in algorithms_found:
            results[algorithm_found['id']] = {
                "id": algorithm_found['id'],
                "title": algorithm_found['title'],
                "description": algorithm_found['description'],
                "nodes": []
            }

        for node_found in nodes_found:
            if node_found['algorithm_id'] not in results:
                results[node_found['algorithm_id']] = {
                    "id": "",
                    "title": "",
                    "description": "",
                    "nodes": []
                }

        for node_found in nodes_found:
            results[node_found['algorithm_id']]['nodes'].append(node_found)

            if not results[node_found['algorithm_id']]['title']:
                algorithm_found = select(
                    "SELECT * FROM algorithms WHERE id = %s",
                    node_found['algorithm_id'],
                )[0]

                results[node_found['algorithm_id']]['id'] = algorithm_found['id']
                results[node_found['algorithm_id']]['title'] = algorithm_found['title']
                results[node_found['algorithm_id']]['description'] = algorithm_found['description']

        return results
    except Error as e:
        db_error(e)


def show(algorithm_id: int):
    try:
        return select("SELECT * FROM algorithms WHERE id = %s", algorithm_id)[0]
    except Error as e:
        db_error(e)


def categories_index():
    try:
        return select("SELECT * FROM categories")
    except Error as e:
        db_error(e)


def store(algorithm: AlgorithmSchema):
    try:
        algorithm_id = insert(
            "algorithms",
            ["user_id", "title", "description", "version", "updated_at"],
            [
                algorithm.user_id,
                algorithm.title,
                algorithm.description,
                algorithm.version,
                datetime.now(),
            ],
        )

        graphs.store(algorithm_id)

        update_algorithm_categories(algorithm_id, algorithm.categories)

        return {"algorithm_id": algorithm_id}
    except Error as e:
        db_error(e)


def store_category(algorithm_category: AlgorithmCategorySchema):
    try:
        algorithm_category_id = insert(
            "categories",
            ["name", "updated_at"],
            [algorithm_category.name, datetime.today().strftime('%Y-%m-%d')],
        )

        return {"algorithm_category_id": algorithm_category_id}
    except Error as e:
        db_error(e)


def update_algorithm_category(algorithm_category: AlgorithmSchema):
    try:
        fields = ["name", "updated_at"]
        values = [algorithm_category.name, datetime.today().strftime('%Y-%m-%d')]

        updated_algorithm_category_id = update("categories", fields, values, "id", algorithm_category.id)

        return {"id": updated_algorithm_category_id}
    except Error as e:
        db_error(e)


def update_algorithm_categories(algorithm_id: int, categories: List[int]):
    delete('algorithms_categories', 'algorithm_id', algorithm_id)

    for category in categories:
        insert('algorithms_categories', ['algorithm_id', 'category_id'], [algorithm_id, category])


def update_algorithm(algorithm: AlgorithmSchema):
    try:
        fields = ["title", "description", "version", "updated_at"]
        values = [
            algorithm.title,
            algorithm.description,
            algorithm.version,
            datetime.now(),
        ]
        
        updated_algorithm_id = update("algorithms", fields, values, "id", algorithm.id)

        update_algorithm_categories(algorithm.id, algorithm.categories)

        return {"id": updated_algorithm_id}
    except Error as e:
        db_error(e)


def delete_category(category_id: int):
    try:
        delete('algorithms_categories', 'category_id', category_id)

        delete('categories', 'id', category_id)
    except Error as e:
        db_error(e)


def delete_algorithm(algorithm_id: int):
    try:
        # delete nodes
        nodes.delete_algorithm_nodes(algorithm_id)

        # delete graph
        graphs.delete_algorithm_graphs(algorithm_id)

        update_algorithm_categories(algorithm_id, [])

        # then delete graph itself
        delete('algorithms', 'id', algorithm_id)
    except Error as e:
        db_error(e)
