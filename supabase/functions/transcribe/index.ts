
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const ASSEMBLY_AI_API_KEY = Deno.env.get('ASSEMBLY_AI_API_KEY')
const ASSEMBLY_AI_API_URL = 'https://api.assemblyai.com/v2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const reqBody = await req.json();
    const { audioUrl, audioBase64, fileName, isDemo } = reqBody;
    
    if (!ASSEMBLY_AI_API_KEY) {
      console.error('AssemblyAI API key is not configured');
      throw new Error('AssemblyAI API key not found');
    }
    
    let transcriptionUrl: string;
    
    // For demo requests, we don't need authentication
    if (!isDemo) {
      // Check authorization for non-demo transcriptions
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        console.error('Missing Authorization header');
        throw new Error('User is not authenticated');
      }
    }

    if (isDemo && audioBase64) {
      console.log(`Processing demo transcription for file: ${fileName || 'unknown'}, size: ${
        audioBase64 ? (audioBase64.length * 0.75) / 1024 : 'unknown'
      } KB`);
      
      try {
        // Create a temporary URL by uploading the base64 directly to AssemblyAI
        const uploadResponse = await fetch(`${ASSEMBLY_AI_API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': ASSEMBLY_AI_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data_url: `data:audio/${fileName?.split('.').pop() || 'wav'};base64,${audioBase64}`
          }),
        });
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`AssemblyAI upload error: ${uploadResponse.status} ${uploadResponse.statusText}`, errorText);
          throw new Error(`Failed to upload audio data: ${errorText || uploadResponse.statusText}`);
        }
        
        const uploadData = await uploadResponse.json();
        transcriptionUrl = uploadData.upload_url;
        console.log('Audio uploaded directly to AssemblyAI, URL:', transcriptionUrl);
      } catch (uploadError) {
        console.error('Error uploading audio to AssemblyAI:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error during upload'}`);
      }
    } else if (audioUrl) {
      console.log(`Starting AssemblyAI transcription for: ${audioUrl}`);
      transcriptionUrl = audioUrl;
    } else {
      console.error('Missing audioUrl or audioBase64 in request body');
      throw new Error('Audio data is required (URL or base64)');
    }

    // Start transcription
    try {
      const response = await fetch(`${ASSEMBLY_AI_API_URL}/transcript`, {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: transcriptionUrl,
          language_code: 'en',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AssemblyAI API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`AssemblyAI API error: ${errorText || response.statusText}`);
      }

      const transcription = await response.json();
      console.log('Transcription job created:', transcription.id);

      // Poll for transcription completion
      let result;
      let attempts = 0;
      const maxAttempts = 30; // Prevent infinite loops
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Polling for transcription result, attempt ${attempts}/${maxAttempts}`);
        
        const pollResponse = await fetch(
          `${ASSEMBLY_AI_API_URL}/transcript/${transcription.id}`,
          {
            headers: {
              'Authorization': ASSEMBLY_AI_API_KEY,
            },
          }
        );

        if (!pollResponse.ok) {
          const errorText = await pollResponse.text();
          console.error(`Polling error: ${pollResponse.status} ${pollResponse.statusText}`, errorText);
          throw new Error(`Failed to poll for transcription status: ${errorText || pollResponse.statusText}`);
        }

        result = await pollResponse.json();
        console.log('Current transcription status:', result.status);

        if (result.status === 'completed' || result.status === 'error') {
          break;
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (attempts >= maxAttempts) {
        console.error('Transcription polling timeout');
        throw new Error('Transcription timed out');
      }

      if (result.status === 'error') {
        console.error('Transcription failed with status error:', result);
        throw new Error('Transcription failed: ' + (result.error || 'Unknown error'));
      }

      console.log('Transcription completed successfully');
      
      return new Response(
        JSON.stringify({ text: result.text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (transcriptionError) {
      console.error('Error during transcription process:', transcriptionError);
      throw new Error(`Transcription process error: ${transcriptionError.message || 'Unknown transcription error'}`);
    }
  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unknown error occurred',
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})
