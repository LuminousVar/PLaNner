<script lang="ts">
	export let loading = false;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'primary' | 'secondary' = 'primary';
	export let loadingText = 'Memproses...';

	$: isDisabled = loading || disabled;

	$: buttonClasses = `
        w-full transform rounded-lg px-4 py-3 font-medium transition-all duration-200 
        focus:ring-2 focus:ring-offset-2 focus:outline-none 
        disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50
        ${
					variant === 'primary'
						? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
				}
    `;
</script>

<button {type} disabled={isDisabled} class={buttonClasses} on:click>
	{#if loading}
		<span class="flex items-center justify-center">
			<svg
				class="mr-3 -ml-1 h-5 w-5 animate-spin text-current"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			{loadingText}
		</span>
	{:else}
		<slot />
	{/if}
</button>
