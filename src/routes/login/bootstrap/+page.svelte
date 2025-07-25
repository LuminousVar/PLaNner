<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/api/client';
	import { env } from '$lib/config/env';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import LoadingButton from '$lib/components/ui/LoadingButton.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';

	let formData = {
		username: '',
		password: '',
		nama_user: ''
	};

	let errors: Record<string, string> = {};
	let isLoading = false;
	let showSuccess = false;

	onMount(() => {
		// Check if already authenticated as admin
		if (apiClient.isAuthenticated()) {
			goto('/admin');
		}
	});

	async function handleSubmit() {
		if (!validateForm()) return;

		isLoading = true;
		errors = {};

		try {
			const response = await apiClient.adminBootstrap(formData);

			if (response.success) {
				showSuccess = true;
				setTimeout(() => {
					goto('/login');
				}, 2000);
			} else {
				errors.general = response.message || 'Bootstrap admin gagal';
			}
		} catch (error) {
			errors.general = 'Terjadi kesalahan koneksi';
		} finally {
			isLoading = false;
		}
	}

	function validateForm(): boolean {
		errors = {};

		if (!formData.username.trim()) {
			errors.username = 'Username wajib diisi';
		} else if (formData.username.length < 3) {
			errors.username = 'Username minimal 3 karakter';
		}

		if (!formData.password) {
			errors.password = 'Password wajib diisi';
		} else if (formData.password.length < 6) {
			errors.password = 'Password minimal 6 karakter';
		}

		if (!formData.nama_user.trim()) {
			errors.nama_user = 'Nama user wajib diisi';
		}

		return Object.keys(errors).length === 0;
	}
</script>

<svelte:head>
	<title>Bootstrap Admin - {env.APP_NAME}</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
				<svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
			</div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Setup Admin Pertama</h1>
			<p class="text-gray-600">Buat akun administrator pertama untuk sistem</p>
		</div>

		{#if showSuccess}
			<div class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
				<div class="flex items-center">
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
						<h3 class="text-sm font-medium text-green-800">Admin berhasil dibuat!</h3>
						<p class="mt-1 text-sm text-green-700">Anda akan dialihkan ke halaman login...</p>
					</div>
				</div>
			</div>
		{:else}
			<!-- Form Card -->
			<div class="rounded-2xl bg-white p-8 shadow-xl">
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					{#if errors.general}
						<ErrorAlert error={errors.general} />
					{/if}

					<FormField
						label="Username Admin"
						name="username"
						bind:value={formData.username}
						error={errors.username}
						placeholder="Username untuk admin"
						required
					/>

					<FormField
						label="Nama Lengkap"
						name="nama_user"
						bind:value={formData.nama_user}
						error={errors.nama_user}
						placeholder="Nama lengkap administrator"
						required
					/>

					<FormField
						label="Password"
						name="password"
						type="password"
						bind:value={formData.password}
						error={errors.password}
						placeholder="Password untuk admin"
						required
					/>

					<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
						<div class="flex">
							<svg
								class="mt-0.5 mr-3 h-5 w-5 text-yellow-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
							<div>
								<h3 class="text-sm font-medium text-yellow-800">Penting!</h3>
								<p class="mt-1 text-sm text-yellow-700">
									Simpan username dan password ini dengan aman. Ini akan menjadi akun administrator
									utama sistem.
								</p>
							</div>
						</div>
					</div>

					<LoadingButton type="submit" loading={isLoading} loadingText="Membuat admin...">
						Buat Admin Pertama
					</LoadingButton>
				</form>
			</div>
		{/if}

		<!-- Back to Login -->
		<div class="mt-6 text-center">
			<a href="/login" class="text-sm text-gray-500 hover:text-gray-700"> ← Kembali ke login </a>
		</div>
	</div>
</div>
