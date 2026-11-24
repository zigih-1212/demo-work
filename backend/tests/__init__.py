"""Test exceptions module."""


class TestError(Exception):
    """Base exception for tests."""

    pass


class ValidationError(TestError):
    """Validation error in test data."""

    pass
