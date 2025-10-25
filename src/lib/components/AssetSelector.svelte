<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { Search, Filter, Grid, List, Heart, X, Image } from 'lucide-svelte';
  import type { Asset, AssetCategory, User, ViewMode } from '$lib/types';

  const dispatch = createEventDispatcher<{
    select: { asset: Asset };
    close: void;
  }>();

  let searchQuery: string = '';
  let selectedCategory: string = '';
  let viewMode: ViewMode['type'] = 'grid';
  let assets: Asset[] = [];
  let categories: (AssetCategory & { count: number })[] = [];
  let loading: boolean = true;
  let error: string = '';
  let user: User | null = null;

  // Mock data for demonstration
  const mockAssets: Asset[] = [
    { 
      id: '1', 
      name: 'Character 1', 
      description: 'A friendly character',
      file_path: '/assets/character1.png',
      public_url: 'https://via.placeholder.com/300x400/667eea/ffffff?text=Character+1',
      category_id: 'characters',
      tags: ['character', 'person', 'friendly'],
      file_size: 1024000,
      mime_type: 'image/png',
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: 'Characters',
      is_favorite: false,
      thumbnail: 'https://via.placeholder.com/300x400/667eea/ffffff?text=Character+1'
    },
    { 
      id: '2', 
      name: 'Background 1', 
      description: 'A scenic background',
      file_path: '/assets/background1.png',
      public_url: 'https://via.placeholder.com/600x400/10b981/ffffff?text=Background+1',
      category_id: 'backgrounds',
      tags: ['background', 'scenic', 'nature'],
      file_size: 2048000,
      mime_type: 'image/png',
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: 'Backgrounds',
      is_favorite: true,
      thumbnail: 'https://via.placeholder.com/600x400/10b981/ffffff?text=Background+1'
    },
    { 
      id: '3', 
      name: 'Object 1', 
      description: 'A useful object',
      file_path: '/assets/object1.png',
      public_url: 'https://via.placeholder.com/200x200/f59e0b/ffffff?text=Object+1',
      category_id: 'objects',
      tags: ['object', 'tool', 'useful'],
      file_size: 512000,
      mime_type: 'image/png',
      uploaded_by: 'system',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: 'Objects',
      is_favorite: false,
      thumbnail: 'https://via.placeholder.com/200x200/f59e0b/ffffff?text=Object+1'
    }
  ];

  const mockCategories: (AssetCategory & { count: number })[] = [
    { id: 'all', name: 'All Categories', count: 3, created_at: new Date().toISOString() },
    { id: 'characters', name: 'Characters', count: 1, created_at: new Date().toISOString() },
    { id: 'backgrounds', name: 'Backgrounds', count: 1, created_at: new Date().toISOString() },
    { id: 'objects', name: 'Objects', count: 1, created_at: new Date().toISOString() }
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
          assets = assetsData.map((asset: any) => ({
            ...asset,
            category: asset.asset_categories?.name || 'Uncategorized',
            is_favorite: asset.user_favorites?.length > 0,
            thumbnail: asset.public_url
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
          assets = mockAssets;
          categories = mockCategories;
        }
      } catch (err) {
        console.error('Error loading real data:', err);
        // Fallback to mock data
        assets = mockAssets;
        categories = mockCategories;
      }
      
    } catch (err) {
      console.error('Error loading data:', err);
      error = 'Failed to load assets';
      // Use mock data as fallback
      assets = mockAssets;
      categories = mockCategories;
    } finally {
      loading = false;
    }
  });

  function handleSearch(): void {
    // Filter assets based on search query
    // This would be implemented with real search functionality
  }

  function handleCategoryFilter(categoryId: string): void {
    selectedCategory = categoryId;
    // Filter assets based on category
    // This would be implemented with real filtering
  }

  function handleAssetClick(asset: Asset): void {
    dispatch('select', { asset });
  }

  function toggleViewMode(): void {
    viewMode = viewMode === 'grid' ? 'list' : 'grid';
  }

  function closeModal(): void {
    dispatch('close');
  }

  // Filter assets based on search and category
  $: filteredAssets = assets.filter(asset => {
    const matchesSearch = !searchQuery || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || asset.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
</script>

<div class="asset-selector">
  <div class="selector-header">
    <h2 class="selector-title">Choose Asset</h2>
    <button class="close-btn" on:click={closeModal}>
      <X size={20} />
    </button>
  </div>

  <div class="selector-content">
    <!-- Search and Filters -->
    <div class="search-filters">
      <div class="search-bar">
        <Search size={16} class="search-icon" />
        <input
          type="text"
          bind:value={searchQuery}
          on:input={handleSearch}
          placeholder="Search assets..."
          class="search-input"
        />
      </div>

      <div class="filters">
        <div class="category-filter">
          <Filter size={16} class="filter-icon" />
          <select bind:value={selectedCategory} on:change={() => handleCategoryFilter(selectedCategory)} class="category-select">
            {#each categories as category}
              <option value={category.id}>{category.name} ({category.count})</option>
            {/each}
          </select>
        </div>

        <button class="view-toggle" on:click={toggleViewMode} title="Toggle view">
          {#if viewMode === 'list'}
            <Grid size={16} />
          {:else}
            <List size={16} />
          {/if}
        </button>
      </div>
    </div>

    <!-- Assets Grid/List -->
    {#if loading}
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading assets...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <p>{error}</p>
      </div>
    {:else if filteredAssets.length === 0}
      <div class="empty-state">
        <Image size={48} class="empty-icon" />
        <h3>No assets found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    {:else}
      <div class="assets-container" class:list-view={viewMode === 'list'}>
        {#each filteredAssets as asset}
          <div 
            class="asset-item"
            class:list-item={viewMode === 'list'}
            on:click={() => handleAssetClick(asset)}
            role="button"
            tabindex="0"
            on:keydown={(e) => e.key === 'Enter' && handleAssetClick(asset)}
          >
            <div class="asset-thumbnail">
              {#if asset.thumbnail && asset.thumbnail.startsWith('http')}
                <img src={asset.thumbnail} alt={asset.name} class="asset-image" />
              {:else}
                <div class="thumbnail-placeholder">{asset.thumbnail || '📦'}</div>
              {/if}
            </div>
            
            <div class="asset-info">
              <h4 class="asset-name">{asset.name}</h4>
              {#if asset.description}
                <p class="asset-description">{asset.description}</p>
              {/if}
              <div class="asset-meta">
                <span class="asset-category">{asset.category}</span>
                {#if asset.tags && asset.tags.length > 0}
                  <div class="asset-tags">
                    {#each asset.tags.slice(0, 3) as tag}
                      <span class="tag">{tag}</span>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .asset-selector {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 800px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .selector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .selector-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .close-btn {
    padding: 0.5rem;
    background: #f3f4f6;
    border: none;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .selector-content {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
  }

  .search-filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .search-bar {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .filters {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .category-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .filter-icon {
    color: #6b7280;
  }

  .category-select {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .view-toggle {
    padding: 0.5rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .view-toggle:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
    color: #6b7280;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .empty-icon {
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.875rem;
  }

  .assets-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .assets-container.list-view {
    grid-template-columns: 1fr;
  }

  .asset-item {
    display: flex;
    flex-direction: column;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .asset-item:hover {
    background: #f3f4f6;
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .asset-item.list-item {
    flex-direction: row;
    align-items: center;
  }

  .asset-thumbnail {
    width: 100%;
    height: 150px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .asset-item.list-item .asset-thumbnail {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    margin-right: 1rem;
  }

  .asset-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumbnail-placeholder {
    font-size: 2rem;
    opacity: 0.7;
  }

  .asset-info {
    padding: 1rem;
    flex: 1;
  }

  .asset-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .asset-description {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
  }

  .asset-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .asset-category {
    font-size: 0.75rem;
    color: #667eea;
    font-weight: 500;
  }

  .asset-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tag {
    font-size: 0.625rem;
    background: #e5e7eb;
    color: #374151;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  @media (max-width: 640px) {
    .search-filters {
      gap: 0.75rem;
    }

    .filters {
      flex-direction: column;
      align-items: stretch;
    }

    .assets-container {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .asset-item.list-item {
      flex-direction: column;
      align-items: stretch;
    }

    .asset-item.list-item .asset-thumbnail {
      width: 100%;
      height: 120px;
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
</style>

