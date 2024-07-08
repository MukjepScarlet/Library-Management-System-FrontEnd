<script lang="ts">
    import Dialog from "$/components/base/Dialog.svelte";
    import RowDetails from "$/components/RowDetails.svelte";
    import Table from "$/components/Table.svelte";
    import { error, success } from "$/utils/alert";
    import type { Column, Row } from "$/utils/db";
    import NetUtils from "$/utils/net";
    import { TABLES } from "$/utils/db";
    import { currentIdNumber, userInfo } from "$/utils/user";

    import { route, current } from "$/utils/utils";
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";

    $route = ["个人"];
    $current = "借阅";

    const columns = TABLES.borrowinfo.columns;

    let currentRow: Row<typeof columns> | undefined;

    onMount(() => {
        if (!$userInfo) {
            error("先登录!");
            push("/");
        }
    });

    let returnUI: HTMLDialogElement;

    let selectTrigger = false;

    const returnHandler = () => {
        if (!currentRow) {
            error("先选中一条借阅信息!");
            return;
        }

        if (!$currentIdNumber) {
            error("先登录!");
            return;
        }

        NetUtils.remove("borrowinfo", [currentRow.id]).then(() => {
            success("归还成功!");
            selectTrigger = true;
        });
    };

    const setRow = (row: Row<{ [key: string]: Column<any> }> | undefined) => (currentRow = row as Row<typeof columns>);
</script>

<Table name="borrowinfo" selectAPI={NetUtils.myBorrow} selectParam={$userInfo?.userId?.toString()} bind:selectTrigger>
    <button slot="operation" let:row class="btn btn-sm btn-primary" on:click={() => setRow(row) && returnUI.showModal()}> 归还 </button>

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
