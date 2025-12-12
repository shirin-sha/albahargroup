"use client";

import "@/styles/google-map.css";

const MapSection = () => {
    return (
        <div className="google-map">
            <div className="iframe-wrapper">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.5!2d47.9621979!3d29.3626961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf84df77b442f3%3A0xefff7e01d1fa538f!2sAl-Bahar%20Tower!5e0!3m2!1sen!2sin!4v1754748838084!5m2!1sen!2sin"
                    title="Google map"
                    width="1920"
                    height="600"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
      </div>
    )
}

export default MapSection;