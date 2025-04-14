
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
    const { audioUrl } = await req.json()

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
      throw new Error(`AssemblyAI API error: ${response.statusText}`)
    }

    const transcription = await response.json()

    // Poll for transcription completion
    let result
    while (true) {
      const pollResponse = await fetch(
        `${ASSEMBLY_AI_API_URL}/transcript/${transcription.id}`,
        {
          headers: {
            'Authorization': ASSEMBLY_AI_API_KEY,
          },
        }
      )

      result = await pollResponse.json()

      if (result.status === 'completed' || result.status === 'error') {
        break
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if (result.status === 'error') {
      throw new Error('Transcription failed')
    }

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Transcription error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
