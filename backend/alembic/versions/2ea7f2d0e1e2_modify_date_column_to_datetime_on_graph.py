"""modify date column to datetime on graph

Revision ID: 2ea7f2d0e1e2
Revises: 94d76ca7875f
Create Date: 2024-03-08 17:57:58.616551

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2ea7f2d0e1e2'
down_revision: Union[str, None] = '94d76ca7875f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""ALTER TABLE graphs MODIFY COLUMN updated_at DATETIME NOT NULL""")
    pass


def downgrade() -> None:
    op.execute("""ALTER TABLE graphs MODIFY COLUMN updated_at DATE NULL""")
    pass
