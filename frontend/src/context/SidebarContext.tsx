import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    open: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(() => {
        // On desktop, sidebar is open by default
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return false;
    });

    // Update sidebar state on window resize (only when crossing breakpoint)
    useEffect(() => {
        let previousWidth = window.innerWidth;
        
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const wasDesktop = previousWidth >= 768;
            const isDesktop = currentWidth >= 768;
            
            // Only update state if crossing the breakpoint (desktop <-> mobile)
            if (wasDesktop !== isDesktop) {
                setIsOpen(isDesktop);
            }
            
            previousWidth = currentWidth;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggle = () => {
        setIsOpen(prev => !prev);
    };
    
    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
