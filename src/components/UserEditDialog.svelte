<script lang="ts">
    import EditDialog from "./base/EditDialog.svelte";

    import DBUtils, { TABLES } from "$/utils/db";
    import NetUtils from "$/utils/net";
    import { currentIdNumber, userInfo } from "$/utils/user";
    import { success } from "$/utils/alert";

    const columns = TABLES.users.columns;

    $: if ($currentIdNumber) refresh();

    const refresh = () => {
        NetUtils.query("users", {
            searchBy: "id_number",
            query: $currentIdNumber!,
        }).then((json) => {
            $userInfo = DBUtils.preprocess(columns, json.data.data)[0] as typeof $userInfo;
        });
    };

    const handler = () => {
        NetUtils.modify("users", $userInfo!).then(() => {
            success("修改成功!");
            ui.close();
        });
    };

    export let ui: HTMLDialogElement;
</script>

<EditDialog bind:ui {columns} bind:row={$userInfo} {handler} title="修改: 个人信息" />
