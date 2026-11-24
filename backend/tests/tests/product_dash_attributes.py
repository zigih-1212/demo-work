"""Test suite attributes related to Product_Dash.

This module provides test suite attributes related to product dashboards.
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


class DashProductAttributes(Base):
    """Test suite attributes for Product_Dash.

    Each dashProductAttributes instance represents a product dashboard configuration.
    """

    __tablename__ = "dash_product_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[str] = mapped_column(String(50), nullable=False)
    dashboard_type: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    # Relationships
    test_runs: Mapped[list["TestRun"]] = relationship(
        "TestRun", back_populates="product_dash"
    )

    relationships = {
        "test_runs": "TestRun",
    }


class DashProductConfig(Base):
    """Dash product configuration model.

    Each dashProductConfig represents a dashboard configuration for product dashboards.
    """

    __tablename__ = "dash_product_configs"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[str] = mapped_column(String(50), nullable=False)
    config: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {"config": "None"}


class DashProductQueryResult(Base):
    """Dash product query result model.

    Each dashProductQueryResult stores the results of dash product queries.
    """

    __tablename__ = "dash_product_query_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    dash_product_id: Mapped[int] = mapped_column(
        ForeignKey("dash_product_attributes.id"), nullable=False
    )
    query_params: Mapped[dict] = mapped_column(JSON, nullable=False)
    result_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    executed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    relationships = {
        "dash_product": "DashProductAttributes",
    }
