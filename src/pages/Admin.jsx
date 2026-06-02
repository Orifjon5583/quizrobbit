import { useEffect, useState } from "react";
import { EmptyState } from "../components/UI";
import { getRows } from "../lib/storage";

export default function Admin() {
  const [users, setUsers] = useState([]);
  useEffect(() => setUsers(getRows("users")), []);
  return <div className="animate-fade-in">
    <h1 className="text-3xl font-black">Admin panel</h1>
    <p className="mt-1 text-slate-500">Ro'yxatdan o'tgan foydalanuvchilar.</p>
    <div className="card mt-6 overflow-x-auto">
      {users.length ? <table className="w-full text-left text-sm">
        <thead><tr className="border-b dark:border-slate-700"><th className="p-3">#</th><th className="p-3">Ism</th><th className="p-3">Email</th><th className="p-3">Ro'yxatdan o'tgan vaqt</th></tr></thead>
        <tbody>{users.map((user, index) => <tr className="border-b last:border-0 dark:border-slate-800" key={user.uid}><td className="p-3">{index + 1}</td><td className="p-3 font-bold">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3">{new Date(user.createdAt).toLocaleString("uz-UZ")}</td></tr>)}</tbody>
      </table> : <EmptyState>Hali foydalanuvchilar mavjud emas.</EmptyState>}
    </div>
  </div>;
}
