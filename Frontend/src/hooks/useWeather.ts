import { useState, useEffect, useCallback } from 'react';
import {
  weatherApi,
  PRESET_DAIRY_LOCATIONS,
  type WeatherLocation,
  type LiveWeatherData,
} from '../lib/weatherApi';

export function useWeather() {
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation>(PRESET_DAIRY_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<'temp' | 'wind' | 'rain' | 'clouds'>('temp');

  const fetchWeather = useCallback(async (loc: WeatherLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await weatherApi.getCurrentWeather(loc.latitude, loc.longitude);
      setWeatherData(data);
    } catch (err: any) {
      console.warn('Error fetching weather:', err);
      setError('Gagal memperbarui data cuaca real-time');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(selectedLocation);
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchWeather(selectedLocation);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedLocation, fetchWeather]);

  // Change preset location
  const changeLocation = (loc: WeatherLocation) => {
    setSelectedLocation(loc);
  };

  // Detect live GPS location via browser Geolocation API
  const detectGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung fitur Geolocation GPS.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gpsLoc: WeatherLocation = {
          id: 'my_gps',
          name: 'Lokasi Peternakan Saya (GPS)',
          region: `${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}°`,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setSelectedLocation(gpsLoc);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Gagal mendeteksi lokasi GPS. Mempertahankan lokasi default Rembangan Dairy Farm.');
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return {
    selectedLocation,
    weatherData,
    isLoading,
    error,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    changeLocation,
    detectGpsLocation,
    presetLocations: PRESET_DAIRY_LOCATIONS,
    refreshWeather: () => fetchWeather(selectedLocation),
    activeLayer,
    setActiveLayer,
    windyUrl: weatherApi.getWindyEmbedUrl(selectedLocation.latitude, selectedLocation.longitude, activeLayer),
    googleMapsUrl: weatherApi.getGoogleMapsUrl(selectedLocation.latitude, selectedLocation.longitude),
  };
}
