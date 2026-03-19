const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const capabilities = [
  {
    slug: 'human-capital',
    description: 'People development, talent strategy, and organizational capability building across all business units.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="20" r="10"/><path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22"/><circle cx="12" cy="24" r="7"/><path d="M2 50c0-8.28 4.48-15 10-15"/><circle cx="52" cy="24" r="7"/><path d="M62 50c0-8.28-4.48-15-10-15"/></svg>`,
  },
  {
    slug: 'knowledge-insights',
    description: 'Knowledge management and insight-driven decision support that powers smarter business outcomes.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="26" r="14"/><path d="M26 40v4a6 6 0 0 0 12 0v-4"/><line x1="32" y1="12" x2="32" y2="8"/><line x1="44.95" y1="17.05" x2="47.78" y2="14.22"/><line x1="19.05" y1="17.05" x2="16.22" y2="14.22"/><line x1="32" y1="26" x2="32" y2="34"/></svg>`,
  },
  {
    slug: 'business-excellence',
    description: 'Process optimization and excellence frameworks that drive continuous growth and competitive advantage.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="32,6 39.5,24 59,24 43.5,36 49.5,54 32,43 14.5,54 20.5,36 5,24 24.5,24"/></svg>`,
  },
  {
    slug: 'logistics',
    description: 'End-to-end warehouse and logistics capabilities ensuring efficient operations and on-time delivery.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="20" width="36" height="28" rx="2"/><path d="M40 28h12l8 10v10H40V28z"/><circle cx="16" cy="52" r="5"/><circle cx="48" cy="52" r="5"/><line x1="4" y1="32" x2="40" y2="32"/></svg>`,
  },
  {
    slug: 'customer-care',
    description: 'Customer service and experience management that builds loyalty and long-lasting relationships.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20a24 24 0 0 1 48 0c0 20-16 34-24 38C24 54 8 40 8 20z"/><path d="M32 18c0-4 3-7 7-7s7 3 7 7c0 6-7 12-14 18C25 30 18 24 18 18c0-4 3-7 7-7s7 3 7 7z"/></svg>`,
  },
];

async function updateCapabilities() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('services');

    for (const cap of capabilities) {
      const result = await collection.updateOne(
        { slug: cap.slug },
        {
          $set: {
            icon: cap.icon,
            description: cap.description,
            updated_at: new Date().toISOString(),
          },
        }
      );
      if (result.matchedCount === 0) {
        console.warn(`  ⚠ No document found with slug: ${cap.slug}`);
      } else {
        console.log(`  ✓ Updated: ${cap.slug}`);
      }
    }

    console.log('\nDone — capabilities icons and descriptions updated.');
  } catch (error) {
    console.error('Error updating capabilities:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

updateCapabilities();
