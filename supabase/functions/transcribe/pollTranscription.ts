
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

    // Check for error status
    if (result.status === "error") {
      const errorDetails = result.error || "Unknown transcription error";
      console.error(`${logPrefix} Transcription error:`, errorDetails);
      throw new Error(`Transcription failed: ${errorDetails}`);
    }

    // Check for completion
    if (result.status === "completed") {
      console.log(`${logPrefix} Transcription completed successfully`);
      break;
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  // Timeout check
  if (attempts >= maxAttempts) {
    console.error(`${logPrefix} Transcription timed out after ${maxAttempts} attempts`);
    throw new Error("Transcription timed out");
  }
  
  // Final error check
  if (result.status !== "completed") {
    console.error(`${logPrefix} Transcription failed with status: ${result.status}`);
    throw new Error(`Transcription failed with status: ${result.status}`);
  }
  
  return result.text;
}
