import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt:", prompt);
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    console.log("Generating image for prompt:", prompt.substring(0, 100) + "...");

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Generate image using Gemini (matching the documentation pattern)
    console.log("Calling Gemini API with model: gemini-2.5-flash-image");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    console.log("Gemini response received");

    // Check if we have candidates
    if (!response.candidates || response.candidates.length === 0) {
      console.error("No candidates in Gemini response");
      return NextResponse.json(
        { error: "No candidates in response from Gemini API" },
        { status: 500 }
      );
    }

    // Extract image data from response (following documentation pattern)
    let imageData: string | null = null;
    const parts = response.candidates[0]?.content?.parts;
    
    if (!parts || parts.length === 0) {
      console.error("No parts in response");
      return NextResponse.json(
        { error: "No content parts in response" },
        { status: 500 }
      );
    }
    
    for (const part of parts) {
      if (part.text) {
        console.log("Text part:", part.text);
      } else if (part.inlineData?.data) {
        imageData = part.inlineData.data;
        console.log("Found image data, size:", imageData?.length || 0);
        break;
      }
    }

    if (!imageData) {
      console.error("No image data found in response parts");
      return NextResponse.json(
        { error: "No image generated - model returned no image data" },
        { status: 500 }
      );
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(imageData, "base64");
    console.log("Image buffer created, size:", buffer.length);

    // Return the image as a response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Check if it's a quota error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isQuotaError = errorMessage.includes("quota") || errorMessage.includes("429");
    
    if (isQuotaError) {
      return NextResponse.json(
        {
          error: "API quota exceeded",
          details: "You've reached the free tier limit for Gemini API. Please wait a minute or upgrade your plan.",
          isQuotaError: true,
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 }
    );
  }
}
