from __future__ import with_statement

import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import models for Alembic to detect
try:
    from app.db.session import Base
    from app.models.user import User
    from app.models.user_preference import UserPreference
    from app.models.course import Course, Module, Lesson, Category, CourseProgress, LessonCompletion
    from app.models.message import Message
    from app.core.config import settings
except ImportError:
    # If models aren't available yet, we'll create a minimal Base
    from sqlalchemy.ext.declarative import declarative_base
    Base = declarative_base()
    
    # Import settings if possible
    try:
        from app.core.config import settings
    except ImportError:
        # Fallback database URL if settings aren't available
        class settings:
            SQLALCHEMY_DATABASE_URI = "sqlite:///./test.db"

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Override SQLAlchemy URL from settings
config.set_main_option("sqlalchemy.url", settings.SQLALCHEMY_DATABASE_URI)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online() 