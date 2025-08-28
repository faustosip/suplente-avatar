import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Security check - only allow certain file extensions
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const hasValidExtension = allowedExtensions.some(ext => 
      filename.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      return new NextResponse('Invalid file type', { status: 400 });
    }
    
    // Read the file from the images directory
    const imagePath = join(process.cwd(), 'app', 'api', 'images', filename);
    const imageBuffer = await readFile(imagePath);
    
    // Determine content type based on file extension
    const extension = filename.toLowerCase().split('.').pop();
    const contentType = extension === 'png' ? 'image/png' : 
                       extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' :
                       extension === 'gif' ? 'image/gif' :
                       extension === 'webp' ? 'image/webp' : 'image/png';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}
