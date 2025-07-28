<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { apiClient } from '$lib/api/client';

	let isAuthenticated = false;
	let userType = null;

	onMount(() => {
		checkAuth();
	});

	function checkAuth() {
		isAuthenticated = apiClient.isAuthenticated();
		userType = apiClient.getUserType();

		// Redirect to login if not authenticated
		if (!isAuthenticated) {
			goto('/login');
			return;
		}

		// Redirect to correct dashboard based on user type
		const currentPath = $page.url.pathname;
		if (userType === 'admin' && !currentPath.startsWith('/admin')) {
			goto('/admin');
		} else if (userType === 'customer' && !currentPath.startsWith('/customer')) {
			goto('/customer');
		}
	}

	// Check auth on page changes
	$: if ($page.url.pathname) {
		checkAuth();
	}
</script>

<!-- Only render if authenticated -->
{#if isAuthenticated}
	<slot />
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div class="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-primary-600"></div>
			<p class="mt-4 text-gray-600">Memeriksa autentikasi...</p>
		</div>
	</div>
{/if}
