const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const defaultSections = [
  {
    sectionId: 'banner',
    enabled: true,
    order: 1,
    en: {
      title: 'News'
    },
    ar: {
      title: 'الأخبار'
    }
  },
  {
    sectionId: 'blogGrid',
    enabled: true,
    order: 2,
    en: {
      subheading: 'Latest Updates',
      heading: 'News & Updates'
    },
    ar: {
      subheading: 'آخر التحديثات',
      heading: 'الأخبار والتحديثات'
    }
  }
];

async function seedNewsCMS() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('newsPageSections');

    // Clear existing sections
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing news page sections');

    // Insert default sections
    const sectionsWithDates = defaultSections.map(section => ({
      ...section,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const result = await collection.insertMany(sectionsWithDates);

    console.log(`✅ Seeded ${result.insertedCount} news page sections`);
    console.log('📋 Sections:');
    defaultSections.forEach(section => {
      if (section.sectionId === 'banner') {
        console.log(`   - ${section.sectionId} (EN: ${section.en.title})`);
      } else if (section.sectionId === 'blogGrid') {
        console.log(`   - ${section.sectionId} (EN: ${section.en.heading})`);
      } else {
        console.log(`   - ${section.sectionId}`);
      }
    });
  } catch (error) {
    console.error('❌ Error seeding news CMS:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
}

seedNewsCMS();
