
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
    const { audioUrl, audioBase64, fileName, isDemo, fileType, fileExt } = reqBody;
    
    const logPrefix = `[Transcribe Function] ${isDemo ? 'DEMO' : 'REGULAR'}`;
    console.log(`${logPrefix} Received request: fileName=${fileName || 'N/A'}, fileType=${fileType || 'N/A'}, fileExt=${fileExt || 'N/A'}`);
    
    if (!ASSEMBLY_AI_API_KEY) {
      console.error(`${logPrefix} AssemblyAI API key is not configured`);
      throw new Error('AssemblyAI API key not found');
    }
    
    let transcriptionUrl: string;
    
    // For demo requests, we don't need authentication
    if (!isDemo) {
      // Check authorization for non-demo transcriptions
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        console.error(`${logPrefix} Missing Authorization header`);
        throw new Error('User is not authenticated');
      }
    }

    // For demo with direct audio data (base64)
    if (isDemo && audioBase64) {
      console.log(`${logPrefix} Processing base64 data for file: ${fileName || 'unknown'}, size: ${
        audioBase64 ? Math.round((audioBase64.length * 0.75) / 1024) : 'unknown'
      } KB, type: ${fileType || 'unknown'}, ext: ${fileExt || 'unknown'}`);
      
      // Validate the audio data
      if (!audioBase64 || audioBase64.trim().length === 0) {
        throw new Error('Audio data is empty or invalid');
      }
      
      // Ensure the file type is valid
      const validAudioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
      if (!fileType || !validAudioTypes.includes(fileType)) {
        throw new Error(`Invalid file type: ${fileType || 'unknown'}`);
      }
      
      // Use provided extension or derive from fileType
      const ext = fileExt || (() => {
        if (fileType.includes('mp3') || fileType.includes('mpeg')) return 'mp3';
        if (fileType.includes('wav')) return 'wav';
        if (fileType.includes('ogg')) return 'ogg';
        if (fileType.includes('webm')) return 'webm';
        return 'mp3'; // default fallback
      })();
      
      console.log(`${logPrefix} Using file extension: ${ext}`);
      
      try {
        // Create a temporary URL by uploading the base64 directly to AssemblyAI
        console.log(`${logPrefix} Uploading audio to AssemblyAI...`);
        
        // Format the data URL properly
        const dataUrl = `data:${fileType};base64,${audioBase64}`;
        console.log(`${logPrefix} Data URL prefix: ${dataUrl.substring(0, 50)}...`);
        
        const uploadResponse = await fetch(`${ASSEMBLY_AI_API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': ASSEMBLY_AI_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data_url: dataUrl
          }),
        });
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`${logPrefix} AssemblyAI upload error: ${uploadResponse.status} ${uploadResponse.statusText}`, errorText);
          throw new Error(`Failed to upload audio data: ${errorText || uploadResponse.statusText}`);
        }
        
        const uploadData = await uploadResponse.json();
        transcriptionUrl = uploadData.upload_url;
        console.log(`${logPrefix} Audio uploaded successfully to AssemblyAI, URL:`, transcriptionUrl);
      } catch (uploadError) {
        console.error(`${logPrefix} Error uploading audio to AssemblyAI:`, uploadError);
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error during upload'}`);
      }
    } 
    // For URLs (from storage)
    else if (audioUrl) {
      console.log(`${logPrefix} Using provided audio URL: ${audioUrl}`);
      transcriptionUrl = audioUrl;
    } else {
      console.error(`${logPrefix} Missing audioUrl or audioBase64 in request body`);
      throw new Error('Audio data is required (URL or base64)');
    }

    // Start transcription
    try {
      console.log(`${logPrefix} Starting transcription with URL: ${transcriptionUrl}`);
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
        console.error(`${logPrefix} AssemblyAI API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`AssemblyAI API error: ${errorText || response.statusText}`);
      }

      const transcription = await response.json();
      console.log(`${logPrefix} Transcription job created:`, transcription.id);

      // Poll for transcription completion
      let result;
      let attempts = 0;
      const maxAttempts = 30; // Prevent infinite loops
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`${logPrefix} Polling for transcription result, attempt ${attempts}/${maxAttempts}`);
        
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
          console.error(`${logPrefix} Polling error: ${pollResponse.status} ${pollResponse.statusText}`, errorText);
          throw new Error(`Failed to poll for transcription status: ${errorText || pollResponse.statusText}`);
        }

        result = await pollResponse.json();
        console.log(`${logPrefix} Current transcription status:`, result.status);

        if (result.status === 'completed' || result.status === 'error') {
          break;
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (attempts >= maxAttempts) {
        console.error(`${logPrefix} Transcription polling timeout`);
        throw new Error('Transcription timed out');
      }

      if (result.status === 'error') {
        console.error(`${logPrefix} Transcription failed with status error:`, result);
        throw new Error('Transcription failed: ' + (result.error || 'Unknown error'));
      }

      console.log(`${logPrefix} Transcription completed successfully:`, result.text.substring(0, 100) + '...');
      
      return new Response(
        JSON.stringify({ text: result.text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (transcriptionError) {
      console.error(`${logPrefix} Error during transcription process:`, transcriptionError);
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
});
