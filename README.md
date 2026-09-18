# 🧠 Mental Health Text Classification Dashboard
**Analisis Komparatif Kinerja Model IndoBERT-Base dan IndoBERTweet untuk Klasifikasi Teks Terkait Kesehatan Mental Melalui Postingan Media Sosial X/Twitter**

Sebuah *dashboard* antarmuka interaktif yang dibangun untuk memvisualisasikan dan menguji model klasifikasi *Natural Language Processing* (NLP) berbahasa Indonesia. Aplikasi ini secara spesifik membandingkan metrik performa dan komputasi (*latency* & RAM) antara dua arsitektur *pre-trained language model*: **IndoBERT-Base** (dilatih pada korpus formal Wikipedia/Berita) dan **IndoBERTweet** (dilatih pada korpus adaptif Twitter).

---

## ✨ Fitur Utama

- 📊 **Overview Dashboard**: Menampilkan ringkasan metrik evaluasi model hasil 10-Fold Cross Validation (Akurasi, Presisi, Recall, F1-Score) dan Confusion Matrix secara interaktif dengan grafik (menggunakan Recharts).
- 🧪 **Inference Lab**: Fasilitas pengujian teks (cuitan) secara langsung. Pengguna dapat memasukkan teks dan melihat hasil klasifikasi (*Positif Terindikasi* atau *Netral*) secara berdampingan dari kedua model, lengkap dengan probabilitas prediksi, ekstraksi subword, penggunaan RAM, dan latensi komputasi (ms).
- 🚀 **Batch Processing / Realtime Dashboard**: Memungkinkan unggah file `.csv` atau `.txt` untuk mengklasifikasi banyak cuitan sekaligus secara *batch* atau mensimulasikan *stream* data secara *realtime*.

## 🛠️ Stack Teknologi

**Frontend (Client)**
- **React 18** (dengan TypeScript)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Recharts** (Visualisasi Data / Grafik)
- **Lucide React** (Ikon)

**Backend (API & Inference Engine)**
- **Python 3.9+**
- **FastAPI** (Web Framework REST API)
- **PyTorch** (Deep Learning Backend)
- **Hugging Face Transformers** (Manajemen Model IndoBERT)
- **Uvicorn** (ASGI Server)
- **psutil** (Pemantauan Penggunaan RAM)

---

## ⚙️ Prasyarat & Instalasi

Sebelum menjalankan aplikasi, pastikan sistem Anda sudah terinstal:
- **Node.js** (v16 atau lebih baru)
- **Python** (v3.9 atau lebih baru)

### 1. Kloning Repositori
```bash
git clone https://github.com/rafliatha/indobert-mental-health-dashboard.git
cd indobert-mental-health-dashboard
```

### 2. Penyiapan Model (Wajib)
Aplikasi ini membutuhkan file model PyTorch pra-latih. Buat folder `models/` di *root directory* dan letakkan model yang sudah di *fine-tuning* di dalamnya dengan struktur berikut:
```text
models/
├── IndoBERT_Base/       # (Berisi config.json, pytorch_model.bin, vocab.txt, dll)
└── IndoBERTweet/        # (Berisi config.json, pytorch_model.bin, vocab.txt, dll)
```

### 3. Menjalankan Backend (FastAPI)
Buka terminal baru untuk backend:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Backend API akan berjalan di `http://127.0.0.1:8000`.

### 4. Menjalankan Frontend (React/Vite)
Buka terminal baru untuk frontend (kembali ke folder utama `indobert-mental-health-dashboard`):
```bash
npm install
npm run dev
```
Buka *browser* Anda dan akses `http://localhost:5173` (atau port lain yang ditampilkan Vite).

---

## ⚠️ Disclaimer (Batasan Sistem)
*Sistem ini tidak dirancang untuk memberikan label kondisi klinis atau diagnosis medis pengguna secara realita, melainkan murni dirancang secara spesifik dalam ranah riset akademis Natural Language Processing untuk mengenali indikator linguistik terkait tekanan psikologis. Dashboard ini tidak diklaim atau didistribusikan sebagai perangkat diagnostik klinis (medical device).*
