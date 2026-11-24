/* ============================================================
   KONFIGURASI — ubah bagian ini saja, tidak perlu sentuh kode lain
   ============================================================ */

window.BIRTHDAY_CONFIG = {
  /* Nama */
  to: "dokter cantik-ku",  // nama pacar kamu
  from: "Iqbal",             // nama kamu

  /* Teks khusus preview link (WhatsApp dll) */
  ogTitle: "Selamat Ulang Tahun, Sayang",
  ogDescription: "Sebuah kejutan kecil untuk dokter cantik-ku. Buka pelan-pelan ya.",

  /* Tanggal ulang tahun (untuk ditampilkan di halaman utama) */
  dateISO: "2025-11-25",   // format: TAHUN-BULAN-TANGGAL
  dateLabel: "",           // kosongkan untuk otomatis, atau isi manual: "25 November 2025"
  age: null,               // isi angka kalau ingin menampilkan usia, contoh: 24

  /* Intro */
  introEyebrow: "Sebuah kejutan kecil untuk",
  introHint: "Tiup lilinnya dulu ya — lalu buat satu permohonan.",
  introHintDone: "Semoga semua permohonanmu terkabul.",
  introNote: "Bisa meniup langsung ke mikrofon, atau cukup tekan tombolnya.",

  /* Bagian utama */
  heroEyebrow: "Hari ini, untukmu",
  heroSub:
    "Untuk semua tawa yang kamu bagikan, semua sabar yang kamu beri, dan semua hari biasa yang jadi lebih ringan karena ada kamu.",
  scrollCue: "gulir pelan-pelan",

  /* Cerita — tambah / kurangi sesukamu.
     Setiap item: kicker (label kecil), title, text */
  storyIntro: {
    eyebrow: "Untukmu, pelan-pelan",
    title: "Beberapa hal yang\ningin aku sampaikan",
  },
  story: [
    {
      kicker: "Tentang hari ini",
      title: "Hari yang tak luput dari dirayakan",
      text: "Hari ini bukan cuma soal bertambahnya angka di usia. Ini tentang kamu, yang sudah mendapatkan gelar yang diperjuangkan.",
    },
    {
      kicker: "Yang belum sempat aku bilang",
      title: "Terima kasih sudah tinggal",
      text: "Terima kasih sudah memilih untuk tetap ada, bahkan di hari-hari ketika aku tidak mudah untuk baik pada dunia.",
    },
    {
      kicker: "Harapan",
      title: "Semoga tahun ini baik padamu",
      text: "Semoga tahun ini kamu dikelilingi orang-orang yang menghargaimu, diberi kesehatan yang cukup untuk mengejar semua yang kamu mau. Kalau ada yang berat, aku ada — jadi tukang angkat wkwkwkw mwah.",
    },
    {
      kicker: "Dan satu lagi",
      title: "Kamu pantas bahagia",
      text: "Bukan cuma hari ini, tapi di hari-hari biasa yang tidak ada hadiahnya. Kamu pantas mendapatkan kebahagiaan yang tidak perlu kamu perjuangkan sendirian.",
    },
  ],

  /* Kutipan di antara cerita dan hadiah */
  quote: {
    text: "Dari semua hal yang terjadi, ternyata Tuhan mau perayaan ini dijalankan lagi tahun ini walaupun hanya sebentar dan sederhana bersamamu.",
    by: "— sebuah catatan kecil",
  },

  /* Kejutan / surat */
  gift: {
    eyebrow: "Satu kejutan lagi",
    title: "Ada sesuatu\ndi balik segel ini",
    seal: "Buka",
    letterEyebrow: "Surat kecil",
    letterTitle: "Untuk kamu, yang selalu sabar",
    paragraphs: [
      "Lah masih mau hadiah kahh??",
      "Yaudah, kirim foto imut mata berbinar-binar mau minta hadiahnya.",
      "Kirim ke link berikut:",
    ],
    cta: {
      label: "Kirim Foto Imut",
      href: "https://api.whatsapp.com/send/?phone=6285173491404&text&type=phone_number&app_absent=0",
    },
    letterOutro: "Terima kasih mwahhh",
    sign: "Dengan sayang,",
  },

  /* Footer */
  footerNote: "Dibuat dengan sepenuh hati, untuk satu orang.",
  closing: "Selamat ulang tahun, sayang.",

  /* Musik latar.
     File akan diputar otomatis setelah lilin ditiup.
     Kalau belum ada, tombol musik otomatis nonaktif. */
  music: "assets/audio/The-Weeknd-Hong-Kong.m4a",
  musicVolume: 0.32,
};