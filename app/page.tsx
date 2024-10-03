import MainCard from "@/components/card/main-card";
import Dashboard from "@/components/dashboard";

export default function Home({ children}: Readonly<{children: React.ReactNode}>) {
  const tools = [
    {
      name: 'AI image generator',
      icon: '/ai-image-generator.svg',
      tag: 'AI image generator',
      href: '/ai-image-generator',
      description: 'Generate unique AI images through text descriptions to inspire creative inspiration and are suitable for various creative scenarios.'
    },
    {
      name: 'Text card generator',
      icon: '/text-card-generator.svg',
      tag: 'Text card generator',
      href: '/text-card-generator',
      description: 'Create beautiful text cards with custom fonts, colors, and backgrounds perfect for social media sharing and marketing.'
    },
    {
      name: 'Image Compress',
      icon: '/compress.svg',
      tag: 'Image Compress',
      href: '/image-compress',
      description: 'Efficiently compress image file size, optimize loading speed while maintaining image quality, and improve website performance'
    },
    {
      name: 'Image Resize',
      icon: '/resize.svg',
      tag: 'Image Resize',
      href: '/image-resize',
      description: 'Quickly adjust the image size to maintain the ratio or customize the size to adapt to various platform requirements'
    },
    {
      name: 'Image Format Convert',
      icon: '/format-convert.svg',
      tag: 'Image Format Convert',
      href: '/image-format-convert',
      description: 'Easily convert images into various formats, supporting JPG, PNG, WEBP, GIF, etc. to meet the needs of different scenarios'
    },
    {
      name: 'SVG Editor',
      icon: '/svg-generator.svg',
      tag: 'SVG Editor',
      href: '/svg-generator',
      description: 'Create and edit SVG graphics online, easily design scalable vector images for a variety of design needs'
    },
    {
      name: 'Simple Logo Design',
      icon: '/ai-logo-design.svg',
      tag: 'Simple Logo Design',
      href: '/ai-logo-design',
      description: 'Use AI technology to quickly generate simple and modern logo designs to create a unique identity for your brand'
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold">Image processing in one stop</h1><br />
      <h3 className="text-xl">Easily process your images and improve work efficiency</h3>
      <div className="grid lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-3 gap-4 my-10 mx-20">
        {tools.map((item,i) => (
        <MainCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
