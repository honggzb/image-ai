'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';


const ImageResize = () => {
  const [src, setSrc] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(1);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelectFile = (files: File[]) => {
    setResizedImageUrl(null);
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result as string);
        loadImage(reader.result as string);
      });
      reader.readAsDataURL(files[0]);
    }
  };

  const loadImage = (src: string) => {
    const img = new window.Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setOriginalAspectRatio(img.width / img.height);
    };
    img.src = src;
  };

  const handleResize = () => {
    if (src) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedImageUrl = canvas.toDataURL('image/png');
          setResizedImageUrl(resizedImageUrl);
        }
      };
      img.src = src;
    }
  };

  const handleDownload = () => {
    if (resizedImageUrl) {
      const link = document.createElement('a');
      link.download = 'resized_image.png';
      link.href = resizedImageUrl;
      link.click();
      setSuccess(true);
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    setHeight(newHeight);
    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * originalAspectRatio));
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setWidth(newWidth);
    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / originalAspectRatio));
    }
  };

  return (
    <div className='flex flex-col justify-center gap-6 mt-10 p-6'>

      <h1 className='text-4xl font-bold text-left'>Image Resize</h1>
      <div className='flex flex-row justify-center bg-gray-100 border rounded-md'>
          <Image src="/resize.svg" alt='Text card generator' width={100} height={100} />
          <p className='text-gray-700 p-10 align-middle'>Quickly adjust the image size to maintain the ratio or customize the size to adapt to various platform requirements.</p>
      </div>
      <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              onSelectFile(Array.from(files));
            }
          }}
          className='file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100 file:border file:border-solid file:border-blue-800 file:rounded-md border-blue-600 w-[300px]'
        />
      {src && (
        <div className='grid grid-cols-2 gap-2'>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Original image</p>
              <img src={src} className='max-w-[100%] h-[auto]' />
            </div>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Preview after compression</p>
                {resizedImageUrl ? (
                  <img className='max-w-[100%] h-[auto]' src={resizedImageUrl} alt='Resized' />
                  ) : (
                  <p>The resized image will be displayed here</p>
                )}
            </div>
        </div>
      )}

      {src && (
        <>
          <div className='flex flex-row gap-2 p-3'>
            <input type="number" value={width} onChange={handleWidthChange} className='w-[200px] h-[45px] border border-gray-300'/>
            <input type="number" value={height} onChange={handleHeightChange} className='w-[200px] h-[45px] border border-gray-300'/>
          </div>
          <div className='flex flex-row gap-2 p-2'>
            <input type="checkbox" checked={maintainAspectRatio} onChange={(e) => setMaintainAspectRatio(e.target.checked)} />
            <Label>Maintain aspect ratio</Label>
          </div>
        </>
      )}

    {src && (
      <div className='flex flex-row gap-2 p-2'>
          <Button className='bg-[#2ecc71] hover:bg-[#27ae60] p-2 w-[100px]' onClick={handleResize}>
              Resize
          </Button>
          {resizedImageUrl && (
            <Button className='bg-[#3498db] hover:bg-[#2980b9] p-2 w-[100px]' onClick={handleDownload}>Download</Button>
          )}
      </div>
    )}
    </div>
  )
}

export default ImageResize