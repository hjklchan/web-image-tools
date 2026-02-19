<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    type Props = {
        content?: string;
    };

    let {
        content = `★ Welcome to ${PUBLIC_DOMAIN} ★ Links updated ★ New tools & textfiles ★ Keep the web small, keep it human ★`,
    }: Props = $props();
</script>

<marquee behavior="scroll" direction="left" scrollamount="5">
    {content}
</marquee>
