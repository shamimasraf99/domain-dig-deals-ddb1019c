import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "bn" | "hi" | "ar";

const dict = {
  en: {
    nav_domains: "Domain Offers",
    nav_hosting: "Hosting Offers",
    nav_vps: "VPS Offers",
    nav_free: "Free Domains",
    nav_coupons: "Coupons",
    nav_cheapest: "Cheapest Domains",
    nav_best_hosting: "Best Hosting",
    nav_registrars: "Registrars",
    nav_blog: "Blog",
    nav_contact: "Contact",
    hero_badge: "Compare 100+ registrars in seconds",
    hero_title_1: "Find the",
    hero_title_2: "cheapest domain",
    hero_title_3: "and hosting deals",
    hero_subtitle: "Real-time price comparison across the world's top domain registrars and hosting providers. Save hundreds with verified coupon codes.",
    search_placeholder: "Search domain extension, e.g. .com, .io",
    search_btn: "Compare Now",
    popular_extensions: "Popular Extensions",
    featured_hosting: "Featured Hosting Offers",
    latest_coupons: "Latest Coupon Codes",
    trending: "Trending Offers",
    top_vps: "Top VPS Deals",
    faq: "Frequently Asked Questions",
    newsletter_title: "Never miss a deal",
    newsletter_sub: "Get the freshest domain & hosting offers delivered weekly.",
    subscribe: "Subscribe",
    your_email: "Enter your email",
    view_all: "View all",
    buy_now: "Buy Now",
    compare: "Compare",
    copy_code: "Copy Code",
    copied: "Copied!",
    cheapest_badge: "Cheapest",
    th_extension: "Extension",
    th_registrar: "Registrar",
    th_price: "Price",
    th_coupon: "Coupon",
    th_registration: "Registration",
    th_transfer: "Transfer",
    th_renewal: "Renewal",
    th_action: "Action",
    filter_registrar: "All Registrars",
    sort_by: "Sort by",
    sort_reg: "Registration price",
    sort_renew: "Renewal price",
    cheapest_only: "Cheapest only",
    no_results: "No offers match your filters.",
  },
  bn: {
    nav_domains: "ডোমেইন অফার",
    nav_hosting: "হোস্টিং অফার",
    nav_vps: "ভিপিএস অফার",
    nav_free: "ফ্রি ডোমেইন",
    nav_coupons: "কুপন",
    nav_cheapest: "সস্তা ডোমেইন",
    nav_best_hosting: "সেরা হোস্টিং",
    nav_registrars: "রেজিস্ট্রার",
    nav_blog: "ব্লগ",
    nav_contact: "যোগাযোগ",
    hero_badge: "১০০+ রেজিস্ট্রার তুলনা করুন",
    hero_title_1: "খুঁজুন",
    hero_title_2: "সবচেয়ে সস্তা ডোমেইন",
    hero_title_3: "এবং হোস্টিং অফার",
    hero_subtitle: "বিশ্বের শীর্ষ ডোমেইন রেজিস্ট্রার ও হোস্টিং প্রোভাইডারদের রিয়েল-টাইম মূল্য তুলনা।",
    search_placeholder: "এক্সটেনশন খুঁজুন, যেমন .com",
    search_btn: "তুলনা করুন",
    popular_extensions: "জনপ্রিয় এক্সটেনশন",
    featured_hosting: "ফিচার্ড হোস্টিং",
    latest_coupons: "সর্বশেষ কুপন",
    trending: "ট্রেন্ডিং অফার",
    top_vps: "শীর্ষ ভিপিএস ডিল",
    faq: "সাধারণ প্রশ্ন",
    newsletter_title: "কোনো অফার মিস করবেন না",
    newsletter_sub: "সাপ্তাহিক সেরা অফার পান।",
    subscribe: "সাবস্ক্রাইব",
    your_email: "ইমেইল লিখুন",
    view_all: "সব দেখুন",
    buy_now: "কিনুন",
    compare: "তুলনা",
    copy_code: "কোড কপি",
    copied: "কপি হয়েছে!",
    cheapest_badge: "সস্তা",
    th_extension: "এক্সটেনশন",
    th_registrar: "রেজিস্ট্রার",
    th_price: "মূল্য",
    th_coupon: "কুপন",
    th_registration: "রেজিস্ট্রেশন",
    th_transfer: "ট্রান্সফার",
    th_renewal: "রিনিউয়াল",
    th_action: "অ্যাকশন",
    filter_registrar: "সব রেজিস্ট্রার",
    sort_by: "সাজান",
    sort_reg: "রেজিস্ট্রেশন মূল্য",
    sort_renew: "রিনিউয়াল মূল্য",
    cheapest_only: "শুধু সস্তা",
    no_results: "কোনো অফার পাওয়া যায়নি।",
  },
  hi: {
    nav_domains: "डोमेन ऑफर",
    nav_hosting: "होस्टिंग ऑफर",
    nav_vps: "वीपीएस ऑफर",
    nav_free: "मुफ्त डोमेन",
    nav_coupons: "कूपन",
    nav_cheapest: "सस्ते डोमेन",
    nav_best_hosting: "बेस्ट होस्टिंग",
    nav_registrars: "रजिस्ट्रार",
    nav_blog: "ब्लॉग",
    nav_contact: "संपर्क",
    hero_badge: "100+ रजिस्ट्रार की तुलना",
    hero_title_1: "खोजें",
    hero_title_2: "सबसे सस्ते डोमेन",
    hero_title_3: "और होस्टिंग डील",
    hero_subtitle: "दुनिया के टॉप रजिस्ट्रार और होस्टिंग प्रोवाइडर्स की रीयल-टाइम तुलना।",
    search_placeholder: "एक्सटेंशन खोजें, जैसे .com",
    search_btn: "तुलना करें",
    popular_extensions: "लोकप्रिय एक्सटेंशन",
    featured_hosting: "फीचर्ड होस्टिंग",
    latest_coupons: "नवीनतम कूपन",
    trending: "ट्रेंडिंग ऑफर",
    top_vps: "टॉप वीपीएस डील",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    newsletter_title: "कोई डील न चूकें",
    newsletter_sub: "साप्ताहिक बेस्ट ऑफर पाएं।",
    subscribe: "सब्सक्राइब",
    your_email: "ईमेल दर्ज करें",
    view_all: "सभी देखें",
    buy_now: "खरीदें",
    compare: "तुलना",
    copy_code: "कोड कॉपी",
    copied: "कॉपी हो गया!",
    cheapest_badge: "सस्ता",
    th_extension: "एक्सटेंशन",
    th_registrar: "रजिस्ट्रार",
    th_price: "मूल्य",
    th_coupon: "कूपन",
    th_registration: "रजिस्ट्रेशन",
    th_transfer: "ट्रांसफर",
    th_renewal: "रिन्यूअल",
    th_action: "क्रिया",
    filter_registrar: "सभी रजिस्ट्रार",
    sort_by: "क्रमबद्ध करें",
    sort_reg: "रजिस्ट्रेशन मूल्य",
    sort_renew: "रिन्यूअल मूल्य",
    cheapest_only: "केवल सस्ते",
    no_results: "कोई ऑफर नहीं मिला।",
  },
  ar: {
    nav_domains: "عروض النطاقات",
    nav_hosting: "عروض الاستضافة",
    nav_vps: "عروض VPS",
    nav_free: "نطاقات مجانية",
    nav_coupons: "كوبونات",
    nav_cheapest: "أرخص النطاقات",
    nav_best_hosting: "أفضل استضافة",
    nav_registrars: "المسجلون",
    nav_blog: "المدونة",
    nav_contact: "تواصل",
    hero_badge: "قارن أكثر من 100 مسجل",
    hero_title_1: "اعثر على",
    hero_title_2: "أرخص نطاق",
    hero_title_3: "وعروض استضافة",
    hero_subtitle: "مقارنة فورية بين أفضل مسجلي النطاقات ومزودي الاستضافة في العالم.",
    search_placeholder: "ابحث عن امتداد، مثل .com",
    search_btn: "قارن الآن",
    popular_extensions: "الامتدادات الشائعة",
    featured_hosting: "استضافة مميزة",
    latest_coupons: "أحدث الكوبونات",
    trending: "العروض الرائجة",
    top_vps: "أفضل عروض VPS",
    faq: "الأسئلة الشائعة",
    newsletter_title: "لا تفوّت أي عرض",
    newsletter_sub: "أفضل العروض أسبوعياً.",
    subscribe: "اشترك",
    your_email: "أدخل بريدك",
    view_all: "عرض الكل",
    buy_now: "اشترِ الآن",
    compare: "قارن",
    copy_code: "نسخ الكود",
    copied: "تم النسخ!",
    cheapest_badge: "الأرخص",
    th_extension: "الامتداد",
    th_registrar: "المسجل",
    th_price: "السعر",
    th_coupon: "كوبون",
    th_registration: "التسجيل",
    th_transfer: "النقل",
    th_renewal: "التجديد",
    th_action: "إجراء",
    filter_registrar: "كل المسجلين",
    sort_by: "ترتيب حسب",
    sort_reg: "سعر التسجيل",
    sort_renew: "سعر التجديد",
    cheapest_only: "الأرخص فقط",
    no_results: "لا توجد عروض مطابقة.",
  },
};

export type Translations = typeof dict.en;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Translations) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<Ctx | null>(null);

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && dict[saved]) setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (key: keyof Translations) => dict[lang][key] || dict.en[key] || key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
