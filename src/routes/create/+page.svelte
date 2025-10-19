<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';

  type Panel = {
    id: number | null;
    image: string;
    text: string;
    width: 'full' | 'half' | 'third';
    textPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    textStyle: 'normal' | 'narration' | 'shouting' | 'thinking';
  };
  
  let panels: Panel[] = [];
  let selectedPanelId: number | null = null;
  let currentPanel: Panel = {
    id: null,
    image: '',
    text: '',
    width: 'full',
    textPosition: 'bottom-right',
    textStyle: 'normal'
  };

  const textPositions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];

  const textStyles = [
    { value: 'normal', label: 'Normal' },
    { value: 'narration', label: 'Narration' },
    { value: 'shouting', label: 'Shouting' },
    { value: 'thinking', label: 'Thinking' },
    { value: 'whispering', label: 'Whispering' }
  ];

  const addPanel = () => {
    panels = [...panels, { ...currentPanel, id: Date.now() }];
    currentPanel = {
      id: null,
      image: '',
      text: '',
      width: 'full',
      textPosition: 'bottom-right',
      textStyle: 'normal'
    };
  };

  const removePanel = (id: number | null) => {
    panels = panels.filter(panel => panel.id !== id);
    if (selectedPanelId === id) {
      selectedPanelId = null;
    }
  };

  const handleDndConsider = (e: CustomEvent) => {
    panels = e.detail.items;
  };

  const handleDndFinalize = (e: CustomEvent) => {
    panels = e.detail.items;
  };

  const selectPanel = (id: number | null) => {
    selectedPanelId = id;
    const panel = panels.find(p => p.id === id);
    if (panel) {
      currentPanel = { ...panel };
    }
  };

  const updatePanel = () => {
    if (selectedPanelId) {
      panels = panels.map(panel => 
        panel.id === selectedPanelId ? { ...currentPanel, id: panel.id } : panel
      );
    }
  };

  const saveComic = () => {
    console.log('Saving comic:', panels);
  };
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet">
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="comic-title">Create New Comic</h1>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Preview Panel -->
    <div class="preview-panel">
      <h2 class="text-xl font-semibold mb-4">Preview</h2>
      <div 
        class="comic-panel {currentPanel.width} mb-4"
      >
        {#if currentPanel.image}
          <img 
            src={currentPanel.image} 
            alt="Comic panel preview"
          />
        {/if}
        {#if currentPanel.text}
          <div class="balloon-text {currentPanel.textPosition} {currentPanel.textStyle}">
            {currentPanel.text}
          </div>
        {/if}
      </div>
      <button 
        on:click={selectedPanelId ? updatePanel : addPanel}
        class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {selectedPanelId ? 'Update Panel' : 'Add Panel'}
      </button>
    </div>

    <!-- Panel Settings -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Image URL</label>
        <input 
          type="text" 
          bind:value={currentPanel.image}
          class="w-full p-2 border rounded"
          placeholder="Enter image URL"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Text</label>
        <textarea 
          bind:value={currentPanel.text}
          class="w-full p-2 border rounded"
          placeholder="Enter panel text"
        ></textarea>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Panel Width</label>
          <select 
            bind:value={currentPanel.width}
            class="w-full p-2 border rounded"
          >
            <option value="full">Full Width</option>
            <option value="half">Half Width</option>
            <option value="third">One Third Width</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Text Position</label>
          <select 
            bind:value={currentPanel.textPosition}
            class="w-full p-2 border rounded"
          >
            {#each textPositions as position}
              <option value={position.value}>{position.label}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Text Style</label>
          <select 
            bind:value={currentPanel.textStyle}
            class="w-full p-2 border rounded"
          >
            {#each textStyles as style}
              <option value={style.value}>{style.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>

  {#if panels.length > 0}
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Comic Panels</h2>
      <div
        use:dndzone={{items: panels}}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
        class="comic-container"
      >
        {#each panels as panel (panel.id)}
          <div 
            class="comic-panel {panel.width} {selectedPanelId === panel.id ? 'selected-panel' : ''}"
            on:click={() => selectPanel(panel.id)}
          >
            {#if panel.image}
              <img 
                src={panel.image} 
                alt="Comic panel"
              />
            {/if}
            <div class="balloon-text {panel.textPosition} {panel.textStyle}">
              {panel.text}
            </div>
            <button 
              on:click|stopPropagation={() => removePanel(panel.id)}
              class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
            >
              ×
            </button>
          </div>
        {/each}
      </div>
    </div>

    <div class="mt-8 text-center">
      <button 
        on:click={saveComic}
        class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
      >
        Save Comic
      </button>
    </div>
  {/if}
</div>