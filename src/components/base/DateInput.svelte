<script lang="ts">
    export const max = "9999-12-31";
    export { _class as class, _value as value };
    let _class = "";
    let _value: Date | any; // ...

    export let readonly = false;

    let value: string;

    const input = (date: Date) => {
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        value = year + "-" + month + "-" + day;
    };

    const output = (date: string) => {
        _value = new Date(date);
    };

    $: input(_value);
    $: output(value);
</script>

<input type="date" bind:value={value} {max} class="{_class}" {readonly}/>
