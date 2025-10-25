<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase, assets as assetHelpers } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Search, Filter, Grid, List, Heart, Upload, Eye, Plus, X } from 'lucide-svelte';
  import type { Asset, AssetCategory, User, ViewMode } from '$lib/types';
  import AssetUpload from '$lib/components/AssetUpload.svelte';
  import AssetPreview from '$lib/components/AssetPreview.svelte';
  
  let searchQuery: string = '';
  let selectedCategory: string = '';
  let viewMode: ViewMode['type'] = 'grid';
  let assets: Asset[] = [];
  let categories: (AssetCategory & { count: number })[] = [];
  let loading: boolean = true;
  let error: string = '';
  let user: User | null = null;
  let showUploadModal: boolean = false;
  let useRealData: boolean = false;
  let showPreviewModal: boolean = false;
  let selectedAsset: Asset | null = null;
  let sortBy: 'name' | 'date' | 'size' | 'category' = 'date';
  let sortOrder: 'asc' | 'desc' = 'desc';
  
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
      
      // Try to load real data first
      try {
        // Load asset categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('asset_categories')
          .select('*')
          .order('name');
        
        if (categoriesError) {
          throw new Error(`Categories error: ${categoriesError.message}`);
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
          throw new Error(`Assets error: ${assetsError.message}`);
        }

        // If we have real data, use it
        if (assetsData && assetsData.length > 0) {
          useRealData = true;
          assets = assetsData.map((asset: any) => ({
            ...asset,
            category: asset.asset_categories?.name || 'Uncategorized',
            is_favorite: asset.user_favorites?.length > 0,
            thumbnail: asset.public_url // Use real image URLs
          }));

          categories = [
            { id: 'all', name: 'All Categories', count: assets.length, created_at: new Date().toISOString() },
            ...(categoriesData || []).map((cat: any) => ({ 
              id: cat.id, 
              name: cat.name, 
              count: assets.filter(asset => asset.category_id === cat.id).length,
              created_at: cat.created_at
            }))
          ];
        } else {
          // No real data yet, use mock data
          useRealData = false;
          assets = mockAssets;
          categories = mockCategories;
        }
      } catch (err) {
        console.error('Error loading real data:', err);
        // Fallback to mock data
        useRealData = false;
        assets = mockAssets;
        categories = mockCategories;
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
    // Enhanced search functionality
    if (!searchQuery.trim()) {
      // Reset to category filter
      handleCategoryFilter(selectedCategory);
      return;
    }
    
    const searchLower = searchQuery.toLowerCase();
    const filteredAssets = assets.filter(asset => 
      asset.name.toLowerCase().includes(searchLower) ||
      asset.description?.toLowerCase().includes(searchLower) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      asset.category?.toLowerCase().includes(searchLower)
    );
    
    // Apply category filter if selected
    if (selectedCategory && selectedCategory !== 'all') {
      assets = filteredAssets.filter(asset => asset.category_id === selectedCategory);
    } else {
      assets = filteredAssets;
    }
  }

  // Real-time search with reactive statement
  $: if (searchQuery || selectedCategory) {
    const searchLower = searchQuery.toLowerCase();
    const filteredAssets = assets.filter(asset => {
      const matchesSearch = !searchQuery || 
        asset.name.toLowerCase().includes(searchLower) ||
        asset.description?.toLowerCase().includes(searchLower) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        asset.category?.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === 'all' || asset.category_id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    // Update the displayed assets
    if (filteredAssets.length !== assets.length) {
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
  
  function handleAssetClick(asset: Asset): void {
    selectedAsset = asset;
    showPreviewModal = true;
  }

  function closePreviewModal(): void {
    showPreviewModal = false;
    selectedAsset = null;
  }

  function handleAssetFavorite(event: CustomEvent<{ asset: Asset }>): void {
    const asset = event.detail.asset;
    toggleFavorite(asset.id);
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
    
    showUploadModal = true;
  }

  function handleAssetUploaded(event: CustomEvent<{ asset: Asset }>): void {
    // Add the new asset to the list
    assets = [event.detail.asset, ...assets];
    
    // Update category counts
    categories = categories.map(cat => {
      if (cat.id === 'all') {
        return { ...cat, count: assets.length };
      }
      return { ...cat, count: assets.filter(asset => asset.category_id === cat.id).length };
    });
    
    // Close modal
    showUploadModal = false;
  }

  function handleUploadError(event: CustomEvent<{ message: string }>): void {
    error = event.detail.message;
  }

  function closeUploadModal(): void {
    showUploadModal = false;
  }

  function handleSort(): void {
    assets = [...assets].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'size':
          comparison = (a.file_size || 0) - (b.file_size || 0);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // Reactive sorting
  $: if (sortBy || sortOrder) {
    handleSort();
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

      <div class="sort-controls">
        <span class="sort-label">Sort by:</span>
        <select bind:value={sortBy} class="sort-select">
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="size">Size</option>
          <option value="category">Category</option>
        </select>
        <button 
          class="sort-order-btn"
          on:click={() => sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'}
          title="Toggle sort order"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
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
            <Plus size={16} />
            Upload Assets
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
            {#if asset.thumbnail && asset.thumbnail.startsWith('http')}
              <img src={asset.thumbnail} alt={asset.name} class="asset-image" />
            {:else}
              <div class="thumbnail-placeholder">{asset.thumbnail || '📦'}</div>
            {/if}
            <div class="asset-overlay">
              <button 
                class="overlay-btn preview-btn"
                on:click={() => handleAssetClick(asset)}
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

  <!-- Upload Modal -->
  {#if showUploadModal}
    <div class="modal-overlay" on:click={closeUploadModal}>
      <div class="modal-content" on:click|stopPropagation>
        <div class="modal-header">
          <h2 class="modal-title">Upload Assets</h2>
          <button class="modal-close" on:click={closeUploadModal}>
            <X size={20} />
          </button>
        </div>
        <div class="modal-body">
          <AssetUpload 
            on:upload={handleAssetUploaded}
            on:error={handleUploadError}
          />
        </div>
      </div>
    </div>
  {/if}

  <!-- Asset Preview Modal -->
  {#if showPreviewModal && selectedAsset}
    <div class="modal-overlay" on:click={closePreviewModal}>
      <div class="modal-content" on:click|stopPropagation>
        <AssetPreview 
          asset={selectedAsset}
          isFavorite={selectedAsset.is_favorite || false}
          on:favorite={handleAssetFavorite}
          on:close={closePreviewModal}
        />
      </div>
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

  .sort-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-left: auto;
  }

  .sort-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .sort-select {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: white;
  }

  .sort-order-btn {
    padding: 0.5rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .sort-order-btn:hover {
    background: #e5e7eb;
    color: #374151;
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

  .asset-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
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

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .modal-close {
    padding: 0.5rem;
    background: #f3f4f6;
    border: none;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .modal-close:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .modal-body {
    padding: 1.5rem;
  }
</style>
