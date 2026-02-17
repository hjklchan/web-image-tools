import { error } from "@sveltejs/kit";
import { presets } from "$lib/data/social-tools";
import { config } from "$lib/config";

export type Meta = {
    title: string;
    description: string;
    canonicalPath: string;
}

const SITE_TITLE = config.siteName;

export function entries() {
    return presets.map(p => ({ presetId: p.id }));
}

export function load({ params }) {
    const preset = presets.find(p => p.id === params.presetId);
    if (!preset) throw error(404, "Not found");

    const title = `${preset.platform} ${preset.title} (${preset.size}) — ${SITE_TITLE}`;
    const description =
        preset.notes?.slice(0, 155) ||
        `Make a ${preset.platform} ${preset.title} image at ${preset.size}. Browser-only.`;

    const meta: Meta = {
        title,
        description,
        canonicalPath: preset.href,
    };


    return { preset, meta };
}