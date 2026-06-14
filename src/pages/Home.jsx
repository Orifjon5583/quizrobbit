import { ArrowRight, Award, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../lib/constants";

export default function Home() {
  return <div className="animate-fade-in">
    <section className="grid items-center gap-6 py-5 sm:py-10 lg:grid-cols-2">
      <div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 sm:text-sm dark:bg-indigo-950 dark:text-indigo-300">Bilimingizni sinang</span>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:mt-5 sm:text-5xl md:text-6xl">Attestatsiya uchun <span className="text-indigo-600">professional</span> quiz platforma</h1>
        <p className="mt-4 max-w-xl text-base text-slate-600 sm:mt-5 sm:text-lg dark:text-slate-300">9 ta yo'nalish, har birida 25 ta savol. Natijangizni o'lchang va reytingda yuqorilang.</p>
        <Link to="/register" className="btn-primary mt-5 w-full sm:mt-7 sm:w-auto">Boshlash <ArrowRight size={18}/></Link>
      </div>
      <div className="card grid grid-cols-3 gap-2 sm:gap-4">
        {[["225", "Savol"], ["9", "Yo'nalish"], ["20s", "Har savol"]].map(([value, label]) => <div className="rounded-xl bg-indigo-50 p-3 text-center sm:rounded-2xl sm:p-5 dark:bg-indigo-950/50" key={label}><p className="text-2xl font-black text-indigo-600 sm:text-3xl">{value}</p><p className="text-xs text-slate-500 sm:text-sm">{label}</p></div>)}
        <div className="col-span-3 grid gap-2 pt-1 sm:grid-cols-3 sm:gap-3">
          <p className="flex gap-2 text-sm"><Clock3 className="text-indigo-500" size={18}/> Aniq timer</p>
          <p className="flex gap-2 text-sm"><Award className="text-indigo-500" size={18}/> Jonli reyting</p>
          <p className="flex gap-2 text-sm"><ShieldCheck className="text-indigo-500" size={18}/> Himoyalangan</p>
        </div>
      </div>
    </section>
    <section><h2 className="text-2xl font-black">Yo'nalishlar</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-4">{categories.map(({ name, icon: Icon, color, description }) => <div className="card" key={name}><div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br p-2.5 text-white sm:mb-4 sm:rounded-2xl sm:p-3 ${color}`}><Icon size={22}/></div><h3 className="font-bold">{name}</h3><p className="mt-1 hidden text-sm text-slate-500 sm:block">{description}</p></div>)}</div></section>
  </div>;
}
