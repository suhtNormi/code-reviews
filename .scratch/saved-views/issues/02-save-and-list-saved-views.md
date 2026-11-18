# 02: Save a view and see it listed

**What to build:** From the dashboard a user can save the current Dashboard Configuration under a View Name and see all Saved Views listed newest first. Views live in SQLite and survive restarts. Failures show a clear inline message and keep the typed name.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] `SavedView` model and migration created via `npm run db:migrate`; Docker's `migrate deploy` path still works
- [ ] GraphQL: a list-views query (newest first, optional limit) and a `saveView` mutation, every new type/field/operation with a description
- [ ] Name is trimmed; empty or over 60 characters rejected with `VALIDATION_ERROR`; case-insensitive duplicate rejected with `DUPLICATE_NAME`
- [ ] Unknown indicator, country or region, or more than 8 countries, rejected with `VALIDATION_ERROR`
- [ ] Year saved as `null` when the user never chose one (Latest Year)
- [ ] Two views with different names may share a configuration
- [ ] Dashboard has a save form with inline error messages and a list of all views, in the existing look
- [ ] Views are still there after restarting the app
