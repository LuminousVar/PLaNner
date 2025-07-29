<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/api/client';
	import { Formatter } from '$lib/utils/formatters';
	import type { TagihanData, PaginatedResponse } from '$lib/types';

	interface TagihanState {
		data: TagihanData[];
		loading: boolean;
		error: string | null;
		currentPage: number;
		totalPages: number;
		totalItems: number;
		selectedStatus: string;
		selectedBulan: string;
		selectedTahun: string;
	}

	let state: TagihanState = {
		data: [],
		loading: true,
		error: null,
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		selectedStatus: '',
		selectedBulan: '',
		selectedTahun: ''
	};

	// Generate year options (current year and previous 2 years)
	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);

	// Month options
	const monthOptions = [
		{ value: '', label: 'Semua Bulan' },
		{ value: '1', label: 'Januari' },
		{ value: '2', label: 'Februari' },
		{ value: '3', label: 'Maret' },
		{ value: '4', label: 'April' },
		{ value: '5', label: 'Mei' },
		{ value: '6', label: 'Juni' },
		{ value: '7', label: 'Juli' },
		{ value: '8', label: 'Agustus' },
		{ value: '9', label: 'September' },
		{ value: '10', label: 'Oktober' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'Desember' }
	];

	onMount(loadTagihan);

	async function loadTagihan() {
		state.loading = true;
		state.error = null;
		try {
			const res = await apiClient.getCustomerTagihan(
				state.selectedStatus,
				state.selectedBulan,
				state.selectedTahun
			);
			if (res.success && res.data) {
				state.data = res.data;
			} else {
				state.error = res.message || 'Gagal memuat data tagihan';
			}
		} catch (e) {
			state.error = 'Terjadi kesalahan saat memuat data tagihan';
		} finally {
			state.loading = false;
		}
	}

	function handleFilterChange() {
		loadTagihan();
	}

	async function handlePageChange(page: number): Promise<void> {
		if (page >= 1 && page <= state.totalPages) {
			state.currentPage = page;
			await loadTagihan();
		}
	}

	function getStatusBadge(status: string): { class: string; text: string } {
		switch (status) {
			case 'Lunas':
				return {
					class: 'bg-green-100 text-green-800',
					text: 'Lunas'
				};
			case 'Belum Lunas':
				return {
					class: 'bg-red-100 text-red-800',
					text: 'Belum Lunas'
				};
			default:
				return {
					class: 'bg-gray-100 text-gray-800',
					text: status
				};
		}
	}

	function formatMonth(month: number): string {
		const months = [
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
		return months[month - 1] || month.toString();
	}

	function calculateTotal(tagihan: TagihanData): number {
		// Assuming tarif calculation: jumlah_meter * tarif_perkwh
		// You might need to adjust this based on your actual calculation logic
		const tarif = tagihan.pelanggan?.tarif?.tarif_perkwh || 0;
		return tagihan.jumlah_meter * tarif;
	}
</script>

<svelte:head>
	<title>Tagihan Saya - PLaNner Customer</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Tagihan Saya</h1>
			<p class="text-gray-600">Kelola dan pantau tagihan listrik Anda</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="rounded-lg bg-white p-6 shadow">
		<h3 class="mb-4 text-lg font-medium text-gray-900">Filter Tagihan</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
			<div>
				<label for="status" class="block text-sm font-medium text-gray-700">Status</label>
				<select
					id="status"
					bind:value={state.selectedStatus}
					on:change={handleFilterChange}
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">Semua Status</option>
					<option value="Lunas">Lunas</option>
					<option value="Belum Lunas">Belum Lunas</option>
				</select>
			</div>

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
						state.selectedStatus = '';
						state.selectedBulan = '';
						state.selectedTahun = '';
						handleFilterChange();
					}}
					class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Reset Filter
				</button>
			</div>
		</div>
	</div>

	<!-- Content -->
	{#if state.loading}
		<div class="flex h-48 items-center justify-center rounded-lg bg-white shadow">
			<div class="text-center">
				<div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Memuat tagihan...</p>
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
					on:click={() => loadTagihan()}
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
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada tagihan</h3>
			<p class="mt-1 text-sm text-gray-500">Belum ada tagihan yang tersedia saat ini.</p>
		</div>
	{:else}
		<!-- Tagihan Cards -->
		<div class="space-y-4">
			{#each state.data as tagihan}
				<div class="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<div class="flex items-center justify-between">
								<h3 class="text-lg font-medium text-gray-900">
									Tagihan {formatMonth(tagihan.bulan)}
									{tagihan.tahun}
								</h3>
								<span
									class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {getStatusBadge(
										tagihan.status
									).class}"
								>
									{getStatusBadge(tagihan.status).text}
								</span>
							</div>

							<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
								<div>
									<p class="text-sm font-medium text-gray-500">Penggunaan</p>
									<p class="mt-1 text-sm text-gray-900">{tagihan.jumlah_meter} kWh</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Tarif per kWh</p>
									<p class="mt-1 text-sm text-gray-900">
										{tagihan.pelanggan?.tarif?.tarif_perkwh
											? Formatter.currency(tagihan.pelanggan.tarif.tarif_perkwh)
											: 'N/A'}
									</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Total Tagihan</p>
									<p class="mt-1 text-lg font-bold text-gray-900">
										{Formatter.currency(calculateTotal(tagihan))}
									</p>
								</div>
							</div>

							<div class="mt-4 text-xs text-gray-500">
								Dibuat pada: {new Date(tagihan.created_at).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}
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
						)} dari {state.totalItems} tagihan
					</div>
					<div class="flex space-x-2">
						<button
							on:click={() => handlePageChange(state.currentPage - 1)}
							disabled={state.currentPage <= 1}
							class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Sebelumnya
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
							Selanjutnya
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
