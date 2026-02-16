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
      title: 'Contact Us'
    },
    ar: {
      title: 'اتصل بنا'
    }
  },
  {
    sectionId: 'contactForm',
    enabled: true,
    order: 2,
    en: {
      subheading: 'How To Reach',
      heading: 'Contact Us',
      text: 'If you would like to know more about Mohamed Abdulrahman Al-Bahar Group or have any inquiries, kindly reach out to us.',
      promotions: [
        {
          title: 'Address',
          text: 'Kuwait City, Abu Bakr Street 2,<br />Al Bahar Tower, Kuwait'
        },
        {
          title: 'Call for queries',
          text: '+ 965 220 72111 Ext. 1030'
        },
        {
          title: 'Email Us',
          text: 'enquiry@albahargroup.com'
        }
      ],
      block: {
        heading: 'Get in Touch',
        text: 'Fill out the form below and we\'ll get back to you as soon as possible'
      }
    },
    ar: {
      subheading: 'كيفية الوصول',
      heading: 'اتصل بنا',
      text: 'إذا كنت ترغب في معرفة المزيد عن مجموعة محمد عبدالرحمن البahar أو لديك أي استفسارات، يرجى التواصل معنا.',
      promotions: [
        {
          title: 'العنوان',
          text: 'مدينة الكويت، شارع أبو بكر 2،<br />برج البahar، الكويت'
        },
        {
          title: 'اتصل للاستفسارات',
          text: '+ 965 220 72111 داخلي 1030'
        },
        {
          title: 'راسلنا',
          text: 'enquiry@albahargroup.com'
        }
      ],
      block: {
        heading: 'تواصل معنا',
        text: 'املأ النموذج أدناه وسنعود إليك في أقرب وقت ممكن'
      }
    }
  },
  {
    sectionId: 'map',
    enabled: true,
    order: 3,
    en: {
      mapEmbed: ''
    },
    ar: {
      mapEmbed: ''
    }
  }
];

async function seedContactCMS() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('contactPageSections');

    // Clear existing sections
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing contact page sections');

    // Insert default sections
    const sectionsWithDates = defaultSections.map(section => ({
      ...section,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const result = await collection.insertMany(sectionsWithDates);

    console.log(`✅ Seeded ${result.insertedCount} contact page sections`);
    console.log('📋 Sections:');
    defaultSections.forEach(section => {
      if (section.sectionId === 'banner') {
        console.log(`   - ${section.sectionId} (EN: ${section.en.title})`);
      } else if (section.sectionId === 'contactForm') {
        console.log(`   - ${section.sectionId} (EN: ${section.en.heading})`);
        console.log(`     Promotions: ${section.en.promotions.length} items`);
      } else {
        console.log(`   - ${section.sectionId}`);
      }
    });
  } catch (error) {
    console.error('❌ Error seeding contact CMS:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
}

seedContactCMS();
