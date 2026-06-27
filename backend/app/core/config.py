from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AquaMind AI"
    DATABASE_URL: str = "mysql+pymysql://root:@localhost:3306/aquamind"
    SECRET_KEY: str = "a_very_secret_key_for_jwt_auth_aquamind"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
