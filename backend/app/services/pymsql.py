import pymysql.cursors
from pymysql import Error
from typing import List
from dotenv import dotenv_values
from datetime import datetime

config = dotenv_values(".env")

db_config = {
    "host": config["DB_HOST"],
    "port": config["DB_PORT"],
    "user": config["DB_USER"],
    "pass": config["DB_PASS"],
    "name": config["DB_NAME"],
}


def db_error(e: Error):
    if 1 in e.args:
        print(f"Database error: {e.args[0]}, {e.args[1]}")
    else:
        print(f"Database error: {e.args[0]}")
    raise


def conn():
    try:
        return pymysql.connect(host=db_config['host'],
                               user=db_config['user'],
                               password=db_config['pass'],
                               database=db_config['name'],
                               charset='utf8mb4',
                               cursorclass=pymysql.cursors.DictCursor)
    except Error as e:
        db_error(e)


def insert(table: str, fields: List[str], values: List[str | int]):
    try:
        db = conn()

        with db:
            with db.cursor() as cursor:
                sql_fields = ""
                sql_values = ""

                for index in range(len(fields)):
                    sql_fields += fields[index]+", " if index + 1 != len(fields) else fields[index]
                    sql_values += "%s, " if index + 1 != len(fields) else "%s"

                cursor.execute(
                    "INSERT INTO "+table+" ("+sql_fields+") VALUES ("+sql_values+")",
                    values,
                )

                db.commit()

                return cursor.lastrowid
    except Error as e:
        db_error(e)


def update(table: str, fields: List[str], values: List[str | int | datetime], key_field: str, key_value: str | int):
    try:
        db = conn()

        with db:
            with db.cursor() as cursor:
                sql_fields = ""

                for index in range(len(fields)):
                    sql_fields += fields[index] + " = %s"

                    if index + 1 < len(fields):
                        sql_fields += ", "

                values.append(key_value)

                cursor.execute(
                    "UPDATE "+table+" SET "+sql_fields+" WHERE "+key_field+" = %s",
                    values,
                )

                db.commit()

                return cursor.lastrowid
    except Error as e:
        db_error(e)


def select(stmt: str, params: List[str] | str | int = None):
    try:
        db = conn()

        with db:
            with db.cursor() as cursor:
                if params:
                    cursor.execute(stmt, params)
                else:
                    cursor.execute(stmt)

                result = cursor.fetchall()

                return result
    except Error as e:
        db_error(e)


def delete(table: str, field: str, value: int | str):
    try:
        db = conn()
        with db:
            with db.cursor() as cursor:
                cursor.execute("DELETE FROM "+table+" WHERE "+field+" = %s", value)

                db.commit()
    except Error as e:
        db_error(e)
