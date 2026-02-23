import { useState, useEffect } from 'react';

export const useSettings = () => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('niyati-settings');
        return saved ? JSON.parse(saved) : {
            background: {
                type: 'gradient',
                value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                blur: 10,
                opacity: 0.8
            },
            alwaysOnTop: false,
            darkMode: true,
            transparent: true
        };
    });

    useEffect(() => {
        localStorage.setItem('niyati-settings', JSON.stringify(settings));
    }, [settings]);

    const updateBackground = (bg) => {
        setSettings(prev => ({ ...prev, background: { ...prev.background, ...bg } }));
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return { settings, updateBackground, toggleSetting };
};
