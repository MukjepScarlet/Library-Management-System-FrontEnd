<script lang="ts">
    import { type Row, type Columns } from "$/utils/db";

    export let columns: Columns;

    export let row: Row<typeof columns> | undefined = undefined;

    export let showKey = false;

    export { _class as class };

    let _class = "";
</script>

{#if row}
    <table class="table table-sm {_class}">
        <thead>
            <tr>
                {#if showKey}
                    <th>SQL 列名</th>
                {/if}
                <th>名称</th>
                <th>值</th>
            </tr>
        </thead>
        <tbody>
            {#each Object.entries(columns) as [key, column] (key)}
                <tr class:font-semibold={column.isPrimary} class:italic={column.foreignKey}>
                    {#if showKey}
                        <td>{key}</td>
                    {/if}
                    <td>{column.renderName}</td>
                    <td class={row[key] ? "" : "italic text-base-300"}>
                        {#if row[key]}
                            {column.render(row[key])}
                        {:else}
                            NULL
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
