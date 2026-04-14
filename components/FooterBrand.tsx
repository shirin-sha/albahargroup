'use client';

import Logo from "./Logo";
import LogoImage from "@/public/img/logo-white.png";
import Social from "./Social";
import { useLanguage } from "@/contexts/LanguageContext";

const FooterBrand = () => {
    const { language } = useLanguage();

    return (
        <div
            className="footer-widget footer-widget-brand"
            data-aos="fade-up"
            data-aos-anchor=".footer-top"
        >
            <Logo 
                src={LogoImage.src}
                width={200}
                height={35}
                url="/"
                cls="footer-logo"
                alt="albahar logo"
                ariaLabel="albahar logo" 
                loading="lazy"
            />
            <p className="text text-16">
                {language === 'ar'
                    ? 'مجموعة محمد عبدالرحمن البهار هي مجموعة أعمال كويتية متنوعة تمثل علامات تجارية عالمية رائدة في قطاعات السلع الاستهلاكية، والإلكترونيات الاستهلاكية، والأتمتة المنزلية، وتقنيات المؤسسات، والشحن، والسفر والسياحة، وتلتزم ببناء شراكاتطويلة الأمد، وتحقيق التميز التشغيلي، والمساهمة في النمو المستدام لدولة الكويت.'
                    : 'Mohamed Abdulrahman Al-Bahar Group is a diversified Kuwaiti business group representing leading global brands across consumer goods, consumer electronics, home automation, enterprise technology, shipping, travel and tourism, committed to long-term partnerships, operational excellence and Kuwait’s sustainable growth.'
                }
            </p>
            <Social 
                wrapperCls="social-icons"
                aos="fade-up"
                aosAnchor=".footer-top"
            />
        </div>
    )
}

export default FooterBrand;