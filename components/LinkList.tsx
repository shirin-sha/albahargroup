import LanguageLink from "./LanguageLink";
import { MenuType } from "@/types/menu";

interface LinkListProps {
    wrapperCls: string;
    menus: MenuType[];
}

const LinkList = ({
    wrapperCls,
    menus
}: LinkListProps) => {
    return(
        <ul className={`${wrapperCls} list-unstyled`}>
            {menus?.map((item, index) => (
                <li key={`LinkList-${index}`}>
                    <LanguageLink
                        href={item.path}
                        className="text text-16 link"
                        aria-label={item.title}
                    >
                        {item.title}
                    </LanguageLink>
                </li>
            ))}
        </ul>
    )
}

export default LinkList;