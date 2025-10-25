import { json } from '@sveltejs/kit';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { db, assets, type NewAsset } from '$lib/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Get session from server-side
    const session = await locals.getSession();
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > maxSize) {
      return json({ error: 'File too large' }, { status: 400 });
    }

    // Create server-side Supabase client for storage
    const supabase = createSupabaseServerClient({
      supabaseUrl: PUBLIC_SUPABASE_URL,
      supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
      event: { request, cookies: {} },
    });

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return json({ error: 'Upload failed' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);

    // Save to database using Drizzle
    const newAsset: NewAsset = {
      name: file.name.split('.')[0],
      filePath: uploadData.path,
      publicUrl,
      mimeType: file.type,
      fileSize: file.size,
      uploadedBy: session.user.id,
      isPublic: true,
      tags: [],
    };

    const [insertedAsset] = await db.insert(assets).values(newAsset).returning();

    return json({ 
      success: true, 
      asset: insertedAsset,
      publicUrl 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return json({ error: 'Upload failed' }, { status: 500 });
  }
};
