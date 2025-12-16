import { TestimonialProps } from "@/types/testimonialProps";
import parser from "html-react-parser";
import PrimaryButton from "./buttons/PrimaryButton";

const CardTestimonialContent = ({ data }: {data: TestimonialProps}) => {
    const {
        review,
    } = data || {};

    return (
        <div className="thumb-card">
            {review && <p className="text text-18">{parser(review)}</p>}
            <PrimaryButton
                label="View Detail"
                ariaLabel="View testimonial details"
            href="/testimonials"
                cls="mt-4"
            />
        </div>
    )
}

export default CardTestimonialContent;