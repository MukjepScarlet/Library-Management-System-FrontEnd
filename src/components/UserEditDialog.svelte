<script lang="ts">
    import EditDialog from "./base/EditDialog.svelte";

    import { TABLES } from "$/utils/db";
    import NetUtils from "$/utils/net";
    import { userInfo } from "$/utils/user";
    import { success } from "$/utils/alert";

    const columns = TABLES.users.columns;

    const handler = () => {
        NetUtils.modify("users", $userInfo!).then(() => {
            success("修改成功!");
            ui.close();
        });
    };

    export let ui: HTMLDialogElement;
</script>

<EditDialog bind:ui {columns} bind:row={$userInfo} {handler} title="修改: 个人信息" />
