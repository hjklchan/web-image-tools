# Deploy to Hostinger

## Build

```bash
npm run build
```

Output is in `build/`.

## Deploy to public_html

1. Log in to Hostinger hPanel → File Manager
2. Open `public_html/`
3. Delete existing contents (or backup first)
4. Upload **all contents** of the local `build/` folder into `public_html/`

Expected structure in public_html:

```
public_html/
├── .htaccess      ← Required for refresh/404 fix
├── 200.html       ← SPA fallback
├── index.html
├── basic/
│   ├── index.html
│   ├── compressor.html
│   ├── watermark.html
│   └── ...
├── social/
│   ├── ig-story.html
│   └── ...
└── _app/
    └── ...
```

## Refresh 404 Fix

The `.htaccess` file (in `static/`, copied to `build/`) configures Apache to:

- Serve existing files directly
- Rewrite `/path` → `/path.html` when the file exists
- Fall back to `200.html` for client-side routes

This prevents Hostinger's 404 when refreshing on pages like `/basic/watermark`.

## Note

Hostinger must have `mod_rewrite` enabled (usually on by default).
