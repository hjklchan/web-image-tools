<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Variant = 'default' | 'primary' | 'subtle';
  type Size = 'md' | 'sm';

  type Props =
    & {
      variant?: Variant;
      size?: Size;
      block?: boolean;
      disabled?: boolean;
      class?: string;
      children?: Snippet;
    }
    & svelteHTML.IntrinsicElements['button'];

  let {
    variant = 'default',
    size = 'md',
    block = false,
    disabled = false,
    class: className = '',
    type = 'button',
    children,
    ...rest
  }: Props = $props();

  const variantClass = $derived(() =>
    variant === 'primary' ? 'ui-btn ui-btn-primary'
    : variant === 'subtle' ? 'ui-btn ui-btn-subtle'
    : 'ui-btn'
  );

  const sizeClass = $derived(() => (size === 'sm' ? 'ui-btn-sm' : ''));
</script>

<button
  {...rest}
  {type}
  {disabled}
  class={cx(variantClass(), sizeClass(), block && 'w-full', disabled && 'ui-btn-disabled', className)}
>
  {@render children?.()}
</button>
