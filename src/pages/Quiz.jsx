import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorBox, Loader } from "../components/UI";
import { api } from "../lib/api";
import { friendlyError } from "../lib/errors";

const QUESTION_SECONDS = 20;

export default function Quiz() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [time, setTime] = useState(QUESTION_SECONDS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const answer = useCallback(async (selectedAnswer = null) => {
    if (!state || busy || state.review) return;
    setBusy(true);
    try {
      const data = await api.answerQuiz(state.sessionId, selectedAnswer);
      setState(data);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }, [busy, state]);

  const nextQuestion = useCallback(async () => {
    if (!state || busy || !state.review) return;
    setBusy(true);
    try {
      const data = await api.continueQuiz(state.sessionId);
      if (data.completed) navigate(`/result/${data.resultId}`, { replace: true });
      else {
        setState(data);
        setTime(QUESTION_SECONDS);
      }
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }, [busy, navigate, state]);

  useEffect(() => {
    api.startQuiz(decodeURIComponent(category)).then(setState).catch(e => setError(friendlyError(e)));
  }, [category]);

  useEffect(() => {
    if (!state || busy || state.review) return;
    if (time <= 0) {
      answer(null);
      return;
    }
    const timer = setTimeout(() => setTime(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [answer, busy, state, time]);

  if (error) return <div className="mx-auto max-w-xl"><ErrorBox message={error} /></div>;
  if (!state) return <Loader label="Quiz tayyorlanmoqda..." />;

  const progress = ((state.index + 1) / state.total) * 100;
  const isReview = Boolean(state.review);

  return <div className="mx-auto max-w-2xl animate-fade-in">
    <div className="mb-3 flex items-center justify-between text-sm font-bold">
      <span>{state.category} | {state.index + 1}/{state.total}</span>
      <span className={time <= 5 && !isReview ? "text-red-600" : "text-indigo-600"}><Clock3 className="inline" size={17} /> {isReview ? "Tekshirildi" : `${time}s`}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} /></div>
    <div className="card mt-4 sm:mt-5">
      <h1 className="text-lg font-black leading-relaxed sm:text-xl">{state.question.question}</h1>
      {isReview && <div className={`mt-4 rounded-2xl border p-4 text-sm font-medium ${state.review.isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300" : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"}`}>
        <div className="flex items-center gap-2 font-bold">
          {state.review.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {state.review.isCorrect ? "To'g'ri javob berdingiz" : "Noto'g'ri javob berdingiz"}
        </div>
        <p className="mt-2">To'g'ri javob: <span className="font-black">{state.review.correctAnswer}</span></p>
        {state.review.selectedAnswer !== null && <p className="mt-1">Siz tanladingiz: <span className="font-black">{state.review.selectedAnswer}</span></p>}
      </div>}
      <div className="mt-5 grid gap-3 sm:mt-6">
        {state.question.options.map((option, index) => {
          const selected = isReview && state.review.selectedAnswer === option;
          const correct = isReview && state.review.correctAnswer === option;
          const optionClass = isReview
            ? correct
              ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
              : selected
                ? "border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
                : "border-slate-200 opacity-70 dark:border-slate-700"
            : "border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-indigo-950";

          return <button
            disabled={busy || isReview}
            onClick={() => answer(option)}
            className={`min-h-14 rounded-xl border p-3.5 text-left text-sm font-medium active:scale-[.99] disabled:opacity-60 sm:p-4 sm:text-base ${optionClass}`}
            key={option}
          >
            <span className="mr-2 font-black text-indigo-600 sm:mr-3">{String.fromCharCode(65 + index)}.</span>{option}
          </button>;
        })}
      </div>
      {isReview && <button disabled={busy} onClick={nextQuestion} className="btn-primary mt-5 w-full">
        Keyingi
      </button>}
    </div>
  </div>;
}
