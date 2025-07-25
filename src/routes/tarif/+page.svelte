<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { apiClient } from '$lib/api/client';
	import { Formatter } from '$lib/utils/formatters';
	import { env } from '$lib/config/env';
	import type { TarifData, PaginatedResponse } from '$lib/types';

	type IconType = 'home' | 'shop' | 'building' | 'factory';

	let tarifData: TarifData[] = [];
	let loading = true;
	let error = '';
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;

	onMount(async () => {
		await loadTarifData();
	});

	async function loadTarifData(page = 1) {
		loading = true;
		error = '';

		try {
			const response = await apiClient.getTarif(page, 12);

			if (response.success && response.data) {
				const data = response.data as PaginatedResponse<TarifData>;
				tarifData = data.data;
				currentPage = data.pagination.current_page;
				totalPages = data.pagination.total_pages;
				totalItems = data.pagination.total_items;
			} else {
				error = 'Gagal memuat data tarif';
			}
		} catch (err) {
			error = 'Terjadi kesalahan koneksi';
		} finally {
			loading = false;
		}
	}

	async function handlePageChange(page: number) {
		if (page >= 1 && page <= totalPages) {
			await loadTarifData(page);
		}
	}

	function handleRegister() {
		goto('/register');
	}

	function getDayaCategory(daya: string): { label: string; color: string; icon: IconType } {
		const power = parseInt(daya.replace(/\D/g, ''));
		if (power <= 900) return { label: 'Rumah Tangga', color: 'blue', icon: 'home' as IconType };
		if (power <= 2200) return { label: 'Bisnis Kecil', color: 'green', icon: 'shop' as IconType };
		if (power <= 6600)
			return { label: 'Bisnis Menengah', color: 'yellow', icon: 'building' as IconType };
		return { label: 'Industri', color: 'purple', icon: 'factory' as IconType };
	}

	function getIconSvg(iconType: IconType): string {
		const icons: Record<IconType, string> = {
			home: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>`,
			shop: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>`,
			building: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>`,
			factory: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>`
		};
		return icons[iconType];
	}
</script>

<svelte:head>
	<title>Informasi Tarif Listrik - {env.APP_NAME}</title>
	<meta
		name="description"
		content="Lihat daftar tarif listrik yang tersedia dengan berbagai kategori daya dan harga per kWh"
	/>
</svelte:head>

<!-- Hero Section -->
<div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
	<!-- Background Pattern -->
	<div class="bg-opacity-20 absolute inset-0 bg-black"></div>
	<div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>

	<div class="relative container mx-auto px-4 py-20">
		<div class="text-center text-white">
			<div class="mb-6">
				<div
					class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					Tarif Terbaru 2025
				</div>
			</div>

			<h1 class="mb-6 text-5xl leading-tight font-bold">
				Pilih Tarif Listrik
				<span class="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
					Terbaik
				</span>
			</h1>

			<p class="mx-auto mb-8 max-w-3xl text-xl leading-relaxed opacity-90">
				Temukan paket tarif listrik yang sesuai dengan kebutuhan Anda. Dari rumah tangga hingga
				industri, kami punya solusi yang tepat.
			</p>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		{#if error}
			<div class="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
						<p class="mt-1 text-sm text-red-700">{error}</p>
					</div>
				</div>
			</div>
		{/if}

		{#if loading}
			<!-- Loading Skeleton -->
			<div class="mb-8 animate-pulse text-center">
				<div class="mx-auto mb-2 h-8 w-64 rounded bg-gray-200"></div>
				<div class="mx-auto h-4 w-96 rounded bg-gray-200"></div>
			</div>
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each Array(8) as _}
					<div class="animate-pulse rounded-2xl bg-white p-6 shadow-lg">
						<div class="mb-4 h-12 w-12 rounded-full bg-gray-200"></div>
						<div class="mb-2 h-6 w-20 rounded bg-gray-200"></div>
						<div class="mb-4 h-8 w-32 rounded bg-gray-200"></div>
						<div class="space-y-2">
							<div class="h-4 w-full rounded bg-gray-200"></div>
							<div class="h-4 w-3/4 rounded bg-gray-200"></div>
						</div>
						<div class="mt-6 h-10 w-full rounded bg-gray-200"></div>
					</div>
				{/each}
			</div>
		{:else if tarifData.length === 0}
			<!-- Empty State -->
			<div class="py-16 text-center">
				<div
					class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100"
				>
					<svg
						class="h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Tidak Ada Data Tarif</h3>
				<p class="mb-8 text-gray-600">Belum ada data tarif yang tersedia saat ini</p>
				<button
					on:click={() => loadTarifData()}
					class="rounded-full bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700 hover:shadow-lg"
				>
					Muat Ulang
				</button>
			</div>
		{:else}
			<!-- Results Header -->
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900">Paket Tarif Listrik</h2>
				<p class="text-lg text-gray-600">
					Tersedia {totalItems} paket tarif untuk berbagai kebutuhan
				</p>
			</div>

			<!-- Modern Tarif Cards -->
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each tarifData as tarif}
					{@const category = getDayaCategory(tarif.daya)}
					<div
						class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
					>
						<!-- Background Gradient -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-{category.color}-50 via-white to-{category.color}-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						></div>

						<!-- Content -->
						<div class="relative">
							<!-- Category Badge & Icon -->
							<div class="mb-4 flex items-center justify-between">
								<span
									class="inline-flex items-center rounded-full bg-{category.color}-100 px-3 py-1 text-xs font-semibold text-{category.color}-800"
								>
									{category.label}
								</span>
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-{category.color}-100 text-{category.color}-600 transition-transform duration-300 group-hover:scale-110"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{@html getIconSvg(category.icon)}
									</svg>
								</div>
							</div>

							<!-- Daya -->
							<div class="mb-4">
								<h3 class="text-2xl font-bold text-gray-900">{tarif.daya}</h3>
								<p class="text-sm text-gray-500">Daya Listrik</p>
							</div>

							<!-- Price -->
							<div class="mb-6">
								<div class="flex items-baseline">
									<span class="text-3xl font-bold text-gray-900">
										{Formatter.currency(tarif.tarif_perkwh).replace('Rp', '')}
									</span>
									<span class="ml-1 text-lg text-gray-500">per kWh</span>
								</div>
								<p class="text-sm text-gray-500">Tarif berlaku mulai 2025</p>
							</div>

							<!-- Features -->
							<div class="mb-6 space-y-3">
								<div class="flex items-center text-sm">
									<div
										class="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-100"
									>
										<svg
											class="h-3 w-3 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="3"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<span class="text-gray-700">Pembayaran Digital</span>
								</div>
								<div class="flex items-center text-sm">
									<div
										class="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-100"
									>
										<svg
											class="h-3 w-3 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="3"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<span class="text-gray-700">Monitor Real-time</span>
								</div>
								<div class="flex items-center text-sm">
									<div
										class="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-100"
									>
										<svg
											class="h-3 w-3 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="3"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<span class="text-gray-700">Laporan Bulanan</span>
								</div>
								<div class="flex items-center text-sm">
									<div
										class="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-100"
									>
										<svg
											class="h-3 w-3 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="3"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<span class="text-gray-700">Support 24/7</span>
								</div>
							</div>

							<!-- Action Button -->
							<button
								on:click={handleRegister}
								class="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
							>
								Pilih Paket Ini
							</button>

							<!-- Popular Badge -->
							{#if category.color === 'blue'}
								<div
									class="absolute -top-2 -right-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg"
								>
									Populer
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="mt-12 flex items-center justify-center space-x-2">
					<button
						on:click={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						class="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Previous
					</button>

					{#each Array(totalPages) as _, i}
						{@const page = i + 1}
						{#if page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)}
							<button
								on:click={() => handlePageChange(page)}
								class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {page ===
								currentPage
									? 'bg-blue-600 text-white shadow-lg'
									: 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}"
							>
								{page}
							</button>
						{:else if page === currentPage - 3 || page === currentPage + 3}
							<span class="px-3 py-2 text-gray-400">...</span>
						{/if}
					{/each}

					<button
						on:click={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						class="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Why Choose Us Section -->
<div class="bg-white py-20">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold text-gray-900">Kenapa Memilih PLaNner?</h2>
			<p class="mx-auto max-w-2xl text-lg text-gray-600">
				Pengalaman bertahun-tahun dalam industri listrik dengan teknologi terdepan
			</p>
		</div>

		<div class="grid gap-12 md:grid-cols-3">
			<div class="group text-center">
				<div
					class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 transition-transform duration-300 group-hover:scale-110"
				>
					<svg
						class="h-10 w-10 text-blue-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold text-gray-900">100% Transparan</h3>
				<p class="leading-relaxed text-gray-600">
					Tidak ada biaya tersembunyi. Semua tarif dan biaya ditampilkan dengan jelas sebelum Anda
					memutuskan.
				</p>
			</div>

			<div class="group text-center">
				<div
					class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-200 transition-transform duration-300 group-hover:scale-110"
				>
					<svg
						class="h-10 w-10 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold text-gray-900">Aktivasi Instan</h3>
				<p class="leading-relaxed text-gray-600">
					Proses pendaftaran dan aktivasi hanya membutuhkan waktu kurang dari 5 menit. Langsung bisa
					digunakan!
				</p>
			</div>

			<div class="group text-center">
				<div
					class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 transition-transform duration-300 group-hover:scale-110"
				>
					<svg
						class="h-10 w-10 text-purple-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold text-gray-900">Support Terbaik</h3>
				<p class="leading-relaxed text-gray-600">
					Tim customer service yang responsif dan siap membantu Anda 24/7 melalui berbagai channel
					komunikasi.
				</p>
			</div>
		</div>
	</div>
</div>
