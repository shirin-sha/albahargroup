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
        megamenutwocolumn: [
            {
                title: 'OUR BUSINESS VERTICALS',
                path: '/businesses',
                dropdown: [
                    {
                        title: 'Consumer Goods',
                        text: 'Leading FMCG brands across Kuwait’s key channels.',
                        path: '/businesses/consumer-goods',
                    },
                    {
                        title: 'Consumer Electronics',
                        text: 'Home and personal electronics from global innovators.',
                        path: '/businesses/consumer-electronics',
                    },
                    {
                        title: 'Home Automation',
                        text: 'Smart home solutions for comfort & security.',
                        path: '/businesses/home-automation',
                    },
                    {
                        title: 'Enterprise Technology',
                        text: 'End-to-end IT, print and AV solutions.',
                        path: '/businesses/enterprise-technology',
                    },
                    {
                        title: 'Shipping',
                        text: 'Port-to-door shipping, agency services and logistics.',
                        path: '/businesses/shipping',
                    },
                    {
                        title: 'Travel & Tourism',
                        text: 'Corporate, leisure and group travel across destinations.',
                        path: '/businesses/travel-tourism',
                    },
                ],
            },
            {
                title: 'Spotlight on Our Businesses',
                path: '/businesses',
                dropdown: [
                    {
                        imageUrl: '/img/menu/megamenu.png',
                        imageUrlMobile: '/img/menu/575.jpg',
                        title: 'Inside the Group Portfolio',
                        text: 'Six diverse businesses connecting consumers, enterprises and traders with leading global brands.',
                        path: '/businesses',
                        showbutton: true,
                    }
                ]
            },
       
        ],
        bottommenu: [
            {
                title: 'Contact Sales',
                path: '/contact-us',
                icon: <Icons.Contact />,
            },
            {
                title: 'Download Profile',
                path: '/corporate-info',
                icon: <Icons.Download />,
            },
            {
                title: 'Our Partners',
                path: '/corporate-info/partnerships',
                icon: <Icons.Handshake />,
            },
        ],
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
                path: '/news'
            },
            {
                title: 'CAREERS',
                path: '/careers'
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