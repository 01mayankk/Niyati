import React, { useState, useEffect } from 'react';
import { Plus, Settings, Calendar, CheckCircle2, Circle, Trash2, X, LayoutDashboard, Clock, BarChart3, TrendingUp } from 'lucide-react';
import { useGoals } from './hooks/useGoals';
import { useSettings } from './hooks/useSettings';
import WindowControls from './components/WindowControls';
import GoalItem from './components/GoalItem';

const App = () => {
    const { goals, addGoal, toggleGoal, deleteGoal, editGoal, toggleTimer, updateElapsedTime } = useGoals();
    const { settings, updateBackground, toggleSetting } = useSettings();
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [targetDuration, setTargetDuration] = useState('');
    const [displayFormat, setDisplayFormat] = useState('natural');
    const [activeCategory, setActiveCategory] = useState('Daily');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const activeGoal = goals.find(g => g.isActive && !g.completed);
            if (activeGoal) {
                updateElapsedTime(activeGoal.id, 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [goals]);

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoalTitle.trim()) return;
        addGoal(newGoalTitle, activeCategory, targetDate, displayFormat, targetDuration || 0);
        setNewGoalTitle('');
        setTargetDate('');
        setTargetDuration('');
    };

    const filteredGoals = goals.filter(g => g.category === activeCategory);

    return (
        <div className="main-container shadow-2xl overflow-hidden"
            style={{
                background: settings.background.type === 'color' ? settings.background.value :
                    settings.background.type === 'gradient' ? settings.background.value :
                        `url(${settings.background.value}) center/cover no-repeat`,
            }}
        >
            <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{ backdropFilter: `blur(${settings.background.blur}px)` }} />


            <main className="flex-1 flex flex-col p-6 pt-12 z-10 overflow-hidden relative">
                <header className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-[1px] w-4 bg-blue-500" />
                        <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">Destiny Suite</span>
                    </div>
                    <h1 className="text-5xl font-black text-white mb-1 title-glow tracking-tighter leading-none">Your Destiny</h1>
                    <div className="flex justify-between items-center pr-2">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        {goals.some(g => g.isActive) && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50">
                                <span className="text-[10px] font-black text-white uppercase">Focusing</span>
                            </div>
                        )}
                    </div>
                </header>

                <nav className="flex gap-2 mb-6 no-drag overflow-x-auto pb-2 scrollbar-hide">
                    {['Daily', 'Weekly', 'Monthly', 'Long Term'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-lg whitespace-nowrap ${activeCategory === cat
                                ? 'bg-white text-black border-white scale-105'
                                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>

                <div className="mb-6 space-y-3 no-drag glass p-4 rounded-2xl border-white/20">
                    <form onSubmit={handleAddGoal} className="space-y-4">
                        <div className="relative group">
                            <input
                                type="text"
                                value={newGoalTitle}
                                onChange={(e) => setNewGoalTitle(e.target.value)}
                                placeholder={`Goal for ${activeCategory.toLowerCase()}...`}
                                className="w-full bg-black/20 border border-white/20 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black hover:bg-blue-400 hover:text-white rounded-lg transition-all shadow-lg"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className={`grid ${activeCategory === 'Daily' ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                            {activeCategory !== 'Daily' && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-white/50 font-black uppercase ml-1">Deadline Date</label>
                                    <input
                                        type="datetime-local"
                                        value={targetDate}
                                        onChange={(e) => setTargetDate(e.target.value)}
                                        className="w-full bg-black/20 border border-white/20 rounded-xl py-2 px-3 text-white text-[10px] focus:outline-none focus:ring-2 focus:ring-white/30"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-white/50 font-black uppercase ml-1">
                                    {activeCategory === 'Daily' ? 'Study/Work Goal (Minutes)' : 'Target Duration (Min)'}
                                </label>
                                <input
                                    type="number"
                                    value={targetDuration}
                                    onChange={(e) => setTargetDuration(e.target.value)}
                                    placeholder={activeCategory === 'Daily' ? 'e.g. 120 (for 2 hours)' : 'e.g. 240'}
                                    className="w-full bg-black/20 border border-white/20 rounded-xl py-2 px-3 text-white text-[10px] focus:outline-none focus:ring-2 focus:ring-white/30"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar no-drag">
                    {filteredGoals.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 text-white py-10">
                            <Calendar size={64} className="mb-4 text-white/50" />
                            <p className="text-lg font-bold text-glow text-center">Your path is clear.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {filteredGoals.map(goal => (
                                <GoalItem
                                    key={goal.id}
                                    goal={goal}
                                    onToggle={() => toggleGoal(goal.id)}
                                    onDelete={() => deleteGoal(goal.id)}
                                    onToggleTimer={() => toggleTimer(goal.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="p-4 flex gap-4 items-center z-10 no-drag">
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 hover:text-white transition-all border border-white/10 shadow-lg"
                >
                    <Settings size={20} />
                </button>
                <button
                    onClick={() => setIsDashboardOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 hover:text-white transition-all border border-white/10 shadow-lg font-black uppercase text-[10px] tracking-widest"
                >
                    <LayoutDashboard size={18} />
                    <span>View Progress Dashboard</span>
                </button>
            </footer>

            {isSettingsOpen && (
                <SettingsOverlay
                    settings={settings}
                    updateBackground={updateBackground}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}

            <div className="absolute top-0 left-0 right-0 z-[10000]">
                <WindowControls
                    title="NIYATI"
                    alwaysOnTop={settings.alwaysOnTop}
                    onToggleAlwaysOnTop={() => toggleSetting('alwaysOnTop')}
                />
            </div>

            {isDashboardOpen && (
                <DashboardOverlay
                    goals={goals}
                    onClose={() => setIsDashboardOpen(false)}
                />
            )}
        </div>
    );
};

const DashboardOverlay = ({ goals, onClose }) => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    const totalFocusSeconds = goals.reduce((acc, g) => acc + (g.elapsedTime || 0), 0);
    const focusHours = Math.floor(totalFocusSeconds / 3600);
    const focusMinutes = Math.floor((totalFocusSeconds % 3600) / 60);

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-10">
                <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all">
                    <X size={28} />
                </button>
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="text-blue-400" size={28} />
                    <h2 className="text-2xl font-black text-white title-glow">Dashboard</h2>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                        <TrendingUp size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Completion</span>
                    </div>
                    <div className="text-4xl font-black text-white">{completionRate}%</div>
                    <div className="text-[10px] text-white/20 mt-1 uppercase font-bold">{completedGoals}/{totalGoals} Goals Done</div>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                        <Clock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Focus Time</span>
                    </div>
                    <div className="text-4xl font-black text-white">{focusHours}<span className="text-lg text-white/40">h</span> {focusMinutes}<span className="text-lg text-white/40">m</span></div>
                    <div className="text-[10px] text-white/20 mt-1 uppercase font-bold">Accumulated Focus</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar no-drag">
                <section>
                    <h3 className="text-xs font-black text-white/50 uppercase mb-4 tracking-widest border-l-4 border-blue-400 pl-3">Category Breakdown</h3>
                    <div className="space-y-4">
                        {['Daily', 'Weekly', 'Monthly', 'Long Term'].map(cat => {
                            const catGoals = goals.filter(g => g.category === cat);
                            const catCompleted = catGoals.filter(g => g.completed).length;
                            const perc = catGoals.length > 0 ? (catCompleted / catGoals.length) * 100 : 0;
                            return (
                                <div key={cat} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black text-white uppercase tracking-wider">
                                        <span>{cat}</span>
                                        <span className="text-white/40">{catCompleted}/{catGoals.length}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${perc}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="bg-blue-600/10 p-5 rounded-3xl border border-blue-500/20 shadow-inner">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-xl">
                            <BarChart3 className="text-white" size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-sm uppercase">Pro Tip</h4>
                            <p className="text-white/50 text-[10px] leading-tight">Consistency is the key to destiny. Keep tracking your focus sessions to build momentum.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const SettingsOverlay = ({ settings, updateBackground, onClose }) => {
    const categories = {
        'Nature': [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
            'https://images.unsplash.com/photo-1501854140801-50d01698950b',
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
            'https://images.unsplash.com/photo-1426604966848-d7adac402bff',
            'https://images.unsplash.com/photo-1510784722466-f2aa9c52fed6',
            'https://images.unsplash.com/photo-1475924156735-5a10878170ed',
            'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
            'https://images.unsplash.com/photo-1518173959656-691ca275f3a1',
            'https://images.unsplash.com/photo-1433086966358-54859d0ed716'
        ].map(u => `${u}?auto=format&fit=crop&q=80&w=800`),
        'Universe': [
            'https://images.unsplash.com/photo-1464802686167-b939a67e06a1',
            'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa',
            'https://images.unsplash.com/photo-1506318137071-a8e063b4b4bf',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
            'https://images.unsplash.com/photo-1446776877081-d282a0f896e2',
            'https://images.unsplash.com/photo-1534447677768-be436bb09401',
            'https://images.unsplash.com/photo-1484589065579-248adc0152fd',
            'https://images.unsplash.com/photo-1462332420958-a05d1e002413',
            'https://images.unsplash.com/photo-1502134249126-9f3755a50d78',
            'https://images.unsplash.com/photo-1537420327992-d6e192287183',
            'https://images.unsplash.com/photo-1504333638930-c8787321eba0',
            'https://images.unsplash.com/photo-1444464666168-49d633b86747'
        ].map(u => `${u}?auto=format&fit=crop&q=80&w=800`),
        'Galaxy': [
            'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
            'https://images.unsplash.com/photo-1444703686981-a3abb99d4fe3',
            'https://images.unsplash.com/photo-1516331138075-f3ad1674221c',
            'https://images.unsplash.com/photo-1502134249126-9f3755a50d78',
            'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e',
            'https://images.unsplash.com/photo-1505506819544-223d9d642082',
            'https://images.unsplash.com/photo-1538370910411-fa66e99d4691',
            'https://images.unsplash.com/photo-1516339901600-2e3a8ad0f1d8',
            'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a',
            'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1',
            'https://images.unsplash.com/photo-1516239482977-b550ba7253f2',
            'https://images.unsplash.com/photo-1506466010722-395ee2bef877'
        ].map(u => `${u}?auto=format&fit=crop&q=80&w=800`),
        'Animals': [
            'https://images.unsplash.com/photo-1474511320723-9a56873867b5',
            'https://images.unsplash.com/photo-1546182990-dffeafbe841d',
            'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d',
            'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f',
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
            'https://images.unsplash.com/photo-1543946207-39bd91e70ca7',
            'https://images.unsplash.com/photo-1575550959106-5a7defe28b56',
            'https://images.unsplash.com/photo-1555169062-013468b47731',
            'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
            'https://images.unsplash.com/photo-1517849845537-4d257902454a',
            'https://images.unsplash.com/photo-1450778869180-41d0601e046e',
            'https://images.unsplash.com/photo-1534361960057-19889db9621e'
        ].map(u => `${u}?auto=format&fit=crop&q=80&w=800`)
    };

    const solidColors = ['#FF512F', '#00F2FE', '#8E2DE2', '#11998E', '#3E5151'];

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-2xl p-6 flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <X size={28} />
                    </button>
                    <h2 className="text-2xl font-black text-white title-glow">Personalize</h2>
                </div>
                <div className="flex flex-col items-end opacity-40">
                    <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">NIYATI</span>
                    <span className="text-[8px] font-bold text-white/60 uppercase">Version 1.0.0</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar no-drag">
                <section>
                    <h3 className="text-[10px] font-black text-white/40 uppercase mb-4 tracking-[0.2em] border-l-2 border-white pl-3">Custom Solid Color</h3>
                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 items-center">
                        <input
                            type="color"
                            value={settings.background.type === 'color' ? settings.background.value : '#ffffff'}
                            onChange={(e) => updateBackground({ type: 'color', value: e.target.value })}
                            className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                        />
                        <div className="flex-1">
                            <p className="text-xs text-white font-bold mb-1">Pick a Custom Color</p>
                            <input
                                type="text"
                                value={settings.background.type === 'color' ? settings.background.value : '#000000'}
                                onChange={(e) => updateBackground({ type: 'color', value: e.target.value })}
                                className="bg-black/40 border border-white/20 rounded px-3 py-1.5 text-[10px] text-white w-32 font-mono focus:outline-none focus:ring-1 focus:ring-white/30"
                            />
                        </div>
                    </div>
                </section>

                {Object.entries(categories).map(([name, imgs]) => (
                    <section key={name}>
                        <h3 className="text-[10px] font-black text-white/40 uppercase mb-3 tracking-[0.2em] border-l-2 border-white/40 pl-3">{name}</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {imgs.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => updateBackground({ type: 'image', value: url })}
                                    className="aspect-video rounded-xl border border-white/10 overflow-hidden hover:scale-105 transition-all hover:border-white/50 shadow-lg"
                                >
                                    <img src={url} className="w-full h-full object-cover" alt={name} />
                                </button>
                            ))}
                        </div>
                    </section>
                ))}

                <section>
                    <h3 className="text-[10px] font-black text-white/40 uppercase mb-4 tracking-[0.2em] border-l-2 border-white/40 pl-3">Blur Intensity</h3>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-white font-bold text-[10px] uppercase">Softness</span>
                            <span className="bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-full">{settings.background.blur}PX</span>
                        </div>
                        <input
                            type="range" min="0" max="40" value={settings.background.blur}
                            onChange={(e) => updateBackground({ blur: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default App;
