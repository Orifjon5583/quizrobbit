import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { ErrorBox } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { friendlyError } from "../lib/errors";

export default function AdminLogin() {
  const { profile, signInAdmin } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" }); const [error, setError] = useState("");
  if (profile?.role === "admin") return <Navigate to="/admin" replace />;
  const submit = event => { event.preventDefault(); try { signInAdmin(form); navigate("/admin"); } catch (e) { setError(friendlyError(e)); } };
  return <div className="mx-auto max-w-md card animate-fade-in"><ShieldCheck className="mb-3 text-indigo-600" size={32}/><h1 className="text-2xl font-black">Admin kirish</h1><p className="mt-1 text-sm text-slate-500">Bu sahifa faqat administrator uchun.</p><form onSubmit={submit} className="mt-5 space-y-4"><label><span className="label">Admin login</span><input required className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></label><label><span className="label">Parol</span><input required type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password:e.target.value })}/></label><ErrorBox message={error}/><button className="btn-primary w-full"><ShieldCheck size={18}/> Admin sifatida kirish</button></form></div>;
}
