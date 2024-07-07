<script lang="ts">
    import type { Column } from "$/utils/db";

    export const max = "9999-12-31";
    export { _class as class, _value as value };
    let _class = "";
    let _value: Date;

    export let column: Column<any>;

    let value: string;

    const input = (date: Date) => {
        value = date
            .toLocaleDateString()
            .split("/")
            .map((it) => it.padStart(2, "0"))
            .join("-");
    };

    const output = (date: string) => {
        _value = new Date(date);
    };

    $: input(_value);
    $: output(value);
</script>

<input type="date" bind:value={value} {max} class={_class} class:input-primary={column.isPrimary} class:input-secondary={column.foreignKey} readonly={column.isImmutable} />
