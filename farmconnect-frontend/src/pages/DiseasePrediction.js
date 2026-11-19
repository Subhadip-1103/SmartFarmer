import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, BadgeCheck, Camera, CheckCircle2, FileImage, Leaf, LoaderCircle, ScanLine, ShieldCheck, Sparkles, Upload, X } from 'lucide-react';
import api from '../api/axios';

function DiseasePrediction() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file in JPG, PNG, or another supported image format.');
      return;
    }
    setImageFile(file);
    setResult(null);
    setError('');
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      setError('Upload a clear leaf image before starting the analysis.');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await api.post('/diseaseai/predict/', formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('The analysis could not be completed. Please try another clear image.');
    } finally {
      setLoading(false);
    }
  };

  const confidence = Math.min(Math.max(Number(result?.confidence) || 0, 0), 100);

  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[#fbfaf4] text-[#173322]">
      <section className="relative overflow-hidden bg-[#e9f5e2] px-5 pb-7 pt-5 sm:px-8 sm:pb-9 sm:pt-6 lg:px-10"><div className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-[#c8e7a5] blur-2xl" /><div className="absolute -bottom-20 left-[22%] h-40 w-40 rounded-full bg-[#f7dfa0]/60 blur-2xl" />
        <div className="relative mx-auto max-w-6xl"><button onClick={() => navigate('/ai-service')} className="group inline-flex items-center gap-2 text-sm font-bold text-[#50783f] transition hover:text-[#173322]"><span className="rounded-full bg-white/80 p-1.5 shadow-sm transition group-hover:-translate-x-0.5"><ArrowLeft size={16} /></span> Back to AI services</button>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_230px] lg:items-center"><div className="max-w-2xl"><div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[.14em] text-[#39713d]"><Sparkles size={13} /> AI crop health scan</div><h1 className="mt-3 font-serif text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">A closer look at <span className="text-[#5f9747]">your crop’s health.</span></h1><p className="mt-2.5 max-w-xl text-sm leading-6 text-[#526b56] sm:text-base">Upload a clear strawberry leaf photo to get an instant AI assessment and practical next-step guidance.</p></div><div className="hidden rounded-2xl border border-white/80 bg-white/70 p-4 shadow-md shadow-green-950/5 backdrop-blur sm:block"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#cde9a6] text-[#285a31]"><ScanLine size={18} /></div><p className="mt-3 text-xs font-extrabold">Quick visual check</p><p className="mt-1 text-xs leading-5 text-[#667867]">A photo is all you need to begin.</p></div></div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#4b694f] sm:text-sm"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-[#5d9143]" /> Instant assessment</span><span className="inline-flex items-center gap-1.5"><Camera size={15} className="text-[#5d9143]" /> Photo-based analysis</span><span className="inline-flex items-center gap-1.5"><BadgeCheck size={15} className="text-[#5d9143]" /> Practical care guidance</span></div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,.88fr)_minmax(0,1.12fr)]">
        <form onSubmit={handleSubmit} className="h-fit rounded-[2rem] border border-[#dce9d7] bg-white p-6 shadow-[0_12px_35px_rgba(25,55,31,0.06)] sm:p-8"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4f2d9] text-[#3b7b3f]"><FileImage size={23} /></div><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#79936e]">Step 1 of 1</p><h2 className="mt-0.5 text-xl font-black">Upload leaf photo</h2></div></div><p className="mt-5 text-sm leading-6 text-[#657666]">For the best result, use good lighting and make sure the leaf fills most of the frame.</p>
          <input ref={fileInputRef} id="leaf-photo" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
          {!preview ? <label htmlFor="leaf-photo" className="mt-7 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#bcd6b2] bg-[#f5faef] p-6 text-center transition hover:border-[#78a65f] hover:bg-[#eff8e8]"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#5e9848] shadow-sm"><Upload size={25} /></span><span className="mt-4 font-extrabold text-[#285333]">Choose a leaf photo</span><span className="mt-1 text-xs leading-5 text-[#718172]">JPG, PNG, or other image formats</span></label> : <div className="relative mt-7 overflow-hidden rounded-3xl border border-[#dbe8d5] bg-[#edf5e9]"><img src={preview} alt="Selected leaf preview" className="h-64 w-full object-cover" /><div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-[#173b25]/80 p-3 text-white backdrop-blur"><span className="inline-flex min-w-0 items-center gap-2 text-xs font-bold"><CheckCircle2 size={16} className="shrink-0 text-[#d2ef9c]" /><span className="truncate">{imageFile?.name}</span></span><button type="button" onClick={clearImage} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/30" aria-label="Remove selected image"><X size={16} /></button></div></div>}
          {error && <p className="mt-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={17} />{error}</p>}<button type="submit" disabled={loading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f512d] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-green-950/10 transition hover:-translate-y-0.5 hover:bg-[#153d21] disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><LoaderCircle className="animate-spin" size={18} /> Analyzing leaf image...</> : <><ScanLine size={18} /> Analyze crop health</>}</button></form>
        <div>{!result && <div className="flex min-h-[435px] flex-col justify-center rounded-[2rem] border border-dashed border-[#cbdcc4] bg-[#f4f8ef] p-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#6a9c54] shadow-sm"><Leaf size={32} /></div><h2 className="mt-5 text-2xl font-black">Your scan results will appear here</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#667867]">Once your image is analyzed, you will see the most likely condition, confidence score, and helpful care information.</p><div className="mx-auto mt-7 flex max-w-md justify-center gap-3"><span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#587558]">1. Upload photo</span><span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#587558]">2. AI analysis</span><span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#587558]">3. Review care</span></div></div>}
          {result && <div className="rounded-[2rem] border border-[#dce9d7] bg-white p-6 shadow-[0_12px_35px_rgba(25,55,31,0.06)] sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#759568]">AI assessment complete</p><h2 className="mt-2 text-2xl font-black leading-tight">{result.prediction}</h2><p className="mt-2 text-sm text-[#68796b]">Most likely leaf condition from the image provided.</p></div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff0d1] text-[#36773c]"><BadgeCheck size={24} /></span></div><div className="mt-7 rounded-2xl bg-[#f4f8ef] p-4"><div className="flex items-center justify-between gap-3"><span className="text-sm font-extrabold text-[#355a3b]">Prediction confidence</span><span className="text-lg font-black text-[#4e8b42]">{result.confidence}%</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e0ebdb]"><div className="h-full rounded-full bg-gradient-to-r from-[#6ea752] to-[#b6d86d] transition-all duration-700" style={{ width: `${confidence}%` }} /></div></div>
            {result.all_results?.length > 0 && <div className="mt-7"><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#78906d]">Other possible matches</p><div className="mt-3 space-y-3">{result.all_results.map((item, index) => <div key={`${item.label}-${index}`} className="flex items-center gap-3 rounded-xl border border-[#e6ede2] px-4 py-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf5e9] text-xs font-black text-[#568b48]">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-bold text-[#405843]">{item.label}</span><span className="text-sm font-extrabold text-[#548b46]">{item.confidence}%</span></div>)}</div></div>}
            {result.info && <div className="mt-7 border-t border-[#e4ece0] pt-7"><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#78906d]">Care guidance</p><div className="mt-4 space-y-4">{result.info.description && <div className="rounded-2xl bg-[#f9fbf7] p-4"><p className="text-sm font-extrabold text-[#315438]">About this condition</p><p className="mt-1.5 text-sm leading-6 text-[#617163]">{result.info.description}</p></div>}{result.info.symptoms && <div className="rounded-2xl bg-[#fff9ed] p-4"><p className="text-sm font-extrabold text-[#765b22]">Common symptoms</p><p className="mt-1.5 text-sm leading-6 text-[#6a624e]">{result.info.symptoms}</p></div>}{result.info.treatment && <div className="rounded-2xl bg-[#eef7e9] p-4"><p className="text-sm font-extrabold text-[#35643c]">Recommended action</p><p className="mt-1.5 text-sm leading-6 text-[#536d56]">{result.info.treatment}</p></div>}</div></div>}</div>}</div>
      </div></section>
    </main>
  );
}

export default DiseasePrediction;