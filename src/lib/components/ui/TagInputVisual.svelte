<script lang="ts">
  import { cx } from './utils';

  type Props = { label?: string; tags?: string[]; placeholder?: string; class?: string };
  let { label = 'Tag input (visual)', tags = ['tag-a', 'tag-b'], placeholder = 'type...', class: className = '' }: Props = $props();
</script>

<div class={cx('block', className)}>
  <div class="ui-label">{label}</div>
  <div class="mt-1 ui-tagbox">
    {#each tags as t (t)}
      <span class="ui-tag">{t}</span>
    {/each}
    <input class="ui-tag-input" {placeholder} />
  </div>
  <div class="ui-help mt-1">只是样式示意</div>
</div>
