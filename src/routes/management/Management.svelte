<script lang="ts">
    import Table from "$/components/Table.svelte";

    import { error } from "$/utils/alert";
    import { TABLES, type TableName } from "$/utils/db";
    import { userInfo } from "$/utils/user";
    import { route, current } from "$/utils/utils";
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";

    export let params: { table: TableName };

    $route = ["管理"];
    $: {
        $current = TABLES[params.table].name;
    }

    onMount(() => {
        if (!$userInfo || $userInfo.roleId < TABLES[params.table].managePermission) {
            error("权限不足!");
            push('/');
        }
    });
</script>

{#key params}
    <Table allowModify name={params.table}></Table>
{/key}
