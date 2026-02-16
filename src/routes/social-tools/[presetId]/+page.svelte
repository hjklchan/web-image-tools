<script lang="ts">
    import { page } from "$app/state";
    import ImageCropper from "$lib/components/ImageCropper.svelte";
    import { presets } from "$lib/data/social-tools";

    const presetId = $derived(page.params.presetId);
    const preset = $derived(presets.find((p) => p.id === presetId));

    const sizeMatch = $derived(preset?.size.match(/(\d+)\s*[×x]\s*(\d+)/i));
    const outW = $derived(sizeMatch ? parseInt(sizeMatch[1], 10) : 1080);
    const outH = $derived(sizeMatch ? parseInt(sizeMatch[2], 10) : 1350);
    const aspectRatio = $derived(outW / outH);
</script>

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
