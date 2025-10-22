<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/supabase.js';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let success = '';

  // Redirect if already logged in
  onMount(() => {
    auth.getCurrentUser().then(({ user }) => {
      if (user) {
        goto('/dashboard');
      }
    });
  });

  async function handleRegister() {
    if (!email || !password || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters long';
      return;
    }

    loading = true;
    error = '';
    success = '';

    try {
      const { data, error: authError } = await auth.signUp(email, password);
      
      if (authError) {
        error = authError.message;
      } else {
        success = 'Registration successful! Please check your email to verify your account.';
        // Clear form
        email = '';
        password = '';
        confirmPassword = '';
      }
    } catch (err) {
      error = 'An unexpected error occurred';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleRegister();
    }
  }
</script>

<svelte:head>
  <title>Register - Pilakon</title>
  <meta name="description" content="Create your Pilakon account to start creating motion comics" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Pilakon</h1>
      <h2 class="text-xl text-center text-gray-600 mb-8">Motion Comic Platform</h2>
      <h3 class="text-2xl font-bold text-center text-gray-900">Create your account</h3>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
          sign in to your existing account
        </a>
      </p>
    </div>

    <form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
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
            autocomplete="new-password"
            required
            bind:value={password}
            on:keydown={handleKeydown}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Create a password (min 6 characters)"
            disabled={loading}
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            bind:value={confirmPassword}
            on:keydown={handleKeydown}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>
      </div>

      {#if error}
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-sm text-red-600">{error}</p>
        </div>
      {/if}

      {#if success}
        <div class="bg-green-50 border border-green-200 rounded-md p-4">
          <p class="text-sm text-green-600">{success}</p>
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
            Creating account...
          {:else}
            Create account
          {/if}
        </button>
      </div>
    </form>

    <div class="text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
          Sign in here
        </a>
      </p>
    </div>
  </div>
</div>
