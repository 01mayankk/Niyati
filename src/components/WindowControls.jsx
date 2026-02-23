import React from 'react';
import { Minus, Square, X, Anchor } from 'lucide-react';

const WindowControls = ({ title, alwaysOnTop, onToggleAlwaysOnTop }) => {
    const electron = window.electronAPI;

    return (
        <div className="h-10 flex items-center justify-between select-none relative z-[10000] no-drag">
            {/* Draggable handle - covers the entire bar but z-indexed lower than buttons */}
            <div className="drag-handle absolute inset-0 z-10" />

            <div className="flex items-center gap-2 pl-4 pointer-events-none relative z-20">
                <span className="text-[10px] font-black tracking-[0.4em] text-white/80 uppercase title-glow">NIYATI</span>
            </div>

            <div className="flex items-stretch h-full relative z-30 no-drag">
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleAlwaysOnTop(); }}
                    className={`px-4 transition-all cursor-pointer no-drag flex items-center justify-center ${alwaysOnTop ? 'text-blue-400 bg-blue-400/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-white/30 hover:bg-white/10 hover:text-white'}`}
                    title="Always on top"
                >
                    <Anchor size={14} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); electron.minimize(); }}
                    className="px-4 text-white/30 hover:bg-white/10 hover:text-white transition-all cursor-pointer no-drag flex items-center justify-center"
                >
                    <Minus size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); electron.maximize(); }}
                    className="px-4 text-white/30 hover:bg-white/10 hover:text-white transition-all cursor-pointer no-drag flex items-center justify-center"
                >
                    <Square size={14} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); electron.close(); }}
                    className="px-8 text-white/30 hover:bg-red-500 hover:text-white transition-all cursor-pointer no-drag flex items-center justify-center group"
                    title="Close application"
                >
                    <X size={18} className="transition-transform group-hover:scale-110" />
                </button>
            </div>
        </div>
    );
};

export default WindowControls;
