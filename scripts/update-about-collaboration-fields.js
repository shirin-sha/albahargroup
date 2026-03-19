const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function updateCollaborationSection() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('aboutPageSections');

    const result = await collection.updateOne(
      { sectionId: 'collaboration' },
      {
        $set: {
          'en.block': {
            heading: 'Strategic Support & Guidance',
            text: 'BKGH recommends necessary resources, provides expertise, and offers strategic guidance to individual Al-Bahar companies, enabling them to focus on their core business activities and daily operations. It ensures that all companies within the group adhere to a unified vision, benefiting from shared services and standardized best practices.',
            subheading: 'Talent Management & Collaboration',
          },
          'ar.block': {
            heading: 'الدعم الاستراتيجي والتوجيه',
            text: 'توفر BKGH الموارد اللازمة وتقدم الخبرة وتقدم التوجيه الاستراتيجي للشركات الفردية في البahar، مما يمكنها من التركيز على أنشطتها التجارية الأساسية والعمليات اليومية. تضمن أن جميع الشركات داخل المجموعة تلتزم برؤية موحدة، وتستفيد من الخدمات المشتركة وأفضل الممارسات الموحدة.',
            subheading: 'إدارة المواهب والتعاون',
          },
          'en.textList': [
            {
              text: "BKGH's role extends beyond administration and supervision; it actively participates in the Group's talent management initiatives, fostering collaboration among team members and ensuring that all companies leverage their collective strengths. This collaborative approach allows the Group to achieve both short- and long-term objectives, maximize business potential, adapt to market changes, and seize new opportunities, thereby reinforcing the sustainable growth of the entire Group."
            }
          ],
          'ar.textList': [
            {
              text: 'يمتد دور BKGH إلى ما هو أبعد من الإدارة والإشراف؛ فهو يشارك بنشاط في مبادرات إدارة المواهب في المجموعة، ويعزز التعاون بين أعضاء الفريق ويضمن أن جميع الشركات تستفيد من نقاط قوتها الجماعية. هذا النهج التعاوني يسمح للمجموعة بتحقيق الأهداف قصيرة وطويلة الأجل، وتعظيم الإمكانات التجارية، والتكيف مع تغيرات السوق، والاستفادة من الفرص الجديدة، مما يعزز النمو المستدام للمجموعة بأكملها.'
            }
          ],
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn('No collaboration section found');
    } else {
      console.log('Updated collaboration section missing fields');
    }
  } catch (error) {
    console.error('Error updating collaboration section:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

updateCollaborationSection();
