import React, { useState, useRef } from 'react';
import { SAMPLE_TWEETS } from '../data/benchmarkData';
import { ComparisonPrediction, TweetSample } from '../types';
import { Sliders, Play, RotateCcw, CheckCircle, AlertTriangle, Sparkles, MessageSquareQuote, Upload, FileText } from 'lucide-react';

interface InferenceLabTabProps {
  isDarkMode: boolean;
  onInferenceComplete?: (result: ComparisonPrediction) => void;
  onNavigateToDashboard?: () => void;
}

export const InferenceLabTab: React.FC<InferenceLabTabProps> = ({ isDarkMode, onInferenceComplete, onNavigateToDashboard }) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_TWEETS[0].text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<ComparisonPrediction | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_TWEETS[0].id);
  const [fileName, setFileName] = useState<string | null>(null);
  const [batchLines, setBatchLines] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSample = (sample: TweetSample) => {
    setSelectedSampleId(sample.id);
    setInputText(sample.text);
    setPredictionResult(null);
    setFileName(null);
    setBatchLines([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setSelectedSampleId('');
    setPredictionResult(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n')
        .map(l => l.trim())
        .filter(line => line.length > 0 && line.toLowerCase() !== 'teks'); // ignore empty lines and header 'teks'
      
      if (lines.length > 0) {
        setBatchLines(lines);
        setInputText(`[MODE BATCH] File memuat ${lines.length} cuitan.\n\nKlik "Jalankan Prediksi Komparatif" untuk menguji semua cuitan secara otomatis. Hasil dari setiap cuitan akan dikirim ke "Riwayat Pengujian" di Tab Evaluasi.`);
      }
    };
    reader.readAsText(file);
  };

  const handleRunInference = async () => {
    if (!inputText.trim() && batchLines.length === 0) return;
    setIsLoading(true);

    try {
      if (batchLines.length > 0) {
        // Mode Batch
        for (let i = 0; i < batchLines.length; i++) {
          const line = batchLines[i];
          const response = await fetch('/api/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: line }),
          });
          
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || 'Gagal terhubung ke model inference backend.');
          }
          
          const data: ComparisonPrediction = await response.json();
          setPredictionResult(data); // update UI per cuitan
          if (onInferenceComplete) {
            onInferenceComplete(data);
          }
          // Update status text
          setInputText(`[MEMPROSES BATCH ${i + 1}/${batchLines.length}]\n\n"${line}"`);
        }
        setInputText(`✅ [SELESAI] ${batchLines.length} cuitan telah berhasil diproses!\n\nMengarahkan Anda ke tab Evaluasi & Analisis Komparatif secara otomatis...`);
        
        // Jeda sedikit agar tulisan selesai terbaca, lalu pindah tab
        setTimeout(() => {
          setBatchLines([]);
          setFileName(null);
          setInputText('');
          if (onNavigateToDashboard) {
            onNavigateToDashboard();
          }
        }, 1500);
      } else {
        // Mode Tunggal
        const response = await fetch('/api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Gagal terhubung ke model inference backend.');
        }
        
        const data: ComparisonPrediction = await response.json();
        setPredictionResult(data);
        if (onInferenceComplete) {
          onInferenceComplete(data);
        }
      }
    } catch (err: any) {
      console.error('Inference error:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-sm';
  const subCardBg = isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200';
  const subTextColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  const getLabelBadgeColor = (label: string) => {
    switch (label) {
      case 'Positif Terindikasi (1)':
        return isDarkMode ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Netral (0)':
        return isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sliders className={`w-5 h-5 ${isDarkMode ? 'text-indigo-500' : 'text-unnes-blue'}`} />
              Simulasi Prediksi Model
            </h2>
            <p className={`text-xs mt-0.5 ${subTextColor}`}>
              Uji langsung cuitan bahasa Indonesia untuk membandingkan hasil klasifikasi &amp; latensi model IndoBERT-Base vs IndoBERTweet.
            </p>
          </div>

        </div>

        {/* Input Text Area & Actions */}
        <div className="mt-5 space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Masukkan Teks Cuitan Pengujian:
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setSelectedSampleId('');
                }}
                rows={3}
                placeholder="Contoh: jujur aku capek mental bgt overthinking terus tiap malem rasanya pengen nyerah..."
                className={`w-full rounded-xl p-3.5 text-xs font-sans transition-all resize-none border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <span className={`absolute right-3 bottom-3 text-[10px] font-mono ${subTextColor}`}>
                {inputText.length} Karakter
              </span>
            </div>
            {fileName && (
              <div className={`mt-2 flex items-center gap-2 text-[11px] font-medium px-3 py-1.5 rounded-lg border inline-flex ${
                isDarkMode ? 'bg-indigo-950/30 border-indigo-800/50 text-indigo-300' : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <FileText className="w-3.5 h-3.5" />
                <span>File dimuat: {fileName}</span>
                <button 
                  onClick={() => {
                    setFileName(null);
                    setInputText('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="ml-2 hover:opacity-70 transition-opacity"
                  title="Hapus file"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunInference}
                disabled={isLoading || !inputText.trim()}
                className={`flex items-center gap-2 px-5 py-2.5 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-all shadow-md ${
                  isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20' : 'bg-unnes-blue hover:bg-blue-900 shadow-unnes-blue/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses Model...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Jalankan Prediksi Komparatif</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setInputText('');
                  setPredictionResult(null);
                  setSelectedSampleId('');
                  setFileName(null);
                  setBatchLines([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                }`}
                title="Bersihkan Teks"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Upload Button */}
              <div className="relative">
                <input 
                  type="file" 
                  accept=".csv,.txt"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="file-upload" 
                />
                <label 
                  htmlFor="file-upload" 
                  className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer rounded-xl border transition-colors text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                  title="Upload file CSV atau TXT untuk batch testing"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">{fileName ? 'Ubah File' : 'Upload CSV/TXT'}</span>
                </label>
              </div>
            </div>

            <span className={`text-[11px] ${subTextColor}`}>
              *Model Transformer 12-Layer Base
            </span>
          </div>
        </div>

        {/* Sample Datasets Selector Chips */}
        <div className="mt-5 pt-4 border-t border-slate-800/40 space-y-2">
          <p className={`text-xs font-semibold flex items-center gap-1.5 ${subTextColor}`}>
            <MessageSquareQuote className={`w-3.5 h-3.5 ${isDarkMode ? 'text-indigo-500' : 'text-unnes-blue'}`} />
            Contoh Cuitan Sampel Skripsi:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TWEETS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`text-left px-3 py-1.5 rounded-lg border text-xs transition-all ${
                  selectedSampleId === sample.id
                    ? isDarkMode
                      ? 'bg-indigo-950 text-indigo-200 border-indigo-500'
                      : 'bg-unnes-yellow/20 text-unnes-blue border-unnes-yellow font-semibold'
                    : isDarkMode
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                "{sample.text.length > 50 ? sample.text.slice(0, 50) + '...' : sample.text}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prediction Results Display */}
      {predictionResult && (() => {
        // Calculate recommended model dynamically
        const baseProb = Math.max(...Object.values(predictionResult.indoBertBase.probabilities));
        const tweetProb = Math.max(...Object.values(predictionResult.indoBertweet.probabilities));
        
        let isBaseBest = false;
        
        // Use probability as primary factor. If difference is negligible, use latency.
        if (Math.abs(baseProb - tweetProb) > 0.001) {
           isBaseBest = baseProb > tweetProb;
        } else {
           isBaseBest = predictionResult.indoBertBase.latencyMs < predictionResult.indoBertweet.latencyMs;
        }
        
        const bestModelName = isBaseBest ? 'IndoBERT-Base' : 'IndoBERTweet';

        return (
        <div className="space-y-6">
          {/* Rule Filter Notice */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardBg}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                predictionResult.firstPersonValidated
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
              }`}>
                {predictionResult.firstPersonValidated ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-bold block">
                  Anotasi Linguistik: {predictionResult.firstPersonValidated ? 'Sudut Pandang Orang Pertama (Aku/Gue)' : 'Eksklusi / Third-Person / Edukasi'}
                </span>
                <p className={`text-xs mt-0.5 ${subTextColor}`}>
                  {predictionResult.analysisNote}
                </p>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-center shrink-0 ${subCardBg}`}>
              <span className={`text-[10px] font-semibold block uppercase ${subTextColor}`}>Model Direkomendasikan</span>
              <span className="text-xs font-black text-emerald-500 mt-0.5 block">{bestModelName}</span>
            </div>
          </div>

          {/* Model Side-by-Side Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IndoBERT-Base Card */}
            <div className={`p-6 rounded-2xl border ${isBaseBest ? 'border-2 border-emerald-500/50' : ''} space-y-4 relative ${cardBg}`}>
              {isBaseBest && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Terunggul
                </div>
              )}
              <div className="flex items-center justify-between border-b pb-3 border-slate-700/30">
                <div>
                  <h3 className="text-sm font-bold">IndoBERT-Base</h3>
                  <p className={`text-[10px] ${subTextColor}`}>Korpus Formal Wikipedia/Berita</p>
                </div>
                <span className={`text-xs px-3 py-0.5 rounded-full border font-bold ${getLabelBadgeColor(predictionResult.indoBertBase.label)}`}>
                  {predictionResult.indoBertBase.label}
                </span>
              </div>

              {/* Confidence bars */}
              <div className="space-y-2.5">
                <p className={`text-xs font-bold ${subTextColor}`}>Probabilitas Prediksi Kelas:</p>
                {(['Positif Terindikasi (1)', 'Netral (0)'] as const).map((cat) => {
                  const prob = predictionResult.indoBertBase.probabilities[cat] || 0;
                  const pct = +(prob * 100).toFixed(1);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={subTextColor}>{cat}</span>
                        <span className="font-mono font-semibold">{pct}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            cat === 'Positif Terindikasi (1)' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hardware Performance stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`p-3 rounded-xl border text-center ${subCardBg}`}>
                  <span className={`text-[10px] uppercase font-bold block ${subTextColor}`}>Latensi CPU</span>
                  <p className="text-sm font-bold mt-0.5">{predictionResult.indoBertBase.latencyMs} ms</p>
                </div>
                <div className={`p-3 rounded-xl border text-center ${subCardBg}`}>
                  <span className={`text-[10px] uppercase font-bold block ${subTextColor}`}>Peak RAM</span>
                  <p className="text-sm font-bold mt-0.5">{predictionResult.indoBertBase.ramUsageMb} MB</p>
                </div>
              </div>

              {/* Tokenization Breakdown */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subCardBg}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Subword Tokenization:</span>
                  <span className="text-[10px] text-amber-500 font-mono font-bold">OOV: {predictionResult.indoBertBase.oovCount}</span>
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-[11px] max-h-20 overflow-y-auto pt-1">
                  {predictionResult.indoBertBase.subwords.map((tok, idx) => (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.5 rounded border ${
                        tok === '[CLS]' || tok === '[SEP]'
                          ? 'bg-slate-800 text-slate-300 font-bold border-slate-700'
                          : predictionResult.indoBertBase.label === 'Positif Terindikasi (1)'
                          ? (isDarkMode ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-amber-500/10 text-amber-700 border-amber-500/40')
                          : (isDarkMode ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/40')
                      }`}
                    >
                      {tok}
                    </span>
                  ))}
                </div>
                <p className={`text-[11px] italic pt-1 ${subTextColor}`}>
                  {predictionResult.indoBertBase.explanation}
                </p>
              </div>


            </div>

            {/* IndoBERTweet Card */}
            <div className={`p-6 rounded-2xl border ${!isBaseBest ? 'border-2 border-emerald-500/50' : ''} space-y-4 relative ${cardBg}`}>
              {!isBaseBest && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Terunggul
                </div>
              )}

              <div className="flex items-center justify-between border-b pb-3 border-slate-700/30">
                <div>
                  <h3 className="text-sm font-bold text-emerald-500">IndoBERTweet</h3>
                  <p className={`text-[10px] ${subTextColor}`}>Korpus Adaptif Twitter (3M+ Cuitan)</p>
                </div>
                <span className={`text-xs px-3 py-0.5 rounded-full border font-bold ${getLabelBadgeColor(predictionResult.indoBertweet.label)}`}>
                  {predictionResult.indoBertweet.label}
                </span>
              </div>

              {/* Confidence bars */}
              <div className="space-y-2.5">
                <p className={`text-xs font-bold ${subTextColor}`}>Probabilitas Prediksi Kelas:</p>
                {(['Positif Terindikasi (1)', 'Netral (0)'] as const).map((cat) => {
                  const prob = predictionResult.indoBertweet.probabilities[cat] || 0;
                  const pct = +(prob * 100).toFixed(1);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={subTextColor}>{cat}</span>
                        <span className="font-mono font-semibold text-emerald-500">{pct}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            cat === 'Positif Terindikasi (1)' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hardware Performance stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`p-3 rounded-xl border text-center ${subCardBg}`}>
                  <span className={`text-[10px] uppercase font-bold block ${subTextColor}`}>Latensi CPU</span>
                  <p className="text-sm font-bold text-emerald-500 mt-0.5">{predictionResult.indoBertweet.latencyMs} ms</p>
                </div>
                <div className={`p-3 rounded-xl border text-center ${subCardBg}`}>
                  <span className={`text-[10px] uppercase font-bold block ${subTextColor}`}>Peak RAM</span>
                  <p className="text-sm font-bold text-emerald-500 mt-0.5">{predictionResult.indoBertweet.ramUsageMb} MB</p>
                </div>
              </div>

              {/* Tokenization Breakdown */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subCardBg}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Subword Tokenization:</span>
                  <span className="text-[10px] text-emerald-500 font-mono font-bold">OOV: {predictionResult.indoBertweet.oovCount}</span>
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-[11px] max-h-20 overflow-y-auto pt-1">
                  {predictionResult.indoBertweet.subwords.map((tok, idx) => (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.5 rounded border ${
                        tok === '[CLS]' || tok === '[SEP]'
                          ? 'bg-slate-800 text-slate-300 font-bold border-slate-700'
                          : predictionResult.indoBertweet.label === 'Positif Terindikasi (1)'
                          ? (isDarkMode ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-amber-500/10 text-amber-700 border-amber-500/40')
                          : (isDarkMode ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/40')
                      }`}
                    >
                      {tok}
                    </span>
                  ))}
                </div>
                <p className={`text-[11px] italic pt-1 ${subTextColor}`}>
                  {predictionResult.indoBertweet.explanation}
                </p>
              </div>


            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};
