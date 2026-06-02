import { Medal } from "lucide-react";
import { useEffect, useState } from "react";
import { categories } from "../lib/constants";
import { getRows } from "../lib/storage";

export default function Leaderboard() {
  const [category, setCategory] = useState("global"); const [rows, setRows] = useState([]); const [fast, setFast] = useState(false);
  useEffect(() => {
    const filtered = getRows("results").filter(result => category === "global" || result.category === category);
    setRows(filtered.sort((a, b) => fast ? a.durationSeconds - b.durationSeconds : b.score - a.score).slice(0, 10));
  }, [category, fast]);
  return <div className="animate-fade-in"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-black sm:text-3xl">Top 10 reyting</h1><p className="mt-1 text-sm text-slate-500 sm:text-base">Eng yuqori natijalar va eng tez qatnashchilar.</p></div><div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto"><select className="input min-w-0 text-sm" value={category} onChange={e => setCategory(e.target.value)}><option value="global">Global reyting</option>{categories.map(c => <option key={c.name}>{c.name}</option>)}</select><button className="btn-secondary whitespace-nowrap text-sm" onClick={() => setFast(!fast)}>{fast ? "Eng yuqori ball" : "Eng tezlar"}</button></div></div>
    <div className="mt-5 grid gap-2 sm:hidden">{rows.map((r, i) => <div className="card flex items-center gap-3" key={r.id}><div className="w-7 shrink-0 text-center font-black">{i < 3 ? <Medal className={`mx-auto ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-orange-700"}`} size={20}/> : i + 1}</div><div className="min-w-0 flex-1"><p className="truncate font-bold">{r.userName}</p><p className="truncate text-xs text-slate-500">{r.category} · {r.percentage}% · {r.durationSeconds}s</p></div><p className="text-xl font-black text-indigo-600">{r.score}</p></div>)}{!rows.length && <p className="card text-center text-sm text-slate-500">Natijalar hali mavjud emas.</p>}</div>
    <div className="card mt-6 hidden overflow-x-auto sm:block"><table className="w-full text-left text-sm"><thead><tr className="border-b dark:border-slate-700"><th className="p-3">#</th><th className="p-3">Foydalanuvchi</th><th className="p-3">Yo'nalish</th><th className="p-3">Ball</th><th className="p-3">Foiz</th><th className="p-3">Vaqt</th></tr></thead><tbody>{rows.map((r, i) => <tr className="border-b last:border-0 dark:border-slate-800" key={r.id}><td className="p-3 font-black">{i < 3 ? <Medal className={i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-orange-700"} size={20}/> : i + 1}</td><td className="p-3 font-bold">{r.userName}</td><td className="p-3">{r.category}</td><td className="p-3">{r.score}</td><td className="p-3">{r.percentage}%</td><td className="p-3">{r.durationSeconds}s</td></tr>)}</tbody></table>{!rows.length && <p className="p-4 text-center text-slate-500">Natijalar hali mavjud emas.</p>}</div></div>;
}
