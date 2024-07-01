<script lang="ts">
    import Router from "svelte-spa-router";

    // 固定组件
    import Header from "./components/Header.svelte";
    import Sidebar from "./components/Sidebar.svelte";
    import Alerts from "./components/Alerts.svelte";

    // 路由
    import Index from "./routes/Index.svelte";
    import Login from "./routes/personal/Login.svelte";
    import Register from "./routes/personal/Register.svelte";
    import BooksGallery from "./routes/general/BooksGallery.svelte";
    import MyBorrow from "./routes/personal/MyBorrow.svelte";
    import General from "./routes/general/General.svelte";
    import Management from "./routes/management/Management.svelte";

    import { current, isSidebarOpening } from "./utils/utils";
    import { onMount } from "svelte";
    import { checkLogin } from "./utils/user";

    const routes = {
        "/": Index,
        "/login/": Login,
        "/register/": Register,
        "/books/": BooksGallery,

        "/myborrow/": MyBorrow,

        "/general/:table/": General,
        "/management/:table/": Management,
    };

    onMount(() => {
        checkLogin();
    });
</script>

<svelte:head>
    {#if $current}
        <title>图书管理系统 - {$current}</title>
    {:else}
        <title>图书管理系统</title>
    {/if}
</svelte:head>

<div class="bg-base-100 drawer lg:drawer-open">
    <input id="drawer" type="checkbox" class="drawer-toggle lg:disabled" bind:checked={$isSidebarOpening} />
    <div class="drawer-content">
        <Alerts />
        <Header />
        <div class="max-w-[100vw] px-6 pb-16 xl:pr-2">
            <Router {routes} />
        </div>
    </div>

    <Sidebar />
</div>
