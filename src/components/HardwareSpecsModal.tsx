import React from 'react';
import { THESIS_INFO } from '../data/benchmarkData';
import { X, Cpu, CheckCircle2 } from 'lucide-react';

interface HardwareSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const HardwareSpecsModal: React.FC<HardwareSpecsModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  const specs = THESIS_INFO.hardwareSpecs;

  const modalBg = isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-2xl';
  const subBg = isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200';
  const subTextColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className={`border w-full max-w-lg rounded-2xl overflow-hidden ${modalBg}`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-4 border-b ${subBg}`}>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Spesifikasi Perangkat Keras Pengujian</h3>
              <p className={`text-[10px] ${subTextColor}`}>Lingkungan Komputasi Lokal (CPU Mid-Range)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content List */}
        <div className="p-5 space-y-3 text-xs">
          <div className={`p-4 rounded-xl border space-y-2.5 ${subBg}`}>
            <div className="flex items-center justify-between border-b border-slate-700/20 pb-2">
              <span className={subTextColor}>Tipe Perangkat</span>
              <span className="font-bold">{specs.device}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-700/20 pb-2">
              <span className={subTextColor}>Prosesor (CPU)</span>
              <span className="font-bold text-cyan-500 font-mono">{specs.cpu}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-700/20 pb-2">
              <span className={subTextColor}>Memori Sistem (RAM)</span>
              <span className="font-bold text-indigo-500 font-mono">{specs.ram}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-700/20 pb-2">
              <span className={subTextColor}>Pengolahan Grafis (GPU)</span>
              <span className="font-bold">{specs.gpu}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-700/20 pb-2">
              <span className={subTextColor}>Penyimpanan SSD</span>
              <span className="font-bold font-mono">{specs.storage}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={subTextColor}>Sistem Operasi</span>
              <span className="font-bold">{specs.os}</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
            isDarkMode ? 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span>Justifikasi Pengujian Hardware:</span>
            </div>
            <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Pengujian mengandalkan CPU laptop kelas konsumen (consumer-grade) tanpa GPU server untuk membuktikan efisiensi operasional sistem pada perangkat lokal (Edge Computing).
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-3 border-t text-right ${subBg}`}>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 font-semibold rounded-lg text-xs transition-colors text-white ${
              isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-unnes-blue hover:bg-blue-900'
            }`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
