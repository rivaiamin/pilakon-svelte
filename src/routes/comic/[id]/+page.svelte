<script>
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';

  const comic = {
    id: $page.params.id,
    title: 'Sample Comic',
    panels: [
      {
        id: 1,
        image: 'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg',
        text: 'Once upon a time...',
        width: 'full',
        textPosition: 'bottom-right'
      },
      {
        id: 2,
        image: 'https://images.pexels.com/photos/5477775/pexels-photo-5477775.jpeg',
        text: 'An adventure began!',
        width: 'half',
        textPosition: 'top-left'
      },
      {
        id: 3,
        image: 'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg',
        text: 'In a magical world...',
        width: 'half',
        textPosition: 'bottom-left'
      },
      {
        id: 4,
        image: 'https://images.pexels.com/photos/5477775/pexels-photo-5477775.jpeg',
        text: 'Where anything was possible!',
        width: 'third',
        textPosition: 'top-right'
      },
      {
        id: 5,
        image: 'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg',
        text: 'The journey continues...',
        width: 'third',
        textPosition: 'bottom-right'
      },
      {
        id: 6,
        image: 'https://images.pexels.com/photos/5477775/pexels-photo-5477775.jpeg',
        text: 'To be continued!',
        width: 'third',
        textPosition: 'top-left'
      }
    ]
  };
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet">
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="comic-title">{comic.title}</h1>

  <div class="comic-container">
    {#each comic.panels as panel (panel.id)}
      <div 
        class="comic-panel {panel.width}"
        transition:fade
      >
        <img 
          src={panel.image} 
          alt="Comic panel"
        />
        <div class="balloon-text {panel.textPosition}">
          {panel.text}
        </div>
      </div>
    {/each}
  </div>
</div>