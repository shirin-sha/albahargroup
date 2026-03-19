'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ServiceProps } from "@/types/service";
import parser from "html-react-parser";
import Link from "next/link";
import Icons from "./Icons";


const AccordionHorizontal = ({ items }: { items: ServiceProps[] }) => {
  const buttonsRef = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    buttonsRef.current.forEach((btn) => {
      const li = btn.closest('.accordion-li') as HTMLElement;
      if (li) {
        li.style.setProperty('--width', `${btn.offsetWidth}px`);
      }
    });

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
              }}
              onClick={() => setActiveIndex(index)}
            >
                <div className="accordion-title-icon">
                    {item.icon && <span className="icon-main">{parser(item.icon)}</span>}
                    <h2 className="heading text-24 text-rotate">{item.title}</h2>
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
                  <Link href={`/services/${item.slug}`} className="button button--primary">
                    More Details
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
