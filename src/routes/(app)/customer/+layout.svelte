<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { apiClient } from '$lib/api/client';

	type IconType = 'dashboard' | 'bill' | 'payment' | 'chart' | 'user';

	let userType: 'admin' | 'customer' | null = null;
	let isMenuOpen = false;

	const customerNavItems: Array<{ href: string; label: string; icon: IconType }> = [
		{ href: '/customer', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/customer/tagihan', label: 'Tagihan Saya', icon: 'bill' },
		{ href: '/customer/payment', label: 'Pembayaran', icon: 'payment' },
		{ href: '/customer/penggunaan', label: 'Riwayat Penggunaan', icon: 'chart' },
		{ href: '/customer/profile', label: 'Profil', icon: 'user' }
	];

	onMount(() => {
		console.log('=== Layout Mount Debug ===');
		console.log('Current URL:', $page.url.pathname);
		console.log('localStorage user_type:', localStorage.getItem('user_type'));
		console.log('typeof localStorage value:', typeof localStorage.getItem('user_type'));

		userType = apiClient.getUserType();
		console.log('getUserType() result:', userType);
		console.log('userType === "customer":', userType === 'customer');
		console.log('userType !== "customer":', userType !== 'customer');

		if (userType !== 'customer') {
			console.log('🚨 REDIRECTING TO LOGIN because userType is not customer');
			goto('/login');
		} else {
			console.log('✅ Access granted as customer');
		}
	});

	async function handleLogout(): Promise<void> {
		try {
			await apiClient.logout();
			goto('/');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function getIcon(iconType: IconType): string {
		const icons: Record<IconType, string> = {
			dashboard: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>`,
			bill: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
			payment: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>`,
			chart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`,
			user: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>`
		};
		return icons[iconType] || icons.dashboard;
	}
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<div class="flex w-64 flex-col bg-white shadow-lg">
		<!-- Logo -->
		<div class="flex h-16 items-center justify-center bg-blue-600 px-4">
			<div class="flex items-center">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
					<span class="text-xl font-bold text-blue-600">P</span>
				</div>
				<span class="ml-2 text-xl font-bold text-white">Customer</span>
			</div>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-2 px-4 py-4">
			{#each customerNavItems as item}
				<a
					href={item.href}
					class="flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
					class:bg-blue-100={$page.url.pathname === item.href}
					class:text-blue-700={$page.url.pathname === item.href}
					class:text-gray-600={$page.url.pathname !== item.href}
					class:hover:bg-gray-100={$page.url.pathname !== item.href}
				>
					<svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{@html getIcon(item.icon)}
					</svg>
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- User Info & Logout -->
		<div class="border-t border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
						<span class="text-xs font-bold text-white">C</span>
					</div>
					<span class="ml-3 text-sm font-medium text-gray-700">Customer</span>
				</div>
				<button
					on:click={handleLogout}
					class="p-2 text-gray-400 transition-colors hover:text-red-600"
					title="Logout"
					aria-label="Logout button"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Bar -->
		<header class="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
			<h1 class="text-xl font-semibold text-gray-800">
				{customerNavItems.find((item) => item.href === $page.url.pathname)?.label || 'Dashboard'}
			</h1>

			<div class="flex items-center space-x-4">
				<span class="text-sm text-gray-500">
					{new Date().toLocaleDateString('id-ID', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</span>
			</div>
		</header>

		<!-- Page Content -->
		<main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
			<slot />
		</main>
	</div>
</div>
