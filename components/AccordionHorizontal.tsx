'use client';

import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { ServiceProps } from "@/types/service";
import parser from "html-react-parser";
import Link from "next/link";
import Icons from "./Icons";
import { useLanguage } from "@/contexts/LanguageContext";
import { addLanguagePrefix } from "@/libs/language";

/** Collapsed column width uses --width from title offsetWidth. Active item hides title via display:none, so measure with a temporary display override. */
const setCollapsedWidths = (buttons: Array<HTMLDivElement | undefined>) => {
  buttons.forEach((btn) => {
    if (!btn) return;
    const li = btn.closest('.accordion-li') as HTMLElement | null;
    if (!li) return;
    const hadInlineDisplay = btn.style.display;
    btn.style.setProperty('display', 'flex', 'important');
    const w = btn.offsetWidth;
    if (hadInlineDisplay) btn.style.display = hadInlineDisplay;
    else btn.style.removeProperty('display');
    li.style.setProperty('--width', `${w}px`);
  });
};

const AccordionHorizontal = ({ items }: { items: ServiceProps[] }) => {
  const { language } = useLanguage();
  const buttonsRef = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useLayoutEffect(() => {
    const slice = items.slice(0, 7);
    setCollapsedWidths(slice.map((_, index) => buttonsRef.current[index]));
  }, [items, activeIndex]);

  useEffect(() => {
    if (items.length > 0) {
      setActiveIndex(0);
    }
  }, [items]);

  useEffect(() => {
    const syncAccordion = () => {
      const isDesktop = window.matchMedia('(min-width: 992px)').matches;

      buttonsRef.current.forEach((btn, index) => {
        const content = btn.nextElementSibling as HTMLElement | null;
        if (!content) return;

        if (isDesktop) {
          content.style.maxHeight = '';
        } else {
          content.style.maxHeight = index === activeIndex ? `${content.scrollHeight}px` : '0';
        }
      });
    };

    syncAccordion();
    window.addEventListener('resize', syncAccordion);
    return () => window.removeEventListener('resize', syncAccordion);
  }, [activeIndex, items]);

  return (
    <div className="accordion-horizontal">
      <ul className="service-list list-unstyled radius18">
        {items.slice(0, 7).map((item, index) => (
          <li className={`accordion-li ${activeIndex === index ? 'active' : ''}`} key={index}>
            <div
              className="accordion-title"
              ref={(el) => {
                if (el) buttonsRef.current[index] = el;
                else delete buttonsRef.current[index];
              }}
              onClick={() => setActiveIndex(index)}
            >
                <div className="accordion-title-icon">
                    {item.icon && <span className="icon-main">{parser(item.icon)}</span>}
                    <h2 className="heading text-24 text-rotate">{item.detailTitle || item.title}</h2>
                </div>
                <span className="icon icon-plus-circle">
                    <Icons.PlusCircle />
                </span>
                <span className="icon icon-minus-circle">
                    <Icons.MinusCircle />
                </span>
            </div>
            <div className="accordion-content">
              <div className="service-content-inner">
                <div>                    
                    {item.icon && <span className="icon-main">{parser(item.icon)}</span>}
                    <h2 className="heading text-24">{item.detailTitle || item.title}</h2>
                    {item.description && <p className="text text-16">{parser(item.description)}</p>}
                </div>
                <div className="service-button">
                  <Link
                    href={addLanguagePrefix('/capabilities', language)}
                    className="button button--primary"
                  >
                    {language === 'ar' ? 'مزيد من التفاصيل' : 'More Details'}
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccordionHorizontal;
