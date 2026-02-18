<section class="hero-center">
  <div class="hero-inner">
    <div class="hero-typewrap" aria-label="IMAZING">
      <span class="hero-type text-retro-navy">IMAZING</span>
    </div>

    <div class="hero-actions">
      <a class="retro-btn retro-btn--primary retro-btn--md" href="/basic">Start</a>
      <a class="retro-btn retro-btn--secondary retro-btn--md" href="/social">Social presets</a>
    </div>
  </div>
</section>

<style>
  .hero-center {
    min-height: calc(100vh - 200px);
    display: grid;
    place-items: center;
    padding: 1.25rem;
  }

  .hero-inner {
    width: min(980px, 92vw);
    text-align: center;
  }

  .hero-typewrap {
    margin-top: 0.75rem;
    display: inline-block;
    max-width: 100%;
  }

  .hero-type {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: clamp(48px, 7vw, 96px);
    line-height: 1;
    white-space: nowrap;

    /* typewriter reveal via mask */
    display: inline-block;
    -webkit-mask-image: linear-gradient(#000 0 0);
    -webkit-mask-size: 0% 100%;
    -webkit-mask-repeat: no-repeat;
    mask-image: linear-gradient(#000 0 0);
    mask-size: 0% 100%;
    mask-repeat: no-repeat;
    animation: reveal 1.6s steps(7, end) forwards;

    position: relative;
    --caret-overlap: 0.66em; /* 调这个让光标盖在 G 上 */
  }

  /* solid block cursor (no transparency) */
  .hero-type::after {
    content: "█";
    position: absolute;
    left: 100%;
    top: 0;
    line-height: 1;

    transform: translateX(calc(-1 * var(--caret-overlap)));

    /* no opacity here */
    visibility: visible;
    animation: blink-vis 0.9s step-end infinite;

    user-select: none;
    pointer-events: none;
  }

  .hero-actions {
    margin-top: 1.25rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  @keyframes reveal {
    from { -webkit-mask-size: 0% 100%; mask-size: 0% 100%; }
    to   { -webkit-mask-size: 100% 100%; mask-size: 100% 100%; }
  }

  /* blink by visibility (keeps solid when visible) */
  @keyframes blink-vis {
    0%, 49% { visibility: visible; }
    50%, 100% { visibility: hidden; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-type {
      animation: none;
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
    }
    .hero-type::after {
      animation: none;
      visibility: visible;
    }
  }
</style>
