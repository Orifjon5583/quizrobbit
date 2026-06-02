import { createContext, useContext, useEffect, useState } from "react";
import { api, clearToken, getToken } from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!getToken()) return setLoading(false); api.me().then(setUser).catch(clearToken).finally(() => setLoading(false)); }, []);
  const signIn = async values => setUser(await api.login(values));
  const signUp = async values => setUser(await api.register(values));
  const signInAdmin = async values => setUser(await api.adminLogin(values));
  const signOut = () => { clearToken(); setUser(null); };
  return <AuthContext.Provider value={{ user, profile: user, loading, signIn, signInAdmin, signUp, signOut }}>{children}</AuthContext.Provider>;
}
