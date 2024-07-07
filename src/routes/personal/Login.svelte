<script>
    import { link } from "svelte-spa-router";
    import { fade } from "svelte/transition";

    import { route, current } from "$/utils/utils";
    import { error, success } from "$/utils/alert";
    import NetUtils from "$/utils/net";
    import { login } from "$/utils/user";

    $route = ["个人"];
    $current = "登录";

    let idNumber = "";
    let password = "";

    const loginHandler = () => {
        if (idNumber.length === 0) {
            error("账号不能为空");
            return;
        }

        if (password.length === 0) {
            error("密码不能为空");
            return;
        }

        NetUtils.login(idNumber, password).then(() => {
            success("欢迎回来!");
            login(idNumber);
        });
    };
</script>

<div
    in:fade
    class="card shadow-xl bg-base-100 mx-auto max-w-lg mt-4 overflow-hidden"
    style="background-image: url('/assets/7275141.png'); background-repeat: no-repeat; background-position: center;"
>
    <form class="card-body flex-col gap-6 bg-base-100 bg-opacity-75" on:submit|preventDefault={loginHandler}>
        <h2 class="card-title">管理系统: 登录</h2>

        <label class="form-control">
            <div class="label">
                <span class="label-text">借书证号</span>
            </div>
            <label class="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"
                    ><path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
                    /></svg
                >
                <input type="text" class="grow" bind:value={idNumber} maxlength="20" />
            </label>
        </label>

        <label class="form-control">
            <div class="label">
                <span class="label-text">密码</span>
                <!-- TODO: 忘记密码界面 -->
                <span class="label-text-alt tooltip tooltip-left" data-tip="请到图书馆服务中心线下恢复"
                    ><a href="/" class="link link-accent" inert>忘记密码?</a></span
                >
            </div>
            <label class="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"
                    ><path
                        fill-rule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clip-rule="evenodd"
                    /></svg
                >
                <input type="password" class="grow" bind:value={password} maxlength="40" />
            </label>
        </label>

        <button class="btn btn-secondary" type="submit">登录</button>

        <div class="text-center">
            还没注册? &gt;&gt; <a href="/register/" class="link link-primary" use:link>注册</a>
        </div>
    </form>
</div>
