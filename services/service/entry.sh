#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

touch __tmp

/usr/local/bin/docker-entrypoint.sh "$@" &
echo "waiting for postgres to start up"
until pg_isready
do
    sleep 1
done
sleep 5

python3 app.py
