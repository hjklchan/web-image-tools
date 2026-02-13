<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props =
    & {
      group?: string;
      value: string;
      class?: string;
      children?: Snippet;
    }
    & Omit<svelteHTML.IntrinsicElements['input'], 'type' | 'value'>;

  let { group = $bindable(''), value, class: className = '', children, ...rest }: Props = $props();
</script>

<label class={cx('flex items-center gap-2 text-sm', className)}>
  <input {...rest} type="radio" class="ui-radio" bind:group value={value} />
  <span>{@render children?.()}</span>
</label>
