from config import settings
from reset import reset_all
from routing import *
from app import app, socket_io

if settings.do_reset:
    reset_all()


def send_state():
    while True:
        socket_io.emit("state", get_state(), json=True, broadcast=True)
        socket_io.sleep(0.05)


socket_io.start_background_task(send_state)

if __name__ == '__main__':
    app()
