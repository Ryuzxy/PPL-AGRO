import React from 'react';
import type { useWeather } from '../../hooks/useWeather';

interface WindyWeatherModalProps {
  weatherHook: ReturnType<typeof useWeather>;
}

export const WindyWeatherModal: React.FC<WindyWeatherModalProps> = ({ weatherHook }) => {
  const {
    isModalOpen,
    closeModal,
    selectedLocation,
    weatherData,
    isLoading,
    changeLocation,
    detectGpsLocation,
    presetLocations,
    activeLayer,
    setActiveLayer,
    windyUrl,
    googleMapsUrl,
    refreshWeather,
  } = weatherHook;

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#dee8ff]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#00450d] via-[#1b5e20] to-[#0c5216] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#8df5e4] shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-[26px]">thermostat</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight truncate">
                  Radar Cuaca & Suhu Mikroklimat Peternakan
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#8df5e4] text-[#00450d] text-[10px] font-black uppercase tracking-wider">
                  Windy Live
                </span>
              </div>
              <p className="text-xs text-[#8df5e4]/90 truncate">
                {selectedLocation.name} • {selectedLocation.region}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={refreshWeather}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Perbarui data cuaca"
            >
              <span className={`material-symbols-outlined text-[20px] ${isLoading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Tutup dialog"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Location & GPS Switcher Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f0f3ff] p-3 rounded-2xl border border-[#dee8ff]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-[#717a6d] uppercase tracking-wider pl-1">
                Pilih Lokasi:
              </span>
              {presetLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => changeLocation(loc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLocation.id === loc.id
                      ? 'bg-[#00450d] text-white shadow-xs'
                      : 'bg-white text-[#111c2d] hover:bg-[#dee8ff] border border-slate-200'
                  }`}
                >
                  {loc.name.replace(' Dairy Farm', '').replace(' Dairy Center', '')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={detectGpsLocation}
                className="px-3.5 py-1.5 rounded-xl bg-[#8df5e4] text-[#00201c] hover:bg-[#70d8c8] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Gunakan koordinat GPS perangkat saya"
              >
                <span className="material-symbols-outlined text-[16px]">my_location</span>
                <span>Deteksi GPS Saya</span>
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white text-[#111c2d] hover:bg-[#dee8ff] border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Buka titik koordinat di Google Maps"
              >
                <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">pin_drop</span>
                <span>Buka Google Maps</span>
              </a>
            </div>
          </div>

          {/* Real-time Telemetry Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Suhu Udara */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#dee8ff] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#717a6d]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Suhu Udara</span>
                <span className="material-symbols-outlined text-[20px] text-[#006b5f]">thermostat</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-[#111c2d]">
                  {weatherData ? `${weatherData.temperature.toFixed(1)}°C` : '...'}
                </span>
                <span className="text-[11px] text-[#41493e] block mt-0.5">
                  Terasa: {weatherData ? `${weatherData.apparentTemperature.toFixed(1)}°C` : '...'}
                </span>
              </div>
            </div>

            {/* 2. Kelembaban Relatif (RH) */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#dee8ff] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#717a6d]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Kelembaban (RH)</span>
                <span className="material-symbols-outlined text-[20px] text-[#006b5f]">humidity_percentage</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-[#111c2d]">
                  {weatherData ? `${weatherData.humidity}%` : '...'}
                </span>
                <span className="text-[11px] text-[#41493e] block mt-0.5">
                  Kondisi: {weatherData?.conditionText || 'Berawan'}
                </span>
              </div>
            </div>

            {/* 3. Kecepatan Angin & Hujan */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#dee8ff] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#717a6d]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Angin & Presipitasi</span>
                <span className="material-symbols-outlined text-[20px] text-[#006b5f]">air</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-[#111c2d]">
                  {weatherData ? `${weatherData.windSpeed.toFixed(1)} km/h` : '...'}
                </span>
                <span className="text-[11px] text-[#41493e] block mt-0.5">
                  Hujan: {weatherData ? `${weatherData.precipitation} mm` : '0 mm'}
                </span>
              </div>
            </div>

            {/* 4. THI Cekaman Panas Sapi Perah */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#dee8ff] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#717a6d]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Indeks THI Sapi</span>
                <span className="material-symbols-outlined text-[20px] text-[#1b5e20]">pets</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-[#111c2d]">
                    {weatherData ? weatherData.thi : '...'}
                  </span>
                  <span 
                    className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: weatherData?.thiColor || '#1b5e20' }}
                  >
                    {weatherData?.thiStatus || 'Nyaman'}
                  </span>
                </div>
                <span className="text-[10px] text-[#41493e] block mt-0.5">
                  Standar NRC Sapi Perah
                </span>
              </div>
            </div>
          </div>

          {/* Windy Layer Switcher Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#dee8ff]/70 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveLayer('temp')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeLayer === 'temp' ? 'bg-[#00450d] text-white shadow-xs' : 'text-[#41493e] hover:text-[#111c2d]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">thermostat</span>
                <span>Peta Suhu Termal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer('wind')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeLayer === 'wind' ? 'bg-[#00450d] text-white shadow-xs' : 'text-[#41493e] hover:text-[#111c2d]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">air</span>
                <span>Aliran Angin</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer('rain')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeLayer === 'rain' ? 'bg-[#00450d] text-white shadow-xs' : 'text-[#41493e] hover:text-[#111c2d]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">rainy</span>
                <span>Radar Hujan & Petir</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer('clouds')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeLayer === 'clouds' ? 'bg-[#00450d] text-white shadow-xs' : 'text-[#41493e] hover:text-[#111c2d]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">cloud</span>
                <span>Satelit Awan</span>
              </button>
            </div>

            <div className="text-[11px] text-[#717a6d] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#1b5e20] animate-pulse"></span>
              <span>Model ECMWF Global 9km</span>
            </div>
          </div>

          {/* Interactive Windy Map Embed */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[460px] rounded-3xl overflow-hidden bg-slate-900 border-2 border-[#dee8ff] shadow-inner">
            <iframe
              src={windyUrl}
              title="Windy Weather Radar & Temperature Map"
              className="w-full h-full border-0"
              loading="lazy"
              allow="geolocation"
            />
            {/* Top-right Windy Live Overlay Badge */}
            <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-mono font-bold flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#8df5e4] animate-ping"></span>
              <span>RADAR LIVE • WINDY.COM</span>
            </div>
          </div>

          {/* Clinical Dairy Recommendation Card */}
          {weatherData && (
            <div className="p-4 rounded-2xl bg-[#e7eeff] border border-[#cfdaf2] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00450d] text-[#8df5e4] flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold text-[#00450d] uppercase tracking-wide">
                    Rekomendasi Manajemen Mikroklimat Kandang
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#111c2d]">
                    Status: {weatherData.thiStatus}
                  </span>
                </div>
                <p className="text-xs text-[#111c2d] mt-1 leading-relaxed">
                  {weatherData.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WindyWeatherModal;
