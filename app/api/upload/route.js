import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const cleanEnv = (val) => (val || '').replace(/^["']|["']$/g, '');

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${cleanEnv(process.env.R2_ACCOUNT_ID)}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: cleanEnv(process.env.R2_ACCESS_KEY_ID),
    secretAccessKey: cleanEnv(process.env.R2_SECRET_ACCESS_KEY),
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
    
    const type = formData.get('type') || '';
    
    let folderName = 'Malatinursury/Both'; // default
    if (type === 'Wholesale only') {
      folderName = 'Malatinursury/WholeSale';
    } else if (type === 'Retail only') {
      folderName = 'Malatinursury/Retail';
    }

    const objectKey = `${folderName}/${Date.now()}_${filename}`;

    const command = new PutObjectCommand({
      Bucket: cleanEnv(process.env.R2_BUCKET_NAME) || 'bpn',
      Key: objectKey,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(command);

    const publicUrlBase = cleanEnv(process.env.R2_PUBLIC_URL) || 'https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev';
    const fileUrl = `${publicUrlBase}/${objectKey}`;
    
    return NextResponse.json({ Message: "Success", status: 201, url: fileUrl });
  } catch (error) {
    console.error("Error occurred uploading to R2:", error);
    return NextResponse.json({ Message: "Failed", error: error.message }, { status: 500 });
  }
}
