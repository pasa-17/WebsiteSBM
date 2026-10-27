let P = Object.assign({}, DEFAULT_P);
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notif(m, t = 'success') { const n = $('#notif'); n.textContent = m; n.className = 'notif ' + t + ' show'; setTimeout(() => n.classList.remove('show'), 3500); }
function applyP() {
  $$('[data-p]').forEach(e => { if (P[e.dataset.p]) e.textContent = P[e.dataset.p]; });
  $$('[data-wa]').forEach(a => a.href = 'https://wa.me/' + String(P.WA_ADMIN).replace(/\D/g, '') + '?text=' + encodeURIComponent(a.dataset.wa));
  $('#portal').href = P.PORTAL_URL || '#'; $('#peta').src = P.MAPS_EMBED;
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
async function load() {
  try { const r = await (await fetch(GAS_URL + '?action=getData')).json(); if (!r.success) throw 0; Object.assign(P, r.data.pengaturan); applyP(); renderBerita(r.data.berita || []); renderGaleri(r.data.galeri || []); }
  catch (e) { applyP(); renderBerita([]); renderGaleri([]); }
  reveal();
}
$('#form').addEventListener('submit', async e => {
  e.preventDefault(); const b = e.submitter; b.disabled = true; b.textContent = 'Mengirim...';
  try {
    const res = await (await fetch(GAS_URL, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify({action: 'daftar', data: Object.fromEntries(new FormData(e.target))})})).json();
    if (res.success) { notif(res.message); e.target.reset(); } else notif(res.message || 'Gagal mengirim.', 'error');
  } catch (err) { notif('Gagal terhubung. Coba lagi atau hubungi admin via WhatsApp.', 'error'); }
  b.disabled = false; b.textContent = 'Kirim Pendaftaran';
});
$$('#menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('open')));
if (matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const g = $('#glow'); let x = 0, y = 0, tx = 0, ty = 0;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; g.style.opacity = 1; });
  (function f() { x += (tx - x) * .15; y += (ty - y) * .15; g.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(f); })();
}
load();
