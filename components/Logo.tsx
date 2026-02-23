'use client';

import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoType } from "@/types/logo";
import { getLanguageFromPath } from "@/libs/language";

const Logo = ({ 
    src, 
    url, 
    width, 
    height, 
    alt, 
    cls, 
    ariaLabel, 
    loading 
}: LogoType) => {
    const pathname = usePathname();
    
    // Always determine logo URL based on language
    // If Arabic, link to /ar, otherwise /
    const logoUrl = getLanguageFromPath(pathname || '') === 'ar' ? '/ar' : '/';
    
    return (
        <Link className={cls} href={logoUrl} aria-label={ariaLabel}>
            <Image
                src={src}
                width={width}
                height={height}
                alt={alt}
                loading={loading}
            />
        </Link>
    )
}

export default Logo;