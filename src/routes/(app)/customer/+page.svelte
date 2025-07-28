<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/api/client';
	import type {
		CustomerDashboardData,
		PelangganProfile,
		TagihanData,
		PembayaranData
	} from '$lib/types';

	interface DashboardState {
		profile: PelangganProfile | null;
		tagihanBelumLunas: TagihanData[];
		riwayatPembayaran: PembayaranData[];
	}

	let dashboardData: DashboardState = {
		profile: null,
		tagihanBelumLunas: [],
		riwayatPembayaran: []
	};
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await apiClient.getCustomerDashboard();
			if (response.success && response.data) {
				dashboardData = {
					profile: response.data.profile || null,
					tagihanBelumLunas: response.data.tagihanBelumLunas || [],
					riwayatPembayaran: response.data.riwayatPembayaran || []
				};
			} else {
				error = response.message || 'Gagal memuat data dashboard';
			}
		} catch (err) {
			console.error('Failed to load dashboard:', err);
			error = 'Terjadi kesalahan saat memuat data dashboard';
		} finally {
			loading = false;
		}
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Dashboard Customer</h1>
		<p class="text-gray-600">Selamat datang di portal pelanggan PLaNner</p>
	</div>

	{#if loading}
		<div class="flex h-48 items-center justify-center">
			<div class="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
		</div>
	{:else if error}
		<!-- Error State -->
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
					on:click={() => window.location.reload()}
					class="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
				>
					Muat Ulang
				</button>
			</div>
		</div>
	{:else}
		<!-- Profile Card -->
		{#if dashboardData.profile}
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium text-gray-900">Informasi Akun</h3>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<p class="text-sm text-gray-600">Nama Pelanggan</p>
						<p class="font-medium">{dashboardData.profile.nama_pelanggan}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600">Nomor KWH</p>
						<p class="font-medium">{dashboardData.profile.nomor_kwh}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600">Alamat</p>
						<p class="font-medium">{dashboardData.profile.alamat}</p>
					</div>
					<div>
						<p class="text-sm text-gray-600">Tarif</p>
						<p class="font-medium">
							{dashboardData.profile.tarif?.daya
								? `${dashboardData.profile.tarif.daya} VA`
								: 'Belum diatur'}
						</p>
					</div>
				</div>
			</div>
		{:else}
			<!-- No Profile Data -->
			<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
				<div class="flex">
					<svg
						class="mr-3 h-5 w-5 text-yellow-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
					<div>
						<h3 class="text-sm font-medium text-yellow-800">Data Profil Tidak Tersedia</h3>
						<p class="mt-1 text-sm text-yellow-700">
							Profil pelanggan belum dapat dimuat. Silakan hubungi administrator.
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Tagihan Belum Lunas -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-lg font-medium text-gray-900">
				Tagihan Belum Lunas ({dashboardData.tagihanBelumLunas.length})
			</h3>
			{#if dashboardData.tagihanBelumLunas.length > 0}
				<div class="space-y-4">
					{#each dashboardData.tagihanBelumLunas as tagihan}
						<div class="rounded-lg border border-red-200 bg-red-50 p-4">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-red-800">
										Tagihan {tagihan.bulan}/{tagihan.tahun}
									</p>
									<p class="text-sm text-red-600">
										Jumlah: {tagihan.jumlah_meter} kWh
									</p>
								</div>
								<span class="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
									Belum Lunas
								</span>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="rounded-lg border border-green-200 bg-green-50 p-4">
					<div class="flex">
						<svg
							class="mr-3 h-5 w-5 text-green-400"
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
						<div>
							<h3 class="text-sm font-medium text-green-800">Semua Tagihan Lunas</h3>
							<p class="mt-1 text-sm text-green-700">Tidak ada tagihan yang belum lunas</p>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Recent Payments (if any) -->
		{#if dashboardData.riwayatPembayaran.length > 0}
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium text-gray-900">
					Pembayaran Terakhir ({dashboardData.riwayatPembayaran.length})
				</h3>
				<div class="space-y-4">
					{#each dashboardData.riwayatPembayaran.slice(0, 3) as pembayaran}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-gray-900">
										Pembayaran {pembayaran.bulan_bayar}
									</p>
									<p class="text-sm text-gray-600">
										Total: Rp {pembayaran.total_bayar.toLocaleString('id-ID')}
									</p>
									<p class="text-xs text-gray-500">
										{new Date(pembayaran.tanggal_pembayaran).toLocaleDateString('id-ID')}
									</p>
								</div>
								<span
									class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
								>
									Lunas
								</span>
							</div>
						</div>
					{/each}
				</div>
				{#if dashboardData.riwayatPembayaran.length > 3}
					<div class="mt-4 text-center">
						<a
							href="/customer/pembayaran"
							class="text-sm font-medium text-blue-600 hover:text-blue-500"
						>
							Lihat semua pembayaran →
						</a>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Quick Actions -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-lg font-medium text-gray-900">Menu Cepat</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<a
					href="/customer/tagihan"
					class="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
				>
					<div class="flex items-center">
						<svg
							class="mr-3 h-6 w-6 text-blue-600"
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
						<div>
							<h4 class="font-medium text-gray-900">Lihat Tagihan</h4>
							<p class="text-sm text-gray-600">Cek semua tagihan Anda</p>
						</div>
					</div>
				</a>
				<a
					href="/customer/pembayaran"
					class="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
				>
					<div class="flex items-center">
						<svg
							class="mr-3 h-6 w-6 text-green-600"
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
						<div>
							<h4 class="font-medium text-gray-900">Riwayat Pembayaran</h4>
							<p class="text-sm text-gray-600">Lihat history pembayaran</p>
						</div>
					</div>
				</a>
				<a
					href="/customer/penggunaan"
					class="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
				>
					<div class="flex items-center">
						<svg
							class="mr-3 h-6 w-6 text-purple-600"
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
						<div>
							<h4 class="font-medium text-gray-900">Riwayat Penggunaan</h4>
							<p class="text-sm text-gray-600">Monitor penggunaan listrik</p>
						</div>
					</div>
				</a>
			</div>
		</div>
	{/if}
</div>
