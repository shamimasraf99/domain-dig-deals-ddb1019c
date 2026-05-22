/**
 * Maps registrar names to their domain search / homepage URLs.
 * Used so Buy/Visit buttons link directly to the registrar instead of
 * domainoffer.net internal redirect paths.
 */

export interface RegistrarUrlEntry {
  /** Direct search URL template. Receives tld like ".com" */
  searchUrl: (tld: string) => string;
  /** Fallback homepage if search URL is unknown */
  homepage: string;
}

const REGISTRARS: Record<string, RegistrarUrlEntry> = {
  // Major global registrars
  namecheap: {
    searchUrl: (tld) => `https://www.namecheap.com/domains/registration/results/?domain=example${tld}`,
    homepage: "https://www.namecheap.com/",
  },
  godaddy: {
    searchUrl: (tld) => `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=example${tld}`,
    homepage: "https://www.godaddy.com/",
  },
  porkbun: {
    searchUrl: (tld) => `https://porkbun.com/checkout/search?q=example${tld}`,
    homepage: "https://porkbun.com/",
  },
  namesilo: {
    searchUrl: (tld) => `https://www.namesilo.com/domain/search?domains=example${tld}`,
    homepage: "https://www.namesilo.com/",
  },
  dynadot: {
    searchUrl: (tld) => `https://www.dynadot.com/domain/search?domain=example${tld}`,
    homepage: "https://www.dynadot.com/",
  },
  spaceship: {
    searchUrl: (tld) => `https://spaceship.com/domain-search/?query=example${tld}`,
    homepage: "https://spaceship.com/",
  },
  ionos: {
    searchUrl: (tld) => `https://www.ionos.com/domains/search?searchTerm=example${tld}`,
    homepage: "https://www.ionos.com/",
  },
  ovhcloud: {
    searchUrl: (tld) => `https://www.ovhcloud.com/en/domains/tld/${cleanTld(tld)}/`,
    homepage: "https://www.ovhcloud.com/",
  },
  "domain.com": {
    searchUrl: (tld) => `https://www.domain.com/registration/?domain=example${tld}`,
    homepage: "https://www.domain.com/",
  },
  regery: {
    searchUrl: (tld) => `https://regery.com/en/domain-check?d=example${tld}`,
    homepage: "https://regery.com/",
  },
  "gandi.net": {
    searchUrl: (tld) => `https://www.gandi.net/en/domain/tld/${cleanTld(tld)}`,
    homepage: "https://www.gandi.net/",
  },
  inwx: {
    searchUrl: (tld) => `https://www.inwx.de/en/domain/${cleanTld(tld)}`,
    homepage: "https://www.inwx.de/",
  },
  epik: {
    searchUrl: (tld) => `https://www.epik.com/buy/${cleanTld(tld)}`,
    homepage: "https://www.epik.com/",
  },
  sav: {
    searchUrl: (tld) => `https://sav.com/search?q=example${tld}`,
    homepage: "https://sav.com/",
  },
  openprovider: {
    searchUrl: (tld) => `https://www.openprovider.com/en/domains/tld-search?domain=example${tld}`,
    homepage: "https://www.openprovider.com/",
  },
  "101domain": {
    searchUrl: (tld) => `https://www.101domain.com/${cleanTld(tld)}.htm`,
    homepage: "https://www.101domain.com/",
  },
  gname: {
    searchUrl: (tld) => `https://www.gname.com/domain/search?domains=example${tld}`,
    homepage: "https://www.gname.com/",
  },
  wedos: {
    searchUrl: (tld) => `https://www.wedos.com/domain/search?domains=example${tld}`,
    homepage: "https://www.wedos.com/",
  },
  mchost: {
    searchUrl: (tld) => `https://mchost.ru/domain/search?domains=example${tld}`,
    homepage: "https://mchost.ru/",
  },
  cloudean: {
    searchUrl: (tld) => `https://www.cloudean.com/domain/search?domains=example${tld}`,
    homepage: "https://www.cloudean.com/",
  },
  infomaniak: {
    searchUrl: (tld) => `https://www.infomaniak.com/en/domains/search?domain=example${tld}`,
    homepage: "https://www.infomaniak.com/",
  },
  afriregister: {
    searchUrl: (tld) => `https://www.afriregister.com/domain/search?domains=example${tld}`,
    homepage: "https://www.afriregister.com/",
  },
  navicosoft: {
    searchUrl: (tld) => `https://www.navicosoft.com/domain/search?domains=example${tld}`,
    homepage: "https://www.navicosoft.com/",
  },
  atakdomain: {
    searchUrl: (tld) => `https://www.atakdomain.com/domain/search?domains=example${tld}`,
    homepage: "https://www.atakdomain.com/",
  },
  nicnames: {
    searchUrl: (tld) => `https://www.nicnames.com/domain/search?domains=example${tld}`,
    homepage: "https://www.nicnames.com/",
  },
  instra: {
    searchUrl: (tld) => `https://www.instra.com/domain/search?domains=example${tld}`,
    homepage: "https://www.instra.com/",
  },
  onlydomains: {
    searchUrl: (tld) => `https://www.onlydomains.com/domain/search?domains=example${tld}`,
    homepage: "https://www.onlydomains.com/",
  },
  netim: {
    searchUrl: (tld) => `https://www.netim.com/en/domain/search?domains=example${tld}`,
    homepage: "https://www.netim.com/",
  },
  hostpro: {
    searchUrl: (tld) => `https://hostpro.com/domain/search?domains=example${tld}`,
    homepage: "https://hostpro.com/",
  },
  truehost: {
    searchUrl: (tld) => `https://truehost.com/domain/search?domains=example${tld}`,
    homepage: "https://truehost.com/",
  },
  hostafrica: {
    searchUrl: (tld) => `https://hostafrica.com/domain/search?domains=example${tld}`,
    homepage: "https://hostafrica.com/",
  },
  qualispace: {
    searchUrl: (tld) => `https://qualispace.com/domain/search?domains=example${tld}`,
    homepage: "https://qualispace.com/",
  },
  upperlink: {
    searchUrl: (tld) => `https://upperlink.com/domain/search?domains=example${tld}`,
    homepage: "https://upperlink.com/",
  },
  "host.al": {
    searchUrl: (tld) => `https://host.al/domain/search?domains=example${tld}`,
    homepage: "https://host.al/",
  },
  innovahost: {
    searchUrl: (tld) => `https://innovahost.com/domain/search?domains=example${tld}`,
    homepage: "https://innovahost.com/",
  },
  "whc.ca": {
    searchUrl: (tld) => `https://whc.ca/domain/search?domains=example${tld}`,
    homepage: "https://whc.ca/",
  },
  "one.com": {
    searchUrl: (tld) => `https://www.one.com/domain/search?domains=example${tld}`,
    homepage: "https://www.one.com/",
  },
  blacknight: {
    searchUrl: (tld) => `https://www.blacknight.com/domain/search?domains=example${tld}`,
    homepage: "https://www.blacknight.com/",
  },
  "z.com": {
    searchUrl: (tld) => `https://z.com/domain/search?domains=example${tld}`,
    homepage: "https://z.com/",
  },
  connectreseller: {
    searchUrl: (tld) => `https://connectreseller.com/domain/search?domains=example${tld}`,
    homepage: "https://connectreseller.com/",
  },
  dondominio: {
    searchUrl: (tld) => `https://www.dondominio.com/en/domain/search?domains=example${tld}`,
    homepage: "https://www.dondominio.com/",
  },
  marcaria: {
    searchUrl: (tld) => `https://www.marcaria.com/domain/search?domains=example${tld}`,
    homepage: "https://www.marcaria.com/",
  },
  encirca: {
    searchUrl: (tld) => `https://www.encirca.com/domain/search?domains=example${tld}`,
    homepage: "https://www.encirca.com/",
  },
  vebonix: {
    searchUrl: (tld) => `https://vebonix.com/domain/search?domains=example${tld}`,
    homepage: "https://vebonix.com/",
  },
  regtons: {
    searchUrl: (tld) => `https://regtons.com/domain/search?domains=example${tld}`,
    homepage: "https://regtons.com/",
  },
  above: {
    searchUrl: (tld) => `https://above.com/domain/search?domains=example${tld}`,
    homepage: "https://above.com/",
  },
  weboasis: {
    searchUrl: (tld) => `https://weboasis.ae/domain/search?domains=example${tld}`,
    homepage: "https://weboasis.ae/",
  },
  dotwee: {
    searchUrl: (tld) => `https://dotwee.com/domain/search?domains=example${tld}`,
    homepage: "https://dotwee.com/",
  },
  crazydomains: {
    searchUrl: (tld) => `https://www.crazydomains.com/domain/search?domains=example${tld}`,
    homepage: "https://www.crazydomains.com/",
  },
  uk2: {
    searchUrl: (tld) => `https://www.uk2.net/domain/search?domains=example${tld}`,
    homepage: "https://www.uk2.net/",
  },
  domgate: {
    searchUrl: (tld) => `https://www.domgate.com/domain/search?domains=example${tld}`,
    homepage: "https://www.domgate.com/",
  },
  inleed: {
    searchUrl: (tld) => `https://www.inleed.se/domain/search?domains=example${tld}`,
    homepage: "https://www.inleed.se/",
  },
  nice: {
    searchUrl: (tld) => `https://nice.ly/domain/search?domains=example${tld}`,
    homepage: "https://nice.ly/",
  },
  mitsu: {
    searchUrl: (tld) => `https://mitsu.com/domain/search?domains=example${tld}`,
    homepage: "https://mitsu.com/",
  },
  cloudflare: {
    searchUrl: () => "https://dash.cloudflare.com/sign-up",
    homepage: "https://www.cloudflare.com/",
  },
  "gandi": {
    searchUrl: (tld) => `https://www.gandi.net/en/domain/tld/${cleanTld(tld)}`,
    homepage: "https://www.gandi.net/",
  },
  nic: {
    searchUrl: () => "https://www.nic.cy/",
    homepage: "https://www.nic.cy/",
  },
};

function cleanTld(tld: string): string {
  return tld.replace(/^\./, "").toLowerCase();
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Get the best known URL for a given registrar + TLD */
export function getRegistrarUrl(registrar: string, tld: string): string {
  const key = normalizeName(registrar);

  // 1. Exact normalized match
  if (REGISTRARS[key]) {
    return REGISTRARS[key].searchUrl(tld);
  }

  // 2. Substring match for keys that are prefixes
  for (const [k, entry] of Object.entries(REGISTRARS)) {
    if (key.includes(k)) {
      return entry.searchUrl(tld);
    }
  }

  // 3. Try to guess from known suffixes (e.g. "Gandi.net" → "gandi")
  for (const [k, entry] of Object.entries(REGISTRARS)) {
    if (k.includes(key) || key.includes(k)) {
      return entry.searchUrl(tld);
    }
  }

  // 4. Fallback: build a generic homepage from registrar name
  return guessHomepage(registrar);
}

function guessHomepage(registrar: string): string {
  const clean = registrar
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/(com|net|org)$/i, "");
  if (!clean) return "https://www.google.com/search?q=" + encodeURIComponent(registrar);
  return `https://www.${clean}.com/`;
}

export { guessHomepage };
