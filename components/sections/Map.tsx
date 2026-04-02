"use client";

import "@/styles/google-map.css";
import { resolveMapIframeSrc } from "@/libs/cms/contactPage";

type MapSectionProps = {
  mapEmbed?: string | null;
};

const MapSection = ({ mapEmbed }: MapSectionProps) => {
  const src = resolveMapIframeSrc(mapEmbed ?? undefined);
  if (!src) return null;

  return (
    <div className="google-map">
      <div className="iframe-wrapper">
        <iframe
          src={src}
          title="Google map"
          width="1920"
          height="600"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default MapSection;
