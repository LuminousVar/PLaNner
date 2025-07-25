<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Services & Utils
	import { apiClient } from '$lib/api/client';
	import { Validator } from '$lib/validation/validator';
	import { Generator } from '$lib/utils/generators';
	import { Formatter } from '$lib/utils/formatters';
	import { env } from '$lib/config/env';

	// Components
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import LoadingButton from '$lib/components/ui/LoadingButton.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';

	// Types
	import type { RegisterFormData } from '$lib/types/forms';
	import type { TarifData, PaginatedResponse } from '$lib/types';

	// Form state
	let formData: RegisterFormData = {
		username: '',
		password: '',
		confirmPassword: '',
		nama_pelanggan: '',
		alamat: '',
		nomor_kwh: '',
		id_tarif: '',
		agree: false
	};

	let errors: Record<string, string> = {};
	let isLoading = false;
	let showSuccess = false;
	let tarifOptions: TarifData[] = [];
	let loadingTarif = true;

	// Services
	const validator = new Validator();

	onMount(async () => {
		// Check if already authenticated
		if (apiClient.isAuthenticated()) {
			const userType = localStorage.getItem('user_type');
			if (userType === 'admin') {
				goto('/admin');
			} else {
				goto('/customer');
			}
			return;
		}

		await loadTarifOptions();
		await checkServerHealth();
	});

	async function loadTarifOptions() {
		loadingTarif = true;
		try {
			const response = await apiClient.getTarif(1, 50);
			if (response.success && response.data) {
				const data = response.data as PaginatedResponse<TarifData>;
				tarifOptions = data.data;
			}
		} catch (error) {
			console.error('Failed to load tarif options:', error);
		} finally {
			loadingTarif = false;
		}
	}

	async function checkServerHealth() {
		const response = await apiClient.healthCheck();
		if (!response.success && env.DEBUG) {
			console.warn('Backend server health check failed');
		}
	}

	function validateForm(): boolean {
		errors = {};

		// Username validation
		if (!formData.username.trim()) {
			errors.username = 'Username wajib diisi';
		} else if (formData.username.length < 3) {
			errors.username = 'Username minimal 3 karakter';
		} else if (formData.username.length > 50) {
			errors.username = 'Username maksimal 50 karakter';
		} else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
			errors.username = 'Username hanya boleh mengandung huruf, angka, dan underscore';
		}

		// Nama pelanggan validation
		if (!formData.nama_pelanggan.trim()) {
			errors.nama_pelanggan = 'Nama pelanggan wajib diisi';
		} else if (formData.nama_pelanggan.length < 2) {
			errors.nama_pelanggan = 'Nama minimal 2 karakter';
		} else if (formData.nama_pelanggan.length > 100) {
			errors.nama_pelanggan = 'Nama maksimal 100 karakter';
		}

		// Nomor KWH validation
		if (!formData.nomor_kwh.trim()) {
			errors.nomor_kwh = 'Nomor KWH wajib diisi';
		} else if (!/^[0-9]{10,15}$/.test(formData.nomor_kwh)) {
			errors.nomor_kwh = 'Nomor KWH harus berupa angka 10-15 digit';
		}

		// Alamat validation
		if (!formData.alamat.trim()) {
			errors.alamat = 'Alamat wajib diisi';
		} else if (formData.alamat.length > 255) {
			errors.alamat = 'Alamat maksimal 255 karakter';
		}

		// Tarif validation
		if (!formData.id_tarif) {
			errors.id_tarif = 'Tarif listrik wajib dipilih';
		}

		// Password validation
		if (!formData.password) {
			errors.password = 'Password wajib diisi';
		} else if (formData.password.length < 8) {
			errors.password = 'Password minimal 8 karakter';
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			errors.password = 'Password harus mengandung huruf besar, huruf kecil, dan angka';
		}

		// Confirm password validation
		if (!formData.confirmPassword) {
			errors.confirmPassword = 'Konfirmasi password wajib diisi';
		} else if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = 'Konfirmasi password tidak cocok';
		}

		// Agreement validation
		if (!formData.agree) {
			errors.agree = 'Anda harus menyetujui syarat dan ketentuan';
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		isLoading = true;
		errors = {};

		try {
			const response = await apiClient.customerRegister({
				username: formData.username,
				password: formData.password,
				nama_pelanggan: formData.nama_pelanggan,
				alamat: formData.alamat,
				nomor_kwh: formData.nomor_kwh,
				id_tarif: parseInt(formData.id_tarif.toString())
			});

			if (response.success) {
				showSuccess = true;
				setTimeout(() => goto('/login'), 3000);
			} else {
				// Handle specific errors
				const message = response.message?.toLowerCase() || '';

				if (message.includes('username') && message.includes('sudah')) {
					errors.username = 'Username sudah terdaftar, gunakan username lain';
				} else if (message.includes('nomor_kwh') || message.includes('kwh')) {
					errors.nomor_kwh = 'Nomor KWH sudah terdaftar';
				} else {
					errors.general = response.message || 'Terjadi kesalahan saat mendaftar';
				}
			}
		} catch (error) {
			errors.general = 'Terjadi kesalahan koneksi. Pastikan server backend berjalan.';
		} finally {
			isLoading = false;
		}
	}

	function autoGenerateKWH() {
		formData.nomor_kwh = Generator.generateKWHNumber();
	}

	function getSelectedTarif() {
		if (!formData.id_tarif) return null;
		return tarifOptions.find((t) => t.id_tarif.toString() === formData.id_tarif.toString());
	}

	$: selectedTarif = getSelectedTarif();
</script>

<svelte:head>
	<title>Daftar Pelanggan - {env.APP_NAME}</title>
	<meta
		name="description"
		content="Daftar sebagai pelanggan baru untuk menggunakan sistem pembayaran listrik modern"
	/>
</svelte:head>

{#if showSuccess}
	<!-- Success Modal -->
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
				>
					<svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Registrasi Berhasil!</h3>
				<p class="mb-4 text-gray-600">
					Akun pelanggan Anda telah berhasil dibuat. Anda akan dialihkan ke halaman login dalam 3
					detik.
				</p>
				<div class="flex items-center justify-center">
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
					></div>
					<span class="ml-2 text-sm text-gray-600">Mengalihkan...</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-lg">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
			>
				<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
			</div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Daftar Pelanggan Baru</h1>
			<p class="text-gray-600">Bergabunglah dengan sistem pembayaran listrik modern</p>
		</div>

		<!-- Form Card -->
		<div class="rounded-2xl bg-white p-8 shadow-xl">
			{#if errors.general}
				<ErrorAlert error={errors.general} />
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<FormField
					label="Username"
					name="username"
					bind:value={formData.username}
					error={errors.username}
					placeholder="Masukkan username unik"
					required
					disabled={isLoading}
					maxlength={50}
					helpText="3-50 karakter, hanya huruf, angka, dan underscore"
				/>

				<FormField
					label="Nama Pelanggan"
					name="nama_pelanggan"
					bind:value={formData.nama_pelanggan}
					error={errors.nama_pelanggan}
					placeholder="Nama lengkap pelanggan"
					required
					disabled={isLoading}
					maxlength={100}
				/>

				<!-- Nomor KWH with Generate Button -->
				<div>
					<label for="nomor_kwh" class="mb-2 block text-sm font-medium text-gray-700">
						Nomor KWH <span class="text-red-500">*</span>
					</label>
					<div class="flex space-x-2">
						<input
							type="text"
							id="nomor_kwh"
							bind:value={formData.nomor_kwh}
							disabled={isLoading}
							class="flex-1 rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 {errors.nomor_kwh
								? 'border-red-300'
								: 'border-gray-300'}"
							placeholder="10-15 digit nomor KWH"
							maxlength="15"
							pattern="[0-9]*"
							inputmode="numeric"
						/>
						<button
							type="button"
							on:click={autoGenerateKWH}
							disabled={isLoading}
							class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
							title="Generate nomor KWH otomatis"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
						</button>
					</div>
					{#if errors.nomor_kwh}
						<p class="mt-1 text-sm text-red-500">{errors.nomor_kwh}</p>
					{/if}
					<p class="mt-1 text-xs text-gray-500">Nomor meter KWH (10-15 digit angka)</p>
				</div>

				<!-- Alamat Textarea -->
				<div>
					<label for="alamat" class="mb-2 block text-sm font-medium text-gray-700">
						Alamat <span class="text-red-500">*</span>
					</label>
					<textarea
						id="alamat"
						bind:value={formData.alamat}
						disabled={isLoading}
						rows="3"
						class="w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 {errors.alamat
							? 'border-red-300'
							: 'border-gray-300'}"
						placeholder="Alamat lengkap pelanggan"
						maxlength="255"
					></textarea>
					{#if errors.alamat}
						<p class="mt-1 text-sm text-red-500">{errors.alamat}</p>
					{/if}
					<p class="mt-1 text-xs text-gray-500">Maksimal 255 karakter</p>
				</div>

				<!-- Tarif Select -->
				<div>
					<label for="id_tarif" class="mb-2 block text-sm font-medium text-gray-700">
						Tarif Listrik <span class="text-red-500">*</span>
					</label>
					<select
						id="id_tarif"
						bind:value={formData.id_tarif}
						disabled={isLoading || loadingTarif}
						class="w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 {errors.id_tarif
							? 'border-red-300'
							: 'border-gray-300'}"
					>
						<option value="">
							{loadingTarif ? 'Memuat tarif...' : 'Pilih tarif listrik'}
						</option>
						{#each tarifOptions as tarif}
							<option value={tarif.id_tarif}>
								{tarif.daya} - {Formatter.currency(tarif.tarif_perkwh)}/kWh
							</option>
						{/each}
					</select>
					{#if errors.id_tarif}
						<p class="mt-1 text-sm text-red-500">{errors.id_tarif}</p>
					{/if}
					{#if selectedTarif}
						<div class="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
							<p class="text-sm text-blue-800">
								<strong>Tarif Dipilih:</strong>
								{selectedTarif.daya} - {Formatter.currency(selectedTarif.tarif_perkwh)}/kWh
							</p>
						</div>
					{/if}
					{#if loadingTarif}
						<p class="mt-1 text-xs text-yellow-600">Memuat data tarif...</p>
					{:else if tarifOptions.length === 0}
						<p class="mt-1 text-xs text-red-600">
							Gagal memuat data tarif. Silakan refresh halaman.
						</p>
					{/if}
				</div>

				<FormField
					label="Password"
					name="password"
					type="password"
					bind:value={formData.password}
					error={errors.password}
					placeholder="Minimal 8 karakter"
					required
					disabled={isLoading}
					helpText="Harus mengandung huruf besar, huruf kecil, dan angka"
				/>

				<FormField
					label="Konfirmasi Password"
					name="confirmPassword"
					type="password"
					bind:value={formData.confirmPassword}
					error={errors.confirmPassword}
					placeholder="Ulangi password"
					required
					disabled={isLoading}
				/>

				<!-- Agreement Checkbox -->
				<div class="space-y-2">
					<div class="flex items-start space-x-3">
						<input
							type="checkbox"
							id="agree"
							bind:checked={formData.agree}
							disabled={isLoading}
							class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
						/>
						<label for="agree" class="text-sm text-gray-600">
							Saya menyetujui
							<a href="/terms" class="text-blue-600 hover:underline" target="_blank">
								Syarat dan Ketentuan
							</a>
							serta
							<a href="/privacy" class="text-blue-600 hover:underline" target="_blank">
								Kebijakan Privasi
							</a>
							layanan {env.APP_NAME}
						</label>
					</div>
					{#if errors.agree}
						<p class="text-sm text-red-500">{errors.agree}</p>
					{/if}
				</div>

				<LoadingButton
					type="submit"
					loading={isLoading}
					loadingText="Mendaftarkan..."
					disabled={!formData.agree || loadingTarif}
				>
					Daftar Sebagai Pelanggan
				</LoadingButton>
			</form>

			<!-- Login Link -->
			<div class="mt-6 text-center">
				<p class="text-gray-600">
					Sudah punya akun?
					<a href="/login" class="font-medium text-blue-600 hover:underline">Masuk di sini</a>
				</p>
			</div>

			<!-- Back to Home -->
			<div class="mt-4 text-center">
				<a href="/" class="text-sm text-gray-500 hover:text-gray-700"> ← Kembali ke beranda </a>
			</div>

			{#if env.DEBUG}
				<div class="mt-4 text-center">
					<p class="text-xs text-gray-500">
						💡 Backend: {env.API_BASE_URL}
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
