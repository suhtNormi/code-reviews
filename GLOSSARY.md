# Dashboard

A World Bank data dashboard whose entire display is determined by a small set of settings, which users can save and return to.

## Language

**Dashboard Configuration**:
The five settings that fully determine what the dashboard shows: indicator, year, countries, ranking order and highlighted region.
_Avoid_: Params, state, preset, bookmark

**Latest Year**:
The year setting of a Dashboard Configuration when no year was chosen; it follows the indicator's most recent data rather than a fixed year.
_Avoid_: Default year, null year

**Saved View**:
A Dashboard Configuration stored under a unique name and shared by everyone using the app. A Saved View is identified by its name.
_Avoid_: Preset, bookmark, favourite, saved configuration

**View Name**:
The user-chosen label of a Saved View. Trimmed of surrounding whitespace, 1–60 characters, and unique regardless of letter case.
_Avoid_: Title, label

**Unavailable View**:
A Saved View that cannot be shown because something it refers to (indicator, country or region) no longer exists in the data. It stays listed and can still be deleted.
_Avoid_: Broken view, stale view, invalid view

**Active View**:
The Saved View the dashboard is currently showing, which holds only while the current Dashboard Configuration still equals the saved one.
_Avoid_: Current view, selected view
