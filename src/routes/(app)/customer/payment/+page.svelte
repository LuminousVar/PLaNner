<script lang="ts">
	import { onMount } from 'svelte';

	// Type definitions
	interface Tarif {
		tarifperkwh: number;
	}

	interface TagihanData {
		id_tagihan: number;
		bulan: number;
		tahun: number;
		jumlah_meter: number;
		status: string;
		tarif: Tarif;
	}

	interface PembayaranData {
		id_pembayaran: number;
		bulan_bayar: string;
		tanggal_pembayaran: string;
		total_bayar: number;
		biaya_admin: number;
	}

	// Mock data untuk testing tanpa API call
	let mockTagihan: TagihanData[] = [
		{
			id_tagihan: 1,
			bulan: 12,
			tahun: 2024,
			jumlah_meter: 150,
			status: 'Belum Bayar',
			tarif: { tarifperkwh: 1500 }
		},
		{
			id_tagihan: 2,
			bulan: 11,
			tahun: 2024,
			jumlah_meter: 200,
			status: 'Belum Bayar',
			tarif: { tarifperkwh: 1500 }
		}
	];

	let mockPembayaran: PembayaranData[] = [
		{
			id_pembayaran: 1,
			bulan_bayar: '10/2024',
			tanggal_pembayaran: '2024-10-15',
			total_bayar: 225000,
			biaya_admin: 0
		},
		{
			id_pembayaran: 2,
			bulan_bayar: '09/2024',
			tanggal_pembayaran: '2024-09-12',
			total_bayar: 180000,
			biaya_admin: 2500
		}
	];

	let showPaymentModal: boolean = false;
	let selectedTagihan: TagihanData | null = null;
	let paymentMethod: 'bank' | 'cash' = 'bank';
	let processing: boolean = false;

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function openPaymentModal(tagihan: TagihanData): void {
		selectedTagihan = tagihan;
		showPaymentModal = true;
	}

	function closePaymentModal(): void {
		showPaymentModal = false;
		selectedTagihan = null;
		processing = false;
	}

	async function processPayment(): Promise<void> {
		if (!selectedTagihan) return;

		processing = true;

		// Simulate payment processing
		setTimeout(() => {
			if (!selectedTagihan) return;

			alert('Pembayaran berhasil diproses!');

			// Remove from unpaid bills
			mockTagihan = mockTagihan.filter((t) => t.id_tagihan !== selectedTagihan!.id_tagihan);

			// Add to payment history
			const biayaAdmin = paymentMethod === 'bank' ? 0 : 2500;
			const totalBayar =
				selectedTagihan.jumlah_meter * selectedTagihan.tarif.tarifperkwh + biayaAdmin;

			const newPembayaran: PembayaranData = {
				id_pembayaran: Date.now(),
				bulan_bayar: `${selectedTagihan.bulan.toString().padStart(2, '0')}/${selectedTagihan.tahun}`,
				tanggal_pembayaran: new Date().toISOString().split('T')[0],
				total_bayar: totalBayar,
				biaya_admin: biayaAdmin
			};

			mockPembayaran.unshift(newPembayaran);

			closePaymentModal();
			processing = false;
		}, 2000);
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
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

	<!-- Tagihan Belum Bayar -->
	<div class="rounded-lg bg-white p-6 shadow">
		<h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
			<svg class="mr-2 h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			Tagihan Belum Dibayar ({mockTagihan.length})
		</h3>

		{#if mockTagihan.length === 0}
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
				{#each mockTagihan as tagihan}
					<div class="rounded-lg border border-red-200 bg-red-50 p-4">
						<div class="mb-3 flex items-start justify-between">
							<div>
								<h4 class="font-semibold text-gray-900">
									Tagihan {tagihan.bulan}/{tagihan.tahun}
								</h4>
								<span
									class="mt-1 inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-800"
								>
									{tagihan.status}
								</span>
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-red-600">
									{formatCurrency(tagihan.jumlah_meter * tagihan.tarif.tarifperkwh)}
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
								<div class="font-medium">{formatCurrency(tagihan.tarif.tarifperkwh)}</div>
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

		{#if mockPembayaran.length === 0}
			<p class="py-8 text-center text-gray-500">Belum ada riwayat pembayaran.</p>
		{:else}
			<div class="space-y-3">
				{#each mockPembayaran.slice(0, 5) as pembayaran}
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
							<span class="inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
								Lunas
							</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Payment Modal -->
{#if showPaymentModal && selectedTagihan}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div
			class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
		>
			<div
				class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
				on:click={closePaymentModal}
				role="button"
				tabindex="0"
				on:keydown={(e) => e.key === 'Escape' && closePaymentModal()}
			></div>

			<div
				class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
			>
				<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div
							class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
						>
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
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
								/>
							</svg>
						</div>
						<div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 class="text-lg leading-6 font-medium text-gray-900">Konfirmasi Pembayaran</h3>
							<div class="mt-4 space-y-4">
								<!-- Detail Tagihan -->
								<div class="rounded-lg bg-gray-50 p-4">
									<h4 class="mb-2 font-medium text-gray-900">Detail Tagihan</h4>
									<div class="space-y-2 text-sm">
										<div class="flex justify-between">
											<span>Periode:</span>
											<span class="font-medium"
												>{selectedTagihan.bulan}/{selectedTagihan.tahun}</span
											>
										</div>
										<div class="flex justify-between">
											<span>Penggunaan:</span>
											<span class="font-medium">{selectedTagihan.jumlah_meter} kWh</span>
										</div>
										<div class="flex justify-between">
											<span>Tarif per kWh:</span>
											<span class="font-medium"
												>{formatCurrency(selectedTagihan.tarif.tarifperkwh)}</span
											>
										</div>
										<div class="flex justify-between border-t pt-2 font-medium">
											<span>Subtotal:</span>
											<span
												>{formatCurrency(
													selectedTagihan.jumlah_meter * selectedTagihan.tarif.tarifperkwh
												)}</span
											>
										</div>
									</div>
								</div>

								<!-- Metode Pembayaran -->
								<div>
									<label class="mb-2 block text-sm font-medium text-gray-700"
										>Metode Pembayaran</label
									>
									<div class="space-y-2">
										<label
											class="flex cursor-pointer items-center rounded-lg border p-3"
											class:bg-blue-50={paymentMethod === 'bank'}
											class:border-blue-500={paymentMethod === 'bank'}
										>
											<input
												type="radio"
												bind:group={paymentMethod}
												value="bank"
												class="h-4 w-4 text-blue-600 focus:ring-blue-500"
											/>
											<div class="ml-3 flex-1">
												<div class="text-sm font-medium text-gray-900">Transfer Bank</div>
												<div class="text-xs text-gray-500">Gratis biaya admin</div>
											</div>
											<div class="text-sm font-medium text-green-600">Gratis</div>
										</label>
										<label
											class="flex cursor-pointer items-center rounded-lg border p-3"
											class:bg-blue-50={paymentMethod === 'cash'}
											class:border-blue-500={paymentMethod === 'cash'}
										>
											<input
												type="radio"
												bind:group={paymentMethod}
												value="cash"
												class="h-4 w-4 text-blue-600 focus:ring-blue-500"
											/>
											<div class="ml-3 flex-1">
												<div class="text-sm font-medium text-gray-900">Kantor Layanan</div>
												<div class="text-xs text-gray-500">Bayar di kantor PLN</div>
											</div>
											<div class="text-sm font-medium text-orange-600">+{formatCurrency(2500)}</div>
										</label>
									</div>
								</div>

								<!-- Total Pembayaran -->
								<div class="rounded-lg bg-blue-50 p-4">
									<h4 class="mb-2 font-medium text-blue-900">Total Pembayaran</h4>
									<div class="space-y-1 text-sm text-blue-800">
										<div class="flex justify-between">
											<span>Tagihan Listrik:</span>
											<span
												>{formatCurrency(
													selectedTagihan.jumlah_meter * selectedTagihan.tarif.tarifperkwh
												)}</span
											>
										</div>
										<div class="flex justify-between">
											<span>Biaya Admin:</span>
											<span>{paymentMethod === 'bank' ? 'Gratis' : formatCurrency(2500)}</span>
										</div>
										<div
											class="flex justify-between border-t border-blue-200 pt-2 text-lg font-bold"
										>
											<span>Total:</span>
											<span
												>{formatCurrency(
													selectedTagihan.jumlah_meter * selectedTagihan.tarif.tarifperkwh +
														(paymentMethod === 'bank' ? 0 : 2500)
												)}</span
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button
						type="button"
						on:click={processPayment}
						disabled={processing}
						class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
					>
						{#if processing}
							<div class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
							Memproses...
						{:else}
							Bayar Sekarang
						{/if}
					</button>
					<button
						type="button"
						on:click={closePaymentModal}
						disabled={processing}
						class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 sm:mt-0 sm:w-auto sm:text-sm"
					>
						Batal
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
