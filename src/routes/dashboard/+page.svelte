<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/supabase.js';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { User } from '$lib/types';

  let user: User | null = null;
  let loading: boolean = true;
  let error: string = '';

  onMount(async () => {
    try {
      const { user: currentUser, error: userError } = await auth.getCurrentUser();
      
      if (userError) {
        error = 'Failed to load user data';
        loading = false;
        return;
      }

      if (!currentUser) {
        goto('/login');
        return;
      }

      user = currentUser;
    } catch (err) {
      error = 'An unexpected error occurred';
    } finally {
      loading = false;
    }
  });

  async function handleSignOut() {
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      goto('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Pilakon</title>
  <meta name="description" content="Your Pilakon dashboard - manage your motion comics" />
</svelte:head>

{#if loading}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading dashboard...</p>
    </div>
  </div>
{:else if error}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
        <p class="text-red-600">{error}</p>
        <button 
          on:click={() => goto('/login')} 
          class="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Pilakon</h1>
            <span class="ml-2 text-sm text-gray-500">Motion Comic Platform</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Welcome, {user?.email}</span>
            <button
              on:click={handleSignOut}
              class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to your Dashboard</h2>
        <p class="text-lg text-gray-600">
          Start creating amazing motion comics with our intuitive tools and extensive asset library.
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Create New Comic -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 ml-3">Create New Comic</h3>
          </div>
          <p class="text-gray-600 mb-4">Start a new motion comic project with our easy-to-use editor.</p>
          <button 
            on:click={() => goto('/create')}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Start Creating
          </button>
        </div>

        <!-- Browse Assets -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-green-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 ml-3">Browse Assets</h3>
          </div>
          <p class="text-gray-600 mb-4">Explore our library of characters, backgrounds, and effects.</p>
          <button 
            on:click={() => goto('/explore')}
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Browse Assets
          </button>
        </div>

        <!-- My Comics -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-purple-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 ml-3">My Comics</h3>
          </div>
          <p class="text-gray-600 mb-4">View and manage your existing comic projects.</p>
          <button 
            on:click={() => goto('/profile')}
            class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            View My Comics
          </button>
        </div>
      </div>

      <!-- Getting Started -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Getting Started</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">1. Create Your First Comic</h4>
            <p class="text-gray-600 text-sm">Start with our easy-to-use comic creator. Drag and drop assets, add text balloons, and create engaging stories.</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">2. Explore the Asset Library</h4>
            <p class="text-gray-600 text-sm">Browse our extensive library of characters, backgrounds, objects, and effects to bring your stories to life.</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">3. Add Scroll Animations</h4>
            <p class="text-gray-600 text-sm">Enhance your comics with smooth scroll-based animations and transitions that engage your readers.</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">4. Share Your Stories</h4>
            <p class="text-gray-600 text-sm">Publish your comics and share them with the world. Get feedback and build your audience.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
