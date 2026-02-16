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
      title: 'Partnerships'
    },
    ar: {
      title: 'شراكاتنا'
    }
  },
  {
    sectionId: 'partnerships',
    enabled: true,
    order: 2,
    en: {
      subheading: 'Our Partnerships',
      heading: 'Trusted Global Partners',
      text: 'We are proud to partner with leading global brands, bringing world-class products and services to Kuwait. Our strategic partnerships enable us to deliver excellence and innovation across diverse industries.',
      imageList: [
        {
          src: '/img/brand/b1.png',
          width: 200,
          height: 120,
          alt: 'Partner Brand 1',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b2.png',
          width: 200,
          height: 120,
          alt: 'Partner Brand 2',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b3.png',
          width: 200,
          height: 120,
          alt: 'Partner Brand 3',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b4.png',
          width: 200,
          height: 120,
          alt: 'Partner Brand 4',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b5.png',
          width: 200,
          height: 120,
          alt: 'Partner Brand 5',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b6.png',
          width: 200,
          height: 120,
          alt: 'Partner Brand 6',
          loading: 'lazy'
        },
        {
          src: '/img/brand/hama.png',
          width: 200,
          height: 120,
          alt: 'Hama',
          loading: 'lazy'
        },
        {
          src: '/img/brand/goody.png',
          width: 200,
          height: 120,
          alt: 'Goody',
          loading: 'lazy'
        },
        {
          src: '/img/brand/ge.png',
          width: 200,
          height: 120,
          alt: 'GE',
          loading: 'lazy'
        },
        {
          src: '/img/brand/marshall.png',
          width: 200,
          height: 120,
          alt: 'Marshall',
          loading: 'lazy'
        },
        {
          src: '/img/brand/honeywell.png',
          width: 200,
          height: 120,
          alt: 'Honeywell',
          loading: 'lazy'
        },
        {
          src: '/img/brand/alalai.png',
          width: 200,
          height: 120,
          alt: 'Al Alai',
          loading: 'lazy'
        },
        {
          src: '/img/brand/lago.png',
          width: 200,
          height: 120,
          alt: 'Lago',
          loading: 'lazy'
        },
        {
          src: '/img/brand/germanica.png',
          width: 200,
          height: 120,
          alt: 'Germanica',
          loading: 'lazy'
        },
        {
          src: '/img/brand/pil.png',
          width: 200,
          height: 120,
          alt: 'PIL',
          loading: 'lazy'
        }
      ]
    },
    ar: {
      subheading: 'شراكاتنا',
      heading: 'شركاء عالميون موثوقون',
      text: 'نفخر بشراكتنا مع العلامات التجارية العالمية الرائدة، حيث نقدم منتجات وخدمات عالمية المستوى إلى الكويت. تمكننا شراكاتنا الاستراتيجية من تقديم التميز والابتكار عبر مختلف الصناعات.',
      imageList: [
        {
          src: '/img/brand/b1.png',
          width: 200,
          height: 120,
          alt: 'شريك 1',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b2.png',
          width: 200,
          height: 120,
          alt: 'شريك 2',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b3.png',
          width: 200,
          height: 120,
          alt: 'شريك 3',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b4.png',
          width: 200,
          height: 120,
          alt: 'شريك 4',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b5.png',
          width: 200,
          height: 120,
          alt: 'شريك 5',
          loading: 'lazy'
        },
        {
          src: '/img/brand/b6.png',
          width: 200,
          height: 120,
          alt: 'شريك 6',
          loading: 'lazy'
        },
        {
          src: '/img/brand/hama.png',
          width: 200,
          height: 120,
          alt: 'هاما',
          loading: 'lazy'
        },
        {
          src: '/img/brand/goody.png',
          width: 200,
          height: 120,
          alt: 'جودي',
          loading: 'lazy'
        },
        {
          src: '/img/brand/ge.png',
          width: 200,
          height: 120,
          alt: 'GE',
          loading: 'lazy'
        },
        {
          src: '/img/brand/marshall.png',
          width: 200,
          height: 120,
          alt: 'مارشال',
          loading: 'lazy'
        },
        {
          src: '/img/brand/honeywell.png',
          width: 200,
          height: 120,
          alt: 'هونيول',
          loading: 'lazy'
        },
        {
          src: '/img/brand/alalai.png',
          width: 200,
          height: 120,
          alt: 'العلي',
          loading: 'lazy'
        },
        {
          src: '/img/brand/lago.png',
          width: 200,
          height: 120,
          alt: 'لاغو',
          loading: 'lazy'
        },
        {
          src: '/img/brand/germanica.png',
          width: 200,
          height: 120,
          alt: 'جيرمانيكا',
          loading: 'lazy'
        },
        {
          src: '/img/brand/pil.png',
          width: 200,
          height: 120,
          alt: 'PIL',
          loading: 'lazy'
        }
      ]
    }
  }
];

async function seedPartnershipsCMS() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('partnershipsPageSections');

    // Clear existing sections
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing partnerships page sections');

    // Insert default sections
    const sectionsWithDates = defaultSections.map(section => ({
      ...section,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const result = await collection.insertMany(sectionsWithDates);

    console.log(`✅ Seeded ${result.insertedCount} partnerships page sections`);
    console.log('📋 Sections:');
    defaultSections.forEach(section => {
      if (section.sectionId === 'banner') {
        console.log(`   - ${section.sectionId} (EN: ${section.en.title})`);
      } else if (section.sectionId === 'partnerships') {
        console.log(`   - ${section.sectionId} (EN: ${section.en.heading})`);
        console.log(`     Partners: ${section.en.imageList.length} logos`);
      } else {
        console.log(`   - ${section.sectionId}`);
      }
    });
  } catch (error) {
    console.error('❌ Error seeding partnerships CMS:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
}

seedPartnershipsCMS();
