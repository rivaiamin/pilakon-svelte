<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  let { session } = data;
  
  interface Comic {
    id: number;
    title: string;
    author?: string;
    views: number;
    likes: number;
    thumbnail: string;
  }
  
  const featuredComics: Comic[] = [
    { id: 1, title: 'The Adventures of Luna', author: '@creative_writer', views: 1200, likes: 89, thumbnail: '📚' },
    { id: 2, title: 'Space Odyssey 2024', author: '@space_artist', views: 856, likes: 67, thumbnail: '🚀' },
    { id: 3, title: 'Mystery Manor', author: '@mystery_maker', views: 2100, likes: 156, thumbnail: '🎭' },
    { id: 4, title: 'Dragon\'s Quest', author: '@fantasy_creator', views: 1800, likes: 134, thumbnail: '⚔️' }
  ];

  const userComics: Comic[] = [
    { id: 5, title: 'My First Comic', views: 234, likes: 12, thumbnail: '📖' },
    { id: 6, title: 'Adventure Story', views: 456, likes: 28, thumbnail: '🗺️' }
  ];

  const handleComicClick = (id: number): void => {
    goto(`/comic/${id}`);
  };
</script>

<svelte:head>
  <title>Home - Pilakon</title>
  <meta name="description" content="Create and share motion comics on Pilakon" />
</svelte:head>

<div class="home-container">
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">Create Amazing Motion Comics</h1>
      <p class="hero-subtitle">Bring your stories to life with interactive panels, animations, and immersive experiences</p>
      <div class="hero-actions">
        <a href="/create" class="primary-btn">Start Creating</a>
        <a href="/explore" class="secondary-btn">Explore Comics</a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="comic-preview">
        <div class="preview-panel">📚</div>
        <div class="preview-panel">🎨</div>
        <div class="preview-panel">🎬</div>
      </div>
    </div>
  </div>

  <!-- Quick Stats -->
  <div class="stats-section">
    <div class="stat-item">
      <div class="stat-number">1,250+</div>
      <div class="stat-label">Comics Created</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">15,000+</div>
      <div class="stat-label">Total Views</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">500+</div>
      <div class="stat-label">Active Creators</div>
    </div>
  </div>

  <!-- Featured Comics -->
  <div class="featured-section">
    <div class="section-header">
      <h2 class="section-title">Featured Comics</h2>
      <a href="/explore" class="view-all-link">View All →</a>
    </div>
    
    <div class="comics-grid">
      {#each featuredComics as comic}
        <div 
          class="comic-card" 
          role="button"
          tabindex="0"
          on:click={() => handleComicClick(comic.id)}
          on:keydown={(e) => e.key === 'Enter' && handleComicClick(comic.id)}
        >
          <div class="comic-thumbnail">
            <div class="thumbnail-placeholder">{comic.thumbnail}</div>
          </div>
          <div class="comic-info">
            <h3 class="comic-title">{comic.title}</h3>
            <p class="comic-author">{comic.author}</p>
            <div class="comic-stats">
              <span class="stat">👀 {comic.views}</span>
              <span class="stat">❤️ {comic.likes}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- User's Comics (if logged in) -->
  {#if session}
    <div class="my-comics-section">
      <div class="section-header">
        <h2 class="section-title">My Comics</h2>
        <a href="/create" class="create-btn">+ Create New</a>
      </div>
      
      {#if userComics.length > 0}
        <div class="comics-grid">
          {#each userComics as comic}
            <div 
          class="comic-card" 
          role="button"
          tabindex="0"
          on:click={() => handleComicClick(comic.id)}
          on:keydown={(e) => e.key === 'Enter' && handleComicClick(comic.id)}
        >
              <div class="comic-thumbnail">
                <div class="thumbnail-placeholder">{comic.thumbnail}</div>
              </div>
              <div class="comic-info">
                <h3 class="comic-title">{comic.title}</h3>
                <div class="comic-stats">
                  <span class="stat">👀 {comic.views}</span>
                  <span class="stat">❤️ {comic.likes}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <h3 class="empty-title">No comics yet</h3>
          <p class="empty-description">Start creating your first motion comic!</p>
          <a href="/create" class="primary-btn">Create Your First Comic</a>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Call to Action -->
  <div class="cta-section">
    <div class="cta-content">
      <h2 class="cta-title">Ready to Create?</h2>
      <p class="cta-description">Join thousands of creators bringing their stories to life with motion comics</p>
      <a href="/create" class="primary-btn large">Get Started Now</a>
    </div>
  </div>
</div>

<style>
  .home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Hero Section */
  .hero-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 4rem;
    padding: 2rem 0;
  }

  .hero-content {
    text-align: center;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 1rem 0;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: #64748b;
    margin: 0 0 2rem 0;
    line-height: 1.6;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .primary-btn {
    background: #667eea;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .primary-btn:hover {
    background: #5a67d8;
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }

  .primary-btn.large {
    padding: 1.25rem 2.5rem;
    font-size: 1.125rem;
  }

  .secondary-btn {
    background: white;
    color: #667eea;
    text-decoration: none;
    padding: 1rem 2rem;
    border: 2px solid #667eea;
    border-radius: 0.75rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .secondary-btn:hover {
    background: #667eea;
    color: white;
  }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .comic-preview {
    display: flex;
    gap: 1rem;
    transform: rotate(-5deg);
  }

  .preview-panel {
    width: 80px;
    height: 100px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }

  /* Stats Section */
  .stats-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .stat-item {
    text-align: center;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #64748b;
    font-weight: 500;
  }

  /* Featured Section */
  .featured-section,
  .my-comics-section {
    margin-bottom: 4rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .view-all-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .view-all-link:hover {
    color: #5a67d8;
  }

  .create-btn {
    background: #667eea;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .create-btn:hover {
    background: #5a67d8;
  }

  .comics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .comic-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }

  .comic-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .comic-thumbnail {
    aspect-ratio: 16/9;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumbnail-placeholder {
    font-size: 3rem;
    opacity: 0.7;
  }

  .comic-info {
    padding: 1.5rem;
  }

  .comic-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  .comic-author {
    color: #64748b;
    font-size: 0.875rem;
    margin: 0 0 1rem 0;
  }

  .comic-stats {
    display: flex;
    gap: 1rem;
  }

  .stat {
    font-size: 0.875rem;
    color: #64748b;
  }

  /* Empty State */
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

  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  .empty-description {
    color: #64748b;
    margin: 0 0 2rem 0;
  }

  /* CTA Section */
  .cta-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    border-radius: 1rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .cta-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .cta-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
  }

  .cta-description {
    font-size: 1.125rem;
    opacity: 0.9;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }

  /* Responsive Design */
  @media (min-width: 768px) {
    .hero-section {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }

    .hero-content {
      text-align: left;
    }

    .hero-title {
      font-size: 3.5rem;
    }

    .hero-actions {
      justify-content: flex-start;
    }

    .stats-section {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .stats-section {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .section-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .comics-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
</style>