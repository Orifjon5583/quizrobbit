import { Link } from "react-router-dom";
import { categories } from "../lib/constants";

export default function Categories() {
  return <div className="animate-fade-in"><h1 className="text-3xl font-black">Yo'nalishni tanlang</h1><p className="mt-2 text-slate-500">Har bir quiz 25 ta savoldan iborat. Har savol uchun 20 soniya beriladi.</p><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{categories.map(({ name, icon: Icon, color, description }) => <Link className="card group hover:-translate-y-1" to={`/quiz/${encodeURIComponent(name)}`} key={name}><div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 text-white ${color}`}><Icon /></div><h2 className="mt-4 text-lg font-black">{name}</h2><p className="mt-1 min-h-10 text-sm text-slate-500">{description}</p><p className="mt-4 text-sm font-bold text-indigo-600">25 savol · 20 soniya</p></Link>)}</div></div>;
}
