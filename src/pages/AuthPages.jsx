import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ErrorBox } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { friendlyError } from "../lib/errors";

function AuthForm({ register = false }) {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/dashboard" />;
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      if (register) signUp(form); else signIn(form);
      navigate("/dashboard");
    } catch (e) { setError(friendlyError(e)); } finally { setLoading(false); }
  };
  return <div className="mx-auto max-w-md card animate-fade-in">
    <h1 className="text-2xl font-black">{register ? "Ro'yxatdan o'tish" : "Tizimga kirish"}</h1>
    <p className="mt-1 text-sm text-slate-500">Quiz platformasiga xush kelibsiz.</p>
    <form onSubmit={submit} className="mt-5 space-y-4">
      {register && <label><span className="label">Ism va familiya</span><input required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>}
      <label><span className="label">Email</span><input required type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
      <label><span className="label">Parol</span><input required minLength="6" type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
      <ErrorBox message={error} />
      <button disabled={loading} className="btn-primary w-full">{register ? <UserPlus size={18}/> : <LogIn size={18}/>} {loading ? "Kuting..." : register ? "Ro'yxatdan o'tish" : "Kirish"}</button>
    </form>
    <p className="mt-4 text-sm text-slate-500">{register ? "Akkauntingiz bormi?" : "Akkauntingiz yo'qmi?"} <Link className="font-bold text-indigo-600" to={register ? "/login" : "/register"}>{register ? "Kirish" : "Ro'yxatdan o'tish"}</Link></p>
  </div>;
}
export const Login = () => <AuthForm />;
export const Register = () => <AuthForm register />;
