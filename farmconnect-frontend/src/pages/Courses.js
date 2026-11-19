import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap, PlayCircle, Search, Sparkles } from 'lucide-react';
import api from '../api/axios';

const courseColors = [
  'from-[#dcefc9] to-[#b9db9d] text-[#245331]',
  'from-[#ffedc9] to-[#f5d59c] text-[#694c17]',
  'from-[#d9eff0] to-[#afd9d3] text-[#19584f]',
  'from-[#eee1c9] to-[#dfc69a] text-[#604c25]',
  'from-[#dce5c9] to-[#c5d99d] text-[#43592b]',
  'from-[#f3dbcf] to-[#e5ba9d] text-[#744531]',
];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();
  const categoryName = location.state?.categoryName || 'Courses';

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.get(`/learning/courses/?category=${categoryId}`)
      .then((response) => { if (active) setCourses(response.data); })
      .catch((err) => {
        console.error(err);
        if (active) setError('We could not load these courses right now. Please try again.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [categoryId]);

  const filteredCourses = useMemo(() => courses.filter((course) => (
    `${course.title} ${course.description}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )), [courses, searchQuery]);

  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[#fbfaf4] text-[#173322]">
      {/* HERO — compact single-row layout */}
      <section className="relative overflow-hidden bg-[#eaf5e3] px-5 py-3 sm:px-8 sm:py-4 lg:px-10">
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#d3ecad] blur-2xl" />
        <div className="relative mx-auto max-w-6xl">
          <button onClick={() => navigate('/courses')} className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#50783f] transition hover:text-[#173322]"><span className="rounded-full bg-white/80 p-1 shadow-sm transition group-hover:-translate-x-0.5"><ArrowLeft size={13} /></span> All learning categories</button>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-lg font-black leading-tight tracking-tight sm:text-xl">Master <span className="text-[#5f9747]">{categoryName}</span></h1>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-[#4b694f] sm:text-xs"><span className="inline-flex items-center gap-1"><CheckCircle2 size={12} className="text-[#5d9143]" /> Field-ready knowledge</span><span className="inline-flex items-center gap-1"><PlayCircle size={12} className="text-[#5d9143]" /> Learn by watching</span><span className="inline-flex items-center gap-1"><Sparkles size={12} className="text-[#5d9143]" /> Build practical skills</span></div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white/80 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#39713d]"><GraduationCap size={12} /> Learning path</div>
          </div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-5 rounded-3xl border border-[#dce9d7] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#6c9856]">Your course library</p><h2 className="mt-1 text-2xl font-black">Explore lessons</h2></div><label className="flex w-full items-center gap-2 rounded-xl bg-[#f4f8f1] px-3 py-3 text-[#778a78] sm:w-72"><Search size={18} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search a lesson" className="w-full bg-transparent text-sm font-medium text-[#173322] outline-none placeholder:text-[#94a295]" /></label></div>
        {error && <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error} <button onClick={() => window.location.reload()} className="ml-2 font-bold underline">Retry</button></div>}
        {loading && <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-[340px] animate-pulse rounded-3xl bg-white" />)}</div>}
        {!loading && !error && courses.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-[#cbdcc4] bg-white px-6 py-14 text-center"><BookOpen className="mx-auto text-[#78a361]" size={34} /><h3 className="mt-4 text-lg font-extrabold">Lessons are coming soon</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647566]">There are no courses in this category yet. Please check back soon.</p></div>}
        {!loading && !error && courses.length > 0 && filteredCourses.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-[#cbdcc4] bg-white px-6 py-14 text-center"><Search className="mx-auto text-[#78a361]" size={34} /><h3 className="mt-4 text-lg font-extrabold">No matching lessons</h3><p className="mt-2 text-sm text-[#647566]">Try a different word or browse all courses.</p><button onClick={() => setSearchQuery('')} className="mt-4 text-sm font-extrabold text-[#4f7e3d] underline">Clear search</button></div>}
        {!loading && !error && filteredCourses.length > 0 && <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredCourses.map((course, index) => <article key={course.id} className="group flex overflow-hidden rounded-3xl border border-[#e0e9dc] bg-white shadow-[0_8px_30px_rgba(25,55,31,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(25,55,31,0.12)] sm:flex-col">{course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="h-32 w-32 object-cover sm:h-44 sm:w-full" /> : <div className={`flex h-32 w-32 shrink-0 items-center justify-center bg-gradient-to-br sm:h-44 sm:w-full ${courseColors[index % courseColors.length]}`}><BookOpen size={42} strokeWidth={1.5} /></div>}<div className="flex min-w-0 flex-1 flex-col p-5"><div className="flex items-center justify-between gap-3"><span className="text-xs font-extrabold uppercase tracking-[.12em] text-[#759469]">Lesson {String(index + 1).padStart(2, '0')}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-[#738173]"><Clock3 size={13} /> Learn</span></div><h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight text-[#173322]">{course.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#607162]">{course.description}</p><Link to={`/courses/detail/${course.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#3f783d] transition hover:gap-3">Start lesson <ArrowRight size={16} /></Link></div></article>)}</div>}
      </div></section>
    </main>
  );
}

export default Courses;