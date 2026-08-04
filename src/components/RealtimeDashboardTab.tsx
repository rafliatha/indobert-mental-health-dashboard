import React from 'react';
import { ComparisonPrediction } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  LineChart, Line, Cell
} from 'recharts';
import { Activity, Clock, Cpu, Server, Zap, History, MessageSquareQuote } from 'lucide-react';

interface RealtimeDashboardTabProps {
  isDarkMode: boolean;
  history: ComparisonPrediction[];
}

export const RealtimeDashboardTab: React.FC<RealtimeDashboardTabProps> = ({ isDarkMode, history }) => {
  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-800';
  const subTextColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const chartAxisColor = isDarkMode ? '#64748b' : '#94a3b8';
  const chartGridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const tooltipBg = isDarkMode ? '#0f172a' : '#ffffff';

  if (history.length === 0) {
    return (
      <div className={`p-10 rounded-2xl border text-center flex flex-col items-center justify-center min-h-[400px] ${cardBg}`}>
        <Activity className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
        <h2 className="text-xl font-bold mb-2">Belum Ada Data Evaluasi Real-Time</h2>
        <p className={subTextColor}>Silakan lakukan pengujian prediksi pada tab <strong>Inference Lab</strong> untuk melihat metrik komputasi dan hasil klasifikasi secara real-time di sini.</p>
      </div>
    );
  }

  // Calculate aggregates
  const totalInference = history.length;
  
  const avgLatencyBase = history.reduce((acc, curr) => acc + curr.indoBertBase.latencyMs, 0) / totalInference;
  const avgLatencyTweet = history.reduce((acc, curr) => acc + curr.indoBertweet.latencyMs, 0) / totalInference;
  
  const avgRamBase = history.reduce((acc, curr) => acc + curr.indoBertBase.ramUsageMb, 0) / totalInference;
  const avgRamTweet = history.reduce((acc, curr) => acc + curr.indoBertweet.ramUsageMb, 0) / totalInference;

  // Distribution of classes by IndoBERTweet (which is our recommended model)
  const classDist = history.reduce((acc, curr) => {
    const label = curr.indoBertweet.label;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const classData = Object.entries(classDist).map(([name, count]) => ({ name, count }));

  // Trend data over time (last 10 inferences if many)
  const trendData = history.slice(-15).map((curr, idx) => ({
    name: `Test ${Math.max(1, totalInference - 15 + 1 + idx)}`,
    'Latensi IndoBERT-Base': curr.indoBertBase.latencyMs,
    'Latensi IndoBERTweet': curr.indoBertweet.latencyMs,
  }));

  const metricsData = [
    {
      name: 'Rata-rata Latensi (ms)',
      'IndoBERT-Base': +avgLatencyBase.toFixed(1),
      'IndoBERTweet': +avgLatencyTweet.toFixed(1)
    },
    {
      name: 'Rata-rata RAM (MB)',
      'IndoBERT-Base': +avgRamBase.toFixed(1),
      'IndoBERTweet': +avgRamTweet.toFixed(1)
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-unnes-blue'}`} />
          Dashboard Evaluasi Real-Time
        </h2>
        <p className={`text-sm mt-1 ${subTextColor}`}>
          Berdasarkan {totalInference} riwayat inferensi yang dilakukan di sesi ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${subTextColor}`}>Total Uji Coba</div>
          <div className="text-3xl font-black">{totalInference}</div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${subTextColor}`}>
            <Clock className="w-3.5 h-3.5" /> Latensi IndoBERTweet
          </div>
          <div className="text-3xl font-black text-emerald-500">{avgLatencyTweet.toFixed(1)} <span className="text-sm font-medium text-slate-500">ms</span></div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${subTextColor}`}>
            <Server className="w-3.5 h-3.5" /> RAM IndoBERTweet
          </div>
          <div className="text-3xl font-black text-cyan-500">{avgRamTweet.toFixed(0)} <span className="text-sm font-medium text-slate-500">MB</span></div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${subTextColor}`}>
            <Zap className="w-3.5 h-3.5" /> Latensi IndoBERT-Base
          </div>
          <div className="text-3xl font-black text-indigo-500">{avgLatencyBase.toFixed(1)} <span className="text-sm font-medium text-slate-500">ms</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Comparison Chart */}
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-sm font-bold mb-1">Perbandingan Komputasi (Rata-rata)</h3>
          <p className={`text-xs mb-4 ${subTextColor}`}>Latensi (ms) dan Penggunaan RAM (MB)</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                <XAxis dataKey="name" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: chartGridColor, borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }}
                  cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="IndoBERT-Base" fill={isDarkMode ? '#6366f1' : '#4f46e5'} radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="IndoBERTweet" fill={isDarkMode ? '#10b981' : '#059669'} radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Trend Chart */}
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-sm font-bold mb-1">Tren Latensi Inferensi (Real-Time)</h3>
          <p className={`text-xs mb-4 ${subTextColor}`}>Perbandingan waktu respons 15 pengujian terakhir</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                <XAxis dataKey="name" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: chartGridColor, borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Latensi IndoBERT-Base" stroke={isDarkMode ? '#818cf8' : '#4f46e5'} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Latensi IndoBERTweet" stroke={isDarkMode ? '#34d399' : '#059669'} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution of Labels */}
        <div className={`p-6 rounded-2xl border lg:col-span-2 ${cardBg}`}>
          <h3 className="text-sm font-bold mb-1">Distribusi Hasil Klasifikasi (IndoBERTweet)</h3>
          <p className={`text-xs mb-4 ${subTextColor}`}>Berdasarkan hasil pengujian di sesi saat ini</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} horizontal={false} />
                <XAxis type="number" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} width={150} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: chartGridColor, borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }}
                  cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                />
                <Bar dataKey="count" fill={isDarkMode ? '#f59e0b' : '#d97706'} radius={[0, 4, 4, 0]} barSize={32} name="Jumlah Prediksi">
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name.includes('Positif') ? (isDarkMode ? '#f59e0b' : '#d97706') : (isDarkMode ? '#10b981' : '#059669')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Inference History */}
      <div className={`p-6 rounded-2xl border mt-6 ${cardBg}`}>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
          <History className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-unnes-blue'}`} />
          Riwayat Pengujian Detail
        </h3>
        <p className={`text-xs mb-6 ${subTextColor}`}>Daftar lengkap cuitan yang telah diuji beserta perbandingan hasil dari kedua model</p>
        
        <div className="space-y-4">
          {[...history].reverse().map((item, index) => (
            <div key={index} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex flex-col mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageSquareQuote className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold text-slate-500">Teks Masukan:</span>
                </div>
                <p className="text-sm italic">"{item.inputText}"</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* IndoBERT-Base Result */}
                <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold block text-slate-500 mb-1">Hasil IndoBERT-Base</span>
                  <span className={`text-xs px-2.5 py-1 rounded border font-bold inline-block ${
                    item.indoBertBase.label === 'Positif Terindikasi (1)' 
                      ? (isDarkMode ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-800 border-amber-300')
                      : (isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border-emerald-300')
                  }`}>
                    {item.indoBertBase.label}
                  </span>
                </div>

                {/* IndoBERTweet Result */}
                <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-emerald-50/50 border-emerald-100'}`}>
                  <span className="text-[10px] uppercase font-bold block text-emerald-600 dark:text-emerald-500 mb-1">Hasil IndoBERTweet</span>
                  <span className={`text-xs px-2.5 py-1 rounded border font-bold inline-block ${
                    item.indoBertweet.label === 'Positif Terindikasi (1)' 
                      ? (isDarkMode ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-800 border-amber-300')
                      : (isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border-emerald-300')
                  }`}>
                    {item.indoBertweet.label}
                  </span>
                </div>
              </div>
              
              {/* Tokenization and Keywords */}
              {item.indoBertweet.wordWeights && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  {/* Tokenization Subwords */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Subword Tokenization:</span>
                      <span className="text-[9px] font-bold text-emerald-500 font-mono">OOV: {item.indoBertweet.oovCount}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 font-mono text-[10px] max-h-16 overflow-y-auto">
                      {item.indoBertweet.subwords.map((tok, idx) => (
                        <span
                          key={idx}
                          className={`px-1 py-0.5 rounded border ${
                            tok === '[CLS]' || tok === '[SEP]'
                              ? 'bg-slate-800 text-slate-300 font-bold border-slate-700'
                              : (isDarkMode ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30')
                          }`}
                        >
                          {tok}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold block mb-1.5 text-slate-500">Kata Kunci Utama (Bobot Tertinggi):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.indoBertweet.wordWeights
                      .filter(w => w.weight > 0.3) // Only show important keywords
                      .map((w, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isDarkMode 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {w.word}
                      </span>
                    ))}
                    {item.indoBertweet.wordWeights.filter(w => w.weight > 0.3).length === 0 && (
                      <span className="text-[11px] italic text-slate-500">- Tidak ada kata kunci dominan -</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
