const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const items = [
  {
    text: "Over the decades, we've grown to become a leading force in regional markets across a variety of industries. Our diverse portfolio spans everything from consumer goods, home appliances, cutting-edge electronics, shipping, office technology, IT solutions, and beyond."
  },
  {
    text: "Partnering with global titans like Unilever, Canon, and GE appliances, we bring Kuwait's shoppers the latest in innovation and best practices. Our ethos thrives on collaboration, fostering enduring relationships that benefit both brands and customers alike."
  },
  {
    text: "More than just commerce, we're committed to community. Through our foundations and corporate social initiatives, we're dedicated to giving back, enriching the lives of those we serve. Join us as we continue our proud tradition of excellence and impact in Kuwait and the region."
  }
];

async function updateAboutTestimonials() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('aboutPageSections');

    const result = await collection.updateOne(
      { sectionId: 'testimonials' },
      {
        $set: {
          'en.items': items,
          'ar.items': items,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn('No testimonials section found');
    } else {
      console.log('Updated testimonials cards for About CMS');
    }
  } catch (error) {
    console.error('Error updating about testimonials:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

updateAboutTestimonials();
