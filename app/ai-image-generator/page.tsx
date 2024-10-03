'use client';

import React, { useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';

const AiImageGeneratorPage = () => {

  const [userDescription, setUserDescription] = useState('');
  const [generatedImages, setGeneratedImages] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setProgress(0);

    try {
      setProgress(10);
      // const promptResponse = await axios.post('/api/generate-prompt', {
      //   userDescription
      // });
      // const optimizedPrompt = promptResponse.data.prompt;
      // setProgress(66);
      const imageResponse = await axios.post('/api/generate-image', {
        prompt: userDescription,
      });
      //console.log(imageResponse.data.images);
      setGeneratedImages(imageResponse.data.images);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 504) {
          setError('The server response timed out, please try again later or try to simplify your description.');
        } else {
          setError(`Image generation failed (Error Code: ${error.response.status})，please try again later.`);
        }
      } else {
        setError('An unknown error occurred during image generation. Please try again later.');
      }
      console.error('Error generating image:', error);
    } finally {
      setProgress(100);
      setIsLoading(false);
    }

  }

  const handleDownload = () => {
    window.open(generatedImages, '_blank');
    window.focus();
  }

  // const handleDownload = () => {
  //   const link = document.createElement('a');
  //   link.href = generatedImages.toString();
  //   link.download = `generated-image-${new Date().getMilliseconds()}.png`;
  //   //document.body.appendChild(link);
  //   link.click();
  //   //document.body.removeChild(link);
  // }

  return (
    <>
      <div className='flex flex-col justify-center gap-6 mt-10 p-6'>
        <h1 className='text-4xl font-bold text-left'>Image Generator</h1>
        <div className='flex flex-row justify-center bg-gray-100 border rounded-md'>
          <Image src="/ai-image-generator.svg" alt='AI image generator' width={100} height={100} />
          <p className='text-gray-700 p-10 align-middle'>Generate unique AI images through text descriptions to inspire creative inspiration and are suitable for various creative scenarios.</p>
        </div>
        <form>
          <Textarea placeholder="Describe the image you want here." className='h-[100px] dark:bg-gray-200 dark:text-gray-800'
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)} />
          <Button className="w-[200px] bg-[#0261f9] hover:bg-[#3d83f4] dark:text-gray-100 mt-2"
            onClick={handleSubmit}>
              {isLoading ? 'Generating...' : 'Generate Image'}
          </Button>
        </form>
        {/* {isLoading && (
          <Progress value={progress} className="w-[95%] m-2 align-middle" />
        )} */}
        {isLoading && <LoadingSpinner />}
        {error && <p className='text-red-500'>{error}</p>}
        { generatedImages !== '' && (
            <>
            <p className='font-bold'>Generated image</p>
            <img src={generatedImages} alt="Generated Image" className='w-[100%] border-4 border-radius-lg shadow-lg mb-5' />
            <Button className="w-[200px] bg-[#0261f9] hover:bg-[#3d83f4] dark:text-gray-100"
              onClick={handleDownload}>Download Image</Button>
            </>
          )}
      </div>
    </>
  )
}

export default AiImageGeneratorPage