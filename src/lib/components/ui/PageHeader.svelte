<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		class?: string;
	}

	let { title, subtitle = "", class: className = "" }: Props = $props();
</script>

<header
	class="mb-3 border border-retro-navy-border bg-retro-navy px-4 py-2 text-retro-cream shadow-[2px_2px_0_var(--color-retro-navy-dark)] {className}"
>
	<h1 class="text-lg font-bold sm:text-xl">{title}</h1>
	{#if subtitle}
		<span class="text-xs opacity-90">{subtitle}</span>
	{/if}
</header>
