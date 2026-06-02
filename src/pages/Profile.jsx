import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRows } from "../lib/storage";

export default function Profile() {
  const { user, profile } = useAuth(); const [results, setResults] = useState([]);
  useEffect(() => { setResults(getRows("results").filter(result => result.userId === user.uid).sort((a, b) => b.createdAt.localeCompare(a.createdAt))); }, [user.uid]);
  return <div className="animate-fade-in"><div className="card flex items-center gap-4"><UserCircle className="text-indigo-600" size={56}/><div><h1 className="text-2xl font-black">{profile?.name || user.displayName}</h1><p className="text-slate-500">{user.email}</p></div></div><h2 className="mt-8 text-xl font-black">Natijalar tarixi</h2><div className="card mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b dark:border-slate-700"><th className="p-3">Yo'nalish</th><th className="p-3">To'g'ri</th><th className="p-3">Foiz</th><th className="p-3">Ball</th><th className="p-3">Daraja</th></tr></thead><tbody>{results.map(r => <tr className="border-b last:border-0 dark:border-slate-800" key={r.id}><td className="p-3 font-bold">{r.category}</td><td className="p-3">{r.correctCount}/25</td><td className="p-3">{r.percentage}%</td><td className="p-3">{r.score}</td><td className="p-3">{r.level}</td></tr>)}</tbody></table>{!results.length && <p className="p-4 text-center text-slate-500">Hali natija mavjud emas.</p>}</div></div>;
}
