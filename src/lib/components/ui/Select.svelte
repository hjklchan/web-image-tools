<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props =
    & {
      label?: string;
      value?: string;
      class?: string;
      selectClass?: string;
      children?: Snippet;
    }
    & svelteHTML.IntrinsicElements['select'];

  let {
    label,
    value = $bindable<string>(''),
    class: className = '',
    selectClass = '',
    children,
    ...rest
  }: Props = $props();
</script>

<label class={cx('block', className)}>
  {#if label}<span class="ui-label">{label}</span>{/if}
  <select {...rest} bind:value class={cx('mt-1 ui-input', selectClass)}>
    {@render children?.()}
  </select>
</label>
