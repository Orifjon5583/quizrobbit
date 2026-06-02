import { Award, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader, StatCard } from "../components/UI";
import { getResult } from "../lib/storage";

export default function Result() {
  const { id } = useParams(); const [result, setResult] = useState(null);
  useEffect(() => { setResult(getResult(id)); }, [id]);
  if (!result) return <Loader />;
  return <div className="mx-auto max-w-3xl animate-fade-in text-center">
    <Award className="mx-auto text-amber-500" size={64} /><h1 className="mt-3 text-3xl font-black">Quiz yakunlandi!</h1><p className="mt-2 text-slate-500">{result.category} bo'yicha natijangiz</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-3"><StatCard label="To'g'ri javob" value={result.correctCount} accent="text-emerald-600" /><StatCard label="Noto'g'ri javob" value={result.wrongCount} accent="text-red-600" /><StatCard label="Foiz" value={`${result.percentage}%`} /></div>
    <div className="card mt-5 grid gap-4 sm:grid-cols-3"><div><p className="text-sm text-slate-500">Ball</p><p className="text-2xl font-black">{result.score}</p></div><div><p className="text-sm text-slate-500">Daraja</p><p className="text-2xl font-black text-indigo-600">{result.level}</p></div><div><p className="text-sm text-slate-500">Vaqt</p><p className="text-2xl font-black">{result.durationSeconds}s</p></div></div>
    <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/categories" className="btn-primary"><RotateCcw size={18}/> Yana ishlash</Link><Link to="/leaderboard" className="btn-secondary"><CheckCircle2 size={18}/> Reytingni ko'rish</Link></div>
  </div>;
}
