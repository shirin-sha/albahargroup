const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const faqItemsEn = [
  {
    title: 'What industries does Al-Bahar Group operate in?',
    text: 'Al-Bahar Group operates across consumer goods, consumer electronics, home automation, enterprise technology, shipping, travel and tourism, and other strategic sectors.'
  },
  {
    title: 'When was Al-Bahar Group founded?',
    text: 'Al-Bahar Group was founded in 1937 by Mr. Mohamed Abdulrahman Al-Bahar.'
  },
  {
    title: 'Does Al-Bahar Group partner with international brands?',
    text: 'Yes. The group has long-standing partnerships with leading global brands and continues to build alliances that create value for customers and stakeholders.'
  },
  {
    title: 'How can I contact Al-Bahar Group?',
    text: 'You can contact us through the Contact page by submitting the enquiry form, and our team will get back to you.'
  },
  {
    title: 'Does Al-Bahar Group support community initiatives?',
    text: 'Yes. Through foundations and social initiatives, the group supports community development and long-term social impact.'
  }
];

const faqItemsAr = [
  {
    title: 'ما هي القطاعات التي تعمل فيها مجموعة البهار؟',
    text: 'تعمل مجموعة البهار في عدة قطاعات تشمل السلع الاستهلاكية، والإلكترونيات الاستهلاكية، وأتمتة المنازل، وتقنيات المؤسسات، والشحن، والسفر والسياحة، وغيرها من القطاعات الاستراتيجية.'
  },
  {
    title: 'متى تأسست مجموعة البهار؟',
    text: 'تأسست مجموعة البهار عام 1937 على يد السيد محمد عبدالرحمن البهار.'
  },
  {
    title: 'هل لدى مجموعة البهار شراكات مع علامات تجارية عالمية؟',
    text: 'نعم، لدى المجموعة شراكات طويلة الأمد مع علامات تجارية عالمية رائدة، وتواصل بناء تحالفات تحقق قيمة للعملاء وأصحاب المصلحة.'
  },
  {
    title: 'كيف يمكنني التواصل مع مجموعة البهار؟',
    text: 'يمكنك التواصل معنا عبر صفحة اتصل بنا من خلال نموذج الاستفسار، وسيقوم فريقنا بالرد عليك.'
  },
  {
    title: 'هل تدعم مجموعة البهار المبادرات المجتمعية؟',
    text: 'نعم، من خلال المؤسسات والمبادرات الاجتماعية، تدعم المجموعة تنمية المجتمع وإحداث أثر اجتماعي مستدام.'
  }
];

async function updateAboutFaqItems() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('aboutPageSections');

    const result = await collection.updateOne(
      { sectionId: 'faq' },
      {
        $set: {
          'en.items': faqItemsEn,
          'ar.items': faqItemsAr,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn('No FAQ section found');
    } else {
      console.log('Updated FAQ questions and answers');
    }
  } catch (error) {
    console.error('Error updating FAQ items:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

updateAboutFaqItems();
