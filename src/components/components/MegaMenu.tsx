'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { MegaMenu as MegaMenuType } from './headerData';

type MegaMenuProps = {
  data: MegaMenuType;
  isOpen: boolean;
};

const MegaMenu: React.FC<MegaMenuProps> = ({ data, isOpen }) => {
  // Use narrower width when only 1 section
  const isSingleSection = data.sections.length === 1;
  const menuWidth = isSingleSection ? 'w-[480px]' : 'w-[720px]';

  return (
    <div
      className={[
        `absolute left-1/2 top-full z-40 mt-4 ${menuWidth} -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl`,
        isOpen ? 'visible opacity-100' : 'invisible opacity-0',
        'transition-opacity',
        "before:content-[''] before:absolute before:-top-4 before:left-0 before:h-4 before:w-full",
      ].join(' ')}
      role="menu"
    >
      <div className={`grid ${isSingleSection ? 'grid-cols-2' : 'grid-cols-3'} gap-6`}>
        <div className={isSingleSection ? '' : 'col-span-2 grid grid-cols-2 gap-6'}>
          {data.sections.map((section) => (
            <div key={section.heading}>
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">{section.heading}</p>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href || '#'}
                      className="group/link flex items-center justify-between rounded px-2 py-1.5 text-[14px] text-gray-800 hover:bg-gray-50"
                    >
                      <span>{link.label}</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {data.image && (
          <Link href={data.image.href || '#'} className="group relative overflow-hidden rounded-lg">
            <Image
              src={data.image.src}
              alt={data.image.alt}
              width={320}
              height={160}
              className="h-40 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 backdrop-blur">
              {data.image.caption || 'Explore'}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
