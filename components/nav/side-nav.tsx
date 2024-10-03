'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IdCard, PenTool, Scaling, PackageCheck } from 'lucide-react';

const SideNav = () => {

  const path = usePathname();
  const menu = [
    {
      name: 'AI Images Generator',
      icon: '/ai-image-generator.svg',
      alt: 'AI Image Generator',
      path: '/ai-image-generator'
    },
    {
      name: 'Card Generator',
      icon: '/text-card-generator.svg',
      alt: 'Text Card Generator',
      path: '/text-card-generator'
    },
    {
      name: 'Image compression',
      icon: '/compress.svg',
      alt: 'Image Compression',
      path: '/image-compress'
    },
    {
      name: 'Image resize',
      icon: '/resize.svg',
      alt: 'Image Resize',
      path: '/image-resize'
    },
    {
      name: 'Format conversion',
      icon: '/format-convert.svg',
      alt: 'Image Format Conversion',
      path: '/image-format-convert'
    },
    {
      name: 'SVG Editor',
      icon: '/svg-generator.svg',
      alt: 'SVG Editor',
      path: '/svg-generator'
    },
    {
      name: 'Logo Design',
      icon: '/ai-logo-design.svg',
      alt: 'AI Logo Design',
      path: '/ai-logo-design'
    },
  ]

  return (
    <div className='flex flex-col h-full'>
      <ul className='flex-1 spac-y-2'>
      {menu.map((item, i) => (
          <li key={i}
            className={`${path === item.path ? 'border-black text-primary dark:border-primary dark:text-white' : 'hover:border-black dark:hover:border-primary'} flex m-2 mr-2 p-2 rounded-lg cursor-pointer border`}>
            <div className='flex justify-start w-full'>
              <Link href={item.path} className='flex'>
              <Image src={item.icon} alt={item.alt} width={24} height={24} />
                <span className='ml-2 hidden md:inline'>{item.name}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SideNav