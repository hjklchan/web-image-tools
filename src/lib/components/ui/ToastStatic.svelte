<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props = { title?: string; strong?: boolean; class?: string; children?: Snippet };
  let { title = 'SAVED', strong = false, class: className = '', children }: Props = $props();

  const toastClass = $derived(() => (strong ? 'ui-alert ui-alert-strong' : 'ui-alert'));
</script>

<div class={cx(toastClass(), className)}>
  <div class="ui-alert-title">{title}</div>
  <div class="mt-1">
    {#if children}
      {@render children()}
    {:else}
      Your changes were saved.
    {/if}
  </div>
</div>
