import LanguageLink from "./LanguageLink";
import { MenuType } from "@/types/menu";
import { useLanguage } from "@/contexts/LanguageContext";

interface LinkListProps {
    wrapperCls: string;
    menus: MenuType[];
}

const LinkList = ({
    wrapperCls,
    menus
}: LinkListProps) => {
    const { language } = useLanguage();

    return(
        <ul className={`${wrapperCls} list-unstyled`}>
            {menus?.map((item, index) => (
                <li key={`LinkList-${index}`}>
                    <LanguageLink
                        href={item.path}
                        className="text text-16 link"
                        aria-label={language === "ar" && item.titleAr ? item.titleAr : item.title}
                    >
                        {language === "ar" && item.titleAr ? item.titleAr : item.title}
                    </LanguageLink>
                </li>
            ))}
        </ul>
    )
}

export default LinkList;