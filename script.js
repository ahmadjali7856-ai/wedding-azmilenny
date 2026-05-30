/* ══════════════════════════════════════════
   SCRIPT.JS — Undangan Digital Azmi & Lenny
   ══════════════════════════════════════════ */

// ── Ambil nama tamu dari URL parameter ──
function getGuestName() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    return name ? decodeURIComponent(name.replace(/\+/g, ' ')) : 'Tamu Undangan';
}

// ── Set nama tamu di cover ──
document.addEventListener('DOMContentLoaded', function () {
    const guestEl = document.getElementById('guest-name');
    if (guestEl) {
        guestEl.textContent = getGuestName();
    }

    initScrollReveal();
    initCountdown();
    loadWishes();
    initLightbox();
});

// ══════════════════════════════════════════
// BUKA UNDANGAN
// ══════════════════════════════════════════
function openInvitation() {
    const cover = document.getElementById('cover');
    const main = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-toggle');
    const scrollBtn = document.getElementById('scroll-toggle');

    cover.classList.add('hidden');
    main.classList.add('visible');
    musicBtn.classList.add('visible');
    if (scrollBtn) scrollBtn.classList.add('visible');

    // Mulai musik
    toggleMusic(true);

    // Mulai kelopak bunga
    startPetals();

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mulai scroll otomatis lambat setelah delay 2.5 detik
    setTimeout(startAutoScroll, 2500);
}

// ══════════════════════════════════════════
// MUSIK LATAR
// ══════════════════════════════════════════
let audioCtx = null;
let isPlaying = false;

function createAmbientTone() {
    // Membuat nada ambient sederhana agar halaman tetap memiliki audio
    // Di production, ganti dengan file audio .mp3 asli
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function toggleMusic(forcePlay) {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');

    if (!audio) return;

    if (forcePlay === true || !isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            btn.classList.add('playing');
            btn.innerHTML = '🎵';
        }).catch(() => {
            // Autoplay blocked, will try on next interaction
            isPlaying = false;
        });
    } else {
        audio.pause();
        isPlaying = false;
        btn.classList.remove('playing');
        btn.innerHTML = '🔇';
    }
}

// ── Pause musik saat tab di background, play lagi saat kembali ──
document.addEventListener('visibilitychange', function () {
    const audio = document.getElementById('bg-music');
    if (!audio) return;

    if (document.hidden) {
        // Tab masuk ke background → pause musik
        if (isPlaying) {
            audio.pause();
        }
    } else {
        // Tab kembali aktif → lanjutkan musik jika sebelumnya sedang playing
        if (isPlaying) {
            audio.play().catch(() => {});
        }
    }
});

// ══════════════════════════════════════════
// COUNTDOWN TIMER
// ══════════════════════════════════════════
function initCountdown() {
    const targetDate = new Date('2026-07-22T08:00:00+08:00').getTime();

    function update() {
        const now = Date.now();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.querySelectorAll('.countdown-number').forEach(el => el.textContent = '0');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-mins');
        const secsEl = document.getElementById('cd-secs');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// ══════════════════════════════════════════
// SCROLL REVEAL (IntersectionObserver)
// ══════════════════════════════════════════
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, i) => {
        el.style.transitionDelay = `${i % 4 * 0.1}s`;
        observer.observe(el);
    });
}

// ══════════════════════════════════════════
// FALLING PETALS
// ══════════════════════════════════════════
function startPetals() {
    const petals = ['🌸', '🩷', '✿', '❀', '🌺', '💮'];
    const container = document.body;

    function createPetal() {
        const el = document.createElement('div');
        el.className = 'petal';
        el.textContent = petals[Math.floor(Math.random() * petals.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (Math.random() * 18 + 12) + 'px';
        el.style.animationDuration = (Math.random() * 6 + 6) + 's';
        el.style.animationDelay = (Math.random() * 2) + 's';
        container.appendChild(el);

        setTimeout(() => el.remove(), 14000);
    }

    // Buat kelopak berkala
    setInterval(createPetal, 800);

    // Buat awal beberapa kelopak
    for (let i = 0; i < 6; i++) {
        setTimeout(createPetal, i * 300);
    }
}

// ══════════════════════════════════════════
// LIGHTBOX GALLERY
// ══════════════════════════════════════════
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });

    if (lightbox) {
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }
}

// ══════════════════════════════════════════
// UCAPAN / RSVP (localStorage & Discord Webhook)
// ══════════════════════════════════════════

// GANTI URL DI BAWAH INI DENGAN DISCORD WEBHOOK URL KAMU
const DISCORD_WEBHOOK_URL = "https://ptb.discord.com/api/webhooks/1507732399163703437/Rl80Bdwd52nu4kUDhbFxaQDZrib_F9h-OFkpmCC9Sn4cTWvcqI2mBNPVU4sbFDFojRYl";

function submitWish(event) {
    event.preventDefault();

    const nameEl = document.getElementById('wish-name');
    const attendEl = document.getElementById('wish-attend');
    const msgEl = document.getElementById('wish-msg');

    const name = nameEl.value.trim();
    const attendance = attendEl.value;
    const message = msgEl.value.trim();

    if (!name || !message) {
        alert('Mohon isi nama dan ucapan Anda.');
        return;
    }

    const wish = {
        name,
        attendance,
        message,
        time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    };

    // 1. Kirim ke Discord Webhook
    sendToDiscord(wish);

    // 2. Simpan ke LocalStorage dan update tampilan
    let wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
    wishes.push(wish);
    localStorage.setItem('weddingWishes', JSON.stringify(wishes));
    loadWishes();

    // 3. Tampilkan notifikasi sukses di website
    alert('Terima kasih! Pesan dan konfirmasi kehadiran Anda telah berhasil dikirim.');

    // 4. Reset form
    nameEl.value = '';
    msgEl.value = '';
    attendEl.value = 'hadir';
}

function sendToDiscord(wish) {
    if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes("TARUH_URL_KAMU_DISINI")) {
        console.log("Discord Webhook belum disetting.");
        return;
    }

    let color = 3066993; // Hijau (Hadir)
    let statusText = "✅ Hadir";
    
    if (wish.attendance === "tidak") {
        color = 15158332; // Merah (Tidak Hadir)
        statusText = "❌ Tidak Hadir";
    } else if (wish.attendance === "ragu") {
        color = 16753920; // Kuning (Ragu)
        statusText = "🤔 Masih Ragu";
    }

    const payload = {
        username: "Buku Tamu Pernikahan",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/3656/3656853.png", // Icon Amplop/Surat
        embeds: [{
            title: "💌 Ucapan Baru Masuk!",
            color: color,
            fields: [
                { name: "👤 Nama Tamu", value: wish.name, inline: true },
                { name: "📋 Status", value: statusText, inline: true },
                { name: "💬 Ucapan & Doa", value: `"${wish.message}"` }
            ],
            footer: { text: `Dikirim pada: ${wish.time}` }
        }]
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(err => console.error("Gagal mengirim ke Discord:", err));
}

function loadWishes() {
    const container = document.getElementById('wish-list-container');
    if (!container) return;
    
    const wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
    if (wishes.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; font-style:italic;">Belum ada ucapan. Jadilah yang pertama memberikan ucapan!</p>';
        return;
    }

    container.innerHTML = wishes.reverse().map(wish => {
        let badgeColor = wish.attendance === 'hadir' ? '#28a745' : wish.attendance === 'tidak' ? '#dc3545' : '#ffc107';
        let badgeText = wish.attendance === 'hadir' ? 'Hadir' : wish.attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu';
        
        return `
            <div style="background: rgba(255,255,255,0.8); backdrop-filter: blur(5px); padding: 15px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-bottom: 15px; border-left: 5px solid var(--pink-dark);">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                    <h4 style="color: var(--denim-dark); margin: 0; font-size: 1.1rem;">${escapeHtml(wish.name)}</h4>
                    <span style="font-size: 0.75rem; background: ${badgeColor}; color: white; padding: 3px 8px; border-radius: 10px;">${badgeText}</span>
                </div>
                <p style="font-size: 0.8rem; color: #888; margin-bottom: 8px; border-bottom: 1px dashed #ddd; padding-bottom: 5px;">${wish.time}</p>
                <p style="font-size: 0.95rem; color: #444; line-height: 1.5; font-style: italic;">"${escapeHtml(wish.message)}"</p>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ══════════════════════════════════════════
// AUTO SCROLL SLOW SYSTEM
// ══════════════════════════════════════════
let autoScrollActive = false;
const autoScrollSpeed = 0.4; // pixel per frame (sekitar 24 pixel per detik pada 60fps) - sangat lambat dan nyaman untuk membaca
let animationFrameId = null;

function startAutoScroll() {
    if (autoScrollActive) return;
    autoScrollActive = true;
    updateAutoScrollButton();
    scrollLoop();
}

function pauseAutoScroll() {
    if (!autoScrollActive) return;
    autoScrollActive = false;
    updateAutoScrollButton();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function toggleAutoScroll() {
    if (autoScrollActive) {
        pauseAutoScroll();
    } else {
        startAutoScroll();
    }
}

function scrollLoop() {
    if (!autoScrollActive) return;

    window.scrollBy(0, autoScrollSpeed);

    // Hentikan jika sudah mencapai ujung bawah halaman
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2) {
        pauseAutoScroll();
        return;
    }

    animationFrameId = requestAnimationFrame(scrollLoop);
}

function updateAutoScrollButton() {
    const btn = document.getElementById('scroll-toggle');
    if (!btn) return;
    if (autoScrollActive) {
        btn.classList.add('scrolling');
        btn.innerHTML = '⏸️ Pause';
    } else {
        btn.classList.remove('scrolling');
        btn.innerHTML = '▶️ Scroll';
    }
}

// Deteksi interaksi manual untuk menghentikan auto-scroll agar tidak bertabrakan dengan gestur user
function handleManualInteraction() {
    if (autoScrollActive) {
        pauseAutoScroll();
    }
}

window.addEventListener('wheel', handleManualInteraction, { passive: true });
window.addEventListener('touchmove', handleManualInteraction, { passive: true });
window.addEventListener('mousedown', handleManualInteraction, { passive: true });

// ══════════════════════════════════════════
// COPY TO CLIPBOARD (Amplop Digital)
// ══════════════════════════════════════════
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Tersalin!';
        btn.style.background = 'linear-gradient(135deg, #28a745, #218838)';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'linear-gradient(135deg, #008cff, #0066cc)';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Nomor berhasil disalin: ' + text);
    });
}
