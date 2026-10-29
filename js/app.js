let P = Object.assign({}, DEFAULT_P);
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notif(m, t = 'success') { const n = $('#notif'); n.textContent = m; n.className = 'notif ' + t + ' show'; setTimeout(() => n.classList.remove('show'), 3500); }
function applyP() {
  $$('[data-p]').forEach(e => { if (P[e.dataset.p]) e.textContent = P[e.dataset.p]; });
  $$('[data-wa]').forEach(a => a.href = 'https://wa.me/' + String(P.WA_ADMIN).replace(/\D/g, '') + '?text=' + encodeURIComponent(a.dataset.wa));
  if (P.FOTO_KAMPUS) $('#campus').style.backgroundImage = `url(${P.FOTO_KAMPUS})`; $('#peta').src = P.MAPS_EMBED;
  $('#soc').innerHTML = [['Instagram','INSTAGRAM'],['YouTube','YOUTUBE'],['Facebook','FACEBOOK'],['TikTok','TIKTOK']].filter(x => P[x[1]]).map(x => `<a href="${esc(P[x[1]])}" target="_blank" rel="noopener">${x[0]}</a>`).join('');
}
function renderBerita(l) {
  $('#berita-list').innerHTML = l.length ? l.slice(0, 6).map(b => `<article class="card news rv">${b.gambar ? `<img loading="lazy" src="${esc(b.gambar)}" alt="">` : '<div class="ph"></div>'}<small>${esc(b.kategori || 'Berita')} · ${esc(String(b.tanggal || '').slice(0, 10))}</small><h3>${esc(b.judul)}</h3><p class="muted">${esc(b.ringkasan)}</p></article>`).join('') : '<p class="muted">Belum ada berita.</p>';
}
let GL = [], LI = 0, gt;
function fade(el, urls, off) {
  if (!el || !urls.length) return;
  const els = urls.map(u => { const i = document.createElement('i'); i.className = 'sl'; i.style.backgroundImage = 'url("' + encodeURI(u).replace(/"/g, '%22') + '")'; el.appendChild(i); return i; });
  let k = off % els.length; els[k].classList.add('on');
  if (els.length > 1 && !matchMedia('(prefers-reduced-motion:reduce)').matches) setInterval(() => { els[k].classList.remove('on'); k = (k + 1) % els.length; els[k].classList.add('on'); }, 5000);
}
function photoSlots() {
  if (!GL.length) return;
  const urls = GL.slice(0, 8).map(g => g.url);
  fade($('#hbg'), urls, 0);
  if (!P.FOTO_KAMPUS) fade($('#cl'), urls, 1);
  const keys = [['masjid'], ['asrama'], ['kelas'], ['lapangan', 'area', 'hijau']];
  $$('.fas .tile').forEach((t, i) => { const g = GL.find(x => keys[i].some(k => String(x.judul || '').toLowerCase().includes(k))) || GL[i % GL.length]; t.style.backgroundImage = 'linear-gradient(180deg,transparent 40%,rgba(8,22,48,.8)),url("' + encodeURI(g.url).replace(/"/g, '%22') + '")'; });
}
function renderGaleri(l) {
  GL = l.filter(g => g.url); const s = $('#galeri-list');
  s.innerHTML = GL.length ? GL.map((g, i) => `<img loading="lazy" data-i="${i}" src="${esc(g.url)}" alt="${esc(g.judul)}">`).join('') : '<div class="ph"></div><div class="ph"></div><div class="ph"></div>';
  const move = d => { if (d > 0 && s.scrollLeft + s.clientWidth >= s.scrollWidth - 5) s.scrollTo({left: 0, behavior: 'smooth'}); else if (d < 0 && s.scrollLeft <= 5) s.scrollTo({left: s.scrollWidth, behavior: 'smooth'}); else s.scrollBy({left: d * Math.min(360, s.clientWidth * .8), behavior: 'smooth'}); };
  $('#gprev').onclick = () => move(-1); $('#gnext').onclick = () => move(1);
  const auto = () => { clearInterval(gt); if (GL.length > 1) gt = setInterval(() => move(1), 3500); };
  auto(); ['mouseenter', 'touchstart'].forEach(v => s.addEventListener(v, () => clearInterval(gt), {passive: true})); ['mouseleave', 'touchend'].forEach(v => s.addEventListener(v, auto, {passive: true}));
  s.onclick = e => { const im = e.target.closest('img'); if (im) openLb(+im.dataset.i); };
  photoSlots();
}
function openLb(i) { if (!GL.length) return; LI = (i + GL.length) % GL.length; $('#lbi').src = GL[LI].url; $('#lbc').textContent = GL[LI].judul || ''; $('#lb').hidden = false; document.body.style.overflow = 'hidden'; }
function closeLb() { $('#lb').hidden = true; document.body.style.overflow = ''; }
$('#lbx').onclick = closeLb; $('#lbp').onclick = () => openLb(LI - 1); $('#lbn').onclick = () => openLb(LI + 1); $('#lb').onclick = e => { if (e.target.id === 'lb') closeLb(); };
addEventListener('keydown', e => { if ($('#lb').hidden) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') openLb(LI - 1); if (e.key === 'ArrowRight') openLb(LI + 1); });
let x0 = 0; $('#lbi').addEventListener('touchstart', e => x0 = e.touches[0].clientX, {passive: true}); $('#lbi').addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) openLb(LI + (d < 0 ? 1 : -1)); });
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold: .12});
  $$('.rv:not(.in)').forEach((e, i) => { e.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(e); });
}
let BIAYA = [], BJ = 'SD', GURU = [];
function renderGuru() {
  $('#guru-list').innerHTML = GURU.length ? GURU.map(g => { const ft = g.foto && g.foto_tampil !== 'TIDAK'; return `<article class="card rv tc">${ft ? `<img class="av" loading="lazy" src="${esc(g.foto)}" alt="">` : `<div class="av ini">${esc((g.nama || '?').trim().charAt(0))}</div>`}<h3>${esc(g.nama)}</h3><p class="muted">${esc(g.jabatan)}</p></article>`; }).join('') : '<p class="muted">Data guru dan karyawan akan segera ditambahkan.</p>';
}
function renderVideo() {
  const m = String(P.VIDEO_URL || '').match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (m) $('#vid').innerHTML = `<iframe src="https://www.youtube.com/embed/${m[1]}" title="Video dokumentasi" allowfullscreen loading="lazy" style="width:100%;aspect-ratio:16/9;border:0;border-radius:1rem"></iframe>`;
}
const rp = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
function renderBiaya() {
  const box = $('#biaya-box'), l = BIAYA.filter(b => (b.jenjang === BJ || b.jenjang === 'Semua') && b.tampil !== 'TIDAK');
  if (P.BIAYA_TERBUKA === 'TIDAK' || !l.length) { box.innerHTML = '<p class="muted">Hubungi panitia untuk rincian biaya.</p>'; return; }
  const sekali = l.filter(b => b.periode === 'Sekali').reduce((s, b) => s + Number(b.nominal || 0), 0), bln = l.find(b => b.periode === 'Bulanan');
  box.innerHTML = '<table><tr><th>Komponen</th><th>Periode</th><th>Nominal</th></tr>' + l.map(b => `<tr><td>${esc(b.komponen)}</td><td>${esc(b.periode)}</td><td>${rp(b.nominal)}</td></tr>`).join('') + `<tr class="tot"><td colspan="2">Estimasi masuk (sekali bayar${bln ? ' + 1 bulan pertama' : ''})</td><td>${rp(sekali + (bln ? Number(bln.nominal) : 0))}</td></tr></table>`;
}
$$('#bj button').forEach(b => b.onclick = () => { BJ = b.dataset.j; $$('#bj button').forEach(x => x.classList.toggle('on', x === b)); renderBiaya(); });
function renderTur() {
  $('#svlink').href = 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + (P.KOORDINAT || '-8.0291696,112.4345699');
  let ada = false, e = String(P.STREETVIEW_EMBED || ''), m = e.match(/src="([^"]+)"/), u = m ? m[1] : e.trim();
  if (/^https:\/\/www\.google\.com\/maps\/embed/.test(u)) { $('#sv').innerHTML = `<iframe src="${esc(u)}" title="Street View lokasi pondok" loading="lazy" allowfullscreen style="width:100%;height:440px;border:0;border-radius:1rem"></iframe>`; ada = true; }
  const p = String(P.PANORAMA_URL || '').trim();
  if (/^(https?:\/\/|assets\/)/.test(p)) {
    ada = true; $('#pano').hidden = false;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'; document.head.appendChild(l);
    const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    s.onload = () => pannellum.viewer('pano', {type: 'equirectangular', panorama: p, autoLoad: true, autoRotate: -2, showControls: true}); document.head.appendChild(s);
  }
  $('#tur-empty').hidden = ada;
}
let PENG = [], PI = 0;
function drawPop() {
  const g = PENG[PI], L = String(g.tombol_link || '').trim(), ok = /^(https?:\/\/|#|assets\/)/.test(L);
  $('#pop-c').innerHTML = (g.gambar ? `<img src="${esc(g.gambar)}" alt="">` : '') + `<h3>${esc(g.judul)}</h3><p class="muted">${esc(g.isi).replace(/\n/g, '<br>')}</p>` + (ok ? `<a class="btn amber" href="${esc(L)}"${/^https?/.test(L) ? ' target="_blank" rel="noopener"' : ''}>${esc(g.tombol_teks || 'Selengkapnya')}</a>` : '');
  const bt = $('#pop-c a'); if (bt) bt.onclick = closePop;
  $('#pop-d').innerHTML = PENG.length > 1 ? PENG.map((_, i) => `<i class="${i === PI ? 'on' : ''}"></i>`).join('') : '';
  $('#pop-p').hidden = $('#pop-n').hidden = PENG.length < 2;
}
function showPop() { if (document.body.classList.contains('mt') || P.POPUP_AKTIF === 'TIDAK' || !PENG.length || sessionStorage.getItem('popseen')) return; PI = 0; drawPop(); $('#pop').hidden = false; document.body.style.overflow = 'hidden'; }
function closePop() { $('#pop').hidden = true; document.body.style.overflow = ''; sessionStorage.setItem('popseen', '1'); }
$('#pop-x').onclick = closePop; $('#pop').onclick = e => { if (e.target.id === 'pop') closePop(); };
$('#pop-p').onclick = () => { PI = (PI - 1 + PENG.length) % PENG.length; drawPop(); }; $('#pop-n').onclick = () => { PI = (PI + 1) % PENG.length; drawPop(); };
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#pop').hidden) closePop(); });
async function load() {
  try { const r = await (await fetch(GAS_URL + '?action=getData')).json(); if (!r.success) throw 0; Object.assign(P, r.data.pengaturan); if (P.MODE_PEMELIHARAAN === 'YA') { document.body.classList.add('mt'); $('#mt').hidden = false; if (P.PESAN_PEMELIHARAAN) $('#mt-p').textContent = P.PESAN_PEMELIHARAAN; } applyP(); renderBerita(r.data.berita || []); renderGaleri(r.data.galeri || []); BIAYA = r.data.biaya || []; GURU = r.data.guru || []; PENG = r.data.pengumuman || []; }
  catch (e) { applyP(); renderBerita([]); renderGaleri([]); }
  renderBiaya(); renderGuru(); renderVideo(); renderTur(); reveal(); document.documentElement.classList.remove('wait'); setTimeout(showPop, 600);
}
$('#form').addEventListener('submit', async e => {
  e.preventDefault(); const b = e.submitter; b.disabled = true; b.textContent = 'Mengirim...';
  try {
    const res = await (await fetch(GAS_URL, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify({action: 'daftar', data: Object.fromEntries(new FormData(e.target))})})).json();
    if (res.success) { notif(res.message); e.target.reset(); } else notif(res.message || 'Gagal mengirim.', 'error');
  } catch (err) { notif('Gagal terhubung. Coba lagi atau hubungi admin via WhatsApp.', 'error'); }
  b.disabled = false; b.textContent = 'Kirim Pendaftaran';
});
$$('.dd > a').forEach(a => a.addEventListener('click', e => { if (innerWidth <= 900) { e.preventDefault(); a.parentNode.classList.toggle('open'); } }));
$$('#menu a:not(.dd > a)').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('open'); $$('.dd').forEach(d => d.classList.remove('open')); }));
if (matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const g = $('#glow'); let x = 0, y = 0, tx = 0, ty = 0;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; g.style.opacity = 1; });
  (function f() { x += (tx - x) * .15; y += (ty - y) * .15; g.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(f); })();
}
load();
