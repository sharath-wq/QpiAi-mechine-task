import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLCLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json();
    const { filename, resource_type } = body;

    if (!filename || !resource_type) {
      return NextResponse.json({ error: 'Missing filename or resource_type' }, { status: 400 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `qpiai/${filename}`; // Or generate a unique public_id

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        public_id: publicId,
        folder: 'qpiai',
      },
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudname: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      public_id: publicId,
      folder: 'qpiai',
      resource_type: resource_type,
      context: `userId=${userId}`,
    });

  } catch (error) {
    console.error('Error generating Cloudinary signature:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload signature.' },
      { status: 500 }
    )
  }
}
