import { json } from '@sveltejs/kit';
import { db, comics, panels, type NewComic, type NewPanel } from '$lib/db';
import { eq, desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  return json({ error: 'Not implemented yet' }, { status: 501 });
};

export const GET: RequestHandler = async ({ locals }) => {
  try {
    const session = await locals.getSession();
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's comics
    const userComics = await db
      .select()
      .from(comics)
      .where(eq(comics.userId, session.user.id))
      .orderBy(desc(comics.createdAt));

    return json({ comics: userComics });

  } catch (error) {
    console.error('Error fetching comics:', error);
    return json({ error: 'Failed to fetch comics' }, { status: 500 });
  }
};
