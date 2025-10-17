#!/bin/bash
set -euo pipefail

if command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y gcc-c++ make python3
elif command -v yum >/dev/null 2>&1; then
  sudo yum install -y gcc-c++ make python3
else
  echo "nem dnf nem yum encontrados; pulando instalação de build deps" >&2
fi
