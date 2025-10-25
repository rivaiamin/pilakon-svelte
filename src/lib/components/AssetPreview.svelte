<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, Heart, Download, Share2, Tag, Calendar, User, FileText } from 'lucide-svelte';
  import type { Asset } from '$lib/types';

  const dispatch = createEventDispatcher<{
    close: void;
    favorite: { asset: Asset };
  }>();

  export let asset: Asset;
  export let isFavorite: boolean = false;

  function handleClose(): void {
    dispatch('close');
  }

  function handleFavorite(): void {
    dispatch('favorite', { asset });
  }

  function handleDownload(): void {
    // Create a temporary link to download the asset
    const link = document.createElement('a');
    link.href = asset.public_url;
    link.download = asset.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleShare(): void {
    if (navigator.share) {
      navigator.share({
        title: asset.name,
        text: asset.description || '',
        url: asset.public_url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(asset.public_url);
      // You could show a toast notification here
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<div class="asset-preview">
  <div class="preview-header">
    <h2 class="preview-title">{asset.name}</h2>
    <button class="close-btn" on:click={handleClose}>
      <X size={20} />
    </button>
  </div>

  <div class="preview-content">
    <!-- Asset Image -->
    <div class="asset-display">
      {#if asset.thumbnail && asset.thumbnail.startsWith('http')}
        <img src={asset.thumbnail} alt={asset.name} class="asset-image" />
      {:else}
        <div class="asset-placeholder">
          <FileText size={48} />
          <p>Preview not available</p>
        </div>
      {/if}
    </div>

    <!-- Asset Details -->
    <div class="asset-details">
      {#if asset.description}
        <div class="detail-section">
          <h3 class="detail-title">Description</h3>
          <p class="detail-content">{asset.description}</p>
        </div>
      {/if}

      <div class="detail-section">
        <h3 class="detail-title">Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <Tag size={16} class="info-icon" />
            <span class="info-label">Category:</span>
            <span class="info-value">{asset.category || 'Uncategorized'}</span>
          </div>
          
          {#if asset.file_size}
            <div class="info-item">
              <FileText size={16} class="info-icon" />
              <span class="info-label">Size:</span>
              <span class="info-value">{formatFileSize(asset.file_size)}</span>
            </div>
          {/if}

          {#if asset.mime_type}
            <div class="info-item">
              <FileText size={16} class="info-icon" />
              <span class="info-label">Type:</span>
              <span class="info-value">{asset.mime_type}</span>
            </div>
          {/if}

          <div class="info-item">
            <Calendar size={16} class="info-icon" />
            <span class="info-label">Created:</span>
            <span class="info-value">{formatDate(asset.created_at)}</span>
          </div>
        </div>
      </div>

      {#if asset.tags && asset.tags.length > 0}
        <div class="detail-section">
          <h3 class="detail-title">Tags</h3>
          <div class="tags-container">
            {#each asset.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Actions -->
  <div class="preview-actions">
    <button 
      class="action-btn favorite-btn"
      class:favorited={isFavorite}
      on:click={handleFavorite}
    >
      <Heart size={16} />
      {isFavorite ? 'Favorited' : 'Add to Favorites'}
    </button>
    
    <button class="action-btn download-btn" on:click={handleDownload}>
      <Download size={16} />
      Download
    </button>
    
    <button class="action-btn share-btn" on:click={handleShare}>
      <Share2 size={16} />
      Share
    </button>
  </div>
</div>

<style>
  .asset-preview {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .preview-title {
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

  .preview-content {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
  }

  .asset-display {
    margin-bottom: 1.5rem;
    border-radius: 0.75rem;
    overflow: hidden;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
  }

  .asset-image {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: contain;
    display: block;
  }

  .asset-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #6b7280;
    text-align: center;
  }

  .asset-placeholder p {
    margin: 1rem 0 0 0;
    font-size: 0.875rem;
  }

  .asset-details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .detail-content {
    color: #6b7280;
    line-height: 1.5;
    margin: 0;
  }

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .info-icon {
    color: #6b7280;
    flex-shrink: 0;
  }

  .info-label {
    color: #6b7280;
    font-weight: 500;
    min-width: 60px;
  }

  .info-value {
    color: #374151;
    font-weight: 500;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background: #e5e7eb;
    color: #374151;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .preview-actions {
    display: flex;
    gap: 0.75rem;
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    border-radius: 0 0 1rem 1rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    justify-content: center;
  }

  .favorite-btn {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .favorite-btn:hover {
    background: #e5e7eb;
  }

  .favorite-btn.favorited {
    background: #fef2f2;
    color: #dc2626;
    border-color: #fecaca;
  }

  .favorite-btn.favorited:hover {
    background: #fee2e2;
  }

  .download-btn {
    background: #667eea;
    color: white;
  }

  .download-btn:hover {
    background: #5a67d8;
  }

  .share-btn {
    background: #10b981;
    color: white;
  }

  .share-btn:hover {
    background: #059669;
  }

  @media (max-width: 640px) {
    .preview-actions {
      flex-direction: column;
    }

    .action-btn {
      flex: none;
    }

    .info-item {
      flex-wrap: wrap;
    }

    .info-label {
      min-width: auto;
    }
  }
</style>

