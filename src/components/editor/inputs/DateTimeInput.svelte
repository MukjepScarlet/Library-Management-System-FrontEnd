<script lang="ts">
    import type { Column } from "$/utils/db";

    export const max = "9999-12-31";
    export { _class as class, _value as value };
    let _class = "";
    let _value: Date;

    export let column: Column<any>;

    let dateValue: string;
    let timeValue: string;

    const inputHandler = (date: Date) => {
        dateValue = date
            .toLocaleDateString()
            .split("/")
            .map((it) => it.padStart(2, "0"))
            .join("-");
        timeValue = date
            .toLocaleTimeString()
            .split(":")
            .map((it) => it.padStart(2, "0"))
            .join(":");
    };

    const outputHandler = (date: string, time: string) => {
        _value = new Date(date);
        let [hour, minute] = time.split(":").map((i) => ~~i);
        _value.setHours(hour, minute);
    };

    $: inputHandler(_value);
    $: outputHandler(dateValue, timeValue);
</script>

<div class="inline-flex gap-2">
    <input type="date" bind:value={dateValue} {max} class={_class} class:input-primary={column.isPrimary} class:input-secondary={column.foreignKey} readonly={column.isImmutable} />
    <input type="time" bind:value={timeValue} {max} class={_class} class:input-primary={column.isPrimary} class:input-secondary={column.foreignKey} readonly={column.isImmutable} />
</div>
