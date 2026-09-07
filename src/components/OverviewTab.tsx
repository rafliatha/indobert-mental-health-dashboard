import React from 'react';
import {
  MODEL_SUMMARY_METRICS,
  CLASS_PERFORMANCE_METRICS,
  CONFUSION_MATRIX_INDOBERT_BASE,
  CONFUSION_MATRIX_INDOBERTWEET,
  THESIS_INFO,
  CROSS_VALIDATION_RESULTS
} from '../data/benchmarkData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Trophy, Zap, HardDrive, CheckCircle2, Database, BookOpen, Activity, AlertTriangle } from 'lucide-react';

interface OverviewTabProps {
  isDarkMode: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ isDarkMode }) => {
  const base = MODEL_SUMMARY_METRICS.indoBertBase;
  const tweet = MODEL_SUMMARY_METRICS.indoBertweet;

  // Data for Chart 1: Performance Metrics
  const overallData = [
    { metric: 'Akurasi', IndoBERT_Base: +(base.accuracy * 100).toFixed(2), IndoBERTweet: +(tweet.accuracy * 100).toFixed(2) },
    { metric: 'Presisi', IndoBERT_Base: +(base.precision * 100).toFixed(2), IndoBERTweet: +(tweet.precision * 100).toFixed(2) },
    { metric: 'Recall', IndoBERT_Base: +(base.recall * 100).toFixed(2), IndoBERTweet: +(tweet.recall * 100).toFixed(2) },
    { metric: 'F1-Score', IndoBERT_Base: +(base.f1Score * 100).toFixed(2), IndoBERTweet: +(tweet.f1Score * 100).toFixed(2) },
  ];

  // Data for Chart 2: Per-Class F1 Scores
  const classF1Data = CLASS_PERFORMANCE_METRICS.map((item) => ({
    category: item.category,
    IndoBERT_Base: +(item.indoBertBase.f1Score * 100).toFixed(1),
    IndoBERTweet: +(item.indoBertweet.f1Score * 100).toFixed(1),
  }));

  // Data for Chart 3: 10-Fold CV Results
  const cvChartData = CROSS_VALIDATION_RESULTS.map((item) => ({
    fold: `Fold ${item.fold}`,
    IndoBERT_Base: +(item.baseAccuracy * 100).toFixed(2),
    IndoBERTweet: +(item.tweetAccuracy * 100).toFixed(2),
  }));

  // Theme helper classes
  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-sm';
  const subCardBg = isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200';
  const subTextColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section (Banner Identitas) */}
      <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-indigo-900/50 text-white' : 'bg-gradient-to-br from-unnes-blue via-blue-900 to-indigo-900 text-white shadow-md'}`}>
        <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
          Skripsi Penelitian
        </h1>
        <p className="text-lg opacity-90 max-w-3xl leading-relaxed">
          {THESIS_INFO.title}
        </p>
      </div>

      {/* Dataset Info (Baris Kedua) */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-500/10 text-cyan-600'}`}>
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold">Informasi Dataset</h2>
        </div>
        <p className={`text-sm mb-4 ${subTextColor}`}>
          Penelitian ini menggunakan dataset sekunder berupa cuitan Twitter berbahasa Indonesia yang dikumpulkan menggunakan kata kunci terkait kesehatan mental.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border text-center ${subCardBg}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Total Dataset</p>
            <p className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-unnes-blue'}`}>2,090</p>
            <p className={`text-[10px] mt-1 ${subTextColor}`}>Cuitan Twitter</p>
          </div>
          <div className={`p-4 rounded-xl border text-center ${subCardBg}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Distribusi Label</p>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-unnes-blue'}`}>Seimbang</p>
            <p className={`text-[10px] mt-1 ${subTextColor}`}>50% Terindikasi : 50% Netral</p>
          </div>
          <div className={`p-4 rounded-xl border text-center col-span-2 flex flex-col justify-center items-center ${subCardBg}`}>
             <p className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Proporsi Pemisahan Dataset</p>
             <div className="w-full flex mt-2 h-3 rounded-full overflow-hidden">
               <div className="bg-indigo-500 w-[90%] flex items-center justify-center text-[8px] text-white font-bold" title="Data Latih (90% = 1881 data)">90% Train</div>
               <div className="bg-emerald-500 w-[10%] flex items-center justify-center text-[8px] text-white font-bold" title="Data Uji (10% = 209 data)">10% Test</div>
             </div>
             <p className={`text-[10px] mt-2 ${subTextColor}`}>* Evaluasi menggunakan 10-Fold Cross Validation (Epochs: 4, Batch Size: 16)</p>
          </div>
        </div>
      </div>

      {/* Best Model Banner */}
      <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
        isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
      }`}>
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
          <Trophy className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Model Inferensi Terbaik (Hasil 10-Fold CV)</h4>
          <p className="text-xs mt-1 opacity-90">
            Model yang disimpan untuk deployment adalah model dari fold terbaik: 
            <strong> IndoBERT-Base (Fold 2, F1-Score: 94.26%)</strong> dan 
            <strong> IndoBERTweet (Fold 2, F1-Score: 92.82%)</strong>. 
            Metrik KPI di bawah ini merepresentasikan rata-rata keseluruhan proses 10-fold CV.
          </p>
        </div>
      </div>

      {/* KPI Key Metric Cards - Colorful Dashboard Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Red/Salmon */}
        <div className={`p-5 rounded-xl shadow-sm relative overflow-hidden text-white ${
          isDarkMode ? 'bg-rose-900/40 border border-rose-800' : 'bg-[#f47c7c]'
        }`}>
          <div className="absolute -right-4 -top-4 opacity-10">
            <Trophy className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-bold tracking-tight">{(base.accuracy * 100).toFixed(2)}%</span>
            <p className="font-semibold text-sm mt-1 opacity-90">Akurasi (Accuracy)</p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-1.5 text-xs font-medium">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">IndoBERT-Base</span>
              <span className="opacity-80 ml-auto">+{((base.accuracy - tweet.accuracy) * 100).toFixed(2)}% vs Tweet</span>
            </div>
          </div>
        </div>

        {/* Card 2 - Blue/Teal */}
        <div className={`p-5 rounded-xl shadow-sm relative overflow-hidden text-white ${
          isDarkMode ? 'bg-cyan-900/40 border border-cyan-800' : 'bg-[#67b5c2]'
        }`}>
          <div className="absolute -right-4 -top-4 opacity-10">
            <CheckCircle2 className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-bold tracking-tight">{(base.precision * 100).toFixed(2)}%</span>
            <p className="font-semibold text-sm mt-1 opacity-90">Presisi (Precision)</p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-1.5 text-xs font-medium">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">IndoBERT-Base</span>
              <span className="opacity-80 ml-auto">+{((base.precision - tweet.precision) * 100).toFixed(2)}% vs Tweet</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Yellow/Amber */}
        <div className={`p-5 rounded-xl shadow-sm relative overflow-hidden text-white ${
          isDarkMode ? 'bg-amber-900/40 border border-amber-800' : 'bg-[#f0c371]'
        }`}>
          <div className="absolute -right-4 -top-4 opacity-10">
            <Zap className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-bold tracking-tight">{(base.recall * 100).toFixed(2)}%</span>
            <p className="font-semibold text-sm mt-1 opacity-90">Recall</p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-1.5 text-xs font-medium">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">IndoBERT-Base</span>
              <span className="opacity-80 ml-auto">+{((base.recall - tweet.recall) * 100).toFixed(2)}% vs Tweet</span>
            </div>
          </div>
        </div>

        {/* Card 4 - Green */}
        <div className={`p-5 rounded-xl shadow-sm relative overflow-hidden text-white ${
          isDarkMode ? 'bg-emerald-900/40 border border-emerald-800' : 'bg-[#6bc79d]'
        }`}>
          <div className="absolute -right-4 -top-4 opacity-10">
            <HardDrive className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-bold tracking-tight">{(base.f1Score * 100).toFixed(2)}%</span>
            <p className="font-semibold text-sm mt-1 opacity-90">F1-Score</p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-1.5 text-xs font-medium">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">IndoBERT-Base</span>
              <span className="opacity-80 ml-auto">+{((base.f1Score - tweet.f1Score) * 100).toFixed(2)}% vs Tweet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Overall Metrics */}
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-sm font-bold mb-1">Grafik Perbandingan Metrik Evaluasi</h3>
          <p className={`text-xs mb-4 ${subTextColor}`}>Akurasi, Presisi, Recall, dan F1-Score (%)</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} opacity={0.5} />
                <XAxis dataKey="metric" stroke={isDarkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} stroke={isDarkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: isDarkMode ? '#ffffff' : '#0f172a'
                  }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="IndoBERT_Base" name="IndoBERT-Base" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="IndoBERTweet" name="IndoBERTweet" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Per Class F1 */}
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-sm font-bold mb-1">F1-Score per Kategori Kesehatan Mental</h3>
          <p className={`text-xs mb-4 ${subTextColor}`}>Positif Terindikasi dan Netral</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classF1Data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} opacity={0.5} />
                <XAxis dataKey="category" stroke={isDarkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} stroke={isDarkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: isDarkMode ? '#ffffff' : '#0f172a'
                  }}
                  formatter={(val: any) => [`${val}%`, 'F1-Score']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="IndoBERT_Base" name="IndoBERT-Base" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="IndoBERTweet" name="IndoBERTweet" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cross Validation Results Line Chart */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <h3 className="text-sm font-bold mb-1">Hasil Akurasi 10-Fold Cross Validation</h3>
        <p className={`text-xs mb-4 ${subTextColor}`}>Perbandingan stabilitas model selama pelatihan pada setiap fold (lipatan)</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cvChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} opacity={0.5} vertical={false} />
              <XAxis dataKey="fold" stroke={isDarkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
              <YAxis domain={[85, 95]} stroke={isDarkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: isDarkMode ? '#ffffff' : '#0f172a'
                }}
                formatter={(val: any) => [`${val}%`, 'Akurasi']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line 
                type="monotone" 
                dataKey="IndoBERT_Base" 
                name="IndoBERT-Base" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="IndoBERTweet" 
                name="IndoBERTweet" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2x2 Confusion Matrix Side-by-Side */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <h3 className="text-sm font-bold mb-1">Matriks Kebingungan (2x2 Confusion Matrix)</h3>
        <p className={`text-xs mb-4 ${subTextColor}`}>Pemetaan data aktual vs hasil prediksi model</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Base matrix */}
          <div className={`p-4 rounded-xl border ${subCardBg}`}>
            <p className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-indigo-500' : 'text-unnes-blue'}`}>
              IndoBERT-Base {base.f1Score > tweet.f1Score && '(Terunggul)'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className={subTextColor}>
                    <th className="p-1.5 text-left">Aktual \ Prediksi</th>
                    <th className="p-1.5 font-semibold">Positif</th>
                    <th className="p-1.5 font-semibold">Netral</th>
                  </tr>
                </thead>
                <tbody>
                  {CONFUSION_MATRIX_INDOBERT_BASE.map((r) => (
                    <tr key={r.category} className="border-t border-slate-700/30">
                      <td className="p-2 text-left font-semibold">{r.category}</td>
                      <td className={`p-2 ${r.category === 'Positif Terindikasi (1)' ? 'bg-indigo-500/20 font-bold text-indigo-400' : ''}`}>{r.predictedPositif}</td>
                      <td className={`p-2 ${r.category === 'Netral (0)' ? 'bg-indigo-500/20 font-bold text-indigo-400' : ''}`}>{r.predictedNetral}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tweet matrix */}
          <div className={`p-4 rounded-xl border ${subCardBg}`}>
            <p className="text-xs font-bold text-emerald-500 mb-2">
              IndoBERTweet {tweet.f1Score >= base.f1Score && '(Terunggul)'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className={subTextColor}>
                    <th className="p-1.5 text-left">Aktual \ Prediksi</th>
                    <th className="p-1.5 font-semibold">Positif</th>
                    <th className="p-1.5 font-semibold">Netral</th>
                  </tr>
                </thead>
                <tbody>
                  {CONFUSION_MATRIX_INDOBERTWEET.map((r) => (
                    <tr key={r.category} className="border-t border-slate-700/30">
                      <td className="p-2 text-left font-semibold">{r.category}</td>
                      <td className={`p-2 ${r.category === 'Positif Terindikasi (1)' ? 'bg-emerald-500/20 font-bold text-emerald-400' : ''}`}>{r.predictedPositif}</td>
                      <td className={`p-2 ${r.category === 'Netral (0)' ? 'bg-emerald-500/20 font-bold text-emerald-400' : ''}`}>{r.predictedNetral}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Disclaimer Section */}
      <div className={`mt-8 p-6 rounded-2xl border flex items-start gap-4 ${
        isDarkMode ? 'bg-rose-900/10 border-rose-500/30 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}>
        <div className={`p-2 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-rose-500/20 text-rose-500' : 'bg-rose-100 text-rose-600'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base mb-1">Batasan Ruang Lingkup Sistem (Bukan Diagnosis Medis)</h3>
          <p className="text-sm leading-relaxed opacity-90 text-justify">
            Sistem tidak dirancang untuk memberikan label kondisi klinis atau diagnosis medis pengguna, melainkan dirancang secara spesifik dalam ranah <i>Natural Language Processing</i> untuk mengklasifikasikan apakah sebuah kalimat teks secara linguistik merepresentasikan indikator tekanan psikologis. <i>Dashboard</i> komparasi yang dibangun ini murni ditujukan sebagai instrumen pengujian algoritmik bagi peneliti dan tidak diklaim atau didistribusikan sebagai perangkat bantu medis (<i>medical device</i>).
          </p>
        </div>
      </div>
    </div>
  );
};
