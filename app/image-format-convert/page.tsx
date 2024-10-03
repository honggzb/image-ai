'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {useDropzone} from 'react-dropzone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';

const supportedFormats = ['jpg', 'png', 'webp', 'gif', 'pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 20;

interface ConvertedImage {
  dataUrl: string;
  fileName: string;
}

const ImageFormatConvert = () => {

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE).slice(0, MAX_FILES);
    if (validFiles.length < acceptedFiles.length) {
      setError(`${MAX_FILES} files exceed 10MB or the number of files, filtered automatically`);
    }
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': supportedFormats.filter(format => format !== 'pdf').map(format => `.${format}`),
      'application/pdf': ['.pdf']
    },
    maxSize: MAX_FILE_SIZE
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  }

  const handleConvert = async () => {
    if (files.length === 0 || !selectedFormat) return;
    setLoading(true);
    try {
      const converted = await Promise.all(
        files.map(file => convertImage(file, selectedFormat))
      );
      setConvertedImages(converted);
      setSuccess(true);
    } catch (err) {
      setError('转换失败，请重试。');
    } finally {
      setLoading(false);
    }
  }

  const convertImage = async (file: File, format: string): Promise<ConvertedImage> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Conversion failed');
    }

    const blob = await response.blob();
    const dataUrl = URL.createObjectURL(blob);
    const fileName = `${file.name.split('.')[0]}_converted.${format}`;
    return { dataUrl, fileName };
  }

  const handleDownload = async () => {
    if (convertedImages.length === 1) {
      const link = document.createElement('a');
      link.href = convertedImages[0].dataUrl;
      link.download = convertedImages[0].fileName;
      link.click();
    } else {
      const zip = new JSZip();
      convertedImages.forEach(({ dataUrl, fileName }) => {
        zip.file(fileName, fetch(dataUrl).then(res => res.blob()));
      });
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content, 'converted_images.zip');
    }
    setSuccess(true);
  }

  return (
    <div className='flex flex-col justify-center gap-6 mt-10 p-6'>

      <h1 className='text-4xl font-bold text-left'>Image Format Convert</h1>
      <div className='flex flex-row justify-center bg-gray-100 border rounded-md'>
          <Image src="/format-convert.svg" alt='Text format convert' width={100} height={100} />
          <p className='text-gray-700 p-10 align-middle'>Easily convert images into various formats, supporting JPG, PNG, WEBP, GIF, etc. to meet the needs of different scenarios.</p>
      </div>

      <section
        {...getRootProps()}
        className="border-dashed border-[#3498db] border-2 cursor-pointer text-center hover:bg-[#e8f4fd] gap-5 p-10"
        style={{ backgroundColor: isDragActive ? '#e8f4fd' : '#f7f9fa' }}>
        <input {...getInputProps()} />
        <p className='text-gray-700 text-xl'>
          {isDragActive ? 'Release the file for upload' : `Drag and drop files here, or click to select files(Up to ${MAX_FILES})`}
        </p>
        <Button variant="secondary" className='mt-2 bg-[#3498db] hover:bg-[#2980b9] p-2 w-[150px]'>
            Choose files
        </Button>
      </section>

      {files.length > 0 && (
        <div className='p-2 grid grid-cols-2'>
          <div className='p-2'>
            <p className='font-bold'>Original Image</p>
            <div className='flex flex-row w-full'>
              { previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Original ${index + 1}`}
                  onClick={() => handleImageClick(url)}
                  className='w-[100px] h-[100px] object-cover cursor-pointer' />
              ))}
            </div>
          </div>
          <div className='p-2'>
            <p className='font-bold'>Converted Image</p>
              {convertedImages.length > 0 ? (
              <div className='flex flex-row'>
                  { convertedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.dataUrl}
                      alt={`Converted ${index + 1}`}
                      onClick={() => handleImageClick(img.dataUrl)}
                      className='w-[100px] h-[100px] object-cover cursor-pointer' />
                  ))}
                </div>
                ) : (
                <p>The converted image will be displayed here.</p>
              )}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className='p-2'>
          <p className='font-bold'>Select the conversion format</p>
          <div className='flex flex-row justify-start'>
            {supportedFormats.map((format) => (
              <Button
                className='h-[48px] w-[100px] m-2 shadow-md'
                style={{
                  backgroundColor: selectedFormat === format ? '#3498db' : 'transparent',
                  color: selectedFormat === format ? 'white' : '#3498db',
                }}
                onClick={() => setSelectedFormat(format)}>
                  {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className='flex flex-row justify-center gap-5'>
        {files.length > 0 && selectedFormat && !loading && (
          <Button
            className='bg-[#2ecc71] hover:bg-[#27ae60] p-4 w-[150px]'
            onClick={handleConvert}>
              Batch Convert
          </Button>
        )}
        {convertedImages.length > 0 && (
          <Button
            className='bg-[#3498db] hover:bg-[#2980b9] p-4 w-[150px]'
            onClick={handleDownload}>
              {convertedImages.length === 1 ? 'Download Image' : 'Download Zip'}
          </Button>
        )}
      </div>
      {loading && <LoadingSpinner />}
    </div>
  )
}

export default ImageFormatConvert