<script lang="ts">
    import { clamp } from "$/utils/utils";
    import { fly } from "svelte/transition";

    export let x: number = 0;
    export let y: number = 0;
    export let visible: boolean = false;

    let ui: HTMLDivElement | undefined = undefined;

    $: rect = ui?.getBoundingClientRect();
    $: if (rect) {
        x = clamp(x, 0, window.innerWidth - rect.width);
        y = clamp(y, 0, window.innerHeight - rect.height);
    }
</script>

<svelte:window on:click={() => (visible = false)} />

{#key visible}
    <div
        bind:this={ui}
        class="fixed bg-base-100 card shadow-md z-10"
        style="left: {x}px; top: {y}px; transition: left 0.1s ease, top 0.1s ease;"
        transition:fly
        class:hidden={!visible}
    >
        <slot />
    </div>
{/key}
