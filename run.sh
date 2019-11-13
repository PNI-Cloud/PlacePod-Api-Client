#!/bin/sh
set -e

# Use a .env file for environment variables.
set -a
. .env
set +a

# Start the client.
npm start
