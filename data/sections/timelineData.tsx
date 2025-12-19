import { SectionProps } from "@/types/sectionProps";

export const TimelineData: SectionProps & { timelineItems?: Array<{
    year: string;
    title: string;
    logos?: Array<{
        src: string;
        alt: string;
        width?: number;
        height?: number;
    }>;
    position?: 'above' | 'below';
}> } = {
    wrapperCls: "mt-100 section-padding",
    container: "container",
    subheading: "Our Journey",
    heading: "A Legacy of Growth & Partnerships",
    timelineItems: [
        {
            year: "1937",
            title: "Mohamed Abdulrahman Al-Bahar sets up own company.",
            position: "below",
            logos: [
                { src: "/img/brand/abdulrahman.png", alt: "Mohamed Abdulrahman Al-Bahar", width: 100, height: 60 }
            ]
        },
        {
            year: "1946",
            title: "Signs partnership agreement with Unilever.",
            position: "above",
            logos: [
                { src: "/img/brand/b3.png", alt: "Unilever", width: 100, height: 60 }
            ]
        },
        {
            year: "1951",
            title: "Incorporates Bahar Shipping Company.",
            position: "below",  logos: [
                { src: "/img/brand/albaharshiping.png", alt: "Bahar Shipping Company", width: 100, height: 60 }
            ]
        },
        {
            year: "1954",
            title: "Partners with Coca Cola Co.",
            position: "above",
            logos: [
                { src: "/img/brand/b1.png", alt: "Coca Cola", width: 100, height: 60 }
            ]
        },
        {
            year: "1959",
            title: "Signs on Caterpillar.",
            position: "below",
            logos: [
                { src: "/img/brand/b2.png", alt: "Caterpillar", width: 100, height: 60 }
            ]
        },
        {
            year: "1961",
            title: "Setup Bahar & Partners.",
            position: "above",
            logos: [
                { src: "/img/brand/partners.png", alt: "Bahar & Partners", width: 100, height: 60 }
            ]
        },
        {
            year: "1963",
            title: "Incorporates BEEA and signs up with GE Appliances.",
            position: "below",
            logos: [
                { src: "/img/brand/ge.png", alt: "GE Appliances", width: 100, height: 60 },
                { src: "/img/brand/albaharelectro.png", alt: "Bahar & Partners", width: 100, height: 60 }
            ]
        },
        {
            year: "1968",
            title: "Partnership with PIL.",
            position: "above",
            logos: [
                { src: "/img/brand/pil.png", alt: "PIL", width: 100, height: 60 }
            ]
        },
        {
            year: "1980",
            title: "Partnership with COSCO.",
            position: "below",
            logos: [
                { src: "/img/brand/b4.png", alt: "COSCO", width: 100, height: 60 }
            ]
        },
        {
            year: "1995",
            title: "Partners with Al Alali.",
            position: "above",
            logos: [
                { src: "/img/brand/alalai.png", alt: "Al Alali", width: 100, height: 60 }
            ]
        },
        {
            year: "2004",
            title: "Partners with Master Chef.",
            position: "below",
            logos: [
                { src: "/img/brand/master.png", alt: "Master Chef", width: 100, height: 60 }
            ]
        },
        {
            year: "2005",
            title: "Partners with Ocean.",
            position: "above",
            logos: [
                { src: "/img/brand/ocean.jpg", alt: "Ocean", width: 100, height: 60 }
            ]
        },
        {
            year: "2007",
            title: "Partners with Elite.",
            position: "below",
            logos: [
                { src: "/img/brand/elite.png", alt: "Elite", width: 100, height: 60 }
            ]
        },
        {
            year: "2010",
            title: "Partners with Royxon.",
            position: "above",
            logos: [
                { src: "/img/brand/royxon.png", alt: "Royxon", width: 100, height: 60 }
            ]
        },
        {
            year: "2015",
            title: "Partners with Speed Queen.",
            position: "below",
            logos: [
                { src: "/img/brand/speed.png", alt: "Speed Queen", width: 100, height: 60 }
            ]
        },
        {
            year: "2020",
            title: "New Partnerships Canon, Goody & Baytouti.",
            position: "above",
            logos: [
                { src: "/img/brand/canon.png", alt: "Canon", width: 80, height: 50 },
                { src: "/img/brand/goody.png", alt: "Goody", width: 80, height: 50 },
                { src: "/img/brand/baytu.png", alt: "Baytouti", width: 80, height: 50 }
            ]
        },
        {
            year: "2021",
            title: "New Partnership with Logitech, 3M, Lofratelli & Honeywell.",
            position: "below",
            logos: [
                { src: "/img/brand/logitech.png", alt: "Logitech", width: 80, height: 50 },
                { src: "/img/brand/3m.png", alt: "3M", width: 80, height: 50 },
                { src: "/img/brand/lafra.png", alt: "Lofratelli", width: 80, height: 50 },
                { src: "/img/brand/honeywell.png", alt: "Honeywell", width: 80, height: 50 }
            ]
        },
        {
            year: "2022",
            title: "New Partnerships Hama, Lipton, Lago, & Germanica.",
            position: "above",
            logos: [
                { src: "/img/brand/hama.png", alt: "Hama", width: 80, height: 50 },
                { src: "/img/brand/lipton.png", alt: "Lipton", width: 80, height: 50 },
                { src: "/img/brand/lago.png", alt: "Lago", width: 80, height: 50 },
                { src: "/img/brand/germanica.png", alt: "Germanica", width: 80, height: 50 }
            ]
        },
        {
            year: "2023",
            title: "New Partnerships Tilda, Karcher & Marshall.",
            position: "below",
            logos: [
                { src: "/img/brand/tilda.png", alt: "Tilda", width: 80, height: 50 },
                { src: "/img/brand/karcher.png", alt: "Karcher", width: 80, height: 50 },
                { src: "/img/brand/marshall.png", alt: "Marshall", width: 80, height: 50 }
            ]
        },
        {
            year: "2024",
            title: "Continuing our legacy of excellence.",
            position: "above"
        }
    ]
}


