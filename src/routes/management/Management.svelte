<script lang="ts">
    import Table from "$/components/Table.svelte";

    import { TABLES, type TableName } from "$/utils/tables";

    import { route, current } from "$/utils/utils";

    export let params: { table: TableName };

    const { table } = params;

    $route = ["管理"];
    $current = TABLES[table].name;
</script>

<Table columns={TABLES[table].columns} allowModify name={table}></Table>
