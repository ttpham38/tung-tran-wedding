'use strict';

// ══════════════════════════════════════════
// NHẠC NỀN
// ══════════════════════════════════════════
(function initMusic() {
    const audio = document.getElementById('bgAudio');
    const btn   = document.getElementById('musicBtn');
    if (!audio || !btn) return;

    let playing = false;
    const EVENTS = ['click', 'scroll', 'touchstart', 'keydown', 'pointerdown'];

    function setPlaying(state) {
        playing = state;
        btn.classList.toggle('playing', state);
        // Bỏ trạng thái "chờ tương tác" khi đã phát được
        btn.classList.toggle('waiting', !state);
    }

    function tryPlay() {
        audio.volume = 0.7;
        audio.play()
            .then(() => setPlaying(true))
            .catch(() => {
                // Trình duyệt chặn → chờ tương tác người dùng
                setWaitingForInteraction();
            });
    }

    function setWaitingForInteraction() {
        btn.classList.add('waiting');
        // Hiện tooltip nhỏ gợi ý bấm để bật nhạc
        btn.setAttribute('title', 'Bấm để bật nhạc 🎵');

        function onFirstInteraction() {
            EVENTS.forEach(e => window.removeEventListener(e, onFirstInteraction));
            if (!playing) tryPlay();
        }

        EVENTS.forEach(e => window.addEventListener(e, onFirstInteraction, { once: true }));
    }

    function togglePlay() {
        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            tryPlay();
        }
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // không trigger onFirstInteraction
        togglePlay();
    });

    // Lớp 1: thử autoplay ngay khi DOM sẵn sàng (hoạt động nếu user đã từng vào site)
    tryPlay();
})();

// ══════════════════════════════════════════
// ĐẾM NGƯỢC
// ══════════════════════════════════════════
(function initCountdown() {
    const target = new Date('2026-09-20T11:00:00+07:00').getTime();

    const els = {
        days:  document.getElementById('cd-days'),
        hours: document.getElementById('cd-hours'),
        mins:  document.getElementById('cd-mins'),
        secs:  document.getElementById('cd-secs'),
    };

    if (!els.days) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function update() {
        const now  = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            Object.values(els).forEach(el => { el.textContent = '00'; });
            return;
        }

        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000) / 60000);
        const secs  = Math.floor((diff % 60000) / 1000);

        els.days.textContent  = pad(days);
        els.hours.textContent = pad(hours);
        els.mins.textContent  = pad(mins);
        els.secs.textContent  = pad(secs);
    }

    update();
    setInterval(update, 1000);
})();

// ══════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════
(function initScrollReveal() {
    const classes = ['.reveal-up', '.reveal-left', '.reveal-right', '.reveal-scale'];
    const selector = classes.join(', ');
    const targets = document.querySelectorAll(selector);

    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;

            // Stagger delay cho các phần tử liền kề
            const siblings = Array.from(entry.target.parentElement?.children || []);
            const idx = siblings.indexOf(entry.target);
            const delay = idx * 80;

            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, delay);

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
})();
