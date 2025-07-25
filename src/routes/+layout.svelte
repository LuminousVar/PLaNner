<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isMenuOpen = false;

	const navItems = [
		{ href: '/', label: 'Beranda' },
		{ href: '/about', label: 'Tentang' },
		{ href: '/tarif', label: 'Tarif' },
		{ href: '/login', label: 'Login' },
		{ href: '/register', label: 'Register' }
	];

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<svelte:head>
	<title>PLaNner - Pembayaran Listrik Pasca Bayar</title>
	<meta
		name="description"
		content="Sistem pembayaran listrik pasca bayar yang mudah dan terpercaya"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="sticky top-0 z-50 bg-white shadow-lg">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex items-center">
					<a href="/" class="flex flex-shrink-0 items-center">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
							<span class="text-xl font-bold text-white">P</span>
						</div>
						<span class="ml-2 text-xl font-bold text-gray-900">PLaNner</span>
					</a>
				</div>

				<!-- Desktop Navigation -->
				<div class="hidden items-center space-x-8 md:flex">
					{#each navItems as item}
						<a
							href={item.href}
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary-600"
							class:text-primary-600={$page.url.pathname === item.href}
							class:font-semibold={$page.url.pathname === item.href}
						>
							{item.label}
						</a>
					{/each}
					<!-- <a href="/admin" class="btn btn-primary text-sm"> Admin </a> -->
				</div>

				<!-- Mobile menu button -->
				<div class="flex items-center md:hidden">
					<button
						on:click={toggleMenu}
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
					>
						<svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
							{#if isMenuOpen}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							{:else}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							{/if}
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if isMenuOpen}
			<div class="md:hidden">
				<div class="space-y-1 border-t bg-white px-2 pt-2 pb-3 sm:px-3">
					{#each navItems as item}
						<a
							href={item.href}
							on:click={closeMenu}
							class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
							class:text-primary-600={$page.url.pathname === item.href}
							class:bg-primary-50={$page.url.pathname === item.href}
						>
							{item.label}
						</a>
					{/each}
					<a
						href="/admin"
						on:click={closeMenu}
						class="block px-3 py-2 font-medium text-primary-600"
					>
						Admin Login
					</a>
				</div>
			</div>
		{/if}
	</nav>

	<!-- Main Content -->
	<main>
		<slot />
	</main>

	<!-- Footer -->
	<footer class="bg-gray-900 text-white">
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- Brand Section -->
				<div class="md:col-span-2">
					<div class="mb-4 flex items-center">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
							<span class="text-xl font-bold text-white">P</span>
						</div>
						<span class="ml-2 text-xl font-bold">PLaNner</span>
					</div>
					<p class="mb-6 max-w-md text-gray-300">
						Sistem pembayaran listrik pasca bayar yang mudah dan terpercaya.
					</p>

					<!-- Tech Stack -->
					<div class="flex flex-wrap gap-2">
						<span class="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">Elysia JS</span>
						<span class="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">SvelteKit</span>
						<span class="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">TailwindCSS</span>
					</div>
				</div>

				<!-- Links & Contact -->
				<div>
					<h3 class="mb-4 text-sm font-semibold tracking-wide text-gray-400">Links</h3>
					<div class="space-y-3">
						<a href="/" class="block text-gray-300 transition-colors hover:text-white">Beranda</a>
						<a href="/about" class="block text-gray-300 transition-colors hover:text-white"
							>Tentang</a
						>
						<a href="/tarif" class="block text-gray-300 transition-colors hover:text-white">Tarif</a
						>
						<a href="/login" class="block text-gray-300 transition-colors hover:text-white">Login</a
						>
					</div>

					<div class="mt-6 border-t border-gray-800 pt-6">
						<p class="mb-2 text-sm text-gray-400">Developer</p>
						<p class="font-medium text-white">Reyhan Al Farel</p>
						<a
							href="mailto:farelreyhan29@gmail.com"
							class="text-sm text-gray-300 transition-colors hover:text-primary-400"
						>
							farelreyhan29@gmail.com
						</a>
					</div>
				</div>
			</div>

			<!-- Bottom -->
			<div
				class="mt-8 flex flex-col items-center justify-between border-t border-gray-800 pt-6 sm:flex-row"
			>
				<p class="text-sm text-gray-400">&copy; 2025 PLaNner. Dibuat oleh Reyhan Al Farel.</p>
				<div class="mt-2 flex items-center space-x-4 sm:mt-0">
					<a
						href="https://github.com/LuminousVar"
						target="_blank"
						rel="noopener noreferrer"
						class="text-gray-400 transition-colors hover:text-white"
					>
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
					</a>
					<span class="text-xs text-gray-500">v1.0.0</span>
				</div>
			</div>
		</div>
	</footer>
</div>
