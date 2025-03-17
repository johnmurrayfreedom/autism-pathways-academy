"""Initial database setup

Revision ID: 20230601_initial
Revises: 
Create Date: 2023-06-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
# Import for SQLite compatibility check
from sqlalchemy.engine.reflection import Inspector
from alembic import context

# revision identifiers, used by Alembic.
revision = '20230601_initial'
down_revision = None
branch_labels = None
depends_on = None


def is_sqlite():
    """Check if we're using SQLite"""
    config = context.config
    url = config.get_main_option("sqlalchemy.url")
    return url.startswith("sqlite")


def upgrade():
    # Check database type
    using_sqlite = is_sqlite()
    
    # Create enum types - skip for SQLite
    if not using_sqlite:
        # PostgreSQL specific code for enum types
        from sqlalchemy.dialects import postgresql
        communication_style = postgresql.ENUM('direct', 'detailed', 'visual', name='communicationstyle')
        communication_style.create(op.get_bind())
        
        feedback_preference = postgresql.ENUM('explicit', 'gentle', 'positive', name='feedbackpreference')
        feedback_preference.create(op.get_bind())
        
        interaction_mode = postgresql.ENUM('text', 'visual', 'mixed', name='interactionmode')
        interaction_mode.create(op.get_bind())
        
        course_level = postgresql.ENUM('beginner', 'intermediate', 'advanced', name='courselevel')
        course_level.create(op.get_bind())
    
    # For SQLite, use string type instead of enum
    communication_style_type = sa.String(20) if using_sqlite else sa.Enum('direct', 'detailed', 'visual', name='communicationstyle')
    feedback_preference_type = sa.String(20) if using_sqlite else sa.Enum('explicit', 'gentle', 'positive', name='feedbackpreference')
    interaction_mode_type = sa.String(20) if using_sqlite else sa.Enum('text', 'visual', 'mixed', name='interactionmode')
    course_level_type = sa.String(20) if using_sqlite else sa.Enum('beginner', 'intermediate', 'advanced', name='courselevel')
    
    # users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    
    # user_preferences table
    op.create_table(
        'user_preferences',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('communication_style', communication_style_type, nullable=True),
        sa.Column('feedback_preference', feedback_preference_type, nullable=True),
        sa.Column('interaction_mode', interaction_mode_type, nullable=True),
        sa.Column('visual_support', sa.Boolean(), nullable=True),
        sa.Column('reduced_motion', sa.Boolean(), nullable=True),
        sa.Column('high_contrast', sa.Boolean(), nullable=True),
        sa.Column('video_volume', sa.Integer(), nullable=True),
        sa.Column('video_playback_rate', sa.Float(), nullable=True),
        sa.Column('video_brightness', sa.Integer(), nullable=True),
        sa.Column('video_contrast', sa.Integer(), nullable=True),
        sa.Column('video_muted', sa.Boolean(), nullable=True),
        sa.Column('prefer_transcript', sa.Boolean(), nullable=True),
        sa.Column('disable_autoplay', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_user_preferences_id'), 'user_preferences', ['id'], unique=False)
    
    # categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=True)
    
    # courses table
    op.create_table(
        'courses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('level', course_level_type, nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('estimated_time', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_courses_id'), 'courses', ['id'], unique=False)
    op.create_index(op.f('ix_courses_title'), 'courses', ['title'], unique=False)
    
    # course_category table (many-to-many)
    op.create_table(
        'course_category',
        sa.Column('course_id', sa.Integer(), nullable=True),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], )
    )
    
    # course_prerequisites table (many-to-many)
    op.create_table(
        'course_prerequisites',
        sa.Column('course_id', sa.Integer(), nullable=False),
        sa.Column('prerequisite_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ),
        sa.ForeignKeyConstraint(['prerequisite_id'], ['courses.id'], ),
        sa.PrimaryKeyConstraint('course_id', 'prerequisite_id')
    )
    
    # modules table
    op.create_table(
        'modules',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.Column('course_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_modules_id'), 'modules', ['id'], unique=False)
    op.create_index(op.f('ix_modules_title'), 'modules', ['title'], unique=False)
    
    # lessons table
    op.create_table(
        'lessons',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('video_url', sa.String(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.Column('module_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['module_id'], ['modules.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_lessons_id'), 'lessons', ['id'], unique=False)
    op.create_index(op.f('ix_lessons_title'), 'lessons', ['title'], unique=False)
    
    # course_progresses table
    op.create_table(
        'course_progresses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('course_id', sa.Integer(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('last_accessed', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_course_progresses_id'), 'course_progresses', ['id'], unique=False)
    
    # lesson_completions table
    op.create_table(
        'lesson_completions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('lesson_id', sa.Integer(), nullable=True),
        sa.Column('course_progress_id', sa.Integer(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['course_progress_id'], ['course_progresses.id'], ),
        sa.ForeignKeyConstraint(['lesson_id'], ['lessons.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_lesson_completions_id'), 'lesson_completions', ['id'], unique=False)
    
    # messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('is_user', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('conversation_id', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_messages_conversation_id'), 'messages', ['conversation_id'], unique=False)
    op.create_index(op.f('ix_messages_id'), 'messages', ['id'], unique=False)


def downgrade():
    # Drop all tables
    op.drop_index(op.f('ix_messages_id'), table_name='messages')
    op.drop_index(op.f('ix_messages_conversation_id'), table_name='messages')
    op.drop_table('messages')
    
    op.drop_index(op.f('ix_lesson_completions_id'), table_name='lesson_completions')
    op.drop_table('lesson_completions')
    
    op.drop_index(op.f('ix_course_progresses_id'), table_name='course_progresses')
    op.drop_table('course_progresses')
    
    op.drop_index(op.f('ix_lessons_title'), table_name='lessons')
    op.drop_index(op.f('ix_lessons_id'), table_name='lessons')
    op.drop_table('lessons')
    
    op.drop_index(op.f('ix_modules_title'), table_name='modules')
    op.drop_index(op.f('ix_modules_id'), table_name='modules')
    op.drop_table('modules')
    
    op.drop_table('course_prerequisites')
    op.drop_table('course_category')
    
    op.drop_index(op.f('ix_courses_title'), table_name='courses')
    op.drop_index(op.f('ix_courses_id'), table_name='courses')
    op.drop_table('courses')
    
    op.drop_index(op.f('ix_categories_name'), table_name='categories')
    op.drop_index(op.f('ix_categories_id'), table_name='categories')
    op.drop_table('categories')
    
    op.drop_index(op.f('ix_user_preferences_id'), table_name='user_preferences')
    op.drop_table('user_preferences')
    
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    
    # Drop enum types - skip for SQLite
    if not is_sqlite():
        from sqlalchemy.dialects import postgresql
        
        communication_style = postgresql.ENUM('direct', 'detailed', 'visual', name='communicationstyle')
        communication_style.drop(op.get_bind())
        
        feedback_preference = postgresql.ENUM('explicit', 'gentle', 'positive', name='feedbackpreference')
        feedback_preference.drop(op.get_bind())
        
        interaction_mode = postgresql.ENUM('text', 'visual', 'mixed', name='interactionmode')
        interaction_mode.drop(op.get_bind())
        
        course_level = postgresql.ENUM('beginner', 'intermediate', 'advanced', name='courselevel')
        course_level.drop(op.get_bind()) 