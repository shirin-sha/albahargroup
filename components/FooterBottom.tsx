'use client';

import LinkList from "./LinkList";
import { MenuPolicies } from "@/data/footerMenuList";

interface FooterBottomProps {
    container: string;
}

const FooterBottom = ({
    container
}: FooterBottomProps) => {
    return(
        <div className="footer-bottom">
            <div className={container}>
                <div className="grid grid-cols-2 md:grid-cols-3 md:gap-1 footer-bottom-row">
                    <div className="col-span-2 md:col-span-1">
                        <div className="footer-copyright text text-16">
                        Copyright ©2025 Mohamed Abdulrahman Al-Bahar
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="footer-powered-by text text-16">
                            Powered by{' '}
                            <a
                                href="https://anathothonline.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Anathoth website"
                            >
                                Anathoth
                            </a>
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <LinkList 
                            wrapperCls="footer-menu footer-policies"
                            menus={MenuPolicies}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FooterBottom;