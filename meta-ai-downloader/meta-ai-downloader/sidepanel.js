// SidePanel Script - Meta AI Media Downloader

const mediaListEl = document.getElementById('mediaList');
const countTextEl = document.getElementById('countText');
let currentFilter = 'all';
let knownMedia = [];

// Filtre butonlari
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderList();
  });
});

// Medya listesini aktif sekmeden al
function fetchMediaFromPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.id) return;
    chrome.tabs.sendMessage(tab.id, { action: 'getMediaList' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('[SidePanel] Mesaj hatasi:', chrome.runtime.lastError.message);
        showEmpty();
        return;
      }
      if (response?.media) {
        knownMedia = response.media;
        renderList();
        updateCount();
      }
    });
  });
}

function updateCount() {
  const total = knownMedia.length;
  const videos = knownMedia.filter(m => m.type === 'video').length;
  const images = knownMedia.filter(m => m.type === 'image').length;
  if (total === 0) {
    countTextEl.textContent = 'medya bulunamadi';
  } else {
    countTextEl.textContent = `${total} medya (${videos} video, ${images} gorsel)`;
  }
}

function showEmpty() {
  mediaListEl.innerHTML = `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <p>meta.ai sayfasina gidin ve medya olusturun.</p>
    </div>
  `;
}

function renderList() {
  if (!knownMedia.length) {
    showEmpty();
    return;
  }

  const filtered = currentFilter === 'all'
    ? knownMedia
    : knownMedia.filter(m => m.type === currentFilter);

  if (!filtered.length) {
    mediaListEl.innerHTML = `<div class="empty-state"><p>Bu kategoride medya yok.</p></div>`;
    return;
  }

  mediaListEl.innerHTML = '';
  filtered.forEach(item => {
    const el = createMediaItem(item);
    mediaListEl.appendChild(el);
  });
}

function createMediaItem(item) {
  const div = document.createElement('div');
  div.className = 'media-item';

  const thumb = item.type === 'image'
    ? `<img src="${item.url}" alt="" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<svg class=\\'icon\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\' ry=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg>';" />`
    : `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;

  const ext = item.url.match(/\.(\w+)(?:\?|$)/)?.[1] || '';
  const shortName = `meta-ai-${item.type}-${new Date(item.timestamp).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;

  div.innerHTML = `
    <div class="media-thumb">${thumb}</div>
    <div class="media-info">
      <span class="media-type ${item.type}">${item.type === 'video' ? 'Video' : 'Gorsel'}</span>
      <span class="media-name">${shortName}</span>
      <span class="media-url">${ext ? '.' + ext : ''} &middot; ${truncate(item.url, 35)}</span>
    </div>
    <button class="dl-btn" data-url="${encodeURIComponent(item.url)}" data-filename="${shortName}" title="Indir">
      <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    </button>
  `;

  const btn = div.querySelector('.dl-btn');
  btn.addEventListener('click', () => startDownloadItem(btn, item.url, shortName));
  return div;
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '...' : str;
}

function startDownloadItem(btn, url, filename) {
  btn.classList.add('loading');
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

  chrome.runtime.sendMessage(
    { action: 'downloadMedia', url, filename },
    (response) => {
      if (response?.success) {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
        setTimeout(() => {
          btn.classList.remove('success');
          btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
        }, 2000);
      } else {
        btn.classList.remove('loading');
        btn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
      }
    }
  );
}

// Periyodik yenileme (yeni medya olabilir)
setInterval(fetchMediaFromPage, 2500);

// Ilk yukleme
fetchMediaFromPage();
