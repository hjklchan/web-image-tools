<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props = { class?: string; children?: Snippet };
  let { class: className = '', children }: Props = $props();
</script>

<kbd class={cx('ui-kbd', className)}>{@render children?.()}</kbd>
