<script lang="ts">
    import { fly } from "svelte/transition";

    export let x: number = 0;
    export let y: number = 0;
    export let visible: boolean = false;

    let ui: HTMLDivElement;

    const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

    $: if (ui) {
        const rect = ui.getBoundingClientRect();
        x = clamp(x, 0, window.innerWidth - rect.width);
        y = clamp(y, 0, window.innerHeight - rect.height);
        // console.log(x, y);
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
