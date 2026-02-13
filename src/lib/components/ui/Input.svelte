<script lang="ts">
  import { cx } from './utils';

  type Props =
    & {
      label?: string;
      value?: string;
      class?: string;
      inputClass?: string;
    }
    & svelteHTML.IntrinsicElements['input'];

  let {
    label,
    value = $bindable<string>(''),
    class: className = '',
    inputClass = '',
    ...rest
  }: Props = $props();
</script>

<label class={cx('block', className)}>
  {#if label}<span class="ui-label">{label}</span>{/if}
  <input {...rest} bind:value class={cx('mt-1 ui-input', inputClass)} />
</label>
