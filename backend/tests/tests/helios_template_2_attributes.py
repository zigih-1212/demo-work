"""Test suite attributes for Helios_Template_2 (Helios Template Version 2).

This module provides test suite attributes related to Helios_Template_2.
"""

from typing import Any

from sqlalchemy import JSON, BigInteger, Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base class for all models."""
    pass


class HeliosTemplate2Attributes(Base):
    """Test suite attributes for Helios_Template_2.

    Each heliosTemplate2Attributes instance contains:
    - rootFolder: Template folder from Helios templates (e.g., "helios-template")
    - product: Product configuration id for Helios templates (e.g., "AAPS", "Helios", "LMP")
    - domains: Which Akkadian domain to query (e.g., "Bilateral", "Medical")
    """

    __tablename__ = "helios_template_2_attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    root_folder: Mapped[str] = mapped_column(String(100), nullable=False)
    product_id: Mapped[str] = mapped_column(String(50), nullable=False)
    domains: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    # Relationships
    test_suites: Mapped[list["TestSuite"]] = relationship(
        "TestSuite",
        back_populates="helios_template2"
    )

    relationships = {
        "test_suites": "TestSuite",
    }


class HeliosTemplate2Folder(Base):
    """Helios Template 2 folder model.

    Each heliosTemplate2Folder represents a folder within the Helios Template 2 structure.
    """

    __tablename__ = "helios_template_2_folders"

    id: Mapped[int] = mapped_column(primary_key=True)
    root_folder: Mapped[str] = mapped_column(String(100), nullable=False)
    sub_folder: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "files": "HeliosTemplate2File",
    }


class HeliosTemplate2File(Base):
    """Helios Template 2 file model.

    Each heliosTemplate2File represents a file within a Helios Template 2 folder.
    """

    __tablename__ = "helios_template_2_files"

    id: Mapped[int] = mapped_column(primary_key=True)
    folder_id: Mapped[int] = mapped_column(ForeignKey("helios_template_2_folders.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(100), nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "folder": "HeliosTemplate2Folder",
    }


class HeliosTemplate2DomainAssociation(Base):
    """Helios Template 2 domain association model.

    Each heliosTemplate2DomainAssociation links a Helios Template 2 configuration to a specific domain.
    """

    __tablename__ = "helios_template_2_domain_associations"

    id: Mapped[int] = mapped_column(primary_key=True)
    helios_template_2_id: Mapped[int] = mapped_column(ForeignKey("helios_template_2_attributes.id"), nullable=False)
    domain: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False,.py
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "helios_template_2": "HeliosTemplate2Attributes",
    }


class HeliosTemplate2ProductConfiguration(Base):
    """Helios Template 2 product configuration model.

    Each heliosTemplate2ProductConfiguration represents a product configuration used in Helios Template 2 templates.
    """

    __tablename__ = "helios_template_2_product_configurations"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[str] = mapped_column(String(50), nullable=False)
    product_name: Mapped[str] = mapped_column(String(100), nullable=False)
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    relationships = {
        "domains": "HeliosTemplate2DomainAssociation",
    }


class HeliosTemplate2QueryResult(Base):
    """Helios Template 2 query result model.

    Each heliosTemplate2QueryResult stores the results of Helios Template 2 template queries.
    """

    __tablename__ = "helios_template_2_query_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    helios_template_2_id: Mapped[int] = mapped_column(ForeignKey("helios_template_2_attributes.id"), nullable=False)
    query_params: Mapped[dict] = mapped_column(JSON, nullable=False)
    result_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    executed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    relationships = {
        "helios_template_2": "HeliosTemplate2Attributes",
    }
