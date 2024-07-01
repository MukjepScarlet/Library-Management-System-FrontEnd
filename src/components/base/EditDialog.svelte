<script lang="ts">
    import Dialog from "./Dialog.svelte";
    import DateInput from "./DateInput.svelte";
    import DateTimeInput from "./DateTimeInput.svelte";

    import type { Row, Columns } from "$/utils/db";

    export let columns: Columns;

    /** 需要bind */
    export let row: Row<typeof columns> | undefined;

    export let title: string | undefined;

    export let ui: HTMLDialogElement;

    export let style: string | undefined = undefined;

    export let handler: () => any;
</script>

<!-- 通用编辑屏幕 -->
<Dialog bind:ui {title} {style}>
    <div slot="content" class="grid grid-cols-3 gap-4">
        {#if row}
            {#each Object.entries(columns) as [key, column] (key)}
                <div class={column.editRule === "textarea" ? "col-span-3 max-h-[50vh]" : ""}>
                    <label class="form-control">
                        <span class="label-text" class:font-semibold={column.isPrimary} class:italic={column.foreignKey}>
                            {column.renderName}
                        </span>
                        <!-- TODO: 外键特殊处理 -->
                        <!-- 是否需要? -->
                        {#if column.editRule === "number"}
                            <input
                                type="number"
                                step={column.step}
                                inputmode="numeric"
                                class="input input-bordered"
                                readonly={column.isImmutable}
                                bind:value={row[key]}
                            />
                        {:else if column.editRule === "text"}
                            <input type="text" class="input input-bordered" readonly={column.isImmutable} bind:value={row[key]} />
                        {:else if column.editRule === "date"}
                            <DateInput class="input input-bordered" readonly={column.isImmutable} bind:value={row[key]} />
                        {:else if column.editRule === "datetime"}
                            <DateTimeInput class="input input-bordered" readonly={column.isImmutable} bind:value={row[key]} />
                        {:else if column.editRule === "textarea"}
                            <textarea class="textarea textarea-bordered textarea-md" readonly={column.isImmutable} bind:value={row[key]}></textarea>
                            <!-- {:else} -->
                        {/if}
                    </label>
                </div>
            {/each}
        {/if}
    </div>

    <div slot="action" class="modal-action items-center">
        <span class="text-info">该操作不可撤销</span>
        <form method="dialog" on:submit={handler}>
            <button class="btn btn-info">确认</button>
        </form>
    </div>
</Dialog>
