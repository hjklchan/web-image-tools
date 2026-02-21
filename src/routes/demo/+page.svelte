<script lang="ts">
    import ImageFiltersFX from "$lib/components/ImageFiltersFX.svelte";
    import {
        RetroPanel,
        RetroButton,
        RetroField,
        RetroInput,
        RetroSelect,
        RetroTextarea,
        RetroCheckbox,
        RetroNotice,
        RetroImagePreview,
    } from "$lib/components/ui";

    let name = "";
    let cat = "tools";
    let msg = "";
    let ok = true;

    const options = [
        { value: "tools", label: "Tools" },
        { value: "archives", label: "Archives" },
        { value: "zines", label: "Zines" },
    ];
</script>

<div class="grid gap-4 lg:grid-cols-[280px_1fr]">
    <aside class="space-y-4">
        <RetroPanel title="Site Menu" variant="paper">
            <nav class="text-sm space-y-2">
                <!-- <a class="block underline hover:no-underline" href="/demo"
                    >/demo</a
                >
                <a class="block underline hover:no-underline" href="/links"
                    >/links</a
                >
                <a class="block underline hover:no-underline" href="/about"
                    >/about.txt</a
                > -->
            </nav>
        </RetroPanel>

        <RetroPanel title="Buttons" variant="sky">
            <div class="flex flex-wrap gap-2">
                <RetroButton variant="primary">Primary</RetroButton>
                <RetroButton variant="secondary">Secondary</RetroButton>
                <RetroButton variant="ghost">Ghost</RetroButton>
            </div>
        </RetroPanel>
    </aside>

    <main class="space-y-4">
        <!-- <ImageFiltersFX /> -->

        <RetroNotice tone="warn" title="Notice: ">
            This is the full retro UI kit. No fancy transitions.
        </RetroNotice>

        <RetroPanel title="Form" subtitle="/submit-link" variant="paper">
            <div class="grid gap-3 md:grid-cols-2">
                <RetroField label="Your Name" hint="handle / nickname">
                    <RetroInput
                        name="name"
                        bind:value={name}
                        placeholder="e.g. anon99"
                    />
                </RetroField>

                <RetroField label="Category">
                    <RetroSelect name="category" bind:value={cat} {options} />
                </RetroField>
            </div>

            <div class="mt-3">
                <RetroField label="Message" hint="short & friendly">
                    <RetroTextarea
                        name="message"
                        bind:value={msg}
                        placeholder="say hi..."
                        rows={4}
                    />
                </RetroField>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-3">
                <RetroCheckbox
                    name="human"
                    bind:checked={ok}
                    label="I am human (probably)"
                />
                <RetroButton variant="primary" type="button">Send</RetroButton>
                <RetroButton variant="secondary" type="button"
                    >Reset</RetroButton
                >
            </div>
        </RetroPanel>

        <RetroPanel title="Image Preview" variant="sky">
            <RetroImagePreview
                src="https://picsum.photos/1200/700"
                alt="preview"
                caption="Click to open the 90s-style viewer."
            />
        </RetroPanel>
    </main>
</div>
