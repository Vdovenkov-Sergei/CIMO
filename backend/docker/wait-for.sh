#!/bin/bash

set -e

wait_for_postgres() {
  until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; do
    echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
    sleep 1
  done
}

wait_for_redis() {
  until redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping | grep -q PONG; do
    echo "Waiting for Redis at $REDIS_HOST:$REDIS_PORT..."
    sleep 1
  done
}

wait_for_postgres
wait_for_redis
