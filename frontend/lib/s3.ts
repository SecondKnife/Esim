import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || "dummy",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || "dummy",
  },
});
