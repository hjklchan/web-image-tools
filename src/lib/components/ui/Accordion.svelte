<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props = { summary: string; open?: boolean; class?: string; children?: Snippet };
  let { summary, open = false, class: className = '', children }: Props = $props();
</script>

<details class={cx('ui-accordion', className)} {open}>
  <summary class="ui-accordion-summary">{summary}</summary>
  <div class="ui-accordion-body">{@render children?.()}</div>
</details>
