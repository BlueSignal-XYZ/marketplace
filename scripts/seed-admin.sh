#!/bin/bash
# seed-admin.sh — Bootstrap the first admin user
#
# Usage:
#   ./scripts/seed-admin.sh <firebase-uid> <seed-secret>
#
# Prerequisites:
#   1. The target user must already have a Firebase Auth account (sign up first).
#   2. Set ADMIN_SEED_SECRET in Firebase Functions config or environment:
#        firebase functions:config:set admin.seed_secret="your-secret-here"
#      Then deploy functions so the config takes effect.
#   3. This endpoint only works when NO admin user exists yet.
#
# Environment:
#   SERVER_URL — Override the Cloud Functions base URL (defaults to production).
#
# Example:
#   ./scripts/seed-admin.sh "abc123uid" "my-deploy-secret"

set -euo pipefail

SERVER_URL="${SERVER_URL:-https://us-central1-app-neptunechain.cloudfunctions.net/app}"
UID="${1:?Usage: $0 <firebase-uid> <seed-secret>}"
SECRET="${2:?Usage: $0 <firebase-uid> <seed-secret>}"

echo "🔐 Seeding admin for UID: $UID"
echo "   Server: $SERVER_URL"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$SERVER_URL/admin/seed" \
  -H "Content-Type: application/json" \
  -d "{\"uid\": \"$UID\", \"seedSecret\": \"$SECRET\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "Response ($HTTP_CODE):"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"

if [ "$HTTP_CODE" -eq 200 ]; then
  echo ""
  echo "✅ Admin seeded successfully!"
else
  echo ""
  echo "❌ Seed failed (HTTP $HTTP_CODE)"
  exit 1
fi
