<script lang="ts">
    import type { Columns, Row } from "$/utils/db";

    export { _class as class };
    let _class = "";

    export let columns: Columns<any>;

    export let row: Row<typeof columns> | undefined;
</script>

<div class={_class}>
    {#if row}
        {#each Object.entries(columns) as [key, column] (key)}
            <div class={column.type === "TEXT" ? "col-span-3 max-h-[50vh]" : ""}>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <!-- TODO -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text" class:font-semibold={column.isPrimary} class:italic={column.foreignKey}>
                            {column.name}
                        </span>
                        {#if column.foreignKey}
                            <span class="label-text-alt">{column.foreignKey.tableName} - {column.foreignKey.key}</span>
                        {/if}
                    </div>
                    <!-- TODO: TS not matches the attributes of svelte:component -->
                    <svelte:component
                        this={column.editor}
                        {column}
                        class={column.type === "TEXT" ? "textarea textarea-bordered textarea-md" : "input input-bordered"}
                        bind:value={row[key]}
                    />
                </label>
            </div>
        {/each}
    {/if}
</div>
