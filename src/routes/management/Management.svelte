<script lang="ts">
    import Table from "$/components/Table.svelte";

    import { TABLES, type TableName } from "$/utils/tables";

    import { route, current } from "$/utils/utils";

    export let params: { table: TableName };

    $route = ["管理"];
    $: {
        $current = TABLES[params.table].name;
    }
</script>

{#key params}
    <Table allowModify name={params.table}></Table>
{/key}
