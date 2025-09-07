<script>
  import { page } from '$app/stores';
  
  export let data;
  
  let { session } = data;
  
  // Mock user data - in real app this would come from your backend
  let userProfile = {
    name: session?.user?.user_metadata?.full_name || 'User',
    email: session?.user?.email || 'user@example.com',
    avatar: session?.user?.user_metadata?.avatar_url || null,
    bio: 'Motion comic creator and storyteller',
    stats: {
      comicsCreated: 5,
      totalViews: 1250,
      followers: 89,
      following: 156
    },
    recentComics: [
      { id: 1, title: 'My First Comic', views: 234, likes: 12 },
      { id: 2, title: 'Adventure Story', views: 456, likes: 28 },
      { id: 3, title: 'Sci-Fi Tale', views: 189, likes: 15 }
    ]
  };
</script>

<svelte:head>
  <title>Profile - Pilakon</title>
  <meta name="description" content="Your Pilakon profile and created content" />
</svelte:head>

<div class="profile-container">
  {#if session}
    <div class="profile-header">
      <div class="profile-avatar">
        {#if userProfile.avatar}
          <img src={userProfile.avatar} alt="Profile" class="avatar-image" />
        {:else}
          <div class="avatar-placeholder">👤</div>
        {/if}
      </div>
      
      <div class="profile-info">
        <h1 class="profile-name">{userProfile.name}</h1>
        <p class="profile-email">{userProfile.email}</p>
        <p class="profile-bio">{userProfile.bio}</p>
        
        <div class="profile-actions">
          <button class="edit-profile-btn">Edit Profile</button>
          <button class="settings-btn">⚙️</button>
        </div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-item">
        <div class="stat-number">{userProfile.stats.comicsCreated}</div>
        <div class="stat-label">Comics</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{userProfile.stats.totalViews}</div>
        <div class="stat-label">Views</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{userProfile.stats.followers}</div>
        <div class="stat-label">Followers</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{userProfile.stats.following}</div>
        <div class="stat-label">Following</div>
      </div>
    </div>

    <div class="profile-content">
      <div class="content-tabs">
        <button class="tab-btn active">My Comics</button>
        <button class="tab-btn">Liked</button>
        <button class="tab-btn">Bookmarks</button>
      </div>

      <div class="comics-section">
        <h2 class="section-title">My Comics</h2>
        
        {#if userProfile.recentComics.length > 0}
          <div class="comics-grid">
            {#each userProfile.recentComics as comic}
              <div class="comic-card">
                <div class="comic-thumbnail">
                  <div class="placeholder-thumbnail">📚</div>
                </div>
                <div class="comic-info">
                  <h3 class="comic-title">{comic.title}</h3>
                  <div class="comic-stats">
                    <span class="stat">👀 {comic.views} views</span>
                    <span class="stat">❤️ {comic.likes} likes</span>
                  </div>
                  <div class="comic-actions">
                    <button class="action-btn">Edit</button>
                    <button class="action-btn">Share</button>
                    <button class="action-btn">Delete</button>
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
            <a href="/create" class="create-btn">Create Comic</a>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="login-prompt">
      <div class="login-content">
        <div class="login-icon">👤</div>
        <h2 class="login-title">Sign in to view your profile</h2>
        <p class="login-description">Create an account to start building your motion comics and track your progress.</p>
        <button class="login-btn" on:click={() => window.location.href = '/'}>Sign In</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .profile-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .profile-avatar {
    flex-shrink: 0;
  }

  .avatar-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: #64748b;
  }

  .profile-info {
    flex: 1;
  }

  .profile-name {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  .profile-email {
    color: #64748b;
    margin: 0 0 0.5rem 0;
  }

  .profile-bio {
    color: #475569;
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
  }

  .profile-actions {
    display: flex;
    gap: 1rem;
  }

  .edit-profile-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .edit-profile-btn:hover {
    background: #5a67d8;
  }

  .settings-btn {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1.25rem;
    transition: background-color 0.2s ease;
  }

  .settings-btn:hover {
    background: #e2e8f0;
  }

  .profile-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-item {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    color: #64748b;
    font-weight: 500;
  }

  .profile-content {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .content-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .tab-btn {
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }

  .tab-btn:hover {
    color: #667eea;
  }

  .tab-btn.active {
    color: #667eea;
    border-bottom-color: #667eea;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1.5rem 0;
  }

  .comics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .comic-card {
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
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
    font-size: 2.5rem;
    opacity: 0.5;
  }

  .comic-info {
    padding: 1rem;
  }

  .comic-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.75rem 0;
  }

  .comic-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stat {
    font-size: 0.875rem;
    color: #64748b;
  }

  .comic-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .action-btn:hover {
    background: #e2e8f0;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
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

  .create-btn {
    background: #667eea;
    color: white;
    text-decoration: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .create-btn:hover {
    background: #5a67d8;
  }

  .login-prompt {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
  }

  .login-content {
    text-align: center;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .login-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .login-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  .login-description {
    color: #64748b;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }

  .login-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .login-btn:hover {
    background: #5a67d8;
  }

  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .profile-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .comics-grid {
      grid-template-columns: 1fr;
    }

    .content-tabs {
      flex-wrap: wrap;
    }
  }
</style>
