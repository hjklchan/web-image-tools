<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props =
    & {
      checked?: boolean;
      class?: string;
      children?: Snippet;
    }
    & Omit<svelteHTML.IntrinsicElements['input'], 'type'>;

  let { checked = $bindable(false), class: className = '', children, ...rest }: Props = $props();
</script>

<label class={cx('flex items-center gap-2 text-sm', className)}>
  <input {...rest} type="checkbox" class="ui-check" bind:checked />
  <span>{@render children?.()}</span>
</label>
