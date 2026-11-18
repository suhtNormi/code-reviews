# 05: Unavailable Views fail gracefully

**What to build:** Opening a Saved View whose indicator, country or region no longer exists shows a clear message instead of an error page. The user lands on the default dashboard and the view stays listed so it can be deleted.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Any missing indicator, country or region makes the view unavailable (all-or-nothing, nothing silently dropped)
- [ ] The message names what is missing
- [ ] The dashboard renders with the default configuration and no error page
- [ ] The Unavailable View remains in the list and can be deleted
- [ ] Verified by removing an indicator, a country and a region from the data in turn
