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
        titleAr: 'الرئيسية',
        path: '/',
        order: 1,
        enabled: true,
      },
      {
        title: 'ABOUT US',
        titleAr: 'من نحن',
        path: '/about-us',
        order: 2,
        enabled: true,
      },
      {
        title: 'BUSINESSES',
        titleAr: 'الأعمال',
        path: '#',
        order: 3,
        enabled: true,
        megamenutwocolumn: [
          {
            title: 'OUR BUSINESS VERTICALS',
            titleAr: 'قطاعات أعمالنا',
            path: '#',
            dropdown: [
              {
                title: 'Consumer Goods',
                titleAr: 'السلع الاستهلاكية',
                text: 'Leading FMCG brands across Kuwait\'s key channels.',
                textAr: 'علامات تجارية استهلاكية رائدة عبر قنوات الكويت الرئيسية.',
                path: '#',
              },
              {
                title: 'Consumer Electronics',
                titleAr: 'الإلكترونيات الاستهلاكية',
                text: 'Home and personal electronics from global innovators.',
                textAr: 'إلكترونيات منزلية وشخصية من أبرز المبتكرين العالميين.',
                path: '#',
              },
              {
                title: 'Home Automation',
                titleAr: 'الأتمتة المنزلية',
                text: 'Smart home solutions for comfort & security.',
                textAr: 'حلول منزلية ذكية للراحة والأمان.',
                path: '#',
              },
              {
                title: 'Enterprise Technology',
                titleAr: 'تقنيات المؤسسات',
                text: 'End-to-end IT, print and AV solutions.',
                textAr: 'حلول متكاملة لتقنية المعلومات والطباعة والوسائط السمعية البصرية.',
                path: '#',
              },
              {
                title: 'Shipping',
                titleAr: 'الشحن',
                text: 'Port-to-door shipping, agency services and logistics.',
                textAr: 'خدمات شحن من الميناء إلى الباب، وخدمات الوكالات واللوجستيات.',
                path: '#',
              },
              {
                title: 'Travel & Tourism',
                titleAr: 'السفر والسياحة',
                text: 'Corporate, leisure and group travel across destinations.',
                textAr: 'خدمات سفر وسياحة للشركات والأفراد والمجموعات إلى مختلف الوجهات.',
                path: '#',
              },
            ],
          },
          {
            title: 'Spotlight on Our Businesses',
            titleAr: 'نظرة على أعمالنا',
            path: '#',
            dropdown: [
              {
                imageUrl: '/img/menu/megamenu.png',
                imageUrlMobile: '/img/menu/575.jpg',
                title: 'Inside the Group Portfolio',
                titleAr: 'داخل محفظة المجموعة',
                text: 'Six diverse businesses connecting consumers, enterprises and traders with leading global brands.',
                textAr: 'ستة قطاعات أعمال متنوعة تربط المستهلكين والشركات والتجار بأبرز العلامات التجارية العالمية.',
                path: '#',
                showbutton: true,
              }
            ]
          },
        ],
        bottommenu: [
          {
            title: 'Sales Contact',
            titleAr: 'تواصل مع المبيعات',
            path: '/contact-us',
          },
          {
            title: 'Download Profile',
            titleAr: 'تحميل الملف التعريفي',
            path: '#',
          },
          {
            title: 'Our Partners',
            titleAr: 'شركاؤنا',
            path: '/ourpartnerships',
          },
        ],
      },
      {
        title: 'CAPABILITIES',
        titleAr: 'القدرات',
        path: '#',
        order: 4,
        enabled: true,
        dropdown: [
          {
            title: 'HUMAN CAPITAL',
            titleAr: 'رأس المال البشري',
            path: '#',
          },
          {
            title: 'KNOWLEDGE CAPITAL',
            titleAr: 'رأس المال المعرفي',
            path: '#',
          },
          {
            title: 'BUSINESS EXCELLENCE',
            titleAr: 'التميز المؤسسي',
            path: '#',
          },
          {
            title: 'WAREHOUSE & LOGISTICS',
            titleAr: 'المستودعات والخدمات اللوجستية',
            path: '#',
          },
          {
            title: 'CUSTOMER CARE',
            titleAr: 'خدمة العملاء',
            path: '#',
          }
        ]
      },
      {
        title: 'CORPORATE INFO',
        titleAr: 'المعلومات المؤسسية',
        path: '#',
        order: 5,
        enabled: true,
        dropdown: [
          {
            title: 'NEWS & UPDATES',
            titleAr: 'الأخبار والتحديثات',
            path: '/news'
          },
          {
            title: 'CAREERS',
            titleAr: 'الوظائف',
            path: '/careers'
          },
          {
            title: 'OUR PARTNERSHIPS',
            titleAr: 'شراكاتنا',
            path: '/ourpartnerships'
          }
        ]
      },
      {
        title: 'CONTACT US',
        titleAr: 'اتصل بنا',
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
