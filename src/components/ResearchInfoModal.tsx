import React from 'react';
import { X, BookOpen, Target, Layers } from 'lucide-react';

interface ResearchInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ResearchInfoModal: React.FC<ResearchInfoModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  const bgModal = isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800';
  const bgOverlay = isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/50';
  const subTextColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm ${bgOverlay}`}>
      <div 
        className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${bgModal}`}
        role="dialog"
        aria-modal="true"
      >
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'} backdrop-blur`}>
          <h2 className="text-xl font-black flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            Info Penelitian
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          {/* Latar Belakang */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Latar Belakang</h3>
            </div>
            <p className={`text-sm leading-relaxed ${subTextColor}`}>
              Kesehatan mental merupakan isu yang semakin penting, terutama di kalangan pengguna media sosial seperti Twitter (X). Banyak pengguna mengekspresikan kondisi psikologis mereka, seperti stres dan depresi, melalui cuitan. Penelitian ini bertujuan untuk mengklasifikasikan teks berbahasa Indonesia ke dalam dua kelas utama: <strong>Positif Terindikasi (1)</strong> dan <strong>Netral (0)</strong>. Kami membandingkan performa model bahasa pra-latih <strong>IndoBERT-Base</strong> (dilatih pada korpus formal) dan <strong>IndoBERTweet</strong> (dilatih pada korpus Twitter) untuk melihat model mana yang lebih unggul dalam menangani bahasa informal, slang, dan code-mixing.
            </p>
          </section>

          {/* Tujuan Penelitian */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Tujuan Penelitian</h3>
            </div>
            <ul className={`text-sm leading-relaxed space-y-3 ${subTextColor}`}>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Mengevaluasi dan membandingkan performa <strong>IndoBERT-Base</strong> vs <strong>IndoBERTweet</strong> dalam tugas klasifikasi biner kesehatan mental.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Menganalisis pengaruh penggunaan kosakata informal (slang) dan code-mixing terhadap latensi dan akurasi model.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Membangun prototipe sistem klasifikasi <i>real-time</i> berbasis web dengan pendekatan analitik untuk membantu identifikasi awal indikasi masalah kesehatan mental.</span>
              </li>
            </ul>
          </section>

          {/* Metodologi Singkat */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Metodologi Singkat</h3>
            </div>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-bold mb-1">1. Pengumpulan & Pra-pemrosesan Data</h4>
                <p className={`text-xs ${subTextColor}`}>Crawling data dari Twitter, pembersihan teks (hapus URL, mention, hashtag), normalisasi slang, dan pelabelan data secara manual (Positif vs Netral).</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-bold mb-1">2. Fine-Tuning Model Transformer</h4>
                <p className={`text-xs ${subTextColor}`}>Melakukan transfer learning pada IndoBERT-Base dan IndoBERTweet menggunakan dataset spesifik domain kesehatan mental dengan hyperparameter tuning yang optimal.</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-bold mb-1">3. Evaluasi & Inferensi</h4>
                <p className={`text-xs ${subTextColor}`}>Mengukur metrik performa (Akurasi, Presisi, Recall, F1-Score) dan performa komputasi (Latensi, Penggunaan RAM) pada skenario inferensi.</p>
              </div>
            </div>
          </section>
        </div>
        
        <div className={`sticky bottom-0 z-10 p-4 border-t flex justify-end ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'} backdrop-blur`}>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
