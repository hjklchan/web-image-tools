<section class="hero-center">
    <div class="hero-inner">
      <!-- <div class="hero-kicker">imazing.com · local-first image tools</div> -->
  
      <!-- Typewriter line -->
      <div class="hero-typewrap" aria-label="IMAZING">
        <span class="hero-type">IMAZING</span>
        <span class="hero-caret" aria-hidden="true">█</span>
      </div>
  
      <!-- <div class="hero-sub">
        Crop · Resize · Compress · Convert — and Social presets.
      </div> -->
  
      <div class="hero-actions">
        <a class="retro-btn retro-btn--primary retro-btn--md" href="/basic">Start</a>
        <a class="retro-btn retro-btn--secondary retro-btn--md" href="/social">Social presets</a>
      </div>
    </div>
  </section>
  
  <style>
    /* Center in viewport (but still within page content flow) */
    .hero-center {
      min-height: calc(100vh - 180px); /* 预留你 header/footer 的空间，可按你的 layout 调整 */
      display: grid;
      place-items: center;
      padding: 1.25rem;
    }
  
    .hero-inner {
      width: min(980px, 92vw);
      text-align: center;
    }
  
    .hero-kicker {
      font-size: 12px;
      opacity: 0.75;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
  
    .hero-typewrap {
      margin-top: 0.75rem;
      display: inline-flex;
      align-items: baseline;
      gap: 0.2em;
  
      /* keep whole word visible */
      max-width: 100%;
      overflow: visible;
    }
  
    .hero-type {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
        "Courier New", monospace;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: clamp(48px, 7vw, 96px);
      line-height: 1;
  
      /* typewriter reveal via mask (more robust than width:0) */
      display: inline-block;
      -webkit-mask-image: linear-gradient(#000 0 0);
      -webkit-mask-size: 0% 100%;
      -webkit-mask-repeat: no-repeat;
  
      mask-image: linear-gradient(#000 0 0);
      mask-size: 0% 100%;
      mask-repeat: no-repeat;
  
      animation: reveal 1.6s steps(7, end) forwards;
      white-space: nowrap;
    }
  
    /* caret */
    .hero-caret {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
        "Courier New", monospace;
      font-size: clamp(40px, 6vw, 84px);
      line-height: 1;
      opacity: 0.85;
      animation: blink 0.9s step-end infinite;
      user-select: none;
    }
  
    .hero-sub {
      margin-top: 0.75rem;
      font-size: clamp(14px, 1.6vw, 18px);
      opacity: 0.85;
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
  
    @keyframes blink {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.9; }
    }
  
    @media (prefers-reduced-motion: reduce) {
      .hero-type {
        animation: none;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
      }
      .hero-caret { animation: none; opacity: 0.7; }
    }
  </style>
  