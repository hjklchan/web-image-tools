<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props =
    & {
      title?: string;
      subbar?: string;
      class?: string;
      header?: Snippet;
      footer?: Snippet;
      children?: Snippet;
    }
    & svelteHTML.IntrinsicElements['section'];

  let {
    title,
    subbar,
    class: className = '',
    header,
    footer,
    children,
    ...rest
  }: Props = $props();
</script>

<section {...rest} class={cx('ui-panel', className)}>
  {#if header}
    {@render header()}
  {:else if title}
    <div class="ui-panel-hd">{title}</div>
  {/if}

  <div class="ui-panel-bd">
    {@render children?.()}
  </div>

  {#if footer}
    {@render footer()}
  {:else if subbar}
    <div class="ui-subbar">{subbar}</div>
  {/if}
</section>
