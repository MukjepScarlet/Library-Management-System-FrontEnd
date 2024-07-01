<script lang="ts">
    import { link } from "svelte-spa-router";

    import { route, current, isSidebarOpening } from "$/utils/utils";
    import { currentIdNumber, logout } from "$/utils/user";

    import UserEditDialog from "./UserEditDialog.svelte";

    let ui: HTMLDialogElement;
</script>

<nav class="navbar justify-between md:px-8 bg-base-100 bg-opacity-25 shadow-md z-[1] sticky top-0 backdrop-blur-sm">
    <div class="flex justify-start gap-4">
        <div class="lg:hidden tooltip tooltip-bottom" data-tip="展开导航">
            <label class="btn btn-circle swap swap-rotate lg:disabled">
                <input type="checkbox" bind:checked={$isSidebarOpening} />
                <svg class="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"
                    ><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg
                >
                <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"
                    ><polygon
                        points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
                    /></svg
                >
            </label>
        </div>
        <div class="text-sm breadcrumbs">
            <ul>
                <li><a href="/" use:link>首页</a></li>
                {#each $route as it (it)}
                    <li>{it}</li>
                {/each}
                {#if $current}
                    <li class="font-semibold">{$current}</li>
                {/if}
            </ul>
        </div>
    </div>

    <!-- 用户 -->
    <div class="flex justify-end gap-4">
        {#if $currentIdNumber}
            <!-- 登录 -->
            <button class="btn btn-primary" on:click={() => ui.showModal()}>个人信息</button>
            <button class="btn btn-error" on:click={logout}>退出登录</button>
        {:else}
            <!-- 未登录 -->
            <a class="btn btn-outline" href="/register/" use:link>注册</a>
            <a class="btn btn-ghost" href="/login/" use:link>登录</a>
        {/if}
    </div>
</nav>

<!-- 登录 -->
<UserEditDialog bind:ui />
