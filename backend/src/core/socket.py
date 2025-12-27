import socketio

from src.namespaces.attendance_namespace import AttendanceNamespace

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://hideously-patient-dolphin.ngrok-free.app"
]

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=origins,
    logger=False,
    engineio_logger=False
)

sio.register_namespace(AttendanceNamespace('/attendance'))