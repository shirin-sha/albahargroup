import "@/styles/header.css";
import Logo from "./Logo";
import LogoImage from "@/public/img/logo-white.png";
import NavBar from "./menus/NavBar";
import HeaderActions from "./HeaderActions";
import StickyHeader from "./StickyHeader";
import type { MenuItem } from "@/types/menu";

type HeaderStyle1Props = {
  menus?: MenuItem[] | null;
};

const Header = ({ menus }: HeaderStyle1Props) => {
    return (
      <StickyHeader 
        wrapperCls="header-1 header-floating"
        container="container-fluid"
        stickyType= 'always'
      >
        <div className="header-grid">
          {/* Logo */}
          <Logo                   
            src={LogoImage.src}
            width={290}
            height={50}
            url="/"
            cls="header-logo"
            alt="Consulo logo"
            ariaLabel="Consulo logo"
            loading="eager"
          />
          
          {/* Nav Bar */}
          <NavBar initialMenus={menus} />

          {/* Header Actions */}
          <HeaderActions />
        </div>
      </StickyHeader>
    )
}

export default Header;