<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/api/client';
	import { Formatter } from '$lib/utils/formatters';
	import type { PelangganProfile } from '$lib/types';

	let profile: PelangganProfile | null = null;
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		await loadProfile();
	});

	async function loadProfile(): Promise<void> {
		loading = true;
		error = null;

		try {
			const response = await apiClient.getCustomerProfile();
			if (response.success && response.data) {
				profile = response.data;
			} else {
				error = response.message || 'Gagal memuat profil';
			}
		} catch (err) {
			console.error('Failed to load profile:', err);
			error = 'Terjadi kesalahan saat memuat profil';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Profil Saya - PLaNner Customer</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Profil Saya</h1>
			<p class="text-gray-600">Informasi akun dan data pelanggan</p>
		</div>
	</div>

	{#if loading}
		<div class="flex h-48 items-center justify-center rounded-lg bg-white shadow">
			<div class="text-center">
				<div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<p class="mt-4 text-gray-600">Memuat profil...</p>
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
					on:click={loadProfile}
					class="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
				>
					Coba Lagi
				</button>
			</div>
		</div>
	{:else if profile}
		<!-- Profile Card -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="mb-6 text-lg font-medium text-gray-900">Informasi Pelanggan</h3>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label class="block text-sm font-medium text-gray-500">Nama Pelanggan</label>
					<p class="mt-1 text-sm text-gray-900">{profile.nama_pelanggan}</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-500">Username</label>
					<p class="mt-1 text-sm text-gray-900">{profile.username}</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-500">Nomor KWH</label>
					<p class="mt-1 font-mono text-sm text-gray-900">{profile.nomor_kwh}</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-500">ID Pelanggan</label>
					<p class="mt-1 text-sm text-gray-900">#{profile.id_pelanggan}</p>
				</div>

				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-500">Alamat</label>
					<p class="mt-1 text-sm text-gray-900">{profile.alamat}</p>
				</div>
			</div>
		</div>

		<!-- Tarif Information -->
		{#if profile.tarif}
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-6 text-lg font-medium text-gray-900">Informasi Tarif</h3>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					<div>
						<label class="block text-sm font-medium text-gray-500">Daya Listrik</label>
						<p class="mt-1 text-sm text-gray-900">{profile.tarif.daya} VA</p>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-500">Tarif per kWh</label>
						<p class="mt-1 text-sm text-gray-900">
							{Formatter.currency(profile.tarif.tarif_perkwh)}
						</p>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-500">ID Tarif</label>
						<p class="mt-1 text-sm text-gray-900">#{profile.tarif.id_tarif}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Account Details -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="mb-6 text-lg font-medium text-gray-900">Detail Akun</h3>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label class="block text-sm font-medium text-gray-500">Tanggal Dibuat</label>
					<p class="mt-1 text-sm text-gray-900">
						{new Date(profile.created_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-500">Terakhir Diupdate</label>
					<p class="mt-1 text-sm text-gray-900">
						{new Date(profile.updated_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</p>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="rounded-lg bg-gray-50 p-6">
			<h3 class="mb-4 text-lg font-medium text-gray-900">Bantuan</h3>
			<p class="mb-4 text-sm text-gray-600">
				Jika ada perubahan data atau masalah dengan akun Anda, silakan hubungi administrator.
			</p>
			<div class="space-y-2 text-sm text-gray-600">
				<p>📧 Email: admin@planner.com</p>
				<p>📞 Telepon: (021) 1234-5678</p>
				<p>🕐 Jam Operasional: Senin - Jumat, 08:00 - 17:00 WIB</p>
			</div>
		</div>
	{/if}
</div>
