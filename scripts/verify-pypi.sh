#!/bin/bash
set -e

echo "🔍 Verifying PyPI package in a clean environment..."

# Create a temp dir
WORK_DIR=$(mktemp -d)
echo "📂 Created temp dir: $WORK_DIR"

# Setup cleanup trap to remove temp dir on exit
cleanup() {
    echo "🧹 Cleaning up..."
    rm -rf "$WORK_DIR"
}
trap cleanup EXIT

# Create venv
echo "🐍 Creating virtual environment..."
python3 -m venv "$WORK_DIR/venv"
source "$WORK_DIR/venv/bin/activate"

# Install from PyPI (no-cache to ensure we get the latest)
echo "⬇️  Installing tanggalan from PyPI..."
pip install --no-cache-dir --upgrade tanggalan

# Verify functionality
echo "🧪 Running verification..."
python3 -c "
from tanggalan import Tanggalan
from datetime import datetime

merdeka = Tanggalan(datetime(1945, 8, 17))
assert merdeka.dina == 'Jemuah' and merdeka.pasaran == 'Legi'
print(f'✅ Verified: 17 Aug 1945 is {merdeka}')
"