<script lang="ts">
    type Props = {
        content?: string;
    };

    let {
        content = "★ Welcome ★ Links updated ★ New tools & textfiles ★ Keep the web small, keep it human ★",
    }: Props = $props();
</script>

<marquee behavior="scroll" direction="left" scrollamount="5">
    {content}
</marquee>
