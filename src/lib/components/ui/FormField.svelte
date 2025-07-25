<script lang="ts">
	export let label: string;
	export let name: string;
	export let type = 'text';
	export let value: string | number = '';
	export let error: string = '';
	export let placeholder = '';
	export let required = false;
	export let disabled = false;
	export let maxlength: number | undefined = undefined;
	export let helpText = '';

	$: inputClasses = `
        w-full rounded-lg border px-4 py-3 transition-all duration-200 
        focus:border-transparent focus:ring-2 focus:ring-blue-500 
        disabled:cursor-not-allowed disabled:bg-gray-100
        ${error ? 'border-red-300' : 'border-gray-300'}
    `;
</script>

<div>
	<label for={name} class="mb-2 block text-sm font-medium text-gray-700">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>

	<input
		{type}
		id={name}
		{name}
		bind:value
		{disabled}
		{placeholder}
		{maxlength}
		class={inputClasses}
		on:input
		on:blur
		on:focus
	/>

	{#if error}
		<p class="mt-1 text-sm text-red-500">{error}</p>
	{/if}

	{#if helpText && !error}
		<p class="mt-1 text-xs text-gray-500">{helpText}</p>
	{/if}
</div>
