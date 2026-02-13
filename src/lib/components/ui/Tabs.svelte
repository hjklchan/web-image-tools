<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  export type TabItem = { key: string; label: string; disabled?: boolean; content?: string };

  type Props = {
    items: TabItem[];
    active?: string;
    class?: string;
    panel?: Snippet<[active: string, item: TabItem | undefined]>;
  };

  let { items, active = $bindable(''), class: className = '', panel }: Props = $props();

  $effect(() => {
    if (!active && items.length) active = items[0].key;
  });

  const item = $derived(() => items.find((x) => x.key === active));

  function setActive(k: string, disabled?: boolean) {
    if (disabled) return;
    active = k;
  }
</script>

<div class={cx(className)}>
  <div class="ui-tabs">
    {#each items as it (it.key)}
      <button
        type="button"
        class={cx('ui-tab', it.key === active && 'ui-tab-active', it.disabled && 'opacity-50')}
        on:click={() => setActive(it.key, it.disabled)}
        disabled={it.disabled}
      >
        {it.label}
      </button>
    {/each}
  </div>

  <div class="mt-3 ui-tabpanel">
    {#if panel}
      {@render panel(active, item())}
    {:else}
      {item()?.content ?? ''}
    {/if}
  </div>
</div>
