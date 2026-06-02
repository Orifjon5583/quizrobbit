import { Award, Home, LayoutDashboard, LogIn, LogOut, Moon, Settings, Sun, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const itemClass = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`;

export default function Layout({ children }) {
  const { user, profile, signOut } = useAuth();
  const [dark, setDark] = useState(() => localStorage.theme === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);
  return <div className="min-h-screen">
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-black text-indigo-600"><Award /> Attestatsiya Quiz</Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={itemClass}><Home className="inline" size={16} /> Bosh sahifa</NavLink>
          {user && profile?.role !== "admin" && <NavLink to="/dashboard" className={itemClass}><LayoutDashboard className="inline" size={16} /> Dashboard</NavLink>}
          {user && profile?.role !== "admin" && <NavLink to="/leaderboard" className={itemClass}><Award className="inline" size={16} /> Reyting</NavLink>}
          {user && profile?.role !== "admin" && <NavLink to="/profile" className={itemClass}><User className="inline" size={16} /> Profil</NavLink>}
          {profile?.role === "admin" && <NavLink to="/admin" className={itemClass}><Settings className="inline" size={16} /> Admin</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDark(!dark)} aria-label="Rang rejimi">{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
          {!user ? <>
            <Link className="hidden rounded-lg px-3 py-2 text-sm font-semibold sm:block" to="/login"><LogIn className="inline" size={16} /> Kirish</Link>
            <Link className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white" to="/register"><UserPlus className="inline" size={16} /> Ro'yxatdan o'tish</Link>
          </> : <button className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600" onClick={signOut}><LogOut className="inline" size={16} /> Chiqish</button>}
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">{children}</main>
    <footer className="mt-12 border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800">Attestatsiya Quiz Platform · <Link className="hover:text-indigo-600" to="/admin-login">Admin kirish</Link></footer>
    {user && <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95">
      {profile?.role !== "admin" && <NavLink to="/dashboard" className={itemClass}><LayoutDashboard className="mx-auto" size={18} /> Dashboard</NavLink>}
      {profile?.role !== "admin" && <NavLink to="/leaderboard" className={itemClass}><Award className="mx-auto" size={18} /> Reyting</NavLink>}
      {profile?.role !== "admin" && <NavLink to="/profile" className={itemClass}><User className="mx-auto" size={18} /> Profil</NavLink>}
      {profile?.role === "admin" && <NavLink to="/admin" className={itemClass}><Settings className="mx-auto" size={18} /> Admin</NavLink>}
    </nav>}
  </div>;
}
