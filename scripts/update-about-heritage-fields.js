const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'albahargroup';

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function updateHeritageSection() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('aboutPageSections');

    const result = await collection.updateOne(
      { sectionId: 'heritage' },
      {
        $set: {
          'en.image': {
            src: '/img/image-text/img1.png',
            width: 600,
            height: 800,
            alt: 'Mr. Mohamed Al-Bahar - Founder',
            loading: 'lazy',
          },
          'ar.image': {
            src: '/img/image-text/img1.png',
            width: 600,
            height: 800,
            alt: 'السيد محمد البahar - المؤسس',
            loading: 'lazy',
          },
          'en.block': {
            heading: 'Mr. Mohamed Al-Bahar',
            text: "Beyond his role in laying the foundations and steering our group to what it has become today, Mr. Mohamed Al-Bahar was instrumental in establishing a number of Kuwait's key public institutions, including the Kuwait Chamber of Commerce, the Educational Council, and the Health Council. He played a pivotal role in guiding Kuwait's transformation into a modern, self-reliant society and economy. A dedicated philanthropist, Mr. Al-Bahar consistently championed the importance of giving back to the community. His significant contributions were recognized internationally, earning him the Order of the British Empire (OBE) from Queen Elizabeth in 2003."
          },
          'ar.block': {
            heading: 'السيد محمد البahar',
            text: 'بالإضافة إلى دوره في وضع الأسس وتوجيه مجموعتنا إلى ما أصبحت عليه اليوم، كان السيد محمد البahar فعالاً في إنشاء عدد من المؤسسات العامة الرئيسية في الكويت، بما في ذلك غرفة تجارة الكويت، والمجلس التعليمي، ومجلس الصحة. لعب دوراً محورياً في توجيه تحول الكويت إلى مجتمع واقتصاد حديثين قائمين على الاكتفاء الذاتي. كخيري مخلص، دافع السيد البahar باستمرار عن أهمية رد الجميل للمجتمع. تم الاعتراف بمساهماته الكبيرة دولياً، حيث حصل على وسام الإمبراطورية البريطانية (OBE) من الملكة إليزابيث في عام 2003.'
          },
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn('No heritage section found');
    } else {
      console.log('Updated heritage section missing fields');
    }
  } catch (error) {
    console.error('Error updating heritage section:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

updateHeritageSection();
