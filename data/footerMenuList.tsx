interface MenuType {
  title: string;
  titleAr?: string;
  path: string;
}

export const QuickLink: MenuType[] = [
    {
        title: 'Consumer Goods',
        titleAr: 'السلع الاستهلاكية',
        path: '/services/consumer-goods'
    },
    {
        title: 'Consumer Electronics',
        titleAr: 'الإلكترونيات الاستهلاكية',
        path: '/services/consumer-electronics'
    },
    {
        title: 'Home Automation',
        titleAr: 'الأتمتة المنزلية',
        path: '/services/home-automation'
    },
    {
        title: 'Enterprise Technology',
        titleAr: 'تقنيات المؤسسات',
        path: '/services/enterprise-technology'
    },
    {
        title: 'Shipping, Travel & Tourism',
        titleAr: 'الشحن والسفر والسياحة',
        path: '/services/shipping-travel-and-tourism'
    }
];

export const Services: MenuType[] = [
    {
        title: 'Human Capital',
        titleAr: 'رأس المال البشري',
        path: '#'
    },
    {
        title: 'Knowledge Capital',
        titleAr: 'رأس المال المعرفي',
        path: '#'
    },
    {
        title: 'Business Excellence',
        titleAr: 'التميز المؤسسي',
        path: '#'
    },
    {
        title: 'Warehouse & Logistics',
        titleAr: 'المستودعات والخدمات اللوجستية',
        path: '#'
    },
    {
        title: 'Customer Care',
        titleAr: 'خدمة العملاء',
        path: '#'
    },
    {
        title: 'Omni Channel',
        titleAr: 'القنوات المتكاملة',
        path: '#'
    }
];

export const Information: MenuType[] = [
    {
        title: 'Working Process',
        path: '/services'
    },
    {
        title: 'Privacy Policy',
        path: '/privacy-policy'
    },
    {
        title: 'Terms & Conditions',
        path: '/terms-condition'
    },
    {
        title: 'FAQ',
        path: '/faq'
    }
];

export const MenuPolicies: MenuType[] = [
    {
        title: 'Contact Us',
        titleAr: 'اتصل بن',
        path: '/contact-us'
    },
    {
        title: 'Careers',
        titleAr: 'الوظائف',
        path: '/careers'
    },
    {
        title: 'Partnerships',
        titleAr: 'الشراكات',
        path: '/ourpartnerships'
    }
];
