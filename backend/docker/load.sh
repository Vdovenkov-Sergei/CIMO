#!/bin/bash

source /backend/docker/wait-for.sh


alembic upgrade head

python -m app.utils.load_data
