#!/usr/bin/env node
/**
 * Seed script — pushes dashboard/data/*.json to Firebase RTDB /ops-dashboard/.
 *
 * Prerequisites:
 *   firebase login                        (authenticate CLI)
 *   firebase use waterquality-trading     (select project)
 *
 * Usage:
 *   node scripts/seed-ops-data.js         (seed data)
 *   node scripts/seed-ops-data.js --clear (clear ops-dashboard node)
 *
 * Or via npm:
 *   npm run seed:ops
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  projectId: 'waterquality-trading',
  databaseURL: 'https://waterquality-trading-default-rtdb.firebaseio.com',
});

const rtdb = admin.database();
const CLEAR_MODE = process.argv.includes('--clear');
const DATA_DIR = path.join(__dirname, '..', 'dashboard', 'data');

// Map JSON filenames to Firebase node names
const FILE_NODE_MAP = {
  'customers.json': 'customers',
  'active-initiatives.json': 'active-initiatives',
  'team-cap-table.json': 'team-cap-table',
  'needs-action-today.json': 'needs-action-today',
  'todays-agenda.json': 'todays-agenda',
  'top-accounts.json': 'top-accounts',
  'pipeline-snapshot.json': 'pipeline-snapshot',
  'forecast.json': 'forecast',
  'dealer-health.json': 'dealer-health',
  'dealer-calls.json': 'dealer-calls',
  'spa-alerts.json': 'spa-alerts',
  'open-loops.json': 'open-loops',
  'stale-items.json': 'stale-items',
  'products-pricing.json': 'products-pricing',
  'competitive-intel.json': 'competitive-intel',
  'territory-map.json': 'territory-map',
  'events-programs.json': 'events-programs',
};

async function seed() {
  console.log('Seeding ops dashboard data to Firebase RTDB...\n');

  const opsRef = rtdb.ref('ops-dashboard');
  let count = 0;

  for (const [filename, nodeName] of Object.entries(FILE_NODE_MAP)) {
    const filePath = path.join(DATA_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP  ${filename} (file not found)`);
      continue;
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await opsRef.child(nodeName).set(content);
    console.log(`  SET   /ops-dashboard/${nodeName}`);
    count++;
  }

  // Set last-synced timestamp
  const timestamp = new Date().toISOString();
  await opsRef.child('last-synced').set(timestamp);
  console.log(`  SET   /ops-dashboard/last-synced = ${timestamp}`);

  console.log(`\nDone. Seeded ${count} nodes to /ops-dashboard/.\n`);
}

async function clear() {
  console.log('Clearing /ops-dashboard/ from Firebase RTDB...\n');
  await rtdb.ref('ops-dashboard').remove();
  console.log('Done. /ops-dashboard/ removed.\n');
}

(CLEAR_MODE ? clear() : seed())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
