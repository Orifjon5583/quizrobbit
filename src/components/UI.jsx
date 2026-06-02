import { LoaderCircle } from "lucide-react";

export const Loader = ({ label = "Yuklanmoqda..." }) => (
  <div className="flex min-h-48 items-center justify-center gap-3 text-slate-500">
    <LoaderCircle className="animate-spin" size={22} /> {label}
  </div>
);

export const ErrorBox = ({ message }) => message ? (
  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{message}</div>
) : null;

export const EmptyState = ({ children }) => <div className="card text-center text-slate-500">{children}</div>;

export function StatCard({ label, value, accent = "text-indigo-600" }) {
  return <div className="card"><p className="text-sm text-slate-500">{label}</p><p className={`mt-1 text-3xl font-black ${accent}`}>{value}</p></div>;
}
