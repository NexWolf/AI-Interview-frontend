import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export const runtime = "nodejs";

function sanitizeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resolveVoice(text: string, requestedVoice?: string | null): string {
  if (requestedVoice && requestedVoice.trim()) {
    return requestedVoice.trim();
  }

  // Detect Arabic characters
  const isArabic = /[\u0600-\u06FF]/.test(text);
  if (isArabic) {
    // High quality natural Arabic female voice (Salma) or Zariyah
    return "ar-EG-SalmaNeural";
  }

  // Default English female voice
  return "en-US-JennyNeural";
}

async function synthesizeSpeech(text: string, voiceName: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const sanitized = sanitizeText(text);
  const { audioStream } = tts.toStream(sanitized);

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
    audioStream.on("end", () => resolve(Buffer.concat(chunks)));
    audioStream.on("error", (err: unknown) => reject(err));
  });
}

// GET /api/tts?text=...&voice=...
// Streams raw audio/mpeg directly for <audio> elements or Audio() constructor
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");
    const voiceParam = searchParams.get("voice");

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text query parameter is required." },
        { status: 400 }
      );
    }

    const selectedVoice = resolveVoice(text, voiceParam);
    const buffer = await synthesizeSpeech(text, selectedVoice);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error: any) {
    console.error("[TTS Route Error]:", error);
    return NextResponse.json(
      { error: "Failed to synthesize speech.", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// POST /api/tts
// Body: { text: string, voice?: string }
// Returns: { success: true, audioBase64: string, mimeType: "audio/mp3", voice: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = body?.text;
    const voiceParam = body?.voice;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text field is required in request body." },
        { status: 400 }
      );
    }

    const selectedVoice = resolveVoice(text, voiceParam);
    const buffer = await synthesizeSpeech(text, selectedVoice);

    return NextResponse.json({
      success: true,
      audioBase64: buffer.toString("base64"),
      mimeType: "audio/mp3",
      voice: selectedVoice,
    });
  } catch (error: any) {
    console.error("[TTS Route Error]:", error);
    return NextResponse.json(
      { error: "Failed to synthesize speech.", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
