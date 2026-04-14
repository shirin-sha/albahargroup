'use client';

import { useLanguage } from "@/contexts/LanguageContext";

const FooterContactInfo = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <div
            className="footer-widget footer-widget-contact"
            data-aos="fade-up"
            data-aos-anchor=".footer-top"
        >
            <div className="widget-heading heading text-22">{isAr ? ' لاتصال' : 'Contact Us'}</div>
            <ul className="footer-contact-list list-unstyled">
                <li className="contact-item">
                    <span className="contact-label contact-value">{isAr ? 'الاستفسارات:' : 'Queries:'}</span>
                    <a href="tel:+96522072111" className="contact-value">+ 965 220 72111</a>
                </li>
                <li className="contact-item">
                    <span className="contact-label contact-value">{isAr ? 'المبيعات:' : 'Sales:'}</span>
                    <a href="tel:+96522072111" className="contact-value">+ 965 220 72111</a>
                </li>
                <li className="contact-item">
                    <span className="contact-label contact-value">{isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                    <a href="mailto:enquiry@albahargroup.com" className="contact-value">enquiry@albahargroup.com</a>
                </li>
                <li className="contact-item">
                    <span className="contact-label contact-value">{isAr ? 'العنوان:' : 'Address:'}</span>
                    <span className="contact-value">
                        {isAr
                            ? 'مدينة الكويت، شارع أبو بكر 2، برج البهار'
                            : 'Kuwait City, Abu Bakr Street 2, Al Bahar Tower'
                        }
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default FooterContactInfo;






















