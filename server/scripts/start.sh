#!/bin/bash

echo "🏦 | Ligando banco..."
docker compose up -d

echo "🚀 | Ligando API..."
pnpm dev