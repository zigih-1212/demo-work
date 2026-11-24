# Test Suite Model Registry

This directory contains the database models used in the test suite for testing DB operators and code quality.

## Overview

The test suite provides a comprehensive registry of database models from various sources including:
- **Core models**: Models used for testing DB operators
- **DynamoDB-Newton operator models**: Models representing the DynamoDB-to-Newton transformation
- **Base group models**: Models defining base groups and string groups
- **Helios templating models**: Models for Helios template configurations
- **Product Dash models**: Models for product dashboard configurations
- **User/profile models**: Models for user profiles and attributes

## File Structure

```
orthodent/backend/tests/tests/
├── __init__.py              # Model registry and index
├── models.py                # Core test suite models
├── suite_attributes.py      # DynamoDB-Newton operator models
├── helios_templating_attributes.py
│   ├── HeliosTemplatingAttributes
│   ├── HeliosTemplateFolder
│   ├── HeliosTemplateFile
│   ├── HeliosDomainAssociation
│   ├── HeliosProductConfiguration
│   └── HeliosQueryResult
├── helios_template_2_attributes.py
│   ├── HeliosTemplate2Attributes
│   ├── HeliosTemplate2Folder
│   ├── HeliosTemplate2File
│   ├── HeliosTemplate2DomainAssociation
│   ├── HeliosTemplate2ProductConfiguration
│   └── HeliosTemplate2QueryResult
├── product_dash_attributes.py
│   ├── DashProductAttributes
│   ├── DashProductConfig
│   └── DashProductQueryResult
└── products_attributes.py
    ├── ProductsAttributes
    ├── ProductConfig
    └── ProductQueryResult
```

## Model Categories

### 1. Core Models (`models.py`)

**TestSuite**: Represents a test suite configuration.
- Tracks test suite execution and metadata
- Links to test runs, test cases, and test environments
- Contains suite-level configuration and statistics

**TestRun**: Represents a single test execution.
- Contains test execution results
- Links to test results, tags, and datasets
- Tracks execution time, status, and logs

**TestTag**: Represents a tag for tests or test runs.
- Provides categorization and filtering
- Applied to multiple test entities

**TestEnvironment**: Represents the test environment configuration.
- Defines environment-specific settings
- Used to parameterize test execution

**TestDataset**: Represents test data configurations.
- Stores test data sets and their metadata
- Used for data-driven testing

**DynamoDBModel**: Represents DynamoDB table models for testing.
- Provides DynamoDB table structure
- Used for operator testing and validation

**NewtonTransform**: Represents transformations between data models.
- Tracks mapping between different data formats
- Used for testing operators

**BetterUserProfile**: Represents extended user profile attributes.
- Contains additional user-specific information
- Used for user-based testing

### 2. DynamoDB-Newton Operator Models (`suite_attributes.py`)

**TestSuiteAttributes**: Attributes for DynamoDB test suite operations.
- Tracks test suite configuration
- Stores metadata about operations

**DynamoDBModelAttributes**: Attributes for DynamoDB models.
- Represents DynamoDB model specifications
- Used for testing DynamoDB operators

### 3. Base Group Models

**BaseGroupAttributes**: Base attributes for group definitions.
- Defines structure for groups
- Used as parent for various group types

**StringGroup**: String group specifications.
- Represents string-based group definitions
- Contains string-related parameters

### 4. Helios Templating Models

**HeliosTemplatingAttributes**: Helios template configuration attributes.
- Template folder references
- Product and domain associations

**HeliosTemplateFolder**: Helios template folder structure.
- Root folder and subfolder navigation
- Template organization

**HeliosTemplateFile**: Helios template filesystem representation.
- File names and types
- Folder relationships

**HeliosDomainAssociation**: Domain associations for Helios templates.
- Links templates to query domains
- Domain-specific configurations

**HeliosProductConfiguration**: Product configurations for Helios.
- Product identifiers and versions
- Product-specific settings

**HeliosQueryResult**: Query results from Helios operations.
- Execution parameters and results
- Timestamped query logs

### 5. Helios Template 2 Models

**HeliosTemplate2Attributes**: Helios Template 2 configuration attributes.
- Similar to HeliosTemplatingAttributes but for version 2
- Additional features and modifications

**HeliosTemplate2Folder**: Helios Template 2 folder structure.
- Helios Template 2-specific organization
- Enhanced folder management

**HeliosTemplate2File**: Helios Template 2 file representation.
- File types and attributes for version 2
- Version-specific file handling

**HeliosTemplate2DomainAssociation**: Domain associations for Helios Template 2.
- Template 2 domain mappings
- Version-specific domain handling

**HeliosTemplate2ProductConfiguration**: Product configurations for Helios Template 2.
- Product configurations for version 2 templates
- Version-specific product settings

**HeliosTemplate2QueryResult**: Query results from Helios Template 2.
- Version 2 template query results
- Timestamped logs for Helios Template 2

### 6. Product Dash Models

**DashProductAttributes**: Product dashboard configuration attributes.
- Dashboard type and product associations
- Dashboard-specific settings

**DashProductConfig**: Dashboard configuration data.
- Configuration dictionaries
- Dashboard settings

**DashProductQueryResult**: Query results from dash product operations.
- Execution parameters and results
- Timestamped query logs

### 7. Products Models

**ProductsAttributes**: Generic product configuration attributes.
- Product identification and metadata
- Product-specific settings

**ProductConfig**: Product configuration storage.
- Configuration dictionaries
- Product-specific settings

**ProductQueryResult**: Query results from product operations.
- Execution parameters and results
- Timestamped query logs

### 8. User/Profile Models

**UserAttributes**: User profile attributes.
- Basic user information
- Profile fields

**TimezoneAttribute**: Timezone-specific user attributes.
- Timezone information
- Time handling

**TagAttributes**: Tag management attributes.
- Tag creation and updates
- Tag relationships

### 9. Relationship Models

**BetterUserProfileToTestEnvRel**: User-to-test environment relationships.
- Maps users to their test environments
- Relationship tracking

## Registry Usage

The `__init__.py` file provides several useful utilities:

```python
from orthodent.backend.tests.tests import get_model_by_name, list_all_models, get_models_by_category

# Get a model by name
model = get_model_by_name("TestSuite")

# List all models
all_models = list_all_models()

# Get models by category
helios_models = get_models_by_category("helios_templating")
```

## Model Relationships

Each model includes a `relationships` dictionary that documents its associations with other models:

```python
Model.relationships = {
    "related_model": "RelatedModel",
    "another_relationship": "AnotherModel",
}
```

This documentation helps with:
- Understanding model dependencies
- Identifying foreign key relationships
- Writing integration tests
- Creating API contracts

## Testing Strategy

When adding new models to this registry:

1. **Create a new model file**: Add model definition in a dedicated file matching the model's domain
2. **Update the registry**: Add the model to `__init__.py` in the appropriate category
3. **Document relationships**: Add `relationships` dictionary to the model
4. **Add metadata**: Include proper SQLAlchemy types and constraints

## Use Cases

These models are used for:

- **Selenium** tests: Testing user interfaces and interactions
- **DB operators** tests: Validating database operations
- **S3 tests**: Testing storage operations
- **Helios tests**: Testing Helios template-based queries
- **Generator examples**: Creating mock data for testing
- **Code quality** tests: Verifying production code against models

## Maintenance

- Keep all models in the `orthodent/backend/tests/tests/` directory
- Balance size: If a file becomes too large, consider splitting it
- Maintain consistent naming conventions
- Update this README when adding new models
- Ensure all models include proper foreign key relationships
