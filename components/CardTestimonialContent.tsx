import { TestimonialProps } from "@/types/testimonialProps";
import parser from "html-react-parser";
import PrimaryButton from "./buttons/PrimaryButton";

const CardTestimonialContent = ({ data }: {data: TestimonialProps & { button?: { label?: string; href?: string } }}) => {
    const {
        review,
        button,
    } = data || {};

    return (
        <div className="thumb-card">
            {review && <div className="text text-18">{parser(review)}</div>}
            {button && button.label && button.href ? (
                <PrimaryButton
                    label={button.label}
                    ariaLabel={button.label}
                    href={button.href}
                    cls="mt-4"
                />
            ) : (
                <PrimaryButton
                    label="View Detail"
                    ariaLabel="View testimonial details"
                    href="/testimonials"
                    cls="mt-4"
                />
            )}
        </div>
    )
}

export default CardTestimonialContent;