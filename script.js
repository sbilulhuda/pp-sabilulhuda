lucide.createIcons();
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

/* ---- tanggal hari ini ---- */
 $('#todayDate').textContent=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

/* ---- preloader ---- */
let plDone=false;
function finishLoad(){if(plDone)return;plDone=true;
  $('#preloader').classList.add('hide');document.body.classList.add('ready');}
window.addEventListener('load',()=>setTimeout(finishLoad,2200));
setTimeout(finishLoad,4500); /* fallback */

/* ---- glow kursor ---- */
document.addEventListener('mousemove',e=>{
  const g=$('#cursorGlow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px';
});

/* ---- scroll: progress, nav, toTop, parallax hero ---- */
window.addEventListener('scroll',()=>{
  const st=window.scrollY, h=document.documentElement.scrollHeight-innerHeight;
  $('#progress').style.width=(h?st/h*100:0)+'%';
  $('#mainNav').classList.toggle('scrolled',st>40);
  $('#toTop').classList.toggle('show',st>600);
  const hb=$('.hero-bg');
  if(hb&&st<innerHeight*1.2)hb.style.transform=`translateY(${st*.22}px)`;
},{passive:true});

/* ---- menu mobile ---- */
 $('#menuBtn').addEventListener('click',()=>$('#mobileMenu').classList.add('open'));
 $('#menuClose').addEventListener('click',()=>$('#mobileMenu').classList.remove('open'));

/* ---- navigasi dengan transisi loading ---- */
const names={beranda:'Beranda',profil:'Profil',program:'Program',galeri:'Galeri',berita:'Berita',ppdb:'Pendaftaran',kontak:'Kontak'};
function goto(id){
  const el=$(id);if(!el)return;
  const pt=$('#pageTransition'),fill=$('#ptBarFill'),pct=$('#ptPct');
  $('#ptTarget').textContent=names[id.slice(1)]||'Halaman';
  fill.style.width='0%';pct.textContent='0%';
  pt.classList.add('active');
  let p=0;
  const iv=setInterval(()=>{
    p=Math.min(100,p+8+Math.random()*20);
    fill.style.width=p+'%';pct.textContent=Math.round(p)+'%';
    if(p>=100){clearInterval(iv);
      setTimeout(()=>{
        const y=el.getBoundingClientRect().top+window.scrollY-88;
        window.scrollTo(0,Math.max(0,y));
        pt.classList.remove('active');
      },300);
    }
  },120);
}
 $$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1&&$(id)){e.preventDefault();
      $('#mobileMenu').classList.remove('open');goto(id);}
  });
});

/* ---- duplikasi track marquee agar loop mulus ---- */
const mq=$('#mqTrack');mq.innerHTML+=mq.innerHTML;
 $$('.gal-track').forEach(t=>t.innerHTML+=t.innerHTML);

/* ---- accordion program + preview gambar ---- */
 $$('.prog-item').forEach(item=>{
  const head=item.querySelector('.prog-head');
  head.addEventListener('click',()=>{
    const open=item.classList.contains('open');
    $$('.prog-item.open').forEach(o=>{o.classList.remove('open');
      o.querySelector('.prog-body').style.maxHeight=null;});
    if(!open){item.classList.add('open');
      const b=item.querySelector('.prog-body');b.style.maxHeight=b.scrollHeight+'px';}
  });
  const prev=$('#programPreview'),pimg=prev.querySelector('img');
  head.addEventListener('mouseenter',()=>{pimg.src=item.dataset.img;prev.classList.add('show');});
  head.addEventListener('mousemove',e=>{
    prev.style.left=Math.min(e.clientX+24,innerWidth-280)+'px';
    prev.style.top=Math.max(20,e.clientY-90)+'px';});
  head.addEventListener('mouseleave',()=>prev.classList.remove('show'));
});

/* ---- reveal saat scroll ---- */
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
}),{threshold:.15});
 $$('[data-reveal]').forEach(el=>io.observe(el));

/* ---- angka statistik ---- */
const cio=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;cio.unobserve(en.target);
  const el=en.target,target=+el.dataset.count,suf=el.dataset.suffix||'';
  const t0=performance.now(),dur=1600;
  (function step(t){const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);
    el.textContent=Math.round(target*e)+suf;
    if(k<1)requestAnimationFrame(step);})(t0);
}),{threshold:.4});
 $$('[data-count]').forEach(el=>cio.observe(el));

/* ---- modal berita ---- */
const modal=$('#newsModal');
 $$('.news-feature,.news-item').forEach(n=>{
  n.addEventListener('click',()=>{
    $('#modalImg').src=n.dataset.img;
    $('#modalCat').textContent=n.dataset.cat;
    $('#modalDate').textContent=n.dataset.date;
    $('#modalTitle').innerHTML=n.dataset.title;
    $('#modalBody').innerHTML=n.dataset.body;
    modal.classList.add('open');document.body.style.overflow='hidden';
  });
});
function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
 $('#modalClose').addEventListener('click',closeModal);
 $('.modal-backdrop').addEventListener('click',closeModal);

/* ---- toast ---- */
let toastTimer;
function showToast(msg){
  $('#toastMsg').innerHTML=msg;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),5200);
}

/* ---- form PPDB -> WhatsApp ---- */
 $('#ppdbForm').addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target,nama=f.nama.value.trim(),wali=f.wali.value.trim(),hp=f.hp.value.trim(),prog=f.prog.value;
  if(!nama||!wali||!hp){showToast('<b>Data belum lengkap.</b> Mohon isi semua kolom terlebih dahulu.');return;}
  const text=`Assalamu'alaikum, saya ingin mendaftarkan putra/putri saya di PP Sabilul Huda Bahrul 'Ulum.%0A%0ANama Calon Santri: ${encodeURIComponent(nama)}%0ANama Wali: ${encodeURIComponent(wali)}%0ANo. HP: ${encodeURIComponent(hp)}%0AProgram: ${encodeURIComponent(prog)}`;
  window.open(`https://wa.me/6285272367693?text=${text}`,'_blank');
  showToast('<b>Alhamdulillah!</b> Pendaftaran dikirim via WhatsApp. Panitia PPDB akan segera menghubungi Anda.');
  f.reset();
});

/* ---- tombol ke atas ---- */
 $('#toTop').addEventListener('click',()=>window.scrollTo({top:0}));

/* ---- video hero (opsional) ---- */
const hv=$('#heroVideo');
if(hv){hv.addEventListener('canplay',()=>hv.classList.add('playing'));
  hv.play().catch(()=>{});}



  /* ============ ★ HERO: VIDEO AI GENERATIF (canvas, tanpa file) ★ ============ */
(function () {
  'use strict';

  const canvas = document.getElementById('aiCanvas');
  if (!canvas || !canvas.getContext) return;
  const ctx   = canvas.getContext('2d', { alpha: false });
  const hero  = canvas.closest('.hero') || canvas.parentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Palet warna (sesuaikan di sini) ---------- */
  const HIJAU = [61, 231, 158];
  const UNGU  = [157, 92, 255];
  const MINT  = [141, 243, 199];
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- Ukuran & DPI ---------- */
  let W = 0, H = 0;
  function resize() {
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5); // batasi agar ringan
    W = canvas.clientWidth  || hero.clientWidth;
    H = canvas.clientHeight || hero.clientHeight;
    canvas.width  = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    bangunScene();
  }

  /* ---------- Scene: blob aurora ---------- */
  let blobs = [], parts = [], rays = [];
  function bangunScene() {
    blobs = []; parts = []; rays = [];
    const minWH = Math.min(W, H);

    // 1. Aurora — bola cahaya besar yang melayang
    const warna = [HIJAU, UNGU, MINT];
    const nBlob = W < 700 ? 4 : 6;
    for (let i = 0; i < nBlob; i++) {
      blobs.push({
        x: rnd(0, W), y: rnd(0, H),
        r: rnd(minWH * .28, minWH * .55),
        c: warna[i % 3],
        a: rnd(.06, .12),
        vx: rnd(-.08, .08), vy: rnd(-.06, .06),
        f: rnd(.00012, .0003)            // kecepatan "denyut"
      });
    }

    // 2. Partikel — debu berkilau + sebagian bokeh (besar & blur)
    const nPart = W < 700 ? 40 : 85;
    for (let i = 0; i < nPart; i++) {
      const bokeh = Math.random() < .16;
      parts.push({
        x: rnd(0, W), y: rnd(0, H),
        r: bokeh ? rnd(6, 22) : rnd(.6, 2.4),
        bokeh: bokeh,
        vx: rnd(-.05, .05),
        vy: bokeh ? rnd(-.06, -.02) : rnd(-.22, -.08),
        a: rnd(.15, .6),
        tw: rnd(.001, .004),             // kecepatan kelip
        ph: rnd(0, Math.PI * 2),
        c: Math.random() < .7 ? MINT : UNGU
      });
    }

    // 3. God rays — segaris cahaya dari atas
    const nRay = 5;
    for (let i = 0; i < nRay; i++) {
      rays.push({
        x: rnd(W * .1, W * .9),
        w: rnd(60, 180),
        a: rnd(.02, .05),
        sway: rnd(.00015, .0004),
        ph: rnd(0, Math.PI * 2)
      });
    }
  }

  /* ---------- Satu frame penuh ---------- */
  function gambar(t) {
    // langit dasar
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#030905');
    g.addColorStop(.45, '#05100a');
    g.addColorStop(1, '#040a07');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // gerak kamera: zoom "bernapas" pelan
    const zoom = 1.045 + Math.sin(t * .00028) * .03;
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-W / 2, -H / 2);

    ctx.globalCompositeOperation = 'lighter'; // mode cahaya menyatu

    // -- aurora --
    for (const b of blobs) {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r; else if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r; else if (b.y > H + b.r) b.y = -b.r;
      const alpa = b.a * (.75 + .25 * Math.sin(t * b.f));
      const rg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      rg.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${alpa})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.2832); ctx.fill();
    }

    // -- god rays (miring + bergoyang pelan) --
    for (const r of rays) {
      const geser = Math.sin(t * r.sway + r.ph) * (W * .06);
      ctx.save();
      ctx.translate(r.x + geser, -60);
      ctx.rotate(.32);
      const lg = ctx.createLinearGradient(0, 0, 0, H * 1.15);
      lg.addColorStop(0, `rgba(141,243,199,${r.a})`);
      lg.addColorStop(1, 'rgba(141,243,199,0)');
      ctx.fillStyle = lg;
      ctx.fillRect(-r.w / 2, 0, r.w, H * 1.15);
      ctx.restore();
    }

    // -- partikel --
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -30) { p.y = H + 20; p.x = rnd(0, W); }
      if (p.x < -30) p.x = W + 20; else if (p.x > W + 30) p.x = -20;
      const alpa = p.a * (.55 + .45 * Math.sin(t * p.tw + p.ph));
      if (alpa <= 0.01) continue;
      if (p.bokeh) {
        const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        rg.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${alpa * .8})`);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rg;
      } else {
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${alpa})`;
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';

    // -- ornamen geometri islami: bintang 8 berputar sangat pelan --
    const R = Math.min(W, H) * .42;
    ctx.save();
    ctx.translate(W * .5, H * .5);
    ctx.rotate(t * .00004);
    ctx.strokeStyle = 'rgba(61,231,158,0.05)';
    ctx.lineWidth = 1;
    for (let k = 0; k < 2; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 4);
      ctx.strokeRect(-R, -R, R * 2, R * 2);
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(0, 0, R * 1.08, 0, 6.2832); ctx.stroke();
    ctx.restore();

    ctx.restore(); // akhir gerak kamera
  }

  /* ---------- Loop + hemat daya (pause kalau tak terlihat) ---------- */
  let rafId = null, heroTampak = true;

  function loop(t) { gambar(t); rafId = requestAnimationFrame(loop); }

  function aturLoop() {
    const aktif = heroTampak && !document.hidden && !reduce;
    if (aktif && rafId === null) rafId = requestAnimationFrame(loop);
    if (!aktif && rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  document.addEventListener('visibilitychange', aturLoop);
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(([en]) => { heroTampak = en.isIntersecting; aturLoop(); },
      { threshold: 0 }).observe(hero);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // mulai
  resize();
  gambar(0);              // gambar frame pertama langsung (tidak ada kilatan hitam)
  canvas.classList.add('on');
  aturLoop();
})();