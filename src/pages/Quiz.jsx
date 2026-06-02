import { Clock3 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorBox, Loader } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { friendlyError } from "../lib/errors";
import { finishQuiz, startQuiz } from "../lib/storage";

const QUESTION_SECONDS = 20;
export default function Quiz() {
  const { category } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [state, setState] = useState(null); const [time, setTime] = useState(QUESTION_SECONDS); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const answer = useCallback((selectedAnswer = null) => {
    if (!state || busy) return;
    setBusy(true);
    try {
      const question = state.questions[state.index];
      const answers = [...state.answers, { questionId: question.id, selectedAnswer, isCorrect: selectedAnswer === question.correctAnswer }];
      if (state.index + 1 === state.questions.length) {
        const result = finishQuiz({ ...state, answers }, user); navigate(`/result/${result.id}`, { replace: true });
      } else { setState({ ...state, answers, index: state.index + 1 }); setTime(QUESTION_SECONDS); }
    } catch (e) { setError(friendlyError(e)); } finally { setBusy(false); }
  }, [busy, navigate, state, user]);
  useEffect(() => { try { setState(startQuiz(decodeURIComponent(category))); } catch (e) { setError(friendlyError(e)); } }, [category]);
  useEffect(() => {
    if (!state || busy) return;
    if (time <= 0) { answer(null); return; }
    const timer = setTimeout(() => setTime(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [answer, busy, state, time]);
  if (error) return <div className="mx-auto max-w-xl"><ErrorBox message={error}/></div>;
  if (!state) return <Loader label="Quiz tayyorlanmoqda..."/>;
  const question = state.questions[state.index]; const progress = ((state.index + 1) / state.questions.length) * 100;
  return <div className="mx-auto max-w-2xl animate-fade-in">
    <div className="mb-3 flex items-center justify-between text-sm font-bold"><span>{state.category} · {state.index + 1}/{state.questions.length}</span><span className={time <= 5 ? "text-red-600" : "text-indigo-600"}><Clock3 className="inline" size={17}/> {time}s</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }}/></div>
    <div className="card mt-5"><h1 className="text-xl font-black leading-relaxed">{question.question}</h1><div className="mt-6 grid gap-3">{question.options.map((option, index) => <button disabled={busy} onClick={() => answer(option)} className="rounded-xl border border-slate-200 p-4 text-left font-medium hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-indigo-950" key={option}><span className="mr-3 font-black text-indigo-600">{String.fromCharCode(65 + index)}.</span>{option}</button>)}</div></div>
    <p className="mt-4 text-center text-sm text-slate-500">Javob tanlangandan keyin ortga qaytib bo'lmaydi.</p>
  </div>;
}
