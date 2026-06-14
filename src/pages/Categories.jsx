import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../lib/constants";

export default function Categories() {
  return <div className="animate-fade-in">
    <h1 className="text-2xl font-black sm:text-3xl">Yo'nalishni tanlang</h1>
    <p className="mt-2 text-sm text-slate-500 sm:text-base">Har bir bo'limdagi savollar soniga qarab test ochiladi. Har savol uchun 20 soniya beriladi.</p>
    <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-4">
      {categories.map(({ name, icon: Icon, color, description }) => <Link className="card group flex min-h-40 flex-col hover:-translate-y-1 sm:min-h-0" to={`/quiz/${encodeURIComponent(name)}`} key={name}>
        <div className={`inline-flex w-fit rounded-xl bg-gradient-to-br p-2.5 text-white sm:rounded-2xl sm:p-3 ${color}`}><Icon size={22}/></div>
        <h2 className="mt-3 font-black sm:mt-4 sm:text-lg">{name}</h2>
        <p className="mt-1 hidden text-sm text-slate-500 sm:block">{description}</p>
        <p className="mt-auto flex items-center justify-between pt-3 text-xs font-bold text-indigo-600 sm:mt-4 sm:pt-0 sm:text-sm">Testga kirish <ArrowRight size={16}/></p>
      </Link>)}
    </div>
  </div>;
}
