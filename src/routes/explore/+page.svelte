<script>
  // Explore page for discovering motion comics and interactive content
</script>

<svelte:head>
  <title>Explore - Pilakon</title>
  <meta name="description" content="Discover amazing motion comics and interactive content on Pilakon" />
</svelte:head>

<div class="explore-container">
  <div class="page-header">
    <h1 class="page-title">Explore</h1>
    <p class="page-subtitle">Discover amazing motion comics and interactive content</p>
  </div>

  <div class="search-section">
    <div class="search-bar">
      <input 
        type="text" 
        placeholder="Search comics, creators, or topics..." 
        class="search-input"
      />
      <button class="search-btn">🔍</button>
    </div>
  </div>

  <div class="filters-section">
    <h2 class="section-title">Categories</h2>
    <div class="filter-chips">
      <button class="filter-chip active">All</button>
      <button class="filter-chip">Action</button>
      <button class="filter-chip">Comedy</button>
      <button class="filter-chip">Drama</button>
      <button class="filter-chip">Sci-Fi</button>
      <button class="filter-chip">Fantasy</button>
    </div>
  </div>

  <div class="trending-section">
    <h2 class="section-title">Trending Now</h2>
    <div class="comics-grid">
      <div class="comic-card">
        <div class="comic-thumbnail">
          <div class="placeholder-thumbnail">📚</div>
        </div>
        <div class="comic-info">
          <h3 class="comic-title">The Adventures of Luna</h3>
          <p class="comic-author">by @creative_writer</p>
          <div class="comic-stats">
            <span class="stat">👀 1.2k views</span>
            <span class="stat">❤️ 89 likes</span>
          </div>
        </div>
      </div>

      <div class="comic-card">
        <div class="comic-thumbnail">
          <div class="placeholder-thumbnail">🚀</div>
        </div>
        <div class="comic-info">
          <h3 class="comic-title">Space Odyssey 2024</h3>
          <p class="comic-author">by @space_artist</p>
          <div class="comic-stats">
            <span class="stat">👀 856 views</span>
            <span class="stat">❤️ 67 likes</span>
          </div>
        </div>
      </div>

      <div class="comic-card">
        <div class="comic-thumbnail">
          <div class="placeholder-thumbnail">🎭</div>
        </div>
        <div class="comic-info">
          <h3 class="comic-title">Mystery Manor</h3>
          <p class="comic-author">by @mystery_maker</p>
          <div class="comic-stats">
            <span class="stat">👀 2.1k views</span>
            <span class="stat">❤️ 156 likes</span>
          </div>
        </div>
      </div>

      <div class="comic-card">
        <div class="comic-thumbnail">
          <div class="placeholder-thumbnail">⚔️</div>
        </div>
        <div class="comic-info">
          <h3 class="comic-title">Dragon's Quest</h3>
          <p class="comic-author">by @fantasy_creator</p>
          <div class="comic-stats">
            <span class="stat">👀 1.8k views</span>
            <span class="stat">❤️ 134 likes</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="featured-section">
    <h2 class="section-title">Featured Creators</h2>
    <div class="creators-grid">
      <div class="creator-card">
        <div class="creator-avatar">👨‍🎨</div>
        <div class="creator-info">
          <h3 class="creator-name">@creative_writer</h3>
          <p class="creator-bio">Creating immersive stories with motion</p>
          <div class="creator-stats">
            <span class="stat">12 comics</span>
            <span class="stat">5.2k followers</span>
          </div>
        </div>
      </div>

      <div class="creator-card">
        <div class="creator-avatar">👩‍🚀</div>
        <div class="creator-info">
          <h3 class="creator-name">@space_artist</h3>
          <p class="creator-bio">Sci-fi adventures in motion</p>
          <div class="creator-stats">
            <span class="stat">8 comics</span>
            <span class="stat">3.8k followers</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .explore-container {
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

  .search-section {
    margin-bottom: 2rem;
  }

  .search-bar {
    display: flex;
    max-width: 500px;
    margin: 0 auto;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .search-input {
    flex: 1;
    padding: 1rem;
    border: none;
    outline: none;
    font-size: 1rem;
  }

  .search-btn {
    padding: 1rem;
    background: #667eea;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    transition: background-color 0.2s ease;
  }

  .search-btn:hover {
    background: #5a67d8;
  }

  .filters-section {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-chip {
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 2rem;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-chip:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .filter-chip.active {
    background: #667eea;
    border-color: #667eea;
    color: white;
  }

  .trending-section,
  .featured-section {
    margin-bottom: 3rem;
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
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }

  .comic-thumbnail {
    aspect-ratio: 16/9;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-thumbnail {
    font-size: 3rem;
    opacity: 0.5;
  }

  .comic-info {
    padding: 1rem;
  }

  .comic-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  .comic-author {
    color: #64748b;
    font-size: 0.875rem;
    margin: 0 0 0.75rem 0;
  }

  .comic-stats {
    display: flex;
    gap: 1rem;
  }

  .stat {
    font-size: 0.75rem;
    color: #64748b;
  }

  .creators-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .creator-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }

  .creator-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }

  .creator-avatar {
    width: 60px;
    height: 60px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .creator-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  .creator-bio {
    color: #64748b;
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
  }

  .creator-stats {
    display: flex;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .comics-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .creators-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
