import { supabaseAdmin } from './supabase';

export interface ImageUploadResult {
  url: string;
  path: string;
  publicUrl: string;
}

/**
 * Upload base64 image to Supabase Storage using admin client
 */
export async function uploadImageToSupabase(
  base64DataUrl: string,
  bucketName: string = 'memory-images',
  folder: string = 'memories'
): Promise<ImageUploadResult> {
  try {
    if (!supabaseAdmin) {
      throw new Error(
        'Supabase admin client not available. Please check SUPABASE_SERVICE_ROLE_KEY environment variable.'
      );
    }

    // Parse base64 data URL
    const matches = base64DataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 data URL');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Determine file extension from MIME type
    const extension = mimeType.split('/')[1] || 'jpg';

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const filename = `${folder}/${timestamp}_${randomId}.${extension}`;

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filename, buffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filename);

    return {
      url: publicUrl,
      path: data.path,
      publicUrl: publicUrl,
    };
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw new Error('Failed to upload image to storage');
  }
}

/**
 * Process multiple base64 images and upload to Supabase
 */
export async function processImagesToSupabase(
  base64Images: string[],
  bucketName: string = 'memory-images',
  folder: string = 'memories'
): Promise<string[]> {
  try {
    const results = await Promise.all(
      base64Images.map(image =>
        uploadImageToSupabase(image, bucketName, folder)
      )
    );

    return results.map(result => result.publicUrl);
  } catch (error) {
    console.error('Error processing images:', error);
    throw new Error('Failed to process images');
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImageFromSupabase(
  imageUrl: string,
  bucketName: string = 'memory-images'
): Promise<void> {
  try {
    if (!supabaseAdmin) {
      throw new Error(
        'Supabase admin client not available. Please check SUPABASE_SERVICE_ROLE_KEY environment variable.'
      );
    }

    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === bucketName);

    if (bucketIndex === -1) {
      throw new Error('Invalid image URL');
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image from Supabase:', error);
    throw new Error('Failed to delete image from storage');
  }
}
