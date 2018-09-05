Locomotive's Front-end Boilerplate
==================================

Front-end boilerplate for projects by [Locomotive][locomtl].

## Installation
```sh
# install mbp and gulp
npm install mbp gulp@next -g
```

## Usage
```sh
# init your project
mbp init locomotivemtl/shopify-boilerplate <directory>

# run default watch task
gulp
```

## Configuration
Change the mentions of `boilerplate` for your project's name in
- `mconfig.json` 
- `assets/scripts/utils/environment.js`

## CSS

-   We use [Sass](http://sass-lang.com) for our CSS Preprocessor
-   [itcss](http://itcss.io) CSS architecture
-   More Minimal BEM like CSS Syntax: `.block_element -modifier`
-   [More Transparent UI Code with Namespaces](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces)

### Sass import order

*   **Settings:** Global variables, site-wide settings, config switches, etc.
*   **Tools:** Site-wide mixins and functions.
*   **Generic:** Low-specificity, far-reaching rulesets (e.g. resets).
*   **Base:** Unclassed HTML elements (e.g. `a {}`, `blockquote {}`, `address {}`).
*   **Objects:** Objects, abstractions, and design patterns (e.g. `.o-media {}`).
*   **Components:** Discrete, complete chunks of UI (e.g. `.c-carousel {}`).
*   **Utilities:** High-specificity, very explicit selectors. Overrides and helper
  classes (e.g. `.u-hidden {}`).

### Grid
We use [inuitcss](https://github.com/inuitcss/inuitcss/tree/6eb574fa604481ffa36272e6034e77467334ec50) layout and width system. We are using a inline-block grid system.

Insert a `.o-layout` block and add `.o-layout_item` elements inside it. By default `o-layout_item` made 100%.
You can define different fractions in `/tools/_widths.scss` (`$widths-fractions`)

If you want a 2 columns grid, just add `.u-1/2` on your 2 `.o-layout_item`

If you want to adapt columns by media queries, by example a 2 columns grid for 1000px + resolutions, and one columns in block under 1000px :

**HTML** 
```
<div class="o-layout">
	<div class="o-layout_item u-1/2@from-medium">
		first colum
	</div>
	<div class="o-layout_item u-1/2@from-medium">
		second colum
	</div>
</div>
```

**CSS** (`/tools/_widths.scss`)
```
.u-1\/2\@from-medium {
	@media (min-width: $from-medium) {
    	width: span(1/2);
    }
}
```



### Form

We included some basic CSS styles and resets to the form elements so we can easily have custom style form elements that work on every browsers.

*[Demo][demo-form]*

## JavaScript

-   We use HTML data attributes to init our JavaScript modules: `data-module`
-   All DOM related JavaScript is hooked to `js-` prefixed HTML classes
-   [jQuery](https://jquery.com) is globally included

[locomtl]:   https://locomotive.ca
[demo-grid]: https://codepen.io/AntoineBoulanger/pen/EaLNxe
[demo-form]: https://codepen.io/AntoineBoulanger/pen/uBJmi

## Page transitions
We use [Pjax](https://github.com/MoOx/pjax) by MoOx.

### Setup
1.	Create a wrapper : `.js-pjax-wrapper` and a container `.js-pjax-container` inside. When a transition is launched, the new container is put inside the wrapper, and the old one is remove.

2.	Main settings are set inside `assets/scripts/transitions/TransitionManager.js`

3.	`BaseTransition` is launched by default, to set a new transition (like `CustomTransition`) :
	-	create a new class `TestTransition.js` witch extends `BaseTransition` in `assets/scripts/transitions/`
	-	add a line in `assets/scripts/transitions/transitions.js` to add your transition
	-	use it like : `<a href="/yourUrl" data-transition="TestTransition">My page</a>`
	-	Enjoy and made everything you want in your transition, check `BaseTransition.js` or `CustomTransition.js` like example

### Schema

Legend
-	`[ ]` : listener
-	`*`   : trigger event

`[pjax:send]` -> (transition) launch()

`[pjax:switch]` (= new view is loaded) -> (BaseTransition) `hideView()` -> hide animations & `*readyToRemove`

`[readyToRemove]` -> `remove()` -> delete modules, remove oldView from the DOM, innerHTML newView, init modules, `display()`

`display()` -> (BaseTransition) `displayView()` -> display animations & `*readyToDestroy`
          -> init new modules

`[readyToRemove]` -> reinit()
