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

async function seedHomeCMS() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('homePageSections');

    const sections = [
      {
        sectionId: 'hero',
        enabled: true,
        order: 1,
        en: {
          slides: [
            {
              subheading: "Diversified Business Group – Since 1937",
              heading: "Partnering to Shape Kuwait's Future",
              text: "For more than eight decades, Al-Bahar Group has connected global brands with local insight. Across five business verticals and 70+ international partners, we bring trusted solutions to homes, businesses, and institutions throughout Kuwait.",
              button: {
                label: "Discover Our Story",
                href: "/about-us",
                type: "primary"
              },
              image: "/img/slider/hero1.png",
              imageTablet: "/img/slider/hero1.png",
              imageMobile: "/img/slider/hero1.png"
            },
            {
              subheading: "Global Brands. Local Insight.",
              heading: "Building Stronger Brands in Kuwait",
              text: "For over 80 years, Al Bahar Group has helped international brands grow in Kuwait by combining deep market understanding with disciplined execution. From FMCG to technology and shipping, we create win–win partnerships that stand the test of time.",
              button: {
                label: "View Our Business Verticals",
                href: "#",
                type: "primary"
              },
              image: "/img/slider/hero2.png",
              imageTablet: "/img/slider/hero2.png",
              imageMobile: "/img/slider/hero2.png"
            },
            {
              subheading: "Excellence in Every Detail",
              heading: "Reliability Across Every Business",
              text: "From supply chain and logistics to omni-channel execution and customer service, Al Bahar Group is built on disciplined operations. Our business enablers ensure products arrive on time, shelves stay full, and partners experience consistent, measurable performance across Kuwait.",
              button: {
                label: "View Our Business Enablers",
                href: "/contact-us",
                type: "primary"
              },
              image: "/img/slider/hero3.png",
              imageTablet: "/img/slider/hero3.png",
              imageMobile: "/img/slider/hero3.png"
            }
          ]
        },
        ar: {
          slides: [
            {
              subheading: "مجموعة أعمال متنوعة – منذ عام 1937",
              heading: "شراكة لتشكيل مستقبل الكويت",
              text: "لأكثر من ثمانية عقود، ربطت مجموعة البahar العلامات التجارية العالمية بالرؤية المحلية. عبر خمسة قطاعات أعمال وأكثر من 70 شريكًا دوليًا، نقدم حلولًا موثوقة للمنازل والشركات والمؤسسات في جميع أنحاء الكويت.",
              button: {
                label: "اكتشف قصتنا",
                href: "/ar/about-us",
                type: "primary"
              },
              image: "/img/slider/hero1.png",
              imageTablet: "/img/slider/hero1.png",
              imageMobile: "/img/slider/hero1.png"
            }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sectionId: 'imageText',
        enabled: true,
        order: 2,
        en: {
          subheading: "Our Heritage",
          heading: "Eight Decades of Excellence",
          text: "Since 1937, Al Bahar Group has been a cornerstone of Kuwait's business landscape, building trust through consistent delivery and strategic partnerships.",
          button: {
            label: "Learn More",
            href: "/about-us",
            type: "primary"
          },
          items: [
            {
              textheading1: "Our Mission",
              textdescr1: "Delivering excellence and success by directing our values, talents, resources and expertise to maximize customer satisfaction."
            },
            {
              textheading1: "Our Vision",
              textdescr1: "To Always be the Most Trusted and Best-in-Class Partner."
            }
          ]
        },
        ar: {
          subheading: "تراثنا",
          heading: "ثمانية عقود من التميز",
          text: "منذ عام 1937، كانت مجموعة البahar حجر الزاوية في المشهد التجاري الكويتي، وبناء الثقة من خلال التسليم المتسق والشراكات الاستراتيجية.",
          button: {
            label: "اعرف المزيد",
            href: "/ar/about-us",
            type: "primary"
          },
          items: [
            {
              textheading1: "مهمتنا",
              textdescr1: "تقديم التميز والنجاح من خلال توجيه قيمنا ومواهبنا ومواردنا وخبراتنا لتعظيم رضا العملاء."
            }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sectionId: 'services',
        enabled: true,
        order: 3,
        en: {
          subheading: "Business Enablers",
          heading: "Capabilities that Power Every Al Bahar Division",
          button: {
            label: "More Details",
            href: "#",
            type: "secondary"
          }
        },
        ar: {
          subheading: "ممكنات الأعمال",
          heading: "القدرات التي تدعم كل قسم من أقسام البahar",
          button: {
            label: "المزيد من التفاصيل",
            href: "#",
            type: "secondary"
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sectionId: 'projects',
        enabled: true,
        order: 4,
        en: {
          subheading: "Image Archive",
          heading: "Explore the Moments That Shaped Our Journey"
        },
        ar: {
          subheading: "أرشيف الصور",
          heading: "استكشف اللحظات التي شكلت رحلتنا"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sectionId: 'whyChooseUs',
        enabled: true,
        order: 5,
        en: {
          subheading: "Why Al Bahar Group",
          heading: "A Heritage of Trust, A Future of Possibilities",
          text: "As one of Kuwait's long-established business groups, we combine decades of experience with a constant focus on what comes next. Our success is built on strong values, disciplined execution and partnerships that stand the test of time.",
          button: {
            label: "More About Us",
            href: "/about-us",
            type: "primary"
          },
          image: {
            src: "/img/why-choose-us/1.jpg",
            srcMobile: "/img/why-choose-us/575.jpg",
            width: 1000,
            height: 742,
            loading: "lazy",
            alt: "Choose us image"
          },
          items: [
            {
              title: "Our Mission",
              text: "Delivering excellence and success by directing our values, talents, resources and expertise to maximize customer satisfaction and to achieve sustainable growth for all stakeholders."
            },
            {
              title: "Our Vision",
              text: "To Always be the Most Trusted and Best-in-Class Partner."
            },
            {
              title: "Our Values",
              text: "• We always deliver on our commitments\n• We consider our people to be our strength\n• We are one team\n• We listen, we care, we respect\n• We constantly work towards improvement"
            }
          ]
        },
        ar: {
          subheading: "لماذا مجموعة البahar",
          heading: "تراث من الثقة، مستقبل من الإمكانيات",
          text: "كواحدة من مجموعات الأعمال الراسخة في الكويت، نجمع بين عقود من الخبرة مع التركيز المستمر على ما هو قادم. يبنى نجاحنا على قيم قوية وتنفيذ منضبط وشراكات تصمد أمام اختبار الزمن.",
          button: {
            label: "المزيد عنا",
            href: "/ar/about-us",
            type: "primary"
          },
          items: [
            {
              title: "مهمتنا",
              text: "تقديم التميز والنجاح من خلال توجيه قيمنا ومواهبنا ومواردنا وخبراتنا لتعظيم رضا العملاء وتحقيق نمو مستدام لجميع أصحاب المصلحة."
            },
            {
              title: "رؤيتنا",
              text: "أن نكون دائمًا الشريك الأكثر ثقة والأفضل في فئته."
            },
            {
              title: "قيمنا",
              text: "• نحن دائماً نفي بالتزاماتنا\n• نعتبر موظفينا قوتنا\n• نحن فريق واحد\n• نستمع، نهتم، نحترم\n• نعمل باستمرار نحو التحسين"
            }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sectionId: 'pricing',
        enabled: true,
        order: 6,
        en: {
          subheading: "How We Create Value",
          heading: "Our Strategic Pillars",
          cards: [
            {
              title: "Partnership-Driven",
              description: "Long-term relationships with global leaders",
              features: [
                "Represent leading international brands in Kuwait",
                "Align global best practices with local market realities",
                "Build trust through transparent, consistent performance",
                "Co-create growth plans with our principals"
              ],
              link: "/about-us",
              active: false
            },
            {
              title: "Performance-Focused",
              description: "Disciplined execution across every vertical",
              features: [
                "Strong reach across channels and customer segments",
                "Continuous improvement in service and supply reliability",
                "Robust governance and risk management",
                "Data-driven decision making for sustainable growth"
              ],
              link: "/about-us",
              active: true
            },
            {
              title: "Community-Centric",
              description: "Investing in talent and the nation's progress",
              features: [
                "Structured learning and development programs",
                "Focus on attracting and developing local talent",
                "An inclusive, strongly values-driven culture",
                "Community and social responsibility initiatives"
              ],
              link: "/about-us",
              active: false
            }
          ]
        },
        ar: {
          subheading: "كيف نخلق القيمة",
          heading: "ركائزنا الاستراتيجية",
          cards: [
            {
              title: "مدفوع بالشراكة",
              description: "علاقات طويلة الأمد مع القادة العالميين",
              features: [
                "تمثيل العلامات التجارية الدولية الرائدة في الكويت",
                "محاذاة أفضل الممارسات العالمية مع واقع السوق المحلي",
                "بناء الثقة من خلال الأداء الشفاف والمتسق",
                "إنشاء خطط النمو مع شركائنا"
              ],
              link: "/ar/about-us",
              active: false
            },
            {
              title: "مركز على الأداء",
              description: "تنفيذ منضبط عبر كل قطاع",
              features: [
                "وصول قوي عبر القنوات وشرائح العملاء",
                "تحسين مستمر في الخدمة وموثوقية التوريد",
                "حوكمة قوية وإدارة المخاطر",
                "اتخاذ قرارات مدفوعة بالبيانات للنمو المستدام"
              ],
              link: "/ar/about-us",
              active: true
            },
            {
              title: "مركز على المجتمع",
              description: "الاستثمار في المواهب وتقدم الأمة",
              features: [
                "برامج التعلم والتطوير المنظمة",
                "التركيز على جذب وتطوير المواهب المحلية",
                "ثقافة شاملة مدفوعة بقيم قوية",
                "مبادرات المسؤولية المجتمعية والاجتماعية"
              ],
              link: "/ar/about-us",
              active: false
            }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sectionId: 'testimonials',
        enabled: true,
        order: 7,
        en: {
          items: [
            {
              id: 1,
              image: "/img/project/techno.jpg",
              subheading: "Technology Solutions",
              heading: "Technology Solutions",
              description: "Al Bahar's Technology division delivers integrated office, print, imaging and IT solutions that help organisations work smarter and more securely. From hardware and software to after-sales support, we provide end-to-end services backed by global technology partners.",
              button: {
                label: "View Detail",
                href: "/testimonials"
              },
              icon: "Consultingnew"
            },
            {
              id: 2,
              image: "/img/project/consumer.jpg",
              subheading: "Consumer & FMCG",
              heading: "Consumer & FMCG",
              description: "Our Consumer division represents trusted international food and household brands across Kuwait. We combine strong channel coverage, disciplined in-store execution and data-driven planning to ensure our brands are always visible, available and in demand.",
              button: {
                label: "View Detail",
                href: "/testimonials"
              },
              icon: "ConsumerFmcg"
            },
            {
              id: 3,
              image: "/img/project/1.webp",
              subheading: "Shipping & Logistics",
              heading: "Shipping & Logistics",
              description: "The Shipping & Logistics division connects Kuwait to major global ports and trade lanes. Acting as a reliable partner for shipping lines and cargo owners, we provide agency services, documentation, and logistics support that keep goods moving efficiently and on time.",
              button: {
                label: "View Detail",
                href: "/testimonials"
              },
              icon: "CargoShip"
            },
            {
              id: 4,
              image: "/img/project/travel.webp",
              subheading: "Travel & Tourism",
              heading: "Travel & Tourism",
              description: "Our Travel division serves both corporate and leisure customers with tailored travel solutions. From ticketing and itineraries to group and incentive travel, we combine global networks with attentive local service to deliver smooth, stress-free journeys.",
              button: {
                label: "View Detail",
                href: "/testimonials"
              },
              icon: "Airplane"
            },
            {
              id: 5,
              image: "/img/project/retail.webp",
              subheading: "Retail & Lifestyle",
              heading: "Retail & Lifestyle",
              description: "The Retail & Lifestyle division develops and operates modern retail concepts that bring global trends closer to Kuwait's consumers. With a focus on quality, convenience and experience, we curate brands and formats that fit the evolving lifestyles of our customers.",
              button: {
                label: "View Detail",
                href: "/testimonials"
              },
              icon: "Storefront"
            }
          ]
        },
        ar: {
          items: [
            {
              id: 1,
              image: "/img/project/techno.jpg",
              subheading: "حلول التكنولوجيا",
              heading: "حلول التكنولوجيا",
              description: "يوفر قسم التكنولوجيا في البahar حلولًا متكاملة للمكاتب والطباعة والتصوير وتكنولوجيا المعلومات التي تساعد المؤسسات على العمل بشكل أذكى وأكثر أمانًا. من الأجهزة والبرمجيات إلى دعم ما بعد البيع، نقدم خدمات شاملة مدعومة بشركاء تكنولوجيا عالميين.",
              button: {
                label: "عرض التفاصيل",
                href: "/ar/testimonials"
              },
              icon: "Consultingnew"
            },
            {
              id: 2,
              image: "/img/project/consumer.jpg",
              subheading: "الاستهلاكية والسلع سريعة الاستهلاك",
              heading: "الاستهلاكية والسلع سريعة الاستهلاك",
              description: "يمثل قسم الاستهلاك لدينا علامات تجارية دولية موثوقة للأغذية والأدوات المنزلية في جميع أنحاء الكويت. نجمع بين تغطية قوية للقنوات وتنفيذ منضبط في المتاجر وتخطيط مدفوع بالبيانات لضمان أن علاماتنا التجارية مرئية ومتاحة ومطلوبة دائمًا.",
              button: {
                label: "عرض التفاصيل",
                href: "/ar/testimonials"
              },
              icon: "ConsumerFmcg"
            },
            {
              id: 3,
              image: "/img/project/1.webp",
              subheading: "الشحن والخدمات اللوجستية",
              heading: "الشحن والخدمات اللوجستية",
              description: "يربط قسم الشحن والخدمات اللوجستية الكويت بالموانئ الرئيسية وطرق التجارة العالمية. كشريك موثوق لخطوط الشحن وأصحاب البضائع، نقدم خدمات الوكالة والتوثيق والدعم اللوجستي الذي يحافظ على حركة البضائع بكفاءة وفي الوقت المحدد.",
              button: {
                label: "عرض التفاصيل",
                href: "/ar/testimonials"
              },
              icon: "CargoShip"
            },
            {
              id: 4,
              image: "/img/project/travel.webp",
              subheading: "السفر والسياحة",
              heading: "السفر والسياحة",
              description: "يخدم قسم السفر لدينا كل من العملاء المؤسسيين والترفيهيين بحلول سفر مخصصة. من التذاكر والجداول الزمنية إلى السفر الجماعي والحوافز، نجمع بين الشبكات العالمية والخدمة المحلية المتنبهة لتقديم رحلات سلسة وخالية من الإجهاد.",
              button: {
                label: "عرض التفاصيل",
                href: "/ar/testimonials"
              },
              icon: "Airplane"
            },
            {
              id: 5,
              image: "/img/project/retail.webp",
              subheading: "التجزئة ونمط الحياة",
              heading: "التجزئة ونمط الحياة",
              description: "يطور قسم التجزئة ونمط الحياة ويشغل مفاهيم البيع بالتجزئة الحديثة التي تقرب الاتجاهات العالمية من مستهلكي الكويت. مع التركيز على الجودة والراحة والتجربة، نقوم بتجميع العلامات التجارية والتنسيقات التي تناسب أنماط الحياة المتطورة لعملائنا.",
              button: {
                label: "عرض التفاصيل",
                href: "/ar/testimonials"
              },
              icon: "Storefront"
            }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sectionId: 'faq',
        enabled: true,
        order: 8,
        en: {
          subheading: "Questions & Support",
          heading: "We've Collected the Most Important Answers for You",
          text: "Whether you are a global brand exploring Kuwait, a local business seeking solutions, or a professional considering your next career step, we are here to help.",
          button: {
            label: "Contact Us for More Details",
            href: "/contact-us",
            type: "primary"
          },
          items: [
            {
              title: "What types of brands does Al Bahar Group represent?",
              text: "We work with internationally recognised leaders in consumer goods, technology, shipping, travel and retail. Our partners trust us to represent their brands with the same care and standards they expect in their home markets."
            },
            {
              title: "How can a new principal explore partnership opportunities?",
              text: "You can contact our group office through the website or our main telephone number. Our leadership team will review your proposal, assess market fit and connect you with the relevant business vertical."
            },
            {
              title: "In which channels do you operate?",
              text: "Our businesses serve a wide range of channels – from large modern trade and hypermarkets to traditional retail, corporate accounts, government entities, and specialised sectors such as education and logistics."
            },
            {
              title: "How can I apply for a role at Al Bahar Group?",
              text: "Visit our Careers section to view current opportunities and submit your application online. We regularly participate in career fairs and campus events to meet new talent."
            },
            {
              title: "Do you support long-term development of your employees?",
              text: "Yes. Training, coaching and structured learning programs are integral to our HR strategy. We believe investing in our people is essential to sustaining high performance and delivering value to our partners."
            },
            {
              title: "What Services Does Your IT Solutions Business Offer?",
              text: "Our IT Solutions division provides comprehensive technology services including hardware and software solutions, office automation, print and imaging systems, and after-sales support. We partner with leading global technology brands to deliver end-to-end IT solutions for businesses across Kuwait."
            },
            {
              title: "What types of financial challenges?",
              text: "We understand that businesses face various financial challenges. Our diverse portfolio and strong partnerships help us navigate market fluctuations while maintaining consistent service delivery. We work closely with our principals to develop flexible solutions that address financial considerations."
            },
            {
              title: "What are the payment methods?",
              text: "Payment methods vary by business division and partnership agreements. For specific payment terms and methods, please contact the relevant division directly through our website or main office. We offer flexible payment solutions tailored to our partners' needs."
            },
            {
              title: "How fast I get my order?",
              text: "Delivery times depend on the product or service, with most orders processed within standard industry timelines. Our logistics and supply chain capabilities ensure efficient order fulfillment. For specific delivery timelines, please contact the relevant division or check with your account manager."
            }
          ]
        },
        ar: {
          subheading: "الأسئلة والدعم",
          heading: "لقد جمعنا أهم الإجابات لك",
          text: "سواء كنت علامة تجارية عالمية تستكشف الكويت، أو شركة محلية تبحث عن حلول، أو محترف يفكر في خطوتك المهنية التالية، نحن هنا للمساعدة.",
          button: {
            label: "اتصل بنا للمزيد من التفاصيل",
            href: "/ar/contact-us",
            type: "primary"
          },
          items: [
            {
              title: "ما أنواع العلامات التجارية التي تمثلها مجموعة البahar؟",
              text: "نعمل مع قادة معترف بهم دوليًا في السلع الاستهلاكية والتكنولوجيا والشحن والسفر والتجزئة. يثق شركاؤنا بنا لتمثيل علاماتهم التجارية بنفس العناية والمعايير التي يتوقعونها في أسواقهم المحلية."
            },
            {
              title: "كيف يمكن لرئيس جديد استكشاف فرص الشراكة؟",
              text: "يمكنك الاتصال بمكتب المجموعة من خلال الموقع الإلكتروني أو رقم الهاتف الرئيسي. سيقوم فريق القيادة لدينا بمراجعة اقتراحك وتقييم ملاءمة السوق وربطك بالقطاع التجاري ذي الصلة."
            },
            {
              title: "في أي قنوات تعملون؟",
              text: "تعمل أعمالنا في مجموعة واسعة من القنوات - من التجارة الحديثة الكبيرة ومراكز التسوق الكبرى إلى التجزئة التقليدية والحسابات المؤسسية والكيانات الحكومية والقطاعات المتخصصة مثل التعليم والخدمات اللوجستية."
            },
            {
              title: "كيف يمكنني التقدم لوظيفة في مجموعة البahar؟",
              text: "قم بزيارة قسم الوظائف لدينا لعرض الفرص الحالية وتقديم طلبك عبر الإنترنت. نشارك بانتظام في معارض الوظائف وفعاليات الحرم الجامعي للقاء المواهب الجديدة."
            },
            {
              title: "هل تدعمون التطوير طويل الأمد لموظفيكم؟",
              text: "نعم. التدريب والتوجيه وبرامج التعلم المنظمة جزء لا يتجزأ من استراتيجية الموارد البشرية لدينا. نؤمن بأن الاستثمار في موظفينا ضروري للحفاظ على الأداء العالي وتقديم القيمة لشركائنا."
            },
            {
              title: "ما الخدمات التي يقدمها قسم حلول تكنولوجيا المعلومات لديكم؟",
              text: "يوفر قسم حلول تكنولوجيا المعلومات لدينا خدمات تكنولوجية شاملة تشمل حلول الأجهزة والبرمجيات وأتمتة المكاتب وأنظمة الطباعة والتصوير ودعم ما بعد البيع. نتعاون مع العلامات التجارية التكنولوجية العالمية الرائدة لتقديم حلول تكنولوجيا المعلومات الشاملة للشركات في جميع أنحاء الكويت."
            },
            {
              title: "ما أنواع التحديات المالية؟",
              text: "نفهم أن الشركات تواجه تحديات مالية متنوعة. محفظتنا المتنوعة وشراكاتنا القوية تساعدنا على التنقل في تقلبات السوق مع الحفاظ على تقديم الخدمات بشكل متسق. نعمل بشكل وثيق مع شركائنا لتطوير حلول مرنة تعالج الاعتبارات المالية."
            },
            {
              title: "ما هي طرق الدفع؟",
              text: "تختلف طرق الدفع حسب قسم الأعمال واتفاقيات الشراكة. للحصول على شروط وطرق الدفع المحددة، يرجى الاتصال بالقسم ذي الصلة مباشرة من خلال موقعنا الإلكتروني أو المكتب الرئيسي. نقدم حلول دفع مرنة مصممة خصيصًا لاحتياجات شركائنا."
            },
            {
              title: "ما مدى سرعة حصولي على طلبي؟",
              text: "تعتمد أوقات التسليم على المنتج أو الخدمة، حيث تتم معالجة معظم الطلبات في إطار الجداول الزمنية القياسية للصناعة. تضمن قدراتنا اللوجستية وسلسلة التوريد تنفيذ الطلبات بكفاءة. للحصول على الجداول الزمنية المحددة للتسليم، يرجى الاتصال بالقسم ذي الصلة أو التحقق مع مدير حسابك."
            }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sectionId: 'blog',
        enabled: true,
        order: 9,
        en: {
          subheading: "Our News",
          heading: "Latest Stories from Our Group",
          button: {
            label: "Discover More News",
            href: "/news",
            type: "primary"
          }
        },
        ar: {
          subheading: "أخبارنا",
          heading: "أحدث القصص من مجموعتنا",
          button: {
            label: "اكتشف المزيد من الأخبار",
            href: "/ar/news",
            type: "primary"
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log(`Seeding ${sections.length} home page sections...`);

    for (const section of sections) {
      const { createdAt, ...sectionData } = section;
      const result = await collection.findOneAndUpdate(
        { sectionId: section.sectionId },
        {
          $set: sectionData,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`✓ Seeded section: ${section.sectionId}`);
    }

    console.log(`\nSuccessfully seeded ${sections.length} home page sections!`);

  } catch (error) {
    console.error('Error seeding home CMS:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Seeding completed');
  }
}

seedHomeCMS();
