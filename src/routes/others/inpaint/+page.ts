import { config } from "$lib/config";

export const prerender = true;

export const load = ({ url }) => ({
	meta: {
		title: "Image Inpaint - Lightweight AI to Remove & Fill Objects | imazing",
		description:
			"AI-powered inpainting in the browser. Brush to mark areas, model fills in locally. No upload.",
		canonical: `${config.siteUrl}${url.pathname}`,
	},
});
