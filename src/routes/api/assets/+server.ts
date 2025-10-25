import { json } from '@sveltejs/kit';
import { db, assets, assetCategories, userFavorites } from '$lib/db';
import { eq, and, desc, ilike, or } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    const session = await locals.getSession();
    const searchParams = url.searchParams;
    
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = db
      .select({
        id: assets.id,
        name: assets.name,
        description: assets.description,
        filePath: assets.filePath,
        publicUrl: assets.publicUrl,
        categoryId: assets.categoryId,
        tags: assets.tags,
        fileSize: assets.fileSize,
        mimeType: assets.mimeType,
        uploadedBy: assets.uploadedBy,
        isPublic: assets.isPublic,
        createdAt: assets.createdAt,
        updatedAt: assets.updatedAt,
        category: assetCategories.name,
        isFavorite: userFavorites.id,
      })
      .from(assets)
      .leftJoin(assetCategories, eq(assets.categoryId, assetCategories.id))
      .leftJoin(userFavorites, and(
        eq(userFavorites.assetId, assets.id),
        session?.user ? eq(userFavorites.userId, session.user.id) : undefined
      ))
      .where(
        and(
          eq(assets.isPublic, true),
          category !== 'all' ? eq(assets.categoryId, category) : undefined,
          search ? or(
            ilike(assets.name, `%${search}%`),
            ilike(assets.description, `%${search}%`),
            ilike(assetCategories.name, `%${search}%`)
          ) : undefined
        )
      );

    // Apply sorting
    switch (sortBy) {
      case 'name':
        query = query.orderBy(sortOrder === 'asc' ? assets.name : desc(assets.name));
        break;
      case 'size':
        query = query.orderBy(sortOrder === 'asc' ? assets.fileSize : desc(assets.fileSize));
        break;
      case 'category':
        query = query.orderBy(sortOrder === 'asc' ? assetCategories.name : desc(assetCategories.name));
        break;
      default:
        query = query.orderBy(desc(assets.createdAt));
    }

    const result = await query;

    // Transform results
    const transformedAssets = result.map(asset => ({
      ...asset,
      category: asset.category || 'Uncategorized',
      is_favorite: !!asset.isFavorite,
      thumbnail: asset.publicUrl,
    }));

    return json({ assets: transformedAssets });

  } catch (error) {
    console.error('Error fetching assets:', error);
    return json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
};
