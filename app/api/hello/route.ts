import { Storage } from "@google-cloud/storage";

export async function GET(request: Request) {
  const storage = new Storage({
    projectId: "hikari-383521",
  });

  const [url] = await storage
    .bucket("aspect-public-videos")
    .file("test.mp4")
    .getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

  const passedURL = url;

  console.log(passedURL);
  return new Response(passedURL);
}
