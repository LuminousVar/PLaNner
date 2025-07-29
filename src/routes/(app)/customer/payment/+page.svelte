<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { apiClient } from '$lib/api/client';
	import type { TagihanData, PembayaranData, CreatePembayaranData } from '$lib/types';

	let tagihanBelumBayar: TagihanData[] = [];
	let riwayatPembayaran: PembayaranData[] = [];
	let loading = true;
	let error = '';
	let showPaymentModal = false;
	let selectedTagihan: TagihanData | null = null;
	let paymentMethod: 'bank' | 'cash' = 'bank';
	let processing = false;

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		try {
			loading = true;
			error = '';

			const tagihanResponse = await apiClient.getCustomerTagihan('Belum Bayar');
			if (tagihanResponse.success && tagihanResponse.data) {
				tagihanBelumBayar = tagihanResponse.data;
			} else {
				console.error('Failed to load tagihan:', tagihanResponse.message);
			}

			const pembayaranResponse = await apiClient.getCustomerPembayaran(1, 5);
			if (pembayaranResponse.success && pembayaranResponse.data) {
				// Fallback: jika data array ada di .data.data atau langsung .data
				riwayatPembayaran = Array.isArray(pembayaranResponse.data)
					? pembayaranResponse.data
					: (pembayaranResponse.data.data ?? []);
			} else {
				console.error('Failed to load pembayaran:', pembayaranResponse.message);
			}
		} catch (err) {
			console.error('Error loading data:', err);
			error = 'Gagal memuat data. Silakan coba lagi.';
		} finally {
			loading = false;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function openPaymentModal(tagihan: TagihanData): void {
		selectedTagihan = tagihan;
		showPaymentModal = true;
	}

	function closePaymentModal(): void {
		showPaymentModal = false;
		selectedTagihan = null;
		processing = false;
		paymentMethod = 'bank';
	}

	async function processPayment(): Promise<void> {
		if (!selectedTagihan) return;

		processing = true;

		try {
			const biayaAdmin = paymentMethod === 'bank' ? 0 : 2500;
			const totalBayar = calculateTotal(selectedTagihan) + biayaAdmin;

			const pembayaranData: CreatePembayaranData = {
				id_tagihan: selectedTagihan.id_tagihan,
				id_pelanggan: selectedTagihan.id_pelanggan,
				tanggal_pembayaran: new Date().toISOString().split('T')[0],
				bulan_bayar: `${selectedTagihan.bulan.toString().padStart(2, '0')}/${selectedTagihan.tahun}`,
				biaya_admin: biayaAdmin,
				total_bayar: totalBayar
			};

			const response = await apiClient.createCustomerPembayaran(pembayaranData);

			if (response.success) {
				const updateResponse = await apiClient.updateTagihanStatus(selectedTagihan.id_tagihan, {
					status: 'Lunas'
				});

				if (updateResponse.success) {
					await loadData();
					closePaymentModal();
					alert('Pembayaran berhasil diproses!');
				} else {
					throw new Error(updateResponse.message || 'Gagal update status tagihan');
				}
			} else {
				throw new Error(response.message || 'Pembayaran gagal');
			}
		} catch (err) {
			console.error('Payment error:', err);
			alert(`Pembayaran gagal: ${err instanceof Error ? err.message : 'Unknown error'}`);
		} finally {
			processing = false;
		}
	}

	function getMonthName(month: number): string {
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

	function calculateTotal(tagihan: any) {
		// Ambil jumlah_meter dan tarif_perkwh dari struktur data response API
		const jumlah_meter = tagihan.jumlah_meter ?? 0;
		const tarif_perkwh = tagihan.pelanggan?.tarif?.tarif_perkwh ?? 0;
		return jumlah_meter * tarif_perkwh;
	}
</script>

<svelte:head>
	<title>Pembayaran Tagihan - PLaNner Customer</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header Info -->
	<div class="rounded-lg bg-white p-6 shadow">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-2xl font-bold text-gray-900">Pembayaran Tagihan Listrik</h2>
				<p class="mt-1 text-gray-600">Bayar tagihan listrik Anda dengan mudah dan cepat</p>
			</div>
			<div class="text-right">
				<div class="text-sm text-gray-500">Tanggal Hari Ini</div>
				<div class="text-lg font-semibold text-gray-900">
					{new Date().toLocaleDateString('id-ID')}
				</div>
			</div>
		</div>
	</div>

	<!-- Loading State -->
	{#if loading}
		<div class="rounded-lg bg-white p-6 shadow">
			<div class="flex items-center justify-center py-12">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<span class="ml-3 text-gray-600">Memuat data...</span>
			</div>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="rounded-lg border border-red-200 bg-red-50 p-6">
			<div class="flex items-center">
				<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<p class="mt-1 text-sm text-red-700">{error}</p>
				</div>
				<button
					on:click={loadData}
					class="ml-auto rounded bg-red-100 px-3 py-1 text-sm text-red-800 hover:bg-red-200"
				>
					Coba Lagi
				</button>
			</div>
		</div>
	{:else}
		<!-- Tagihan Belum Bayar -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
				<svg
					class="mr-2 h-5 w-5 text-red-500"
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
				Tagihan Belum Dibayar ({tagihanBelumBayar.length})
			</h3>

			{#if tagihanBelumBayar.length === 0}
				<div class="py-12 text-center">
					<svg
						class="mx-auto h-12 w-12 text-green-400"
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
					<h4 class="mt-4 text-lg font-medium text-gray-900">Semua Tagihan Lunas!</h4>
					<p class="mt-2 text-gray-500">Tidak ada tagihan yang perlu dibayar saat ini.</p>
				</div>
			{:else}
				<div class="grid gap-4 md:grid-cols-2">
					{#each tagihanBelumBayar as tagihan}
						<div class="rounded-lg border border-red-200 bg-red-50 p-4">
							<div class="mb-3 flex items-start justify-between">
								<div>
									<h4 class="font-semibold text-gray-900">
										Tagihan {getMonthName(tagihan.bulan)}
										{tagihan.tahun}
									</h4>
									<span
										class="mt-1 inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-800"
									>
										{tagihan.status}
									</span>
								</div>
								<div class="text-right">
									<div class="text-2xl font-bold text-red-600">
										{formatCurrency(calculateTotal(tagihan))}
									</div>
								</div>
							</div>

							<div class="mb-4 grid grid-cols-2 gap-4 text-sm">
								<div>
									<div class="text-gray-500">Penggunaan</div>
									<div class="font-medium">{tagihan.jumlah_meter} kWh</div>
								</div>
								<div>
									<div class="text-gray-500">Tarif per kWh</div>
									<div class="font-medium">
										{formatCurrency(tagihan.pelanggan?.tarif?.tarif_perkwh ?? 0)}
									</div>
								</div>
							</div>

							<button
								on:click={() => openPaymentModal(tagihan)}
								class="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
							>
								Bayar Sekarang
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Riwayat Pembayaran -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
				<svg
					class="mr-2 h-5 w-5 text-green-500"
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
				Riwayat Pembayaran Terakhir
			</h3>

			{#if riwayatPembayaran.length === 0}
				<p class="py-8 text-center text-gray-500">Belum ada riwayat pembayaran.</p>
			{:else}
				<div class="space-y-3">
					{#each riwayatPembayaran as pembayaran}
						<div
							class="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
						>
							<div class="flex-1">
								<div class="font-medium text-gray-900">
									Pembayaran {pembayaran.bulan_bayar}
								</div>
								<div class="text-sm text-gray-500">
									{formatDate(pembayaran.tanggal_pembayaran)}
								</div>
							</div>
							<div class="text-right">
								<div class="font-bold text-green-600">
									{formatCurrency(pembayaran.total_bayar)}
								</div>
								<div class="text-xs text-gray-500">
									{pembayaran.biaya_admin === 0 ? 'Transfer Bank' : 'Kantor Layanan'}
								</div>
							</div>
							<div class="ml-4">
								<span
									class="inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
								>
									Lunas
								</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

{#if showPaymentModal && selectedTagihan}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
		<div class="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-center text-lg font-semibold">Konfirmasi Pembayaran</h3>
			<div class="mb-3 flex justify-between text-sm">
				<span>Periode:</span>
				<span class="font-medium"
					>{getMonthName(selectedTagihan.bulan)} {selectedTagihan.tahun}</span
				>
			</div>
			<div class="mb-3 flex justify-between text-sm">
				<span>Penggunaan:</span>
				<span class="font-medium">{selectedTagihan.jumlah_meter} kWh</span>
			</div>
			<div class="mb-3 flex justify-between text-sm">
				<span>Total Bayar:</span>
				<span class="font-bold text-green-600">
					{formatCurrency(calculateTotal(selectedTagihan) + (paymentMethod === 'bank' ? 0 : 2500))}
				</span>
			</div>
			<div class="mb-4">
				<label class="mb-1 block text-sm font-medium">Metode Pembayaran</label>
				<div class="flex gap-2">
					<label class="flex cursor-pointer items-center gap-1">
						<input type="radio" bind:group={paymentMethod} value="bank" />
						<span class="text-sm">Transfer Bank</span>
					</label>
					<label class="flex cursor-pointer items-center gap-1">
						<input type="radio" bind:group={paymentMethod} value="cash" />
						<span class="text-sm">Kantor PLN</span>
					</label>
				</div>
			</div>
			<div class="mt-4 flex gap-2">
				<button
					type="button"
					on:click={processPayment}
					disabled={processing}
					class="flex-1 rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
				>
					{processing ? 'Memproses...' : 'Bayar Sekarang'}
				</button>
				<button
					type="button"
					on:click={closePaymentModal}
					disabled={processing}
					class="flex-1 rounded bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
				>
					Batal
				</button>
			</div>
		</div>
	</div>
{/if}
