const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const businessVerticals = [
  {
    slug: 'consumer-goods',
    description: 'Distribution and brand partnerships across fast-moving consumer goods in Kuwait.',
    icon: 'ConsumerFmcg',
  },
  {
    slug: 'consumer-electronics',
    description: 'End-to-end consumer electronics distribution with strong retail execution.',
    icon: 'Consultingnew',
  },
  {
    slug: 'home-automation',
    description: 'Smart home and automation solutions tailored for modern lifestyles.',
    icon: 'Storefront',
  },
  {
    slug: 'enterprise-technology',
    description: 'Technology products and services supporting enterprise transformation.',
    icon: 'Consultingnew',
  },
  {
    slug: 'shipping',
    description: 'Reliable shipping, maritime agency, and logistics support services.',
    icon: 'CargoShip',
  },
  {
    slug: 'travel-tourism',
    description: 'Corporate and leisure travel solutions designed for seamless journeys.',
    icon: 'Airplane',
  },
];

async function updateBusinessVerticals() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('services');

    for (const item of businessVerticals) {
      const result = await collection.updateOne(
        { slug: item.slug, section: 'businesses' },
        {
          $set: {
            description: item.description,
            icon: item.icon,
            updated_at: new Date().toISOString(),
          },
        }
      );

      if (result.matchedCount === 0) {
        console.warn(`No business vertical found for slug: ${item.slug}`);
      } else {
        console.log(`Updated: ${item.slug}`);
      }
    }

    console.log('Business vertical slider content updated.');
  } catch (error) {
    console.error('Error updating business verticals:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

updateBusinessVerticals();
