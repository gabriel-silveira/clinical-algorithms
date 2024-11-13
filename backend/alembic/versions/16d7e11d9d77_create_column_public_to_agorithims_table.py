"""Create column public to Agorithims table

Revision ID: 16d7e11d9d77
Revises: 37f58b419cf2
Create Date: 2024-11-06 10:41:00.664883

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '16d7e11d9d77'
down_revision: Union[str, None] = '37f58b419cf2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE algorithms ADD COLUMN public TINYINT DEFAULT 0 AFTER description")
    pass


def downgrade() -> None:
    op.execute("ALTER TABLE algorithms DROP COLUMN user_id")
    pass
