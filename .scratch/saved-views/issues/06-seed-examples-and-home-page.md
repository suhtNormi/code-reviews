# 06: Seed example views and list them on the home page

**What to build:** A fresh install has three example Saved Views, and the home page shows the 5 most recent as links that open them.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] `npm run db:seed` upserts three example views by name using real indicators and countries; re-running never duplicates (a deleted example comes back)
- [ ] Home page lists the 5 most recent views newest first, each linking to the opened view
- [ ] Home page copes with there being no views
- [ ] Seeding also happens in the Docker start-up path with no manual steps
