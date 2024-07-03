<script lang="ts">
    import { onMount } from "svelte";
    import { Column, type Columns, type Row, emptyRow, preprocess } from "$/utils/db";
    import { NetUtils } from "$/utils/net";

    import Dialog from "./base/Dialog.svelte";
    import EditDialog from "./base/EditDialog.svelte";
    import RowDetails from "./RowDetails.svelte";
    import { warning, success } from "$/utils/alert";
    import { fade } from "svelte/transition";
    import { parseColumnName, TABLES, type TableName } from "$/utils/tables";

    /** 表名 */
    export let name: TableName;

    /** 表头 */
    const columns: Columns = TABLES[name].columns;
    $: primaryKey = Object.keys(columns).find((key) => columns[key].isPrimary)!;

    let rows: Row<typeof columns>[] = [];

    export let allowModify = false;

    // 顶栏表单控制

    let query = "";
    let searchBy = Object.keys(columns)[0];
    let fullMatch = true;

    let desc = false;
    let sortBy = Object.keys(columns)[0];

    let count = 20;

    let currentPage = 1;

    // 结果总数
    let total = 0;

    $: startIndex = Math.max(0, Math.min((currentPage - 1) * count, total));
    $: maxPage = count ? Math.ceil(total / count) : 0;

    $: if (currentPage < 1) currentPage = 1;
    else if (currentPage > maxPage) currentPage = maxPage;

    export let selectAPI: (p: any, options: NetUtils.QueryOptions) => Promise<any> = NetUtils.query;

    export let selectParam: string = name;

    const selectHandler = () => {
        currentRow = undefined;
        selectedKeys.length = 0;

        selectAPI(selectParam, {
            searchBy: parseColumnName(searchBy),
            query,
            match: fullMatch ? "eq" : "like",
            sortBy: parseColumnName(sortBy),
            order: desc ? "desc" : "asc",
            start: startIndex,
            count,
        }).then((json) => {
            total = json.data.count;
            rows = preprocess(columns, json.data.data);
        });
    };

    // 外键
    let foreignKeyUI: HTMLDialogElement;
    let currentColumn: keyof typeof columns | undefined;
    $: currentForeignKey = currentColumn ? columns[currentColumn].foreignKey : undefined;
    $: currentForeignColumns = currentForeignKey ? TABLES[currentForeignKey.tableName as TableName].columns : undefined;

    // 行操作
    let deleteUI: HTMLDialogElement;
    let updateUI: HTMLDialogElement;
    let insertUI: HTMLDialogElement;

    let currentRow: Row<typeof columns> | undefined;

    // 批量操作
    let multipleDeleteUI: HTMLDialogElement;
    let selectedKeys: Array<string | number | Date> = [];

    const updateHandler = () => {
        NetUtils.modify(name, currentRow!).then(() => {
            success("修改成功!");
            selectHandler();
        });
    };

    const insertHandler = () => {
        NetUtils.add(name, currentRow!).then(() => {
            success("添加成功!");
            selectHandler();
        });
    };

    const deleteHandler = () => {
        NetUtils.remove(name, [currentRow![primaryKey]]).then(() => {
            success("删除成功!");
            selectHandler();
        });
    };

    const multipleDeleteHandler = () => {
        NetUtils.remove(name, selectedKeys).then(() => {
            success("删除成功!");
            selectHandler();
        });
    };

    onMount(selectHandler);
</script>

<div class="flex flex-col justify-center gap-4 mt-4 mx-auto">
    <!-- select -->
    <div class="flex justify-start lg:justify-center items-center bg-transparent gap-4">
        <!-- search by -->
        <div class="tooltip tooltip-bottom" data-tip="搜索依据">
            <select class="select select-bordered select-sm w-auto" bind:value={searchBy}>
                {#each Object.entries(columns) as [key, column] (key)}
                    <option class={column.isPrimary ? "font-semibold" : ""} value={key}>{column.renderName}</option>
                {/each}
            </select>
        </div>

        <!-- search -->
        <label class="input input-bordered input-sm flex items-center gap-2 pr-0">
            <input
                type="text"
                class="grow"
                placeholder="搜索..."
                bind:value={query}
                on:keypress={(e) => e.key === "Enter" && (e.preventDefault(), selectHandler())}
            />
            <div class="tooltip tooltip-bottom" data-tip="搜索">
                <button class="btn btn-ghost btn-sm" on:click|preventDefault={selectHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"
                        ><path
                            fill-rule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clip-rule="evenodd"
                        /></svg
                    >
                </button>
            </div>
        </label>

        <!-- full match -->
        <div class="form-control">
            <label class="cursor-pointer label gap-2">
                <span class="label-text">精确搜索</span>
                <input type="checkbox" class="checkbox checkbox-accent" bind:checked={fullMatch} />
            </label>
        </div>

        <div class="divider divider-horizontal"></div>

        <!-- reverse -->
        <div class="form-control">
            <label class="cursor-pointer label gap-2">
                <span class="label-text">降序排序</span>
                <input type="checkbox" class="checkbox checkbox-primary" bind:checked={desc} />
            </label>
        </div>

        <!-- sort by -->

        <div class="tooltip tooltip-bottom tooltip-primary" data-tip="排序依据">
            <select class="select select-bordered select-sm w-auto" bind:value={sortBy}>
                {#each Object.entries(columns) as [key, column] (key)}
                    <option class:font-semibold={column.isPrimary} value={key}>{column.renderName}</option>
                {/each}
            </select>
        </div>

        <div class="divider divider-horizontal"></div>

        <!-- limitation -->
        <div class="form-control tooltip tooltip-bottom" data-tip="共 {total} 条记录">
            <label class="cursor-pointer label gap-2">
                <!-- why new line? -->
                <span class="label-text xl:w-32">每页数量: {count}</span>
                <input type="range" class="range range-info range-xs" min="10" max="50" bind:value={count} />
            </label>
        </div>

        <!-- pagination -->

        {#if maxPage > 1}
            <div class="form-control tooltip tooltip-bottom" data-tip={`1 - ${maxPage}`}>
                <label class="label gap-2">
                    <span class="label-text">页面跳转</span>
                    <input type="number" step="1" inputmode="numeric" class="input input-bordered input-sm w-20" bind:value={currentPage} />
                </label>
            </div>
        {/if}

        {#if allowModify}
            <div class="divider divider-horizontal"></div>

            <!-- multiple operations -->
            <details class="dropdown dropdown-end">
                <summary class="m-1 btn btn-sm">其他操作</summary>
                <ul class="p-2 shadow menu gap-2 dropdown-content z-[1] bg-base-100 rounded-box w-32">
                    <li>
                        <button class="btn btn-sm" on:click|preventDefault={() => (selectedKeys = rows.map((r) => r[primaryKey]))}> 全选 </button>
                    </li>
                    <li>
                        <button class="btn btn-sm" on:click|preventDefault={() => (selectedKeys.length = 0)}> 全不选 </button>
                    </li>
                    <li>
                        <button
                            class="btn btn-sm"
                            on:click|preventDefault={() => (selectedKeys = rows.map((r) => r[primaryKey]).filter((k) => !~selectedKeys.indexOf(k)))}
                        >
                            反选
                        </button>
                    </li>
                    <li></li>
                    <li>
                        <button class="btn btn-success btn-sm" on:click|preventDefault={() => (currentRow = emptyRow(columns)) && insertUI.showModal()}>
                            新增项目
                        </button>
                    </li>
                    <li>
                        <button
                            class="btn btn-error btn-sm"
                            on:click|preventDefault={() => (selectedKeys.length === 0 ? warning("请至少选中一项再执行此操作") : multipleDeleteUI.showModal())}
                        >
                            删除选中项目
                        </button>
                    </li>
                </ul>
            </details>
        {/if}
    </div>

    <!-- table -->
    <table class="table table-md lg:table-lg mx-auto" in:fade>
        <thead>
            <tr class="text-center">
                {#each Object.entries(columns) as [key, column] (key)}
                    {#if column.foreignKey}
                        <th>
                            <span class="tooltip tooltip-bottom" data-tip="映射到{column.foreignKey.tableName}:{column.foreignKey.key}的外键">
                                {column.renderName}
                            </span>
                        </th>
                    {:else}
                        <th><span>{column.renderName}</span></th>
                    {/if}
                {/each}
                <!-- operations -->
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            {#each rows as row (row[primaryKey])}
                <tr class="hover:bg-base-200 transition text-center" transition:fade>
                    <!-- 内容 -->
                    {#each Object.entries(columns) as [key, column] (key)}
                        {#if row[key]}
                            <td class:font-semibold={column.isPrimary} class:italic={column.foreignKey !== undefined}>
                                <!-- 主键特殊处理: 多选框 -->
                                {#if column.isPrimary}
                                    <label class="label cursor-pointer">
                                        <span class="label-text">{column.render?.(row[key])}</span>
                                        <input type="checkbox" class="checkbox" bind:group={selectedKeys} value={row[key]} />
                                    </label>
                                    <!-- 外键特殊处理 -->
                                {:else if column.foreignKey !== undefined}
                                    <button
                                        class="btn btn-sm btn-secondary tooltip tooltip-secondary"
                                        data-tip="展开外键详情"
                                        on:click={() => (currentRow = row) && (currentColumn = key) && foreignKeyUI.showModal()}
                                    >
                                        {column.render?.(row[key])}
                                    </button>
                                    <!-- 长文本特殊处理: 隐藏过长内容 -->
                                {:else if column.editRule === "textarea"}
                                    <span class="tooltip" data-tip={row[key]}>
                                        {column.render?.(row[key])}
                                    </span>
                                    <!-- 标准 -->
                                {:else}
                                    <span>{column.render?.(row[key])}</span>
                                {/if}
                            </td>
                        {:else}
                            <td class="italic text-base-300">NULL</td>
                        {/if}
                    {/each}
                    <!-- 操作按钮列表 -->
                    <td class="flex gap-2 justify-center">
                        <slot name="operation" {row}></slot>

                        {#if allowModify}
                            <button class="btn btn-error" on:click|preventDefault={() => (currentRow = row) && deleteUI.showModal()}> 删除 </button>
                            <button class="btn btn-info" on:click|preventDefault={() => (currentRow = row) && updateUI.showModal()}> 编辑 </button>
                        {/if}
                    </td>
                </tr>
            {:else}
                <tr>
                    {#each Object.keys(columns) as key (key)}
                        <td><div class="skeleton h-4"></div></td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<slot name="dialog"></slot>

<!-- 外键屏幕 -->
<Dialog bind:ui={foreignKeyUI} title="外键详情: 表 {name}">
    <div slot="content">
        {#if currentRow && currentColumn && currentForeignKey && currentForeignColumns}
            <p class="py-4">选中的行:&nbsp;<strong>{columns[primaryKey].renderName}</strong>&nbsp;&equals;&nbsp;{currentRow?.[primaryKey]}</p>

            {#await NetUtils.query(currentForeignKey.tableName, { searchBy: parseColumnName(currentForeignKey.key), query: currentRow[currentColumn] })}
                <progress class="progress w-full"></progress>
                <p class="py-4 mx-auto font-serif font-semibold">少女祈祷中...</p>
            {:then json}
                <RowDetails row={preprocess(currentForeignColumns, json.data.data)[0]} columns={currentForeignColumns} showKey={allowModify} />
            {:catch error}
                <p>加载失败...</p>
            {/await}
        {/if}
    </div>

    <div slot="action" class="modal-action items-center">
        <form method="dialog" on:submit={deleteHandler}>
            <button class="btn btn-secondary">确认</button>
        </form>
    </div>
</Dialog>

{#if allowModify}
    <!-- 多项删除屏幕 -->
    <Dialog bind:ui={multipleDeleteUI} title="操作确认: 删除多项">
        <div slot="content">
            <p class="py-4">确认删除以下的行?</p>
            <strong>{columns[primaryKey].renderName}</strong>
            <ul>
                {#each selectedKeys as key (key)}
                    <li>
                        <details class="dropdown">
                            <summary class="m-1 hover:underline">{columns[primaryKey].render?.(key)}</summary>
                            <RowDetails row={rows.find((r) => r[primaryKey] === key)} {columns} showKey />
                        </details>
                    </li>
                {/each}
            </ul>
        </div>

        <div slot="action" class="modal-action items-center">
            <span class="text-error">该操作不可撤销</span>
            <form method="dialog" on:submit={multipleDeleteHandler}>
                <button class="btn btn-error">确认</button>
            </form>
        </div>
    </Dialog>

    <!-- 通用删除屏幕 -->
    <Dialog bind:ui={deleteUI} title="操作确认: 删除">
        <div slot="content">
            <p class="py-4">确认删除以下的行?</p>
            <RowDetails row={currentRow} {columns} showKey />
        </div>

        <div slot="action" class="modal-action items-center">
            <span class="text-error">该操作不可撤销</span>
            <form method="dialog" on:submit={deleteHandler}>
                <button class="btn btn-error">确认</button>
            </form>
        </div>
    </Dialog>

    <EditDialog bind:ui={updateUI} {columns} bind:row={currentRow} handler={updateHandler} title="操作确认: 编辑" />

    <EditDialog bind:ui={insertUI} {columns} bind:row={currentRow} handler={insertHandler} title="操作确认: 插入" />
{/if}
