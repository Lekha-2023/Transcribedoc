
export async function pollAssemblyAITranscript({
  ASSEMBLY_AI_API_KEY,
  ASSEMBLY_AI_API_URL,
  transcriptionId,
  logPrefix,
}) {
  let result;
  let attempts = 0;
  const maxAttempts = 30;
  while (attempts < maxAttempts) {
    attempts++;
    console.log(
      `${logPrefix} Polling for transcription result, attempt ${attempts}/${maxAttempts}`
    );

    const pollResponse = await fetch(
      `${ASSEMBLY_AI_API_URL}/transcript/${transcriptionId}`,
      {
        headers: {
          Authorization: ASSEMBLY_AI_API_KEY,
        },
      }
    );

    if (!pollResponse.ok) {
      const errorText = await pollResponse.text();
      throw new Error(
        `Failed to poll for transcription status: ${errorText || pollResponse.statusText}`
      );
    }
    result = await pollResponse.json();
    console.log(`${logPrefix} Current transcription status:`, result.status);

    if (result.status === "completed" || result.status === "error") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (attempts >= maxAttempts) throw new Error("Transcription timed out");
  if (result.status === "error")
    throw new Error("Transcription failed: " + (result.error || "Unknown error"));
  return result.text;
}
