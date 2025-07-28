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
		rememberMe: false,
		loginType: 'customer'
	};

	let errors: Record<string, string> = {};
	let isLoading = false;
	let isAlreadyLoggedIn = false;
	let isLoggingOut = false;

	onMount(() => {
		// Check if already authenticated but don't auto-redirect
		if (apiClient.isAuthenticated()) {
			isAlreadyLoggedIn = true;
			// Don't auto-redirect, just show status
		}
	});

	async function handleSubmit() {
		if (!validateForm()) return;

		isLoading = true;
		errors = {};

		try {
			let response;

			if (formData.loginType === 'admin') {
				response = await apiClient.adminLogin(formData.username, formData.password);

				if (response.success) {
					// Store user type for future reference
					localStorage.setItem('user_type', 'admin');
					goto('/admin');
				} else {
					errors.general = response.message || 'Login admin gagal';
				}
			} else {
				response = await apiClient.customerLogin(formData.username, formData.password);

				if (response.success) {
					// Store user type for future reference
					localStorage.setItem('user_type', 'customer');
					goto('/customer');
				} else {
					errors.general = response.message || 'Login pelanggan gagal';
				}
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
		}

		if (!formData.password) {
			errors.password = 'Password wajib diisi';
		}

		return Object.keys(errors).length === 0;
	}

	function switchLoginType(type: 'customer' | 'admin') {
		formData.loginType = type;
		formData.username = '';
		formData.password = '';
		errors = {};
	}

	function goToDashboard() {
		const userType = apiClient.getUserType();
		if (userType === 'admin') {
			goto('/admin');
		} else {
			goto('/customer');
		}
	}

	async function logout() {
		isLoggingOut = true;

		try {
			// Try server logout first (if you have the endpoint)
			await apiClient.logout();
		} catch (error) {
			// If server logout fails, still clear client data
			apiClient.forceLogout();
		}

		// Update UI state
		isAlreadyLoggedIn = false;
		isLoggingOut = false;

		// Reset form
		formData.username = '';
		formData.password = '';
		errors = {};
	}

	function clearAllData() {
		apiClient.clearSession();
		isAlreadyLoggedIn = false;
		formData.username = '';
		formData.password = '';
		errors = {};
	}
</script>

<svelte:head>
	<title>Login - {env.APP_NAME}</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">
				{formData.loginType === 'admin' ? 'Admin Login' : 'Selamat Datang'}
			</h1>
			<p class="text-gray-600">
				{formData.loginType === 'admin'
					? 'Masuk ke dashboard admin'
					: 'Masuk ke akun pelanggan Anda'}
			</p>
		</div>

		<!-- Already Logged In Alert -->
		{#if isAlreadyLoggedIn}
			<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div class="flex items-center justify-between">
					<div class="flex">
						<svg
							class="mr-3 h-5 w-5 text-blue-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<h3 class="text-sm font-medium text-blue-800">Sudah Login</h3>
							<p class="mt-1 text-sm text-blue-700">
								Anda sudah login sebagai {apiClient.getUserType() || 'user'}
							</p>
						</div>
					</div>
				</div>
				<div class="mt-4 flex flex-wrap gap-2">
					<button
						on:click={goToDashboard}
						class="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
						disabled={isLoggingOut}
					>
						Ke Dashboard
					</button>
					<button
						on:click={logout}
						class="rounded-md border border-blue-300 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100 disabled:opacity-50"
						disabled={isLoggingOut}
					>
						{isLoggingOut ? 'Logout...' : 'Logout'}
					</button>
					<button
						on:click={clearAllData}
						class="rounded-md border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
						disabled={isLoggingOut}
						title="Hapus semua data tersimpan"
					>
						Clear All
					</button>
				</div>
			</div>
		{/if}

		<!-- Login Type Switcher -->
		<div class="mb-6">
			<div class="flex rounded-lg bg-gray-200 p-1">
				<button
					type="button"
					on:click={() => switchLoginType('customer')}
					class="flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200 {formData.loginType ===
					'customer'
						? 'bg-white text-blue-600 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					Pelanggan
				</button>
				<button
					type="button"
					on:click={() => switchLoginType('admin')}
					class="flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200 {formData.loginType ===
					'admin'
						? 'bg-white text-blue-600 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					Admin
				</button>
			</div>
		</div>

		<!-- Form Card -->
		<div class="rounded-2xl bg-white p-8 shadow-xl">
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				{#if errors.general}
					<ErrorAlert error={errors.general} />
				{/if}

				<FormField
					label="Username"
					name="username"
					bind:value={formData.username}
					error={errors.username}
					placeholder={formData.loginType === 'admin' ? 'Username admin' : 'Username pelanggan'}
					required
				/>

				<FormField
					label="Password"
					name="password"
					type="password"
					bind:value={formData.password}
					error={errors.password}
					placeholder="Masukkan password"
					required
				/>

				<div class="flex items-center">
					<input
						type="checkbox"
						id="rememberMe"
						bind:checked={formData.rememberMe}
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<label for="rememberMe" class="ml-2 text-sm text-gray-700"> Ingat saya </label>
				</div>

				<LoadingButton type="submit" loading={isLoading} loadingText="Sedang masuk...">
					{formData.loginType === 'admin' ? 'Masuk sebagai Admin' : 'Masuk'}
				</LoadingButton>
			</form>

			{#if formData.loginType === 'customer'}
				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600">
						Belum punya akun?
						<a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
							Daftar di sini
						</a>
					</p>
				</div>
			{/if}

			{#if formData.loginType === 'admin'}
				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600">
						Perlu membuat admin pertama?
						<a href="/login/bootstrap" class="font-medium text-blue-600 hover:text-blue-500">
							Bootstrap Admin
						</a>
					</p>
				</div>
			{/if}
		</div>

		<!-- Back to Home -->
		<div class="mt-6 text-center">
			<a href="/" class="text-sm text-gray-500 hover:text-gray-700"> ← Kembali ke beranda </a>
		</div>
	</div>
</div>
