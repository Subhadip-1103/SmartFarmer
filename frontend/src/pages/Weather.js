import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudRain, CloudSun, Droplets, Gauge, LoaderCircle, LocateFixed, MapPin, Search, Sun, Wind } from 'lucide-react';
import api from '../api/axios';

function Weather() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const applyWeather = useCallback(async (params, fallbackMessage) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams(params).toString();
      const [currentRes, forecastRes] = await Promise.all([
        api.get(`/weather/current/?${query}`),
        api.get(`/weather/forecast/?${query}`),
      ]);
      setCurrent(currentRes.data);
      setForecast(forecastRes.data.forecast || []);
    } catch (err) {
      console.error(err);
      setError(fallbackMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback((cityName) => applyWeather({ city: cityName }, 'Location not found. Try a different city name.'), [applyWeather]);
  const fetchWeatherByCoords = useCallback((lat, lon) => applyWeather({ lat, lon }, 'Failed to fetch weather for your location.'), [applyWeather]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
        () => fetchWeatherByCity('Kolkata'),
      );
    } else {
      fetchWeatherByCity('Kolkata');
    }
  }, [fetchWeatherByCity, fetchWeatherByCoords]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchInput.trim()) fetchWeatherByCity(searchInput.trim());
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location access. Search for a city instead.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
      () => setError('Location access was unavailable. Search for a city instead.'),
    );
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const temperature = Math.round(Number(current?.temperature) || 0);
  const isRainy = /rain|drizzle|thunder/i.test(current?.description || current?.condition || '');

  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[#f8faf9] text-[#173322]">
      <section className="relative overflow-hidden bg-[#dfeef6] px-5 pb-12 pt-8 sm:px-8 sm:pb-16 lg:px-10"><div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#b9dded] blur-3xl" /><div className="absolute -bottom-28 left-[20%] h-60 w-60 rounded-full bg-[#f5dda3]/55 blur-3xl" />
        <div className="relative mx-auto max-w-6xl"><button onClick={() => navigate('/')} className="group inline-flex items-center gap-2 text-sm font-bold text-[#3c7183] transition hover:text-[#173322]"><span className="rounded-full bg-white/80 p-1.5 shadow-sm transition group-hover:-translate-x-0.5"><ArrowLeft size={16} /></span> Back to home</button><div className="mt-9 grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border border-[#bcdce8] bg-white/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-[#37748a]"><CloudSun size={14} /> Farm weather center</div><h1 className="mt-5 max-w-2xl font-serif text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl">Plan your field day <span className="text-[#43849a]">with confidence.</span></h1><p className="mt-4 max-w-xl text-base leading-7 text-[#526b6a] sm:text-lg">Check conditions in your area, review the week ahead, and make smarter decisions for your crops.</p></div><div className="hidden rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-sky-950/5 backdrop-blur sm:block"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c8e4f2] text-[#39758d]"><Sun size={24} /></div><p className="mt-5 text-sm font-extrabold">Field-ready forecast</p><p className="mt-1 text-xs leading-5 text-[#61777c]">Clear conditions for a better plan.</p></div></div></div>
      </section>
      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10"><div className="mx-auto max-w-6xl"><form onSubmit={handleSearch} className="flex flex-col gap-3 rounded-3xl border border-[#d9e8e8] bg-white p-4 shadow-sm sm:flex-row"><label className="flex flex-1 items-center gap-3 rounded-xl bg-[#f4f8f8] px-4 py-3 text-[#628083]"><Search size={19} /><input type="text" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search city (e.g. Durgapur)" className="w-full bg-transparent text-sm font-semibold text-[#173b40] outline-none placeholder:text-[#93a9aa]" /></label><button type="button" onClick={useMyLocation} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbe0e3] px-4 py-3 text-sm font-extrabold text-[#397487] transition hover:bg-[#f2f8f8]"><LocateFixed size={17} /> Use my location</button><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#26708a] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1e5c72]"><Search size={17} /> Search</button></form><p className="mt-3 text-center text-xs text-[#84989a]">Location can be approximate on desktop devices. Search for a city for more precise results.</p>
        {error && <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>}
        {loading && <div className="mt-8 flex min-h-[350px] flex-col items-center justify-center rounded-[2rem] bg-white text-center shadow-sm"><LoaderCircle className="animate-spin text-[#4b8da1]" size={34} /><p className="mt-4 font-extrabold text-[#345c65]">Gathering your local forecast...</p><p className="mt-1 text-sm text-[#718789]">This will only take a moment.</p></div>}
        {current && !loading && <div className="mt-8"><div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]"><div className="relative overflow-hidden rounded-[2rem] bg-[#1e6078] p-7 text-white shadow-[0_18px_45px_rgba(28,94,116,0.18)] sm:p-9"><div className="absolute -right-12 -top-14 h-56 w-56 rounded-full bg-[#f4d878] opacity-95" /><div className="absolute -bottom-20 left-[15%] h-40 w-72 rounded-full bg-[#74b7ce] blur-2xl" /><div className="relative"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-sky-100"><MapPin size={13} /> Current conditions</span><h2 className="mt-5 text-2xl font-black sm:text-3xl">{current.city}, {current.country}</h2><p className="mt-1 capitalize text-sky-100/80">{current.description}</p></div>{current.icon && <img src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`} alt={current.condition || current.description} className="h-20 w-20 rounded-2xl bg-white/10" />}</div><div className="mt-8 flex items-end gap-4"><p className="text-6xl font-black tracking-tighter sm:text-7xl">{temperature}°</p><div className="pb-2"><p className="text-lg font-bold">Celsius</p><p className="text-sm text-sky-100/75">Feels like {Math.round(Number(current.feels_like) || 0)}°C</p></div></div><div className="mt-8 grid grid-cols-3 gap-3">{[{ label: 'Humidity', value: `${current.humidity ?? 0}%`, Icon: Droplets }, { label: 'Wind', value: `${current.wind_speed ?? 0} m/s`, Icon: Wind }, { label: 'Rain', value: `${current.rain ?? 0} mm`, Icon: CloudRain }].map(({ label, value, Icon }) => <div key={label} className="rounded-2xl bg-white/10 p-3 backdrop-blur"><Icon size={17} className="text-[#d8f0fa]" /><p className="mt-3 text-xs font-bold text-sky-100/75">{label}</p><p className="mt-0.5 text-sm font-black">{value}</p></div>)}</div></div></div>
          <aside className="rounded-[2rem] border border-[#dce9e8] bg-white p-7 shadow-sm"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0f0f5] text-[#34778c]">{isRainy ? <CloudRain size={24} /> : <Sun size={24} />}</div><p className="mt-6 text-xs font-extrabold uppercase tracking-[.14em] text-[#7c979a]">Farm weather note</p><h3 className="mt-2 text-xl font-black leading-tight">{isRainy ? 'Keep an eye on field moisture.' : 'A good day to check your field.'}</h3><p className="mt-3 text-sm leading-6 text-[#60777a]">{isRainy ? 'Rain is in the current conditions. Consider delaying spray applications and monitor drainage around sensitive crops.' : 'Use the clear conditions to inspect crops, prepare your field, or plan irrigation based on soil moisture.'}</p><div className="mt-6 rounded-2xl bg-[#f3f8f8] p-4"><p className="flex items-center gap-2 text-sm font-extrabold text-[#426d76]"><Gauge size={17} /> Plan with the forecast</p><p className="mt-1 text-xs leading-5 text-[#71898c]">Review the five-day outlook below before scheduling important farm work.</p></div></aside></div>
          <div className="mt-10 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#6d969c]">Outlook ahead</p><h2 className="mt-2 text-2xl font-black">Five-day forecast</h2></div><span className="hidden text-sm font-semibold text-[#718688] sm:block">Plan the week, one day at a time.</span></div><div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{forecast.map((day, index) => <div key={`${day.date}-${index}`} className={`rounded-3xl border p-5 text-center shadow-sm ${index === 0 ? 'border-[#add2dd] bg-[#e8f5f8]' : 'border-[#e0e9e8] bg-white'}`}><p className="text-xs font-extrabold text-[#668086]">{index === 0 ? 'Today' : formatDate(day.date)}</p>{day.icon ? <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.condition || 'Weather forecast'} className="mx-auto my-2 h-14 w-14" /> : <CloudSun className="mx-auto my-3 text-[#5793a5]" size={38} />}<p className="text-xl font-black text-[#1d4e5a]">{Math.round(Number(day.temp) || 0)}°</p><p className="mt-1 text-xs text-[#7e9293]">{Math.round(Number(day.temp_min) || 0)}° / {Math.round(Number(day.temp_max) || 0)}°</p></div>)}</div></div>}
      </div></section>
    </main>
  );
}

export default Weather;
