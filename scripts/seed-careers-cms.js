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
      title: 'Careers'
    },
    ar: {
      title: 'الوظائف'
    }
  },
  {
    sectionId: 'careerSection',
    enabled: true,
    order: 2,
    en: {
      subheading: 'Join Our Team',
      heading: 'Build Your Career with Al-Bahar Group',
      text: 'Join a dynamic team where your talents are valued, your growth is supported, and your contributions make a real impact. We\'re looking for passionate professionals who share our commitment to excellence.'
    },
    ar: {
      subheading: 'انضم إلى فريقنا',
      heading: 'ابني مسيرتك المهنية مع مجموعة البahar',
      text: 'انضم إلى فريق ديناميكي حيث يتم تقدير مواهبك، ودعم نموك، وتترك مساهماتك تأثيرًا حقيقيًا. نحن نبحث عن محترفين شغوفين يشاركوننا التزامنا بالتميز.'
    }
  }
];

async function seedCareersCMS() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('careersPageSections');

    // Clear existing sections
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing careers page sections');

    // Insert default sections
    const sectionsWithDates = defaultSections.map(section => ({
      ...section,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const result = await collection.insertMany(sectionsWithDates);

    console.log(`✅ Seeded ${result.insertedCount} careers page sections`);
    console.log('📋 Sections:');
    defaultSections.forEach(section => {
      if (section.sectionId === 'banner') {
        console.log(`   - ${section.sectionId} (EN: ${section.en.title})`);
      } else if (section.sectionId === 'careerSection') {
        console.log(`   - ${section.sectionId} (EN: ${section.en.heading})`);
      } else {
        console.log(`   - ${section.sectionId}`);
      }
    });
  } catch (error) {
    console.error('❌ Error seeding careers CMS:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
}

seedCareersCMS();
