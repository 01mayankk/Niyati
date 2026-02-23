import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate, format, completed }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (completed || !targetDate) return;

        const calculate = () => {
            const now = new Date();
            const target = new Date(targetDate);
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft('Time up!');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            const totalHours = Math.floor(diff / (1000 * 60 * 60));
            const totalMinutes = Math.floor(diff / (1000 * 60));

            const isToday = days === 0;

            switch (format) {
                case 'clock':
                    setTimeLeft(`${days > 0 ? days + 'd ' : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                    break;
                case 'hms':
                    setTimeLeft(`${String(totalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                    break;
                case 'total_hours':
                    setTimeLeft(`${totalHours} Hours left`);
                    break;
                case 'natural':
                default:
                    if (days > 0) setTimeLeft(`${days}d ${hours}h left`);
                    else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m left`);
                    else if (minutes > 0) setTimeLeft(`${minutes}m ${seconds}s left`);
                    else setTimeLeft(`${seconds}s left`);
                    break;
            }
        };

        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [targetDate, format, completed]);

    if (!targetDate || completed) return null;

    return (
        <div className="text-[10px] font-mono font-bold text-blue-300 mt-1 uppercase tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded-md inline-block shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            {timeLeft}
        </div>
    );
};

export default Countdown;
