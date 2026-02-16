declare module "watermarkjs" {
	const watermark: {
		(resources: (string | File | Blob)[], options?: object): {
			image: (draw: (target: HTMLCanvasElement, ...sources: HTMLCanvasElement[]) => HTMLCanvasElement) => Promise<HTMLImageElement>;
		};
		image: Record<string, (alpha: number) => (target: HTMLCanvasElement, watermark: HTMLCanvasElement) => HTMLCanvasElement>;
		text: Record<string, (text: string, font: string, fillStyle: string, alpha: number, y?: number) => (target: HTMLCanvasElement) => HTMLCanvasElement>;
	};
	export default watermark;
}
