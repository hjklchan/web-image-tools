<script lang="ts">
  import { cx } from './utils';

  type Props = {
    page?: number;
    totalPages: number;
    class?: string;
  };

  let { page = $bindable(1), totalPages, class: className = '' }: Props = $props();

  function go(p: number) {
    page = Math.max(1, Math.min(totalPages, p));
  }

  const pages = $derived(() => {
    const max = totalPages;
    const window = 7;
    const half = Math.floor(window / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(max, start + window - 1);
    start = Math.max(1, end - window + 1);

    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  });
</script>

<nav class={cx('ui-pagination', className)} aria-label="Pagination">
  <button
    type="button"
    class={cx('ui-pagebtn ui-pagebtn-sep', page === 1 && 'opacity-50')}
    on:click={() => go(page - 1)}
    disabled={page === 1}
  >
    Prev
  </button>

  {#each pages() as p (p)}
    <button
      type="button"
      class={cx('ui-pagebtn ui-pagebtn-sep', p === page && 'ui-pagebtn-active')}
      on:click={() => go(p)}
      aria-current={p === page ? 'page' : undefined}
    >
      {p}
    </button>
  {/each}

  <button
    type="button"
    class={cx('ui-pagebtn', page === totalPages && 'opacity-50')}
    on:click={() => go(page + 1)}
    disabled={page === totalPages}
  >
    Next
  </button>
</nav>
