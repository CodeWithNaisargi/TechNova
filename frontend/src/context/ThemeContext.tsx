import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'LIGHT' | 'DARK' | 'SYSTEM';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Load from localStorage on mount
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme') as Theme;
            return saved || 'LIGHT';
        }
        return 'LIGHT';
    });

    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme') as Theme;
            if (saved === 'SYSTEM') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return saved === 'DARK' ? 'dark' : 'light';
        }
        return 'light';
    });

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update effective theme immediately
        if (newTheme === 'SYSTEM') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setEffectiveTheme(systemPrefersDark ? 'dark' : 'light');
        } else {
            setEffectiveTheme(newTheme === 'DARK' ? 'dark' : 'light');
        }
    };

    useEffect(() => {
        // Apply theme class to document root immediately
        if (typeof window !== 'undefined') {
            const root = document.documentElement;
            if (effectiveTheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [effectiveTheme]);

    // Apply theme on initial mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = document.documentElement;
            const saved = localStorage.getItem('theme') as Theme;
            if (saved === 'DARK' || (saved === 'SYSTEM' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, []);

    useEffect(() => {
        // Listen for system theme changes if SYSTEM mode is selected
        if (theme === 'SYSTEM') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                setEffectiveTheme(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
