<script lang="ts">
    import Dialog from "$/components/base/Dialog.svelte";
    import RowDetails from "$/components/RowDetails.svelte";
    import Table from "$/components/Table.svelte";
    import { error, success } from "$/utils/alert";
    import type { Row } from "$/utils/db";
    import { NetUtils } from "$/utils/net";
    import { TABLES } from "$/utils/tables";
    import { currentIdNumber, userInfo } from "$/utils/user";

    import { route, current } from "$/utils/utils";

    $route = ["个人"];
    $current = "借阅";

    const columns = TABLES.borrowinfo.columns;

    let currentRow: Row<typeof columns> | undefined;

    let returnUI: HTMLDialogElement;

    const returnHandler = () => {
        if (!currentRow) {
            error("先选中一条借阅信息!");
            return;
        }

        if (!$currentIdNumber) {
            error("先登录!");
            return;
        }

        NetUtils.remove('borrowinfo', [currentRow.id]).then(() => {
            success("归还成功!");
            // TODO: 刷新表格
        });
    };
</script>

<Table name="borrowinfo" selectAPI={NetUtils.myBorrow} selectParam={$userInfo?.userId}>
    <button slot="operation" let:row class="btn btn-sm btn-primary" on:click={() => (currentRow = row) && returnUI.showModal()}> 归还 </button>

    <Dialog slot="dialog" bind:ui={returnUI} title="操作确认: 还书">
        <div slot="content">
            <p class="py-4">确认归还以下的书籍?</p>

            <RowDetails row={currentRow} {columns} />
        </div>

        <div slot="action" class="modal-action items-center">
            <form method="dialog" on:submit={returnHandler}>
                <button class="btn btn-success">确认</button>
            </form>
        </div>
    </Dialog>
</Table>
