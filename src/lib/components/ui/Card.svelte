<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  type Props =
    & {
      title?: string;
      class?: string;
      header?: Snippet;
      children?: Snippet;
    }
    & svelteHTML.IntrinsicElements['article'];

  let { title, class: className = '', header, children, ...rest }: Props = $props();
</script>

<article {...rest} class={cx('ui-card', className)}>
  {#if header}
    {@render header()}
  {:else if title}
    <div class="ui-card-hd">{title}</div>
  {/if}

  <div class="ui-card-bd">
    {@render children?.()}
  </div>
</article>
