<script lang="ts">
	export let error: string;
	export let title = 'Terjadi Kesalahan';
</script>

<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
	<div class="flex">
		<svg
			class="mt-0.5 mr-3 h-5 w-5 text-red-400"
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
			<h3 class="text-sm font-medium text-red-800">{title}</h3>
			<p class="mt-1 text-sm text-red-700">{error}</p>
		</div>
	</div>
</div>
