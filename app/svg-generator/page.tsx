'use client';

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from '@/components/LoadingSpinner';

const SvgGenerator = () => {

  const [svgCode, setSvgCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const defaultSvg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="compressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect x="40" y="40" width="120" height="120" fill="url(#compressGrad)" rx="10">
          <animate attributeName="height" values="120;80;120" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y" values="40;60;40" dur="3s" repeatCount="indefinite" />
          <animate attributeName="width" values="120;100;120" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x" values="40;50;40" dur="3s" repeatCount="indefinite" />
        </rect>
        <path d="M60 100 L140 100" stroke="#ecf0f1" stroke-width="4" stroke-linecap="round">
          <animate attributeName="d" values="M60 100 L140 100;M70 100 L130 100;M60 100 L140 100" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M70 60 L130 60 M70 140 L130 140" stroke="#34495e" stroke-width="4" stroke-linecap="round">
          <animate attributeName="d" values="M70 60 L130 60 M70 140 L130 140;M80 80 L120 80 M80 120 L120 120;M70 60 L130 60 M70 140 L130 140" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
    `;
    setSvgCode(defaultSvg);
    setPreviewUrl(URL.createObjectURL(new Blob([defaultSvg], { type: 'image/svg+xml' })));
  }, []);

  const handleSvgCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value)
    setSvgCode(e.target.value);
  }

  const handlePreview = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    setPreviewUrl(URL.createObjectURL(blob));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSvgCode(content)
      };
      reader.readAsText(file);
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click();
  }

  const downloadBlob = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const getSvgSize = (svgCode: string): { width: number; height: number } => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    let width = parseInt(svgElement.getAttribute('width') || '0');
    let height = parseInt(svgElement.getAttribute('height') || '0');
    if (width === 0 || height === 0) {
      const viewBox = svgElement.getAttribute('viewBox');
      if (viewBox) {
        const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
        width = vbWidth;
        height = vbHeight;
      }
    }
    return { width: width || 1024, height: height || 1024 };
  };

  const handleDownload = async (format: string) => {
    setLoading(true);
    try {
      if (format === 'svg') {
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        downloadBlob(blob, `image.${format}`);
      } else {
        const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        const img = new window.Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image loading failed'));
          img.src = url;
        });

        const canvas = document.createElement('canvas');
        const svgSize = getSvgSize(svgCode);
        canvas.width = svgSize.width * scaleFactor;
        canvas.height = svgSize.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scaleFactor, scaleFactor);
          ctx.drawImage(img, 0, 0);
          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, `image/${format}`);
          });
          if (blob) {
            downloadBlob(blob, `image_${scaleFactor}x.${format}`);
          } else {
            throw new Error('Failed to create blob');
          }
        } else {
          throw new Error('Failed to get canvas context');
        }
        URL.revokeObjectURL(url);
      }
      setSuccess(true);
    } catch (err) {
      console.error('Download error:', err);
      setError('Download failed, please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col justify-center gap-6 mt-10 p-6 mb-10'>

      <h1 className='text-4xl font-bold text-left'>SVG Generator</h1>
      <div className='flex flex-row justify-center bg-gray-100 border rounded-md'>
          <Image src="/svg-generator.svg" alt='Text format convert' width={100} height={100} />
          <p className='text-gray-700 p-10 align-middle'>Create and edit SVG graphics online, easily design scalable vector images for a variety of design needs.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Textarea
            value={svgCode}
            placeholder="Input or paste SVG code here"
            className='h-[250px]'
            onChange={handleSvgCodeChange} />
        </div>
        <div className='flex flex-col sm:flex-col items-center p-4 mb-2'>
          <p className='font-bold'>Preview</p>
          {previewUrl ? (
            <div className='relative h-[200px] w-[200px]'>
              <Image src={previewUrl}
                alt="SVG Preview"
                layout="fill"
                objectFit="contain" />
            </div>
            ) : (
              <p>The SVG preview will be displayed here</p>
          )}
          {loading && <LoadingSpinner />}
        </div>
      </div>

      <div className='flex flex-row gap-2 p-2'>
        <Button className='bg-[#3498db] hover:bg-[#2980b9] p-2 w-[100px]' onClick={handleUpload}>Upload SVG</Button>
        <Button className='bg-[#2ecc71] hover:bg-[#27ae60] p-2 w-[100px]' onClick={handlePreview}>Preview</Button>
        <input type="file" accept=".svg" style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange} />
      </div>

      {previewUrl && (
        <>
        <p className='font-bold'>Download amount Multiply</p>
        <div className='flex flex-row gap-2 p-2'>
          <Select defaultValue={"1"} onValueChange={(value) => setScaleFactor(Number(value))}>
              <SelectTrigger className='bg-white dark:text-black w-[180px]'>
                <SelectValue placeholder="Select a Multiply" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="4">4x</SelectItem>
                <SelectItem value="8">8x</SelectItem>
              </SelectContent>
          </Select>
          <Button className='bg-[#0261f9] hover:bg-[#1f6be6] p-2 w-[130px]' onClick={() => handleDownload('svg')}  >Download SVG</Button>
          <Button className='bg-[#0261f9] hover:bg-[#1f6be6] p-2 w-[130px]' onClick={() => handleDownload('png')} >Download PNG</Button>
          <Button className='bg-[#0261f9] hover:bg-[#1f6be6] p-2 w-[130px]' onClick={() => handleDownload('jpg')} >Download JPG</Button>
        </div>
        </>
      )}
      <div className='h-[100px]'> </div>
    </div>
  )
}

export default SvgGenerator