from sqlalchemy import Table, Column, DATE, TEXT, VARCHAR, BIGINT, BOOLEAN
from app.db import meta


algorithm_model = Table(
    'algorithms',
    meta,
    Column('id', BIGINT, primary_key=True, index=True),
    Column('title', VARCHAR(255), index=True),
    Column('description', TEXT, index=True),
    # Column('author', VARCHAR(255)),
    Column('public', BOOLEAN, default=False),
    Column('version', VARCHAR(10)),
    Column('updated_at', DATE)
)


graph_model = Table(
    'graphs',
    meta,
    Column('id', BIGINT, primary_key=True, index=True),
    Column('algorithm_id', BIGINT, index=True),
    Column('graph', TEXT),
    Column('updated_at', DATE)
)
