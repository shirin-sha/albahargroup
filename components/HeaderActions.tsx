import SlimButton from "./buttons/SlimButton";
import HeaderSeparator from "./HeaderSeparator";
import Hamburger from "./menus/Hamburger";
import Link from "next/link";

const HeaderActions = () => {
    return (
        <div className="header-actions flex items-center">
            <Link 
                href="#" 
                className="header-language"
                aria-label="Switch to Arabic"
            >
                <span className="language-text">ع</span>
            </Link>
            <HeaderSeparator />
            <SlimButton 
                label="Profile"
                href="#"
                ariaLabel="contact us"
                cls="button--secondary !hidden lg:!inline-flex"
            />
            <Hamburger />
        </div>
    )
}

export default HeaderActions;