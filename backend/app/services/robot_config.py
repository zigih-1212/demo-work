"""Configuration constants for robot operations."""

# Max attempts for a single tooth before giving up
MAX_ROBOT_ATTEMPTS: int = 4
# Simulate delay for testing (seconds) - set to 0 for real operations
SIMULATE_DELAY: float = 0.5
# Which HTTP status codes are considered transient (retryable)
RETRYABLE_EXCEPTIONS = frozenset(
    {
        408,  # Request Timeout
        429,  # Too Many Requests
        500,  # Internal Server Error
        502,  # Bad Gateway
        503,  # Service Unavailable
        504,  # Gateway Timeout
    }
)
