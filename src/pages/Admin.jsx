import { Edit3, PlusCircle, Search, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorBox, Loader, StatCard } from "../components/UI";
import { api } from "../lib/api";
import { categories } from "../lib/constants";
import { friendlyError } from "../lib/errors";

const defaultCategory = categories[0]?.name || "";
const createEmptyForm = (category = defaultCategory, difficulty = "easy") => ({
  category,
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctAnswer: "",
  difficulty,
});

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(createEmptyForm());
  const [editingId, setEditingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [usersData, summaryData, questionsData] = await Promise.all([api.users(), api.adminQuestionSummary(), api.adminQuestions()]);
      setUsers(usersData);
      setSummary(summaryData);
      setQuestions(questionsData);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const categoryCounts = useMemo(() => summary?.categories || {}, [summary]);
  const totalQuestions = summary?.total || 0;
  const filteredQuestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions.filter(question => {
      const categoryOk = categoryFilter === "all" || question.category === categoryFilter;
      const queryOk = !q
        || question.question.toLowerCase().includes(q)
        || question.options.some(option => option.toLowerCase().includes(q));
      return categoryOk && queryOk;
    });
  }, [categoryFilter, query, questions]);

  const updateField = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === "category") {
        next.correctAnswer = [next.option1, next.option2, next.option3, next.option4].includes(next.correctAnswer) ? next.correctAnswer : "";
      }
      if (field.startsWith("option") && ![next.option1, next.option2, next.option3, next.option4].includes(next.correctAnswer)) {
        next.correctAnswer = "";
      }
      return next;
    });
  };

  const clearForm = () => {
    setEditingId(null);
    setSuccess("");
    setError("");
    setForm(createEmptyForm(form.category, form.difficulty));
  };

  const startEdit = question => {
    setEditingId(question.id);
    setSuccess("");
    setError("");
    setForm({
      category: question.category,
      question: question.question,
      option1: question.options[0] || "",
      option2: question.options[1] || "",
      option3: question.options[2] || "",
      option4: question.options[3] || "",
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async event => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await api.updateQuestion(editingId, form);
        setSuccess("Savol yangilandi.");
      } else {
        await api.createQuestion(form);
        setSuccess("Savol qo'shildi.");
      }
      await load();
      setEditingId(null);
      setForm(createEmptyForm(form.category, form.difficulty));
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const formTitle = editingId ? "Savolni tahrirlash" : "Yangi savol qo'shish";

  if (loading) return <Loader label="Admin panel yuklanmoqda..." />;

  return <div className="animate-fade-in">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black sm:text-3xl"><Users className="text-indigo-600" /> Admin panel</h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">Savollarni qo'shish, tahrirlash, statistikani ko'rish va foydalanuvchilarni boshqarish.</p>
      </div>
    </div>

    <div className="mt-5 grid gap-2 sm:grid-cols-3 sm:gap-4">
      <StatCard label="Jami savollar" value={totalQuestions} />
      <StatCard label="Bo'limlar" value={Object.keys(categoryCounts).length || categories.length} accent="text-amber-600" />
      <StatCard label="Foydalanuvchilar" value={users.length} accent="text-emerald-600" />
    </div>

    <div className="mt-6 card">
      <div className="flex items-center gap-2">
        {editingId ? <Edit3 className="text-indigo-600" size={22} /> : <PlusCircle className="text-indigo-600" size={22} />}
        <h2 className="text-xl font-black">{formTitle}</h2>
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
        <div className="flex flex-wrap gap-2">
          <button disabled={busy} className="btn-primary w-full sm:w-auto">
            {editingId ? <Edit3 size={18} /> : <PlusCircle size={18} />} {busy ? "Saqlanmoqda..." : editingId ? "Yangilash" : "Savolni qo'shish"}
          </button>
          {editingId && <button type="button" disabled={busy} onClick={clearForm} className="btn-secondary w-full sm:w-auto">
            <X size={18} /> Bekor qilish
          </button>}
        </div>
      </form>
    </div>

    <div className="mt-6 card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Savollar ro'yxati</h2>
          <p className="mt-1 text-sm text-slate-500">Savollarni toping va tahrirlash tugmasi bilan o'zgartiring.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <label className="w-full sm:w-56">
            <span className="label">Qidiruv</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input className="input pl-9" value={query} onChange={e => setQuery(e.target.value)} placeholder="Savol yoki variant" />
            </div>
          </label>
          <label className="w-full sm:w-48">
            <span className="label">Kategoriya</span>
            <select className="input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">Barcha bo'limlar</option>
              {categories.map(category => <option key={category.name} value={category.name}>{category.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:hidden">
        {filteredQuestions.map((question, index) => <div className="card" key={question.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{question.category}</p>
              <p className="mt-1 font-bold leading-relaxed">{index + 1}. {question.question}</p>
            </div>
            <button onClick={() => startEdit(question)} className="btn-secondary shrink-0 text-xs"><Edit3 size={16} /> Tahrirlash</button>
          </div>
          <p className="mt-2 text-xs text-slate-500">{question.difficulty}</p>
        </div>)}
        {!filteredQuestions.length && <EmptyState>Hali savollar mavjud emas.</EmptyState>}
      </div>

      <div className="mt-5 hidden overflow-x-auto sm:block">
        {filteredQuestions.length ? <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b dark:border-slate-700">
              <th className="p-3">#</th>
              <th className="p-3">Kategoriya</th>
              <th className="p-3">Savol</th>
              <th className="p-3">Qiyinchilik</th>
              <th className="p-3">Amal</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question, index) => <tr className="border-b last:border-0 dark:border-slate-800" key={question.id}>
              <td className="p-3">{index + 1}</td>
              <td className="p-3 font-bold">{question.category}</td>
              <td className="p-3">
                <div className="max-w-[40rem]">
                  <p className="font-medium">{question.question}</p>
                  <p className="mt-1 text-xs text-slate-500">{question.options.join(" · ")}</p>
                </div>
              </td>
              <td className="p-3 capitalize">{question.difficulty}</td>
              <td className="p-3">
                <button onClick={() => startEdit(question)} className="btn-secondary text-xs"><Edit3 size={16} /> Tahrirlash</button>
              </td>
            </tr>)}
          </tbody>
        </table> : <EmptyState>Hali savollar mavjud emas.</EmptyState>}
      </div>
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
