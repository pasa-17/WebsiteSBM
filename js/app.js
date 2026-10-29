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
function renderGaleri(l) {
  $('#galeri-list').innerHTML = l.length ? l.map(g => g.url ? `<img loading="lazy" src="${esc(g.url)}" alt="${esc(g.judul)}">` : '').join('') : '<div class="ph"></div><div class="ph"></div><div class="ph"></div>';
  const s = $('#galeri-list'); if (l.length > 1) setInterval(() => { s.scrollLeft + s.clientWidth >= s.scrollWidth - 5 ? s.scrollTo({left: 0, behavior: 'smooth'}) : s.scrollBy({left: 340, behavior: 'smooth'}); }, 4000);
}
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
async function load() {
  try { const r = await (await fetch(GAS_URL + '?action=getData')).json(); if (!r.success) throw 0; Object.assign(P, r.data.pengaturan); applyP(); renderBerita(r.data.berita || []); renderGaleri(r.data.galeri || []); BIAYA = r.data.biaya || []; GURU = r.data.guru || []; }
  catch (e) { applyP(); renderBerita([]); renderGaleri([]); }
  renderBiaya(); renderGuru(); renderVideo(); renderTur(); reveal();
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
