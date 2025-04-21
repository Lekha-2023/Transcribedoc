
export function getContentType(fileType: string, fileExt: string | undefined) {
  // Default values
  let ext = "mp3";
  let contentType = "audio/mpeg";
  
  // Log the incoming parameters for debugging
  console.log(`getContentType called with fileType: "${fileType}", fileExt: "${fileExt}"`);
  
  // First check file type from the MIME type
  if (fileType) {
    if (fileType.includes("mp3") || fileType.includes("mpeg")) {
      ext = "mp3";
      contentType = "audio/mpeg";
      console.log("Detected MP3 audio from content type");
    } else if (fileType.includes("wav")) {
      ext = "wav";
      contentType = "audio/wav";
      console.log("Detected WAV audio from content type");
    } else if (fileType.includes("ogg")) {
      ext = "ogg";
      contentType = "audio/ogg";
      console.log("Detected OGG audio from content type");
    } else if (fileType.includes("webm")) {
      ext = "webm";
      contentType = "audio/webm";
      console.log("Detected WEBM audio from content type");
    } else {
      console.log(`Unrecognized file type: ${fileType}, falling back to extension check`);
    }
  } else {
    console.log("No file type provided, attempting to determine from extension");
  }
  
  // If we have a file extension provided, use it as a fallback or confirmation
  if (fileExt && ["mp3", "wav", "ogg", "webm"].includes(fileExt.toLowerCase())) {
    const lowerExt = fileExt.toLowerCase();
    ext = lowerExt;
    
    if (lowerExt === "wav") {
      contentType = "audio/wav";
    } else if (lowerExt === "ogg") {
      contentType = "audio/ogg";
    } else if (lowerExt === "webm") {
      contentType = "audio/webm";
    } else {
      contentType = "audio/mpeg";
    }
    
    console.log(`Using file extension to determine content type: ${ext} -> ${contentType}`);
  }
  
  console.log(`Final content type determination: ext=${ext}, contentType=${contentType}`);
  return { ext, contentType };
}
