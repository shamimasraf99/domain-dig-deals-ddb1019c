// API-ready fetcher. Swap fetch URL when backend is live.
import domains from "@/data/domains.json";
import hosting from "@/data/hosting.json";
import vps from "@/data/vps.json";
import coupons from "@/data/coupons.json";

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

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchDomains(): Promise<DomainOffer[]> {
  await wait(150);
  return domains as DomainOffer[];
}
export async function fetchHosting(): Promise<HostingOffer[]> {
  await wait(150);
  return hosting as HostingOffer[];
}
export async function fetchVps(): Promise<VpsOffer[]> {
  await wait(150);
  return vps as VpsOffer[];
}
export async function fetchCoupons(): Promise<Coupon[]> {
  await wait(150);
  return coupons as Coupon[];
}
