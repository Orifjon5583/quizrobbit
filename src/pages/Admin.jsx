import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { EmptyState } from "../components/UI";
import { getRows } from "../lib/storage";

export default function Admin() {
  const [users, setUsers] = useState([]);
  useEffect(() => setUsers(getRows("users")), []);
  return <div className="animate-fade-in">
    <h1 className="flex items-center gap-2 text-2xl font-black sm:text-3xl"><Users className="text-indigo-600"/> Admin panel</h1>
    <p className="mt-1 text-sm text-slate-500 sm:text-base">Ro'yxatdan o'tgan foydalanuvchilar.</p>
    <div className="mt-5 grid gap-2 sm:hidden">{users.map((user, index) => <div className="card" key={user.uid}><div className="flex items-center justify-between gap-3"><p className="font-bold">{index + 1}. {user.name}</p><span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950">User</span></div><p className="mt-1 truncate text-sm text-slate-500">{user.email}</p><p className="mt-2 text-xs text-slate-400">{new Date(user.createdAt).toLocaleString("uz-UZ")}</p></div>)}{!users.length && <EmptyState>Hali foydalanuvchilar mavjud emas.</EmptyState>}</div>
    <div className="card mt-6 hidden overflow-x-auto sm:block">
      {users.length ? <table className="w-full text-left text-sm">
        <thead><tr className="border-b dark:border-slate-700"><th className="p-3">#</th><th className="p-3">Ism</th><th className="p-3">Email</th><th className="p-3">Ro'yxatdan o'tgan vaqt</th></tr></thead>
        <tbody>{users.map((user, index) => <tr className="border-b last:border-0 dark:border-slate-800" key={user.uid}><td className="p-3">{index + 1}</td><td className="p-3 font-bold">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3">{new Date(user.createdAt).toLocaleString("uz-UZ")}</td></tr>)}</tbody>
      </table> : <EmptyState>Hali foydalanuvchilar mavjud emas.</EmptyState>}
    </div>
  </div>;
}
