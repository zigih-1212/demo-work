"""Test suite attributes related to products.

This module provides test suite attributes related to products.
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


class ProductsAttributes(Base):
    """Test suite attributes for products.

    Each productsAttributes instance represents a product configuration.
    """

    __tablename__ = "products_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[str] = mapped_column(String(50), nullable=False)
    product_name: Mapped[str] = mapped_column(String(100), nullable=False)
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    # Relationships
    test_suites: Mapped[list["TestSuite"]] = relationship(
        "TestSuite", back_populates="product"
    )

    relationships = {
        "test_suites": "TestSuite",
    }


class ProductConfig(Base):
    """Product configuration model.

    Each productConfig represents a product configuration.
    """

    __tablename__ = "product_configs"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[str] = mapped_column(String(50), nullable=False)
    config: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {"config": "None"}


class ProductQueryResult(Base):
    """Product query result model.

    Each productQueryResult stores the results of product queries.
    """

    __tablename__ = "product_query_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products_attributes.id"), nullable=False
    )
    query_params: Mapped[dict] = mapped_column(JSON, nullable=False)
    result_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    executed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    relationships = {
        "product": "ProductsAttributes",
    }
