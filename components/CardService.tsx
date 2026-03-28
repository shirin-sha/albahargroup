import Link from "next/link";
import { ServiceDataType } from "@/types/service";
import Icons from "./Icons";
import parser from "html-react-parser";
import { useLanguage } from "@/contexts/LanguageContext";
import { addLanguagePrefix } from "@/libs/language";

const CardService = ({ data }: ServiceDataType) => {
    const { language } = useLanguage();
    const { 
        title,
        description,
        slug,
        list,
        icon,
    } = data || {};

    const serviceHref = slug
        ? addLanguagePrefix(`/services/${slug}`, language)
        : addLanguagePrefix('/services', language);

    return (        
        <Link
            className="multicolumn-card"
            href={serviceHref}
            aria-label="View Service Details"
        >
            {icon && <div className="card-icon icon-40">{parser(icon)}</div>}

            {title && <h2 className="heading text-28">{title}</h2>}

            {description && <div className="text text-16">{description}</div>}

            {list &&
                <ul className="text-lists list-unstyled">
                    {list.map((item, index) => (                        
                        <li className="text-item text text-16 fw-500" key={`service-${index}`}>
                            <Icons.Plus />
                            {item.title}
                        </li>
                    ))}
                </ul>
            }
        </Link>
    )
}

export default CardService;