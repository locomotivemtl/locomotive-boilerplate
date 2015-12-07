Locomotive front-end boilerplate
====================

Front-end Boilerplate for projects by Locomotive.

## Requirements

| Prerequisite    | How to check  | How to install |
| --------------- | ------------- | -------------- |
| Node.js 4.1.1   | `node -v`     | [nodejs.org](//nodejs.org/) |
| Grunt >= 0.1.13 | `grunt -v`    | `npm install -g grunt-cli` |


## Getting started

1. **Get the latest node modules**
  1. `npm install -g npm-check-updates`
  2. `npm-check-updates -u`
  3. `npm install`

2. **Run grunt and start coding**
  - `grunt`

### Grunt
Each Grunt task has it's own file in the `grunt_tasks` folder.

### BrowserSync
BrowserSync will automatically inject, refresh and sync all your browsers.

Run `grunt sync`

## CSS

- We use [Sass](http://sass-lang.com/) for our CSS Preprocessor
- [itcss](http://itcss.io/) CSS architecture
- More Minimal BEM like CSS Syntax: `.block_element -modifier`
- [More Transparent UI Code with Namespaces](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)

### Sass import order

* **Settings:** Global variables, site-wide settings, config switches, etc.
* **Tools:** Site-wide mixins and functions.
* **Generic:** Low-specificity, far-reaching rulesets (e.g. resets).
* **Base:** Unclassed HTML elements (e.g. `a {}`, `blockquote {}`, `address {}`).
* **Objects:** Objects, abstractions, and design patterns (e.g. `.o-media {}`).
* **Components:** Discrete, complete chunks of UI (e.g. `.c-carousel {}`).
* **Trumps:** High-specificity, very explicit selectors. Overrides and helper
  classes (e.g. `.u-hidden {}`).

### Grid

We are using a simple inline-block grid system.

**Usage**

Insert a `o-grid` block and add `o-grid_item` elements inside it.
No rows that contain floats, no twelve columns system; just the number of items you want, with the classes names you want, inside a single block.

- Include the grid mixins in your components classes.
- Create custom width grid items by including the `o-grid_item` mixin and adding the widths you need or just include the helpers mixins with fractions like names.
- Add media queries, on the helpers mixins or on your custom components to change the grid items widths, for your content, on different screen sizes.

*[Demo](http://codepen.io/AntoineBoulanger/pen/EaLNxe)*

### Form

We included some basic CSS styles and resets to the form elements so we can easily have custom style form elements that work on every browsers.

*[Demo](http://codepen.io/AntoineBoulanger/pen/uBJmi)*

## JavaScript
- We use HTML data attributes to init our JavaScript modules: `data-app`, `data-widget` and `data-template`
- All DOM related JavaScript is hooked to `js-` prefixed HTML classes
- [jQuery](https://jquery.com/) is globally included
