<script lang="ts">
    export const max = "9999-12-31";
    export { _class as class, _value as value };
    let _class = "";
    let _value: Date | any; // ...

    export let readonly = false;

    let dateValue: string;
    let timeValue: string;

    const inputHandler = (date: Date) => {
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        dateValue = year + "-" + month + "-" + day;
        let hour = ("0" + date.getHours()).slice(-2);
        let minute = ("0" + date.getMinutes()).slice(-2);
        timeValue = hour + ":" + minute;
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
    <input type="date" bind:value={dateValue} {max} class={_class} {readonly} />
    <input type="time" bind:value={timeValue} {max} class={_class} {readonly} />
</div>
