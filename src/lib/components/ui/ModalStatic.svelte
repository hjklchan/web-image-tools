<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props = { title?: string; class?: string; body?: Snippet; actions?: Snippet };
  let { title = 'Confirm', class: className = '', body, actions }: Props = $props();
</script>

<div class={cx('ui-modal', className)}>
  <div class="ui-modal-hd">{title}</div>
  <div class="ui-modal-bd">
    {#if body}
      {@render body()}
    {:else}
      Are you sure you want to proceed?
    {/if}

    <div class="ui-modal-actions">
      {#if actions}
        {@render actions()}
      {:else}
        <button class="ui-btn ui-btn-primary" type="button">OK</button>
        <button class="ui-btn" type="button">Cancel</button>
      {/if}
    </div>

    <div class="ui-help mt-2">静态展示（样式）</div>
  </div>
</div>
