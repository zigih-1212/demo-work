"""Test suite attributes for Helios templating.

This module provides test suite attributes specifically related to Helios templating.
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


class HeliosTemplatingAttributes(Base):
    """Test suite attributes for Helios templating.

    Each heliosTemplatingAttributes instance contains:
    - rootFolder: Template folder from Helios templates (e.g., "helios-template")
    - product: Product configuration id for Helios templates (e.g., "AAPS", "Helios", "LMP")
    - domains: Which Akkadian domain to query (e.g., "Bilateral", "Medical")
    """

    __tablename__ = "helios_templating_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    root_folder: Mapped[str] = mapped_column(String(100), nullable=False)
    product_id: Mapped[str] = mapped_column(String(50), nullable=False)
    domains: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    # Relationships
    test_suites: Mapped[list["TestSuite"]] = relationship(
        "TestSuite", back_populates="helios_template"
    )

    relationships = {
        "test_suites": "TestSuite",
    }


class HeliosTemplateFolder(Base):
    """Helios template folder model.

    Each heliosTemplateFolder represents a folder within the Helios template structure.
    """

    __tablename__ = "helios_template_folders"

    id: Mapped[int] = mapped_column(primary_key=True)
    root_folder: Mapped[str] = mapped_column(String(100), nullable=False)
    sub_folder: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "files": "HeliosTemplateFile",
    }


class HeliosTemplateFile(Base):
    """Helios template file model.

    Each heliosTemplateFile represents a file within a Helios template folder.
    """

    __tablename__ = "helios_template_files"

    id: Mapped[int] = mapped_column(primary_key=True)
    folder_id: Mapped[int] = mapped_column(
        ForeignKey("helios_template_folders.id"), nullable=False
    )
    filename: Mapped[str] = mapped_column(String(100), nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "folder": "HeliosTemplateFolder",
    }


class HeliosDomainAssociation(Base):
    """Helios domain association model.

    Each heliosDomainAssociation links a Helios template configuration to a specific domain.
    """

    __tablename__ = "helios_domain_associations"

    id: Mapped[int] = mapped_column(primary_key=True)
    helios_template_id: Mapped[int] = mapped_column(
        ForeignKey("helios_templating_attributes.id"), nullable=False
    )
    domain: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "helios_template": "HeliosTemplatingAttributes",
    }


class HeliosProductConfiguration(Base):
    """Helios product configuration model.

    Each heliosProductConfiguration represents a product configuration used in Helios templates.
    """

    __tablename__ = "helios_product_configurations"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[str] = mapped_column(String(50), nullable=False)
    product_name: Mapped[str] = mapped_column(String(100), nullable=False)
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "domains": "HeliosDomainAssociation",
    }


class HeliosQueryResult(Base):
    """Helios query result model.

    Each heliosQueryResult stores the results of Helios template queries.
    """

    __tablename__ = "helios_query_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    helios_template_id: Mapped[int] = mapped_column(
        ForeignKey("helios_templating_attributes.id"), nullable=False
    )
    query_params: Mapped[dict] = mapped_column(JSON, nullable=False)
    result_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    executed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    relationships = {
        "helios_template": "HeliosTemplatingAttributes",
    }
