<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props = { title?: string; text?: string; class?: string; action?: Snippet };
  let { title = 'NO DATA', text = 'Nothing here yet.', class: className = '', action }: Props = $props();
</script>

<div class={cx('ui-card', className)}>
  <div class="ui-card-hd">Empty</div>
  <div class="p-3">
    <div class="ui-empty">
      <div class="ui-empty-title">{title}</div>
      <div class="ui-empty-text">{text}</div>
      {#if action}
        <div class="mt-3">{@render action()}</div>
      {/if}
    </div>
  </div>
</div>
