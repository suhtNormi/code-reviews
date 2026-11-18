# 04: Delete a view with confirmation

**What to build:** A user can delete a Saved View after confirming. Deleting the Active View leaves the charts untouched and only removes the banner and the `view=` parameter.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] GraphQL `deleteView` mutation with description
- [ ] Delete control on each listed view asks via the native confirm dialog, naming the view
- [ ] Cancelling the dialog deletes nothing
- [ ] After deleting, the list updates
- [ ] Deleting the Active View keeps the same URL minus `view=`
