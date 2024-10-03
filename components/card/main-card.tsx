import React from 'react';
import Link from "next/link";
import Image from 'next/image';

interface MainCardProps {
  name: string;
  description: string;
  href: string;
  icon: string;
  tag: string;
}


const MainCard = ({ name, description, href, icon, tag }: MainCardProps) => {
  return (
    <Link href={href}>
      <div className="flex flex-col min-h-[300px] items-center p-2 border rounded bg-opacity-80 border-gray-400 shadow-lg transition-transform transform hover:translate-y-1 hover:shadow-2xl">
        <Image src={icon} alt={tag} width={64} height={64} />
        <h3 className="text-lg font-semibold mb-2 pt-5">{name}</h3>
        <p className="mb-2 text-center">{description}</p>
      </div>
    </Link>
  )
}

export default MainCard