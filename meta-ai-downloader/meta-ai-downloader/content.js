// Meta AI Media Downloader - Content Script
// Sayfadaki video ve gorsel elementlerini izler, indirme butonu ekler
// ve medya listesini sidePanel icin tarayici belleginde tutar

const BUTTON_CLASS = 'metaai-dl-btn';
const PROCESSED_ATTR = 'data-metaai-processed';

window.__metaAiMedia = window.__metaAiMedia || [];

function registerMedia(type, url, container) {
  if (!url || window.__metaAiMedia.some(m => m.url === url)) return;
  const id = 'mm-' + Math.random().toString(36).slice(2, 9);
  window.__metaAiMedia.push({ id, type, url, timestamp: Date.now() });
  container?.setAttribute('data-metaai-id', id);
}

// ─── Buton olustur ───────────────────────────────────────────────────────────
function createDownloadButton(mediaUrl, filename, type = 'video') {
  const btn = document.createElement('button');
  btn.className = BUTTON_CLASS;
  btn.title = 'Fligransiz Indir';
  btn.setAttribute('aria-label', 'Fligransiz Indir');
  const icon = type === 'image'
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  btn.innerHTML = `${icon}<span>Indir</span>`;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    startDownload(mediaUrl, filename, btn);
  });

  return btn;
}

// ─── Indirmeyi baslat ────────────────────────────────────────────────────────
function startDownload(url, filename, btn) {
  btn.classList.add('loading');
  btn.innerHTML = `
    <svg class="spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    <span>Indiriliyor...</span>
  `;

  chrome.runtime.sendMessage(
    { action: 'downloadMedia', url, filename },
    (response) => {
      if (response?.success) {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Tamamlandi!</span>`;
        setTimeout(() => resetButton(btn, url, filename), 2500);
      } else {
        btn.classList.remove('loading');
        btn.classList.add('error');
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>Hata! Tekrar dene</span>`;
        setTimeout(() => resetButton(btn, url, filename), 2500);
      }
    }
  );
}

function resetButton(btn, url, filename) {
  btn.classList.remove('success', 'error', 'loading');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span>Indir</span>`;
}

// ─── Video URL'sini al ────────────────────────────────────────────────────────
function getVideoUrl(videoEl) {
  let url = videoEl.getAttribute('src') || videoEl.src;
  if (!url || url.startsWith('blob:')) {
    const source = videoEl.querySelector('source[src]');
    if (source) url = source.getAttribute('src');
  }
  if (!url || url.startsWith('blob:')) {
    url = videoEl.currentSrc;
  }
  if (url && !url.startsWith('blob:') && (url.includes('fbcdn.net') || url.includes('cdninstagram.com') || url.includes('meta.ai'))) {
    return url;
  }
  return null;
}

// ─── Image URL'sini al ────────────────────────────────────────────────────────
function getImageUrl(imgEl) {
  let url = imgEl.getAttribute('src') || imgEl.src;
  if (!url) return null;
  if (url.includes('fbcdn.net') || url.includes('cdninstagram.com') || url.includes('meta.ai') || url.includes('scontent')) {
    return url;
  }
  return null;
}

// ─── Dosya adi uret ──────────────────────────────────────────────────────────
function generateFilename(url, type) {
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  return `meta-ai-${type}-${ts}`;
}

// ─── Container'i relative yap ────────────────────────────────────────────────
function ensureRelative(container) {
  if (!container) return;
  const style = window.getComputedStyle(container);
  if (style.position === 'static') {
    container.style.position = 'relative';
  }
}

// ─── Video elementi isle ──────────────────────────────────────────────────────
function processVideo(videoEl) {
  if (videoEl.hasAttribute(PROCESSED_ATTR)) return;
  videoEl.setAttribute(PROCESSED_ATTR, 'true');

  const container = videoEl.closest('.group') || videoEl.parentElement;
  if (!container) return;
  ensureRelative(container);

  const tryInject = () => {
    const url = getVideoUrl(videoEl);
    if (!url) { setTimeout(tryInject, 500); return; }
    const filename = generateFilename(url, 'video');
    const btn = createDownloadButton(url, filename, 'video');
    container.appendChild(btn);
    registerMedia('video', url, container);
  };

  if (videoEl.readyState >= 1 || videoEl.src) tryInject();
  else {
    videoEl.addEventListener('loadedmetadata', tryInject, { once: true });
    videoEl.addEventListener('canplay', tryInject, { once: true });
    setTimeout(tryInject, 1000);
  }
}

// ─── Image elementi isle ─────────────────────────────────────────────────────
function processImage(imgEl) {
  if (imgEl.hasAttribute(PROCESSED_ATTR)) return;
  imgEl.setAttribute(PROCESSED_ATTR, 'true');

  const container = imgEl.closest('.group') || imgEl.closest('[class*="relative"]') || imgEl.parentElement;
  if (!container) return;
  ensureRelative(container);

  const tryInject = () => {
    const url = getImageUrl(imgEl);
    if (!url) { setTimeout(tryInject, 500); return; }
    const filename = generateFilename(url, 'image');
    const btn = createDownloadButton(url, filename, 'image');
    container.appendChild(btn);
    registerMedia('image', url, container);
  };

  if (imgEl.complete && imgEl.src) tryInject();
  else {
    imgEl.addEventListener('load', tryInject, { once: true });
    setTimeout(tryInject, 1000);
  }
}

// ─── Tum medyalari tara ───────────────────────────────────────────────────────
function scanForMedia() {
  document.querySelectorAll(`video:not([${PROCESSED_ATTR}])`).forEach(processVideo);
  document.querySelectorAll(`img:not([${PROCESSED_ATTR}])`).forEach(processImage);
}

// ─── MutationObserver: SPA icin dinamik icerik izle ──────────────────────────
const observer = new MutationObserver((mutations) => {
  let shouldScan = false;
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName;
        if (tag === 'VIDEO' || tag === 'IMG' || node.querySelector?.('video, img')) {
          shouldScan = true;
          break;
        }
      }
    }
    if (shouldScan) break;
  }
  if (shouldScan) scanForMedia();
});

observer.observe(document.body, { childList: true, subtree: true });
scanForMedia();

// ─── SidePanel'den gelen mesajlari dinle ─────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getMediaList') {
    const list = (window.__metaAiMedia || []).map(m => ({
      id: m.id,
      type: m.type,
      url: m.url,
      timestamp: m.timestamp
    }));
    sendResponse({ media: list });
    return true;
  }
});
