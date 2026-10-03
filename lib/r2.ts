import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const endpoint =
  process.env.CLOUDFLARE_R2_ENDPOINT ||
  "https://024f5a7f3894a2d93a24e52b445d1c83.r2.cloudflarestorage.com";
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
const bucketName = process.env.CLOUDFLARE_R2_BUCKET || "videos";
const publicUrlBase = (
  process.env.CLOUDFLARE_R2_PUBLIC_URL ||
  "https://pub-0c9a51c0f52546c38085664885f8231a.r2.dev"
).replace(/\/$/, "");

export function getR2Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Uploads a video buffer directly to Cloudflare R2 bucket "videos"
 */
export async function uploadVideoBufferToR2(
  buffer: Buffer | Uint8Array,
  filename: string,
  contentType: string = "video/mp4"
): Promise<{ key: string; publicUrl: string }> {
  const s3 = getR2Client();
  const cleanExt = filename.split(".").pop()?.toLowerCase() || "mp4";
  const safeBase = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .slice(0, 40);
  const key = `works/${Date.now()}-${safeBase}.${cleanExt}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const publicUrl = `${publicUrlBase}/${key}`;
  return { key, publicUrl };
}

/**
 * Deletes a video from R2 given its storage key or full public URL.
 */
export async function deleteVideoFromR2(keyOrUrl: string): Promise<void> {
  const s3 = getR2Client();
  let key = keyOrUrl;
  if (keyOrUrl.startsWith("http")) {
    try {
      const parsed = new URL(keyOrUrl);
      key = parsed.pathname.replace(/^\//, "");
    } catch {
      key = keyOrUrl;
    }
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}
