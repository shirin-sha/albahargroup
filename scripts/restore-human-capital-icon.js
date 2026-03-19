const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="20" r="10"/><path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22"/><circle cx="12" cy="24" r="7"/><path d="M2 50c0-8.28 4.48-15 10-15"/><circle cx="52" cy="24" r="7"/><path d="M62 50c0-8.28-4.48-15-10-15"/></svg>`;

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const result = await db.collection('services').updateOne(
    { slug: 'human-capital' },
    { $set: { icon, updated_at: new Date().toISOString() } }
  );
  console.log(result.matchedCount ? '✓ Restored human-capital icon' : '⚠ Document not found');
  await client.close();
})();
