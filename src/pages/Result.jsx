import { Award, CheckCircle2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader, StatCard } from "../components/UI";
import { getResult } from "../lib/storage";

export default function Result() {
  const { id } = useParams(); const [result, setResult] = useState(null);
  useEffect(() => { setResult(getResult(id)); }, [id]);
  if (!result) return <Loader />;
  return <div className="mx-auto max-w-3xl animate-fade-in text-center">
    <Award className="mx-auto text-amber-500" size={56}/><h1 className="mt-3 text-2xl font-black sm:text-3xl">Quiz yakunlandi!</h1><p className="mt-2 text-sm text-slate-500 sm:text-base">{result.category} bo'yicha natijangiz</p>
    <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4"><StatCard label="To'g'ri" value={result.correctCount} accent="text-emerald-600" /><StatCard label="Noto'g'ri" value={result.wrongCount} accent="text-red-600" /><StatCard label="Foiz" value={`${result.percentage}%`} /></div>
    <div className="card mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-4"><div><p className="text-xs text-slate-500 sm:text-sm">Ball</p><p className="text-xl font-black sm:text-2xl">{result.score}</p></div><div><p className="text-xs text-slate-500 sm:text-sm">Daraja</p><p className="text-sm font-black text-indigo-600 sm:text-2xl">{result.level}</p></div><div><p className="text-xs text-slate-500 sm:text-sm">Vaqt</p><p className="text-xl font-black sm:text-2xl">{result.durationSeconds}s</p></div></div>
    <div className="mt-5 grid gap-2 sm:mt-6 sm:flex sm:justify-center sm:gap-3"><Link to="/categories" className="btn-primary"><RotateCcw size={18}/> Yana ishlash</Link><Link to="/leaderboard" className="btn-secondary"><CheckCircle2 size={18}/> Reytingni ko'rish</Link></div>
  </div>;
}
