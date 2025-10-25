import { json } from '@sveltejs/kit';
import { db, userFavorites, assets } from '$lib/db';
import { eq, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.getSession();
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assetId } = await request.json();

    if (!assetId) {
      return json({ error: 'Asset ID required' }, { status: 400 });
    }

    // Check if already favorited
    const existing = await db
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, session.user.id),
        eq(userFavorites.assetId, assetId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return json({ error: 'Already favorited' }, { status: 400 });
    }

    // Add to favorites
    await db.insert(userFavorites).values({
      userId: session.user.id,
      assetId,
    });

    return json({ success: true });

  } catch (error) {
    console.error('Error adding favorite:', error);
    return json({ error: 'Failed to add favorite' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.getSession();
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assetId } = await request.json();

    if (!assetId) {
      return json({ error: 'Asset ID required' }, { status: 400 });
    }

    // Remove from favorites
    await db
      .delete(userFavorites)
      .where(and(
        eq(userFavorites.userId, session.user.id),
        eq(userFavorites.assetId, assetId)
      ));

    return json({ success: true });

  } catch (error) {
    console.error('Error removing favorite:', error);
    return json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
};
