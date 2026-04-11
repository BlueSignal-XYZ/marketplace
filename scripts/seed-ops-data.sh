#!/bin/bash
# Seed ops dashboard data to Firebase RTDB using Firebase CLI.
# Requires: firebase login (already done)
#
# Usage:
#   bash scripts/seed-ops-data.sh         # seed data
#   bash scripts/seed-ops-data.sh --clear # clear /ops-dashboard
#
# Or via npm:
#   npm run seed:ops

set -e

PROJECT="waterquality-trading"
DB_URL="https://waterquality-trading-default-rtdb.firebaseio.com"
DATA_DIR="$(dirname "$0")/../dashboard/data"

if [ "$1" = "--clear" ]; then
  echo "Clearing /ops-dashboard/..."
  npx firebase-tools database:remove /ops-dashboard --project "$PROJECT" --force --non-interactive
  echo "Done."
  exit 0
fi

# Check if data directory exists
if [ ! -d "$DATA_DIR" ]; then
  echo "Error: dashboard/data/ directory not found."
  echo "The JSON data files are gitignored. You need them locally."
  echo ""
  echo "Option 1: Clone the agentic-harness repo and copy them:"
  echo "  git clone https://github.com/BlueSignal-XYZ/agentic-harness /tmp/harness"
  echo "  cd /tmp/harness && git checkout claude/setup-task-scheduling-LiZvj"
  echo "  cp -r /tmp/harness/dashboard/data ./dashboard/"
  echo ""
  echo "Option 2: If you have them locally already, make sure they're at dashboard/data/"
  exit 1
fi

echo "Seeding ops dashboard data to Firebase RTDB..."
echo ""

# Map filenames to RTDB paths
declare -A FILE_MAP=(
  ["customers.json"]="customers"
  ["active-initiatives.json"]="active-initiatives"
  ["team-cap-table.json"]="team-cap-table"
  ["needs-action-today.json"]="needs-action-today"
  ["todays-agenda.json"]="todays-agenda"
  ["top-accounts.json"]="top-accounts"
  ["pipeline-snapshot.json"]="pipeline-snapshot"
  ["forecast.json"]="forecast"
  ["dealer-health.json"]="dealer-health"
  ["dealer-calls.json"]="dealer-calls"
  ["spa-alerts.json"]="spa-alerts"
  ["open-loops.json"]="open-loops"
  ["stale-items.json"]="stale-items"
  ["products-pricing.json"]="products-pricing"
  ["competitive-intel.json"]="competitive-intel"
  ["territory-map.json"]="territory-map"
  ["events-programs.json"]="events-programs"
)

COUNT=0

for FILE in "${!FILE_MAP[@]}"; do
  NODE="${FILE_MAP[$FILE]}"
  FILEPATH="$DATA_DIR/$FILE"

  if [ ! -f "$FILEPATH" ]; then
    echo "  SKIP  $FILE (not found)"
    continue
  fi

  echo "  SET   /ops-dashboard/$NODE"
  npx firebase-tools database:set "/ops-dashboard/$NODE" --project "$PROJECT" --data "$(cat "$FILEPATH")" --force --non-interactive 2>/dev/null
  COUNT=$((COUNT + 1))
done

# Set last-synced timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
npx firebase-tools database:set "/ops-dashboard/last-synced" --project "$PROJECT" --data "\"$TIMESTAMP\"" --force --non-interactive 2>/dev/null
echo "  SET   /ops-dashboard/last-synced = $TIMESTAMP"

echo ""
echo "Done. Seeded $COUNT nodes to /ops-dashboard/."
