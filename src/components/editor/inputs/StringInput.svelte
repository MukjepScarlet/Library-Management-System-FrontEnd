<script lang="ts">
    import type { Column } from "$/utils/db";

    export { _class as class };
    let _class = "";

    export let column: Column<any>;

    export let value: string;
</script>

<input type="text" bind:value class={_class} class:input-primary={column.isPrimary} class:input-secondary={column.foreignKey} maxlength={column.maxLength} readonly={column.isImmutable} />
