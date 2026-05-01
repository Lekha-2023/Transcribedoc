
export async function uploadAudioToAssemblyAI({
  isDemo,
  audioBase64,
  audioUrl,
  fileName,
  fileType,
  fileExt,
  ASSEMBLY_AI_API_KEY,
  ASSEMBLY_AI_API_URL,
  logPrefix,
}) {
  let transcriptionUrl = "";
  // For demo with direct audio data (base64)
  if (isDemo && audioBase64) {
    // Get content type from file information
    const { ext, contentType } = await import('./getContentType.ts').then(m =>
      m.getContentType(fileType, fileExt)
    );

    console.log(
      `${logPrefix} Processing base64 data for file: ${
        fileName || "unknown"
      }, size: ${
        audioBase64 ? Math.round((audioBase64.length * 0.75) / 1024) : "unknown"
      } KB, type: ${fileType || "unknown"}, ext: ${fileExt || "unknown"}`
    );

    if (!audioBase64 || audioBase64.trim().length === 0) {
      throw new Error("Audio data is empty or invalid");
    }
    console.log(`${logPrefix} Using file extension: ${ext}`);

    try {
      console.log(`${logPrefix} Uploading audio to AssemblyAI...`);

      // Decode base64 to binary using Deno-compatible method
      const binaryString = atob(audioBase64);
      const binaryData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
      }
      
      // Upload audio data to AssemblyAI
      const uploadResponse = await fetch(`${ASSEMBLY_AI_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: ASSEMBLY_AI_API_KEY,
          "Content-Type": contentType,
        },
        body: binaryData, // Send the binary Uint8Array directly
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(
          `${logPrefix} AssemblyAI upload error: ${uploadResponse.status} ${uploadResponse.statusText}`,
          errorText
        );
        throw new Error(`Failed to upload audio data: ${errorText || uploadResponse.statusText}`);
      }
      const uploadData = await uploadResponse.json();
      transcriptionUrl = uploadData.upload_url;

      if (!transcriptionUrl) {
        throw new Error("Failed to get upload URL from AssemblyAI");
      }
      console.log(
        `${logPrefix} Audio uploaded successfully to AssemblyAI, URL:`,
        transcriptionUrl
      );
    } catch (uploadError) {
      throw new Error(uploadError.message || "Unknown error during upload");
    }
  }
  // For URLs (from storage) - download via service role and upload bytes to AssemblyAI
  else if (audioUrl) {
    console.log(`${logPrefix} Fetching audio from storage URL: ${audioUrl}`);

    // Parse bucket + path from the URL (supports both /public/ and /sign/ style)
    const match = audioUrl.match(/\/storage\/v1\/object\/(?:public\/|sign\/)?([^/]+)\/(.+?)(?:\?|$)/);
    if (!match) {
      throw new Error(`Could not parse storage URL: ${audioUrl}`);
    }
    const bucket = match[1];
    const objectPath = decodeURIComponent(match[2]);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error("Supabase service credentials not configured");
    }

    const downloadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${objectPath}`;
    const fileResp = await fetch(downloadUrl, {
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
    });

    if (!fileResp.ok) {
      const errText = await fileResp.text();
      throw new Error(`Failed to download file from storage (${fileResp.status}): ${errText}`);
    }

    const audioBytes = new Uint8Array(await fileResp.arrayBuffer());
    const contentType = fileResp.headers.get("content-type") || "application/octet-stream";

    console.log(`${logPrefix} Uploading ${audioBytes.length} bytes to AssemblyAI (type: ${contentType})`);

    const uploadResponse = await fetch(`${ASSEMBLY_AI_API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLY_AI_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: audioBytes,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Failed to upload audio to AssemblyAI: ${errorText || uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();
    transcriptionUrl = uploadData.upload_url;
    if (!transcriptionUrl) {
      throw new Error("Failed to get upload URL from AssemblyAI");
    }
  } else {
    throw new Error("Audio data is required (URL or base64)");
  }
  return transcriptionUrl;
}
