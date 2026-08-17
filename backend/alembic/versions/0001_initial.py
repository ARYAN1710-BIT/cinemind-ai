from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("username"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_username", "users", ["username"])
    op.create_index("ix_users_email", "users", ["email"])

    for table in ["favorites", "watchlist", "ratings", "reviews"]:
        if table == "favorites":
            columns = [
                sa.Column("id", sa.Integer(), primary_key=True),
                sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
                sa.Column("movie_id", sa.Integer(), nullable=False),
                sa.Column("created_at", sa.DateTime(), nullable=False),
                sa.UniqueConstraint("user_id", "movie_id", name="uq_favorite_user_movie"),
            ]
        elif table == "watchlist":
            columns = [
                sa.Column("id", sa.Integer(), primary_key=True),
                sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
                sa.Column("movie_id", sa.Integer(), nullable=False),
                sa.Column("created_at", sa.DateTime(), nullable=False),
                sa.UniqueConstraint("user_id", "movie_id", name="uq_watchlist_user_movie"),
            ]
        elif table == "ratings":
            columns = [
                sa.Column("id", sa.Integer(), primary_key=True),
                sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
                sa.Column("movie_id", sa.Integer(), nullable=False),
                sa.Column("value", sa.Integer(), nullable=False),
                sa.Column("created_at", sa.DateTime(), nullable=False),
                sa.Column("updated_at", sa.DateTime(), nullable=False),
                sa.UniqueConstraint("user_id", "movie_id", name="uq_rating_user_movie"),
            ]
        else:
            columns = [
                sa.Column("id", sa.Integer(), primary_key=True),
                sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
                sa.Column("movie_id", sa.Integer(), nullable=False),
                sa.Column("content", sa.Text(), nullable=False),
                sa.Column("created_at", sa.DateTime(), nullable=False),
                sa.Column("updated_at", sa.DateTime(), nullable=False),
            ]
        op.create_table(table, *columns)
        op.create_index(f"ix_{table}_user_id", table, ["user_id"])
        op.create_index(f"ix_{table}_movie_id", table, ["movie_id"])


def downgrade():
    for table in ["reviews", "ratings", "watchlist", "favorites"]:
        op.drop_table(table)
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_username", table_name="users")
    op.drop_table("users")
