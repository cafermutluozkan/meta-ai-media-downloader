# Meta AI Media Downloader

A Chrome extension to download videos and images from **Meta AI** without watermarks. Features a sleek side panel for easy browsing and bulk downloads.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Features

- **Video & Image Support** — Detects and downloads both videos and images generated on Meta AI
- **Watermark-Free** — Downloads original media files directly from CDN without Meta AI overlay watermarks
- **Side Panel UI** — vidIQ-style right-side panel for browsing all detected media on the current page
- **One-Click Download** — Hover over any media to reveal the download button instantly
- **Bulk Downloads** — Use the side panel to download multiple files without leaving the page
- **SPA Support** — MutationObserver watches for dynamically loaded content (infinite scroll, lazy loading)
- **Dark Theme** — Modern glassmorphism UI with smooth animations
- **Auto-detect CDN** — Works with `fbcdn.net`, `cdninstagram.com`, and `scontent` sources

---

## Screenshots

> Add your screenshots here after uploading to the repo

---

## Installation

### Method 1: Chrome Web Store *(Coming Soon)*

### Method 2: Manual Load (Developer Mode)

1. Download or clone this repository:
   ```bash
   git clone https://github.com/cafermutluozkan/meta-ai-media-downloader.git
   ```

2. Open **Google Chrome** and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (toggle at top-right)

4. Click **Load unpacked**

5. Select the `meta-ai-media-downloader` folder containing `manifest.json`

6. Done! Visit [meta.ai](https://meta.ai) to start downloading

---

## How to Use

1. Go to [https://meta.ai](https://meta.ai) and generate a video or image
2. Click the **Meta AI Media Downloader** icon in your Chrome toolbar to open the side panel
3. The side panel will automatically scan and list all detected media
4. Click the **download icon** on any item in the side panel, or hover over the media on the page and click the floating **Indir** button

---

## File Structure

```
meta-ai-media-downloader/
  manifest.json       # Extension manifest (V3)
  background.js       # Service worker: sidePanel manager + download handler
  content.js          # Page scanner: detects <video> and <img> elements
  content.css         # Injected button styles (glassmorphism)
  sidepanel.html      # Side panel UI
  sidepanel.js        # Side panel logic: media list, filters, downloads
  icons/              # Extension icons (16x16, 48x48, 128x128)
```

---

## Tech Stack

- **Chrome Extension Manifest V3**
- `chrome.sidePanel` API
- `chrome.downloads` API
- Vanilla JavaScript (no build step required)
- CSS3 (glassmorphism, gradients, animations)

---

## Permissions

| Permission | Purpose |
|-----------|---------|
| `downloads` | Download media files to your computer |
| `sidePanel` | Open the side panel on the right |
| `activeTab` | Communicate with the current tab |
| `host_permissions` | Access `meta.ai`, `fbcdn.net`, `cdninstagram.com` |

---

## Roadmap

- [x] Video detection & download
- [x] Image detection & download
- [x] Side panel with media list
- [ ] Download all button (bulk)
- [ ] Settings page (custom filename format)
- [ ] Chrome Web Store publish

---

## Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/xyz`
3. Commit changes: `git commit -m 'Add xyz'`
4. Push to branch: `git push origin feature/xyz`
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Disclaimer

This extension is for personal use only. Respect Meta AI's Terms of Service and copyright policies. The authors are not responsible for any misuse of this tool.
