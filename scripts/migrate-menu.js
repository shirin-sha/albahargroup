const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'albahargroup';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function migrateMenu() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('headerMenu');

    // Read menu from TypeScript file (we'll parse it manually)
    const menuData = [
      {
        title: 'HOME',
        path: '/',
        order: 1,
        enabled: true,
      },
      {
        title: 'ABOUT US',
        path: '/about-us',
        order: 2,
        enabled: true,
      },
      {
        title: 'BUSINESSES',
        path: '#',
        order: 3,
        enabled: true,
        megamenutwocolumn: [
          {
            title: 'OUR BUSINESS VERTICALS',
            path: '#',
            dropdown: [
              {
                title: 'Consumer Goods',
                text: 'Leading FMCG brands across Kuwait\'s key channels.',
                path: '#',
              },
              {
                title: 'Consumer Electronics',
                text: 'Home and personal electronics from global innovators.',
                path: '#',
              },
              {
                title: 'Home Automation',
                text: 'Smart home solutions for comfort & security.',
                path: '#',
              },
              {
                title: 'Enterprise Technology',
                text: 'End-to-end IT, print and AV solutions.',
                path: '#',
              },
              {
                title: 'Shipping',
                text: 'Port-to-door shipping, agency services and logistics.',
                path: '#',
              },
              {
                title: 'Travel & Tourism',
                text: 'Corporate, leisure and group travel across destinations.',
                path: '#',
              },
            ],
          },
          {
            title: 'Spotlight on Our Businesses',
            path: '#',
            dropdown: [
              {
                imageUrl: '/img/menu/megamenu.png',
                imageUrlMobile: '/img/menu/575.jpg',
                title: 'Inside the Group Portfolio',
                text: 'Six diverse businesses connecting consumers, enterprises and traders with leading global brands.',
                path: '#',
                showbutton: true,
              }
            ]
          },
        ],
        bottommenu: [
          {
            title: 'Contact Sales',
            path: '/contact-us',
          },
          {
            title: 'Download Profile',
            path: '#',
          },
          {
            title: 'Our Partners',
            path: '/ourpartnerships',
          },
        ],
      },
      {
        title: 'CAPABILITIES',
        path: '#',
        order: 4,
        enabled: true,
        dropdown: [
          {
            title: 'HUMAN CAPITAL',
            path: '#',
          },
          {
            title: 'KNOWLEDGE CAPITAL',
            path: '#',
          },
          {
            title: 'BUSINESS EXCELLENCE',
            path: '#',
          },
          {
            title: 'WAREHOUSE & LOGISTICS',
            path: '#',
          },
          {
            title: 'CUSTOMER CARE',
            path: '#',
          }
        ]
      },
      {
        title: 'CORPORATE INFO',
        path: '#',
        order: 5,
        enabled: true,
        dropdown: [
          {
            title: 'NEWS & UPDATES',
            path: '/news'
          },
          {
            title: 'CAREERS',
            path: '/careers'
          },
          {
            title: 'OUR PARTNERSHIPS',
            path: '/ourpartnerships'
          }
        ]
      },
      {
        title: 'CONTACT US',
        path: '/contact-us',
        order: 6,
        enabled: true,
      }
    ];

    console.log(`Found ${menuData.length} menu items`);

    // Check if menu already exists
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Warning: ${existingCount} menu items already exist in database.`);
      console.log('Skipping migration to avoid duplicates.');
      console.log('If you want to migrate anyway, delete existing menu items first.');
      return;
    }

    // Transform menu data
    const menusToInsert = menuData.map(menu => ({
      ...menu,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert menus
    const result = await collection.insertMany(menusToInsert);
    console.log(`Successfully migrated ${result.insertedCount} menu items to MongoDB`);

  } catch (error) {
    console.error('Error migrating menu:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Migration completed');
  }
}

migrateMenu();
