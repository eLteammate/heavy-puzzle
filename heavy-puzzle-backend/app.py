import socketio
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from config import settings


socket_io = socketio.Server(
    cors_allowed_origins=settings.cors.website_url,
    # logger=True,
)

app = socketio.WSGIApp(
    socket_io,
    static_files={"/static/": "./static"},
)

engine = create_engine("sqlite:///./static/db.sqlite")
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()
