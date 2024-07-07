<script lang="ts">
    import Dialog from "./Dialog.svelte";
    import type { Row, Columns } from "$/utils/db";
    import NetUtils from "$/utils/net";
    import { error } from "$/utils/alert";
    import Editor from "../editor/Editor.svelte";

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
    <svelte:fragment slot="content">
        <Editor class="grid grid-cols-3 gap-4" bind:row {columns} />
    </svelte:fragment>

    <div slot="action" class="modal-action items-center">
        <span class="text-info">该操作不可撤销</span>
        <form method="dialog" on:submit={async () => ((await foreignKeyCheck()) ? handler() : error("外键不匹配, 请检查输出信息!", 5000))}>
            <button class="btn btn-info">确认</button>
        </form>
    </div>
</Dialog>
