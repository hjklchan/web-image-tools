<script lang="ts">
  import { cx } from './utils';

  type Props =
    & {
      label?: string;
      value?: string;
      class?: string;
      textareaClass?: string;
    }
    & svelteHTML.IntrinsicElements['textarea'];

  let {
    label,
    value = $bindable<string>(''),
    class: className = '',
    textareaClass = '',
    ...rest
  }: Props = $props();
</script>

<label class={cx('block', className)}>
  {#if label}<span class="ui-label">{label}</span>{/if}
  <textarea {...rest} bind:value class={cx('mt-1 ui-input', textareaClass)} />
</label>
