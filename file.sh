#!/bin/bash

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'CyberExam'" \
| grep -q 1 || psql -U postgres -c "CREATE DATABASE CyberExam"

psql -U postgres -c "CREATE USER keycloak WITH PASSWORD 'kc'"