"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { parseParams, saveView, type SavedView } from "@/lib/dashboard";

const MAX_NAME_LENGTH = 60;

type Props = {
  /** All Saved Views, newest first, or null when they could not be loaded. */
  views: SavedView[] | null;
  /** Display names for the countries a view refers to, by code. */
  countryNames: Record<string, string>;
};

/** Save the current Dashboard Configuration under a name, and list every Saved View. */
export function SavedViews({ views, countryNames }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // The configuration in the URL, so a year the user never chose stays null (Latest Year).
      await saveView(name, parseParams(Object.fromEntries(searchParams)));
      setName("");
      router.refresh();
    } catch (err) {
      // Keep the typed name so it can be corrected.
      setError(err instanceof Error ? err.message : "Could not save the view.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-medium">Saved views</h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-1" noValidate>
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-zinc-500">
            Save the current settings as
            <input
              type="text"
              value={name}
              maxLength={MAX_NAME_LENGTH}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={error !== null}
              aria-describedby={error ? "save-view-error" : undefined}
              placeholder="e.g. Europe GDP"
              className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {saving ? "Saving…" : "Save view"}
          </button>
        </div>
        {error && (
          <p id="save-view-error" role="alert" className="text-xs text-red-700 dark:text-red-300">
            {error}
          </p>
        )}
      </form>

      {views === null ? (
        <p className="text-sm text-red-700 dark:text-red-300">Could not load saved views.</p>
      ) : views.length === 0 ? (
        <p className="text-sm text-zinc-500">No saved views yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {views.map((v) => (
            <li key={v.name} className="flex flex-col gap-0.5 py-2">
              <span className="text-sm font-medium">{v.name}</span>
              <span className="text-xs text-zinc-500">
                {v.indicator} · {v.year ?? "Latest year"} · {v.countries.map((c) => countryNames[c] ?? c).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
