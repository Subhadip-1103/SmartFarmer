import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, CirclePlay, Clock3, Image as ImageIcon, Lightbulb, Play, Sparkles } from 'lucide-react';
import api from '../api/axios';

function getEmbedUrl(url) {
  if (!url) return '';
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return url;
}

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get(`/learning/courses/${id}/`)
      .then((response) => { if (active) setCourse(response.data); })
      .catch((err) => {
        console.error(err);
        if (active) setError('This lesson could not be loaded. Please try again.');
      });
    return () => { active = false; };
  }, [id]);

  if (error) return <main className="min-h-[calc(100vh-64px)] bg-[#fbfaf4] px-5 py-20 text-center"><div className="mx-auto max-w-md rounded-3xl border border-red-100 bg-white p-8 shadow-sm"><BookOpen className="mx-auto text-red-400" size={36} /><h1 className="mt-4 text-xl font-black text-[#173322]">Lesson unavailable</h1><p className="mt-2 text-sm leading-6 text-[#68796b]">{error}</p><button onClick={() => navigate(-1)} className="mt-5 rounded-xl bg-[#235431] px-4 py-2.5 text-sm font-bold text-white">Go back</button></div></main>;
  if (!course) return <main className="min-h-[calc(100vh-64px)] bg-[#fbfaf4] px-5 py-10 sm:px-8"><div className="mx-auto max-w-5xl animate-pulse"><div className="h-5 w-36 rounded bg-[#dfeadc]" /><div className="mt-8 h-72 rounded-[2rem] bg-[#e4efde]" /><div className="mt-8 h-56 rounded-3xl bg-white" /></div></main>;

  const hasVideo = course.video_file || course.video_url;
  const gallery = [course.extra_image_1, course.extra_image_2].filter(Boolean);

  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[#fbfaf4] text-[#173322]">
      <section className="relative overflow-hidden bg-[#e9f5e2] px-5 pb-12 pt-8 sm:px-8 lg:px-10">
        <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-[#c9e8a7] blur-3xl" /><div className="absolute -bottom-32 left-[20%] h-64 w-64 rounded-full bg-[#f5dda2]/55 blur-3xl" />
        <div className="relative mx-auto max-w-5xl"><button onClick={() => navigate(-1)} className="group inline-flex items-center gap-2 text-sm font-bold text-[#50783f] transition hover:text-[#173322]"><span className="rounded-full bg-white/80 p-1.5 shadow-sm transition group-hover:-translate-x-0.5"><ArrowLeft size={16} /></span> Back to lessons</button>
          <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_230px] lg:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-[#39713d]"><BookOpen size={14} /> {course.category_name || 'Learning lesson'}</div><h1 className="mt-5 max-w-3xl font-serif text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">{course.title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#526b56] sm:text-lg">{course.description}</p></div><div className="hidden rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-xl shadow-green-950/5 backdrop-blur sm:block"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#cde9a6] text-[#285a31]"><Sparkles size={23} /></div><p className="mt-5 text-sm font-extrabold">Practical learning</p><p className="mt-1 text-xs leading-5 text-[#667867]">Take notes, revisit the lesson, and apply it in the field.</p></div></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#4b694f]"><span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-[#5d9143]" /> Expert-led guidance</span><span className="inline-flex items-center gap-2"><Lightbulb size={17} className="text-[#5d9143]" /> Easy to apply</span><span className="inline-flex items-center gap-2"><Clock3 size={17} className="text-[#5d9143]" /> Learn at your pace</span></div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10"><div className="mx-auto max-w-5xl">
        {course.thumbnail && <div className="relative overflow-hidden rounded-[2rem] bg-[#dcebcf] shadow-[0_18px_45px_rgba(31,72,38,0.12)]"><img src={course.thumbnail} alt={course.title} className="h-64 w-full object-cover sm:h-[390px]" />{hasVideo && <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#173b25]/80 px-3 py-2 text-xs font-extrabold text-white backdrop-blur"><CirclePlay size={16} /> Includes video lesson</span>}</div>}
        {hasVideo && <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#dae6d4] bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e4f2d9] text-[#3b7b3f]"><Play size={20} fill="currentColor" /></div><div><p className="font-extrabold">Watch the lesson</p><p className="text-xs text-[#718172]">Follow along with the visual guide.</p></div></div>{course.video_file ? <video controls className="w-full rounded-2xl bg-[#173322]" src={course.video_file}>Your browser does not support video playback.</video> : <div className="relative w-full overflow-hidden rounded-2xl bg-[#173322]" style={{ paddingTop: '56.25%' }}><iframe src={getEmbedUrl(course.video_url)} title={course.title} className="absolute left-0 top-0 h-full w-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>}</div>}
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]"><article className="rounded-[2rem] border border-[#e0e9dc] bg-white p-6 shadow-sm sm:p-9"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5e5b7] text-[#80621e]"><BookOpen size={21} /></div><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#78906d]">Lesson notes</p><h2 className="mt-0.5 text-xl font-black">What you will learn</h2></div></div><div className="mt-7 whitespace-pre-line text-[15px] leading-8 text-[#455a48]">{course.content}</div></article><aside className="h-fit rounded-[2rem] bg-[#1e4b2b] p-6 text-white"><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#c9e995]">Keep growing</p><h2 className="mt-3 text-xl font-black">Learning works best in the field.</h2><p className="mt-3 text-sm leading-6 text-green-100/80">Save a key insight, then put it into practice when you next visit your crops.</p><button onClick={() => navigate(-1)} className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#d2ed9d] hover:text-white">More lessons <ArrowLeft className="rotate-180" size={16} /></button></aside></div>
        {gallery.length > 0 && <div className="mt-8 rounded-[2rem] border border-[#e0e9dc] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5f1dd] text-[#3f7c40]"><ImageIcon size={21} /></div><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#78906d]">In the field</p><h2 className="mt-0.5 text-xl font-black">Visual references</h2></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{gallery.map((image, index) => <img key={image} src={image} alt={`${course.title} reference ${index + 1}`} className="h-56 w-full rounded-2xl object-cover" />)}</div></div>}
      </div></section>
    </main>
  );
}

export default CourseDetail;
