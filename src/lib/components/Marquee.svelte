<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    type Props = {
        content?: string;
    };

    let {
        content = `★ Welcome to ${PUBLIC_DOMAIN} ★ Links updated ★ Keep the web simple & small ★ will keep updating...`,
    }: Props = $props();
</script>

<marquee behavior="scroll" direction="left" scrollamount="5">
    {content}
</marquee>
