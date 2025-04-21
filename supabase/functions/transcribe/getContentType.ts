
export function getContentType(fileType: string, fileExt: string | undefined) {
  let ext = "mp3";
  let contentType = "audio/mpeg";
  if (fileType) {
    if (fileType.includes("mp3") || fileType.includes("mpeg"))
      (ext = "mp3"), (contentType = "audio/mpeg");
    else if (fileType.includes("wav"))
      (ext = "wav"), (contentType = "audio/wav");
    else if (fileType.includes("ogg"))
      (ext = "ogg"), (contentType = "audio/ogg");
    else if (fileType.includes("webm"))
      (ext = "webm"), (contentType = "audio/webm");
  }
  if (
    fileExt &&
    ["mp3", "wav", "ogg", "webm"].includes(fileExt.toLowerCase())
  ) {
    ext = fileExt.toLowerCase();
    if (ext === "wav") contentType = "audio/wav";
    else if (ext === "ogg") contentType = "audio/ogg";
    else if (ext === "webm") contentType = "audio/webm";
    else contentType = "audio/mpeg";
  }
  return { ext, contentType };
}
