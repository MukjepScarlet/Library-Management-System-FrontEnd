<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { route, current } from "$/utils/utils";

    import * as echarts from "echarts";
    import DBUtils, { TABLES, type Row } from "$/utils/db";
    import { fade } from "svelte/transition";
    import NetUtils from "$/utils/net";
    import { userInfo } from "$/utils/user";
    import { randomSaying } from "$/utils/utils";

    $route = [];
    $current = undefined;

    // notices
    let notices: Row<typeof TABLES.notice.columns>[] = [];

    let currentIndex = 0;
    $: if (currentIndex < 0) currentIndex += notices.length;
    else if (notices.length && currentIndex >= notices.length) currentIndex %= notices.length;

    $: notice = notices.length ? notices[currentIndex] : undefined;

    let carouselInterval: NodeJS.Timeout;
    let enableCarousel: boolean = true;

    // visualizations

    let books: Row<typeof TABLES.books.columns>[] = [];
    let container1: HTMLDivElement | undefined;

    let labels: Row<typeof TABLES.labels.columns>[] = [];
    let container2: HTMLDivElement | undefined;

    const count = 7;

    const stats = {
        bookCount: {
            name: "书籍种类",
            n: 0,
            render: true,
        },
        labelCount: {
            name: "标签个数",
            n: 0,
            render: true,
        },
        userCount: {
            name: "用户数量",
            n: 0,
            render: true,
        },
        borrowCount: {
            name: "你的借阅",
            n: 0,
            render: false,
        },
    };

    $: if ($userInfo)
        NetUtils.myBorrow($userInfo.userId, {
            count: 0,
        }).then((json) => {
            stats.borrowCount.n = json.data.count;
            stats.borrowCount.render = true;
        });

    onMount(() => {
        NetUtils.query("notice", {
            sortBy: "update_time",
            order: "desc",
            count: 100,
        }).then((json) => {
            notices = DBUtils.preprocess(TABLES.notice.columns, json.data.data) as typeof notices;
        });

        NetUtils.query("books", {
            sortBy: "date",
            order: "desc",
            count: count,
        }).then((json) => {
            stats.bookCount.n = json.data.count;

            books = DBUtils.preprocess(TABLES.books.columns, json.data.data) as typeof books;

            echarts.init(container1).setOption({
                title: {
                    text: "最新书籍",
                },
                tooltip: {},
                legend: {
                    data: ["库存量"],
                },
                xAxis: {
                    axisLabel: {
                        interval: 0,
                    },
                    data: books.map((it) => it.name),
                },
                yAxis: {},
                series: [
                    {
                        name: "库存量",
                        type: "bar",
                        data: books.map((it) => it.num),
                        itemStyle: {
                            color: "#91cc75",
                        },
                    },
                ],
            });
        });

        NetUtils.query("labels", {
            sortBy: "num",
            order: "desc",
            count: count,
        }).then((json) => {
            stats.labelCount.n = json.data.count;

            labels = DBUtils.preprocess(TABLES.labels.columns, json.data.data) as typeof labels;

            echarts.init(container2).setOption({
                title: {
                    text: "最热门标签",
                },
                tooltip: {},
                legend: {
                    data: ["书籍数"],
                },
                xAxis: {
                    axisLabel: {
                        interval: 0,
                    },
                    data: labels.map((it) => it.name),
                },
                yAxis: {},
                series: [
                    {
                        name: "书籍数",
                        type: "bar",
                        data: labels.map((it) => it.num),
                    },
                ],
            });
        });

        NetUtils.query("users", {
            count: 0,
        }).then((json) => {
            stats.userCount.n = json.data.count;
        });

        carouselInterval = setInterval(() => {
            enableCarousel && notices.length && currentIndex++;
        }, 5000);
    });

    onDestroy(() => {
        clearInterval(carouselInterval);
    });
</script>

<!-- 
    公告
    tags可视化
    借书可视化
 -->

<div class="grid grid-cols-2 gap-8 justify-center items-center min-h-[50vh] mt-4 mx-auto">
    {#if notices.length}
        <div class="card shadow-lg bg-base-100 col-span-2 min-w-[50%] overflow-hidden">
            <div class="card-body flex-col gap-6 bg-base-100 bg-opacity-75">
                <div class="card-title divider">
                    <button
                        class="tooltip"
                        data-tip="点击以{enableCarousel ? '关闭' : '开启'}公告轮播"
                        on:click|preventDefault={() => (enableCarousel = !enableCarousel)}>公告</button
                    >
                </div>

                {#if notice}
                    <strong in:fade>{notice.title}</strong>

                    <pre in:fade class="font-sans h-full">{notice.content}</pre>

                    <div class="flex justify-between">
                        <ul class="text-sm text-neutral">
                            <li>创建时间: {notice.createTime.toLocaleString()}</li>
                            <li>更新时间: {notice.updateTime.toLocaleString()}</li>
                        </ul>

                        <div class="flex gap-4 items-center">
                            <button class="btn btn-sm btn-circle" on:click|preventDefault={() => currentIndex--}>&lt;</button>
                            <span>
                                {currentIndex + 1} / {notices.length}
                            </span>
                            <button class="btn btn-sm btn-circle" on:click|preventDefault={() => currentIndex++}>&gt;</button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <div class="stats shadow-lg bg-base-100 col-span-2">
        {#each Object.entries(stats) as [key, { name, n, render }] (key)}
            {#if render}
                <div class="stat place-items-center">
                    <div class="stat-title">{name}</div>
                    <div class="stat-value">{n}</div>
                    <div class="stat-desc">{randomSaying()}</div>
                </div>
            {/if}
        {/each}
    </div>

    <div class="card justify-center items-center shadow-lg bg-base-100 h-[50vh]" bind:this={container1}></div>

    <div class="card justify-center items-center shadow-lg bg-base-100 h-[50vh]" bind:this={container2}></div>
</div>
