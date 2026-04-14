'use client';

import { 
    QuickLink,
    Services,
    Information
} from "@/data/footerMenuList";
import { useLanguage } from "@/contexts/LanguageContext";

import FooterBrand from "./FooterBrand";
import FooterMenu from "./FooterMenu";
import FooterContactInfo from "./FooterContactInfo";

interface FooterTopProps {
    container: string;
}

const FooterTop = ({
    container,
}: FooterTopProps) => {
    const { language } = useLanguage();

    return (
        <div className="footer-top">
          <div className={container}>
            <div className="grid max-lg:grid-cols-12 md:max-lg:gap-x-3 footer-custom-row">
              <div className="max-md:col-span-12 max-lg:col-span-6">
                <FooterBrand />
              </div>
              <div className="max-md:col-span-12 max-lg:col-span-6">
                <FooterMenu 
                    heading={language === 'ar' ? 'قطاعات الأعمال' : 'Business Verticals'}
                    menus={QuickLink}
                />
              </div>
              <div className="max-md:col-span-12 max-lg:col-span-6">
                <FooterMenu 
                    heading={language === 'ar' ? 'قدرات الأعمال' : 'Business Capabilities'}
                    menus={Services}
                />
              </div>
              <div className="max-md:col-span-12 max-lg:col-span-6">
                <FooterContactInfo />
              </div>
            </div>
          </div>
        </div>
    )
}

export default FooterTop;