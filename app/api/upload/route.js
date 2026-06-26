import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // As requested: the folder is named "bpn"
    const objectKey = `bpn/${Date.now()}_${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'bpn',
      Key: objectKey,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(command);

    const publicUrlBase = process.env.R2_PUBLIC_URL || 'https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev';
    const fileUrl = `${publicUrlBase}/${objectKey}`;
    
    return NextResponse.json({ Message: "Success", status: 201, url: fileUrl });
  } catch (error) {
    console.error("Error occurred uploading to R2:", error);
    return NextResponse.json({ Message: "Failed", status: 500, error: error.message });
  }
}
