<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
    import { page } from "$app/state";
    import ImageCropper from "$lib/components/ImageCropper.svelte";
    import { config } from "$lib/config";
    import { presets, type Preset } from "$lib/data/social-tools";
    import type { Meta } from "./+page";

    type Props  = {
        preset: Preset;
        meta: Meta;
    }
    
    let { data } = $props();

    const presetId = $derived(page.params.presetId);
    
    const preset = $derived(presets.find((p) => p.id === presetId));
    

    const sizeMatch = $derived(preset?.size.match(/(\d+)\s*[×x]\s*(\d+)/i));
    const outW = $derived(sizeMatch ? parseInt(sizeMatch[1], 10) : 1080);
    const outH = $derived(sizeMatch ? parseInt(sizeMatch[2], 10) : 1350);
    const aspectRatio = $derived(outW / outH);
</script>

<svelte:head>
    <title>{data.preset?.platform} · {data.preset?.title}</title>
    <meta name="description" content="{data.meta.description}">
    <meta name="keywords" content="{data.preset?.platform} · {data.preset?.title}">
    <meta name="author" content="{config.siteName}">
    <meta name="robots" content="index, follow">
</svelte:head>

{#if preset}
    <div class="space-y-4">
        <a href="/social-tools" class="retro-link text-sm">← Back to social presets</a>

        <ImageCropper
            title="{preset.platform} · {preset.title}"
            subtitle="{preset.size}{preset.notes ? ' · ' + preset.notes : ''}"
            aspectOptions={[{ label: `${outW}×${outH}`, value: String(aspectRatio) }]}
            defaultAspectValue={String(aspectRatio)}
            outW={outW}
            outH={outH}
            previewHeight="55vh"
            previewMinHeight="320px"
            showDownload={true}
        />
    </div>
{:else if presetId}
    <div class="space-y-4">
        <a href="/social-tools" class="retro-link text-sm">← Back to social presets</a>
        <div class="retro-notice retro-notice--warn">
            <span class="font-bold">Preset not found:</span> {presetId}
        </div>
    </div>
{/if}
