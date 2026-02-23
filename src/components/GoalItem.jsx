import React from 'react';
import { CheckCircle2, Circle, Trash2, Play, Pause, Clock } from 'lucide-react';
import Countdown from './Countdown';

const GoalItem = ({ goal, onToggle, onDelete, onToggleTimer }) => {
    const formatElapsed = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
    };

    const progress = goal.targetDuration > 0
        ? Math.min((goal.elapsedTime / (goal.targetDuration * 60)) * 100, 100)
        : 0;

    return (
        <div className={`group flex flex-col gap-2 p-4 rounded-2xl border transition-all duration-300 shadow-xl overflow-hidden relative ${goal.completed
            ? 'bg-black/20 border-white/10 opacity-60 scale-[0.98]'
            : `bg-white/15 border-white/20 hover:bg-white/25 hover:-translate-y-1 ${goal.isActive ? 'border-blue-400 outline outline-2 outline-blue-400/30' : 'hover:border-white/40'}`
            }`}>

            {progress > 0 && !goal.completed && (
                <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full overflow-hidden">
                    <div
                        className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={onToggle}
                    className={`shrink-0 transition-transform hover:scale-125 ${goal.completed ? 'text-green-400' : 'text-white/50 hover:text-white'}`}
                >
                    {goal.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-bold transition-all text-glow ${goal.completed ? 'line-through text-white/40' : 'text-white leading-tight'}`}>
                        {goal.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center mt-1">
                        {goal.targetDate && (
                            <Countdown targetDate={goal.targetDate} format={goal.displayFormat} completed={goal.completed} />
                        )}
                        {goal.isActive && (
                            <div className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[9px] font-black uppercase flex items-center gap-1 border border-green-500/30">
                                <span className="w-1 h-1 bg-green-400 rounded-full animate-ping" /> Active Now
                            </div>
                        )}
                    </div>
                </div>

                <div className="no-drag flex items-center gap-1">
                    {!goal.completed && (
                        <button
                            onClick={onToggleTimer}
                            className={`p-2 rounded-xl transition-all shadow-inner ${goal.isActive ? 'bg-blue-500 text-white shadow-blue-500/50' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                        >
                            {goal.isActive ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                    )}
                    <button
                        onClick={onDelete}
                        className="p-2 rounded-xl text-white/0 group-hover:text-white/60 hover:text-red-400 hover:bg-red-400/20 transition-all no-drag shadow-inner"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {(goal.elapsedTime > 0 || (goal.actualStartTime && goal.completed)) && (
                <div className="flex flex-col gap-1 pt-1 border-t border-white/5">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-white/30">
                        <div className="flex items-center gap-1">
                            <Clock size={10} />
                            <span>Tracked: {formatElapsed(goal.elapsedTime)}</span>
                        </div>
                        {goal.completed && goal.actualEndTime && (
                            <span>Done at: {new Date(goal.actualEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                    </div>
                    {goal.completed && goal.actualStartTime && (
                        <div className="text-[8px] text-white/20 uppercase tracking-widest text-right italic">
                            Started: {new Date(goal.actualStartTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GoalItem;
