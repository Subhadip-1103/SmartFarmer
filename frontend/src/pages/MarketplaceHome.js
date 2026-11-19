import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Leaf, MapPin, PackageCheck, ShoppingBasket, Sprout, Tractor } from 'lucide-react';

const options = [
  {
    path: '/marketplace/categories/marketplace',
    title: 'Farm Produce',
    description: 'Fresh vegetables, fruits, grains, and pulses — directly from local farms.',
    label: 'Fresh from the field',
    Icon: ShoppingBasket,
    iconClass: 'bg-[#d9efad] text-[#28542d]',
    panelClass: 'from-[#eff8d8] to-[#d4edb6]',
    orbClass: 'bg-[#bbdc80]',
  },
  {
    path: '/marketplace/categories/shop',
    title: 'Farm Input Shop',
    description: 'Reliable seeds, fertilizer, crop care, and essentials for a thriving farm.',
    label: 'Made for growers',
    Icon: Sprout,
    iconClass: 'bg-[#f9dca4] text-[#704a0c]',
    panelClass: 'from-[#fff5dc] to-[#f8dfb4]',
    orbClass: 'bg-[#f0c675]',
  },
];

function FieldArt() {
  return (
    <div className="relative h-[230px] w-full overflow-hidden rounded-[2rem] bg-[#315c31] sm:h-[270px]">
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#f6d978] opacity-95" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[#89b85d] [clip-path:polygon(0_45%,18%_14%,38%_46%,60%_8%,78%_45%,100%_18%,100%_100%,0_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[#5f9548] [clip-path:polygon(0_55%,21%_13%,43%_57%,66%_10%,82%_42%,100%_19%,100%_100%,0_100%)]" />
      <div className="absolute bottom-0 left-[8%] h-[62%] w-1 rotate-[-16deg] rounded-full bg-[#25492c]" />
      <div className="absolute bottom-[33%] left-[3%] h-7 w-12 -rotate-[28deg] rounded-full bg-[#9bd573]" />
      <div className="absolute bottom-[48%] left-[11%] h-7 w-12 rotate-[24deg] rounded-full bg-[#aee07e]" />
      <div className="absolute bottom-0 right-[18%] h-[48%] w-1 rotate-[18deg] rounded-full bg-[#25492c]" />
      <div className="absolute bottom-[36%] right-[10%] h-6 w-11 rotate-[31deg] rounded-full bg-[#b9df7f]" />
      <div className="absolute bottom-[23%] right-[20%] h-6 w-11 -rotate-[28deg] rounded-full bg-[#9ed26c]" />
      <div className="absolute left-6 top-6 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur"><span className="inline-flex items-center gap-1.5"><MapPin size={13} /> Local marketplace</span></div>
      <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-[#173b25]/70 p-4 text-white backdrop-blur"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#d6efbd]">Better market access</p><p className="mt-1 text-lg font-extrabold">Closer farms. Fairer choices.</p></div>
    </div>
  );
}

function MarketplaceHome() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[#fbf9f2] text-[#173322]">
      <section className="relative overflow-hidden bg-[#eaf5e2] px-5 pb-14 pt-8 sm:px-8 sm:pb-20 lg:px-10">
        <div className="absolute -left-16 top-28 h-64 w-64 rounded-full bg-[#d3ebb3] blur-3xl" />
        <div className="absolute -right-16 -top-12 h-80 w-80 rounded-full bg-[#f5dfa2]/65 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <button onClick={() => navigate('/')} className="group inline-flex items-center gap-2 text-sm font-bold text-[#527840] transition hover:text-[#173322]"><span className="rounded-full bg-white/80 p-1.5 shadow-sm transition group-hover:-translate-x-0.5"><ArrowLeft size={16} /></span> Back to home</button>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/75 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-[#39713d]"><Leaf size={14} /> Smart Farmer marketplace</div>
              <h1 className="mt-5 max-w-xl font-serif text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl"> Good farming, <span className="text-[#5f9747]">closer together.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#516b55] sm:text-lg">Buy fresh produce from local farmers or find dependable supplies for your next growing season — all in one place.</p>
              <div className="mt-7 flex flex-wrap gap-3"><button onClick={() => navigate('/marketplace/categories/marketplace')} className="inline-flex items-center gap-2 rounded-xl bg-[#1d4c2a] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-green-950/10 transition hover:-translate-y-0.5 hover:bg-[#123a20]">Shop fresh produce <ArrowRight size={17} /></button><button onClick={() => navigate('/marketplace/categories/shop')} className="inline-flex items-center gap-2 rounded-xl border border-[#b9d4ad] bg-white/80 px-5 py-3.5 text-sm font-extrabold text-[#265a32] transition hover:bg-white">Fertilier & Seed Shop</button></div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#49684d]"><span className="inline-flex items-center gap-2"><BadgeCheck size={17} className="text-[#5e9848]" /> Direct from sellers</span><span className="inline-flex items-center gap-2"><PackageCheck size={17} className="text-[#5e9848]" /> Easy ordering</span></div>
            </div>
            <FieldArt />
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#6d9855]">Find what you need</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Two ways to grow your day.</h2><p className="mt-3 leading-7 text-[#627365]">Whether you are stocking your kitchen or tending your fields, start with the marketplace that fits your needs.</p></div>
          <div className="mt-9 grid gap-6 lg:grid-cols-2">
            {options.map(({ path, title, description, label, Icon, iconClass, panelClass, orbClass }, index) => (
              <button key={path} onClick={() => navigate(path)} className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${panelClass} p-7 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8`}>
                <div className={`absolute -right-9 -top-10 h-40 w-40 rounded-full ${orbClass} opacity-75 transition duration-500 group-hover:scale-125`} />
                <div className="relative flex min-h-[225px] flex-col items-start justify-between"><div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${iconClass}`}><Icon size={28} /></div><div className="max-w-sm"><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#5e7c4f]">{label}</p><h3 className="mt-2 text-2xl font-black text-[#173322]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#4d6751]">{description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#285d35]">Browse categories <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition group-hover:translate-x-1"><ArrowRight size={16} /></span></span></div></div>
                {index === 0 ? <Leaf className="absolute right-7 bottom-7 text-[#6f9f51]/30" size={68} strokeWidth={1.3} /> : <Tractor className="absolute right-7 bottom-7 text-[#9c6f26]/25" size={70} strokeWidth={1.2} />}
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-4 rounded-3xl border border-[#dfe9d9] bg-white p-5 text-center shadow-sm sm:grid-cols-3 sm:p-6"><div><p className="text-xl font-black text-[#245936]">Fresh</p><p className="mt-1 text-sm text-[#68796b]">Local produce choices</p></div><div className="border-y border-[#e7eee3] py-4 sm:border-x sm:border-y-0 sm:py-0"><p className="text-xl font-black text-[#245936]">Simple</p><p className="mt-1 text-sm text-[#68796b]">Browse and order easily</p></div><div><p className="text-xl font-black text-[#245936]">Trusted</p><p className="mt-1 text-sm text-[#68796b]">Built for our farming community</p></div></div>
        </div>
      </section>
      <section className="bg-[#1d4829] px-5 py-12 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left"><div><p className="text-xl font-extrabold text-white">Your local market is waiting.</p><p className="mt-1 text-sm text-green-100/75">Explore products and farm essentials in just a few clicks.</p></div><button onClick={() => navigate('/marketplace/categories/marketplace')} className="inline-flex items-center gap-2 rounded-xl bg-[#c9e890] px-5 py-3 text-sm font-extrabold text-[#183b22] transition hover:bg-white">Start browsing <ArrowRight size={17} /></button></div></section>
    </main>
  );
}

export default MarketplaceHome;
