<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/supabase.js';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let loading = false;
  let error = '';

  // Redirect if already logged in
  onMount(() => {
    auth.getCurrentUser().then(({ user }) => {
      if (user) {
        goto('/dashboard');
      }
    });
  });

  async function handleLogin() {
    if (!email || !password) {
      error = 'Please fill in all fields';
      return;
    }

    loading = true;
    error = '';

    try {
      const { data, error: authError } = await auth.signIn(email, password);
      
      if (authError) {
        error = authError.message;
      } else {
        goto('/dashboard');
      }
    } catch (err) {
      error = 'An unexpected error occurred';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<svelte:head>
  <title>Login - Pilakon</title>
  <meta name="description" content="Login to your Pilakon account to start creating motion comics" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Pilakon</h1>
      <h2 class="text-xl text-center text-gray-600 mb-8">Motion Comic Platform</h2>
      <h3 class="text-2xl font-bold text-center text-gray-900">Sign in to your account</h3>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
          create a new account
        </a>
      </p>
    </div>

    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            on:keydown={handleKeydown}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={password}
            on:keydown={handleKeydown}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>
      </div>

      {#if error}
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-sm text-red-600">{error}</p>
        </div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          {:else}
            Sign in
          {/if}
        </button>
      </div>
    </form>

    <div class="text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
          Sign up here
        </a>
      </p>
    </div>
  </div>
</div>
