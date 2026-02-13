<script lang="ts">
  import { cx } from './utils';

  export type Step = { label: string; status?: 'done' | 'active' | 'pending' };

  type Props = { title?: string; items: Step[]; class?: string };
  let { title = 'Steps', items, class: className = '' }: Props = $props();
</script>

<div class={cx('ui-card', className)}>
  <div class="ui-card-hd">{title}</div>
  <ol class="ui-steps">
    {#each items as it, i (i)}
      <li class="ui-step">
        <span><span class="ui-step-n">{i + 1}.</span> {it.label}</span>
        {#if it.status === 'done'}
          <span class="ui-badge">done</span>
        {:else if it.status === 'active'}
          <span class="ui-badge-strong">active</span>
        {:else}
          <span class="ui-badge-muted">pending</span>
        {/if}
      </li>
    {/each}
  </ol>
</div>
