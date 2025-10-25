<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import { Plus, Save, Eye, Trash2, Move, Image, Type } from 'lucide-svelte';
  import type { User, Asset } from '$lib/types';
  import AssetSelector from '$lib/components/AssetSelector.svelte';

  let user: User | null = null;
  let loading = true;
  let error = '';

  // Panel creation state
  let comicTitle = '';
  let panels: Panel[] = [];
  let selectedPanelId: string | null = null;
  let showAssetLibrary = false;

  interface Panel {
    id: string;
    image: string;
    text: string;
    width: 'full' | 'half' | 'third';
    textPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    textStyle: 'speech' | 'thought' | 'narration';
    order: number;
  }

  onMount(async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        goto('/login');
        return;
      }
      user = currentUser;
    } catch (err) {
      console.error('Error loading user:', err);
      error = 'Failed to load user data';
    } finally {
      loading = false;
    }
  });

  function addPanel(): void {
    const newPanel: Panel = {
      id: `panel-${Date.now()}`,
      image: '',
      text: '',
      width: 'full',
      textPosition: 'bottom-right',
      textStyle: 'speech',
      order: panels.length
    };
    panels = [...panels, newPanel];
    selectedPanelId = newPanel.id;
  }

  function selectPanel(panelId: string): void {
    selectedPanelId = panelId;
  }

  function removePanel(panelId: string): void {
    panels = panels.filter(p => p.id !== panelId);
    if (selectedPanelId === panelId) {
      selectedPanelId = panels.length > 0 ? panels[0].id : null;
    }
    // Update order
    panels = panels.map((panel, index) => ({ ...panel, order: index }));
  }

  function updatePanel(panelId: string, updates: Partial<Panel>): void {
    panels = panels.map(panel => 
      panel.id === panelId ? { ...panel, ...updates } : panel
    );
  }

  function movePanel(panelId: string, direction: 'up' | 'down'): void {
    const index = panels.findIndex(p => p.id === panelId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= panels.length) return;

    const newPanels = [...panels];
    [newPanels[index], newPanels[newIndex]] = [newPanels[newIndex], newPanels[index]];
    
    panels = newPanels.map((panel, i) => ({ ...panel, order: i }));
  }

  function openAssetLibrary(): void {
    showAssetLibrary = true;
  }

  function closeAssetLibrary(): void {
    showAssetLibrary = false;
  }

  function handleAssetSelect(event: CustomEvent<{ asset: Asset }>): void {
    if (selectedPanelId) {
      updatePanel(selectedPanelId, { image: event.detail.asset.public_url });
    }
    closeAssetLibrary();
  }

  function handleAssetSelectorClose(): void {
    closeAssetLibrary();
  }

  async function saveComic(): Promise<void> {
    if (!user || !comicTitle.trim()) {
      error = 'Please enter a comic title';
      return;
    }

    try {
      // Create comic record
      const { data: comicData, error: comicError } = await supabase
        .from('comics')
        .insert({
          title: comicTitle,
          user_id: user.id
        } as any)
        .select()
        .single();

      if (comicError) {
        throw new Error(`Failed to create comic: ${comicError.message}`);
      }

      // Create panel records
      if (panels.length > 0) {
        const panelData = panels.map(panel => ({
          comic_id: (comicData as any).id,
          image_url: panel.image,
          text: panel.text,
          width: panel.width,
          text_position: panel.textPosition,
          text_style: panel.textStyle,
          order: panel.order
        }));

        const { error: panelsError } = await supabase
          .from('panels')
          .insert(panelData as any);

        if (panelsError) {
          throw new Error(`Failed to save panels: ${panelsError.message}`);
        }
      }

      // Redirect to comic view
      goto(`/comic/${(comicData as any).id}`);
    } catch (err) {
      console.error('Error saving comic:', err);
      error = err instanceof Error ? err.message : 'Failed to save comic';
    }
  }

  const selectedPanel = panels.find(p => p.id === selectedPanelId);
</script>

<svelte:head>
  <title>Create Comic - Pilakon</title>
  <meta name="description" content="Create your motion comic with our intuitive editor" />
</svelte:head>

{#if loading}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading editor...</p>
  </div>
{:else if error}
  <div class="error-container">
    <div class="error-message">
      <p>{error}</p>
      <button on:click={() => goto('/login')} class="retry-btn">Go to Login</button>
    </div>
  </div>
{:else}
  <div class="create-container">
    <!-- Header -->
    <div class="create-header">
      <div class="header-content">
        <h1 class="page-title">Create Motion Comic</h1>
        <div class="header-actions">
          <button 
            class="save-btn"
            on:click={saveComic}
            disabled={!comicTitle.trim() || panels.length === 0}
          >
            <Save size={16} />
            Save Comic
          </button>
        </div>
      </div>
      
      <div class="comic-title-section">
        <label for="comic-title" class="title-label">Comic Title</label>
        <input
          id="comic-title"
          type="text"
          bind:value={comicTitle}
          placeholder="Enter your comic title..."
          class="title-input"
        />
      </div>
    </div>

    <div class="create-layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3 class="section-title">Panels</h3>
          <button class="add-panel-btn" on:click={addPanel}>
            <Plus size={16} />
            Add Panel
          </button>
          
          <div class="panels-list">
            {#each panels as panel, index}
              <div 
                class="panel-item"
                class:selected={selectedPanelId === panel.id}
                on:click={() => selectPanel(panel.id)}
              >
                <div class="panel-preview">
                  {#if panel.image}
                    <img src={panel.image} alt="Panel preview" />
                  {:else}
                    <div class="panel-placeholder">
                      <Image size={24} />
                    </div>
                  {/if}
                </div>
                <div class="panel-info">
                  <span class="panel-number">Panel {index + 1}</span>
                  <span class="panel-size">{panel.width}</span>
                </div>
                <div class="panel-actions">
                  <button 
                    class="action-btn"
                    on:click|stopPropagation={() => movePanel(panel.id, 'up')}
                    disabled={index === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button 
                    class="action-btn"
                    on:click|stopPropagation={() => movePanel(panel.id, 'down')}
                    disabled={index === panels.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button 
                    class="action-btn delete"
                    on:click|stopPropagation={() => removePanel(panel.id)}
                    title="Delete panel"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Main Editor -->
      <div class="editor">
        {#if selectedPanel}
          <div class="panel-editor">
            <div class="editor-header">
              <h3 class="editor-title">Edit Panel</h3>
              <button class="asset-btn" on:click={openAssetLibrary}>
                <Image size={16} />
                Choose Asset
              </button>
            </div>

            <div class="panel-canvas">
              <div class="comic-panel {selectedPanel.width}">
                {#if selectedPanel.image}
                  <img src={selectedPanel.image} alt="Comic panel" class="panel-image" />
                {:else}
                  <div class="panel-placeholder">
                    <Image size={48} />
                    <p>Choose an asset to add to this panel</p>
                  </div>
                {/if}
                
                {#if selectedPanel.text}
                  <div class="balloon-text {selectedPanel.textPosition} {selectedPanel.textStyle}">
                    {selectedPanel.text}
                  </div>
                {/if}
              </div>
            </div>

            <div class="panel-controls">
              <div class="control-group">
                <label class="control-label">Panel Width</label>
                <select 
                  bind:value={selectedPanel.width}
                  class="control-select"
                >
                  <option value="full">Full Width</option>
                  <option value="half">Half Width</option>
                  <option value="third">One Third</option>
                </select>
              </div>

              <div class="control-group">
                <label class="control-label">Text Position</label>
                <select 
                  bind:value={selectedPanel.textPosition}
                  class="control-select"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="center">Center</option>
                </select>
              </div>

              <div class="control-group">
                <label class="control-label">Text Style</label>
                <select 
                  bind:value={selectedPanel.textStyle}
                  class="control-select"
                >
                  <option value="speech">Speech</option>
                  <option value="thought">Thought</option>
                  <option value="narration">Narration</option>
                </select>
              </div>

              <div class="control-group">
                <label class="control-label">Text Content</label>
                <textarea
                  bind:value={selectedPanel.text}
                  placeholder="Enter text for this panel..."
                  class="control-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        {:else}
          <div class="empty-editor">
            <div class="empty-content">
              <Plus size={48} />
              <h3>Create Your First Panel</h3>
              <p>Start building your motion comic by adding panels</p>
              <button class="add-first-panel-btn" on:click={addPanel}>
                <Plus size={16} />
                Add Panel
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Asset Library Modal -->
    {#if showAssetLibrary}
      <div class="modal-overlay" on:click={closeAssetLibrary}>
        <div class="modal-content" on:click|stopPropagation>
          <AssetSelector 
            on:select={handleAssetSelect}
            on:close={handleAssetSelectorClose}
          />
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .retry-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .create-container {
    min-height: 100vh;
    background: #f8fafc;
  }

  .create-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1.5rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .page-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .save-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .save-btn:hover:not(:disabled) {
    background: #5a67d8;
  }

  .save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .comic-title-section {
    max-width: 400px;
  }

  .title-label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .title-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .create-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    min-height: calc(100vh - 200px);
  }

  .sidebar {
    background: white;
    border-right: 1px solid #e5e7eb;
    padding: 1.5rem;
  }

  .sidebar-section {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .add-panel-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 1rem;
  }

  .add-panel-btn:hover {
    background: #e5e7eb;
  }

  .panels-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .panel-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .panel-item:hover {
    background: #f9fafb;
  }

  .panel-item.selected {
    background: #eef2ff;
    border-color: #667eea;
  }

  .panel-preview {
    width: 40px;
    height: 40px;
    background: #f3f4f6;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .panel-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .panel-placeholder {
    color: #9ca3af;
  }

  .panel-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .panel-number {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .panel-size {
    color: #6b7280;
    font-size: 0.75rem;
  }

  .panel-actions {
    display: flex;
    gap: 0.25rem;
  }

  .action-btn {
    padding: 0.25rem;
    background: #f3f4f6;
    border: none;
    border-radius: 0.25rem;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s ease;
  }

  .action-btn:hover:not(:disabled) {
    background: #e5e7eb;
    color: #374151;
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-btn.delete {
    color: #dc2626;
  }

  .action-btn.delete:hover {
    background: #fee2e2;
  }

  .editor {
    background: white;
    padding: 1.5rem;
  }

  .panel-editor {
    max-width: 800px;
    margin: 0 auto;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .editor-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .asset-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #667eea;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .asset-btn:hover {
    background: #5a67d8;
  }

  .panel-canvas {
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
  }

  .comic-panel {
    background: #f9fafb;
    border: 2px dashed #d1d5db;
    border-radius: 0.75rem;
    position: relative;
    overflow: hidden;
  }

  .comic-panel.full {
    width: 100%;
    max-width: 600px;
    aspect-ratio: 16/9;
  }

  .comic-panel.half {
    width: 100%;
    max-width: 300px;
    aspect-ratio: 4/3;
  }

  .comic-panel.third {
    width: 100%;
    max-width: 200px;
    aspect-ratio: 1/1;
  }

  .panel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .balloon-text {
    position: absolute;
    padding: 0.75rem;
    background: white;
    border: 2px solid #374151;
    border-radius: 1rem;
    font-weight: 500;
    max-width: 80%;
    word-wrap: break-word;
  }

  .balloon-text.top-left { top: 1rem; left: 1rem; }
  .balloon-text.top-right { top: 1rem; right: 1rem; }
  .balloon-text.bottom-left { bottom: 1rem; left: 1rem; }
  .balloon-text.bottom-right { bottom: 1rem; right: 1rem; }
  .balloon-text.center { top: 50%; left: 50%; transform: translate(-50%, -50%); }

  .balloon-text.thought {
    border-style: dashed;
    border-radius: 50%;
  }

  .balloon-text.narration {
    background: #f3f4f6;
    border: none;
    border-radius: 0.5rem;
  }

  .panel-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .control-label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .control-select,
  .control-textarea {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .control-textarea {
    resize: vertical;
    min-height: 80px;
  }

  .empty-editor {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .empty-content {
    text-align: center;
    color: #6b7280;
  }

  .empty-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin: 1rem 0 0.5rem 0;
  }

  .add-first-panel-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1rem;
  }

  .add-first-panel-btn:hover {
    background: #5a67d8;
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
    max-width: 800px;
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
    font-size: 1.25rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .modal-body {
    padding: 0;
  }

  @media (max-width: 768px) {
    .create-layout {
      grid-template-columns: 1fr;
    }

    .sidebar {
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
    }

    .panel-controls {
      grid-template-columns: 1fr;
    }
  }
</style>