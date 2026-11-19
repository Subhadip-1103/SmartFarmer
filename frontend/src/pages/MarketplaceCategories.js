import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BadgeCheck, ChevronRight, Leaf, MapPin,
  PackageCheck, Search, ShoppingBasket, Sparkles, Sprout, Tractor,
} from 'lucide-react';
import api from '../api/axios';

const themes = {
  marketplace: {
    eyebrow: 'Straight from the farm',
    title: 'Fresh choices for every kitchen.',
    description: 'Discover seasonal produce sourced directly from local growers and make every meal feel more connected to the land.',
    accent: 'green',
    icon: ShoppingBasket,
  },
  shop: {
    eyebrow: 'Grow with confidence',
    title: 'Everything your crops need.',
    description: 'Find trusted seeds, crop nutrition, and essential farm inputs in one convenient place.',
    accent: 'amber',
    icon: Sprout,
  },
};

const categoryStyles = [
  { color: 'bg-emerald-100 text-emerald-800', shape: 'bg-emerald-200/70', Icon: Leaf },
  { color: 'bg-amber-100 text-amber-800', shape: 'bg-amber-200/70', Icon: Sprout },
  { color: 'bg-lime-100 text-lime-800', shape: 'bg-lime-200/70', Icon: Tractor },
  { color: 'bg-orange-100 text-orange-800', shape: 'bg-orange-200/70', Icon: PackageCheck },
  { color: 'bg-teal-100 text-teal-800', shape: 'bg-teal-200/70', Icon: ShoppingBasket },
  { color: 'bg-yellow-100 text-yellow-800', shape: 'bg-yellow-200/70', Icon: Sparkles },
];

function getCategoryStyle(name, index) {
  const lowerName = name.toLowerCase();
  if (/(seed|sapling)/.test(lowerName)) return categoryStyles[1];
  if (/(fertili|pestic|spray|input)/.test(lowerName)) return categoryStyles[3];
  if (/(grain|pulse|rice|wheat)/.test(lowerName)) return categoryStyles[2];
  if (/(fruit|vegetable|produce)/.test(lowerName)) return categoryStyles[0];
  return categoryStyles[index % categoryStyles.length];
}

function MarketplaceCategories() {
  const { section } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const theme = themes[section] || themes.marketplace;
  const SectionIcon = theme.icon;
  const heading = useMemo(() => section === 'shop' ? 'Fertilizer & Seed Shop' : 'Farm Produce', [section]);
  const filteredCategories = useMemo(() => (
    categories.filter((category) => category.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  ), [categories, searchQuery]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.get(`/marketplace/categories/?section=${section}`)
      .then((response) => { if (active) setCategories(response.data); })
      .catch((err) => {
        console.error(err);
        if (active) setError('We could not load the categories right now. Please try again.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [section]);

  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[#fbf8f0] text-[#173322]">
      <section className={`relative isolate overflow-hidden px-5 pb-12 pt-8 sm:px-8 sm:pb-16 lg:px-10 ${theme.accent === 'amber' ? 'bg-[#fff5dd]' : 'bg-[#edf6e7]'}`}>
        <div className={`absolute -right-16 -top-20 h-72 w-72 rounded-full opacity-60 blur-3xl ${theme.accent === 'amber' ? 'bg-amber-200' : 'bg-lime-200'}`} />
        <div className="absolute -bottom-24 left-[36%] h-52 w-52 rounded-full bg-white/55 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <button onClick={() => navigate('/marketplace')} className="group inline-flex items-center gap-2 text-sm font-bold text-[#50783f] transition hover:text-[#173322]">
            <span className="rounded-full bg-white/80 p-1.5 shadow-sm transition group-hover:-translate-x-0.5"><ArrowLeft size={16} /></span>
            Back to marketplace
          </button>
          <div className="mt-9 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] ${theme.accent === 'amber' ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-green-200 bg-white/80 text-green-800'}`}><Sparkles size={14} /> {theme.eyebrow}</div>
              <h1 className="mt-5 font-serif text-4xl font-black leading-[1.04] tracking-tight text-[#173322] sm:text-5xl">{theme.title}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#4d6751] sm:text-lg">{theme.description}</p>
            </div>
            <div className="hidden w-56 rounded-[2rem] border border-white/80 bg-white/65 p-5 shadow-xl shadow-green-950/5 backdrop-blur sm:block">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.accent === 'amber' ? 'bg-amber-200 text-amber-900' : 'bg-lime-200 text-green-900'}`}><SectionIcon size={25} /></div>
              <p className="mt-5 text-sm font-extrabold text-[#173322]">{heading}</p><p className="mt-1 text-xs leading-5 text-[#617466]">Browse by category and find exactly what you need.</p>
            </div>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#48634c]">
            <span className="inline-flex items-center gap-2"><BadgeCheck size={17} className="text-[#5d9143]" /> Trusted local sellers</span><span className="inline-flex items-center gap-2"><MapPin size={17} className="text-[#5d9143]" /> Closer to your community</span><span className="inline-flex items-center gap-2"><PackageCheck size={17} className="text-[#5d9143]" /> Simple, secure ordering</span>
          </div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#67904e]">Explore the market</p><h2 className="mt-2 text-2xl font-black tracking-tight text-[#173322] sm:text-3xl">Find your perfect category</h2></div>{!loading && !error && <span className="rounded-full bg-[#e9f3e2] px-3 py-1.5 text-sm font-bold text-[#4f7c3b]">{categories.length} {categories.length === 1 ? 'category' : 'categories'} available</span>}</div>
          {!loading && !error && categories.length > 0 && <div className="mt-7 flex flex-col gap-4 rounded-3xl border border-[#dce9d6] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="flex items-center gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${theme.accent === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-lime-100 text-green-800'}`}><SectionIcon size={21} /></div><div><p className="text-sm font-extrabold text-[#173322]">Curated for {heading.toLowerCase()}</p><p className="text-xs text-[#708172]">Select a collection to view available products.</p></div></div><label className="flex w-full items-center gap-2 rounded-xl bg-[#f5f8f2] px-3 py-2.5 text-[#6f846f] sm:w-64"><Search size={17} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search categories" className="w-full bg-transparent text-sm font-medium text-[#173322] outline-none placeholder:text-[#8a9b8c]" /></label></div>}
          {error && <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error} <button onClick={() => window.location.reload()} className="ml-2 font-bold underline">Retry</button></div>}
          {loading && <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-52 animate-pulse rounded-3xl bg-white" />)}</div>}
          {!loading && !error && categories.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-[#cbdcc4] bg-white px-6 py-14 text-center"><Search className="mx-auto text-[#78a361]" size={34} /><h3 className="mt-4 text-lg font-extrabold">New categories are on their way</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647566]">There is nothing listed here yet. Check back soon for fresh additions.</p></div>}
          {!loading && !error && categories.length > 0 && filteredCategories.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-[#cbdcc4] bg-white px-6 py-12 text-center"><Search className="mx-auto text-[#78a361]" size={34} /><h3 className="mt-4 text-lg font-extrabold">No matching categories</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647566]">Try a different search or browse all available collections.</p><button onClick={() => setSearchQuery('')} className="mt-4 text-sm font-extrabold text-[#4e7d3c] underline">Clear search</button></div>}
          {!loading && !error && filteredCategories.length > 0 && <div className="mt-8 grid gap-5 sm:grid-cols-2">{filteredCategories.map((cat, index) => {
            const style = getCategoryStyle(cat.name, index); const Icon = style.Icon;
            return <button key={cat.id} onClick={() => navigate(`/marketplace/products/${cat.id}`, { state: { categoryName: cat.name } })} className="group relative overflow-hidden rounded-3xl border border-[#e1e8db] bg-white p-6 text-left shadow-[0_8px_30px_rgba(25,55,31,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#b8d3aa] hover:shadow-[0_18px_40px_rgba(25,55,31,0.12)] sm:p-7"><div className={`absolute -right-7 -top-8 h-32 w-32 rounded-full ${style.shape} transition-transform duration-500 group-hover:scale-125`} /><div className="relative flex items-center justify-between gap-5"><div className={`flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-2xl ${style.color}`}><Icon size={28} strokeWidth={2} /></div><span className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-[#6b8663]">View products</span></div><div className="relative mt-10 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#87a378]">Curated collection</p><h3 className="mt-2 text-2xl font-black text-[#173322]">{cat.name}</h3><p className="mt-2 text-sm text-[#617466]">Explore locally listed options</p></div><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eff6eb] text-[#4d7b3a] transition group-hover:bg-[#5d9143] group-hover:text-white"><ArrowRight size={19} /></span></div></button>;
          })}</div>}
          <div className="mt-12 flex flex-col justify-between gap-5 rounded-3xl bg-[#1d4829] px-6 py-6 text-white sm:flex-row sm:items-center sm:px-8"><div><p className="text-lg font-extrabold">Looking for something specific?</p><p className="mt-1 text-sm text-green-100/80">Explore a category to discover products from local sellers.</p></div><button onClick={() => navigate('/marketplace')} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#c8e78c] px-4 py-3 text-sm font-extrabold text-[#183a23] transition hover:bg-white">All marketplace options <ChevronRight size={17} /></button></div>
        </div>
      </section>
    </main>
  );
}

export default MarketplaceCategories;
