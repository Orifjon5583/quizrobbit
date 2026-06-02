import { createContext, useContext, useEffect, useState } from "react";
import { ensureQuestions, getCurrentUser, login, loginAdmin, logout, register } from "../lib/storage";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { ensureQuestions(); const currentUser = getCurrentUser(); setUser(currentUser); setProfile(currentUser); setLoading(false); }, []);
  const signIn = async values => { const currentUser = await login(values); setUser(currentUser); setProfile(currentUser); };
  const signUp = async values => { const currentUser = await register(values); setUser(currentUser); setProfile(currentUser); };
  const signInAdmin = values => { const currentUser = loginAdmin(values); setUser(currentUser); setProfile(currentUser); };
  const signOut = () => { logout(); setUser(null); setProfile(null); };

  return <AuthContext.Provider value={{ user, profile, loading, signIn, signInAdmin, signUp, signOut }}>{children}</AuthContext.Provider>;
}
