/**
 * js/games.js
 * Modul Pembelajaran Interaktif, Eksplorasi, Pasangkan Rakaat, Susun Gerakan Salat (Drag & Drop), & Kuis
 */

const GamesMaster = {
  // ================= 1. EKSPLORASI 5 WAKTU SALAT =================
  prayers: [
    {
      id: 'subuh',
      name: 'Subuh',
      icon: '🌄',
      rakaat: 2,
      time: 'Saat fajar terbit di pagi hari',
      desc: 'Salat Subuh dikerjakan saat fajar merekah di ufuk timur, berjumlah 2 rakaat.',
      img: 'assets/images/visual-salat-subuh.jpg',
      voice: 'Salat Subuh. Dikerjakan saat terbit fajar di pagi hari, berjumlah dua rakaat.'
    },
    {
      id: 'zuhur',
      name: 'Zuhur',
      icon: '☀️',
      rakaat: 4,
      time: 'Saat siang hari matahari tergelincir',
      desc: 'Salat Zuhur dikerjakan pada siang hari, berjumlah 4 rakaat.',
      img: 'assets/images/visual-salat-zuhur.jpg',
      voice: 'Salat Zuhur. Dikerjakan pada siang hari, berjumlah empat rakaat.'
    },
    {
      id: 'asar',
      name: 'Asar',
      icon: '🌤️',
      rakaat: 4,
      time: 'Saat sore hari menjelang senja',
      desc: 'Salat Asar dikerjakan pada sore hari yang sejuk, berjumlah 4 rakaat.',
      img: 'assets/images/visual-salat-asar.jpg',
      voice: 'Salat Asar. Dikerjakan pada sore hari, berjumlah empat rakaat.'
    },
    {
      id: 'magrib',
      name: 'Magrib',
      icon: '🌇',
      rakaat: 3,
      time: 'Saat matahari terbenam di ufuk barat',
      desc: 'Salat Magrib dikerjakan ketika matahari terbenam, berjumlah 3 rakaat.',
      img: 'assets/images/visual-salat-magrib.jpg',
      voice: 'Salat Magrib. Dikerjakan saat matahari terbenam, berjumlah tiga rakaat.'
    },
    {
      id: 'isya',
      name: 'Isya',
      icon: '🌙',
      rakaat: 4,
      time: 'Saat malam hari langit bertabur bintang',
      desc: 'Salat Isya dikerjakan pada waktu malam hari, berjumlah 4 rakaat.',
      img: 'assets/images/visual-salat-isya.jpg',
      voice: 'Salat Isya. Dikerjakan pada waktu malam hari, berjumlah empat rakaat.'
    }
  ],
  currentSelectedPrayer: 0,

  initEksplorasi() {
    const listContainer = document.getElementById('salat-cards-list');
    const displayImg = document.getElementById('eksplorasi-img');
    const title = document.getElementById('eksplorasi-title');
    const rakaat = document.getElementById('eksplorasi-rakaat');
    const time = document.getElementById('eksplorasi-time');

    listContainer.innerHTML = '';
    this.prayers.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = `p-3 rounded-2xl flex items-center gap-3 transition-all text-left font-bold border-2 ${
        idx === 0 ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102' : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
      }`;
      btn.innerHTML = `<span class="text-2xl">${p.icon}</span> <span>Salat ${p.name}</span>`;
      btn.onclick = () => {
        AudioMaster.playPop();
        this.currentSelectedPrayer = idx;
        Array.from(listContainer.children).forEach(c => {
          c.className = 'p-3 rounded-2xl flex items-center gap-3 transition-all text-left font-bold border-2 bg-white text-slate-700 border-slate-200 hover:bg-sky-50';
        });
        btn.className = 'p-3 rounded-2xl flex items-center gap-3 transition-all text-left font-bold border-2 bg-sky-500 text-white border-sky-600 shadow-md scale-102';

        displayImg.src = p.img;
        title.textContent = `Salat ${p.name}`;
        rakaat.textContent = `${p.rakaat} Rakaat`;
        time.textContent = p.time;

        AudioMaster.playVO(`prayer-${p.id}`);
      };
      listContainer.appendChild(btn);
    });

    displayImg.src = this.prayers[0].img;
    title.textContent = `Salat ${this.prayers[0].name}`;
    rakaat.textContent = `${this.prayers[0].rakaat} Rakaat`;
    time.textContent = this.prayers[0].time;
    this.currentSelectedPrayer = 0;
  },

  speakSelectedPrayer() {
    const p = this.prayers[this.currentSelectedPrayer];
    if (p) {
      AudioMaster.playVO(`prayer-${p.id}`);
    }
  },

  // ================= 2. GAME PASANGKAN RAKAAT =================
  pairingState: {
    selectedPrayer: null,
    matchedCount: 0
  },

  initGamePairing() {
    this.pairingState.selectedPrayer = null;
    this.pairingState.matchedCount = 0;
    const prayerContainer = document.getElementById('pairing-prayers');
    const feedbackBox = document.getElementById('pairing-feedback');
    feedbackBox.textContent = 'Pilih satu nama salat di kiri, lalu ketuk jumlah rakaatnya di kanan!';
    feedbackBox.className = 'text-center font-bold text-slate-600 text-sm mt-3';

    prayerContainer.innerHTML = '';
    this.prayers.forEach(p => {
      const btn = document.createElement('button');
      btn.id = `pair-p-${p.id}`;
      btn.className = 'btn-3d w-full py-3 px-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl flex items-center justify-between text-base font-bold shadow-sm hover:border-sky-400';
      btn.innerHTML = `<span>${p.icon} Salat ${p.name}</span> <span class="status-indicator text-xs text-slate-400 font-normal">Pilih</span>`;
      btn.onclick = () => {
        AudioMaster.playPop();
        prayerContainer.querySelectorAll('button').forEach(b => {
          if (!b.dataset.matched) b.classList.remove('ring-4', 'ring-sky-400', 'bg-sky-50');
        });
        btn.classList.add('ring-4', 'ring-sky-400', 'bg-sky-50');
        this.pairingState.selectedPrayer = p;
        feedbackBox.textContent = `Sekarang, berapa jumlah rakaat Salat ${p.name}?`;
      };
      prayerContainer.appendChild(btn);
    });
  },

  checkPairing(rakaatChosen, targetBtn) {
    const feedbackBox = document.getElementById('pairing-feedback');
    if (!this.pairingState.selectedPrayer) {
      AudioMaster.playGentleBoing();
      feedbackBox.textContent = 'Pilih dulu nama salat di sebelah kiri ya, teman-teman!';
      AudioMaster.playVO('pairing-select-first');
      return;
    }

    const curr = this.pairingState.selectedPrayer;
    const prayerBtn = document.getElementById(`pair-p-${curr.id}`);

    if (curr.rakaat === rakaatChosen) {
      AudioMaster.playChime();
      prayerBtn.dataset.matched = 'true';
      prayerBtn.className = 'btn-3d w-full py-3 px-4 bg-emerald-100 text-emerald-800 border-2 border-emerald-400 rounded-2xl flex items-center justify-between text-base font-bold shadow-sm opacity-90 cursor-default';
      prayerBtn.innerHTML = `<span>${curr.icon} Salat ${curr.name}</span> <span class="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">✓ ${curr.rakaat} Rakaat</span>`;
      prayerBtn.onclick = null;

      this.pairingState.matchedCount++;
      this.pairingState.selectedPrayer = null;

      if (this.pairingState.matchedCount >= 5) {
        feedbackBox.textContent = '🎉 Luar biasa! Kamu berhasil memasangkan semua rakaat dengan benar!';
        AudioMaster.playVO('pairing-all-correct');
      } else {
        feedbackBox.textContent = `Hebat! Salat ${curr.name} memang ${curr.rakaat} rakaat! Ayo lanjut!`;
        AudioMaster.playVO(`pairing-${curr.id}`);
      }
    } else {
      AudioMaster.playGentleBoing();
      targetBtn.classList.add('anim-shake');
      setTimeout(() => targetBtn.classList.remove('anim-shake'), 400);
      feedbackBox.textContent = `Kurang tepat, teman-teman. Ayo coba lagi hitung rakaat Salat ${curr.name}!`;
      AudioMaster.playVO('pairing-wrong-generic');
    }
  },

  // ================= 3. SUSUN GERAKAN SALAT (DRAG & DROP 10 GERAKAN) =================
  allPostures: [
    { id: 1, name: 'Berdiri Tegak', img: 'assets/images/gerakan-berdiri-tegak.jpg', correctOrder: 1 },
    { id: 2, name: 'Takbiratul Ihram', img: 'assets/images/gerakan-takbir.jpg', correctOrder: 2 },
    { id: 3, name: 'Bersedekap', img: 'assets/images/gerakan-bersedekap.jpg', correctOrder: 3 },
    { id: 4, name: 'Rukuk', img: 'assets/images/gerakan-rukuk.jpg', correctOrder: 4 },
    { id: 5, name: 'Iktidal', img: 'assets/images/gerakan-itidal.jpg', correctOrder: 5 },
    { id: 6, name: 'Sujud', img: 'assets/images/gerakan-sujud.jpg', correctOrder: 6 },
    { id: 7, name: 'Duduk antara Dua Sujud', img: 'assets/images/gerakan-tahiyat.jpg', correctOrder: 7 },
    { id: 8, name: 'Sujud Kedua', img: 'assets/images/gerakan-sujud.jpg', correctOrder: 8 },
    { id: 9, name: 'Duduk Tasyahud', img: 'assets/images/gerakan-tahiyat.jpg', correctOrder: 9 },
    { id: 10, name: 'Salam', img: 'assets/images/gerakan-salam.jpg', correctOrder: 10 }
  ],
  draggedCardId: null,
  selectedPoolCard: null,
  correctlyPlacedCount: 0,

  initGameDragDrop() {
    this.draggedCardId = null;
    this.selectedPoolCard = null;
    this.correctlyPlacedCount = 0;

    const poolContainer = document.getElementById('drag-source-pool');
    const slotsContainer = document.getElementById('drop-target-slots');
    const feedbackBox = document.getElementById('drag-drop-feedback');

    feedbackBox.textContent = 'Tarik (Drag) kartu gerakan di atas, lalu jatuhkan (Drop) ke kotak nomor urutan yang benar!';
    feedbackBox.className = 'text-center font-bold text-emerald-900 text-xs md:text-sm';

    // 1. Buat 8 Kotak Target Drop (Numbered Slots 1 - 8)
    slotsContainer.innerHTML = '';
    this.allPostures.forEach(pos => {
      const slot = document.createElement('div');
      slot.id = `drop-slot-${pos.correctOrder}`;
      slot.dataset.slotOrder = pos.correctOrder;
      slot.className = 'drop-slot card-3d p-2 flex flex-col items-center justify-center bg-white/90 border-2 border-dashed border-emerald-300 rounded-2xl min-h-[110px] md:min-h-[125px] transition-all relative overflow-hidden';
      slot.innerHTML = `
        <div class="slot-placeholder flex flex-col items-center pointer-events-none text-center">
          <span class="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center mb-1 shadow">
            ${pos.correctOrder}
          </span>
          <span class="text-[11px] md:text-xs font-bold text-slate-600 leading-tight">
            ${pos.name}
          </span>
          <span class="text-[10px] text-slate-400 mt-0.5">Letakkan di sini</span>
        </div>
        <div class="slot-content hidden w-full h-full flex flex-col items-center"></div>
      `;

      // HTML5 Drag & Drop Events
      slot.ondragover = (e) => {
        e.preventDefault();
        slot.classList.add('bg-emerald-100', 'border-emerald-500', 'scale-105');
      };
      slot.ondragleave = () => {
        slot.classList.remove('bg-emerald-100', 'border-emerald-500', 'scale-105');
      };
      slot.ondrop = (e) => {
        e.preventDefault();
        slot.classList.remove('bg-emerald-100', 'border-emerald-500', 'scale-105');
        const cardId = parseInt(e.dataTransfer.getData('text/plain') || this.draggedCardId);
        this.handleDropCard(cardId, pos.correctOrder, slot);
      };

      // Tap-to-Place support
      slot.onclick = () => {
        if (this.selectedPoolCard) {
          const cardId = parseInt(this.selectedPoolCard.dataset.cardId);
          this.handleDropCard(cardId, pos.correctOrder, slot);
        }
      };

      slotsContainer.appendChild(slot);
    });

    // 2. Buat Kartu di Pool Sumber (Diacak)
    poolContainer.innerHTML = '';
    const shuffled = [...this.allPostures].sort(() => Math.random() - 0.5);

    shuffled.forEach(pos => {
      const card = document.createElement('div');
      card.id = `drag-card-${pos.id}`;
      card.dataset.cardId = pos.id;
      card.draggable = true;
      card.className = 'drag-card card-3d p-2 bg-white border-2 border-slate-200 rounded-2xl flex flex-col items-center cursor-grab active:cursor-grabbing hover:border-amber-400 transition-transform shadow-sm w-24 md:w-28 flex-shrink-0';
      card.innerHTML = `
        <div class="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 pointer-events-none">
          <img src="${pos.img}" alt="${pos.name}" onerror="if(!this.src.includes('sedekap.jpg')) this.src='assets/images/sedekap.jpg';" class="w-full h-full object-cover">
        </div>
        <span class="text-[11px] md:text-xs font-bold text-slate-700 text-center mt-1 truncate w-full pointer-events-none">
          ${pos.name}
        </span>
      `;

      // HTML5 Drag Events
      card.ondragstart = (e) => {
        this.draggedCardId = pos.id;
        e.dataTransfer.setData('text/plain', pos.id);
        card.classList.add('opacity-50');
      };
      card.ondragend = () => {
        card.classList.remove('opacity-50');
      };

      // Tap to Select support (Alternatif jika tidak memakai mouse drag)
      card.onclick = () => {
        AudioMaster.playPop();
        poolContainer.querySelectorAll('.drag-card').forEach(c => c.classList.remove('ring-4', 'ring-amber-400', 'bg-amber-50'));
        if (this.selectedPoolCard === card) {
          this.selectedPoolCard = null;
          feedbackBox.textContent = 'Tarik kartu atau ketuk kartu lalu ketuk kotak nomornya!';
        } else {
          this.selectedPoolCard = card;
          card.classList.add('ring-4', 'ring-amber-400', 'bg-amber-50');
          feedbackBox.textContent = `Pilih kotak nomor urutan untuk gerakan "${pos.name}"!`;
        }
      };

      // Touch Events for Tablet / Mobile
      card.ontouchstart = (e) => {
        this.draggedCardId = pos.id;
        this.selectedPoolCard = card;
      };
      card.ontouchend = (e) => {
        const touch = e.changedTouches[0];
        const elemUnder = document.elementFromPoint(touch.clientX, touch.clientY);
        const slotElem = elemUnder ? elemUnder.closest('.drop-slot') : null;
        if (slotElem) {
          const targetOrder = parseInt(slotElem.dataset.slotOrder);
          this.handleDropCard(pos.id, targetOrder, slotElem);
        }
      };

      poolContainer.appendChild(card);
    });
  },

  handleDropCard(cardId, targetOrder, slotElem) {
    const feedbackBox = document.getElementById('drag-drop-feedback');
    const pos = this.allPostures.find(p => p.id === cardId);
    if (!pos) return;

    const cardElem = document.getElementById(`drag-card-${cardId}`);

    if (pos.correctOrder === targetOrder) {
      AudioMaster.playChime();
      this.correctlyPlacedCount++;

      const placeholder = slotElem.querySelector('.slot-placeholder');
      const content = slotElem.querySelector('.slot-content');
      placeholder.classList.add('hidden');

      content.innerHTML = `
        <div class="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border border-emerald-400 shadow-sm mb-1">
          <img src="${pos.img}" alt="${pos.name}" onerror="if(!this.src.includes('sedekap.jpg')) this.src='assets/images/sedekap.jpg';" class="w-full h-full object-cover">
        </div>
        <span class="text-[10px] md:text-xs font-black text-emerald-800 text-center leading-tight">
          ✓ ${pos.correctOrder}. ${pos.name}
        </span>
      `;
      content.classList.remove('hidden');

      slotElem.className = 'drop-slot card-3d p-2 flex flex-col items-center justify-center bg-emerald-50 border-2 border-emerald-500 rounded-2xl min-h-[110px] md:min-h-[125px] shadow-md pointer-events-none';

      if (cardElem) cardElem.remove();
      this.selectedPoolCard = null;

      if (this.correctlyPlacedCount >= 10) {
        AudioMaster.playFanfare();
        feedbackBox.textContent = '🎉 Sempurna! Kamu berhasil menyusun seluruh 10 urutan gerakan salat dengan benar!';
        AudioMaster.playVO('drag-all-correct');
      } else {
        feedbackBox.textContent = `Hebat! Gerakan ${pos.correctOrder} (${pos.name}) benar! Lanjutkan!`;
        AudioMaster.playVO(`drag-correct-${String(pos.id).padStart(2,'0')}`);
      }
    } else {
      AudioMaster.playGentleBoing();
      slotElem.classList.add('anim-shake');
      setTimeout(() => slotElem.classList.remove('anim-shake'), 400);

      if (cardElem) {
        cardElem.classList.add('anim-shake');
        setTimeout(() => cardElem.classList.remove('anim-shake'), 400);
      }

      feedbackBox.textContent = `Belum tepat, gerakan "${pos.name}" bukan di nomor ${targetOrder}. Yuk coba lagi!`;
      AudioMaster.playVO('drag-wrong');
    }
  },

  // ================= 4. KUIS ASESMEN (5 SOAL BINTANG) =================
  quizQuestions: [
    {
      q: 'Salat fardu yang dikerjakan saat terbit fajar dan berjumlah 2 rakaat adalah...',
      options: ['A. Subuh', 'B. Magrib', 'C. Isya'],
      correct: 0,
      icon: '🌄',
      voice: 'Nomor satu. Salat fardu yang dikerjakan saat terbit fajar dan berjumlah dua rakaat adalah... A. Subuh, B. Magrib, atau C. Isya?'
    },
    {
      q: 'Berapakah jumlah rakaat untuk salat fardu Magrib?',
      options: ['A. 2 Rakaat', 'B. 3 Rakaat', 'C. 4 Rakaat'],
      correct: 1,
      icon: '🌇',
      voice: 'Nomor dua. Berapakah jumlah rakaat untuk salat fardu Magrib? A. dua rakaat, B. tiga rakaat, atau C. empat rakaat?'
    },
    {
      q: 'Gerakan membungkuk dengan punggung lurus dan tangan di lutut disebut...',
      options: ['A. Sujud', 'B. Iktidal', 'C. Rukuk'],
      correct: 2,
      icon: '🙇',
      voice: 'Nomor tiga. Gerakan membungkuk dengan punggung lurus dan tangan di lutut disebut... A. Sujud, B. Iktidal, atau C. Rukuk?'
    },
    {
      q: 'Salat fardu yang dikerjakan pada malam hari berjumlah 4 rakaat adalah...',
      options: ['A. Subuh', 'B. Isya', 'C. Asar'],
      correct: 1,
      icon: '🌙',
      voice: 'Nomor empat. Salat fardu yang dikerjakan pada malam hari berjumlah empat rakaat adalah... A. Subuh, B. Isya, atau C. Asar?'
    },
    {
      q: 'Berapakah total seluruh waktu salat fardu dalam sehari semalam?',
      options: ['A. 3 Waktu', 'B. 5 Waktu', 'C. 7 Waktu'],
      correct: 1,
      icon: '🕌',
      voice: 'Nomor lima. Berapakah total seluruh waktu salat fardu dalam sehari semalam? A. tiga waktu, B. lima waktu, atau C. tujuh waktu?'
    }
  ],
  quizIndex: 0,
  score: 0,

  startQuiz() {
    this.quizIndex = 0;
    this.score = 0;
    this.loadQuestion();
  },

  loadQuestion() {
    const q = this.quizQuestions[this.quizIndex];
    document.getElementById('quiz-num').textContent = `Soal ${this.quizIndex + 1} dari 5`;
    document.getElementById('quiz-question').textContent = q.q;
    document.getElementById('quiz-icon').textContent = q.icon;

    AudioMaster.playVO(`quiz-question-${this.quizIndex + 1}`);

    const optsContainer = document.getElementById('quiz-options');
    optsContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-3d w-full py-3.5 px-6 bg-white text-slate-800 border-2 border-slate-200 rounded-2xl text-left font-bold text-base shadow hover:border-sky-400 hover:bg-sky-50 flex items-center justify-between';
      btn.innerHTML = `<span>${opt}</span> <span class="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-normal">👉</span>`;
      btn.onclick = () => this.handleAnswer(idx, btn);
      optsContainer.appendChild(btn);
    });
  },

  speakCurrentQuestion() {
    const q = this.quizQuestions[this.quizIndex];
    if (q) AudioMaster.playVO(`quiz-question-${this.quizIndex + 1}`);
  },

  handleAnswer(chosenIdx, btnElem) {
    const q = this.quizQuestions[this.quizIndex];
    const optsContainer = document.getElementById('quiz-options');
    Array.from(optsContainer.children).forEach(b => (b.onclick = null));

    if (chosenIdx === q.correct) {
      this.score += 20;
      AudioMaster.playChime();
      btnElem.className = 'btn-3d w-full py-3.5 px-6 bg-emerald-500 text-white border-2 border-emerald-600 rounded-2xl text-left font-bold text-base shadow flex items-center justify-between';
      AudioMaster.playVO('quiz-correct');
    } else {
      AudioMaster.playGentleBoing();
      btnElem.className = 'btn-3d w-full py-3.5 px-6 bg-rose-500 text-white border-2 border-rose-600 rounded-2xl text-left font-bold text-base shadow flex items-center justify-between anim-shake';
      optsContainer.children[q.correct].className = 'btn-3d w-full py-3.5 px-6 bg-emerald-100 text-emerald-800 border-2 border-emerald-400 rounded-2xl text-left font-bold text-base shadow flex items-center justify-between';
      AudioMaster.playVO(`quiz-wrong-${this.quizIndex + 1}`);
    }

    setTimeout(() => {
      this.quizIndex++;
      if (this.quizIndex < this.quizQuestions.length) {
        this.loadQuestion();
      } else {
        this.showCertificate();
      }
    }, 1800);
  },

  // ================= 5. SERTIFIKAT PRESTASI =================
  showCertificate() {
    App.showScreen('screen-sertifikat');
    AudioMaster.playFanfare();

    const studentName = App.studentName || 'Sahabat Hebat';
    document.getElementById('cert-name').textContent = studentName;
    document.getElementById('cert-score').textContent = `${this.score}/100`;

    const starsCount = Math.max(1, Math.round((this.score / 100) * 5));
    let starStr = '';
    for (let i = 0; i < 5; i++) {
      starStr += i < starsCount ? '⭐' : '☆';
    }
    document.getElementById('cert-stars').textContent = starStr;
    document.getElementById('cert-avatar-img').src = App.selectedAvatar;

    AudioMaster.playVO('certificate');
  }
};
