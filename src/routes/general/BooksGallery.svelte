<script lang="ts">
    import Dialog from "$/components/base/Dialog.svelte";
    import Table from "$/components/Table.svelte";
    import RowDetails from "$/components/RowDetails.svelte";

    import DBUtils, { Column, NumberColumn, type Row } from "$/utils/db";
    import { error, success } from "$/utils/alert";

    import { route, current, clamp } from "$/utils/utils";
    import { TABLES } from "$/utils/db";
    import NetUtils from "$/utils/net";
    import { userInfo } from "$/utils/user";

    $route = ["通用"];
    $current = "书籍";

    const columns = TABLES.books.columns;

    let currentRow: Row<typeof columns> | undefined;

    let borrowUI: HTMLDialogElement;

    let borrowDays = 7;
    const maxDays = 180;
    $: borrowDays = clamp(borrowDays, 1, maxDays);

    let selectTrigger = false;

    const borrowHandler = () => {
        if (!currentRow) {
            error("先选中一本书!");
            return;
        }

        if (!$userInfo) {
            error("先登录!");
            return;
        }

        if (!currentRow.num) {
            error("这本书没有库存了!");
            return;
        }

        NetUtils.borrow($userInfo.userId, currentRow.isbn, borrowDays).then(() => {
            success("借阅成功!");
            selectTrigger = true;
        });
    };

    const setRow = (row: Row<{ [key: string]: Column<any> }> | undefined) => (currentRow = row as Row<typeof columns>);
</script>

<Table name="books" bind:selectTrigger>
    <button slot="operation" let:row class="btn btn-sm btn-primary" disabled={!row?.num} on:click={() => setRow(row) && borrowUI.showModal()}> 借书 </button>

    <Dialog slot="dialog" bind:ui={borrowUI} title="操作确认: 借书">
        <div slot="content">
            <p class="py-4"> 确认借阅以下的书籍? </p>

            <label class="form-control">
                <div class="label">
                    <span class="label-text">借阅日数</span>
                    <span class="label-text-alt">最多 {maxDays} 天</span>
                </div>
                <input type="number" step="1" inputmode="numeric" class="input input-primary input-bordered" bind:value={borrowDays} />
            </label>

            <RowDetails row={currentRow} {columns} />
        </div>

        <div slot="action" class="modal-action items-center">
            <form method="dialog" on:submit={borrowHandler}>
                <button class="btn btn-success">确认</button>
            </form>
        </div>
    </Dialog>
</Table>
