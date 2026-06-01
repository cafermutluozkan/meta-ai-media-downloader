# 🎬 Video Guide — Everything You Asked For

> **Commented "META" on the video?** Here is the complete source code, all prompts used, and step-by-step setup instructions.

---

## 🔗 1. Source Code

**GitHub Repository:**
```
https://github.com/cafermutluozkan/meta-ai-media-downloader
```

**Quick clone:**
```bash
git clone https://github.com/cafermutluozkan/meta-ai-media-downloader.git
```

---

## 🛠️ 2. Exact Prompts Used

Below are the exact prompts I gave to the AI (Cascade) to build this extension from scratch. You can copy these and try them yourself in any AI coding assistant.

---

### Prompt 1 — Analyze & Plan

> "meta 4 klasorunu incele orada chrome eklentisi var. bu eklentiyi gelistirecegiz ve github a yukliyecegiz"

**What it did:**
- Scanned the existing `meta-ai-downloader` extension
- Identified all files (`manifest.json`, `content.js`, `background.js`, `popup.html`, etc.)
- Summarized current features and limitations

---

### Prompt 2 — Feature Request (Side Panel + Images + Better UI)

> "bu eklentiye tiklayinca goruntude verdigim gibi sag tarafta kucuk bir pencere olarak gozuksun. normalde video yakaliyor ama artik gorsel de yakalayacak yani indirecek. videolarin ve gorsellerin uzerinde download butonunu biraz daha guzel yapabiliriz"

**What it did:**
- Replaced popup with Chrome **Side Panel** API (vidIQ-style right panel)
- Added **image (`<img>`)** detection alongside videos
- Upgraded the floating download button with:
  - Gradient glassmorphism design
  - Glow effects
  - Smooth hover animations

---

### Prompt 3 — GitHub Push & Documentation

> "ne gerekiyorsa olustur kullaniciya yardim et yuklemesi icin filan detaylari iceren dosyalari yaz. https://github.com/cafermutluozkan/meta-ai-media-downloader buraya pushla"

**What it did:**
- Created `README.md` with installation steps, features, tech stack
- Created `.gitignore` for clean repo
- Created `LICENSE` (MIT)
- Initialized Git, committed, and pushed to GitHub

---

## ⚡ 3. Quick Setup (2 Minutes)

### Step 1 — Download the Code
```bash
git clone https://github.com/cafermutluozkan/meta-ai-media-downloader.git
```

### Step 2 — Open Chrome Extensions
```
chrome://extensions/
```

### Step 3 — Enable Developer Mode
Toggle the switch at the **top-right**.

### Step 4 — Load the Extension
Click **"Load unpacked"** → Select the `meta-ai-media-downloader/meta-ai-downloader` folder.

### Step 5 — Start Using
1. Go to [https://meta.ai](https://meta.ai)
2. Generate a video or image
3. Click the extension icon → Side panel opens
4. Hover over any media → Click **"Indir"** button

---

## 📁 4. Project Structure

```
meta-ai-media-downloader/
  README.md
  VIDEO-GUIDE.md          <-- You are here
  LICENSE
  .gitignore
  meta-ai-downloader/
    manifest.json          # Extension config (Manifest V3)
    background.js          # Side panel manager + download handler
    content.js             # Page scanner (video + image detection)
    content.css            # Modern glassmorphism button styles
    sidepanel.html         # Side panel UI
    sidepanel.js           # Media list, filters, download logic
    icons/
      icon16.png
      icon48.png
      icon128.png
```

---

## 🖼️ 5. What It Looks Like

| Feature | Preview |
|---------|---------|
| Floating Download Button | *(Screenshot placeholder)* |
| Side Panel Media List | *(Screenshot placeholder)* |
| Filter by Video / Image | *(Screenshot placeholder)* |

> Upload your own screenshots to the GitHub repo and replace these placeholders.

---

## 🧠 6. Tech Stack

- **Chrome Extension Manifest V3**
- `chrome.sidePanel` API
- `chrome.downloads` API
- Vanilla JavaScript (no build step)
- CSS3 Glassmorphism

---

## 📝 7. Want to Modify It?

All prompts are above — just paste them into Cascade, Cursor, or ChatGPT with code interpreter. The extension is 100% vanilla JS, no bundler needed.

---

## ⚠️ Disclaimer

For personal use only. Respect Meta AI's Terms of Service.

---

**If this helped you, drop a star on the repo!** ⭐
