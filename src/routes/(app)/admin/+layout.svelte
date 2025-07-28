<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { apiClient } from '$lib/api/client';

	type IconType =
		| 'dashboard'
		| 'users'
		| 'price'
		| 'chart'
		| 'bill'
		| 'payment'
		| 'report'
		| 'admin';

	let userType: 'admin' | 'customer' | null = null;
	let isMenuOpen = false;

	const adminNavItems: Array<{ href: string; label: string; icon: IconType }> = [
		{ href: '/admin', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/admin/pelanggan', label: 'Pelanggan', icon: 'users' },
		{ href: '/admin/tarif', label: 'Tarif', icon: 'price' },
		{ href: '/admin/penggunaan', label: 'Penggunaan', icon: 'chart' },
		{ href: '/admin/tagihan', label: 'Tagihan', icon: 'bill' },
		{ href: '/admin/pembayaran', label: 'Pembayaran', icon: 'payment' },
		{ href: '/admin/laporan', label: 'Laporan', icon: 'report' },
		{ href: '/admin/users', label: 'Manage Admin', icon: 'admin' }
	];

	onMount(() => {
		userType = apiClient.getUserType();

		// Only allow admin access
		if (userType !== 'admin') {
			goto('/login');
		}
	});

	function toggleMenu(): void {
		isMenuOpen = !isMenuOpen;
	}

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
			users: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>`,
			price: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>`,
			chart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`,
			bill: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
			payment: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>`,
			report: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
			admin: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`
		};
		return icons[iconType] || icons.dashboard;
	}
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<div class="flex w-64 flex-col bg-white shadow-lg">
		<!-- Logo -->
		<div class="flex h-16 items-center justify-center bg-primary-600 px-4">
			<div class="flex items-center">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
					<span class="text-xl font-bold text-primary-600">P</span>
				</div>
				<span class="ml-2 text-xl font-bold text-white">Admin Panel</span>
			</div>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-2 px-4 py-4">
			{#each adminNavItems as item}
				<a
					href={item.href}
					class="flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
					class:bg-primary-100={$page.url.pathname === item.href}
					class:text-primary-700={$page.url.pathname === item.href}
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
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
						<span class="text-xs font-bold text-white">A</span>
					</div>
					<span class="ml-3 text-sm font-medium text-gray-700">Admin</span>
				</div>
				<button
					on:click={handleLogout}
					class="p-2 text-gray-400 transition-colors hover:text-red-600"
					title="Logout"
					aria-label="Logout"
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
				{adminNavItems.find((item) => item.href === $page.url.pathname)?.label || 'Dashboard'}
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
