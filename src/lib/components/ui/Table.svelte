<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from './utils';

  export type Column = {
    key: string;
    title: string;
    thClass?: string;
    tdClass?: string;
    mono?: boolean;
    meta?: boolean;
  };

  type Row = Record<string, unknown>;

  type Props = {
    columns: Column[];
    rows: Row[];
    class?: string;
    cell?: Snippet<[row: Row, col: Column]>;
  };

  let { columns, rows, class: className = '', cell }: Props = $props();
</script>

<div class={cx('ui-table-wrap', className)}>
  <table class="ui-table">
    <thead class="ui-thead">
      <tr class="ui-tr-head">
        {#each columns as col, idx (col.key)}
          <th class={cx(idx === columns.length - 1 ? 'ui-th-last' : 'ui-th', col.thClass)}>
            {col.title}
          </th>
        {/each}
      </tr>
    </thead>

    <tbody class="text-sm">
      {#each rows as row, r (r)}
        <tr class={r === rows.length - 1 ? '' : 'ui-tr'}>
          {#each columns as col, c (col.key)}
            {@const base = c === columns.length - 1 ? 'ui-td-last' : 'ui-td'}
            {@const mono = col.mono ? 'font-mono' : ''}
            {@const meta = col.meta ? 'ui-td-meta' : ''}
            <td class={cx(base, mono, meta, col.tdClass)}>
              {#if cell}
                {@render cell(row, col)}
              {:else}
                {String(row[col.key] ?? '')}
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
