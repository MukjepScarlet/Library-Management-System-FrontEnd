<script lang="ts">
    import EditDialog from "./base/EditDialog.svelte";

    import { preprocess } from "$/utils/db";
    import { getJSON, postJSON } from "$/utils/net";
    import { currentIdNumber, userInfo } from "$/utils/user";
    import { error } from "$/utils/alert";
    import { TABLES } from "$/utils/tables";

    const columns = TABLES.users.columns;

    $: if ($currentIdNumber) refresh();

    const refresh = () => {
        getJSON("/users/info/", {
            column: "id_number",
            key: $currentIdNumber,
            match: "eq",
            sort: "user_id",
            order: "DESC",
            start: "0",
            n: "1",
        }).then((data) => {
            if (data.code !== 200) {
                error("获取内容失败!");
                return;
            }

            $userInfo = preprocess(columns, data.data.data)[0];
            console.log($userInfo);
        });
    };

    const handler = () => {
        postJSON(`/users/update/`, $userInfo).then((data) => {
            if (data.code !== 200) {
                error("个人资料更新失败!");
                return;
            }

            ui.close();
        });
    };

    export let ui: HTMLDialogElement;
</script>

<EditDialog bind:ui {columns} bind:row={$userInfo} {handler} title="修改: 个人信息" />
