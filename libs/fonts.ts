import { Inter, Noto_Sans_Arabic, Poppins } from 'next/font/google';
 
export const inter = Inter({ 
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body--family'
});
 
export const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-heading--family'
});

export const poppinsButton = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-button--family'
});

export const notoSansArabic = Noto_Sans_Arabic({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['arabic'],
    display: 'swap',
    variable: '--font-arabic--family'
});

export const fonts = [inter, poppins, poppinsButton, notoSansArabic].map(font => font.variable).join(" ");