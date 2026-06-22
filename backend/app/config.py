from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URI: str
    MONGODB_DB_NAME: str = "whatsapp_saas"

    # Google Gemini
    GOOGLE_API_KEY: str
    GOOGLE_API_KEY_FALLBACK_1: str = ""   # First fallback key (used if primary hits quota)
    GOOGLE_API_KEY_FALLBACK_2: str = ""   # Second fallback key
    GEMINI_MODEL: str = "gemini-2.0-flash"

    # Groq (Optional - for AI message generation)
    GROQ_API_KEY: str = ""

    # Twilio (Sandbox configuration)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_NUMBER: str = "whatsapp:+14155238886"


    @property
    def all_gemini_keys(self) -> list[str]:
        """Returns all configured Gemini API keys, primary first."""
        return [
            k for k in [
                self.GOOGLE_API_KEY,
                self.GOOGLE_API_KEY_FALLBACK_1,
                self.GOOGLE_API_KEY_FALLBACK_2,
            ] if k
        ]

    # WhatsApp / Meta
    WHATSAPP_TOKEN: str
    WHATSAPP_PHONE_NUMBER_ID: str
    WHATSAPP_VERIFY_TOKEN: str
    WHATSAPP_APP_SECRET: str = ""  # For Bonus: X-Hub-Signature-256 validation

    # App
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
