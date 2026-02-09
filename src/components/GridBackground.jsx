import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const GridBackground = ({ className = "" }) => {
    const { isDarkMode } = useTheme();
    // Dark Mode: faint white/gray lines (#80808012)
    // Light Mode: faint black/gray lines for visibility on white (#00000010)
    const gridColor = isDarkMode ? '#80808012' : '#00000010';

    return (
        <div
            className={`absolute inset-0 bg-[size:24px_24px] pointer-events-none ${className}`}
            style={{
                backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`
            }}
        ></div>
    );
};

export default GridBackground;
