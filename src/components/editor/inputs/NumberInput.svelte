<script lang="ts">
    import type { Column } from "$/utils/db";

    export { _class as class };
    let _class = "";

    export let column: Column<any>;

    export let value: number;
</script>

<input
    type="number"
    step={column.step}
    inputmode="numeric"
    class={_class}
    class:input-primary={column.isPrimary}
    class:input-secondary={column.foreignKey}
    readonly={column.isImmutable}
    bind:value
/>
