<script lang="ts">
    import Dialog from "./Dialog.svelte";
    import DateInput from "./DateInput.svelte";
    import DateTimeInput from "./DateTimeInput.svelte";

    import type { Row, Columns } from "$/utils/db";
    import NetUtils from "$/utils/net";
    import { error } from "$/utils/alert";

    export let columns: Columns;

    /** 需要bind */
    export let row: Row<typeof columns> | undefined;

    export let title: string | undefined;

    export let ui: HTMLDialogElement;

    export let style: string | undefined = undefined;

    export let handler: () => any;

    const foreignKeyCheck = async () => {
        if (!row) return false;

        let flag = true;
        for (const [key, { renderName, foreignKey }] of Object.entries(columns)) {
            if (!foreignKey) continue;

            await NetUtils.query(foreignKey!.tableName, {
                searchBy: foreignKey!.key,
                query: row[key],
                match: "eq",
            }).then((json) => json.data.count || ((flag = false), error(`外键 ${renderName} (${key}) 找不到对应值!`, 5000)));
        }

        return flag;
    };
</script>

<!-- 通用编辑屏幕 -->
<Dialog bind:ui {title} {style}>
    <div slot="content" class="grid grid-cols-3 gap-4">
        {#if row}
            {#each Object.entries(columns) as [key, column] (key)}
                <div class={column.editRule === "textarea" ? "col-span-3 max-h-[50vh]" : ""}>
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text" class:font-semibold={column.isPrimary} class:italic={column.foreignKey}>
                                {column.renderName}
                            </span>
                            {#if column.foreignKey}
                                <span class="label-text-alt">{column.foreignKey.tableName} - {column.foreignKey.key}</span>
                            {/if}
                        </div>
                        {#if column.editRule === "number"}
                            <input
                                type="number"
                                step={column.step}
                                inputmode="numeric"
                                class="input input-bordered"
                                class:input-primary={column.isPrimary}
                                class:input-secondary={column.foreignKey}
                                readonly={column.isImmutable}
                                bind:value={row[key]}
                            />
                        {:else if column.editRule === "text"}
                            <input
                                type="text"
                                class="input input-bordered"
                                class:input-primary={column.isPrimary}
                                class:input-secondary={column.foreignKey}
                                readonly={column.isImmutable}
                                bind:value={row[key]}
                            />
                        {:else if column.editRule === "date"}
                            <DateInput
                                class="input input-bordered{column.isPrimary ? ' input-primary' : ''}{column.foreignKey ? ' input-secondary' : ''}"
                                readonly={column.isImmutable}
                                bind:value={row[key]}
                            />
                        {:else if column.editRule === "datetime"}
                            <DateTimeInput
                                class="input input-bordered{column.isPrimary ? ' input-primary' : ''}{column.foreignKey ? ' input-secondary' : ''}"
                                readonly={column.isImmutable}
                                bind:value={row[key]}
                            />
                        {:else if column.editRule === "textarea"}
                            <textarea
                                class="textarea textarea-bordered textarea-md"
                                class:input-primary={column.isPrimary}
                                class:input-secondary={column.foreignKey}
                                readonly={column.isImmutable}
                                bind:value={row[key]}
                            ></textarea>
                        {/if}
                    </label>
                </div>
            {/each}
        {/if}
    </div>

    <div slot="action" class="modal-action items-center">
        <span class="text-info">该操作不可撤销</span>
        <form method="dialog" on:submit={async () => ((await foreignKeyCheck()) ? handler() : error("外键不匹配, 请检查输出信息!", 5000))}>
            <button class="btn btn-info">确认</button>
        </form>
    </div>
</Dialog>
