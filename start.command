#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"
echo "💧 Launching H2O Groundwater Intelligence Platform..."
(sleep 2 && open http://localhost:5173) &
npm run dev
