import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const ThemeContext = createContext<{
  theme: "light" | "dark";
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (localStorage.getItem("theme") as "light" | "dark" | null) ||
      (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme inside ThemeProvider");
  return ctx;
}
