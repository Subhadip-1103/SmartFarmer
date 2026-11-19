import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowUpRight, BookOpen, GraduationCap,
  Leaf, Orbit, Sparkles, Sprout, Sun, Tractor,
} from 'lucide-react';
import api from '../api/axios';

const categoryThemes = {
  modernTechnique: {
    icon: Tractor, label: 'Next-gen fieldwork', color: '#59e1c0', glow: 'rgba(89,225,192,.34)',
    surface: 'from-[#164f49] via-[#123c3c] to-[#082c31]', description: 'Tools and techniques built for smarter, more efficient farms.',
  },
  cropCultivation: {
    icon: Sprout, label: 'Crop intelligence', color: '#c7f36b', glow: 'rgba(199,243,107,.30)',
    surface: 'from-[#4e742d] via-[#345c28] to-[#183b27]', description: 'Turn every growing stage into a stronger, healthier harvest.',
  },
  offSeason: {
    icon: Sun, label: 'Seasonal advantage', color: '#ffc65b', glow: 'rgba(255,198,91,.31)',
    surface: 'from-[#875827] via-[#614020] to-[#302719]', description: 'Keep growing confidently when the usual season takes a turn.',
  },
  organic: {
    icon: Leaf, label: 'Nature-led growing', color: '#96e6a7', glow: 'rgba(150,230,167,.30)',
    surface: 'from-[#2b7049] via-[#22583d] to-[#15372c]', description: 'Work with the soil, the seasons, and nature’s own systems.',
  },
  default: {
    icon: BookOpen, label: 'Farm knowledge', color: '#a4d9ff', glow: 'rgba(164,217,255,.30)',
    surface: 'from-[#365a72] via-[#29495f] to-[#1c3047]', description: 'Practical knowledge designed for confident day-to-day decisions.',
  },
};

function getCategoryTheme(name) {
  const value = name.toLowerCase();
  if (/(modern.*technique|technology|precision)/.test(value)) return categoryThemes.modernTechnique;
  if (/(modern.*crop|crop.*cultivation|cultivation)/.test(value)) return categoryThemes.cropCultivation;
  if (/(off.*season|seasonal)/.test(value)) return categoryThemes.offSeason;
  if (/(organic|natural|sustainable)/.test(value)) return categoryThemes.organic;
  return categoryThemes.default;
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get('/learning/categories/')
      .then((response) => { if (active) setCategories(response.data); })
      .catch((err) => { console.error(err); if (active) setError('The learning garden is taking a moment to load. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[#07191d] text-white">
      <section className="relative isolate overflow-hidden px-5 pb-12 pt-6 sm:px-8 sm:pb-14 lg:px-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,#1a5e4d_0,transparent_29%),radial-gradient(circle_at_86%_22%,#344d86_0,transparent_31%),linear-gradient(145deg,#0b2525_0%,#07191d_48%,#101d39_100%)]" />
        <div className="absolute -left-20 top-40 -z-10 h-64 w-64 rounded-full bg-[#59e1c0]/15 blur-3xl" />
        <div className="absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-[#a4d9ff]/15 blur-3xl" />
        <div className="absolute left-[13%] top-44 h-2 w-2 rounded-full bg-[#c7f36b] shadow-[0_0_20px_7px_rgba(199,243,107,.5)]" />
        <div className="absolute right-[17%] top-64 h-1.5 w-1.5 rounded-full bg-[#a4d9ff] shadow-[0_0_18px_7px_rgba(164,217,255,.5)]" />

        <div className="relative mx-auto max-w-6xl">
          <button onClick={() => navigate('/')} className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-[#c8ddd7] backdrop-blur transition hover:border-white/25 hover:bg-white/10 hover:text-white"><ArrowLeft size={16} className="transition group-hover:-translate-x-0.5" /> Back to home</button>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_280px]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#a8e9d6]/25 bg-[#67d9b8]/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-[#a8e9d6]"><Orbit size={14} /> The learning greenhouse</div>
              <h1 className="mt-5 font-serif text-4xl font-black leading-[.94] tracking-tight text-white sm:text-5xl lg:text-6xl">Our farm’s next<br /><span className="bg-gradient-to-r from-[#c7f36b] via-[#71e3c7] to-[#a4d9ff] bg-clip-text text-transparent">big idea starts here.</span></h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#afc9c4]">Step into a living library of field-ready skills. Pick a path, explore the lessons, and bring a fresh idea back to your farm.</p>
            </div>
            <div className="relative mx-auto hidden h-60 w-60 lg:block" style={{ perspective: '900px' }}>
              <div className="absolute inset-6 rounded-[2rem] border border-[#b4f0d1]/30 bg-[#5bd5a9]/10 shadow-[0_0_70px_rgba(89,225,192,.20)]" style={{ transform: 'rotateX(58deg) rotateZ(15deg)' }} />
              <div className="absolute left-9 top-6 flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/25 bg-gradient-to-br from-white/30 to-white/5 backdrop-blur" style={{ transform: 'rotateY(-24deg) rotateX(13deg)', boxShadow: '18px 24px 34px rgba(0,0,0,.25)' }}><GraduationCap size={58} className="text-[#d9ffc5]" strokeWidth={1.3} /></div>
              <span className="absolute bottom-4 right-0 rounded-2xl border border-white/15 bg-[#162c36]/85 px-3 py-2 text-xs font-bold text-[#d8eee7] shadow-xl backdrop-blur">Grow. Learn. Repeat.</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold text-[#cbe1dc]"><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Field-tested insights</span><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Watch &amp; learn</span><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Made for every season</span></div>
        </div>
      </section>

      <section className="relative bg-[#f4f6ef] px-5 py-12 text-[#132b29] sm:px-8 sm:py-16 lg:px-10">
        <div className="absolute left-0 top-0 h-9 w-full -translate-y-full bg-[linear-gradient(135deg,transparent_49%,#f4f6ef_50%)] bg-[length:38px_38px]" />
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#4d926d]">Choose a direction</p><h2 className="mt-2 font-serif text-3xl font-black tracking-tight sm:text-4xl">Explore the knowledge garden.</h2></div>{!loading && !error && <div className="rounded-2xl bg-[#dceee1] px-4 py-3 text-sm font-bold text-[#2c714c]"><span className="mr-2 text-lg">✦</span>{categories.length} learning paths</div>}</div>

          {error && <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">{error} <button onClick={() => window.location.reload()} className="ml-2 font-bold underline">Retry</button></div>}
          {loading && <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-[340px] animate-pulse rounded-[2rem] bg-[#e3e9df]" />)}</div>}
          {!loading && !error && categories.length === 0 && <div className="mt-10 rounded-[2rem] border border-dashed border-[#b9d2b9] bg-white px-6 py-16 text-center"><BookOpen className="mx-auto text-[#5b9c70]" size={36} /><h3 className="mt-4 text-xl font-black">New paths are sprouting soon</h3><p className="mt-2 text-sm text-[#5e7568]">Check back shortly for fresh learning material.</p></div>}
          {!loading && !error && categories.length > 0 && <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const theme = getCategoryTheme(category.name); const Icon = theme.icon;
              return <Link key={category.id} to={`/courses/category/${category.id}`} state={{ categoryName: category.name }} className="group relative block h-[340px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#59a77a]/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4f6ef]" style={{ perspective: '1200px' }} aria-label={`Start learning ${category.name}`}>
                <div className="absolute inset-x-5 bottom-0 h-10 rounded-[100%] bg-[#173a34]/25 blur-xl transition duration-500 group-hover:scale-110" />
                <article className={`relative flex h-[320px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br p-6 text-white shadow-[0_22px_35px_rgba(17,45,36,.20)] transition duration-500 group-hover:-translate-y-3 ${theme.surface}`} style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full opacity-90 blur-[1px]" style={{ background: theme.glow, transform: 'translateZ(-10px)' }} />
                  <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full border border-white/10" />
                  <div className="relative flex items-start justify-between" style={{ transform: 'translateZ(25px)' }}><div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur"><Icon size={28} style={{ color: theme.color }} /></div><span className="rounded-full border border-white/15 bg-black/10 px-3 py-1.5 text-[11px] font-black tracking-[.14em] text-white/75">{String(index + 1).padStart(2, '0')}</span></div>
                  <div className="relative mt-auto" style={{ transform: 'translateZ(32px)' }}><p className="text-[11px] font-extrabold uppercase tracking-[.16em]" style={{ color: theme.color }}>{theme.label}</p><h3 className="mt-2 text-2xl font-black leading-tight">{category.name}</h3><p className="mt-3 text-sm leading-6 text-white/70">{theme.description}</p><span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2.5 text-sm font-extrabold backdrop-blur transition group-hover:bg-white group-hover:text-[#17352e]">Start learning <ArrowUpRight size={16} /></span></div>
                </article>
              </Link>;
            })}
          </div>}
          <div className="mt-14 flex flex-col justify-between gap-5 rounded-[2rem] bg-[#143d35] px-6 py-7 text-white sm:flex-row sm:items-center sm:px-8"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c7f36b] text-[#173b2a]"><Sparkles size={23} /></div><div><p className="font-black">Small lesson. Big difference.</p><p className="mt-1 text-sm text-[#b6d4c7]">Keep learning and make every growing season count.</p></div></div><Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#1c483b] transition hover:bg-[#c7f36b]">Return home <ArrowUpRight size={16} /></Link></div>
        </div>
      </section>
    </main>
  );
}

export default Categories;
