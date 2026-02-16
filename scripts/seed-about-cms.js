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
    sectionId: 'testimonials',
    enabled: true,
    order: 1,
    en: {
      subheading: 'About Al-Bahar Group',
      heading: 'Al-Bahar Group was founded in 1937 by Mr. Mohamed Abdulrahman Al-Bahar as a General Trading Company.'
    },
    ar: {
      subheading: 'حول مجموعة البahar',
      heading: 'تأسست مجموعة البahar في عام 1937 من قبل السيد محمد عبدالرحمن البahar كشركة تجارية عامة.'
    }
  },
  {
    sectionId: 'stickyBanner',
    enabled: true,
    order: 2,
    en: {
      heading: 'What Guides Us and Drives Our Future',
      text: 'Guided by a clear vision, driven by a shared mission and anchored in strong values, we partner with stakeholders to create sustainable, long-term success.',
      blockList: [
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
      ]
    },
    ar: {
      heading: 'ما يوجهنا ويقود مستقبلنا',
      text: 'موجهون برؤية واضحة، مدفوعون بمهمة مشتركة ومرتكزون على قيم قوية، نتعاون مع أصحاب المصلحة لخلق نجاح مستدام طويل الأمد.',
      blockList: [
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
      ]
    }
  },
  {
    sectionId: 'heritage',
    enabled: true,
    order: 3,
    en: {
      subheading: 'OUR Heritage',
      heading: 'A Legacy of Enduring Alliances',
      text: 'Our long history stands testament to our deep expertise in building successful partnerships with leading global brands. The story of our group\'s development has paralleled the growth of our business alliances and the evolving needs of the brands we collaborate with. Today, we have become a diversified group of companies, catering to a broad spectrum of industries and sectors.',
      block: {
        heading: 'Mr. Mohamed Al-Bahar',
        text: 'Beyond his role in laying the foundations and steering our group to what it has become today, Mr. Mohamed Al-Bahar was instrumental in establishing a number of Kuwait\'s key public institutions, including the Kuwait Chamber of Commerce, the Educational Council, and the Health Council. He played a pivotal role in guiding Kuwait\'s transformation into a modern, self-reliant society and economy. A dedicated philanthropist, Mr. Al-Bahar consistently championed the importance of giving back to the community. His significant contributions were recognized internationally, earning him the Order of the British Empire (OBE) from Queen Elizabeth in 2003.'
      },
      image: {
        src: '/img/image-text/img1.png',
        width: 600,
        height: 800,
        alt: 'Mr. Mohamed Al-Bahar - Founder',
        loading: 'lazy'
      }
    },
    ar: {
      subheading: 'تراثنا',
      heading: 'إرث من التحالفات الدائمة',
      text: 'تاريخنا الطويل يشهد على خبرتنا العميقة في بناء شراكات ناجحة مع العلامات التجارية العالمية الرائدة. قصة تطور مجموعتنا كانت متوازية مع نمو تحالفاتنا التجارية والاحتياجات المتطورة للعلامات التجارية التي نتعاون معها. اليوم، أصبحنا مجموعة متنوعة من الشركات، تخدم طيفاً واسعاً من الصناعات والقطاعات.',
      block: {
        heading: 'السيد محمد البahar',
        text: 'بالإضافة إلى دوره في وضع الأسس وتوجيه مجموعتنا إلى ما أصبحت عليه اليوم، كان السيد محمد البahar فعالاً في إنشاء عدد من المؤسسات العامة الرئيسية في الكويت، بما في ذلك غرفة تجارة الكويت، والمجلس التعليمي، ومجلس الصحة. لعب دوراً محورياً في توجيه تحول الكويت إلى مجتمع واقتصاد حديثين قائمين على الاكتفاء الذاتي. كخيري مخلص، دافع السيد البahar باستمرار عن أهمية رد الجميل للمجتمع. تم الاعتراف بمساهماته الكبيرة دولياً، حيث حصل على وسام الإمبراطورية البريطانية (OBE) من الملكة إليزابيث في عام 2003.'
      },
      image: {
        src: '/img/image-text/img1.png',
        width: 600,
        height: 800,
        alt: 'السيد محمد البahar - المؤسس',
        loading: 'lazy'
      }
    }
  },
  {
    sectionId: 'collaboration',
    enabled: true,
    order: 4,
    en: {
      subheading: 'Empowering Kuwait through',
      heading: 'Collaboration and Innovation',
      text: 'The Bahar Kuwait Group Holding Company (BKGH) serves as the principal shareholder of its subsidiaries, providing strategic leadership, resource allocation, risk management, corporate governance, and functional support to all Al-Bahar companies. This integrated management approach not only optimizes operations but also underscores the group\'s commitment to maintaining the highest standards of excellence across all business areas, playing a critical role in driving the long-term success and profitability of the Al-Bahar Group.',
      block: {
        heading: 'Strategic Support & Guidance',
        text: 'BKGH recommends necessary resources, provides expertise, and offers strategic guidance to individual Al-Bahar companies, enabling them to focus on their core business activities and daily operations. It ensures that all companies within the group adhere to a unified vision, benefiting from shared services and standardized best practices.',
        subheading: 'Talent Management & Collaboration'
      },
      textList: [
        {
          text: 'BKGH\'s role extends beyond administration and supervision; it actively participates in the Group\'s talent management initiatives, fostering collaboration among team members and ensuring that all companies leverage their collective strengths. This collaborative approach allows the Group to achieve both short- and long-term objectives, maximize business potential, adapt to market changes, and seize new opportunities, thereby reinforcing the sustainable growth of the entire Group.'
        }
      ]
    },
    ar: {
      subheading: 'تمكين الكويت من خلال',
      heading: 'التعاون والابتكار',
      text: 'شركة بهار الكويت القابضة (BKGH) تعمل كالمساهم الرئيسي في شركاتها التابعة، وتوفر القيادة الاستراتيجية وتخصيص الموارد وإدارة المخاطر والحوكمة المؤسسية والدعم الوظيفي لجميع شركات البahar. هذا النهج الإداري المتكامل لا يحسن العمليات فحسب، بل يؤكد أيضاً التزام المجموعة بالحفاظ على أعلى معايير التميز في جميع مجالات الأعمال، مما يلعب دوراً حاسماً في دفع النجاح والربحية طويلة الأجل لمجموعة البahar.',
      block: {
        heading: 'الدعم الاستراتيجي والتوجيه',
        text: 'توفر BKGH الموارد اللازمة وتقدم الخبرة وتقدم التوجيه الاستراتيجي للشركات الفردية في البahar، مما يمكنها من التركيز على أنشطتها التجارية الأساسية والعمليات اليومية. تضمن أن جميع الشركات داخل المجموعة تلتزم برؤية موحدة، وتستفيد من الخدمات المشتركة وأفضل الممارسات الموحدة.',
        subheading: 'إدارة المواهب والتعاون'
      },
      textList: [
        {
          text: 'يمتد دور BKGH إلى ما هو أبعد من الإدارة والإشراف؛ فهو يشارك بنشاط في مبادرات إدارة المواهب في المجموعة، ويعزز التعاون بين أعضاء الفريق ويضمن أن جميع الشركات تستفيد من نقاط قوتها الجماعية. هذا النهج التعاوني يسمح للمجموعة بتحقيق الأهداف قصيرة وطويلة الأجل، وتعظيم الإمكانات التجارية، والتكيف مع تغيرات السوق، والاستفادة من الفرص الجديدة، مما يعزز النمو المستدام للمجموعة بأكملها.'
        }
      ]
    }
  },
  {
    sectionId: 'timeline',
    enabled: true,
    order: 5,
    en: {
      subheading: 'Our Journey',
      heading: 'A Legacy of Growth & Partnerships',
      timelineItems: [
        {
          year: '1937',
          title: 'Mohamed Abdulrahman Al-Bahar sets up own company.',
          position: 'below',
          logos: [
            { src: '/img/brand/abdulrahman.png', alt: 'Mohamed Abdulrahman Al-Bahar', width: 100, height: 60 }
          ]
        },
        {
          year: '1946',
          title: 'Signs partnership agreement with Unilever.',
          position: 'above',
          logos: [
            { src: '/img/brand/b3.png', alt: 'Unilever', width: 100, height: 60 }
          ]
        },
        {
          year: '1951',
          title: 'Incorporates Bahar Shipping Company.',
          position: 'below',
          logos: [
            { src: '/img/brand/albaharshiping.png', alt: 'Bahar Shipping Company', width: 100, height: 60 }
          ]
        },
        {
          year: '1954',
          title: 'Partners with Coca Cola Co.',
          position: 'above',
          logos: [
            { src: '/img/brand/b1.png', alt: 'Coca Cola', width: 100, height: 60 }
          ]
        },
        {
          year: '1959',
          title: 'Signs on Caterpillar.',
          position: 'below',
          logos: [
            { src: '/img/brand/b2.png', alt: 'Caterpillar', width: 100, height: 60 }
          ]
        },
        {
          year: '1961',
          title: 'Setup Bahar & Partners.',
          position: 'above',
          logos: [
            { src: '/img/brand/partners.png', alt: 'Bahar & Partners', width: 100, height: 60 }
          ]
        },
        {
          year: '1963',
          title: 'Incorporates BEEA and signs up with GE Appliances.',
          position: 'below',
          logos: [
            { src: '/img/brand/ge.png', alt: 'GE Appliances', width: 100, height: 60 },
            { src: '/img/brand/albaharelectro.png', alt: 'BEEA', width: 100, height: 60 }
          ]
        },
        {
          year: '1968',
          title: 'Partnership with PIL.',
          position: 'above',
          logos: [
            { src: '/img/brand/pil.png', alt: 'PIL', width: 100, height: 60 }
          ]
        },
        {
          year: '1980',
          title: 'Partnership with COSCO.',
          position: 'below',
          logos: [
            { src: '/img/brand/b4.png', alt: 'COSCO', width: 100, height: 60 }
          ]
        },
        {
          year: '1995',
          title: 'Partners with Al Alali.',
          position: 'above',
          logos: [
            { src: '/img/brand/alalai.png', alt: 'Al Alali', width: 100, height: 60 }
          ]
        },
        {
          year: '2004',
          title: 'Partners with Master Chef.',
          position: 'below',
          logos: [
            { src: '/img/brand/master.png', alt: 'Master Chef', width: 100, height: 60 }
          ]
        },
        {
          year: '2005',
          title: 'Partners with Ocean.',
          position: 'above',
          logos: [
            { src: '/img/brand/ocean.jpg', alt: 'Ocean', width: 100, height: 60 }
          ]
        },
        {
          year: '2007',
          title: 'Partners with Elite.',
          position: 'below',
          logos: [
            { src: '/img/brand/elite.png', alt: 'Elite', width: 100, height: 60 }
          ]
        },
        {
          year: '2010',
          title: 'Partners with Royxon.',
          position: 'above',
          logos: [
            { src: '/img/brand/royxon.png', alt: 'Royxon', width: 100, height: 60 }
          ]
        },
        {
          year: '2015',
          title: 'Partners with Speed Queen.',
          position: 'below',
          logos: [
            { src: '/img/brand/speed.png', alt: 'Speed Queen', width: 100, height: 60 }
          ]
        },
        {
          year: '2020',
          title: 'New Partnerships Canon, Goody & Baytouti.',
          position: 'above',
          logos: [
            { src: '/img/brand/canon.png', alt: 'Canon', width: 80, height: 50 },
            { src: '/img/brand/goody.png', alt: 'Goody', width: 80, height: 50 },
            { src: '/img/brand/baytu.png', alt: 'Baytouti', width: 80, height: 50 }
          ]
        },
        {
          year: '2021',
          title: 'New Partnership with Logitech, 3M, Lofratelli & Honeywell.',
          position: 'below',
          logos: [
            { src: '/img/brand/logitech.png', alt: 'Logitech', width: 80, height: 50 },
            { src: '/img/brand/3m.png', alt: '3M', width: 80, height: 50 },
            { src: '/img/brand/lafra.png', alt: 'Lofratelli', width: 80, height: 50 },
            { src: '/img/brand/honeywell.png', alt: 'Honeywell', width: 80, height: 50 }
          ]
        },
        {
          year: '2022',
          title: 'New Partnerships Hama, Lipton, Lago, & Germanica.',
          position: 'above',
          logos: [
            { src: '/img/brand/hama.png', alt: 'Hama', width: 80, height: 50 },
            { src: '/img/brand/lipton.png', alt: 'Lipton', width: 80, height: 50 },
            { src: '/img/brand/lago.png', alt: 'Lago', width: 80, height: 50 },
            { src: '/img/brand/germanica.png', alt: 'Germanica', width: 80, height: 50 }
          ]
        },
        {
          year: '2023',
          title: 'New Partnerships Tilda, Karcher & Marshall.',
          position: 'below',
          logos: [
            { src: '/img/brand/tilda.png', alt: 'Tilda', width: 80, height: 50 },
            { src: '/img/brand/karcher.png', alt: 'Karcher', width: 80, height: 50 },
            { src: '/img/brand/marshall.png', alt: 'Marshall', width: 80, height: 50 }
          ]
        },
        {
          year: '2024',
          title: 'Continuing our legacy of excellence.',
          position: 'above'
        }
      ]
    },
    ar: {
      subheading: 'رحلتنا',
      heading: 'إرث من النمو والشراكات',
      timelineItems: [
        {
          year: '1937',
          title: 'تأسيس السيد محمد عبدالرحمن البahar لشركته الخاصة.',
          position: 'below',
          logos: [
            { src: '/img/brand/abdulrahman.png', alt: 'محمد عبدالرحمن البahar', width: 100, height: 60 }
          ]
        },
        {
          year: '1946',
          title: 'توقيع اتفاقية شراكة مع يونيليفر.',
          position: 'above',
          logos: [
            { src: '/img/brand/b3.png', alt: 'يونيليفر', width: 100, height: 60 }
          ]
        },
        {
          year: '1951',
          title: 'تأسيس شركة بهار للشحن.',
          position: 'below',
          logos: [
            { src: '/img/brand/albaharshiping.png', alt: 'شركة بهار للشحن', width: 100, height: 60 }
          ]
        },
        {
          year: '1954',
          title: 'شراكة مع شركة كوكا كولا.',
          position: 'above',
          logos: [
            { src: '/img/brand/b1.png', alt: 'كوكا كولا', width: 100, height: 60 }
          ]
        },
        {
          year: '1959',
          title: 'توقيع اتفاقية مع كاتربيلر.',
          position: 'below',
          logos: [
            { src: '/img/brand/b2.png', alt: 'كاتربيلر', width: 100, height: 60 }
          ]
        },
        {
          year: '1961',
          title: 'تأسيس بهار وشركاؤه.',
          position: 'above',
          logos: [
            { src: '/img/brand/partners.png', alt: 'بهار وشركاؤه', width: 100, height: 60 }
          ]
        },
        {
          year: '1963',
          title: 'تأسيس BEEA والشراكة مع GE Appliances.',
          position: 'below',
          logos: [
            { src: '/img/brand/ge.png', alt: 'GE Appliances', width: 100, height: 60 },
            { src: '/img/brand/albaharelectro.png', alt: 'BEEA', width: 100, height: 60 }
          ]
        },
        {
          year: '1968',
          title: 'شراكة مع PIL.',
          position: 'above',
          logos: [
            { src: '/img/brand/pil.png', alt: 'PIL', width: 100, height: 60 }
          ]
        },
        {
          year: '1980',
          title: 'شراكة مع COSCO.',
          position: 'below',
          logos: [
            { src: '/img/brand/b4.png', alt: 'COSCO', width: 100, height: 60 }
          ]
        },
        {
          year: '1995',
          title: 'شراكة مع العلي.',
          position: 'above',
          logos: [
            { src: '/img/brand/alalai.png', alt: 'العلي', width: 100, height: 60 }
          ]
        },
        {
          year: '2004',
          title: 'شراكة مع ماستر شيف.',
          position: 'below',
          logos: [
            { src: '/img/brand/master.png', alt: 'ماستر شيف', width: 100, height: 60 }
          ]
        },
        {
          year: '2005',
          title: 'شراكة مع أوشن.',
          position: 'above',
          logos: [
            { src: '/img/brand/ocean.jpg', alt: 'أوشن', width: 100, height: 60 }
          ]
        },
        {
          year: '2007',
          title: 'شراكة مع إيليت.',
          position: 'below',
          logos: [
            { src: '/img/brand/elite.png', alt: 'إيليت', width: 100, height: 60 }
          ]
        },
        {
          year: '2010',
          title: 'شراكة مع روكسون.',
          position: 'above',
          logos: [
            { src: '/img/brand/royxon.png', alt: 'روكسون', width: 100, height: 60 }
          ]
        },
        {
          year: '2015',
          title: 'شراكة مع سبيد كوين.',
          position: 'below',
          logos: [
            { src: '/img/brand/speed.png', alt: 'سبيد كوين', width: 100, height: 60 }
          ]
        },
        {
          year: '2020',
          title: 'شراكات جديدة مع كانون، جودي وبايتوتي.',
          position: 'above',
          logos: [
            { src: '/img/brand/canon.png', alt: 'كانون', width: 80, height: 50 },
            { src: '/img/brand/goody.png', alt: 'جودي', width: 80, height: 50 },
            { src: '/img/brand/baytu.png', alt: 'بايتوتي', width: 80, height: 50 }
          ]
        },
        {
          year: '2021',
          title: 'شراكة جديدة مع لوجيتك، 3M، لوفراتيلي وهونيويل.',
          position: 'below',
          logos: [
            { src: '/img/brand/logitech.png', alt: 'لوجيتك', width: 80, height: 50 },
            { src: '/img/brand/3m.png', alt: '3M', width: 80, height: 50 },
            { src: '/img/brand/lafra.png', alt: 'لوفراتيلي', width: 80, height: 50 },
            { src: '/img/brand/honeywell.png', alt: 'هونيويل', width: 80, height: 50 }
          ]
        },
        {
          year: '2022',
          title: 'شراكات جديدة مع هاما، ليبتون، لاغو وجرمانيكا.',
          position: 'above',
          logos: [
            { src: '/img/brand/hama.png', alt: 'هاما', width: 80, height: 50 },
            { src: '/img/brand/lipton.png', alt: 'ليبتون', width: 80, height: 50 },
            { src: '/img/brand/lago.png', alt: 'لاغو', width: 80, height: 50 },
            { src: '/img/brand/germanica.png', alt: 'جرمانيكا', width: 80, height: 50 }
          ]
        },
        {
          year: '2023',
          title: 'شراكات جديدة مع تيلدا، كارتشر ومارشال.',
          position: 'below',
          logos: [
            { src: '/img/brand/tilda.png', alt: 'تيلدا', width: 80, height: 50 },
            { src: '/img/brand/karcher.png', alt: 'كارتشر', width: 80, height: 50 },
            { src: '/img/brand/marshall.png', alt: 'مارشال', width: 80, height: 50 }
          ]
        },
        {
          year: '2024',
          title: 'مستمرون في إرث التميز.',
          position: 'above'
        }
      ]
    }
  },
  {
    sectionId: 'team',
    enabled: true,
    order: 6,
    en: {
      subheading: 'Our Team',
      heading: 'Meet the People Behind Our Success'
    },
    ar: {
      subheading: 'فريقنا',
      heading: 'تعرف على الأشخاص وراء نجاحنا'
    }
  },
  {
    sectionId: 'faq',
    enabled: true,
    order: 7,
    en: {
      subheading: 'FAQ',
      heading: 'Frequently Asked Questions'
    },
    ar: {
      subheading: 'الأسئلة الشائعة',
      heading: 'الأسئلة المتكررة'
    }
  }
];

async function seedAboutCMS() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('aboutPageSections');

    // Clear existing sections
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing sections');

    // Insert default sections
    const sectionsWithDates = defaultSections.map(section => ({
      ...section,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const result = await collection.insertMany(sectionsWithDates);

    console.log(`✅ Seeded ${result.insertedCount} about page sections`);
    console.log('📋 Sections:');
    defaultSections.forEach(section => {
      console.log(`   - ${section.sectionId} (EN: ${section.en.heading?.substring(0, 40)}...)`);
    });
  } catch (error) {
    console.error('❌ Error seeding about CMS:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
}

seedAboutCMS();
