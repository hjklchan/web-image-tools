import { config } from "$lib/config";

export const prerender = true;

export const load = ({ url }) => ({
	meta: {
		title: "Image Splitter",
		description:
			"Split image into grid for social media. 1:1, 4:5, 3:4, 9:16. Export as ZIP.",
		canonical: `${config.siteUrl}${url.pathname}`,
	},
});
