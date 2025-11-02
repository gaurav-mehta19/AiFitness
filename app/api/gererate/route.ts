import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

    // Extract text from response
    let generatedText = "";
    
    if (response.candidates && response.candidates.length > 0) {
      const firstCandidate = response.candidates[0];
      if (firstCandidate?.content?.parts) {
        for (const part of firstCandidate.content.parts) {
          if (part.text) {
            generatedText += part.text;
          }
        }
      }
    }

    if (!generatedText) {
      console.error("No text generated in response");
      return NextResponse.json(
        { error: "No text generated in response" },
        { status: 500 }
      );
    }

    // Log the result
    console.log("Generated text length:", generatedText.length);

    // Return the generated text
    return NextResponse.json({
      success: true,
      text: generatedText,
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