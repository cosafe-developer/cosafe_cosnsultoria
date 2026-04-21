import { createContext, useContext, useState } from "react";
import { useFetch } from "../hooks/useFetch.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { data: content,  loading: cl } = useFetch("/api/content");
  const { data: services, loading: sl } = useFetch("/api/services");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loading = cl || sl;

  return (
    <AppContext.Provider value={{ content, services, loading, mobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
