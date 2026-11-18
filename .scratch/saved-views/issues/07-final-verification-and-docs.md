# 07: Final verification and docs

**What to build:** Confirm the whole feature works end to end and document it.

**Blocked by:** 04, 05, 06

**Status:** ready-for-agent

- [ ] `npm run typecheck` and `npm run lint` pass
- [ ] Manual walkthrough from the spec: save, each validation error, list, open, banner, change a control, delete with confirm, Unavailable View, stale `?view=` link, home page, persistence across restart
- [ ] `docker compose down` then `up --build` on a clean volume works with no manual steps and keeps views across a plain down/up
- [ ] `HOWITWORKS.md` has a short Saved Views section
