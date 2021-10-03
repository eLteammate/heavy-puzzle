
from dynaconf import Dynaconf

settings = Dynaconf(
    envvar_prefix="SETTINGS",
    settings_files=['settings.toml', '.secrets.toml'],
)
