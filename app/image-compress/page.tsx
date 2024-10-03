"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Input } from '@/components/ui/input';

interface CompressedImage {
  dataUrl: string;
  fileName: string;
}

const ImageCompress = () => {

  const [files, setFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const onSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files).slice(0, 20);
      setFiles(selectedFiles);
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  }

  const handleCompress = async () => {
    setLoading(true);
    try {
      const compressed = await Promise.all(
        files.map(file => compressImage(file, quality))
      );
      setCompressedImages(compressed);
      setSuccess(true);
    } catch (err) {
      setError("An error occurred during compression");
    } finally {
      setLoading(false);
    }
  }

  const compressImage = (file: File, quality: number): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          const fileName = `${file.name.split('.')[0]}_compressed.jpg`;
          resolve({ dataUrl, fileName });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  const handleDownload = async () => {
    if (compressedImages.length === 1) {
      const link = document.createElement('a');
      link.href = compressedImages[0].dataUrl;
      link.download = compressedImages[0].fileName;
      link.click();
    } else {
      // 打包多个图片
      const zip = new JSZip();
      compressedImages.forEach(({ dataUrl, fileName }) => {
        const base64Data = dataUrl.split(',')[1];
        zip.file(fileName, base64Data, {base64: true});
      });
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content, 'compressed_images.zip');
    }
    setSuccess(true);
  }

  return (
    <div className='flex flex-col justify-center gap-6 mt-10 p-6'>

      <h1 className='text-4xl font-bold text-left'>Image Compression</h1>
      <div className='flex flex-row justify-center bg-gray-100 border rounded-md'>
          <Image src="/compress.svg" alt='Text card generator' width={100} height={100} />
          <p className='text-gray-700 p-10 align-middle'>Efficiently compress image file size, optimize loading speed while maintaining image quality, and improve website performance.</p>
      </div>
      <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={onSelectFiles}
          placeholder="20 maximum"
          multiple
          className='file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100 file:border file:border-solid file:border-blue-800 file:rounded-md border-blue-600 w-[300px]'
        />

        {files.length > 0 && (
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <p>Original image preview</p>
              <div className="flex flex-row flex-wrap gap-2">
                {previewUrls.map((url, index) => (
                  <img className='w-[100px] h-[100px] object-cover cursor-pointer'
                    key={index}
                    src={url}
                    alt={`Original ${index + 1}`}
                    onClick={() => handleImageClick(url)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p>Preview after compression</p>
                {compressedImages.length > 0 ? (
                  <div className="flex flex-row flex-wrap gap-2">
                    {compressedImages.map((img, index) => (
                      <img className='w-[100px] h-[100px] object-cover cursor-pointer'
                        key={index}
                        src={img.dataUrl}
                        alt={`Compressed ${index + 1}`}
                        onClick={() => handleImageClick(img.dataUrl)}
                      />
                    ))}
                    </div>
                  ) : (
                  <p>The compressed image will be displayed here</p>
                )}
            </div>
          </div>
        )}
      {files.length > 0 && (
        <div className='flex flex-row gap-2 p-2'>
          <Button className='bg-[#2ecc71] hover:bg-[#27ae60] p-2'
            onClick={handleCompress}
            disabled={files.length === 0}>
              Batch Compress
          </Button>
          <Button className='bg-[#3498db] hover:bg-[#2980b9] p-2' onClick={handleDownload}>{compressedImages.length === 1 ? 'Download Image' : 'Download zip'}</Button>
        </div>
      )}
    </div>
  )
}

export default ImageCompress