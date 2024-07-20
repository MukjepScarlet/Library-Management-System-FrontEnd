<script lang="ts">
    import { link } from "svelte-spa-router";
    import { fade } from "svelte/transition";

    import { route, current } from "$/utils/utils";
    import { error, success } from "$/utils/alert";
    import NetUtils from "$/utils/net";
    import { login } from "$/utils/user";

    $route = ["个人"];
    $current = "注册";

    let studentIdNumber = "";
    $: studentIdNumber = studentIdNumber.trim();
    let password = "";
    let email = "";
    $: email = email.trim();

    let confirm = "";

    const registerHandler = () => {
        if (studentIdNumber.length === 0) {
            error("账号不能为空");
            return;
        }

        if (password.length === 0) {
            error("密码不能为空");
            return;
        }

        if (email.length === 0) {
            error("联系方式不能为空");
            return;
        }

        if (password !== confirm) {
            error("两次输入的密码不一致, 请重新输入");
            return;
        }

        NetUtils.register(studentIdNumber, password, email).then((json) => {
            success(`注册成功, 你的借书证号是: ${json.data.idNumber}, 请注意保存!`, 10000);
            login(json.data);
        });
    };
</script>

<div
    in:fade
    class="card shadow-xl bg-base-100 mx-auto max-w-lg mt-4 overflow-hidden"
    style="background-image: url('/assets/7275141.png'); background-repeat: no-repeat; background-position: center;"
>
    <form class="card-body flex-col gap-6 bg-base-100 bg-opacity-75" on:submit|preventDefault={registerHandler}>
        <h2 class="card-title">管理系统: 注册</h2>

        <label class="form-control">
            <div class="label">
                <span class="label-text">学工号</span>
                <span class="label-text-alt">注册后将为你分配借书证号</span>
            </div>
            <label class="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"
                    ><path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
                    /></svg
                >
                <input type="text" class="grow" bind:value={studentIdNumber} maxlength="20" />
            </label>
        </label>

        <label class="form-control">
            <div class="label">
                <span class="label-text">密码</span>
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

        <label class="form-control">
            <div class="label">
                <span class="label-text">确认密码</span>
            </div>
            <label class="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"
                    ><path
                        fill-rule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clip-rule="evenodd"
                    /></svg
                >
                <input type="password" class="grow" maxlength="40" bind:value={confirm} />
            </label>
        </label>

        <label class="form-control">
            <div class="label">
                <span class="label-text">联系方式</span>
            </div>
            <label class="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"
                    ><path
                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
                    /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg
                >
                <input type="text" class="grow" maxlength="40" bind:value={email} />
            </label>
        </label>

        <button class="btn btn-primary" type="submit">注册</button>

        <div class="text-center">
            已有账号? &gt;&gt; <a href="/login/" class="link link-secondary" use:link>登录</a>
        </div>
    </form>
</div>
