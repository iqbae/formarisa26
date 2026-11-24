/* ============================================================
   Selamat Ulang Tahun — logika halaman
   ============================================================ */
(function () {
  "use strict";

  const cfg = window.BIRTHDAY_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);

  const body = document.body;
  const intro = $("#intro");
  const cake = $("#cake");
  const introHint = $("#introHint");
  const introActions = $("#introActions");
  const btnBlow = $("#btnBlow");
  const btnMic = $("#btnMic");
  const micNote = $("#micNote");
  const site = $("#site");
  const modal = $("#modal");
  const giftBtn = $("#giftBtn");
  const letterClose = $("#letterClose");
  const audio = $("#audio");
  const musicBtn = $("#musicBtn");
  const musicTip = $("#musicTip");
  const progress = $("#progress");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // sembunyikan konten utama dari keyboard selama intro masih tampil
  if (site) site.inert = true;

  /* ---------- util ---------- */
  const esc = (str) =>
    String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  function renderTitle(el, text) {
    if (!el || !text) return;
    const lines = String(text).split("\n").filter((l) => l.trim() !== "");
    el.innerHTML = lines
      .map((line, i) => (i === 0 ? esc(line) : `<em>${esc(line)}</em>`))
      .join("<br />");
  }

  function formatDate() {
    if (cfg.dateLabel) return cfg.dateLabel;
    if (!cfg.dateISO) return "";
    const d = new Date(cfg.dateISO + "T00:00:00");
    if (isNaN(d)) return "";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
    } catch (e) {
      return cfg.dateISO;
    }
  }

  /* ============================================================
     ISI HALAMAN DARI CONFIG
     ============================================================ */
  const nameTo = cfg.to || "Sayangku";
  const nameFrom = cfg.from || "Iqbal";

  document.title = cfg.ogTitle || `Selamat Ulang Tahun, ${nameTo}`;
  $('meta[property="og:title"]').setAttribute("content", cfg.ogTitle || `Selamat Ulang Tahun, ${nameTo}`);
  const ogDescription = cfg.ogDescription || cfg.heroSub;
  if (ogDescription) {
    $('meta[property="og:description"]').setAttribute("content", ogDescription);
    $('meta[name="description"]').setAttribute("content", ogDescription);
  }

  $("#introEyebrow").textContent = cfg.introEyebrow || "";
  $("#introName").textContent = nameTo;
  introHint.textContent = cfg.introHint || introHint.textContent;
  micNote.textContent = cfg.introNote || "";
  $("#heroEyebrow").textContent = cfg.heroEyebrow || "";
  $("#heroTo").textContent = nameTo;
  $("#heroSub").textContent = cfg.heroSub || "";
  $("#scrollCue").textContent = cfg.scrollCue || "gulir";

  const dateText = formatDate();
  const ageText = cfg.age ? ` · yang ke-${cfg.age}` : "";
  $("#heroDate").textContent = dateText ? dateText + ageText : "";

  if (cfg.storyIntro) {
    $("#storyEyebrow").textContent = cfg.storyIntro.eyebrow || "";
    renderTitle($("#storyTitle"), cfg.storyIntro.title || "");
  }

  $("#storyList").innerHTML = (cfg.story || [])
    .map((ch, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `
        <article class="chapter reveal" style="--d:${(i * 0.06).toFixed(2)}s">
          <span class="chapter__num" aria-hidden="true">${num}</span>
          <div class="chapter__body">
            ${ch.kicker ? `<p class="chapter__kicker">${esc(ch.kicker)}</p>` : ""}
            <h2 class="chapter__title">${esc(ch.title)}</h2>
            <p class="chapter__text">${esc(ch.text)}</p>
          </div>
        </article>`;
    })
    .join("");

  if (cfg.quote) {
    $("#quoteText").textContent = cfg.quote.text || "";
    $("#quoteBy").textContent = cfg.quote.by || "";
  }

  if (cfg.gift) {
    const giftSection = $("#hadiah");
    giftSection.querySelector(".eyebrow").textContent = cfg.gift.eyebrow || "";
    renderTitle(giftSection.querySelector(".sec-title"), cfg.gift.title || "");
    $(".seal__label").textContent = cfg.gift.seal || "Buka";
    $("#letterTitle").textContent = cfg.gift.letterTitle || "";
    $(".letter__eyebrow").textContent = cfg.gift.letterEyebrow || "Surat kecil";
    $("#letterBody").innerHTML = (cfg.gift.paragraphs || [])
      .map((p) => `<p>${esc(p)}</p>`)
      .join("");
    const letterCta = $("#letterCta");
    if (letterCta) {
      letterCta.innerHTML = "";
      if (cfg.gift.cta && cfg.gift.cta.href) {
        const a = document.createElement("a");
        a.className = "btn btn--gold letter__btn";
        a.href = cfg.gift.cta.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = cfg.gift.cta.label || "Buka";
        letterCta.appendChild(a);
        if (cfg.gift.letterOutro) {
          const note = document.createElement("p");
          note.className = "letter__outro";
          note.textContent = cfg.gift.letterOutro;
          letterCta.appendChild(note);
        }
        letterCta.hidden = false;
      } else {
        letterCta.hidden = true;
      }
    }
    $("#letterSign").innerHTML = `${esc(cfg.gift.sign || "")}<br /><em>${esc(nameFrom)}</em>`;
  }

  $("#closing").textContent = cfg.closing || "";
  $("#footerNote").textContent = cfg.footerNote || "";
  $("#footerFrom").textContent = nameFrom;

  /* ============================================================
     LATAR: BINTANG, KELOPAK, KONFETI
     ============================================================ */
  const canvas = $("#sky");
  const ctx = canvas.getContext("2d");
  let W = 0;
  let H = 0;
  let dpr = 1;
  let stars = [];
  let petals = [];
  let burstParticles = [];
  let rafId = null;
  let lastTime = 0;
  let petalsStarted = false;

  const CONFETTI = ["#f1d9ad", "#e7a3a0", "#f6ece2", "#d8b078", "#f4cdc3", "#c9a0a8"];

  function buildStars() {
    const count = Math.min(190, Math.round((W * H) / 13000));
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.25 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.4,
        drift: (Math.random() - 0.5) * 0.045,
        warm: Math.random() > 0.72,
      });
    }
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
    if (reduceMotion) drawFrame(0, true);
  }

  function drawStars(time, force) {
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      let alpha = 0.45 + 0.55 * Math.abs(Math.sin(s.phase + (time / 1000) * s.speed));
      if (force) alpha = 0.55 + 0.45 * Math.abs(Math.sin(s.phase));
      if (reduceMotion) alpha = 0.6;
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = s.warm ? "#f4d9ae" : "#f6ece2";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (!reduceMotion && !force) {
        s.y += s.drift;
        if (s.y < -2) s.y = H + 2;
        if (s.y > H + 2) s.y = -2;
      }
    }
    ctx.globalAlpha = 1;
  }

  function startPetals() {
    if (petalsStarted || reduceMotion) return;
    petalsStarted = true;
    for (let i = 0; i < 16; i++) {
      petals.push(makePetal(true));
    }
  }

  function makePetal(initial) {
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : -30,
      vy: 0.18 + Math.random() * 0.42,
      sway: 0.4 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      size: 2.5 + Math.random() * 4.5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.012,
      alpha: 0.12 + Math.random() * 0.3,
      color: Math.random() > 0.5 ? "#e7a3a0" : "#d8b078",
      shape: Math.random() > 0.7 ? "circle" : "petal",
    };
  }

  function drawPetals(time) {
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.vy;
      p.x += Math.sin(time / 1500 + p.phase) * p.sway * 0.3;
      p.rot += p.vr;
      if (p.y > H + 30) {
        petals[i] = makePetal(false);
        continue;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function burst(x, y) {
    if (reduceMotion) return;
    const total = 78;
    for (let i = 0; i < total; i++) {
      const angle = (Math.PI * 2 * i) / total + Math.random() * 0.4;
      const force = 2.4 + Math.random() * 5.4;
      burstParticles.push({
        x,
        y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - 1.6,
        size: 2 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.24,
        life: 0,
        max: 90 + Math.random() * 60,
        color: CONFETTI[(Math.random() * CONFETTI.length) | 0],
        heart: Math.random() > 0.82,
      });
    }
  }

  function drawBurst() {
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const p = burstParticles[i];
      p.life++;
      p.vy += 0.055;
      p.vx *= 0.992;
      p.vy *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      const k = 1 - p.life / p.max;
      if (k <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, k * 1.6);
      ctx.fillStyle = p.color;
      if (p.heart) {
        const s = p.size * 0.75;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.5);
        ctx.bezierCurveTo(-s * 1.4, -s * 0.35, -s * 0.35, -s * 1.2, 0, -s * 0.42);
        ctx.bezierCurveTo(s * 0.35, -s * 1.2, s * 1.4, -s * 0.35, 0, s * 0.5);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function drawFrame(time, force) {
    ctx.clearRect(0, 0, W, H);
    drawStars(time, force);
    if (!reduceMotion && !force) {
      if (petalsStarted) drawPetals(time);
      if (burstParticles.length) drawBurst();
    }
  }

  function loop(time) {
    if (document.hidden) {
      rafId = null;
      return;
    }
    drawFrame(time, false);
    lastTime = time;
    rafId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (rafId !== null || reduceMotion) return;
    rafId = requestAnimationFrame(loop);
  }

  resizeCanvas();
  startLoop();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && rafId === null && !reduceMotion) {
      rafId = requestAnimationFrame(loop);
    }
  });
  if (reduceMotion) drawFrame(0, true);

  /* ============================================================
     REVEAL SAAT SCROLL
     ============================================================ */
  let revealObserver = null;

  function initReveals() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => revealObserver.observe(el));
  }

  /* ============================================================
     INTRO: TIUP LILIN
     ============================================================ */
  let blown = false;
  let micStream = null;
  let micCtx = null;
  let micRAF = null;

  function stopMic() {
    if (micRAF) cancelAnimationFrame(micRAF);
    micRAF = null;
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      micStream = null;
    }
    if (micCtx) {
      if (micCtx.state !== "closed" && micCtx.close) micCtx.close().catch(() => {});
      micCtx = null;
    }
    if (btnMic) btnMic.disabled = false;
  }

  function blowOut() {
    if (blown) return;
    blown = true;
    stopMic();

    cake.classList.add("is-blown");
    intro.classList.add("is-blown");
    introHint.textContent = cfg.introHintDone || "Semoga semua permohonanmu terkabul.";
    micNote.textContent = "";

    if (musicBtn && !musicMissing) {
      playMusic();
    }

    const rect = cake.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height * 0.25);

    // getaran kecil kalau perangkat mendukung
    if (navigator.vibrate) {
      try { navigator.vibrate([18, 60, 26]); } catch (e) {}
    }

    window.setTimeout(() => {
      intro.classList.add("is-done");
      body.classList.remove("is-locked");
      body.classList.add("is-revealed");
      site.setAttribute("aria-hidden", "false");
      site.inert = false;
      startPetals();
      initReveals();
      window.scrollTo(0, 0);
    }, 1300);

    window.setTimeout(() => {
      intro.hidden = true;
      const h1 = $("#heroTo");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
    }, 2600);
  }

  function detectBlow(stream) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      micNote.textContent = "Browser ini belum mendukung deteksi mikrofon. Pakai tombol tiup saja ya.";
      stopMic();
      return;
    }

    micCtx = new AudioCtx();
    const source = micCtx.createMediaStreamSource(stream);
    const analyser = micCtx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.4;
    source.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    let strongFrames = 0;
    let startedAt = performance.now();

    function measure() {
      if (!micCtx) return;
      analyser.getByteTimeDomainData(data);

      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      if (rms > 0.14) {
        strongFrames++;
      } else {
        strongFrames = Math.max(0, strongFrames - 1);
      }

      if (strongFrames >= 4) {
        micNote.textContent = "Terdeteksi. Lihat lilinnya.";
        blowOut();
        return;
      }

      if (performance.now() - startedAt > 25000) {
        micNote.textContent = "Belum terdeteksi. Tidak masalah — tekan tombol “Tiup lilinnya”.";
        stopMic();
        return;
      }

      micRAF = requestAnimationFrame(measure);
    }

    measure();
  }

  async function enableMic() {
    if (blown) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      micNote.textContent = "Mikrofon tidak tersedia di browser ini. Pakai tombol tiup saja ya.";
      return;
    }

    btnMic.disabled = true;
    micNote.textContent = "Menunggu izin mikrofon…";

    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      micNote.textContent = "Dekatkan mikrofon, lalu tiup pelan-pelan…";
      detectBlow(micStream);
    } catch (err) {
      btnMic.disabled = false;
      micNote.textContent =
        "Izin mikrofon tidak diberikan. Tidak apa-apa — tekan tombol “Tiup lilinnya”.";
    }
  }

  btnBlow.addEventListener("click", blowOut);
  btnMic.addEventListener("click", enableMic);

  /* ============================================================
     MUSIK
     ============================================================ */
  let fadeTimer = null;
  let musicMissing = false;

  function markMusicMissing() {
    musicMissing = true;
    if (musicBtn) {
      musicBtn.hidden = true;
      musicBtn.classList.remove("is-playing");
    }
  }

  if (cfg.music) {
    audio.src = cfg.music;
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audio.addEventListener("error", markMusicMissing);

    // Kalau file tidak ada, event "error" di atas yang akan menyembunyikan
    // tombol musik. Tidak perlu cek HEAD, supaya tetap jalan saat dibuka
    // langsung lewat file:// sekalipun.
  } else {
    markMusicMissing();
  }

  function fadeVolume(target, done) {
    if (fadeTimer) window.clearInterval(fadeTimer);
    const start = audio.volume;
    const steps = 24;
    let i = 0;
    if (target === start) {
      if (done) done();
      return;
    }
    fadeTimer = window.setInterval(() => {
      i++;
      const k = i / steps;
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * k));
      if (i >= steps) {
        window.clearInterval(fadeTimer);
        fadeTimer = null;
        if (done) done();
      }
    }, 45);
  }

  function setMusicUI(playing) {
    if (!musicBtn) return;
    musicBtn.classList.toggle("is-playing", playing);
    musicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    musicBtn.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
    if (musicTip) musicTip.textContent = playing ? "Jeda musik" : "Putar musik";
  }

  function playMusic() {
    if (!audio.src || musicMissing) return;
    audio
      .play()
      .then(() => {
        setMusicUI(true);
        fadeVolume(typeof cfg.musicVolume === "number" ? cfg.musicVolume : 0.3);
      })
      .catch(() => {
        // Browser bisa memblokir pemutaran otomatis. Coba lagi pada
        // sentuhan/ketukan pertama pengguna.
        setMusicUI(false);
        armMusicRetry();
      });
  }

  let musicRetryArmed = false;

  function armMusicRetry() {
    if (musicRetryArmed) return;
    musicRetryArmed = true;
    const retry = () => {
      musicRetryArmed = false;
      document.removeEventListener("pointerdown", retry);
      document.removeEventListener("keydown", retry);
      if (blown && !musicMissing && audio.paused) playMusic();
    };
    document.addEventListener("pointerdown", retry);
    document.addEventListener("keydown", retry);
  }

  function pauseMusic() {
    fadeVolume(0, () => {
      audio.pause();
    });
    setMusicUI(false);
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (musicMissing) {
        if (musicTip) musicTip.textContent = "Letakkan file musik di assets/audio/";
        return;
      }
      if (audio.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    });
  }

  /* ============================================================
     MODAL SURAT
     ============================================================ */
  let lastFocused = null;
  let closeTimer = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    window.clearTimeout(closeTimer);
    modal.hidden = false;
    body.classList.add("modal-open");
    if (site) site.inert = true;
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      const letter = $(".letter", modal);
      if (letter) letter.scrollTop = 0;
      if (letterClose) letterClose.focus({ preventScroll: true });
    });
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove("is-open");
    body.classList.remove("modal-open");
    closeTimer = window.setTimeout(() => {
      modal.hidden = true;
      if (site) site.inert = false;
      if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
    }, 500);
  }

  if (giftBtn) giftBtn.addEventListener("click", openModal);
  if (letterClose) letterClose.addEventListener("click", closeModal);
  if (modal) {
    modal.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  /* ============================================================
     PROGRES SCROLL
     ============================================================ */
  function updateProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  // hentikan semua audio saat tab ditutup
  window.addEventListener("pagehide", () => {
    stopMic();
    if (audio && !audio.paused) audio.pause();
  });
})();