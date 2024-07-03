<script lang="ts">
    import { slide } from "svelte/transition";

    let open = true;
    let isOpen = open;
    $: if (open) isOpen = true;
</script>

<details class="overflow-hidden" bind:open={isOpen}>
    <summary class="text-lg font-semibold gap-4" on:click|preventDefault={() => (open = !open)}>
        <slot name="summary" />
    </summary>

    {#if open}
        <ul transition:slide={{ duration: 200 }} on:outroend={() => (isOpen = false)}>
            <slot name="list" />
        </ul>
    {/if}
</details>
