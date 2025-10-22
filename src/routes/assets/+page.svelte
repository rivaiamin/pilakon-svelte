<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase, assets as assetHelpers } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Search, Filter, Grid, List, Heart, Upload, Eye } from 'lucide-svelte';
  import type { Asset, AssetCategory, User, ViewMode } from '$lib/types';
  
  let searchQuery: string = '';
  let selectedCategory: string = '';
  let viewMode: ViewMode['type'] = 'grid';
  let assets: Asset[] = [];
  let categories: (AssetCategory & { count: number })[] = [];
  let loading: boolean = true;
  let error: string = '';
  let user: User | null = null;
  
  // Mock data for now - will be replaced with real data from Supabase
  const mockAssets: Asset[] = [
    { 
      id: '1', 
      name: 'Hero Character', 
      file_path: 'hero-character.png',
      public_url: '#', 
      category: 'Characters', 
      tags: ['hero', 'male', 'superhero'], 
      is_favorite: false, 
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'Forest Background', 
      file_path: 'forest-bg.jpg',
      public_url: '#', 
      category: 'Backgrounds', 
      tags: ['nature', 'forest', 'green'], 
      is_favorite: true, 
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '3', 
      name: 'Magic Sword', 
      file_path: 'magic-sword.png',
      public_url: '#', 
      category: 'Objects', 
      tags: ['weapon', 'fantasy', 'magic'], 
      is_favorite: false, 
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '4', 
      name: 'Explosion Effect', 
      file_path: 'explosion.gif',
      public_url: '#', 
      category: 'Effects', 
      tags: ['explosion', 'fire', 'action'], 
      is_favorite: false, 
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '5', 
      name: 'Speech Balloon', 
      file_path: 'speech-balloon.png',
      public_url: '#', 
      category: 'Text Elements', 
      tags: ['text', 'dialogue', 'speech'], 
      is_favorite: true, 
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '6', 
      name: 'Villain Character', 
      file_path: 'villain-character.png',
      public_url: '#', 
      category: 'Characters', 
      tags: ['villain', 'evil', 'monster'], 
      is_favorite: false, 
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  const mockCategories: (AssetCategory & { count: number })[] = [
    { id: 'all', name: 'All Categories', count: 6, created_at: new Date().toISOString() },
    { id: 'characters', name: 'Characters', count: 2, created_at: new Date().toISOString() },
    { id: 'backgrounds', name: 'Backgrounds', count: 1, created_at: new Date().toISOString() },
    { id: 'objects', name: 'Objects', count: 1, created_at: new Date().toISOString() },
    { id: 'effects', name: 'Effects', count: 1, created_at: new Date().toISOString() },
    { id: 'text-elements', name: 'Text Elements', count: 1, created_at: new Date().toISOString() }
  ];
  
  onMount(async () => {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      user = currentUser;
      
      // Load asset categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('asset_categories')
        .select('*')
        .order('name');
      
      if (categoriesError) {
        console.error('Error loading categories:', categoriesError);
        // Fallback to mock data
        categories = mockCategories;
      } else {
        categories = [
          { id: 'all', name: 'All Categories', count: 0, created_at: new Date().toISOString() },
          ...(categoriesData || []).map((cat: any) => ({ 
            id: cat.id, 
            name: cat.name, 
            count: 0,
            created_at: cat.created_at
          }))
        ];
      }
      
      // Load assets
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select(`
          *,
          asset_categories(name),
          user_favorites!left(user_id)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (assetsError) {
        console.error('Error loading assets:', assetsError);
        // Fallback to mock data
        assets = mockAssets;
      } else {
        assets = (assetsData || []).map((asset: any) => ({
          ...asset,
          category: asset.asset_categories?.name || 'Uncategorized',
          is_favorite: asset.user_favorites?.length > 0
        }));
      }
      
      // Update category counts
      categories.forEach(cat => {
        if (cat.id !== 'all') {
          cat.count = assets.filter(asset => asset.category_id === cat.id).length;
        }
      });
      categories[0].count = assets.length; // All categories count
      
    } catch (err) {
      console.error('Error loading data:', err);
      error = 'Failed to load assets. Please try again.';
      // Fallback to mock data
      assets = mockAssets;
      categories = mockCategories;
    } finally {
      loading = false;
    }
  });
  
  function handleSearch(): void {
    // Filter assets based on search query
    if (!searchQuery.trim()) {
      // Reset to category filter
      handleCategoryFilter(selectedCategory);
      return;
    }
    
    const filteredAssets = assets.filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Apply category filter if selected
    if (selectedCategory && selectedCategory !== 'all') {
      assets = filteredAssets.filter(asset => asset.category_id === selectedCategory);
    } else {
      assets = filteredAssets;
    }
  }
  
  function handleCategoryFilter(categoryId: string): void {
    selectedCategory = categoryId;
    if (categoryId === 'all') {
      assets = [...assets]; // Reset to all assets
    } else {
      assets = assets.filter(asset => asset.category_id === categoryId);
    }
  }
  
  function handleAssetClick(assetId: string): void {
    // For now, just show an alert
    alert(`Asset ${assetId} clicked! This will open the asset details.`);
  }
  
  function toggleViewMode(): void {
    viewMode = viewMode === 'grid' ? 'list' : 'grid';
  }
  
  async function toggleFavorite(assetId: string): Promise<void> {
    if (!user) {
      goto('/login');
      return;
    }
    
    try {
      const asset = assets.find(a => a.id === assetId);
      if (!asset) return;
      
      const isFavorite = asset.is_favorite;
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('asset_id', assetId);
        
        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            asset_id: assetId
          } as any);
        
        if (error) throw error;
      }
      
      // Update local state
      assets = assets.map(a => 
        a.id === assetId ? { ...a, is_favorite: !isFavorite } : a
      );
      
    } catch (err) {
      console.error('Error toggling favorite:', err);
      error = 'Failed to update favorite. Please try again.';
    }
  }
  
  function handleUpload(): void {
    if (!user) {
      goto('/login');
      return;
    }
    
    // For now, just show an alert
    alert('Asset upload feature coming soon!');
  }
</script>

<svelte:head>
  <title>Asset Library - Pilakon</title>
  <meta name="description" content="Browse our extensive library of characters, backgrounds, objects, and effects for your motion comics" />
</svelte:head>

<div class="assets-container">
  <div class="page-header">
    <h1 class="page-title">Asset Library</h1>
    <p class="page-subtitle">Browse our extensive library of characters, backgrounds, objects, and effects</p>
  </div>

  {#if error}
    <div class="error-message">
      <p>{error}</p>
    </div>
  {/if}

  <!-- Search and Filters -->
  <div class="search-filters-section">
    <div class="search-bar">
      <Search class="search-icon" size={20} />
      <input 
        type="text" 
        placeholder="Search assets by name or tags..." 
        class="search-input"
        bind:value={searchQuery}
        on:input={handleSearch}
      />
    </div>
    
    <div class="filters-row">
      <div class="category-filters">
        <Filter class="filter-icon" size={16} />
        <span class="filter-label">Categories:</span>
        <div class="filter-chips">
          {#each categories as category}
            <button 
              class="filter-chip"
              class:active={selectedCategory === category.id}
              on:click={() => handleCategoryFilter(category.id)}
            >
              {category.name} ({category.count})
            </button>
          {/each}
        </div>
      </div>
      
      <div class="view-controls">
        <button 
          class="view-toggle"
          on:click={toggleViewMode}
          title="Toggle view mode"
        >
          {#if viewMode === 'grid'}
            <List size={20} />
          {:else}
            <Grid size={20} />
          {/if}
        </button>
        
        {#if user}
          <button 
            class="upload-btn"
            on:click={handleUpload}
            title="Upload new asset"
          >
            <Upload size={16} />
            Upload
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Assets Grid/List -->
  {#if loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading assets...</p>
    </div>
  {:else if assets.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>No assets found</h3>
      <p>Try adjusting your search or filter criteria.</p>
    </div>
  {:else}
    <div class="assets-grid" class:list-view={viewMode === 'list'}>
      {#each assets as asset}
        <div class="asset-card" class:list-item={viewMode === 'list'}>
          <div class="asset-thumbnail">
            <div class="thumbnail-placeholder">{asset.thumbnail}</div>
            <div class="asset-overlay">
              <button 
                class="overlay-btn preview-btn"
                on:click={() => handleAssetClick(asset.id)}
                title="Preview asset"
              >
                <Eye size={16} />
              </button>
              <button 
                class="overlay-btn favorite-btn"
                class:favorited={asset.is_favorite}
                on:click={() => toggleFavorite(asset.id)}
                title={asset.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={16} />
              </button>
            </div>
          </div>
          
          <div class="asset-info">
            <h3 class="asset-name">{asset.name}</h3>
            <p class="asset-category">{asset.category}</p>
            {#if asset.tags && asset.tags.length > 0}
              <div class="asset-tags">
                {#each asset.tags.slice(0, 3) as tag}
                  <span class="tag">#{tag}</span>
                {/each}
                {#if asset.tags.length > 3}
                  <span class="tag more">+{asset.tags.length - 3}</span>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .assets-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  .page-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    margin: 0;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .search-filters-section {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .search-bar {
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
  }

  .search-icon {
    color: #64748b;
    margin-right: 0.75rem;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 1rem;
  }

  .search-input::placeholder {
    color: #94a3b8;
  }

  .filters-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .category-filters {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .filter-icon {
    color: #64748b;
  }

  .filter-label {
    font-weight: 500;
    color: #374151;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-chip {
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 2rem;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-chip:hover {
    background: #e2e8f0;
  }

  .filter-chip.active {
    background: #667eea;
    border-color: #667eea;
    color: white;
  }

  .view-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .view-toggle {
    padding: 0.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .view-toggle:hover {
    background: #e2e8f0;
  }

  .upload-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .upload-btn:hover {
    background: #5a67d8;
  }

  .loading-state {
    text-align: center;
    padding: 4rem 2rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  .empty-state p {
    color: #64748b;
    margin: 0;
  }

  .assets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .assets-grid.list-view {
    grid-template-columns: 1fr;
  }

  .asset-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .asset-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }

  .asset-card.list-item {
    display: flex;
    align-items: center;
    padding: 1rem;
  }

  .asset-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .asset-card.list-item .asset-thumbnail {
    width: 120px;
    height: 80px;
    flex-shrink: 0;
    margin-right: 1rem;
  }

  .thumbnail-placeholder {
    font-size: 3rem;
    opacity: 0.7;
  }

  .asset-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .asset-thumbnail:hover .asset-overlay {
    opacity: 1;
  }

  .overlay-btn {
    padding: 0.5rem;
    background: white;
    border: none;
    border-radius: 0.5rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .overlay-btn:hover {
    background: #f3f4f6;
  }

  .favorite-btn.favorited {
    color: #ef4444;
  }

  .asset-info {
    padding: 1rem;
  }

  .asset-card.list-item .asset-info {
    flex: 1;
    padding: 0;
  }

  .asset-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  .asset-category {
    color: #64748b;
    font-size: 0.875rem;
    margin: 0 0 0.75rem 0;
  }

  .asset-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tag {
    background: #e0e7ff;
    color: #3730a3;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .tag.more {
    background: #f3f4f6;
    color: #6b7280;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .filters-row {
      flex-direction: column;
      align-items: stretch;
    }

    .category-filters {
      justify-content: center;
    }

    .view-controls {
      justify-content: center;
    }

    .assets-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .asset-card.list-item {
      flex-direction: column;
      align-items: stretch;
    }

    .asset-card.list-item .asset-thumbnail {
      width: 100%;
      height: 120px;
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
</style>
