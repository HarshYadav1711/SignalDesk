from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "SignalDesk API"
    database_url: str = "sqlite:///./signaldesk.db"
    log_level: str = "INFO"


settings = Settings()
