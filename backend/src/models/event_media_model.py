import uuid
import enum
from datetime import datetime
from sqlalchemy import ForeignKey, String, DateTime, func, UniqueConstraint, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from src.core.database import Base

class EventMediaImage(Base):
    __tablename__ = "event_media_images_table"

    event_media_image_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events_table.event_id", ondelete="CASCADE"),
        nullable=False
    )
    event_media_image_url: Mapped[str] = mapped_column(String(500), nullable=False)

    event_media_image_like_count: Mapped[int] = mapped_column(default=0)

    event_media_image_created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class EventMediaImageLike(Base):
    __tablename__ = "event_media_image_likes_table"

    event_media_image_like_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    event_media_image_id: Mapped[int] = mapped_column(
        ForeignKey("event_media_images_table.event_media_image_id", ondelete="CASCADE"),
        nullable=False
    )

    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("students_table.student_id", ondelete="CASCADE"),
        nullable=False
    )

    event_media_image_like_created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint('event_media_image_id', 'student_id', name='_student_event_image_like_uc'),
    )
class EventMediaVideoReactionType(str, enum.Enum):
    LIKE = "like" # Maybe +1
    LOVE = "love" # Maybe +2
    FIRE = "fire" # Maybe +3

class EventMediaVideo(Base):
    __tablename__ = "event_media_videos_table"
    event_media_video_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events_table.event_id", ondelete="CASCADE"),
        nullable=False
    )
    event_media_video_url: Mapped[str] = mapped_column(String(500), nullable=False)

    event_media_view_count: Mapped[int] = mapped_column(default=0)

    event_media_video_reaction_score: Mapped[int] = mapped_column(default=0)

    event_media_video_created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class EventVideoReaction(Base):
    __tablename__ = "event_video_reactions_table"

    event_media_video_reaction_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    event_media_video_id: Mapped[int] = mapped_column(
        ForeignKey("event_media_videos_table.event_media_video_id", ondelete="CASCADE"),
        nullable=False
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("students_table.student_id", ondelete="CASCADE"),
        nullable=False
    )
    event_media_video_reaction_type: Mapped[EventMediaVideoReactionType] = mapped_column(
        SqlEnum(
            EventMediaVideoReactionType,
            name="event_media_video_reaction_type_enum",
            native_enum=True,
            values_callable=lambda obj: [e.value for e in obj]
        ),
        default=EventMediaVideoReactionType.LIKE,
        nullable=False,
    )
    event_media_video_created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint(
            'event_media_video_id',
            'student_id',
            name='_student_video_reaction_uc'
        ),
    )