<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/api/client';
	import { Formatter } from '$lib/utils/formatters';
	import type { LaporanPenggunaan } from '$lib/types';

	type PenggunaanItem = {
		id_penggunaan: number;
		id_pelanggan: number;
		bulan: string;
		tahun: string;
		meter_awal: number;
		meter_akhir: number;
		jumlah_kwh: number;
		pelanggan: {
			id_pelanggan: number;
			username: string;
			password: string;
			nomor_kwh: string;
			nama_pelanggan: string;
			alamat: string;
			id_tarif: number;
			tarif: {
				id_tarif: number;
				daya: number;
				tarif_perkwh: number;
			};
		};
	};

	let penggunaanData: PenggunaanItem[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		await loadPenggunaan();
	});

	async function loadPenggunaan(): Promise<void> {
		loading = true;
		error = null;

		try {
			const response = await apiClient.getCustomerLaporanPenggunaan({ limit: 12 });
			if (response.success && response.data) {
				const arr = Array.isArray(response.data) ? response.data : response.data.penggunaan;
				penggunaanData = arr.map((item: any) => ({
					...item,
					jumlah_kwh: item.meter_akhir - item.meter_awal
				}));
			} else {
				error = response.message || 'Gagal memuat data penggunaan';
			}
		} catch (err) {
			console.error('Failed to load penggunaan:', err);
			error = 'Terjadi kesalahan saat memuat data penggunaan';
		} finally {
			loading = false;
		}
	}

	function formatMonth(month: number): string {
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'Mei',
			'Jun',
			'Jul',
			'Agt',
			'Sep',
			'Okt',
			'Nov',
			'Des'
		];
		return months[month - 1] || month.toString();
	}

	// Calculate average usage
	$: averageUsage =
		penggunaanData.length > 0
			? penggunaanData.reduce((sum, item) => sum + item.jumlah_kwh, 0) / penggunaanData.length
			: 0;

	// Find highest and lowest usage
	$: highestUsage =
		penggunaanData.length > 0 ? Math.max(...penggunaanData.map((item) => item.jumlah_kwh)) : 0;

	$: lowestUsage =
		penggunaanData.length > 0 ? Math.min(...penggunaanData.map((item) => item.jumlah_kwh)) : 0;
</script>

<svelte:head>
	<title>Riwayat Penggunaan - PLaNner Customer</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Riwayat Penggunaan</h1>
			<p class="text-gray-600">Monitor penggunaan listrik bulanan Anda</p>
		</div>
	</div>

	{#if loading}
		<div class="flex h-48 items-center justify-center rounded-lg bg-white shadow">
			<div class="text-center">
				<div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Memuat data penggunaan...</p>
			</div>
		</div>
	{:else if error}
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
					<p class="mt-1 text-sm text-red-700">{error}</p>
				</div>
			</div>
			<div class="mt-4">
				<button
					on:click={loadPenggunaan}
					class="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
				>
					Coba Lagi
				</button>
			</div>
		</div>
	{:else if penggunaanData.length === 0}
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
					d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada data penggunaan</h3>
			<p class="mt-1 text-sm text-gray-500">Data penggunaan listrik belum tersedia.</p>
		</div>
	{:else}
		<!-- Statistics Cards -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Rata-rata Penggunaan</dt>
							<dd class="text-lg font-medium text-gray-900">{averageUsage.toFixed(0)} kWh</dd>
						</dl>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Penggunaan Tertinggi</dt>
							<dd class="text-lg font-medium text-gray-900">{highestUsage} kWh</dd>
						</dl>
					</div>
				</div>
			</div>

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
								d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Penggunaan Terendah</dt>
							<dd class="text-lg font-medium text-gray-900">{lowestUsage} kWh</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<!-- Usage History -->
		<div class="rounded-lg bg-white shadow">
			<div class="border-b border-gray-200 px-6 py-4">
				<h3 class="text-lg font-medium text-gray-900">Riwayat Penggunaan 12 Bulan Terakhir</h3>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Periode
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Penggunaan (kWh)
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Tarif per kWh
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Total Biaya
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each penggunaanData as usage}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
									{formatMonth(Number(usage.bulan))}
									{usage.tahun}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
									<div class="flex items-center">
										<span class="mr-2">{usage.meter_akhir - usage.meter_awal}</span>
										<div class="h-2 w-20 flex-1 rounded-full bg-gray-200">
											<div
												class="h-2 rounded-full bg-blue-600"
												style="width: {((usage.meter_akhir - usage.meter_awal) / highestUsage) *
													100}%"
											></div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
									{Formatter.currency(usage.pelanggan.tarif.tarif_perkwh)}
								</td>
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
									{Formatter.currency(
										(usage.meter_akhir - usage.meter_awal) * usage.pelanggan.tarif.tarif_perkwh
									)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
