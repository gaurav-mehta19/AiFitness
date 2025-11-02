import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    const { prompt } = body;

    // Validate that prompt exists
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    // Generate content using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Log the result
    // console.log("Gemini Response:", response.text);

    // Return the generated text
    return NextResponse.json({
      success: true,
      text: response.text,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}