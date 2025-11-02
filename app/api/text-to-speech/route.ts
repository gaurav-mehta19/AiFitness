import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // Default voice
    const MAX_CHARACTERS = 5000; // ElevenLabs has a character limit

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    // Truncate text if it's too long
    if (text.length > MAX_CHARACTERS) {
      console.log(`Text too long (${text.length} chars), truncating to ${MAX_CHARACTERS} chars`);
      text = text.substring(0, MAX_CHARACTERS) + "... The plan continues. Please refer to the written version for complete details.";
    }

    // Remove markdown symbols for better text-to-speech
    const cleanText = text
      .replace(/#{1,6}\s/g, "") // Remove markdown headers
      .replace(/\*\*/g, "") // Remove bold markers
      .replace(/\*/g, "") // Remove italic markers
      .replace(/`{1,3}/g, "") // Remove code markers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Convert links to just text
      .replace(/[-•]/g, "") // Remove bullet points
      .replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines
      .trim();

    // Call ElevenLabs API directly
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      return NextResponse.json(
        { 
          error: "Failed to generate speech from ElevenLabs API",
          details: errorText 
        },
        { status: response.status }
      );
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer();

    // Return the audio as a response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return NextResponse.json(
      {
        error: "Failed to generate speech",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
