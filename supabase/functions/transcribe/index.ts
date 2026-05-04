
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

    // Validate input
    if (!isDemo && !audioUrl) {
      throw new Error("Audio URL is required for non-demo transcriptions");
    }
    
    if (isDemo && !audioBase64) {
      throw new Error("Audio base64 data is required for demo transcriptions");
    }

    let transcriptionUrl;

    // Validate auth for non-demo path
    if (!isDemo) {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
      const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
      });
      if (!userResp.ok) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const userData = await userResp.json();
      const authedUserId = userData?.id;
      if (!authedUserId) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Ensure the audioUrl path belongs to the authenticated user
      const pathMatch = audioUrl?.match(/\/storage\/v1\/object\/(?:public\/|sign\/)?[^/]+\/([^/]+)\//);
      const folderUserId = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
      if (!folderUserId || folderUserId !== authedUserId) {
        return new Response(
          JSON.stringify({ error: "Forbidden: file does not belong to user" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
      
      console.log(`${logPrefix} Successfully got transcription URL: ${transcriptionUrl}`);
    } catch (uploadError) {
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
          "Authorization": ASSEMBLY_AI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: transcriptionUrl,
          language_code: "en",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`${logPrefix} AssemblyAI API error:`, errorText || response.statusText);
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
          text ? text.substring(0, 100) + "..." : "No text returned"
        );
        return new Response(
          JSON.stringify({ text }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (pollError) {
        console.error(`${logPrefix} Error polling for transcription:`, pollError.message);
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
    } catch (transcriptionError) {
      console.error(`${logPrefix} Transcription process error:`, transcriptionError.message);
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
  } catch (error) {
    console.error(`[Transcribe Function] General error:`, error.message);
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
