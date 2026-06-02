import { Clock3 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorBox, Loader } from "../components/UI";
import { api } from "../lib/api";
import { friendlyError } from "../lib/errors";

const QUESTION_SECONDS = 20;
export default function Quiz() {
  const { category } = useParams(); const navigate = useNavigate();
  const [state, setState] = useState(null); const [time, setTime] = useState(QUESTION_SECONDS); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const answer = useCallback(async (selectedAnswer = null) => {
    if (!state || busy) return; setBusy(true);
    try {
      const data = await api.answerQuiz(state.sessionId, selectedAnswer);
      if (data.completed) navigate(`/result/${data.resultId}`, { replace: true });
      else { setState(data); setTime(QUESTION_SECONDS); }
    } catch (e) { setError(friendlyError(e)); } finally { setBusy(false); }
  }, [busy, navigate, state]);
  useEffect(() => { api.startQuiz(decodeURIComponent(category)).then(setState).catch(e => setError(friendlyError(e))); }, [category]);
  useEffect(() => {
    if (!state || busy) return;
    if (time <= 0) { answer(null); return; }
    const timer = setTimeout(() => setTime(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [answer, busy, state, time]);
  if (error) return <div className="mx-auto max-w-xl"><ErrorBox message={error}/></div>;
  if (!state) return <Loader label="Quiz tayyorlanmoqda..."/>;
  const progress = ((state.index + 1) / state.total) * 100;
  return <div className="mx-auto max-w-2xl animate-fade-in">
    <div className="mb-3 flex items-center justify-between text-sm font-bold"><span>{state.category} · {state.index + 1}/{state.total}</span><span className={time <= 5 ? "text-red-600" : "text-indigo-600"}><Clock3 className="inline" size={17}/> {time}s</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }}/></div>
    <div className="card mt-4 sm:mt-5"><h1 className="text-lg font-black leading-relaxed sm:text-xl">{state.question.question}</h1><div className="mt-5 grid gap-3 sm:mt-6">{state.question.options.map((option, index) => <button disabled={busy} onClick={() => answer(option)} className="min-h-14 rounded-xl border border-slate-200 p-3.5 text-left text-sm font-medium active:scale-[.99] hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-60 sm:p-4 sm:text-base dark:border-slate-700 dark:hover:bg-indigo-950" key={option}><span className="mr-2 font-black text-indigo-600 sm:mr-3">{String.fromCharCode(65 + index)}.</span>{option}</button>)}</div></div>
  </div>;
}
