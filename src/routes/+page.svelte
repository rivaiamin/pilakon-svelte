<script>
  import { goto } from '$app/navigation';
  
  const comics = [
    { id: 1, title: 'My First Comic', thumbnail: 'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg' },
    { id: 2, title: 'Adventure Time', thumbnail: 'https://images.pexels.com/photos/5477775/pexels-photo-5477775.jpeg' }
  ];

  const handleComicClick = (id) => {
    goto(`/comic/${id}`);
  };
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">My Comics</h1>
    <a href="/create" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Create New Comic
    </a>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each comics as comic}
      <div 
        class="comic-panel cursor-pointer"
        on:click={() => handleComicClick(comic.id)}
      >
        <img 
          src={comic.thumbnail} 
          alt={comic.title}
          class="w-full h-48 object-cover rounded-md mb-4"
        />
        <h2 class="text-xl font-semibold">{comic.title}</h2>
      </div>
    {/each}
  </div>
</div>