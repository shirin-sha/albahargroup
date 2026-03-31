import Icons from "../components/Icons";
import { MenuItem } from "@/types/menu";

const Menus: MenuItem[] = [
    {
        title: 'HOME',
        titleAr: 'الرئيسية',
        path: '/',
    },
    {
        title: 'ABOUT US',
        titleAr: 'من نحن',
        path: '/about-us'
    },
    {
        title: 'BUSINESSES',
        titleAr: 'الأعمال',
        path: '/businesses',
        megamenutwocolumn: [
            {
                title: 'OUR BUSINESS VERTICALS',
                titleAr: 'قطاعات أعمالنا',
                path: '#',
                dropdown: [
                    {
                        title: 'Consumer Goods',
                        titleAr: 'السلع الاستهلاكية',
                        text: 'Leading FMCG brands across Kuwait’s key channels.',
                        textAr: 'علامات تجارية استهلاكية رائدة عبر قنوات الكويت الرئيسية.',
                path: '/services/consumer-fmcg',
                    },
                    {
                        title: 'Consumer Electronics',
                        titleAr: 'الإلكترونيات الاستهلاكية',
                        text: 'Home and personal electronics from global innovators.',
                        textAr: 'إلكترونيات منزلية وشخصية من أبرز المبتكرين العالميين.',
                path: '/services/retail-lifestyle',
                    },
                    {
                        title: 'Home Automation',
                        titleAr: 'الأتمتة المنزلية',
                        text: 'Smart home solutions for comfort & security.',
                        textAr: 'حلول منزلية ذكية للراحة والأمان.',
                path: '/services/retail-lifestyle',
                    },
                    {
                        title: 'Enterprise Technology',
                        titleAr: 'تقنيات المؤسسات',
                        text: 'End-to-end IT, print and AV solutions.',
                        textAr: 'حلول متكاملة لتقنية المعلومات والطباعة والوسائط السمعية البصرية.',
                path: '#',
                    },
                    {
                        title: 'Shipping, Travel & Tourism',
                        titleAr: 'الشحن, السفر والسياحة',
                        text: 'Integrated shipping, travel and tourism solutions',
                        textAr: 'خدمات شحن من الميناء إلى الباب، وخدمات الوكالات واللوجستيات، وخدمات السفر والسياحة.',
                path: '/services/shipping-logistics',
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
                title: 'Contact Sales',
                titleAr: 'تواصل مع المبيعات',
                path: '/contact-us',
                icon: <Icons.Contact />,
            },
            {
                title: 'Download Profile',
                titleAr: 'تحميل الملف التعريفي',
                path: '#',
                icon: <Icons.Download />,
            },
            {
                title: 'Our Partners',
                titleAr: 'شركاؤنا',
                path: '/ourpartnerships',
                icon: <Icons.Handshake />,
            },
        ],
    },
 
    {
        title: 'CAPABILITIES',
        titleAr: 'القدرات',
        path: '#',
        dropdown: [
            {
                title: 'HUMAN CAPITAL',
                titleAr: 'رأس المال البشري',
                path: '/services/human-capital',
            },
            {
                title: 'KNOWLEDGE CAPITAL',
                titleAr: 'رأس المال المعرفي',
                path: '/services/knowledge-capital',
            },
            {
                title: 'BUSINESS EXCELLENCE',
                titleAr: 'التميز المؤسسي',
                path: '/services/business-excellence',
            },
            {
                title: 'WAREHOUSE & LOGISTICS',
                titleAr: 'المستودعات والخدمات اللوجستية',
                path: '/services/warehouse-and-logistics',
            },
            {
                title: 'CUSTOMER CARE',
                titleAr: 'خدمة العملاء',
                path: '/services/customer-care',
            }
        ]
    },
    {
        title: 'CORPORATE INFO',
        titleAr: 'المعلومات المؤسسية',
        path: '#',
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
        path: '/contact-us'
    }
]

export default Menus;