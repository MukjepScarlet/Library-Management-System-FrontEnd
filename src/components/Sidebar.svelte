<script lang="ts">
    import { TABLES } from "$/utils/db";
    import { userInfo } from "$/utils/user";
    import { link } from "svelte-spa-router";
    import { slide } from "svelte/transition";
    import SidebarMenu from "./base/SidebarMenu.svelte";
</script>

<div class="drawer-side z-40">
    <label for="drawer" class="drawer-overlay" aria-label="Close menu"></label>

    <aside class="min-h-screen w-60 xl:w-70 2xl:w-80 overflow-hidden">
        <div class="flex flex-col w-full min-h-screen bg-neutral bg-opacity-75 text-base-300">
            <!-- 顶部 -->
            <nav class="navbar justify-center bg-neutral">
                <a href="/" class="btn btn-ghost" use:link>
                    <!-- <img width="36" height="36" src="/assets/7275141.png" alt=""> -->
                    <img
                        alt=""
                        width="36"
                        height="36"
                        src="data:image/png;base64,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"
                    />
                    <span class="font-semibold inline-flex text-lg md:text-2xl px-4">图书管理系统</span>
                </a>
            </nav>
            <!-- 菜单 -->
            <ul class="menu px-4 py-4">
                <!-- 游客 -->
                <li transition:slide>
                    <SidebarMenu>
                        <svelte:fragment slot="summary">
                            <img
                                width="32"
                                height="32"
                                alt=""
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABz0lEQVR4nO2bv0sDMRSAb/K/6OzfVi6ii2BxKIKg0ouCg4sh11S4YKk6ig7d1MWHjp2kg64W7eYSOfqDDpd6iLmL996Dtx1c30fyvZejCQIKCgqKnBHVZS1issfD+JOz2HiUbxGL95vN7krgsvjDtXjsQbHWTCG4A8BkL31Je1uZ+9PEgNLW/Bq9FJrD56f5SnAGgE+X/d20eLGl5uRFQ5UKIM3Zb3EHgE1eMCsyLToLQApGty6rDwAsOXuOAIxoBZhKbwFhkSCaLSBsEmwglyBgaYNAAHQmBDRzgCAJKtxdAGgS1DQKA+azgPiFBJODC+vHjMXOkfXcT53Fm0mQLwGQFpEHQNZz3gEAcoDG7QD4AwB5nVDZSVDndIKfABo0CRpygCIJGrRdQNBxWNFxGMgBGq8DAPsoLEiCiiQImLcAYHcAYAcgSIKKJAiYtwB45ICFv8m5B5DsdMzxRtv6KavsdA6Ae5gnm53iAJztJmb4cGNGg75XWRiAoYfFFwrg9fEWN4DzlvYOwqB/jVuCnLpAh7oApy4QO3ZAOLkwgbcLhPLqH3QBd1dmjtbFKmfyvWzLL81Q7gUuI6rLGmdxNwrlR+nFFn1tjoKCIqhifAMkRlipt08cVgAAAABJRU5ErkJggg=="
                            />
                            <span>通用</span>
                        </svelte:fragment>

                        <svelte:fragment slot="list">
                            {#each Object.entries(TABLES).filter(([_, table]) => table.searchable) as [key, { name }] (key)}
                                <li>
                                    <a href="/general/{key}/" class="btn btn-ghost" use:link>{name}一览</a>
                                </li>
                            {/each}
                            <li>
                                <a href="/books/" class="btn btn-ghost" use:link>书籍查询/借阅</a>
                            </li>
                        </svelte:fragment>
                    </SidebarMenu>
                </li>

                {#if $userInfo}
                    <!-- 用户 -->
                    <li transition:slide>
                        <SidebarMenu>
                            <svelte:fragment slot="summary">
                                <img
                                    width="32"
                                    height="32"
                                    alt=""
                                    src="data:image/png;base64,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"
                                />
                                <span>个人</span>
                            </svelte:fragment>

                            <svelte:fragment slot="list">
                                <li>
                                    <a href="/myborrow/" class="btn btn-ghost" use:link>我的借阅</a>
                                </li>
                            </svelte:fragment>
                        </SidebarMenu>
                    </li>

                    <!-- 管理 -->
                    {#if $userInfo.roleId >= 2}
                        <li transition:slide>
                            <SidebarMenu>
                                <svelte:fragment slot="summary">
                                    <img
                                        width="32"
                                        height="32"
                                        alt=""
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADFElEQVR4nO1ZTU8TQRiu8WbixYNXT95MPHr3ot68+BeMdoZGYkqEGL8gKtkdJGigW9qdFUI1lI8i9TNGug0xUUCRRDTEJnyEohgDmBCMIK+ZlfYgEHbbhQH2fZInaWez03memXf6vjM+HwKBQCAQtqBSvUIl/AejHLYpZ1XCK32bAcUfPcYI/8NKpItcnytjU6h+3HUDGOHtovOn8T4Y/7awLfmya9AyQCX6c1fFK/7IIZXqS3cC92EkMyNd6HrMjM1BbWnzsrUKApEjrhnAKFdEp23hHukiN2LC6M2FRL0r4rWz2j5GjRnR6eD7SekCN+LH4WlrL1Apn2eljQeKNkD1R88L8UZ1t3RxdtnMnlhhwCi/WJR48MEeVsI/i85e94xIF2aXb3ozuTAYbT3Turfw2Sf6CdFRfcVDGMvOSxdmm18XoOFy/Lf1j0D56YINqCnhz0QnLzreyRflkK+6P6ysAr2nIPHVAf0wo3y59kITfBmdky7IKTMTP6G2tMlaBYxGjzo2gFH9nni5M5qWLqZQdhm9SyuJUcTZ7Acj+2sCxrx4eWhoSrqQQjn8aVqEwbJK+C/lXNNB2waoRA9Lz+vdJjG4/eVP+KL0AbvPRfsG0H8vmf1ZSA9M7Wz2T+VNcGxAWvbgXWLRBphvJ6EllIK6YMxiTEtBqi/rHQNaQqlVMRULm64MLlyVgHBV16a2FW1AXTBmfb/0OA7lyTbr892yB67Ozla0FW1AebINypNx7xkQC5trhEDaFQO0G52gVSY2ta1oA1J9WWvjE7MuGNNMb22C6R1ONIA6XQGEf98GqWuejTcf5WczdK1j1XPtemf+efR2cs0+FMKnPW0Ac2QAxT0AcBOkWAtALq6wFghiLQBYC1CsBQBrgQH5eT3WAgNbUQyRjVPh0NV268RV/IBIVf9/3nClPX+qHLnVLT2ddr0WCO0wA7AWoHggAgVXgybeC6RWxRTeC5R56Fi8Du8FzDVCAO8FYPdmghSPxMDbZ4KET0hPXV2mSvQx2wYo1Di1y0wYZ35+0rYBCAQCgUD4PIG/J4m1qtYqriQAAAAASUVORK5CYII="
                                    />
                                    <span>管理</span>
                                </svelte:fragment>

                                <svelte:fragment slot="list">
                                    {#each Object.entries(TABLES) as [key, { name, managePermission }] (key)}
                                        {#if $userInfo.roleId >= managePermission}
                                            <li>
                                                <a href="/management/{key}/" class="btn btn-ghost" use:link>{name}管理</a>
                                            </li>
                                        {/if}
                                    {/each}
                                </svelte:fragment>
                            </SidebarMenu>
                        </li>
                    {/if}
                {/if}
            </ul>
            <!-- 底边 -->
            <ul class="menu px-4 py-4 mt-auto">
                <li>
                    <a href="https://github.com/MukjepScarlet">
                        <svg class="h-5 w-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                            ><path
                                d="M29.3444 30.4765C31.7481 29.977 33.9292 29.1108 35.6247 27.8391C38.5202 25.6676 40 22.3136 40 18.9999C40 16.6752 39.1187 14.505 37.5929 12.6668C36.7427 11.6425 39.2295 3.99989 37.02 5.02919C34.8105 6.05848 31.5708 8.33679 29.8726 7.83398C28.0545 7.29565 26.0733 6.99989 24 6.99989C22.1992 6.99989 20.4679 7.22301 18.8526 7.6344C16.5046 8.23237 14.2591 5.99989 12 5.02919C9.74086 4.05848 10.9736 11.9632 10.3026 12.7944C8.84119 14.6051 8 16.7288 8 18.9999C8 22.3136 9.79086 25.6676 12.6863 27.8391C14.6151 29.2857 17.034 30.2076 19.7401 30.6619"
                                stroke="currentColor"
                                stroke-width="5"
                                stroke-linecap="butt"
                            ></path><path
                                d="M19.7397 30.6619C18.5812 31.937 18.002 33.1478 18.002 34.2944C18.002 35.441 18.002 38.3464 18.002 43.0106"
                                stroke="currentColor"
                                stroke-width="5"
                                stroke-linecap="butt"
                            ></path><path
                                d="M29.3446 30.4766C30.4423 31.9174 30.9912 33.211 30.9912 34.3576C30.9912 35.5042 30.9912 38.3885 30.9912 43.0107"
                                stroke="currentColor"
                                stroke-width="5"
                                stroke-linecap="butt"
                            ></path><path
                                d="M6 31.2155C6.89887 31.3254 7.56554 31.7387 8 32.4554C8.65169 33.5303 11.0742 37.518 13.8251 37.518C15.6591 37.518 17.0515 37.518 18.0024 37.518"
                                stroke="currentColor"
                                stroke-width="5"
                                stroke-linecap="butt"
                            ></path></svg
                        >
                        <span>GitHub</span>
                    </a>
                </li>

                <li>
                    <a href="https://space.bilibili.com/38109680">
                        <svg class="h-5 w-5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                            ><path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z"
                                fill="currentColor"
                            ></path></svg
                        >
                        <span>Bilibili</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
</div>

<style>
    aside::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-image: url("/assets/120124286_p0.jpg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        filter: blur(2px);
    }
</style>
