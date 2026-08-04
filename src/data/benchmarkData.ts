import { ModelMetrics, ClassPerformance, ConfusionMatrixData, LexiconItem, TweetSample, PreprocessingStep } from '../types';

export const THESIS_INFO = {
  title: "Analisis Komparatif Kinerja Model IndoBERT-Base dan IndoBERTweet untuk Klasifikasi Teks Terkait Kesehatan Mental Melalui Postingan Media Sosial X/Twitter",
  author: "Muhammad Rafli Falam Athallah",
  nim: "5312422019",
  studyProgram: "Prodi Teknik Komputer, Fakultas Teknik",
  university: "Universitas Negeri Semarang (UNNES)",
  year: "2026",
  advisor: "Ir. Abdurrakhman Hamid Al-azhari, S.T., M.T.",
  hardwareSpecs: {
    device: "Advan Workplus Laptop (Mid-Range Consumer Grade)",
    cpu: "AMD Ryzen™ 5 6600H (6 Cores, 12 Threads, Up to 4.5 GHz)",
    ram: "16 GB LPDDR5 6400MHz Dual Channel",
    gpu: "AMD Radeon™ 660M Integrated Graphics (Non-GPU Server)",
    storage: "512 GB NVMe PCIe 3.0 SSD",
    os: "Windows 11 Home (64-bit)"
  }
};

export const MODEL_SUMMARY_METRICS: { indoBertBase: ModelMetrics; indoBertweet: ModelMetrics } = {
  indoBertBase: {
    name: "IndoBERT-Base",
    accuracy: 0.8809,
    precision: 0.8902,
    recall: 0.8891,
    f1Score: 0.8889,
    latencyMs: 48.6,
    ramUsageMb: 1240,
    throughputSamplesPerSec: 20.5
  },
  indoBertweet: {
    name: "IndoBERTweet",
    accuracy: 0.8943,
    precision: 0.8965,
    recall: 0.8944,
    f1Score: 0.8941,
    latencyMs: 32.4,
    ramUsageMb: 980,
    throughputSamplesPerSec: 30.8
  }
};

export const CLASS_PERFORMANCE_METRICS: ClassPerformance[] = [
  {
    category: 'Positif Terindikasi (1)',
    indoBertBase: { precision: 0.869, recall: 0.856, f1Score: 0.862 },
    indoBertweet: { precision: 0.915, recall: 0.906, f1Score: 0.910 }
  },
  {
    category: 'Netral (0)',
    indoBertBase: { precision: 0.904, recall: 0.924, f1Score: 0.914 },
    indoBertweet: { precision: 0.939, recall: 0.945, f1Score: 0.942 }
  }
];

export const CONFUSION_MATRIX_INDOBERT_BASE: ConfusionMatrixData[] = [
  { category: 'Positif Terindikasi (1)', predictedPositif: 186, predictedNetral: 23 },
  { category: 'Netral (0)', predictedPositif: 23, predictedNetral: 186 }
];

export const CONFUSION_MATRIX_INDOBERTWEET: ConfusionMatrixData[] = [
  { category: 'Positif Terindikasi (1)', predictedPositif: 187, predictedNetral: 22 },
  { category: 'Netral (0)', predictedPositif: 22, predictedNetral: 187 }
];

export const CROSS_VALIDATION_RESULTS = [
  { fold: 1, baseAccuracy: 0.8995, baseF1: 0.8994, tweetAccuracy: 0.9043, tweetF1: 0.9042 },
  { fold: 2, baseAccuracy: 0.8947, baseF1: 0.8946, tweetAccuracy: 0.9091, tweetF1: 0.9090 },
  { fold: 3, baseAccuracy: 0.8804, baseF1: 0.8803, tweetAccuracy: 0.8900, tweetF1: 0.8898 },
  { fold: 4, baseAccuracy: 0.8947, baseF1: 0.8946, tweetAccuracy: 0.9043, tweetF1: 0.9042 },
  { fold: 5, baseAccuracy: 0.9043, baseF1: 0.9042, tweetAccuracy: 0.9091, tweetF1: 0.9090 },
  { fold: 6, baseAccuracy: 0.8852, baseF1: 0.8850, tweetAccuracy: 0.8947, tweetF1: 0.8946 },
  { fold: 7, baseAccuracy: 0.8804, baseF1: 0.8803, tweetAccuracy: 0.8804, tweetF1: 0.8802 },
  { fold: 8, baseAccuracy: 0.8804, baseF1: 0.8802, tweetAccuracy: 0.8804, tweetF1: 0.8801 },
  { fold: 9, baseAccuracy: 0.8852, baseF1: 0.8850, tweetAccuracy: 0.8804, tweetF1: 0.8803 },
  { fold: 10, baseAccuracy: 0.8852, baseF1: 0.8851, tweetAccuracy: 0.8900, tweetF1: 0.8899 }
];

export const LEXICON_DICTIONARY: LexiconItem[] = [
  {
    category: 'Positif Terindikasi (1)',
    keywords: ['stres', 'capek mental', 'cemas', 'panik', 'khawatir berlebihan', 'paranoid', 'nggak fokus', 'deadlines', 'exhausted', 'kelelahan', 'overthinking', 'depresi', 'bersalah', 'diabaikan', 'frustasi', 'gagal', 'galau', 'gelisah', 'hilang kendali', 'hampa', 'kecewa', 'kesepian', 'menyerah', 'menyesal', 'pasrah', 'putus asa', 'sedih', 'sendirian', 'tak berharga', 'terasing', 'terisolasi', 'terluka', 'terpuruk', 'tertekan', 'tidak berarti', 'tidak berdaya', 'tidak berguna', 'pengen nyerah', 'burnout'],
    description: 'Kata kunci indikator tekanan psikologis, beban pikiran, kecemasan, putus asa, hampa, atau kelelahan mental.'
  },
  {
    category: 'Netral (0)',
    keywords: ['antusias', 'bahagia', 'berharga', 'berhasil', 'bersama', 'ceria', 'dekat', 'dihargai', 'dipercaya', 'diterima', 'gembira', 'mampu', 'optimis', 'positif', 'riang', 'semangat', 'senang', 'sukses', 'tenang'],
    description: 'Kata kunci emosi stabil, informasi umum, edukasi publik, opini pihak ketiga, atau ungkapan bernada positif/normal.'
  }
];

export const SAMPLE_TWEETS: TweetSample[] = [
  {
    id: 'tweet-1',
    text: 'jujur aku ngerasa capek mental banget akhir akhir ini pengen nyerah aja rasanya',
    groundTruth: 'Positif Terindikasi (1)',
    description: 'Curhatan pengungkapan diri sudut pandang pertama (aku) memuat indikator putus asa & capek mental.',
    hasCodeMixing: false,
    hasSlang: true
  },
  {
    id: 'tweet-2',
    text: 'gue beneran udah burnout sama tugas kuliah dan overthinking terus tiap malem',
    groundTruth: 'Positif Terindikasi (1)',
    description: 'Pengungkapan diri sudut pandang pertama (gue) dengan code-mixing istilah psikologis (burnout, overthinking).',
    hasCodeMixing: true,
    hasSlang: true
  },
  {
    id: 'tweet-3',
    text: 'kasian banget liat temenku sampe depresi gara gara masalah keluarganya',
    groundTruth: 'Netral (0)',
    description: 'Memuat leksikon depresi namun sudut pandang orang ketiga (temenku), dieksklusi dari indikator personal.',
    hasCodeMixing: false,
    hasSlang: true
  },
  {
    id: 'tweet-4',
    text: 'tanda tanda kamu mengalami stres berat adalah susah tidur dan mudah marah',
    groundTruth: 'Netral (0)',
    description: 'Memuat leksikon stres namun konteksnya berupa teks edukasi publik/informasi umum.',
    hasCodeMixing: false,
    hasSlang: false
  },
  {
    id: 'tweet-5',
    text: 'malam ini jadwal padat banget bikin badan pegel pegel semua tapi tetep semangat',
    groundTruth: 'Netral (0)',
    description: 'Keluhan fisik biasa tanpa memuat leksikon kesehatan mental.',
    hasCodeMixing: false,
    hasSlang: true
  },
  {
    id: 'tweet-6',
    text: 'tiap hari ngerasa hampa dan sendirian, nggak tau harus cerita ke siapa lagi',
    groundTruth: 'Positif Terindikasi (1)',
    description: 'Indikator kuat isolasi emosional (hampa, sendirian) dengan nada reflektif.',
    hasCodeMixing: false,
    hasSlang: true
  }
];

export const PREPROCESSING_PIPELINE: PreprocessingStep[] = [
  {
    step: 1,
    title: "Pembersihan Data (Data Cleaning)",
    description: "Menghapus elemen non-alfabet yang tidak memiliki bobot analitis seperti URL, mention (@user), hashtag (#), angka, tanda baca, serta emoticon.",
    exampleInput: "Jujur @user123 aku capek mental bgt!! https://t.co/abc #stres 😢",
    exampleOutput: "Jujur aku capek mental bgt stres"
  },
  {
    step: 2,
    title: "Case Folding",
    description: "Mengonversi seluruh karakter huruf menjadi huruf kecil (lowercase) agar kata identik tidak dianggap sebagai dua entitas berbeda.",
    exampleInput: "Jujur aku capek mental bgt stres",
    exampleOutput: "jujur aku capek mental bgt stres"
  },
  {
    step: 3,
    title: "Normalisasi Teks (Text Normalization)",
    description: "Mengubah kata gaul (slang) dan singkatan menjadi bentuk baku. Khusus kata serapan/code-mixing psikologis (misal: burnout, overthinking) dipertahankan murni tanpa translasi untuk menguji ketahanan tokenizer terhadap OOV.",
    exampleInput: "jujur aku capek mental bgt stres ngerasa burnout",
    exampleOutput: "jujur aku merasa capek mental banget stres merasa burnout"
  },
  {
    step: 4,
    title: "Stopword Removal & Stemming (BYPASSED)",
    description: "Pada arsitektur Transformer (BERT), pembuangan stopword dan stemming SENGAJA DIABAIKAN. BERT mengandalkan mekanisme Bidirectional Self-Attention yang membutuhkan keutuhan sintaksis dan urutan kalimat.",
    bypassReason: "Penghilangan kata hubung atau pemotongan imbuhan merusak relasi spasial antar-token dan menurunkan akurasi pemahaman konteks Transformer.",
    exampleInput: "jujur aku merasa capek mental banget",
    exampleOutput: "jujur aku merasa capek mental banget (Keutuhan kalimat dipertahankan)"
  },
  {
    step: 5,
    title: "Subword Tokenization ([CLS] & [SEP])",
    description: "Memecah teks menjadi token sub-kata menggunakan Subword Tokenizer bawaan model, menyisipkan token spesial [CLS] di awal dan [SEP] di akhir kalimat.",
    exampleInput: "jujur aku capek mental banget",
    exampleOutput: "[CLS] jujur aku capek mental banget [SEP]"
  }
];
