"""Exception classes for URI Social SDK"""


class URISocialError(Exception):
    """Base exception for URI Social SDK"""

    def __init__(self, message: str, status: int = 0, response: dict = None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.response = response or {}

    def __str__(self) -> str:
        if self.status:
            return f"[{self.status}] {self.message}"
        return self.message


class AuthenticationError(URISocialError):
    """Raised when API key is invalid or missing"""

    pass


class RateLimitError(URISocialError):
    """Raised when API rate limit is exceeded"""

    pass


class InsufficientCreditsError(URISocialError):
    """Raised when account has insufficient credits"""

    pass


class ValidationError(URISocialError):
    """Raised when request validation fails"""

    pass


class NotFoundError(URISocialError):
    """Raised when resource is not found"""

    pass


class ServerError(URISocialError):
    """Raised when server encounters an error"""

    pass
