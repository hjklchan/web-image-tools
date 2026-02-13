<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props =
    & {
      title?: string;
      strong?: boolean;
      class?: string;
      children?: Snippet;
    }
    & svelteHTML.IntrinsicElements['div'];

  let { title, strong = false, class: className = '', children, ...rest }: Props = $props();

  const alertClass = $derived(() => (strong ? 'ui-alert ui-alert-strong' : 'ui-alert'));
</script>

<div {...rest} class={cx(alertClass(), className)}>
  {#if title}<div class="ui-alert-title">{title}</div>{/if}
  <div class="mt-1">{@render children?.()}</div>
</div>
