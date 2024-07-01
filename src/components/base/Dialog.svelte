<script lang="ts">
    export let title: string | undefined;

    export let ui: HTMLDialogElement;

    export let style: string | undefined = undefined;
</script>

<dialog class="modal modal-bottom sm:modal-middle" bind:this={ui}>
    <div class="modal-box min-w-fit" {style}>
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        {#if title}
            <h3 class="font-bold text-lg">{title}</h3>
        {/if}

        <slot name="content"></slot>

        <slot name="action"></slot>
    </div>
</dialog>
