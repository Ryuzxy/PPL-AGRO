import React from 'react';

interface ResponsiveTopHeaderProps {
  title?: string;
  subtitle?: string;
  onOpenDrawer: () => void;
  rightActions?: React.ReactNode;
}

export const ResponsiveTopHeader: React.FC<ResponsiveTopHeaderProps> = ({
  title = 'Rembangan Dairy Farm',
  subtitle = 'Kandang Laktasi A & B',
  onOpenDrawer,
  rightActions,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex items-center justify-between px-3 sm:px-6 lg:px-8">
      {/* Left: Mobile Hamburger or Brand Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={onOpenDrawer}
          className="lg:hidden p-2 -ml-1 rounded-xl text-[#111c2d] hover:bg-[#dee8ff] active:scale-95 transition-all flex items-center justify-center shrink-0"
          title="Buka Menu Navigasi"
          aria-label="Buka Menu Navigasi"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[#006b5f] text-[20px] sm:text-[22px] shrink-0">
            agriculture
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] sm:text-[16px] text-[#111c2d] font-bold truncate leading-tight">
              {title}
            </span>
            {subtitle && (
              <span className="text-[11px] sm:text-[12px] text-[#41493e] truncate leading-tight hidden xs:block">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {rightActions}

        <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

        {/* User Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            H
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[12px] font-bold text-[#111c2d] leading-tight">Pak Hafid</span>
            <span className="text-[10px] text-[#41493e] leading-tight">Kepala Farm</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResponsiveTopHeader;
