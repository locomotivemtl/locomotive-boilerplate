Charcoal-Boilerplate
======================

Boilerplate for [`Charcoal`](#http://charcoal.locomotive.ca) projects by Locomotive.


## Getting started

**Get the latest node modules**

 We are using this module to get the latest version of every modules and update the package.json

`npm install -g npm-check-updates`

`npm-check-updates -u`

`npm install`


**Run grunt and start coding**

`grunt`

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
