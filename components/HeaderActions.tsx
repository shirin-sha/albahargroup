'use client';

import SlimButton from "./buttons/SlimButton";
import HeaderSeparator from "./HeaderSeparator";
import Hamburger from "./menus/Hamburger";
import { useLanguage } from "@/contexts/LanguageContext";

const HeaderActions = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="header-actions flex items-center">
            <button
                onClick={toggleLanguage}
                className={`header-language ${language === 'en' ? 'is-en' : 'is-ar'}`}
                aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                type="button"
            >
                <span className="language-text">{language === 'en' ? 'ع' : 'EN'}</span>
            </button>
            <HeaderSeparator />
            <SlimButton 
                label={language === 'en' ? 'Profile' : ' الملف التعريفي'}
                href="#"
                ariaLabel="contact us"
                cls="button--secondary !hidden lg:!inline-flex"
            />
            <Hamburger />
        </div>
    )
}

export default HeaderActions;