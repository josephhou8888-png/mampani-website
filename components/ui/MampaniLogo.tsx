import React from 'react';

interface MampaniLogoProps {
    logoUrl?: string;
    inFooter?: boolean;
    onClick?: () => void;
}

const MampaniLogo = ({ logoUrl, inFooter = false, onClick }: MampaniLogoProps) => {
    const finalLogoUrl = logoUrl || "https://www.zoji.me/images/logo1.png";
    
    const content = (
        <>
            <img src={finalLogoUrl} alt="Mampani Logo" className="w-8 h-8" />
            <span className={`text-2xl font-sans font-bold ${inFooter ? 'text-slate-700' : 'text-[var(--color-text)]'}`}>Mampani</span>
        </>
    );

    const commonProps = {
        className: "flex items-center space-x-3 focus:outline-none",
        "aria-label": "Mampani Homepage"
    };

    if (onClick) {
        return (
            <button {...commonProps} onClick={onClick}>
                {content}
            </button>
        );
    }

    return (
        <a href="/" {...commonProps}>
            {content}
        </a>
    );
};

export default MampaniLogo;
