import { PlusCircle, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorBox, Loader, StatCard } from "../components/UI";
import { api } from "../lib/api";
import { categories } from "../lib/constants";
import { friendlyError } from "../lib/errors";

const defaultCategory = categories[0]?.name || "";
const emptyForm = {
  category: defaultCategory,
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctAnswer: "",
  difficulty: "easy",
};

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const [usersData, summaryData] = await Promise.all([api.users(), api.adminQuestionSummary()]);
      setUsers(usersData);
      setSummary(summaryData);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const categoryCounts = useMemo(() => summary?.categories || {}, [summary]);
  const teacherCount = categoryCounts["Ustozlar yo'riqnomasi"] || 0;
  const totalQuestions = summary?.total || 0;

  const submit = async event => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api.createQuestion(form);
      setSuccess("Savol qo'shildi.");
      setForm({ ...emptyForm, category: form.category, difficulty: form.difficulty });
      await load();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const updateField = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field.startsWith("option") && ![next.option1, next.option2, next.option3, next.option4].includes(next.correctAnswer)) {
        next.correctAnswer = "";
      }
      return next;
    });
  };

  if (loading) return <Loader label="Admin panel yuklanmoqda..." />;

  return <div className="animate-fade-in">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black sm:text-3xl"><Users className="text-indigo-600" /> Admin panel</h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">Savollarni qo'shish, statistikani ko'rish va foydalanuvchilarni boshqarish.</p>
      </div>
    </div>

    <div className="mt-5 grid gap-2 sm:grid-cols-3 sm:gap-4">
      <StatCard label="Jami savollar" value={totalQuestions} />
      <StatCard label="Ustozlar bo'limi" value={teacherCount} accent="text-amber-600" />
      <StatCard label="Foydalanuvchilar" value={users.length} accent="text-emerald-600" />
    </div>

    <div className="mt-6 card">
      <div className="flex items-center gap-2">
        <PlusCircle className="text-indigo-600" size={22} />
        <h2 className="text-xl font-black">Yangi savol qo'shish</h2>
      </div>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="label">Kategoriya</span>
            <select className="input" value={form.category} onChange={e => updateField("category", e.target.value)}>
              {categories.map(category => <option key={category.name} value={category.name}>{category.name}</option>)}
            </select>
          </label>
          <label>
            <span className="label">Qiyinchilik</span>
            <select className="input" value={form.difficulty} onChange={e => updateField("difficulty", e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>

        <label>
          <span className="label">Savol</span>
          <textarea className="input min-h-28" value={form.question} onChange={e => updateField("question", e.target.value)} placeholder="Savol matnini kiriting" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          {["option1", "option2", "option3", "option4"].map((field, index) => <label key={field}>
            <span className="label">Variant {String.fromCharCode(65 + index)}</span>
            <input className="input" value={form[field]} onChange={e => updateField(field, e.target.value)} placeholder={`Variant ${String.fromCharCode(65 + index)}`} />
          </label>)}
        </div>

        <label>
          <span className="label">To'g'ri javob</span>
          <select className="input" value={form.correctAnswer} onChange={e => updateField("correctAnswer", e.target.value)}>
            <option value="">Variant tanlang</option>
            {[form.option1, form.option2, form.option3, form.option4].filter(Boolean).map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>

        <ErrorBox message={error} />
        {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">{success}</div>}
        <button disabled={busy} className="btn-primary w-full sm:w-auto">
          <PlusCircle size={18} /> {busy ? "Saqlanmoqda..." : "Savolni qo'shish"}
        </button>
      </form>
    </div>

    <h2 className="mt-8 text-xl font-black">Foydalanuvchilar</h2>
    <p className="mt-1 text-sm text-slate-500 sm:text-base">Ro'yxatdan o'tgan foydalanuvchilar.</p>
    <div className="mt-5 grid gap-2 sm:hidden">
      {users.map((user, index) => <div className="card" key={user.uid}><div className="flex items-center justify-between gap-3"><p className="font-bold">{index + 1}. {user.name}</p><span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950">User</span></div><p className="mt-1 truncate text-sm text-slate-500">{user.email}</p><p className="mt-2 text-xs text-slate-400">{new Date(user.createdAt).toLocaleString("uz-UZ")}</p></div>)}
      {!users.length && <EmptyState>Hali foydalanuvchilar mavjud emas.</EmptyState>}
    </div>
    <div className="card mt-6 hidden overflow-x-auto sm:block">
      {users.length ? <table className="w-full text-left text-sm">
        <thead><tr className="border-b dark:border-slate-700"><th className="p-3">#</th><th className="p-3">Ism</th><th className="p-3">Email</th><th className="p-3">Ro'yxatdan o'tgan vaqt</th></tr></thead>
        <tbody>{users.map((user, index) => <tr className="border-b last:border-0 dark:border-slate-800" key={user.uid}><td className="p-3">{index + 1}</td><td className="p-3 font-bold">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3">{new Date(user.createdAt).toLocaleString("uz-UZ")}</td></tr>)}</tbody>
      </table> : <EmptyState>Hali foydalanuvchilar mavjud emas.</EmptyState>}
    </div>
  </div>;
}
