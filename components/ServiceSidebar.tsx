import Icons from "./Icons";
import SidebarPhoneImage from "@/public/img/service/secvice-contact.jpg";
import { getDb } from "@/libs/mongodb";
import { Service } from "@/libs/models/service";
import type { Language } from "@/libs/language";
import { addLanguagePrefix } from "@/libs/language";
import { serviceDisplayTitle } from "@/libs/serviceLocale";

import SidebarCategories from "./SidebarCategories";
import SidebarPhone from "./SidebarPhone";
import SidebarPdfDownload from "./SidebarPdfDownload";
import DrawerOpener from "./DrawerOpener";

const CAPABILITY_SLUGS = new Set([
    'human-capital',
    'knowledge-insights',
    'business-excellence',
    'logistics',
    'customer-care',
]);

const resolveSection = (section?: string, slug?: string): 'businesses' | 'capabilities' => {
    if (section === 'capabilities') return 'capabilities';
    if (section === 'businesses') return 'businesses';
    return slug && CAPABILITY_SLUGS.has(slug) ? 'capabilities' : 'businesses';
};

const ServiceSidebar = async ({
    slug,
    section,
    locale = 'en',
}: {
    slug?: string;
    section?: 'businesses' | 'capabilities';
    locale?: Language;
}) => {
    const db = await getDb();
    const collection = db.collection<Service>("services");
    const currentSection = resolveSection(section, slug);
    const services = await collection
        .find({ enabled: { $ne: false }, section: currentSection } as any)
        .sort({ created_at: -1 })
        .toArray();

    const filteredServices = services.filter((item: any) => item.slug != slug);
    const servicesRoot = addLanguagePrefix('/services', locale);
    const categories = filteredServices.map((service: Service) => ({
        label: serviceDisplayTitle(service, locale),
        slug: service.slug,
    }));

    return (
        <div className="sidebar-filter drawer-service-sidebar">
            <div className="drawer-headings lg:!hidden" data-aos="fade-up">
                <div className="heading text-24">Filter</div>
                <DrawerOpener
                    cls="svg-wrapper menu-close"
                    data-drawer=".drawer-service-sidebar"
                >
                    <Icons.CloseCircle />
                </DrawerOpener>
            </div>

            <aside className="service-sidebar">
                {categories.length > 0 &&
                    <SidebarCategories 
                        title="Services List"
                        categories={categories}
                        rootUrl={servicesRoot}
                    />
                }

                <SidebarPhone 
                    heading="Contact us for any enquiry"
                    text="Need assistance? Speak with our team"
                    phone="+965 XXX XXXX"
                    image={{
                        src: SidebarPhoneImage.src,                      
                        width: 1000,
                        height: 929,
                        loading: "lazy",
                        alt: "image"
                    }}
                />
                
                <SidebarPdfDownload 
                    heading="Download Our Profile"
                    text="Explore Mohamed Abdulrahman Al-Bahar Group’s businesses, capabilities, partnerships and corporate information through our company profile brochure."
                />
            </aside>
        </div>
    )
}

export default ServiceSidebar;