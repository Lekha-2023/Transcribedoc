
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
    // getContentType is assumed to be imported at the top
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

      // FIXED: Use raw base64 content instead of data URL format
      // AssemblyAI expects base64 encoded content directly
      const uploadResponse = await fetch(`${ASSEMBLY_AI_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: ASSEMBLY_AI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Important fix: use raw_base64 for proper audio data encoding
          raw_base64: audioBase64,
          // Send content type explicitly for better audio format detection
          content_type: contentType,
        }),
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
    } catch (uploadError: any) {
      throw new Error(uploadError.message || "Unknown error during upload");
    }
  }
  // For URLs (from storage)
  else if (audioUrl) {
    console.log(`${logPrefix} Using provided audio URL: ${audioUrl}`);
    transcriptionUrl = audioUrl;
  } else {
    throw new Error("Audio data is required (URL or base64)");
  }
  return transcriptionUrl;
}
