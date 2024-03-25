"""modify date column to datetime

Revision ID: 94d76ca7875f
Revises: 42cffe685a16
Create Date: 2024-03-08 17:31:00.345925

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '37f58b419cf2'
down_revision: Union[str, None] = '2ea7f2d0e1e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""ALTER TABLE graphs MODIFY COLUMN graph MEDIUMTEXT""")
    pass


def downgrade() -> None:
    op.execute("""ALTER TABLE graphs MODIFY COLUMN graph TEXT""")
    pass
