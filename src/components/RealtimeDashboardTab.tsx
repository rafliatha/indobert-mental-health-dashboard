import React from 'react';
import { ComparisonPrediction } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  LineChart, Line, Cell
} from 'recharts';
import { Activity, Clock, Cpu, Server, Zap } from 'lucide-react';

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
    </div>
  );
};
