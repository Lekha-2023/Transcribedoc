
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
    const { audioUrl } = reqBody;
    
    if (!audioUrl) {
      console.error('Missing audioUrl in request body');
      throw new Error('Audio URL is required');
    }

    console.log(`Starting AssemblyAI transcription for: ${audioUrl}`);
    
    if (!ASSEMBLY_AI_API_KEY) {
      console.error('AssemblyAI API key is not configured');
      throw new Error('AssemblyAI API key not found');
    }

    // Start transcription
    const response = await fetch(`${ASSEMBLY_AI_API_URL}/transcript`, {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLY_AI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_code: 'en',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AssemblyAI API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`AssemblyAI API error: ${response.statusText}`);
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
      )

      if (!pollResponse.ok) {
        const errorText = await pollResponse.text();
        console.error(`Polling error: ${pollResponse.status} ${pollResponse.statusText}`, errorText);
        throw new Error('Failed to poll for transcription status');
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
    )

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
    )
  }
})
