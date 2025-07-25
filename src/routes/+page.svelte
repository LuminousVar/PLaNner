<script lang="ts">
	import { onMount } from 'svelte';

	interface Tarif {
		id_tarif: number;
		daya: number;
		tarif_perkwh: number;
	}

	let tarifs: Tarif[] = [];

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:5100/api/tarif');
			const data = await response.json();
			if (data.success) {
				tarifs = data.data.slice(0, 3); // Ambil 3 tarif pertama untuk preview
			}
		} catch (error) {
			console.error('Error fetching tarifs:', error);
		}
	});
</script>

<svelte:head>
	<title>PLaNner - Beranda</title>
</svelte:head>

<!-- Hero Section -->
<section class="from-primary-600 bg-gradient-to-r to-blue-700 text-white">
	<div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
		<div class="text-center">
			<h1 class="mb-6 text-4xl font-bold md:text-6xl">
				Pembayaran Listrik <br />
				<span class="text-blue-200">Pasca Bayar</span>
			</h1>
			<p class="mx-auto mb-8 max-w-3xl text-xl text-blue-100 md:text-2xl">
				Sistem pembayaran listrik yang mudah, cepat, dan terpercaya. Kelola tagihan listrik Anda
				dengan lebih efisien.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/register"
					class="btn text-primary-600 bg-white px-8 py-3 text-lg hover:bg-gray-100"
				>
					Daftar Sekarang
				</a>
				<a
					href="/login"
					class="btn btn-outline hover:text-primary-600 border-white px-8 py-3 text-lg text-white hover:bg-white"
				>
					Login
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Mengapa Memilih PLaNner?</h2>
			<p class="mx-auto max-w-2xl text-xl text-gray-600">
				Kami menyediakan layanan terbaik untuk kebutuhan pembayaran listrik Anda
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="card text-center">
				<div
					class="bg-primary-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				>
					<svg
						class="text-primary-600 h-8 w-8"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Pembayaran Cepat</h3>
				<p class="text-gray-600">
					Proses pembayaran yang cepat dan mudah dengan berbagai metode pembayaran yang tersedia.
				</p>
			</div>

			<div class="card text-center">
				<div
					class="bg-primary-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				>
					<svg
						class="text-primary-600 h-8 w-8"
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
				</div>
				<h3 class="mb-2 text-xl font-semibold">Aman & Terpercaya</h3>
				<p class="text-gray-600">
					Sistem keamanan tingkat tinggi dengan enkripsi data untuk melindungi informasi Anda.
				</p>
			</div>

			<div class="card text-center">
				<div
					class="bg-primary-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				>
					<svg
						class="text-primary-600 h-8 w-8"
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
				<h3 class="mb-2 text-xl font-semibold">Laporan Lengkap</h3>
				<p class="text-gray-600">
					Dapatkan laporan penggunaan dan riwayat pembayaran listrik yang detail dan akurat.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Tarif Preview Section -->
<section class="bg-gray-100 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Daftar Tarif Listrik</h2>
			<p class="text-xl text-gray-600">
				Tarif listrik yang transparan dan sesuai dengan standar PLN
			</p>
		</div>

		{#if tarifs.length > 0}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each tarifs as tarif}
					<div class="card">
						<div class="text-center">
							<h3 class="text-primary-600 mb-2 text-2xl font-bold">{tarif.daya} VA</h3>
							<p class="mb-1 text-3xl font-bold text-gray-900">
								Rp {tarif.tarif_perkwh?.toLocaleString('id-ID')}
							</p>
							<p class="text-sm text-gray-600">per kWh</p>
						</div>
					</div>
				{/each}
			</div>
			<div class="mt-8 text-center">
				<a href="/tarif" class="btn btn-primary"> Lihat Semua Tarif </a>
			</div>
		{:else}
			<div class="py-8 text-center">
				<p class="text-gray-600">Memuat data tarif...</p>
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section -->
<section class="bg-primary-600 py-20 text-white">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="mb-4 text-3xl font-bold md:text-4xl">Siap Memulai?</h2>
		<p class="mb-8 text-xl text-blue-100">
			Daftar sekarang dan nikmati kemudahan pembayaran listrik dengan PLaNner
		</p>
		<a href="/register" class="btn text-primary-600 bg-white px-8 py-3 text-lg hover:bg-gray-100">
			Daftar Gratis
		</a>
	</div>
</section>
