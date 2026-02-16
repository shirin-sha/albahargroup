import { ButtonProps } from "./button";
import { ImageProps } from "./image";
import { TextProps } from "./text";
import { BlockListProps } from "./blocks";

import { PromotionProps } from "@/types/promotionProps";
import { CounterItemProps } from "./counterItemProps";

export interface SectionProps {
    wrapperCls?: string;
    container?: string;
    subheading?: string;
    heading?: string;
    styledText?: string;
    styledTextCls?: string;
    text?: string;
    link?: string;
    button?: ButtonProps;
    primaryButton?: ButtonProps;
    secondaryButton?: ButtonProps;
    block?: {
        subheading?: string;
        heading?: string;
        text?: string;
        button?: ButtonProps;
    };
    blockList?: BlockListProps[];
    image?: ImageProps;
    promoImage?: ImageProps;
    backgroundImage?: ImageProps;
    imageList?: ImageProps[];
    promotions?: PromotionProps[];
    counterData?: CounterItemProps[];
    textList?: TextProps[];
    items?: Array<{
        textheading1?: string;
        textdescr1?: string;
        title?: string;
        text?: string;
        image?: string;
        subheading?: string;
        heading?: string;
        description?: string;
        review?: string;
        button?: {
            label?: string;
            href?: string;
        };
        icon?: string;
    }>;
    cards?: Array<{
        title?: string;
        description?: string;
        features?: string[];
        link?: string;
        active?: boolean;
    }>;
    rotatingLogo?: {
        logo?: any;
        text?: string;
    },
}