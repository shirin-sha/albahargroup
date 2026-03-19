const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const blockListEn = [
  {
    subheading: 'Vision',
    heading: 'Our long-term direction and aspiration.',
    text: 'To Always be the Most Trusted and Best-in-Class Partner.',
    image: {
      src: '/img/project/1.jpg',
      width: 1000,
      height: 707,
      loading: 'lazy',
      alt: 'Vision'
    }
  },
  {
    subheading: 'Mission',
    heading: 'How we create value every day.',
    text: 'Delivering excellence and success by directing our values, talents, resources and expertise to maximize customer satisfaction and to achieve sustainable growth for all stakeholders.',
    image: {
      src: '/img/project/2.jpg',
      width: 1000,
      height: 707,
      loading: 'lazy',
      alt: 'Mission'
    }
  },
  {
    subheading: 'Values',
    heading: 'Principles that guide our behaviour and decisions.',
    text: '<ul style="list-style-type: disc; padding-left: 20px;"><li>We deliver on our commitments.</li><li>We view our people as the source of our strength.</li><li>We work together as a team.</li><li>We listen, we care, we respect.</li><li>We seek continual self and work improvement.</li></ul>',
    image: {
      src: '/img/project/3.jpg',
      width: 1000,
      height: 707,
      loading: 'lazy',
      alt: 'Values'
    }
  }
];

const blockListAr = [
  {
    subheading: 'الرؤية',
    heading: 'اتجاهنا وطموحنا على المدى الطويل.',
    text: 'أن نكون دائماً الشريك الأكثر ثقة والأفضل في فئته.',
    image: {
      src: '/img/project/1.jpg',
      width: 1000,
      height: 707,
      loading: 'lazy',
      alt: 'الرؤية'
    }
  },
  {
    subheading: 'المهمة',
    heading: 'كيف نخلق القيمة كل يوم.',
    text: 'تقديم التميز والنجاح من خلال توجيه قيمنا ومواهبنا ومواردنا وخبراتنا لتعظيم رضا العملاء وتحقيق نمو مستدام لجميع أصحاب المصلحة.',
    image: {
      src: '/img/project/2.jpg',
      width: 1000,
      height: 707,
      loading: 'lazy',
      alt: 'المهمة'
    }
  },
  {
    subheading: 'القيم',
    heading: 'المبادئ التي توجه سلوكنا وقراراتنا.',
    text: '<ul style="list-style-type: disc; padding-left: 20px;"><li>نفي بالتزاماتنا.</li><li>نرى في موظفينا مصدر قوتنا.</li><li>نعمل معاً كفريق واحد.</li><li>نستمع، نهتم، نحترم.</li><li>نسعى للتحسين المستمر للذات والعمل.</li></ul>',
    image: {
      src: '/img/project/3.jpg',
      width: 1000,
      height: 707,
      loading: 'lazy',
      alt: 'القيم'
    }
  }
];

async function updateAboutStickyBanner() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('aboutPageSections');

    const result = await collection.updateOne(
      { sectionId: 'stickyBanner' },
      {
        $set: {
          'en.blockList': blockListEn,
          'ar.blockList': blockListAr,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn('No stickyBanner section found');
    } else {
      console.log('Updated sticky banner cards for About CMS');
    }
  } catch (error) {
    console.error('Error updating sticky banner:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

updateAboutStickyBanner();
