/**
 * js/app.js
 * Controller Utama: Navigasi Layar, Autoplay Voice Over Cover, Form Murid, & Modal Kreator + Tujuan
 */

const App = {
  studentName: '',
  selectedAvatar: 'assets/images/avatar-ahmad.jpg',
  currentScreen: 'screen-cover',
  coverVoHasPlayed: false,

  init() {
    this.setupEventListeners();
    this.showScreen('screen-cover');

    // Autoplay Voice Over Cover saat aplikasi dibuka
    this.triggerCoverAutoplay();
  },

  triggerCoverAutoplay() {
    const playCover = () => {
      if (!this.coverVoHasPlayed && this.currentScreen === 'screen-cover') {
        AudioMaster.playVO('cover', () => { this.coverVoHasPlayed = true; });
      }
    };

    // 1. Coba langsung saat load
    setTimeout(() => { playCover(); AudioMaster.startBackgroundMusic(); }, 500);

  },

  showScreen(screenId) {
    document.querySelectorAll('.screen-view').forEach(screen => {
      screen.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
      this.triggerScreenVO(screenId);
    }
  },

  // Voice Over otomatis saat berpindah menu (Suara Anak Indonesia)
  triggerScreenVO(screenId) {
    switch (screenId) {
      case 'screen-cover':
        // Voice cover ditangani oleh triggerCoverAutoplay agar tidak diputar dua kali.
        break;
      case 'screen-login':
        AudioMaster.playVO('login');
        break;
      case 'screen-home':
        AudioMaster.playVO('home');
        break;
      case 'screen-eksplorasi':
        AudioMaster.playVO('eksplorasi');
        break;
      case 'screen-gerakan':
        AudioMaster.playVO('gerakan');
        break;
      case 'screen-bacaan':
        AudioMaster.playVO('bacaan');
        break;
      case 'screen-pairing':
        AudioMaster.playVO('pairing');
        break;
      case 'screen-urutan':
        AudioMaster.playVO('urutan');
        break;
      case 'screen-kuis':
        AudioMaster.playVO('kuis');
        break;
    }
  },

  setupEventListeners() {
    // Cover: suara dicoba otomatis; browser dapat meminta interaksi pertama untuk membuka audio.
    document.getElementById('btn-cover-start').addEventListener('click', () => {
      AudioMaster.startBackgroundMusic();
      AudioMaster.ensureCtx();
      this.showScreen('screen-login');
    });

    // 2. Avatar Selection
    document.querySelectorAll('.avatar-choice').forEach(elem => {
      elem.addEventListener('click', () => {
        AudioMaster.playPop();
        document.querySelectorAll('.avatar-choice').forEach(a => {
          a.classList.remove('ring-4', 'ring-amber-400', 'scale-105', 'bg-amber-100');
        });
        elem.classList.add('ring-4', 'ring-amber-400', 'scale-105', 'bg-amber-100');
        this.selectedAvatar = elem.dataset.avatar;
      });
    });

    // 3. Login Submit
    document.getElementById('btn-login-submit').addEventListener('click', () => {
      const input = document.getElementById('input-student-name');
      const val = input.value.trim();
      if (!val) {
        AudioMaster.playGentleBoing();
        input.classList.add('anim-shake');
        setTimeout(() => input.classList.remove('anim-shake'), 400);
        return;
      }
      AudioMaster.playPop();
      this.studentName = val;

      document.getElementById('home-student-name').textContent = this.studentName;
      document.getElementById('home-avatar-img').src = this.selectedAvatar;

      this.showScreen('screen-home');
    });

    document.getElementById('input-student-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('btn-login-submit').click();
      }
    });

    // 4. Control Buttons (Top Bar)
    // Tombol (i) Informasi Kreator & Tujuan Pembelajaran di Pojok Kanan
    const btnCreator = document.getElementById('btn-creator-info');
    if (btnCreator) {
      btnCreator.addEventListener('click', () => {
        AudioMaster.playPop();
        this.openModal('modal-creator');
      });
    }

    const btnCloseCreator = document.getElementById('btn-close-creator-modal');
    if (btnCloseCreator) {
      btnCloseCreator.addEventListener('click', () => {
        AudioMaster.playPop();
        this.closeModal('modal-creator');
      });
    }

    // Toggle Audio Mute
    const btnToggleAudio = document.getElementById('btn-toggle-audio');
    if (btnToggleAudio) {
      btnToggleAudio.addEventListener('click', (e) => {
        const isMuted = AudioMaster.toggleMute();
        e.currentTarget.textContent = isMuted ? '🔇' : '🔔';
      });
    }

    // Tombol speaker per-screen untuk memutar ulang voice over
    document.querySelectorAll('.btn-screen-vo').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioMaster.playPop();
        this.triggerScreenVO(this.currentScreen);
      });
    });

    // 5. Menu Navigation
    document.getElementById('menu-card-eksplorasi').addEventListener('click', () => {
      AudioMaster.playPop();
      GamesMaster.initEksplorasi();
      this.showScreen('screen-eksplorasi');
    });

    document.getElementById('menu-card-gerakan').addEventListener('click', () => {
      AudioMaster.playPop(); this.initPostureExplorer(); this.showScreen('screen-gerakan');
    });
    document.getElementById('menu-card-bacaan').addEventListener('click', () => {
      AudioMaster.playPop(); this.initReadingExplorer(); this.showScreen('screen-bacaan');
    });

    document.getElementById('menu-card-pairing').addEventListener('click', () => {
      AudioMaster.playPop();
      GamesMaster.initGamePairing();
      this.showScreen('screen-pairing');
    });

    document.getElementById('menu-card-urutan').addEventListener('click', () => {
      AudioMaster.playPop();
      GamesMaster.initGameDragDrop();
      this.showScreen('screen-urutan');
    });

    document.getElementById('menu-card-kuis').addEventListener('click', () => {
      AudioMaster.playPop();
      GamesMaster.startQuiz();
      this.showScreen('screen-kuis');
    });

    document.getElementById('posture-speak').addEventListener('click', () => this.speakSelectedPosture());
    document.getElementById('reading-speak').addEventListener('click', () => this.speakSelectedReading());

    document.querySelectorAll('.btn-back-to-home').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioMaster.playPop();
        this.showScreen('screen-home');
      });
    });

    const btnCertReplay = document.getElementById('btn-cert-replay');
    if (btnCertReplay) {
      btnCertReplay.addEventListener('click', () => {
        AudioMaster.playPop();
        GamesMaster.startQuiz();
        this.showScreen('screen-kuis');
      });
    }

    const btnCertHome = document.getElementById('btn-cert-home');
    if (btnCertHome) {
      btnCertHome.addEventListener('click', () => {
        AudioMaster.playPop();
        this.showScreen('screen-home');
      });
    }

    const btnQuizSpeak = document.getElementById('btn-quiz-speak');
    if (btnQuizSpeak) {
      btnQuizSpeak.addEventListener('click', () => {
        AudioMaster.playPop(); GamesMaster.speakCurrentQuestion();
      });
    }

    // Kebijakan autoplay browser: aktifkan audio begitu ada interaksi pertama, tanpa tombol audio cover.
    const unlockAudio = () => {
      AudioMaster.ensureCtx(); AudioMaster.startBackgroundMusic();
      if (!this.coverVoHasPlayed && this.currentScreen === 'screen-cover') {
        AudioMaster.playVO('cover', () => { this.coverVoHasPlayed = true; });
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
  },

  postures: [
    {name:'Berdiri Tegak',img:'gerakan-berdiri-tegak.jpg',desc:'Berdiri tegak menghadap kiblat dengan tenang. Pandangan diarahkan ke tempat sujud dan tubuh dalam posisi siap untuk salat.'},
    {name:'Takbiratul Ihram',img:'gerakan-takbir.jpg',desc:'Angkat kedua tangan sejajar bahu atau telinga sambil mengucapkan Allahu Akbar sebagai tanda memulai salat.'},
    {name:'Bersedekap',img:'gerakan-bersedekap.jpg',desc:'Letakkan tangan kanan di atas tangan kiri di bagian dada atau sesuai tuntunan yang dipelajari. Berdiri dengan khusyuk.'},
    {name:'Rukuk',img:'gerakan-rukuk.jpg',desc:'Bungkukkan badan dengan punggung rata, kedua tangan memegang lutut, dan kepala sejajar dengan punggung.'},
    {name:'Iktidal',img:'gerakan-itidal.jpg',desc:'Bangkit dari rukuk hingga berdiri tegak kembali sambil membaca Sami’allahu liman hamidah, kemudian memuji Allah.'},
    {name:'Sujud',img:'gerakan-sujud.jpg',desc:'Letakkan dahi dan hidung, kedua telapak tangan, kedua lutut, serta ujung jari kaki di tempat sujud.'},
    {name:'Duduk antara Dua Sujud',img:'gerakan-tahiyat.jpg',desc:'Duduk dengan tenang di antara dua sujud dan membaca doa memohon ampunan, rahmat, serta petunjuk Allah.'},
    {name:'Sujud Kedua',img:'gerakan-sujud.jpg',desc:'Lakukan sujud sekali lagi seperti sujud pertama dengan tuma’ninah.'},
    {name:'Duduk Tasyahud',img:'gerakan-tahiyat.jpg',desc:'Duduk untuk membaca tahiyat dan selawat. Posisi duduk mengikuti tuntunan tasyahud awal atau akhir.'},
    {name:'Salam',img:'gerakan-salam.jpg',desc:'Menoleh ke kanan lalu ke kiri sambil mengucapkan salam untuk mengakhiri salat.'}
  ],
  readings: [
    {title:'Takbiratul Ihram',arab:'اللّٰهُ أَكْبَرُ',latin:'Allāhu akbar.',meaning:'Allah Mahabesar.'},
    {title:'Doa Iftitah',arab:'اللّٰهُ أَكْبَرُ كَبِيْرًا، وَالْحَمْدُ لِلّٰهِ كَثِيْرًا، وَسُبْحَانَ اللّٰهِ بُكْرَةً وَأَصِيْلًا. إِنِّيْ وَجَّهْتُ وَجْهِيَ لِلَّذِيْ فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيْفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِيْنَ اِنَّ صَلَاتِيْ وَنُسُكِيْ وَمَحْيَايَ وَمَمَاتِيْ لِلّهِ رَبِّ الْعَا لَمِيْنَ لَا شَرِيْكَ لَهُ وَبِذَلِكَ اُمِرْتُ وَاَنَا مِنَ الْمُسْلِمِيْنَ.',latin:'Allâhu akbar kabîrâ wal ḫamdu lillâhi katsîrâ wa subḫânallâhi bukrataw wa ashîlâ. Innî wajjahtu wajhiya lilladzî fatharas samâwâti wal ardla ḫanîfam muslimaw wamâ ana minal musyrikîn. Inna shalâtî wa nusukî wa maḫyâya wa mamâtî lillâhirabbil ‘âlamîn. Lâ syarîka lahû wa bidzâlika umirtu wa ana minal muslimîn.',meaning:'Allah Mahabesar, Mahasempurna kebesaran-Nya. Segala puji bagi Allah, pujian yang sebanyak-banyaknya. Mahasuci Allah sepanjang pagi dan petang. Kuhadapkan wajahku kepada Dzat yang telah menciptakan langit dan bumi dengan penuh ketulusan dan kepasrahan dan aku bukanlah termasuk orang-orang yang musyrik. Sesungguhnya shalatku, ibadahku, hidupku, dan matiku semuanya untuk Allah, penguasa alam semesta. Tidak ada sekutu bagi-Nya dan dengan demikianlah aku diperintahkan dan aku termasuk orang-orang Islam..'},
    {title:'Surah Al-Fatihah',arab:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ۝ الرَّحْمٰنِ الرَّحِيْمِ ۝ مٰلِكِ يَوْمِ الدِّيْنِ ۝ اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُ ۝ اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ ۝ صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّالِّيْنَ',latin:'Bismillāhir-raḥmānir-raḥīm. Al-ḥamdu lillāhi rabbil-‘ālamīn. Ar-raḥmānir-raḥīm. Māliki yaumid-dīn. Iyyāka na‘budu wa iyyāka nasta‘īn. Ihdinaṣ-ṣirāṭal-mustaqīm. Ṣirāṭallażīna an‘amta ‘alaihim gairil-magḍūbi ‘alaihim wa laḍ-ḍāllīn.',meaning:'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam, Yang Maha Pengasih, Maha Penyayang, Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus, yaitu jalan orang-orang yang telah Engkau beri nikmat; bukan jalan mereka yang dimurkai dan bukan pula jalan mereka yang sesat.'},
    {title:'Bacaan Rukuk',arab:'سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ',latin:'Subḥāna rabbiyal-‘aẓīmi wa biḥamdih.',meaning:'Mahasuci Tuhanku Yang Mahaagung dan dengan memuji-Nya.'},
    {title:'Bacaan Iktidal',arab:'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',latin:'Sami‘allāhu liman ḥamidah. Rabbanā wa lakal-ḥamd.',meaning:'Allah mendengar orang yang memuji-Nya. Wahai Tuhan kami, bagi-Mu segala puji.'},
    {title:'Bacaan Sujud',arab:'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',latin:'Subḥāna rabbiyal-a‘lā wa biḥamdih.',meaning:'Mahasuci Tuhanku Yang Mahatinggi dan dengan memuji-Nya.'},
    {title:'Duduk di Antara Dua Sujud',arab:'رَبِّ اغْفِرْ لِيْ وَارْحَمْنِيْ وَاجْبُرْنِيْ وَارْفَعْنِيْ وَارْزُقْنِيْ وَاهْدِنِيْ وَعَافِنِيْ وَاعْفُ عَنِّيْ',latin:'Rabbighfir lī, warḥamnī, wajburnī, warfa‘nī, warzuqnī, wahdinī, wa ‘āfinī, wa‘fu ‘annī.',meaning:'Ya Tuhanku, ampunilah aku, rahmatilah aku, cukupilah kekuranganku, angkatlah derajatku, berilah rezeki kepadaku, berilah petunjuk kepadaku, sehatkanlah aku, dan maafkanlah aku.'},
    {title:'Bacaan Tasyahud',arab:'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلّٰهِ. السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ. السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللّٰهِ الصَّالِحِيْنَ. أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللّٰهِاَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ .',latin:'At-taḥiyyātul-mubārakātuṣ-ṣalawātُṭ-ṭayyibātu lillāh. As-salāmu ‘alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu ‘alainā wa ‘alā ‘ibādillāhiṣ-ṣāliḥīn. Asyhadu an lā ilāha illallāh wa asyhadu anna Muḥammadar-rasūlullāh Allâhumma shalli ‘alâ sayyidinâ muḫammad.',meaning:'Segala penghormatan, keberkahan, doa, dan kebaikan adalah milik Allah. Semoga keselamatan, rahmat Allah, dan berkah-Nya tercurah kepadamu wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang saleh. Aku bersaksi bahwa tidak ada Tuhan selain Allah dan Muhammad adalah utusan Allah. Ya Allah, limpahkanlah rahmat kepada junjungan kami Nabi Muhammad.'},
    {title:'Bacaan Salam',arab:'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ',latin:'Assalāmu ‘alaikum wa raḥmatullāh.',meaning:'Semoga keselamatan dan rahmat Allah tercurah kepada kalian.'}
  ],
  initPostureExplorer() {
    const wrap=document.getElementById('posture-buttons'); wrap.innerHTML='';
    this.postures.forEach((item,i)=>{const b=document.createElement('button'); b.textContent=`${i+1}. ${item.name}`; b.className=i===0?'active':''; b.onclick=()=>this.selectPosture(i); wrap.appendChild(b);});
    this.selectPosture(0,false);
  },
  selectPosture(i,voice=true) {
    const x=this.postures[i]; if(!x)return;
    document.querySelectorAll('#posture-buttons button').forEach((b,n)=>b.classList.toggle('active',n===i));
    document.getElementById('posture-image').src='assets/images/'+x.img;
    document.getElementById('posture-title').textContent=x.name;
    document.getElementById('posture-description').textContent=x.desc;
    if(voice) AudioMaster.playVO(`posture-${String(i+1).padStart(2,'0')}`);
  },
  speakSelectedPosture(){const i=[...document.querySelectorAll('#posture-buttons button')].findIndex(b=>b.classList.contains('active'));this.selectPosture(Math.max(0,i));},
  initReadingExplorer(){
    const wrap=document.getElementById('reading-buttons');wrap.innerHTML='';
    this.readings.forEach((item,i)=>{const b=document.createElement('button');b.textContent=`${i+1}. ${item.title}`;b.className=i===0?'active':'';b.onclick=()=>this.selectReading(i);wrap.appendChild(b);});
    this.selectReading(0,false);
  },
  selectReading(i,voice=true){
    const x=this.readings[i];if(!x)return;
    document.querySelectorAll('#reading-buttons button').forEach((b,n)=>b.classList.toggle('active',n===i));
    document.getElementById('reading-title').textContent=x.title;
    document.getElementById('reading-arabic').textContent=x.arab;
    document.getElementById('reading-latin').textContent=x.latin;
    document.getElementById('reading-meaning').textContent=x.meaning;
    if(voice) AudioMaster.playVO(`reading-${String(i+1).padStart(2,'0')}`);
  },
  speakSelectedReading(){const i=[...document.querySelectorAll('#reading-buttons button')].findIndex(b=>b.classList.contains('active'));this.selectReading(Math.max(0,i));},

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
