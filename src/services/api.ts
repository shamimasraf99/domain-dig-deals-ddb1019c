// API service. Fetches from public JSON files; swap URLs when backend is live.

export interface DomainOffer {
  id: string;
  domain: string;
  registrar: string;
  registrar_logo: string;
  price: number;
  coupon_code: string;
  registration_price: number;
  transfer_price: number;
  renewal_price: number;
  category: string;
  buy_link: string;
  cheapest?: boolean;
  rating?: number;
}

export interface HostingOffer {
  id: string;
  name: string;
  provider: string;
  price: number;
  original_price: number;
  period: string;
  discount: number;
  features: string[];
  rating: number;
  buy_link: string;
  badge?: string;
  category: string;
}

export interface VpsOffer {
  id: string;
  name: string;
  provider: string;
  price: number;
  period: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  rating: number;
  buy_link: string;
  badge?: string;
}

export interface Coupon {
  id: string;
  title: string;
  code: string;
  provider: string;
  discount: string;
  expires: string;
  category: string;
  buy_link: string;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return (await res.json()) as T;
}

export const fetchDomains = () => getJSON<DomainOffer[]>("/domains.json");
export const fetchHosting = () => getJSON<HostingOffer[]>("/hosting.json");
export const fetchVps = () => getJSON<VpsOffer[]>("/vps.json");
export const fetchCoupons = () => getJSON<Coupon[]>("/coupons.json");
