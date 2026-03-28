const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const iconMap = [
  { slug: 'technology-solutions', icon: 'Consultingnew' },
  { slug: 'consumer-fmcg', icon: 'ConsumerFmcg' },
  { slug: 'shipping-logistics', icon: 'CargoShip' },
  { slug: 'travel-tourism', icon: 'Airplane' },
  { slug: 'retail-lifestyle', icon: 'Storefront' },
];

async function seedBusinessIcons() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('services');

    for (const item of iconMap) {
      const result = await collection.updateOne(
        { section: 'businesses', slug: item.slug },
        {
          $set: {
            icon: item.icon,
            updated_at: new Date().toISOString(),
          },
        }
      );

      if (result.matchedCount === 0) {
        console.warn(`No business service found for slug: ${item.slug}`);
      } else {
        console.log(`Updated icon: ${item.slug} -> ${item.icon}`);
      }
    }
  } catch (error) {
    console.error('Error seeding business icons:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedBusinessIcons();
