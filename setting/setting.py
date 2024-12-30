from typing import Type, Tuple, Self
from functools import lru_cache
from pathlib import Path
import json
from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
    PydanticBaseSettingsSource,
    JsonConfigSettingsSource,
)

config_file = Path(__file__).parent.parent / "config.json"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(json_file=config_file, json_file_encoding="utf-8")
    app_name: str
    debug_mode: bool

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: Type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> Tuple[PydanticBaseSettingsSource, ...]:
        return (JsonConfigSettingsSource(settings_cls),)

    def save(self):
        # 将当前设置保存到 config.json 文件
        with open(config_file, "w") as f:
            json.dump(self.dict(), f, indent=4)


@lru_cache
def get_settings():
    return Settings()
