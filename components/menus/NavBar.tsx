'use client';

import { useState } from 'react';
import Logo from "../Logo";
import LogoImage from "@/public/img/logo.png";
import "@/styles/navigation.css";
import MenusStatic from "../../data/mainMenuList";
import Icons from "../Icons";
import DrawerOpener from "../DrawerOpener";
import DrawerMenu from "../DrawerMenu";

import {
  LinkHeading, 
  ParentLink, 
  ChildLink, 
  LinkWithImg, 
  LinkWithDesc, 
  BottomMenuLink 
} from "./MenuLinks";
import { MenuItem } from "@/types/menu";
import { useLanguage } from "@/contexts/LanguageContext";

type NavBarProps = {
  initialMenus?: MenuItem[] | null;
};

const NavBar = ({ initialMenus }: NavBarProps) => {
  const { language } = useLanguage();

  // For now, always use static menu data and ignore DB-driven `initialMenus`.
  // This ensures the header renders even if the CMS / DB is not ready.
  const [menus] = useState<MenuItem[]>(MenusStatic as MenuItem[]);

  return (
    <DrawerMenu>
      <nav className="header-nav drawer-menu">
        <div className="lg:hidden header-nav-headings">
          <Logo 
            src={LogoImage.src}
            width={189}
            height={32}
            url="/"
            cls="header-logo"
            alt="Consulo logo"
            ariaLabel="Consulo logo"
            loading="lazy"
          />
          <DrawerOpener
            cls="svg-wrapper menu-close"
            data-drawer=".drawer-menu"
          >
            <Icons.CloseCircle />
          </DrawerOpener>
        </div>
        <ul className="header-menu list-unstyled">
          {
            menus?.map((link: MenuItem, index) => {
              const parentTitle =
                language === "ar" && link.titleAr ? link.titleAr : link.title;

              return (
              <li className={`nav-item${link.megamenu || link.megamenutwocolumn ? ' nav-item-static': ''}`} key={`link-${index}`}>
                  <ParentLink 
                    title={parentTitle}
                    path={link.path} 
                    dropdown={link.dropdown || link.megamenu || link.megamenutwocolumn ? true : false} 
                  />

                  {link.dropdown &&
                    <div className="header-submenu menu-absolute submenu-color">
                      <ul className="list-unstyled">
                        {link.dropdown.map((childlink, index) => (
                            (() => {
                              const childTitle =
                                language === "ar" && childlink.titleAr
                                  ? childlink.titleAr
                                  : childlink.title;

                              return (
                            <li className="nav-item" key={`childlink-${index}`}>
                              <ChildLink 
                                title={childTitle}
                                path={childlink.path} 
                                dropdown={childlink.dropdown && childlink.dropdown.length > 0 ? true : false} 
                              />

                              {childlink.dropdown &&                                 
                                <div className="header-submenu menu-absolute submenu-color header-grandmenu">
                                    <ul className="list-unstyled">
                                      {childlink.dropdown.map((grandchildlink, index) => {
                                          const grandChildTitle =
                                            language === "ar" && grandchildlink.titleAr
                                              ? grandchildlink.titleAr
                                              : grandchildlink.title;

                                          return (
                                            <li className="nav-item" key={`grandchildlink-${index}`}>
                                              <ChildLink 
                                                title={grandChildTitle}
                                                path={grandchildlink.path} 
                                                dropdown={false} 
                                              />
                                            </li>
                                          );
                                        })
                                      }
                                    </ul>
                                  </div>
                                }                          
                            </li>
                            );
                          })()
                          ))
                        }
                      </ul>
                    </div>
                  }

                  {link.megamenu &&             
                    <div className="header-submenu menu-absolute submenu-color header-megamenu">
                      <ul className="list-unstyled">
                        {link.megamenu.map((childlink, index) => {
                            const headingTitle =
                              language === "ar" && childlink.headingAr
                                ? childlink.headingAr
                                : childlink.heading;

                            return (
                              <li className="nav-item" key={`megachild-${index}`}>
                                <LinkHeading 
                                  title={headingTitle}
                                  path={childlink.path}
                                />
                                {childlink.dropdown && 
                                  <ul className="submenu-lists reset-submenu list-unstyled submenu-color">
                                    {childlink.dropdown.map((grandchildlink, index) => {
                                        const grandChildTitle =
                                          language === "ar" && grandchildlink.titleAr
                                            ? grandchildlink.titleAr
                                            : grandchildlink.title;

                                        return (
                                          <li className="nav-item" key={`megagrandchild-${index}`}>
                                            <ChildLink 
                                              title={grandChildTitle}
                                              path={grandchildlink.path}
                                              dropdown={false}
                                            />
                                          </li>
                                        );
                                      })
                                    }
                                  </ul>
                                }
                              </li>
                            );
                          })
                        }

                        {link.bottommenu &&
                          <li className="nav-item megamenu-links">
                            {link.bottommenu.map((link, index) => {
                              const bottomTitle =
                                language === "ar" && link.titleAr
                                  ? link.titleAr
                                  : link.title;

                              return (
                                <BottomMenuLink 
                                  title={bottomTitle}
                                  path={link.path}
                                  icon={link.icon}
                                  key={`BottomMenu-${index}`}
                                />
                              );
                            })}
                          </li>
                        }
                      </ul>
                    </div>
                  }

                  {link.megamenutwocolumn && 
                    <div className="header-submenu menu-absolute submenu-color header-megamenu">
                      <ul className="list-unstyled">                        
                        {link.megamenutwocolumn.map((childlink, index) => {
                            const headingTitle =
                              language === "ar" && childlink.titleAr
                                ? childlink.titleAr
                                : childlink.title;

                            return (
                              <li className="nav-item" key={`megatwocol-${index}`}>
                                <LinkHeading 
                                  title={headingTitle}
                                  path={childlink.path}
                                />

                                {childlink.dropdown && 
                                  <ul className="reset-submenu list-unstyled submenu-color">
                                    {childlink.dropdown.map((grandchildlink, index) => {
                                        const grandChildTitle =
                                          language === "ar" && grandchildlink.titleAr
                                            ? grandchildlink.titleAr
                                            : grandchildlink.title;
                                        const grandChildText =
                                          language === "ar" && grandchildlink.textAr
                                            ? grandchildlink.textAr
                                            : grandchildlink.text;

                                        return (
                                          <li className="nav-item" key={`megadesc-${index}`}>
                                            {grandchildlink.imageUrl != null ? (
                                              <LinkWithImg 
                                                imageUrl={grandchildlink.imageUrl}
                                                imageUrlMobile={grandchildlink.imageUrlMobile}
                                                title={grandChildTitle}
                                                text={grandChildText}
                                                path={grandchildlink.path}
                                                altText="Menu image"
                                                showbutton={true}
                                              />
                                            ) : (
                                              <LinkWithDesc 
                                                title={grandChildTitle}
                                                text={grandChildText}
                                                path={grandchildlink.path}
                                              />
                                            )}
                                          </li>
                                        );
                                      })
                                    }
                                  </ul>
                                }
                              </li>
                            );
                          })
                        }

                        {link.bottommenu &&
                          <li className="nav-item megamenu-links">
                            {link.bottommenu.map((link, index) => {
                              const bottomTitle =
                                language === "ar" && link.titleAr
                                  ? link.titleAr
                                  : link.title;

                              return (
                                <BottomMenuLink 
                                  title={bottomTitle}
                                  path={link.path}
                                  icon={link.icon}
                                  key={`BottomMenu-${index}`}
                                />
                              );
                            })}
                          </li>
                        }
                      </ul>
                    </div>
                  }
              </li>
            );
            })
          }
        </ul>
      </nav>
    </DrawerMenu>
  )
}

export default NavBar;