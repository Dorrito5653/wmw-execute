from aiohttp import web
import socketio
import asyncio
import logging

logger = logging.basicConfig(
    format='%(asctime)s [%(levelname)s] : %(message)s'
)

socket = socketio.AsyncServer(cors_allowed_origins="*")
app = web.Application()
socket.attach(app)


@socket.event
def connect(sid: str, environ):
    print("connect ", sid)


@socket.event
async def message(sid: str, data):
    print(sid, data)


@socket.event
def disconnect(sid: str):
    print('disconnect ', sid)


app.router.add_static('/app/', 'app')

if __name__ == '__main__':
    web.run_app(app, port=5555, host='localhost')
