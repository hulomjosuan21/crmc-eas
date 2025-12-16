import redis
from rq import Queue
from src.core.config import settings

redis_conn = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB
)

task_queue = Queue(
    name=settings.RQ_QUEUE_NAME,
    connection=redis_conn
)