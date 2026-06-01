// Meta AI Media Downloader - Background Service Worker
// SidePanel yonetimi ve indirme islemleri

// Eklenti ikonuna tiklayinca sidePanel ac
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Sadece meta.ai sayfalarinda sidePanel aktif olsun
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab?.url) return;
  const isMetaAi = tab.url.includes('meta.ai');
  chrome.sidePanel.setOptions({
    tabId,
    enabled: isMetaAi,
    path: isMetaAi ? 'sidepanel.html' : undefined
  });
});

// Indirme taleplerini isle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadMedia') {
    handleDownload(message.url, message.filename, sendResponse);
    return true; // async response
  }
});

async function handleDownload(url, filename, sendResponse) {
  try {
    const ext = url.match(/\.(jpg|jpeg|png|webp|gif|mp4|mov)/i)?.[1] || 'mp4';
    const safeName = (filename || `meta-ai-media`).replace(/[^a-z0-9\-_]/gi, '_');
    const finalName = `${safeName}.${ext}`;

    chrome.downloads.download(
      {
        url: url,
        filename: finalName,
        saveAs: false,
        conflictAction: 'uniquify'
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('[MetaAI DL] Indirme hatasi:', chrome.runtime.lastError.message);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          console.log('[MetaAI DL] Indirme basladi, ID:', downloadId);
          sendResponse({ success: true, downloadId });
        }
      }
    );
  } catch (err) {
    console.error('[MetaAI DL] Beklenmeyen hata:', err);
    sendResponse({ success: false, error: err.message });
  }
}
