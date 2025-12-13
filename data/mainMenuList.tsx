import Icons from "../components/Icons";
import { MenuItem } from "@/types/menu";

const Menus: MenuItem[] = [
    {
        title: 'HOME',
        path: '/',
    },
    {
        title: 'ABOUT US',
        path: '/about-us'
    },
    {
        title: 'BUSINESSES',
        path: '/businesses',
        dropdown: [
            {
                title: 'CONSUMER GOODS',
                path: '/businesses/consumer-goods'
            },
            {
                title: 'CONSUMER ELECTRONICS',
                path: '/businesses/consumer-electronics'
            },
            {
                title: 'HOME AUTOMATION',
                path: '/businesses/home-automation'
            },
            {
                title: 'ENTERPRISE TECHNOLOGY',
                path: '/businesses/enterprise-technology'
            },
            {
                title: 'SHIPPING',
                path: '/businesses/shipping'
            },
            {
                title: 'TRAVEL & TOURISM',
                path: '/businesses/travel-tourism'
            }
        ]
    },
    {
        title: 'CAPABILITIES',
        path: '/capabilities',
        dropdown: [
            {
                title: 'HUMAN CAPITAL',
                path: '/capabilities/human-capital'
            },
            {
                title: 'KNOWLEDGE CAPITAL',
                path: '/capabilities/knowledge-capital'
            },
            {
                title: 'BUSINESS EXCELLENCE',
                path: '/capabilities/business-excellence'
            },
            {
                title: 'WAREHOUSE & LOGISTICS',
                path: '/capabilities/warehouse-logistics'
            },
            {
                title: 'CUSTOMER CARE',
                path: '/capabilities/customer-care'
            }
        ]
    },
    {
        title: 'CORPORATE INFO',
        path: '/corporate-info',
        dropdown: [
            {
                title: 'NEWS & UPDATES',
                path: '/corporate-info/news-updates'
            },
            {
                title: 'CAREERS',
                path: '/corporate-info/careers'
            },
            {
                title: 'OUR PARTNERSHIPS',
                path: '/corporate-info/partnerships'
            }
        ]
    },
    {
        title: 'CONTACT US',
        path: '/contact-us'
    }
]

export default Menus;