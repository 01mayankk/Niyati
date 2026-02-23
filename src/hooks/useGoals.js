import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useGoals = () => {
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('niyati-goals');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('niyati-goals', JSON.stringify(goals));
    }, [goals]);

    const addGoal = (title, category, targetDate = null, displayFormat = 'natural', targetDuration = 0) => {
        const newGoal = {
            id: uuidv4(),
            title,
            category,
            targetDate,
            displayFormat,
            targetDuration: parseInt(targetDuration), // in minutes
            elapsedTime: 0, // in seconds
            isActive: false,
            actualStartTime: null,
            actualEndTime: null,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        setGoals((prev) => [...prev, newGoal]);
    };

    const toggleGoal = (id) => {
        setGoals((prev) =>
            prev.map((g) => {
                if (g.id === id) {
                    const isCompleting = !g.completed;
                    return {
                        ...g,
                        completed: isCompleting,
                        isActive: isCompleting ? false : g.isActive,
                        actualEndTime: isCompleting ? new Date().toISOString() : g.actualEndTime
                    };
                }
                return g;
            })
        );
    };

    const toggleTimer = (id) => {
        setGoals((prev) =>
            prev.map((g) => {
                if (g.id === id) {
                    const now = new Date().toISOString();
                    const newActive = !g.isActive;
                    return {
                        ...g,
                        isActive: newActive,
                        actualStartTime: g.actualStartTime || (newActive ? now : null)
                    };
                }
                return { ...g, isActive: false }; // Only one timer active at a time
            })
        );
    };

    const updateElapsedTime = (id, seconds) => {
        setGoals((prev) =>
            prev.map((g) => (g.id === id ? { ...g, elapsedTime: g.elapsedTime + seconds } : g))
        );
    };

    const deleteGoal = (id) => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
    };

    const editGoal = (id, updates) => {
        setGoals((prev) =>
            prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
        );
    };

    const sortedGoals = [...goals].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        if (a.targetDate && b.targetDate) return new Date(a.targetDate) - new Date(b.targetDate);
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return { goals: sortedGoals, addGoal, toggleGoal, deleteGoal, editGoal, toggleTimer, updateElapsedTime };
};
