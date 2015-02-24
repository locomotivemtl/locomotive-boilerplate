Charcoal-Boilerplate
======================

Boilerplate for [`Charcoal`](#http://charcoal.locomotive.ca) projects by Locomotive.


## SCSS

### Import order

* **Settings:** Global variables, site-wide settings, config switches, etc.
* **Tools:** Site-wide mixins and functions.
* **Generic:** Low-specificity, far-reaching rulesets (e.g. resets).
* **Base:** Unclassed HTML elements (e.g. `a {}`, `blockquote {}`, `address {}`).
* **Objects:** Objects, abstractions, and design patterns (e.g. `.media {}`).
* **Components:** Discrete, complete chunks of UI (e.g. `.carousel {}`).
* **Trumps:** High-specificity, very explicit selectors. Overrides and helper
  classes (e.g. `.hidden {}`).

*From [ITCSS](https://twitter.com/itcss_io)*
