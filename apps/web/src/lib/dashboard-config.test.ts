import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_COUNTRIES, DEFAULT_INDICATOR, parseParams, type DashboardParams } from "./dashboard";
import { buildDashboardUrl, configsEqual } from "./dashboard-config";

const base: DashboardParams = {
  indicator: "SP.POP.TOTL",
  year: 2000,
  countries: ["FRA", "GBR"],
  order: "ASC",
  region: "Europe & Central Asia",
};

const roundTrip = (c: DashboardParams) => {
  const url = new URL(buildDashboardUrl(c), "http://x");
  return parseParams(Object.fromEntries(url.searchParams));
};

describe("buildDashboardUrl", () => {
  it("points at /dashboard and round-trips through parseParams", () => {
    assert.ok(buildDashboardUrl(base).startsWith("/dashboard?"));
    assert.deepEqual(roundTrip(base), base);
  });

  it("omits year for Latest Year and region when none", () => {
    const url = buildDashboardUrl({ ...base, year: null, region: null });
    assert.ok(!url.includes("year="));
    assert.ok(!url.includes("region="));
    assert.deepEqual(roundTrip({ ...base, year: null, region: null }), { ...base, year: null, region: null });
  });

  it("returns a bare path for the default configuration", () => {
    const def: DashboardParams = {
      indicator: DEFAULT_INDICATOR,
      year: null,
      countries: DEFAULT_COUNTRIES,
      order: "DESC",
      region: null,
    };
    assert.equal(buildDashboardUrl(def), "/dashboard");
    assert.deepEqual(roundTrip(def), def);
  });

  it("preserves country order", () => {
    assert.deepEqual(roundTrip({ ...base, countries: ["GBR", "FRA"] }).countries, ["GBR", "FRA"]);
  });
});

describe("configsEqual", () => {
  it("is true for identical configurations", () => {
    assert.equal(configsEqual(base, { ...base, countries: [...base.countries] }), true);
  });

  it("treats null year as equal only to null", () => {
    assert.equal(configsEqual({ ...base, year: null }, { ...base, year: null }), true);
    assert.equal(configsEqual({ ...base, year: null }, { ...base, year: 2023 }), false);
    assert.equal(configsEqual({ ...base, year: 2023 }, { ...base, year: null }), false);
  });

  it("is order-sensitive for countries", () => {
    assert.equal(configsEqual(base, { ...base, countries: ["GBR", "FRA"] }), false);
  });

  it("detects differences in each other field", () => {
    assert.equal(configsEqual(base, { ...base, indicator: "X" }), false);
    assert.equal(configsEqual(base, { ...base, order: "DESC" }), false);
    assert.equal(configsEqual(base, { ...base, region: null }), false);
    assert.equal(configsEqual(base, { ...base, countries: ["FRA"] }), false);
  });
});
