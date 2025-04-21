
// Main edge function entry

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

import { uploadAudioToAssemblyAI } from "./uploadAudio.ts";
import { pollAssemblyAITranscript } from "./pollTranscription.ts";

const ASSEMBLY_AI_API_KEY = Deno.env.get("ASSEMBLY_AI_API_KEY");
const ASSEMBLY_AI_API_URL = "https://api.assemblyai.com/v2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqBody = await req.json();
    const { audioUrl, audioBase64, fileName, isDemo, fileType, fileExt } =
      reqBody;
    const logPrefix = `[Transcribe Function] ${isDemo ? "DEMO" : "REGULAR"}`;
    console.log(
      `${logPrefix} Received request: fileName=${fileName || "N/A"}, fileType=${
        fileType || "N/A"
      }, fileExt=${fileExt || "N/A"}`
    );

    if (!ASSEMBLY_AI_API_KEY) {
      throw new Error("AssemblyAI API key not found");
    }

    let transcriptionUrl: string;

    if (!isDemo) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("User is not authenticated");
      }
    }

    try {
      transcriptionUrl = await uploadAudioToAssemblyAI({
        isDemo,
        audioBase64,
        audioUrl,
        fileName,
        fileType,
        fileExt,
        ASSEMBLY_AI_API_KEY,
        ASSEMBLY_AI_API_URL,
        logPrefix,
      });
    } catch (uploadError: any) {
      console.error(`${logPrefix} Error uploading audio:`, uploadError);
      return new Response(
        JSON.stringify({
          error: `Upload failed: ${uploadError.message || "Unknown upload error"}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Start transcription
    try {
      console.log(
        `${logPrefix} Starting transcription with URL: ${transcriptionUrl}`
      );
      const response = await fetch(`${ASSEMBLY_AI_API_URL}/transcript`, {
        method: "POST",
        headers: {
          Authorization: ASSEMBLY_AI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: transcriptionUrl,
          language_code: "en",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(
          JSON.stringify({
            error: `AssemblyAI API error: ${errorText || response.statusText}`,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const transcription = await response.json();
      console.log(`${logPrefix} Transcription job created:`, transcription.id);

      try {
        const text = await pollAssemblyAITranscript({
          ASSEMBLY_AI_API_KEY,
          ASSEMBLY_AI_API_URL,
          transcriptionId: transcription.id,
          logPrefix,
        });
        console.log(
          `${logPrefix} Transcription completed successfully:`,
          text.substring(0, 100) + "..."
        );
        return new Response(
          JSON.stringify({ text }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (pollError: any) {
        return new Response(
          JSON.stringify({
            error: pollError.message || "Error polling transcription results",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } catch (transcriptionError: any) {
      return new Response(
        JSON.stringify({
          error:
            transcriptionError.message ||
            "Transcription process error: Unknown transcription error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || "An unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
