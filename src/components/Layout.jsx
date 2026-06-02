import { Award, Home, LayoutDashboard, LogIn, LogOut, Moon, PlayCircle, Settings, Sun, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const itemClass = ({ isActive }) => `rounded-lg px-2 py-2 text-xs font-semibold sm:px-3 sm:text-sm ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`;

export default function Layout({ children }) {
  const { user, profile, signOut } = useAuth();
  const [dark, setDark] = useState(() => localStorage.theme === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);
  return <div className="min-h-screen">
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-black text-indigo-600"><Award className="shrink-0" size={23}/><span className="truncate"><span className="sm:hidden">Quiz</span><span className="hidden sm:inline">Attestatsiya Quiz</span></span></Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={itemClass}><Home className="inline" size={16}/> Bosh sahifa</NavLink>
          {user && profile?.role !== "admin" && <NavLink to="/dashboard" className={itemClass}><LayoutDashboard className="inline" size={16}/> Dashboard</NavLink>}
          {user && profile?.role !== "admin" && <NavLink to="/leaderboard" className={itemClass}><Award className="inline" size={16}/> Reyting</NavLink>}
          {user && profile?.role !== "admin" && <NavLink to="/profile" className={itemClass}><User className="inline" size={16}/> Profil</NavLink>}
          {profile?.role === "admin" && <NavLink to="/admin" className={itemClass}><Settings className="inline" size={16}/> Admin</NavLink>}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDark(!dark)} aria-label="Rang rejimi">{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>
          {!user ? <>
            <Link className="hidden rounded-lg px-3 py-2 text-sm font-semibold sm:block" to="/login"><LogIn className="inline" size={16}/> Kirish</Link>
            <Link className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white sm:text-sm" to="/register"><UserPlus className="inline" size={16}/> <span className="hidden min-[390px]:inline">Ro'yxatdan o'tish</span><span className="min-[390px]:hidden">Ro'yxat</span></Link>
          </> : <button className="rounded-lg px-2 py-2 text-xs font-semibold text-red-600 sm:px-3 sm:text-sm" onClick={signOut}><LogOut className="inline" size={16}/> Chiqish</button>}
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-3 py-5 pb-24 sm:px-4 sm:py-8 md:pb-8">{children}</main>
    <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-500 sm:mt-12 sm:py-6 sm:text-sm dark:border-slate-800">Attestatsiya Quiz Platform · <Link className="hover:text-indigo-600" to="/admin-login">Admin kirish</Link></footer>
    {user && <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white/95 px-1 pt-1.5 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95">
      {profile?.role !== "admin" && <NavLink to="/dashboard" className={itemClass}><LayoutDashboard className="mx-auto" size={18}/> Dashboard</NavLink>}
      {profile?.role !== "admin" && <NavLink to="/categories" className={itemClass}><PlayCircle className="mx-auto" size={18}/> Quiz</NavLink>}
      {profile?.role !== "admin" && <NavLink to="/leaderboard" className={itemClass}><Award className="mx-auto" size={18}/> Reyting</NavLink>}
      {profile?.role !== "admin" && <NavLink to="/profile" className={itemClass}><User className="mx-auto" size={18}/> Profil</NavLink>}
      {profile?.role === "admin" && <NavLink to="/admin" className={itemClass}><Settings className="mx-auto" size={18}/> Admin</NavLink>}
    </nav>}
  </div>;
}
