<script lang="ts">
  import { cx } from './utils';

  type Props = { title?: string; lines?: number; class?: string };
  let { title = 'Skeleton', lines = 4, class: className = '' }: Props = $props();

  const widths = $derived(() => {
    const arr: string[] = [];
    for (let i = 0; i < lines; i++) {
      arr.push(i === 0 ? 'w-2/3' : i === lines - 1 ? 'w-1/2 h-8' : 'w-full');
    }
    return arr;
  });
</script>

<div class={cx('ui-card', className)}>
  <div class="ui-card-hd">{title}</div>
  <div class="p-3 space-y-2">
    {#each widths() as w, i (i)}
      <div class={cx('ui-skeleton h-3', w)}></div>
    {/each}
  </div>
</div>
