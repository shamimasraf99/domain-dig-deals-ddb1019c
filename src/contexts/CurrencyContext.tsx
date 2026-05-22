import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Currency = "USD" | "BDT" | "INR" | "GBP" | "EUR";

// Base prices in JSON are stored in USD (scraped from domainoffer.net)
const RATES: Record<Currency, number> = {
  USD: 1,
  BDT: 110,
  INR: 83,
  GBP: 0.79,
  EUR: 0.92,
};


const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  BDT: "৳",
  INR: "₹",
  GBP: "£",
  EUR: "€",
};

interface Ctx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (priceUsd: number) => string;
  symbol: string;
  convert: (priceUsd: number) => number;
}

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("currency") as Currency | null;
    if (saved && RATES[saved]) setCurrencyState(saved);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") localStorage.setItem("currency", c);
  };

  const convert = (priceUsd: number) => priceUsd * RATES[currency];

  const format = (priceUsd: number) => {
    const v = convert(priceUsd);
    const decimals = currency === "BDT" || currency === "INR" ? 0 : 2;
    return `${SYMBOLS[currency]}${v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };


  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, format, symbol: SYMBOLS[currency], convert }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be inside CurrencyProvider");
  return ctx;
}

export const CURRENCIES: Currency[] = ["USD", "BDT", "INR", "GBP", "EUR"];
