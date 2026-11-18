# 01: Prefactor: one place that builds and compares Dashboard Configurations

**What to build:** A single shared way to turn a Dashboard Configuration into a dashboard URL, and to check whether two configurations are equal. The Controls currently build URLs on their own; Saved View links, home page links and the Active View check will all need the same logic. No visible behaviour change: the dashboard works exactly as before.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Controls use the shared URL builder and produce the same URLs as before
- [ ] A configuration-equality helper exists (year `null` = Latest Year compares equal only to `null`; country order matters)
- [ ] Dashboard behaves identically; `npm run typecheck` and `npm run lint` pass
