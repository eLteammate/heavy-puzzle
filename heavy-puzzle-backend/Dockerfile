# syntax=docker/dockerfile:1
FROM python:3.9-alpine
WORKDIR /app
RUN apk add --no-cache g++ make zlib-dev jpeg-dev gcc musl-dev
COPY requirements.txt requirements.txt
RUN python -m venv venv && source venv/bin/activate && pip3 install -r requirements.txt
COPY . .
CMD ["venv/bin/gunicorn", "-k", "eventlet", "-w", "1", "main:app", "-b", "0.0.0.0:8000"]
