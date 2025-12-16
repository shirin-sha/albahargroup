import Icons from "./Icons";
import { SubheadingType } from "@/types/subheading";

const Subheading = ({
    title,
    icon = true,
    aos,
    aosAnchor,
    cls,
}: SubheadingType) => {
    const isAos = aos ? { 'data-aos': `${aos}` } : null;
    const isAosAnchor = aosAnchor ? { 'data-aos-anchor': `${aosAnchor}` } : null;
    const conditionalAttributes = {...isAos, ...isAosAnchor};

    return (
        <div className={`subheading subheading-bg ${cls}`} {...conditionalAttributes}>
       
            <span>{title}</span>
           
        </div>
    )
}

export default Subheading;