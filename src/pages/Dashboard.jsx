import { ArrowRight, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StatCard } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { categories } from "../lib/constants";
import { getRows } from "../lib/storage";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [results, setResults] = useState([]);
  useEffect(() => { setResults(getRows("results").filter(result => result.userId === user.uid).sort((a, b) => b.createdAt.localeCompare(a.createdAt))); }, [user.uid]);
  const best = Math.max(0, ...results.map(r => r.score));
  return <div className="animate-fade-in">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-slate-500">Xush kelibsiz,</p><h1 className="text-3xl font-black">{profile?.name || user.displayName || "Foydalanuvchi"}</h1></div><Link to="/categories" className="btn-primary"><PlayCircle size={18} /> Quiz boshlash</Link></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-3"><StatCard label="Ishlangan quizlar" value={results.length} /><StatCard label="Eng yuqori ball" value={best} accent="text-emerald-600" /><StatCard label="Yo'nalishlar" value="8" accent="text-orange-500" /></div>
    <h2 className="mt-8 text-xl font-black">Tezkor yo'nalish tanlash</h2>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map(({ name, icon: Icon, color }) => <Link className="card group" to={`/quiz/${encodeURIComponent(name)}`} key={name}><div className={`inline-flex rounded-xl bg-gradient-to-br p-2 text-white ${color}`}><Icon size={20}/></div><div className="mt-3 flex justify-between font-bold">{name}<ArrowRight className="opacity-0 group-hover:opacity-100" size={18}/></div></Link>)}</div>
    <h2 className="mt-8 text-xl font-black">So'nggi natijalar</h2>
    <div className="mt-4 card overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b dark:border-slate-700"><th className="p-3">Yo'nalish</th><th className="p-3">Natija</th><th className="p-3">Ball</th><th className="p-3">Daraja</th></tr></thead><tbody>{results.slice(0, 5).map(r => <tr className="border-b last:border-0 dark:border-slate-800" key={r.id}><td className="p-3 font-bold">{r.category}</td><td className="p-3">{r.correctCount}/25</td><td className="p-3">{r.score}</td><td className="p-3">{r.level}</td></tr>)}</tbody></table>{!results.length && <p className="p-4 text-center text-slate-500">Hali natija mavjud emas.</p>}</div>
  </div>;
}
