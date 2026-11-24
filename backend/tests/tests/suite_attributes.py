"""Test suite attributes for DynamoDB-Newton operator.

This module provides test suite attributes related to the DynamoDB-Newton operator.
"""

from typing import Any

from sqlalchemy import (
    JSON,
    BigInteger,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base class for all models."""

    pass


class TestSuiteAttributes(Base):
    """Test suite attributes for DynamoDB-Newton operator.

    Each testSuiteAttributes instance holds:
    - datasetId:
      - When null, all existing test suites across all datasets
      - When non-null, only test suites with matching datasetId will be processed
    - token:
      - Query parameter if api goes through API gateway (likely N/A for DynamoDB client library)
      - A string representing a marker, constraint, or condition
    """

    __tablename__ = "test_suite_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    dataset_id: Mapped[int] = mapped_column(Integer, nullable=True)
    token: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    # Relationships
    test_suites: Mapped[list["TestSuite"]] = relationship(
        "TestSuite", back_populates="attributes"
    )

    relationships = {"test_suites": "TestSuite", "attributions": "None"}


class DynamoDBModelAttributes(Base):
    """Model for tracking DynamoDB-Newton operator-specific attributes.

    Each dynamoDBModelAttributes instance records scattered attributes
    related to the DynamoDB-Newton operator pipeline.
    """

    __tablename__ = "dynamodb_model_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    dynamo_db_model_id: Mapped[int] = mapped_column(
        ForeignKey("dynamodb_models.id"), nullable=False
    )
    item_id: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    relationships = {
        "dynamo_db_model": "DynamoDBModel",
    }


class BetterUserProfileToTestEnvRel(Base):
    """Many-to-many relationship table for users and test environments."""

    pass


class BaseGroupAttributes(Base):
    """Test suite attributes related to organized groups (jsonStruct).

    Each baseGroupAttributes tracks logical grouping of test suite
    execution, including:
    - datasetId: Optional constraint limiting test suites to specific dataset
    - token: Marker or condition for query (e.g., "Greedy_1", "strict_use")
    """

    __tablename__ = "base_group_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    dataset_id: Mapped[int] = mapped_column(Integer, nullable=True)
    token: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "groups": "StringGroup",
    }


class StringGroup(Base):
    """Model for organizing string-based groups (e.g., features, environments).

    Each stringGroup instance represents a labeled division of data.
    """

    __tablename__ = "string_groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    # Relationships
    test_suites: Mapped[list["TestSuite"]] = relationship(
        "TestSuite", back_populates="group"
    )

    relationships = {
        "test_suites": "TestSuite",
    }


class UserAttributes(Base):
    """User attribute representation - Generic type T (like BetterUserProfile).

    Each userAttributes instance tracks optional attributes for a user profile.
    """

    __tablename__ = "user_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_profile_id: Mapped[int] = mapped_column(
        ForeignKey("better_user_profiles.id"), nullable=False
    )
    custom_attribute: Mapped[str] = mapped_column(
        String(255), nullable=False, unique=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    relationships = {
        "user_profile": "BetterUserProfile",
    }


class TimezoneAttribute(Base):
    """Timezone attribute association.

    Each timezoneAttribute links a user profile to their configured timezone.
    """

    __tablename__ = "timezone_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_profile_id: Mapped[int] = mapped_column(
        ForeignKey("better_user_profiles.id"), nullable=False
    )
    timezone: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    relationships = {
        "user_profile": "BetterUserProfile",
    }


class TagAttributes(Base):
    """Tag attribute representation.

    Each tagAttributes instance tracks optional attributes for a test tag.
    """

    __tablename__ = "tag_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    tag_id: Mapped[int] = mapped_column(Integer, nullable=False)
    custom_attribute: Mapped[str] = mapped_column(
        String(255), nullable=False, unique=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    relationships = {
        "tag": "TestTag",
    }
