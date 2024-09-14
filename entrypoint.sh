#!/bin/bash

uvicorn main:app --host '::' --port 8000 --reload --reload-include '*.ini' &
  
# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?
