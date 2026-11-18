## Problem Statement

The dashboard is configured entirely through its URL (indicator, year, countries, ranking order, highlighted region). Users who build a useful Dashboard Configuration have no way to keep it except bookmarking a long URL. They want to save a configuration under a name and come back to it later, and see saved ones on the home page.

## Solution

Add **Saved Views** (see `GLOSSARY.md`): a Dashboard Configuration stored under a unique **View Name**, shared by everyone, persisted in SQLite, exposed through the GraphQL API. The dashboard lets users save the current configuration, lists all Saved Views, opens one, and deletes one (after confirmation). When the dashboard is showing a Saved View it says so with the view's name. The home page lists the 5 most recent. A fresh install seeds three example views.

## User Stories

1. As a dashboard user, I want to save the current configuration under a name, so that I can return to it without bookmarking a long URL.
2. As a dashboard user, I want to see all saved views on the dashboard, so that I can pick one quickly.
3. As a dashboard user, I want the list newest first, so that what I saved recently is easiest to find.
4. As a dashboard user, I want opening a view to restore exactly the saved indicator, year, countries, ranking order and highlighted region, so that the charts look as they did when I saved.
5. As a dashboard user who saved without choosing a year, I want the view to keep following the indicator's latest year, so that it matches what I originally saw (Latest Year).
6. As a dashboard user, I want a banner naming the view I'm looking at, so that I know I'm on a saved view.
7. As a dashboard user, I want that banner to disappear once I change any control, so that it never claims the charts match a view they no longer match.
8. As a dashboard user, I want to delete a view I no longer need, so that the list stays tidy.
9. As a dashboard user, I want to be asked to confirm before deleting, so that I don't lose a view by accident.
10. As a dashboard user who deletes the view I'm looking at, I want the charts to stay as they are with only the banner removed, so that nothing changes unexpectedly.
11. As a dashboard user, I want leading and trailing spaces in a name ignored, so that stray whitespace doesn't matter.
12. As a dashboard user, I want a clear message when the name is empty, so that I know what to fix.
13. As a dashboard user, I want a clear message when the name is over 60 characters, so that I know the limit.
14. As a dashboard user, I want a clear message when the name is already used, ignoring letter case ("Europe GDP" vs "europe gdp"), so that I can't create look-alike duplicates.
15. As a dashboard user, I want my typed name kept in the form after a failed save, so that I can correct it.
16. As a dashboard user, I want to save two names with the same configuration, so that I'm not blocked by an arbitrary rule.
17. As a dashboard user, I want opening a view whose indicator, country or region no longer exists to show a message instead of an error page, so that I understand why it can't open.
18. As a dashboard user, I want an Unavailable View to stay in the list, so that I can delete it.
19. As a dashboard user, I want an Unavailable View to leave me on the default dashboard, so that I still see something useful.
20. As a dashboard user, I want the view name in the URL (`?view=<name>`), so that links are readable and shareable.
21. As a dashboard user, I want a shared link to still render from its full configuration when its view was since deleted, so that the link isn't dead.
22. As a dashboard user opening such a link, I want a notice that the named view no longer exists, so that I understand the missing banner.
23. As a dashboard user, I want `?view=` matched ignoring case, so that a hand-typed link works.
24. As a home page visitor, I want the 5 most recent saved views with links that open them, so that I can jump straight in.
25. As a home page visitor on a fresh install, I want example views present, so that the feature is visible immediately.
26. As a developer, I want `npm run db:seed` safe to re-run, so that it never duplicates examples (it re-creates deleted examples).
27. As an API consumer, I want to read saved views through GraphQL, so that other clients can use them.
28. As an API consumer, I want to create and delete saved views through GraphQL mutations, so that I can manage them programmatically.
29. As an API consumer, I want failures as GraphQL errors with a stable `extensions.code` (`VALIDATION_ERROR`, `DUPLICATE_NAME`) and a readable message, so that I can handle them.
30. As an API consumer, I want the API to reject configurations that refer to a nonexistent indicator, country or region, or have more than 8 countries, so that no view is unavailable from the moment it is created.
31. As an API consumer, I want descriptions on every new schema type, field and operation, so that GraphiQL documents them like the existing ones.
32. As an operator, I want Saved Views to survive restarts and `docker compose down`/`up`, so that nothing is lost.
33. As an operator, I want `docker compose up --build` to keep working with no manual steps, so that a clean machine works.

## Implementation Decisions

- **Domain language**: use the terms in `GLOSSARY.md` (Dashboard Configuration, Latest Year, Saved View, View Name, Unavailable View, Active View).
- **Schema**: a new `SavedView` model holding the View Name, the five Dashboard Configuration fields (nullable year, countries list, order, nullable region) and `createdAt`. Uniqueness is case-insensitive via an explicit normalised name key, because SQLite's unique constraint is case-sensitive. The countries list is stored in a way that preserves order. Create the migration with `npm run db:migrate` (`prisma migrate dev`); `prisma migrate deploy` applies it in Docker.
- **GraphQL API**: a query returning views newest first with an optional limit; a query to fetch one view by name (case-insensitive); `saveView` and `deleteView` mutations. Every new type, field and operation carries a description.
- **Errors**: validation failures are GraphQL errors with `extensions.code` `VALIDATION_ERROR` or `DUPLICATE_NAME` and a user-readable message. The API is the authority on validation; the UI doesn't need to duplicate rules beyond a sensible `maxLength`.
- **Validation on save**: trim the name; reject empty or over 60 characters; reject case-insensitive duplicates; reject any indicator, country or region absent from the data; cap countries at the dashboard's existing maximum of 8.
- **Unavailable View**: any missing reference (indicator, country, region) makes it unavailable, all-or-nothing, with no silent dropping. The message names what is missing.
- **Year**: stored as null when the user did not choose one (Latest Year).
- **URL model**: opening a view navigates to the dashboard with `?view=<name>` plus the full configuration in the query string, so the existing URL parsing and Controls keep working. The Active View banner shows only while the URL's configuration equals the saved one; a small pure helper compares configurations. A `view=` naming a nonexistent view still renders from the URL and shows a notice. Controls that rebuild the URL drop `view=`. This is the documented "view identified by name, not by an ID" decision: names are unique and links are self-describing, at the cost that deleting and re-saving a name makes old links point at the new view (the banner stays honest because the configuration comparison fails).
- **Delete**: the UI confirms with the browser's native confirm dialog. After deleting the Active View, remain on the same URL minus `view=`.
- **Dashboard UI**: a save form (name field, inline error), a list of all views (open link + delete), the Active View banner, and an Unavailable View message, in the existing Tailwind look.
- **Home page**: the 5 most recent views as links that open them.
- **Seed**: three example views using real indicators and countries, upserted by name so `npm run db:seed` is idempotent.
- **Workflow (no Docker)**: `npm run db:migrate`, `npm run db:seed`, `npm run dev`. The Docker path must still work unchanged.

## Testing Decisions

- No automated tests are to be added (explicit decision; the repo has no test framework and none will be introduced).
- Verification is `npm run typecheck`, `npm run lint`, and a manual walkthrough covering save, validation errors, list, open, Active View banner, delete with confirmation, an Unavailable View, a stale `?view=` link, the home page list, and restart persistence.
- Prior art: none for tests; follow the existing code's conventions for the schema, resolvers and components.

## Out of Scope

- User accounts, ownership or permissions; views are shared by everyone.
- Editing or renaming a Saved View (delete and re-save instead).
- Any change to World Bank data ingestion.
- Automated tests and test tooling.
- De-duplicating views by configuration.

## Further Notes

- Do not commit automatically; the user will review and commit.
- Ambiguities in the brief were resolved in a grilling session; decisions are recorded above and in `GLOSSARY.md`.
