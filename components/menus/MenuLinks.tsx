import Link from "next/link";
import Image from "next/image";
import Icons from "../Icons";
import { MenuType } from "@/types/menu";
import LanguageLink from "../LanguageLink";

export const LinkHeading = ({ title, path }: MenuType) => {
    return(
        <LanguageLink className="menu-link heading fw-300" href={path}>
            {title}
        </LanguageLink>
    )
}

export const ParentLink = ({ title, path, dropdown }: MenuType) => {
    return(
        <>
            {dropdown ? (
                <LanguageLink className="menu-link menu-link-main menu-accrodion" href={path}>
                    {title}
                    <Icons.CaretDown />
                </LanguageLink>
            ) : (
                <LanguageLink className="menu-link menu-link-main" href={path}>
                    {title}
                </LanguageLink>
            )}
        </>
    )
}

export const ChildLink = ({ title, path, dropdown }: MenuType) => {
    return(
        <>
            {dropdown ? (
                <LanguageLink className="menu-link menu-accrodion" href={path}>
                    {title}
                    <Icons.CaretDown />
                </LanguageLink>
            ) : (
                <LanguageLink className="menu-link" href={path}>
                    {title}
                </LanguageLink>
            )}
        </>
    )
}

export const LinkWithImg = ({ title, path, text, showbutton, altText, imageUrl, imageUrlMobile }: MenuType) => {
    return (
        <LanguageLink className="menu-link megamenu-image-wrap" href={path}>
            <picture>
                {imageUrlMobile && <source media="(max-width: 575px)" srcSet={imageUrlMobile} />}
                <Image 
                    src={imageUrl ? imageUrl : ''}
                    width={1000}
                    height={668}
                    alt={altText ? altText : 'image'}
                    loading="lazy"
                />
            </picture>
            <div className="content">
                <div>
                    {title && <div className="heading text-20 fw-600">{title}</div>}
                    {text && <div className="text text-14">{text}</div>}
                </div>
                {showbutton &&
                    <div className="button button--primary">
                        <span className="svg-wrapper"><Icons.CaretRight /></span>
                    </div>
                }
            </div>
        </LanguageLink>
    )
}

export const LinkWithDesc = ({ title, path, text }: MenuType) => {
    return(        
        <LanguageLink className="menu-link" href={path}>
            {title && <div className="heading text-20 fw-600">{title}</div>}
            {text && <div className="text text-14">{text}</div>}
        </LanguageLink>
    )
}

export const BottomMenuLink = ({ title, path, icon }: MenuType) => {
    return(
        <LanguageLink className="menu-link text-14 fw-300" href={path}>
            {icon}
            {title}
        </LanguageLink>
    )
}
