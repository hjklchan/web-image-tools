<script lang="ts">
  import { cx } from './utils';

  type Props = { label?: string; items?: string[]; class?: string };
  let { label = 'Menu', items = ['Item A', 'Item B', 'Item C'], class: className = '' }: Props = $props();
</script>

<div class={cx('ui-dropdown p-3', className)}>
  <button type="button" class="ui-dropdown-btn">{label} ▼</button>
  <div class="ui-dropdown-menu">
    {#each items as it, i (it)}
      <a href="#" class={cx('ui-dropdown-item', i !== items.length - 1 && 'ui-dropdown-item-sep')}>
        {it}
      </a>
    {/each}
  </div>
  <div class="ui-help mt-2">静态展示（样式）</div>
</div>
