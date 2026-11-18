# 03: Open a view and show the Active View banner

**What to build:** Clicking a Saved View restores exactly its configuration, with the view's name in the URL (`?view=<name>` plus the full configuration). While the URL's configuration still equals the saved one, the dashboard says which view it is showing.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] GraphQL query to fetch one view by name, matched ignoring case, with descriptions
- [ ] List links open `?view=<name>` and the full configuration
- [ ] Banner shows the stored name (stored casing) only while the URL's configuration equals the saved one
- [ ] Changing any control drops `view=` and removes the banner
- [ ] A `view=` naming a nonexistent view still renders from the URL and shows a notice that the view no longer exists
- [ ] Names with spaces or special characters round-trip correctly in the URL
