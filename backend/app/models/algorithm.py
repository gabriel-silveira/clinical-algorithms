from sqlalchemy import Table, Column, DATE, TEXT, VARCHAR, BIGINT
from app.db import meta


algorithm_model = Table(
    'algorithms',
    meta,
    Column('id', BIGINT, primary_key=True, index=True),
    Column('title', VARCHAR(255), index=True),
    Column('description', TEXT, index=True),
    # Column('author', VARCHAR(255)),
    Column('version', VARCHAR(10)),
    Column('updated_at', DATE)
)


algorithm_graph_model = Table(
    'algorithms_graphs',
    meta,
    Column('id', BIGINT, primary_key=True, index=True),
    Column('algorithm_id', BIGINT, index=True),
    Column('graph', TEXT),
    Column('updated_at', DATE)
)
