import parser from "html-react-parser";

interface CardTextOnlyProps {
    text: string;
}

const CardTextOnly = ({ text }: CardTextOnlyProps) => {
    return (
        <div
            className="card-testimonial radius18"
            data-aos="fade-up"
            data-aos-delay="10"
        >
            {text && <p className="text text-16">{parser(text)}</p>}
        </div>
    )
}

export default CardTextOnly;

