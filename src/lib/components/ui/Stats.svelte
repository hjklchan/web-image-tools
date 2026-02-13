<script lang="ts">
  import { cx } from './utils';

  export type Stat = { key: string; value: string };

  type Props = { title?: string; items: Stat[]; class?: string };
  let { title = 'Stats', items, class: className = '' }: Props = $props();
</script>

<div class={cx('ui-card', className)}>
  <div class="ui-card-hd">{title}</div>
  <div class="ui-stats">
    {#each items as it (it.key)}
      <div class="ui-stat">
        <div class="ui-stat-k">{it.key}</div>
        <div class="ui-stat-v">{it.value}</div>
      </div>
    {/each}
  </div>
</div>
