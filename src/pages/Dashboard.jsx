import { ArrowRight, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StatCard } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { categories } from "../lib/constants";
import { api } from "../lib/api";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [results, setResults] = useState([]);
  useEffect(() => { api.myResults().then(setResults); }, [user.uid]);
  const best = Math.max(0, ...results.map(r => r.score));
  return <div className="animate-fade-in">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-slate-500 sm:text-base">Xush kelibsiz,</p><h1 className="text-2xl font-black sm:text-3xl">{profile?.name || user.displayName || "Foydalanuvchi"}</h1></div><Link to="/categories" className="btn-primary w-full sm:w-auto"><PlayCircle size={18} /> Quiz boshlash</Link></div>
    <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4"><StatCard label="Quizlar" value={results.length} /><StatCard label="Eng yaxshi" value={best} accent="text-emerald-600" /><StatCard label="Yo'nalish" value="9" accent="text-orange-500" /></div>
    <h2 className="mt-8 text-xl font-black">Tezkor yo'nalish tanlash</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{categories.map(({ name, icon: Icon, color }) => <Link className="card group" to={`/quiz/${encodeURIComponent(name)}`} key={name}><div className={`inline-flex rounded-xl bg-gradient-to-br p-2 text-white ${color}`}><Icon size={20}/></div><div className="mt-3 flex justify-between text-sm font-bold sm:text-base">{name}<ArrowRight className="opacity-60 group-hover:opacity-100" size={18}/></div></Link>)}</div>
    <h2 className="mt-8 text-xl font-black">So'nggi natijalar</h2>
    <div className="mt-4 grid gap-2 sm:hidden">{results.slice(0, 5).map(r => <div className="card flex items-center justify-between gap-3" key={r.id}><div><p className="font-bold">{r.category}</p><p className="text-xs text-slate-500">{r.correctCount}/25 to'g'ri · {r.level}</p></div><p className="text-xl font-black text-indigo-600">{r.score}</p></div>)}{!results.length && <p className="card text-center text-sm text-slate-500">Hali natija mavjud emas.</p>}</div>
    <div className="mt-4 hidden card overflow-x-auto sm:block"><table className="w-full text-left text-sm"><thead><tr className="border-b dark:border-slate-700"><th className="p-3">Yo'nalish</th><th className="p-3">Natija</th><th className="p-3">Ball</th><th className="p-3">Daraja</th></tr></thead><tbody>{results.slice(0, 5).map(r => <tr className="border-b last:border-0 dark:border-slate-800" key={r.id}><td className="p-3 font-bold">{r.category}</td><td className="p-3">{r.correctCount}/25</td><td className="p-3">{r.score}</td><td className="p-3">{r.level}</td></tr>)}</tbody></table>{!results.length && <p className="p-4 text-center text-slate-500">Hali natija mavjud emas.</p>}</div>
  </div>;
}
