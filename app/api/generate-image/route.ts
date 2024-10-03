import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

async function makeRequest(prompt: string, retries = 3) {
  try {
    const client = new OpenAI();
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024"
    });
    return response?.data[0].url;
  } catch (error) {
    console.error('Image generation error:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log("prompt: ", prompt);
    const generatedImages = await makeRequest(prompt);
    return NextResponse.json({ images: generatedImages });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Image generation failed: ' + (error as Error).message }, { status: 500 });
  }
}