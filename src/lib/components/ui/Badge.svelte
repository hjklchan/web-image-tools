<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Variant = 'default' | 'strong' | 'muted';

  type Props = {
    variant?: Variant;
    class?: string;
    children?: Snippet;
  };

  let { variant = 'default', class: className = '', children }: Props = $props();

  const cls = $derived(() =>
    variant === 'strong' ? 'ui-badge-strong'
    : variant === 'muted' ? 'ui-badge-muted'
    : 'ui-badge'
  );
</script>

<span class={cx(cls(), className)}>{@render children?.()}</span>
