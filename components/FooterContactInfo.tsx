const FooterContactInfo = () => {
    return (
        <div
            className="footer-widget footer-widget-contact"
            data-aos="fade-up"
            data-aos-anchor=".footer-top"
        >
            <div className="widget-heading heading text-22">Contact</div>
            <ul className="footer-contact-list list-unstyled">
                <li className="contact-item">
                    <span className="contact-label contact-value">Queries:</span>
                    <a href="tel:+96522072111" className="contact-value">+ 965 220 72111</a>
                </li>
                <li className="contact-item">
                    <span className="contact-label contact-value">Sales:</span>
                    <a href="tel:+96522072111" className="contact-value">+ 965 220 72111</a>
                </li>
                <li className="contact-item">
                    <span className="contact-label contact-value">Email:</span>
                    <a href="mailto:enquiry@albahargroup.com" className="contact-value">enquiry@albahargroup.com</a>
                </li>
                <li className="contact-item">
                    <span className="contact-label contact-value">Fax:</span>
                    <span className="contact-value">+ 965 220 72111</span>
                </li>
            </ul>
        </div>
    )
}

export default FooterContactInfo;






















