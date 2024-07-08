<script lang="ts">
    import type { NumberColumn } from "$/utils/db";

    export { _class as class };
    let _class = "";

    export let column: NumberColumn<any>;

    export let value: number;
</script>

<input
    type="number"
    step={0.1 ** column.scale}
    max={10 ** column.precision - 0.1 ** column.scale}
    inputmode="numeric"
    class={_class}
    class:input-primary={column.isPrimary}
    class:input-secondary={column.foreignKey}
    readonly={column.isImmutable}
    bind:value
/>
