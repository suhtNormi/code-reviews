import { DEFAULT_COUNTRIES, DEFAULT_INDICATOR, type DashboardParams } from "./dashboard";

export const DASHBOARD_PATH = "/dashboard";

/**
 * The dashboard URL for a Dashboard Configuration. Settings that equal what the
 * dashboard assumes when absent (and a null year / region) are left out, so the
 * default configuration is just `/dashboard`.
 */
export function buildDashboardUrl(config: DashboardParams): string {
  const qs = new URLSearchParams();
  if (config.indicator !== DEFAULT_INDICATOR) qs.set("indicator", config.indicator);
  if (config.year !== null) qs.set("year", String(config.year));
  if (!sameCountries(config.countries, DEFAULT_COUNTRIES)) qs.set("countries", config.countries.join(","));
  if (config.order !== "DESC") qs.set("order", config.order);
  if (config.region) qs.set("region", config.region);
  const query = qs.toString();
  return query ? `${DASHBOARD_PATH}?${query}` : DASHBOARD_PATH;
}

/** Country order matters; a null year (Latest Year) equals only another null year. */
export function configsEqual(a: DashboardParams, b: DashboardParams): boolean {
  return (
    a.indicator === b.indicator &&
    a.year === b.year &&
    a.order === b.order &&
    a.region === b.region &&
    sameCountries(a.countries, b.countries)
  );
}

function sameCountries(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((c, i) => c === b[i]);
}
