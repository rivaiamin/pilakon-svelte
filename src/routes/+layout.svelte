<script>
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';
  import '../app.css';

  export let data;

  let { supabase: supabaseClient, session } = data;

  onMount(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
      session = _session;
    });

    return () => subscription.unsubscribe();
  });

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) console.error('Error:', error.message);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error:', error.message);
  }

  const navigationItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Explore', href: '/explore', icon: '🔍' },
    { name: 'Create', href: '/create', icon: '➕' },
    { name: 'Profile', href: '/profile', icon: '👤' }
  ];
</script>

<div class="app">
  <!-- Top App Bar (Mobile) / Top Navigation (Desktop) -->
  <header class="top-bar">
    <div class="top-bar-content">
      <div class="brand">
        <h1 class="brand-title">Pilakon</h1>
        <p class="brand-subtitle">Create Motion Comics</p>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        {#each navigationItems as item}
          <a 
            href={item.href} 
            class="nav-link"
            class:active={$page.url.pathname === item.href}
          >
            {item.name}
          </a>
        {/each}
        
        {#if session}
          <button on:click={signOut} class="auth-btn">Sign Out</button>
        {:else}
          <button on:click={signInWithGoogle} class="auth-btn">Sign In</button>
        {/if}
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-content">
    <slot />
  </main>

  <!-- Bottom Navigation (Mobile Only) -->
  <nav class="bottom-nav">
    {#each navigationItems as item}
      <a 
        href={item.href} 
        class="bottom-nav-item"
        class:active={$page.url.pathname === item.href}
      >
        <span class="nav-icon">{item.icon}</span>
        <span class="nav-label">{item.name}</span>
      </a>
    {/each}
  </nav>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8fafc;
  }

  /* Top App Bar */
  .top-bar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .top-bar-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand {
    display: flex;
    flex-direction: column;
  }

  .brand-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    line-height: 1;
  }

  .brand-subtitle {
    font-size: 0.75rem;
    opacity: 0.9;
    margin: 0;
    line-height: 1;
  }

  /* Desktop Navigation */
  .desktop-nav {
    display: none;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .auth-btn {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .auth-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  /* Main Content */
  .main-content {
    flex: 1;
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 5rem; /* Space for bottom navigation */
  }

  /* Bottom Navigation */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-around;
    padding: 0.5rem 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    text-decoration: none;
    color: #64748b;
    transition: all 0.2s ease;
    border-radius: 0.5rem;
    min-width: 60px;
  }

  .bottom-nav-item:hover {
    color: #667eea;
    background-color: #f1f5f9;
  }

  .bottom-nav-item.active {
    color: #667eea;
    background-color: #eef2ff;
  }

  .nav-icon {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }

  .nav-label {
    font-size: 0.75rem;
    font-weight: 500;
  }

  /* Desktop Styles */
  @media (min-width: 768px) {
    .top-bar-content {
      padding: 1.5rem 2rem;
    }

    .brand-title {
      font-size: 2rem;
    }

    .brand-subtitle {
      font-size: 0.875rem;
    }

    .desktop-nav {
      display: flex;
    }

    .main-content {
      padding: 2rem;
      padding-bottom: 2rem; /* Remove bottom padding on desktop */
    }

    .bottom-nav {
      display: none;
    }
  }

  @media (min-width: 1024px) {
    .top-bar-content {
      padding: 2rem;
    }

    .main-content {
      padding: 3rem 2rem;
    }
  }
</style>