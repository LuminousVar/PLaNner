<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/api/client';
	import { Formatter } from '$lib/utils/formatters';
	import type { PembayaranData, PaginatedResponse } from '$lib/types';

	interface PembayaranState {
		data: PembayaranData[];
		loading: boolean;
		error: string | null;
		currentPage: number;
		totalPages: number;
		totalItems: number;
		selectedBulan: string;
		selectedTahun: string;
	}

	let state: PembayaranState = {
		data: [],
		loading: true,
		error: null,
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		selectedBulan: '',
		selectedTahun: ''
	};

	// Generate year options (current year and previous 3 years)
	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

	// Month options
	const monthOptions = [
		{ value: '', label: 'Semua Bulan' },
		{ value: '01', label: 'Januari' },
		{ value: '02', label: 'Februari' },
		{ value: '03', label: 'Maret' },
		{ value: '04', label: 'April' },
		{ value: '05', label: 'Mei' },
		{ value: '06', label: 'Juni' },
		{ value: '07', label: 'Juli' },
		{ value: '08', label: 'Agustus' },
		{ value: '09', label: 'September' },
		{ value: '10', label: 'Oktober' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'Desember' }
	];

	onMount(async () => {
		await loadPembayaran();
	});

	async function loadPembayaran(page = 1): Promise<void> {
		state.loading = true;
		state.error = null;

		try {
			// Build filter string for bulan_bayar
			let bulanBayarFilter = '';
			if (state.selectedBulan && state.selectedTahun) {
				bulanBayarFilter = `${state.selectedBulan}/${state.selectedTahun}`;
			} else if (state.selectedTahun) {
				bulanBayarFilter = state.selectedTahun;
			}

			const response = await apiClient.getCustomerPembayaran(page, 10, bulanBayarFilter);

			if (response.success && response.data) {
				state.data = response.data.data;
				state.currentPage = response.data.pagination.current_page;
				state.totalPages = response.data.pagination.total_pages;
				state.totalItems = response.data.pagination.total_items;
			} else {
				state.error = response.message || 'Gagal memuat data pembayaran';
			}
		} catch (err) {
			console.error('Failed to load pembayaran:', err);
			state.error = 'Terjadi kesalahan saat memuat data pembayaran';
		} finally {
			state.loading = false;
		}
	}

	async function handleFilterChange(): Promise<void> {
		state.currentPage = 1;
		await loadPembayaran(1);
	}

	async function handlePageChange(page: number): Promise<void> {
		if (page >= 1 && page <= state.totalPages) {
			await loadPembayaran(page);
		}
	}

	function formatBulanBayar(bulanBayar: string): string {
		// Format: "MM/YYYY" or "Month YYYY"
		if (bulanBayar.includes('/')) {
			const [month, year] = bulanBayar.split('/');
			const monthNames = [
				'Januari',
				'Februari',
				'Maret',
				'April',
				'Mei',
				'Juni',
				'Juli',
				'Agustus',
				'September',
				'Oktober',
				'November',
				'Desember'
			];
			const monthIndex = parseInt(month) - 1;
			return `${monthNames[monthIndex]} ${year}`;
		}
		return bulanBayar;
	}

	function getPaymentMethod(pembayaran: PembayaranData): string {
		// This would depend on your payment method logic
		// For now, we'll use a simple logic based on biaya_admin
		if (pembayaran.biaya_admin === 0) {
			return 'Transfer Bank';
		} else if (pembayaran.biaya_admin <= 2500) {
			return 'Kantor Layanan';
		} else {
			return 'Mobile Payment';
		}
	}

	function getStatusColor(status = 'Lunas'): string {
		switch (status) {
			case 'Lunas':
				return 'bg-green-100 text-green-800';
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Gagal':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// Calculate total pembayaran for current page
	$: totalPembayaranHalaman = state.data.reduce((sum, item) => sum + item.total_bayar, 0);
	$: totalBiayaAdmin = state.data.reduce((sum, item) => sum + item.biaya_admin, 0);
</script>

<svelte:head>
	<title>Riwayat Pembayaran - PLaNner Customer</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Riwayat Pembayaran</h1>
			<p class="text-gray-600">Lihat history pembayaran tagihan listrik Anda</p>
		</div>
	</div>

	<!-- Summary Stats -->
	{#if !state.loading && state.data.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Total Transaksi</dt>
							<dd class="text-lg font-medium text-gray-900">{state.totalItems}</dd>
						</dl>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Total Halaman Ini</dt>
							<dd class="text-lg font-medium text-gray-900">
								{Formatter.currency(totalPembayaranHalaman)}
							</dd>
						</dl>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Pembayaran Terakhir</dt>
							<dd class="text-sm font-medium text-gray-900">
								{state.data.length > 0
									? new Date(state.data[0].tanggal_pembayaran).toLocaleDateString('id-ID')
									: 'Belum ada'}
							</dd>
						</dl>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-orange-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Total Biaya Admin</dt>
							<dd class="text-sm font-medium text-gray-900">
								{Formatter.currency(totalBiayaAdmin)}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Filters -->
	<div class="rounded-lg bg-white p-6 shadow">
		<h3 class="mb-4 text-lg font-medium text-gray-900">Filter Pembayaran</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
			<div>
				<label for="bulan" class="block text-sm font-medium text-gray-700">Bulan</label>
				<select
					id="bulan"
					bind:value={state.selectedBulan}
					on:change={handleFilterChange}
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				>
					{#each monthOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="tahun" class="block text-sm font-medium text-gray-700">Tahun</label>
				<select
					id="tahun"
					bind:value={state.selectedTahun}
					on:change={handleFilterChange}
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">Semua Tahun</option>
					{#each yearOptions as year}
						<option value={year.toString()}>{year}</option>
					{/each}
				</select>
			</div>

			<div class="flex items-end">
				<button
					on:click={() => {
						state.selectedBulan = '';
						state.selectedTahun = '';
						handleFilterChange();
					}}
					class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Reset Filter
				</button>
			</div>

			<div class="flex items-end">
				<button
					on:click={() => loadPembayaran(state.currentPage)}
					class="w-full rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Refresh Data
				</button>
			</div>
		</div>
	</div>

	<!-- Content -->
	{#if state.loading}
		<div class="flex h-48 items-center justify-center rounded-lg bg-white shadow">
			<div class="text-center">
				<div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Memuat riwayat pembayaran...</p>
			</div>
		</div>
	{:else if state.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-6">
			<div class="flex">
				<svg
					class="mr-3 h-5 w-5 text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div>
					<h3 class="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
					<p class="mt-1 text-sm text-red-700">{state.error}</p>
				</div>
			</div>
			<div class="mt-4">
				<button
					on:click={() => loadPembayaran(state.currentPage)}
					class="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
				>
					Coba Lagi
				</button>
			</div>
		</div>
	{:else if state.data.length === 0}
		<div class="rounded-lg bg-white p-12 text-center shadow">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada pembayaran</h3>
			<p class="mt-1 text-sm text-gray-500">
				{state.selectedBulan || state.selectedTahun
					? 'Tidak ada pembayaran untuk filter yang dipilih.'
					: 'Belum ada riwayat pembayaran yang tersedia.'}
			</p>
		</div>
	{:else}
		<!-- Pembayaran Cards -->
		<div class="space-y-4">
			{#each state.data as pembayaran, index}
				<div class="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="flex items-center justify-between">
								<h3 class="text-lg font-medium text-gray-900">
									<span class="mr-2">#{pembayaran.id_pembayaran}</span>
									Pembayaran {formatBulanBayar(pembayaran.bulan_bayar)}
								</h3>
								<div class="flex items-center space-x-2">
									<span
										class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusColor(
											'Lunas'
										)}"
									>
										✓ Lunas
									</span>
									<span
										class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
									>
										{getPaymentMethod(pembayaran)}
									</span>
								</div>
							</div>

							<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
								<div>
									<p class="text-sm font-medium text-gray-500">Tanggal Pembayaran</p>
									<p class="mt-1 text-sm text-gray-900">
										{new Date(pembayaran.tanggal_pembayaran).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</p>
									<p class="text-xs text-gray-500">
										{new Date(pembayaran.tanggal_pembayaran).toLocaleTimeString('id-ID', {
											hour: '2-digit',
											minute: '2-digit'
										})} WIB
									</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Biaya Admin</p>
									<p class="mt-1 text-sm text-gray-900">
										{pembayaran.biaya_admin === 0
											? 'Gratis'
											: Formatter.currency(pembayaran.biaya_admin)}
									</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Total Pembayaran</p>
									<p class="mt-1 text-lg font-bold text-green-600">
										{Formatter.currency(pembayaran.total_bayar)}
									</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Petugas</p>
									<p class="mt-1 text-sm text-gray-900">
										{pembayaran.user?.nama_user || 'System Auto'}
									</p>
								</div>
							</div>

							<!-- Tagihan Info (if available) -->
							{#if pembayaran.tagihan}
								<div class="mt-4 rounded-md bg-gray-50 p-3">
									<div class="flex items-center justify-between">
										<div>
											<p class="text-xs font-medium text-gray-500">Detail Tagihan:</p>
											<p class="mt-1 text-sm text-gray-900">
												Penggunaan: <span class="font-medium"
													>{pembayaran.tagihan.jumlah_meter} kWh</span
												>
												untuk periode
												<span class="font-medium"
													>{pembayaran.tagihan.bulan}/{pembayaran.tagihan.tahun}</span
												>
											</p>
										</div>
										<div class="text-right">
											<p class="text-xs text-gray-500">Status Tagihan</p>
											<span
												class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
											>
												{pembayaran.tagihan.status}
											</span>
										</div>
									</div>
								</div>
							{/if}

							<!-- Payment Breakdown -->
							<div class="mt-4 rounded-md border border-gray-200 bg-white p-3">
								<p class="mb-2 text-xs font-medium text-gray-500">Rincian Pembayaran:</p>
								<div class="grid grid-cols-2 gap-2 text-sm">
									<div class="flex justify-between">
										<span class="text-gray-600">Tagihan Listrik:</span>
										<span class="font-medium"
											>{Formatter.currency(pembayaran.total_bayar - pembayaran.biaya_admin)}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-600">Biaya Admin:</span>
										<span class="font-medium">{Formatter.currency(pembayaran.biaya_admin)}</span>
									</div>
								</div>
								<div class="mt-2 border-t border-gray-200 pt-2">
									<div class="flex justify-between font-bold">
										<span>Total:</span>
										<span class="text-green-600">{Formatter.currency(pembayaran.total_bayar)}</span>
									</div>
								</div>
							</div>

							<div class="mt-4 flex items-center justify-between text-xs text-gray-500">
								<span>Transaksi #{pembayaran.id_pembayaran}</span>
								<span>
									{#if pembayaran.tagihan}
										Tagihan ID: #{pembayaran.tagihan.id_tagihan}
									{/if}
								</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		{#if state.totalPages > 1}
			<div class="rounded-lg bg-white px-6 py-4 shadow">
				<div class="flex items-center justify-between">
					<div class="text-sm text-gray-700">
						Menampilkan {(state.currentPage - 1) * 10 + 1} sampai {Math.min(
							state.currentPage * 10,
							state.totalItems
						)} dari {state.totalItems} pembayaran
					</div>
					<div class="flex space-x-2">
						<button
							on:click={() => handlePageChange(state.currentPage - 1)}
							disabled={state.currentPage <= 1}
							class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							← Sebelumnya
						</button>

						{#each Array.from({ length: Math.min(5, state.totalPages) }, (_, i) => {
							const start = Math.max(1, state.currentPage - 2);
							return start + i;
						}) as page}
							{#if page <= state.totalPages}
								<button
									on:click={() => handlePageChange(page)}
									class="rounded-md border px-3 py-2 text-sm font-medium {page === state.currentPage
										? 'border-blue-500 bg-blue-50 text-blue-600'
										: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
								>
									{page}
								</button>
							{/if}
						{/each}

						<button
							on:click={() => handlePageChange(state.currentPage + 1)}
							disabled={state.currentPage >= state.totalPages}
							class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Selanjutnya →
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
