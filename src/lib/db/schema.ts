import { pgTable, uuid, text, timestamp, boolean, bigint, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Asset Categories Table
export const assetCategories = pgTable('asset_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Assets Table
export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  filePath: text('file_path').notNull(),
  publicUrl: text('public_url').notNull(),
  categoryId: uuid('category_id').references(() => assetCategories.id, { onDelete: 'set null' }),
  tags: jsonb('tags').$type<string[]>().default([]),
  fileSize: bigint('file_size', { mode: 'number' }),
  mimeType: text('mime_type'),
  uploadedBy: uuid('uploaded_by').notNull(), // References auth.users
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User Favorites Table
export const userFavorites = pgTable('user_favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References auth.users
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Comics Table
export const comics = pgTable('comics', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  userId: uuid('user_id').notNull(), // References auth.users
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Panels Table
export const panels = pgTable('panels', {
  id: uuid('id').primaryKey().defaultRandom(),
  comicId: uuid('comic_id').notNull().references(() => comics.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  text: text('text'),
  width: text('width').notNull(),
  textPosition: text('text_position').notNull(),
  textStyle: text('text_style').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const assetCategoriesRelations = relations(assetCategories, ({ many }) => ({
  assets: many(assets),
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  category: one(assetCategories, {
    fields: [assets.categoryId],
    references: [assetCategories.id],
  }),
  favorites: many(userFavorites),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  asset: one(assets, {
    fields: [userFavorites.assetId],
    references: [assets.id],
  }),
}));

export const comicsRelations = relations(comics, ({ many }) => ({
  panels: many(panels),
}));

export const panelsRelations = relations(panels, ({ one }) => ({
  comic: one(comics, {
    fields: [panels.comicId],
    references: [comics.id],
  }),
}));

// Types for TypeScript
export type AssetCategory = typeof assetCategories.$inferSelect;
export type NewAssetCategory = typeof assetCategories.$inferInsert;

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

export type UserFavorite = typeof userFavorites.$inferSelect;
export type NewUserFavorite = typeof userFavorites.$inferInsert;

export type Comic = typeof comics.$inferSelect;
export type NewComic = typeof comics.$inferInsert;

export type Panel = typeof panels.$inferSelect;
export type NewPanel = typeof panels.$inferInsert;
