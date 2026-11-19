import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CloudSun, HeartHandshake, Leaf, LogOut, MapPin, Package, Settings, ShieldCheck, ShoppingBasket, Sprout, Tractor, UserRound } from 'lucide-react';
import api from '../api/axios';

const actionStyles = [
  { Icon: BookOpen, color: 'bg-[#e4f2d9] text-[#33753b]', detail: 'Grow your farm knowledge' },
  { Icon: ShoppingBasket, color: 'bg-[#f9e6be] text-[#785510]', detail: 'Buy and sell locally' },
  { Icon: Package, color: 'bg-[#d9eeeb] text-[#24685c]', detail: 'Track your purchases' },
  { Icon: CloudSun, color: 'bg-[#dfeaf9] text-[#3f638c]', detail: 'Plan around the forecast' },
  { Icon: Sprout, color: 'bg-[#e9e6c8] text-[#5a652c]', detail: 'Find the right crop' },
];

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return undefined;
    }
    let active = true;
    api.get('/users/profile/')
      .then((response) => { if (active) setProfile(response.data); })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (active) setError('Your session has ended. Please log in again to continue.');
      });
    return () => { active = false; };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  if (error) return <main className="min-h-[calc(100vh-64px)] bg-[#fbfaf4] px-5 py-20 text-center"><div className="mx-auto max-w-md rounded-3xl border border-red-100 bg-white p-8 shadow-sm"><ShieldCheck className="mx-auto text-red-400" size={36} /><h1 className="mt-4 text-xl font-black text-[#173322]">Sign in to continue</h1><p className="mt-2 text-sm leading-6 text-[#68796b]">{error}</p><button onClick={() => navigate('/login')} className="mt-5 rounded-xl bg-[#245431] px-4 py-2.5 text-sm font-bold text-white">Go to login</button></div></main>;
  if (!profile) return <main className="min-h-[calc(100vh-64px)] bg-[#fbfaf4] px-5 py-10 sm:px-8"><div className="mx-auto max-w-6xl animate-pulse"><div className="h-60 rounded-[2rem] bg-[#e4efde]" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-40 rounded-3xl bg-white" />)}</div></div></main>;

  const actions = [
    { label: 'Learning Platform', onClick: () => navigate('/courses') },
    { label: 'Marketplace', onClick: () => navigate('/marketplace') },
    { label: 'My Orders', onClick: () => navigate('/my-orders') },
    { label: 'Weather', onClick: () => navigate('/weather') },
    { label: 'Crop Recommendation', onClick: () => navigate('/crop-recommendation') },
  ];
  const initial = (profile.username || 'F').charAt(0).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[#fbfaf4] text-[#173322]">
      <section className="relative overflow-hidden bg-[#e9f5e2] px-5 pb-12 pt-8 sm:px-8 sm:pb-16 lg:px-10"><div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#c8e7a5] blur-3xl" /><div className="absolute -bottom-28 left-[22%] h-60 w-60 rounded-full bg-[#f7dfa0]/60 blur-3xl" />
        <div className="relative mx-auto max-w-6xl"><div className="flex flex-wrap items-start justify-between gap-4"><div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-[#39713d]"><Leaf size={14} /> Your Smart Farmer space</div><button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm font-bold text-[#a14a3f] shadow-sm transition hover:bg-white"><LogOut size={16} /> Logout</button></div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_290px] lg:items-end"><div><p className="text-sm font-bold text-[#63835a]">Welcome back,</p><h1 className="mt-1 font-serif text-4xl font-black tracking-tight sm:text-5xl">{profile.username}<span className="text-[#5f9747]">.</span></h1><p className="mt-4 max-w-xl text-base leading-7 text-[#526b56] sm:text-lg">Your personalized place to learn, plan your crops, monitor the weather, and connect with your local market.</p></div><div className="rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-xl shadow-green-950/5 backdrop-blur"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#cde9a6] text-xl font-black text-[#285a31]">{initial}</span><div><p className="font-extrabold text-[#183a23]">{profile.username}</p><span className="mt-1 inline-flex rounded-full bg-[#eff7e9] px-2.5 py-1 text-xs font-extrabold capitalize text-[#4b8242]">{profile.role}</span></div></div><div className="mt-5 border-t border-[#e2eddd] pt-4 text-xs leading-5 text-[#697a6b]">Everything you need for smarter farming, in one place.</div></div></div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10"><div className="mx-auto max-w-6xl"><div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px]"><div><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#719868]">Quick actions</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">What would you like to do?</h2></div><span className="hidden rounded-full bg-[#e9f3e2] px-3 py-1.5 text-sm font-bold text-[#4f7c3b] sm:block">Your farmer toolkit</span></div><div className="mt-7 grid gap-5 sm:grid-cols-2">{actions.map((action, index) => { const style = actionStyles[index]; const Icon = style.Icon; return <button key={action.label} onClick={action.onClick} className="group relative overflow-hidden rounded-3xl border border-[#e0e9dc] bg-white p-6 text-left shadow-[0_8px_30px_rgba(25,55,31,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#b8d3aa] hover:shadow-[0_18px_40px_rgba(25,55,31,0.12)]"><div className="flex items-start justify-between gap-4"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.color}`}><Icon size={24} /></span><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eff6eb] text-[#4d7b3a] transition group-hover:bg-[#5d9143] group-hover:text-white"><ArrowRight size={17} /></span></div><h3 className="mt-7 text-lg font-black">{action.label}</h3><p className="mt-1 text-sm text-[#67786a]">{style.detail}</p></button>; })}</div></div>
          <aside className="h-fit rounded-[2rem] border border-[#dce9d7] bg-white p-6 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5e6b8] text-[#80621e]"><UserRound size={21} /></div><p className="mt-5 text-xs font-extrabold uppercase tracking-[.14em] text-[#7a906f]">Account details</p><h2 className="mt-1 text-xl font-black">Your profile</h2><dl className="mt-6 space-y-5"><div><dt className="text-xs font-bold uppercase tracking-[.11em] text-[#8a9a8d]">Email</dt><dd className="mt-1 break-words text-sm font-semibold text-[#405843]">{profile.email || 'Not provided'}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[.11em] text-[#8a9a8d]">Phone</dt><dd className="mt-1 text-sm font-semibold text-[#405843]">{profile.phone_number || 'Not provided'}</dd></div><div><dt className="flex items-center gap-1 text-xs font-bold uppercase tracking-[.11em] text-[#8a9a8d]"><MapPin size={12} /> Address</dt><dd className="mt-1 text-sm font-semibold leading-5 text-[#405843]">{profile.address || 'Not provided'}</dd></div></dl></aside></div>
        {(profile.role === 'farmer' || profile.role === 'admin') && <div className="mt-8 rounded-[2rem] bg-[#1e4b2b] p-6 text-white sm:flex sm:items-center sm:justify-between sm:p-8"><div className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#d5eea0]">{profile.role === 'farmer' ? <Tractor size={24} /> : <Settings size={23} />}</div><div><p className="text-lg font-black">{profile.role === 'farmer' ? 'Manage your farm listings' : 'Manage the platform'}</p><p className="mt-1 text-sm leading-6 text-green-100/75">{profile.role === 'farmer' ? 'Add products, update stock, and keep track of incoming orders.' : 'Open your administrator workspace to manage content and users.'}</p></div></div>{profile.role === 'farmer' ? <button onClick={() => navigate('/farmer-dashboard')} className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#c9e890] px-4 py-3 text-sm font-extrabold text-[#183b22] transition hover:bg-white sm:mt-0">Open farmer panel <ArrowRight size={17} /></button> : <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#c9e890] px-4 py-3 text-sm font-extrabold text-[#183b22] transition hover:bg-white sm:mt-0">Open admin panel <ArrowRight size={17} /></a>}</div>}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#e0e9dc] bg-[#f7faf4] px-5 py-4 text-sm text-[#607562]"><HeartHandshake className="shrink-0 text-[#5e9848]" size={21} /><span><strong className="text-[#365a3b]">Smart Farmer is here to help.</strong> Explore your tools whenever you are ready to plan, learn, or grow.</span></div>
      </div></section>
    </main>
  );
}

export default Dashboard;
