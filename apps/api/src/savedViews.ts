import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { prisma } from "./db.js";

export const MAX_VIEW_NAME_LENGTH = 60;
/** Same cap as the dashboard's country picker. */
export const MAX_VIEW_COUNTRIES = 8;

export type SaveViewInput = {
  name: string;
  indicator: string;
  year?: number | null;
  countries: string[];
  order: "ASC" | "DESC";
  region?: string | null;
};

function fail(code: "VALIDATION_ERROR" | "DUPLICATE_NAME", message: string): never {
  throw new GraphQLError(message, { extensions: { code } });
}

/** Saved Views, newest first. */
export function listSavedViews(limit?: number | null) {
  if (limit != null && limit < 1) fail("VALIDATION_ERROR", "limit must be at least 1.");
  return prisma.savedView.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    ...(limit != null ? { take: limit } : {}),
  });
}

/** Validate a Dashboard Configuration under a View Name and store it as a Saved View. */
export async function saveView(input: SaveViewInput) {
  const name = input.name.trim();
  if (!name) fail("VALIDATION_ERROR", "Enter a name for the view.");
  if (name.length > MAX_VIEW_NAME_LENGTH) {
    fail("VALIDATION_ERROR", `The name can be at most ${MAX_VIEW_NAME_LENGTH} characters.`);
  }

  const countries = input.countries.map((c) => c.trim().toUpperCase());
  if (countries.length === 0) fail("VALIDATION_ERROR", "Select at least one country.");
  if (countries.length > MAX_VIEW_COUNTRIES) {
    fail("VALIDATION_ERROR", `A view can include at most ${MAX_VIEW_COUNTRIES} countries.`);
  }
  if (new Set(countries).size !== countries.length) fail("VALIDATION_ERROR", "Countries must not repeat.");
  if (input.year != null && input.year <= 0) fail("VALIDATION_ERROR", "The year must be a positive number.");

  const [indicator, knownCountries, region] = await Promise.all([
    prisma.indicator.findUnique({ where: { code: input.indicator }, select: { code: true } }),
    prisma.country.findMany({ where: { code: { in: countries } }, select: { code: true } }),
    input.region
      ? prisma.country.findFirst({ where: { region: input.region }, select: { region: true } })
      : Promise.resolve(true),
  ]);
  if (!indicator) fail("VALIDATION_ERROR", `Unknown indicator: ${input.indicator}.`);
  const known = new Set(knownCountries.map((c) => c.code));
  const unknown = countries.filter((c) => !known.has(c));
  if (unknown.length) fail("VALIDATION_ERROR", `Unknown country: ${unknown.join(", ")}.`);
  if (!region) fail("VALIDATION_ERROR", `Unknown region: ${input.region}.`);

  const nameKey = name.toLowerCase();
  const data = {
    name,
    nameKey,
    indicator: indicator.code,
    year: input.year ?? null,
    countries: countries.join(","),
    order: input.order,
    region: input.region || null,
  };
  const duplicate = () => fail("DUPLICATE_NAME", `A view named "${name}" already exists.`);

  if (await prisma.savedView.findUnique({ where: { nameKey }, select: { id: true } })) duplicate();
  try {
    return await prisma.savedView.create({ data });
  } catch (err) {
    // Lost a race with a concurrent save of the same name.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") duplicate();
    throw err;
  }
}
