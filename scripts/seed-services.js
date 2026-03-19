const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const nowIso = () => new Date().toISOString();

const services = [
  // Businesses
  {
    id: 1,
    section: 'businesses',
    slug: 'consumer-goods',
    title: 'Consumer Goods',
    detailTitle: 'Consumer Goods',
    image: '/img/service/s1.jpg',
    content: '<p>Consumer goods solutions and brand partnerships.</p>',
    enabled: true,
  },
  {
    id: 2,
    section: 'businesses',
    slug: 'consumer-electronics',
    title: 'Consumer Electronics',
    detailTitle: 'Consumer Electronics',
    image: '/img/service/s2.jpg',
    content: '<p>Consumer electronics distribution and market execution.</p>',
    enabled: true,
  },
  {
    id: 3,
    section: 'businesses',
    slug: 'home-automation',
    title: 'Home Automation',
    detailTitle: 'Home Automation',
    image: '/img/service/s3.jpg',
    content: '<p>Home automation products and integrated solutions.</p>',
    enabled: true,
  },
  {
    id: 4,
    section: 'businesses',
    slug: 'enterprise-technology',
    title: 'Enterprise Technology',
    detailTitle: 'Enterprise Technology',
    image: '/img/service/s4.jpg',
    content: '<p>Enterprise technology services and managed solutions.</p>',
    enabled: true,
  },
  {
    id: 5,
    section: 'businesses',
    slug: 'shipping',
    title: 'Shipping',
    detailTitle: 'Shipping',
    image: '/img/service/s5.jpg',
    content: '<p>Shipping, agency, and maritime support services.</p>',
    enabled: true,
  },
  {
    id: 6,
    section: 'businesses',
    slug: 'travel-tourism',
    title: 'Travel and Tourism',
    detailTitle: 'Travel and Tourism',
    image: '/img/service/s6.jpg',
    content: '<p>Travel and tourism solutions for corporate and retail clients.</p>',
    enabled: true,
  },

  // Capabilities
  {
    id: 7,
    section: 'capabilities',
    slug: 'human-capital',
    title: 'Human Capital',
    detailTitle: 'Human Capital',
    image: '/img/service/s7.jpg',
    content: '<p>People development, talent strategy, and organizational capability.</p>',
    enabled: true,
  },
  {
    id: 8,
    section: 'capabilities',
    slug: 'knowledge-insights',
    title: 'Knowledge Capital',
    detailTitle: 'Knowledge Capital',
    image: '/img/service/s8.jpg',
    content: '<p>Knowledge management and insight-driven decision support.</p>',
    enabled: true,
  },
  {
    id: 9,
    section: 'capabilities',
    slug: 'business-excellence',
    title: 'Business Excellence',
    detailTitle: 'Business Excellence',
    image: '/img/service/s9.jpg',
    content: '<p>Process optimization and excellence frameworks for growth.</p>',
    enabled: true,
  },
  {
    id: 10,
    section: 'capabilities',
    slug: 'logistics',
    title: 'Warehouse and Logistics',
    detailTitle: 'Warehouse and Logistics',
    image: '/img/service/s10.jpg',
    content: '<p>Warehouse and logistics capabilities across operations.</p>',
    enabled: true,
  },
  {
    id: 11,
    section: 'capabilities',
    slug: 'customer-care',
    title: 'Customer Care',
    detailTitle: 'Customer Care',
    image: '/img/service/s11.jpg',
    content: '<p>Customer service and experience management capabilities.</p>',
    enabled: true,
  },
];

async function seedServices() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('services');

    await collection.deleteMany({});
    console.log('Cleared existing services');

    const withDates = services.map((service) => ({
      ...service,
      created_at: nowIso(),
      updated_at: nowIso(),
    }));

    const result = await collection.insertMany(withDates);
    console.log(`Inserted ${result.insertedCount} services`);
    console.log('Seeded sections: businesses (6), capabilities (5)');
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seedServices();
