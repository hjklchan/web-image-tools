<script lang="ts">
    // import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
    import { modelExists, downloadModel } from "$lib/inpaint/adapters/cache";
    import superResolution from "$lib/inpaint/adapters/superResolution";
    import Button from "$lib/components/ui/RetroButton.svelte";
    // import FileSelect from "$lib/components/Select.svelte";
    // import Modal from "$lib/components/Modal.svelte";
    // import Editor from "$lib/Editor.svelte";
    // import Progress from "$lib/components/Progress.svelte";
    import { resizeImageFile, loadImage } from "$lib/utils";

    let file = $state<File | undefined>(undefined);
    // let showAbout = $state(false);
    let downloadProgress = $state(0);

    let modalEl = $state<HTMLElement | null>(null);

    let files: File[] = [];
    let imgSrc = $state("");
    let compressing = false;
    let progress = 0;
    let error = "";
    let downloaded = $state(true);
    let isProcessingLoading = $state(false);
    let generateProgress = $state(0);
    let renders = $state<HTMLImageElement[]>([]);

    $effect(() => {
        downloadModel("superResolution", (p: number) => {
            downloadProgress = p;
        });
    });

    // Click-away for About modal
    $effect(() => {
        const onPointerDown = (e: PointerEvent) => {
            const el = modalEl;
            if (!el) return;
            const target = e.target as Node | null;
        };

        document.addEventListener("pointerdown", onPointerDown, true);
        return () =>
            document.removeEventListener("pointerdown", onPointerDown, true);
    });

    async function startWithDemoImage(img: string) {
        const res = await fetch(`/examples/${img}.jpeg`);
        const blob = await res.blob();
        file = new File([blob], `${img}.jpeg`, { type: "image/jpeg" });
    }

    async function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const selected = Array.from(input.files ?? []);
        if (selected.length === 0) return;

        const valid = selected.filter((f) =>
            ["image/jpeg", "image/png", "image/webp", "image/bmp"].includes(
                f.type,
            ),
        );
        if (valid.length !== selected.length) {
            error = "Only JPG / PNG / WebP / BMP supported";
            return;
        }

        files = valid;
        error = "";
        imgSrc = URL.createObjectURL(valid[0]);
        // results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
        // results = [];
        // await compressAll();
        input.value = "";
    }

    async function onSelectFile(f: File) {
        const { file: resizedFile } = await resizeImageFile(f, 1024 * 4);
        file = resizedFile;
    }

    function onImageLoad() {
        // if (!imgEl) return;
        // if (cropper) cropper.destroy();
        // cropper = new Cropper(imgEl, {
        //     aspectRatio: parseAspect(aspectValue),
        //     viewMode: 1,
        //     dragMode: "move",
        //     autoCrop: true,
        //     responsive: true,
        //     restore: false,
        // });
        console.log("image loaded");
    }

    const onSuperResolution = async () => {
        if (!(await modelExists("superResolution"))) {
            downloaded = false;
            await downloadModel("superResolution", (p) => {
                downloadProgress = p;
            });
            downloaded = true;
        }

        isProcessingLoading = true;

        try {
            // 运行
            const start = Date.now();
            console.log("superResolution_start");
            // each time based on the last result, the first is the original
            const newFile = renders.at(-1) ?? file;
            const res = await superResolution(
                newFile as File | HTMLImageElement,
                (p) => {
                    generateProgress = p;
                },
            );
            if (!res) {
                throw new Error("empty response");
            }
            // TODO: fix the render if it failed loading
            const newRender = new Image();
            newRender.dataset.id = Date.now().toString();
            await loadImage(newRender, res);
            renders.push(newRender);
            // lines.push({ pts: [], src: "" } as Line);
            renders = [...renders];
            // setLines([...lines]);
            console.log("superResolution_processed", {
                duration: Date.now() - start,
            });

            // 替换当前图片
        } catch (error) {
            console.error("superResolution", error);
        } finally {
            isProcessingLoading = false;
        }
    };

    function reset() {
        file = undefined;
    }
</script>

<h1 class="font-black tracking-wide">Super Resolution for any images (Development Status: Alpha)</h1>
{#if downloadProgress !== 100}
    <div class="space-y-1">
        <p class="text-sm">
            Need to download a 30MB model file, please wait patiently... {downloadProgress.toFixed(
                2,
            )}%
        </p>
        <progress value={downloadProgress} max="100"></progress>
    </div>
{/if}
{#if file}{:else}
    <div>
        <label for="compress-file" class="retro-field__label">
            Select images
        </label>
        <input
            id="compress-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/bmp"
            multiple
            class="retro-control mt-1"
            onchange={onFileChange}
        />
        <div class="retro-field__hint mt-1">
            JPG, PNG, WebP, BMP supported. Multiple files allowed.
        </div>
    </div>
    {#if imgSrc}
        <div
            class="border border-retro-paper-border overflow-hidden"
            style="height: 400px;"
        >
            <img
                src={imgSrc}
                alt="Super Resolution"
                class="block max-w-full"
                style="max-height: 400px;"
                onload={onImageLoad}
            />
        </div>
        <div class="flex flex-wrap items-end gap-2">
            <button
                type="button"
                class="retro-btn retro-btn--primary retro-btn--md"
                onclick={() => onSuperResolution()}
            >
                Super Resolution
            </button>
        </div>
    {/if}
{/if}
