/**
 * PAWIWAHAN AGENG - JAVANESE ROYAL WEDDING INTERACTION
 * Mempelai: A. Fahmi Aziz & Rofiatul Hasanah
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Recipient Name from URL
  initRecipientName();

  // 2. Countdown Timer
  initCountdown();

  // 3. Audio & Music Player (with Web Audio Gamelan fallback)
  initAudioPlayer();

  // 4. Floating Particles (Gold Dust & Jasmine Petals)
  initParticles();

  // 5. RSVP & Guestbook
  initGuestbook();

  // 6. Navigation Scrollspy
  initScrollspy();
});

/* ==========================================================================
   1. RECIPIENT NAME & LINK GENERATOR
   ========================================================================== */
const DEFAULT_GUEST = 'Tamu Undangan';
const DEFAULT_LOCATION = 'di Tempat';

function initRecipientName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to');
  const locParam = urlParams.get('di');

  const guestName = guestParam ? decodeURIComponent(guestParam).trim() : DEFAULT_GUEST;
  const guestLoc = locParam ? decodeURIComponent(locParam).trim() : DEFAULT_LOCATION;

  setGuestDisplay(guestName, guestLoc);

  // Sync inputs in modal
  const inputName = document.getElementById('modal-input-name');
  const inputLoc = document.getElementById('modal-input-loc');
  if (inputName) inputName.value = guestName === DEFAULT_GUEST ? '' : guestName;
  if (inputLoc) inputLoc.value = guestLoc;
  updateModalPreview();
}

function setGuestDisplay(name, loc) {
  const nameEls = document.querySelectorAll('.guest-name-target');
  const locEls = document.querySelectorAll('.guest-loc-target');

  nameEls.forEach(el => {
    el.textContent = name;
  });

  locEls.forEach(el => {
    el.textContent = loc;
  });
}

function updateModalPreview() {
  const inputName = document.getElementById('modal-input-name');
  const inputLoc = document.getElementById('modal-input-loc');
  const previewName = document.getElementById('modal-preview-name');
  const previewLoc = document.getElementById('modal-preview-loc');

  const nameVal = inputName && inputName.value.trim() ? inputName.value.trim() : DEFAULT_GUEST;
  const locVal = inputLoc && inputLoc.value.trim() ? inputLoc.value.trim() : DEFAULT_LOCATION;

  if (previewName) previewName.textContent = nameVal;
  if (previewLoc) previewLoc.textContent = locVal;
}

function addNamePrefix(prefix) {
  const inputName = document.getElementById('modal-input-name');
  if (!inputName) return;
  const cur = inputName.value.trim();
  if (prefix.startsWith('&')) {
    inputName.value = cur ? `${cur} ${prefix}` : prefix;
  } else {
    inputName.value = cur ? `${prefix} ${cur}` : prefix;
  }
  updateModalPreview();
}

function applyRecipientFromModal() {
  const inputName = document.getElementById('modal-input-name');
  const inputLoc = document.getElementById('modal-input-loc');

  const name = inputName && inputName.value.trim() ? inputName.value.trim() : DEFAULT_GUEST;
  const loc = inputLoc && inputLoc.value.trim() ? inputLoc.value.trim() : DEFAULT_LOCATION;

  setGuestDisplay(name, loc);

  // Update URL without reload
  const newUrl = new URL(window.location.href);
  if (name !== DEFAULT_GUEST) {
    newUrl.searchParams.set('to', name);
  } else {
    newUrl.searchParams.delete('to');
  }

  if (loc && loc !== DEFAULT_LOCATION) {
    newUrl.searchParams.set('di', loc);
  } else {
    newUrl.searchParams.delete('di');
  }

  window.history.replaceState({}, '', newUrl);
  closeRecipientModal();
  showToast(`Nama tamu berhasil diubah menjadi: ${name}`);
}

function generateShareLink() {
  const inputName = document.getElementById('modal-input-name');
  const inputLoc = document.getElementById('modal-input-loc');

  const name = inputName && inputName.value.trim() ? inputName.value.trim() : DEFAULT_GUEST;
  const loc = inputLoc && inputLoc.value.trim() ? inputLoc.value.trim() : DEFAULT_LOCATION;

  const url = new URL(window.location.origin + window.location.pathname);
  if (name && name !== DEFAULT_GUEST) url.searchParams.set('to', name);
  if (loc && loc !== DEFAULT_LOCATION) url.searchParams.set('di', loc);

  return { url: url.toString(), name, loc };
}

function copyInvitationLink() {
  const { url } = generateShareLink();
  navigator.clipboard.writeText(url).then(() => {
    showToast('Tautan undangan berhasil disalin!');
  }).catch(() => {
    fallbackCopy(url, 'Tautan undangan');
  });
}

function getWhatsAppText() {
  const { url, name, loc } = generateShareLink();
  return `*Assalamu'alaikum Warahmatullahi Wabarakatuh*
_Nyuwun lumunturing sih wilasa dalem Gusti Kang Maha Wicaksana_

Kepada Yth.
*${name}*
${loc}

Dengan segala kerendahan hati dan rasa syukur ke hadirat Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara Pawiwahan Ageng (Pernikahan) kami:

👰🤵 *A. Fahmi Aziz & Rofiatul Hasanah*

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.

Untuk informasi lengkap mengenai detail waktu, lokasi, dan serangkaian acara, silakan kunjungi tautan undangan digital berikut:
${url}

Atas kehadiran dan doa restu panjenengan sami, kami haturkan matur nuwun ingkang tanpa pepindhan.

*Wassalamu'alaikum Warahmatullahi Wabarakatuh*
Kami yang berbahagia,
*Fahmi & Rofiatul*`;
}

function copyWhatsAppMessage() {
  const text = getWhatsAppText();
  navigator.clipboard.writeText(text).then(() => {
    showToast('Teks undangan WhatsApp berhasil disalin!');
  }).catch(() => {
    fallbackCopy(text, 'Teks undangan WhatsApp');
  });
}

function shareViaWhatsApp() {
  const text = getWhatsAppText();
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

function openRecipientModal() {
  const modal = document.getElementById('recipient-modal');
  if (modal) {
    modal.classList.add('active');
    updateModalPreview();
  }
}

function closeRecipientModal() {
  const modal = document.getElementById('recipient-modal');
  if (modal) modal.classList.remove('active');
}

/* ==========================================================================
   2. COVER / ENVELOPE OPENING
   ========================================================================== */
function openInvitation() {
  const cover = document.getElementById('invitation-cover');
  if (cover) {
    cover.classList.add('opened');
  }

  // Play audio on user interaction
  playAudio();

  // Scroll to greeting
  setTimeout(() => {
    const greetingSec = document.getElementById('greeting-section');
    if (greetingSec) {
      greetingSec.scrollIntoView({ behavior: 'smooth' });
    }
  }, 300);
}

/* ==========================================================================
   3. BACKGROUND AUDIO & AMBIENCE (HTML5 + WEB AUDIO SYNTH GAMELAN FALLBACK)
   ========================================================================== */
let isAudioPlaying = false;
let audioElement = null;
let webAudioCtx = null;
let gamelanTimer = null;

function initAudioPlayer() {
  audioElement = document.getElementById('wedding-audio');
  const toggleBtn = document.getElementById('audio-toggle-btn');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }
}

function playAudio() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

  if (audioElement && audioElement.src) {
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isAudioPlaying = true;
        if (toggleBtn) toggleBtn.classList.add('playing');
        if (icon) icon.className = 'fas fa-compact-disc';
      }).catch(err => {
        console.warn('HTML5 audio play blocked or failed, falling back to Web Audio Gamelan:', err);
        startWebAudioGamelan();
      });
      return;
    }
  }

  // Fallback to soothing synthesized gamelan
  startWebAudioGamelan();
}

function pauseAudio() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

  if (audioElement) {
    audioElement.pause();
  }
  stopWebAudioGamelan();

  isAudioPlaying = false;
  if (toggleBtn) toggleBtn.classList.remove('playing');
  if (icon) icon.className = 'fas fa-volume-mute';
}

/**
 * Authentic pentatonic Javanese Pelog / Slendro ambient generator
 * Provides a serene, royal gamelan atmosphere even offline!
 */
function startWebAudioGamelan() {
  if (isAudioPlaying) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!webAudioCtx) {
      webAudioCtx = new AudioContext();
    }
    if (webAudioCtx.state === 'suspended') {
      webAudioCtx.resume();
    }

    isAudioPlaying = true;
    const toggleBtn = document.getElementById('audio-toggle-btn');
    if (toggleBtn) toggleBtn.classList.add('playing');
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;
    if (icon) icon.className = 'fas fa-compact-disc';

    // Javanese Pelog scale frequencies (Hz): Penunggul, Gulu, Dada, Pelog, Lima, Nem, Barang
    const pelogScale = [220, 247.5, 275, 330, 366.6, 440, 495, 550, 660];
    let noteIndex = 0;

    const playChime = () => {
      if (!isAudioPlaying || !webAudioCtx) return;

      const freq = pelogScale[Math.floor(Math.random() * pelogScale.length)];
      const osc = webAudioCtx.createOscillator();
      const gain = webAudioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, webAudioCtx.currentTime);

      // Bell-like envelope
      const now = webAudioCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(webAudioCtx.destination);

      osc.start(now);
      osc.stop(now + 3.3);

      // Occasional deep gong (Kenong / Kempul)
      if (Math.random() > 0.6) {
        const gongOsc = webAudioCtx.createOscillator();
        const gongGain = webAudioCtx.createGain();
        gongOsc.type = 'triangle';
        gongOsc.frequency.setValueAtTime(110, now + 0.2); // Low A
        gongGain.gain.setValueAtTime(0.001, now + 0.2);
        gongGain.gain.exponentialRampToValueAtTime(0.12, now + 0.3);
        gongGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        gongOsc.connect(gongGain);
        gongGain.connect(webAudioCtx.destination);
        gongOsc.start(now + 0.2);
        gongOsc.stop(now + 4.6);
      }

      const nextDelay = 1800 + Math.random() * 2200;
      gamelanTimer = setTimeout(playChime, nextDelay);
    };

    playChime();
  } catch (e) {
    console.error('Web Audio error:', e);
  }
}

function stopWebAudioGamelan() {
  if (gamelanTimer) {
    clearTimeout(gamelanTimer);
    gamelanTimer = null;
  }
}

/* ==========================================================================
   4. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  // Target: 14 November 2026, 08:00 WIB (UTC+7)
  const targetDate = new Date('2026-11-14T08:00:00+07:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n);

    const dayEl = document.getElementById('days');
    const hourEl = document.getElementById('hours');
    const minEl = document.getElementById('minutes');
    const secEl = document.getElementById('seconds');

    if (dayEl) dayEl.innerText = pad(days);
    if (hourEl) hourEl.innerText = pad(hours);
    if (minEl) minEl.innerText = pad(minutes);
    if (secEl) secEl.innerText = pad(seconds);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   5. FLOATING GOLDEN DUST & JASMINE PETALS (CANVAS)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const numParticles = 45;

  for (let i = 0; i < numParticles; i++) {
    const isPetal = i % 4 === 0;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: isPetal ? Math.random() * 5 + 3 : Math.random() * 2.2 + 0.8,
      speedX: isPetal ? Math.sin(Math.random()) * 0.8 : (Math.random() - 0.5) * 0.4,
      speedY: isPetal ? Math.random() * 0.9 + 0.4 : -(Math.random() * 0.5 + 0.2), // petals fall, sparkles rise
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.02 + 0.01,
      isPetal: isPetal,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += Math.sin(Date.now() * p.pulse) * 0.008;

      if (p.isPetal) {
        p.rotation += p.rotSpeed;
        p.speedX += Math.sin(Date.now() * 0.001) * 0.01;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      } else {
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
      }

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.isPetal) {
        // Melati petal shape
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 245, 220, ${Math.max(0.1, Math.min(0.7, p.opacity))})`;
        ctx.ellipse(0, 0, p.size, p.size * 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Inner delicate vein
        ctx.strokeStyle = `rgba(223, 186, 84, ${Math.max(0.05, p.opacity * 0.4)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else {
        // Golden glowing spark
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
        grad.addColorStop(0, `rgba(250, 225, 156, ${p.opacity})`);
        grad.addColorStop(0.5, `rgba(223, 186, 84, ${p.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(223, 186, 84, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   6. RSVP & BUKU TAMU (LOCALSTORAGE WITH PRELOADED BLESSINGS)
   ========================================================================== */
const DEFAULT_WISHES = [
  {
    name: 'Bpk. Ir. H. Bambang Widjojanto & Keluarga',
    status: 'hadir',
    statusText: 'Hadir',
    text: 'Ndherek mangayubagya kagem Mas Fahmi kaliyan Mbak Rofiatul. Mugi tansah pinaringan sih wilasa dalem Gusti Kang Maha Agung, dados kulawarga ingkang sakinah, mawaddah, warahmah, runtut atut dumugi puputing yuswa. Aamiin ya Rabbal Alamin.',
    time: '2 jam yang lalu'
  },
  {
    name: 'Keluarga Besar dr. Raden Mas Danang & Rekan',
    status: 'hadir',
    statusText: 'Hadir',
    text: 'Sugeng mangayubagya pawiwahan ageng mas Fahmi & mbak Rofi. Selamat menempuh lembaran hidup baru, semoga senantiasa rukun, harmonis, penuh berkah dan kebahagiaan!',
    time: '5 jam yang lalu'
  },
  {
    name: 'Siti Rahmawati, S.Pd.',
    status: 'hadir',
    statusText: 'Hadir',
    text: 'Alhamdulillah, selamat ya mbak Rofiatul dan mas Fahmi! Semoga acaranya dilancarkan dari awal hingga akhir, dan pernikahannya selalu dinaungi keberkahan. Sakinah mawaddah warahmah!',
    time: '1 hari yang lalu'
  },
  {
    name: 'Alumni Teknik Informatika 2018',
    status: 'hadir',
    statusText: 'Hadir',
    text: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fii khoir. Selamat menempuh hidup baru sahabatku Fahmi & Rofiatul!',
    time: '1 hari yang lalu'
  }
];

function initGuestbook() {
  const form = document.getElementById('rsvp-form');
  if (form) {
    form.addEventListener('submit', handleRsvpSubmit);
  }

  renderWishes();
}

function getStoredWishes() {
  try {
    const raw = localStorage.getItem('pawiwahan_wishes');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load wishes from localStorage:', e);
  }
  return DEFAULT_WISHES;
}

function saveWishes(wishes) {
  try {
    localStorage.setItem('pawiwahan_wishes', JSON.stringify(wishes));
  } catch (e) {
    console.error('Failed to save wishes:', e);
  }
}

function renderWishes() {
  const container = document.getElementById('wishes-list-container');
  const countEl = document.getElementById('wishes-count-badge');
  if (!container) return;

  const wishes = getStoredWishes();
  if (countEl) countEl.textContent = `${wishes.length} Doa & Ucapan`;

  container.innerHTML = '';
  wishes.forEach(item => {
    const wishEl = document.createElement('div');
    wishEl.className = 'wish-item';

    let badgeClass = 'status-hadir';
    if (item.status === 'tidak-hadir') badgeClass = 'status-tidak-hadir';
    if (item.status === 'ragu') badgeClass = 'status-ragu';

    wishEl.innerHTML = `
      <div class="wish-author">
        <span class="wish-name">${escapeHtml(item.name)}</span>
        <span class="wish-status ${badgeClass}"><i class="fas fa-check-circle"></i> ${escapeHtml(item.statusText || 'Hadir')}</span>
      </div>
      <p class="wish-text">${escapeHtml(item.text)}</p>
      <span class="wish-time">${escapeHtml(item.time || 'Baru saja')}</span>
    `;
    container.appendChild(wishEl);
  });
}

function handleRsvpSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('rsvp-name');
  const statusSelect = document.getElementById('rsvp-status');
  const textInput = document.getElementById('rsvp-text');

  if (!nameInput || !statusSelect || !textInput) return;

  const name = nameInput.value.trim();
  const status = statusSelect.value;
  const statusText = statusSelect.options[statusSelect.selectedIndex].text;
  const text = textInput.value.trim();

  if (!name || !text) {
    showToast('Mohon lengkapi nama dan doa restu Anda.');
    return;
  }

  const newWish = {
    name: name,
    status: status,
    statusText: statusText,
    text: text,
    time: 'Baru saja'
  };

  const wishes = getStoredWishes();
  wishes.unshift(newWish);
  saveWishes(wishes);
  renderWishes();

  // Reset form
  nameInput.value = '';
  textInput.value = '';

  showToast('Matur nuwun sanget, konfirmasi & doa panjenengan sampun katampi!');
}

/* ==========================================================================
   7. UTILITY: COPY TO CLIPBOARD & TOAST
   ========================================================================== */
function copyAccountNumber(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Nomor rekening ${label} berhasil disalin!`);
  }).catch(() => {
    fallbackCopy(text, label);
  });
}

function copyAddress(address) {
  navigator.clipboard.writeText(address).then(() => {
    showToast('Alamat kirim kado berhasil disalin!');
  }).catch(() => {
    fallbackCopy(address, 'Alamat');
  });
}

function fallbackCopy(text, label) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`${label} berhasil disalin!`);
  } catch (err) {
    showToast('Gagal menyalin, silakan salin secara manual.');
  }
  document.body.removeChild(textArea);
}

let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   8. LIGHTBOX FOR GALLERY
   ========================================================================== */
function openLightbox(src) {
  const lightbox = document.getElementById('gallery-lightbox');
  const img = document.getElementById('lightbox-img');
  if (lightbox && img) {
    img.src = src;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

/* ==========================================================================
   9. SCROLLSPY & NAVIGATION
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href && href === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}
