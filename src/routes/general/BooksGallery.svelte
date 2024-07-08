<script lang="ts">
    import Dialog from "$/components/base/Dialog.svelte";
    import Table from "$/components/Table.svelte";
    import RowDetails from "$/components/RowDetails.svelte";

    import DBUtils, { Column, type Row } from "$/utils/db";
    import { error, success } from "$/utils/alert";

    import { route, current } from "$/utils/utils";
    import { TABLES } from "$/utils/db";
    import NetUtils from "$/utils/net";
    import { userInfo } from "$/utils/user";

    $route = ["通用"];
    $current = "书籍";

    const columns = TABLES.books.columns;

    let currentRow: Row<typeof columns> | undefined;

    let borrowUI: HTMLDialogElement;

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

        const newBorrow = DBUtils.emptyRow<"borrowinfo">(TABLES.borrowinfo.columns);
        newBorrow.isbn = currentRow.isbn;
        newBorrow.userId = $userInfo.userId;
        newBorrow.beginTime = new Date();
        newBorrow.returnTime = new Date();
        // 默认7天归还
        newBorrow.returnTime.setDate(newBorrow.beginTime.getDate() + 7);

        NetUtils.add("borrowinfo", newBorrow).then(() => success("借阅成功!"));
    };

    const setRow = (row: Row<{ [key: string]: Column<any> }> | undefined) => (currentRow = row as Row<typeof columns>);
</script>

<Table name="books">
    <button slot="operation" let:row class="btn btn-sm btn-primary" disabled={!row?.num} on:click={() => setRow(row) && borrowUI.showModal()}> 借书 </button>

    <Dialog slot="dialog" bind:ui={borrowUI} title="操作确认: 借书">
        <div slot="content">
            <p class="py-4">确认借阅以下的书籍?</p>

            <RowDetails row={currentRow} {columns} />
        </div>

        <div slot="action" class="modal-action items-center">
            <span class="text-warning">默认借阅时间为 7 天</span>
            <form method="dialog" on:submit={borrowHandler}>
                <button class="btn btn-success">确认</button>
            </form>
        </div>
    </Dialog>
</Table>
