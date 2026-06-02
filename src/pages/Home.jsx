import { ArrowRight, Award, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../lib/constants";

export default function Home() {
  return <div className="animate-fade-in">
    <section className="grid items-center gap-8 py-10 lg:grid-cols-2">
      <div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Bilimingizni sinang</span>
        <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl">Attestatsiya uchun <span className="text-indigo-600">professional</span> quiz platforma</h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">8 ta yo'nalish, har birida 25 ta savol. Natijangizni o'lchang va reytingda yuqorilang.</p>
        <Link to="/register" className="btn-primary mt-7">Boshlash <ArrowRight size={18} /></Link>
      </div>
      <div className="card grid gap-4 sm:grid-cols-3">
        {[["200", "Savol"], ["8", "Yo'nalish"], ["20s", "Har savol"]].map(([v, l]) => <div className="rounded-2xl bg-indigo-50 p-5 text-center dark:bg-indigo-950/50" key={l}><p className="text-3xl font-black text-indigo-600">{v}</p><p className="text-sm text-slate-500">{l}</p></div>)}
        <div className="sm:col-span-3 grid gap-3 sm:grid-cols-3">
          <p className="flex gap-2 text-sm"><Clock3 className="text-indigo-500" size={18}/> Aniq timer</p>
          <p className="flex gap-2 text-sm"><Award className="text-indigo-500" size={18}/> Jonli reyting</p>
          <p className="flex gap-2 text-sm"><ShieldCheck className="text-indigo-500" size={18}/> Himoyalangan</p>
        </div>
      </div>
    </section>
    <section><h2 className="text-2xl font-black">Yo'nalishlar</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map(({ name, icon: Icon, color, description }) => <div className="card" key={name}><div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br p-3 text-white ${color}`}><Icon /></div><h3 className="font-bold">{name}</h3><p className="mt-1 text-sm text-slate-500">{description}</p></div>)}</div></section>
  </div>;
}
