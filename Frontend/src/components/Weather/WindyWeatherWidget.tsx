import React from 'react';
import type { useWeather } from '../../hooks/useWeather';

interface WindyWeatherWidgetProps {
  weatherHook: ReturnType<typeof useWeather>;
  variant?: 'sidebar' | 'dashboard' | 'compact';
}

export const WindyWeatherWidget: React.FC<WindyWeatherWidgetProps> = ({
  weatherHook,
  variant = 'sidebar',
}) => {
  const { weatherData, selectedLocation, openModal } = weatherHook;

  const temp = weatherData ? `${weatherData.temperature.toFixed(1)}°C` : '24°C';
  const rh = weatherData ? `${weatherData.humidity}%` : '78%';
  const icon = weatherData?.iconName || 'partly_cloudy_day';
  const thiStatus = weatherData?.thiStatus || 'Nyaman';
  const thiColor = weatherData?.thiColor || '#1b5e20';

  if (variant === 'dashboard') {
    return (
      <div 
        onClick={openModal}
        className="bg-white rounded-2xl p-4 border border-[#dee8ff] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:border-[#8df5e4] transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#e7eeff] text-[#006b5f] flex items-center justify-center shrink-0 group-hover:bg-[#00450d] group-hover:text-[#8df5e4] transition-colors">
            <span className="material-symbols-outlined text-[28px]">{icon}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#111c2d]">
                {selectedLocation.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8df5e4] text-[#00450d]">
                Windy Live
              </span>
            </div>
            <span className="text-xs text-[#717a6d]">
              Suhu: <strong className="text-[#00450d]">{temp}</strong> • Kelembaban: <strong>{rh}</strong> • Angin: {weatherData?.windSpeed || 11} km/h
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[#717a6d] uppercase">THI Sapi</span>
            <span 
              className="text-xs font-black px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: thiColor }}
            >
              {thiStatus}
            </span>
          </div>
          <button 
            type="button"
            className="px-3.5 py-2 rounded-xl bg-[#00450d] text-white hover:bg-[#1b5e20] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[17px] text-[#8df5e4]">map</span>
            <span>Buka Peta Windy</span>
          </button>
        </div>
      </div>
    );
  }

  // Sidebar Default Variant
  return (
    <div 
      onClick={openModal}
      className="bg-[#f0f3ff] p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#dee8ff] transition-all group border border-slate-200/50"
      title="Klik untuk membuka Radar Cuaca & Suhu Windy"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="material-symbols-outlined text-[#006b5f] text-[22px] group-hover:scale-110 transition-transform shrink-0">
          {icon}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-bold text-[#111c2d] truncate">
            {selectedLocation.name.replace(' Dairy Farm', '').replace(' Dairy Center', '')}
          </span>
          <span className="text-[11px] text-[#41493e] truncate">
            {temp} • RH {rh}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span 
          className="text-[10px] text-white px-2 py-0.5 rounded font-bold"
          style={{ backgroundColor: thiColor }}
        >
          {thiStatus}
        </span>
      </div>
    </div>
  );
};

export default WindyWeatherWidget;
