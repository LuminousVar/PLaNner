<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/api/client';
	import type { AdminDashboardStats } from '$lib/types/dashboard';

	let dashboardStats: AdminDashboardStats | undefined = {
		totalPelanggan: 0,
		totalTagihan: 0,
		totalPendapatan: 0,
		tagihanBelumLunas: 0,
		recentTagihan: []
	};
	let loading = true;

	onMount(async () => {
		try {
			const response = await apiClient.getAdminDashboard();
			if (response.success) {
				dashboardStats = response.data;
			}
		} catch (error) {
			console.error('Failed to load dashboard:', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
		<p class="text-gray-600">Selamat datang di panel administrasi PLaNner</p>
	</div>

	{#if loading}
		<div class="flex h-48 items-center justify-center">
			<div class="h-32 w-32 animate-spin rounded-full border-b-2 border-primary-600"></div>
		</div>
	{:else}
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<svg
								class="h-6 w-6 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
								/>
							</svg>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="truncate text-sm font-medium text-gray-500">Total Pelanggan</dt>
								<dd class="text-lg font-medium text-gray-900">
									Rp {(dashboardStats?.totalPendapatan ?? 0).toLocaleString('id-ID')}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<svg
								class="h-6 w-6 text-gray-400"
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
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="truncate text-sm font-medium text-gray-500">Total Tagihan</dt>
								<dd class="text-lg font-medium text-gray-900">
									{dashboardStats?.totalTagihan ?? 0}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<svg
								class="h-6 w-6 text-gray-400"
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
								<dt class="truncate text-sm font-medium text-gray-500">Total Pendapatan</dt>
								<dd class="text-lg font-medium text-gray-900">
									Rp {dashboardStats?.totalPendapatan.toLocaleString('id-ID')}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<svg
								class="h-6 w-6 text-red-400"
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
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="truncate text-sm font-medium text-gray-500">Tagihan Belum Lunas</dt>
								<dd class="text-lg font-medium text-red-600">
									{dashboardStats?.tagihanBelumLunas}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-lg font-medium text-gray-900">Aksi Cepat</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<a
					href="/admin/pelanggan"
					class="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
				>
					<h4 class="font-medium text-gray-900">Kelola Pelanggan</h4>
					<p class="text-sm text-gray-600">Tambah, edit, atau hapus data pelanggan</p>
				</a>
				<a
					href="/admin/tagihan"
					class="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
				>
					<h4 class="font-medium text-gray-900">Generate Tagihan</h4>
					<p class="text-sm text-gray-600">Buat tagihan bulanan untuk pelanggan</p>
				</a>
				<a
					href="/admin/laporan"
					class="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
				>
					<h4 class="font-medium text-gray-900">Lihat Laporan</h4>
					<p class="text-sm text-gray-600">Generate dan download laporan</p>
				</a>
			</div>
		</div>
	{/if}
</div>
