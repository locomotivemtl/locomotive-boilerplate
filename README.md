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
mbp init locomotivemtl/locomotive-boilerplate <directory>

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

1.	Create a wrapper: `.js-pjax-wrapper` and a container `.js-pjax-container` inside. When a transition is launched, the new container is put inside the wrapper, and the old one is remove.
2.	Main settings are set inside `assets/scripts/transitions/TransitionManager.js`
3.	`BaseTransition` is launched by default, to set a new transition (like `CustomTransition`) :
	-	create a new class `TestTransition.js` witch extends `BaseTransition` in `assets/scripts/transitions/`
	-	add a line in `assets/scripts/transitions/transitions.js` to add your transition
	-	use it like : `<a href="/yourUrl" data-transition="TestTransition">My page</a>`
	-	Enjoy and made everything you want in your transition, check `BaseTransition.js` or `CustomTransition.js` like example

### Schema

Legend:

-	`[]` — Event Listener
-	`*` — Event Trigger

Logic:

```
[pjax:send] -> (transition) launch()
[pjax:switch] (= new view is loaded) -> (transition) hideView()-> hide animations & *readyToAppend
[readyToAppend] -> append() -> delete modules
                            -> remove oldView from the DOM, and innerHTMl newView
                            -> change()
display() -> (transition) displayView() -> display animations & *readyToDestroy
          -> init new modules
[readyToAppend] -> reinit()
```

### Local History

We provide an enhanced variant of Pjax dubbed _Phax_.

Phax allows one to update the browser's current URL using `pushState()` _without_ loading a new page using XHR.

For example, a collection of recipes that can be filtered by cuisine, meal type, or cooking style.
Each selection can update the browser's current URL and navigating between doesn't requiring the same page to be reloaded by XHR (it also bypasses the transition system above).

This feature works by assigning a "namespace" and a "disposition" to a module's internal links.

The following module illustrates how to implement internal states but the m

```js
import { APP_NAME, $document } from '../utils/environment';
import { PhaxDisposition } from '../transitions/Phax';
import AbstractModule from './AbstractModule';

const MODULE_NAME = 'RecipeCollection';

export default class extends AbstractModule
{
    constructor(options) {
        super(options);

        this.pjax  = null;
        this.query = null;

        this.availableFilters = options.filters;
        this.selectedFilters  = [];
    }

    bind() {
        $document.on('pjax:complete', (event) => {
            // Resolve location of Phax properties
            const options = (event.disposition && event.namespace)
                            ? event
                            : ((event.originalEvent.disposition && event.originalEvent.namespace)
                                ? event.originalEvent
                                : null);

            if (options === null) {
                console.warn('Missing PJAX state options');
                return;
            }

            if (options.disposition === PhaxDisposition.INTERNAL && options.namespace === this.uid) {
                if (options.backward || options.forward) {
                    this.pullUrl();
                }
            }
        });

        this.$el.on('click', '.js-filter', (event) => {
            // Toggle filter then call
            this.pushUrl();
        });
    }

    getPjax() {
        // …
    }

    pullUrl() {
        const isInitalQuery = (this.query === null);

        this.query = new URLSearchParams(window.location.search);

        if (window.location.search) {
            this.parseSelectedFiltersFromQuery(this.query);
        }

        if (isInitalQuery) {
            const pjax = this.getPjax();
            if (!pjax) {
                return;
            }

            if (!pjax.options.history) {
                return;
            }

            pjax.lastUid         = pjax.maxUid = pjax.newUid();
            pjax.lastNamespace   = this.uid;
            pjax.lastDisposition = PhaxDisposition.INTERNAL;

            window.history.replaceState(
                {
                    url:         window.location.href,
                    title:       document.title,
                    namespace:   pjax.lastNamespace,
                    disposition: pjax.lastDisposition,
                    uid:         pjax.maxUid,
                    scrollPos:   [ 0, 0 ]
                },
                document.title
            );
        }
    }

    parseSelectedFiltersFromQuery(query) {
        // …
    }

    pushUrl() {
        this.query = this.parseQueryFromSelectedFilters();

        const pjax = this.getPjax();
        if (!pjax) {
            return;
        }

        if (!pjax.options.history) {
            return;
        }

        // Since pjax.loadUrl modifies options and
        // we may add our own modifications below,
        // clone it so the changes don't persist
        const opts = $.extend({}, pjax.options, {
            namespace:   this.uid,
            disposition: PhaxDisposition.INTERNAL,
        });

        let currentURI    = new URL(window.location.href);
        currentURI.search = this.query.toString();

        pjax.loadUrl(currentURI.href, opts);
    }

    parseQueryFromSelectedFilters(query) {
        if (!query) {
            query = new URLSearchParams();
        }

        let selected = this.selectedFilters;
        for (let type in selected) {
            if (selected[type].length === 0) {
                continue;
            }

            query.append(type, selected[type].join(' '))
        }

        return query;
    }
}
```

## Locomotive Scroll

![experimental](https://img.shields.io/badge/stability-experimental-orange.svg)
 - [locomotive-scroll](https://github.com/locomotivemtl/locomotive-scroll)

### Configuration
 - Create a `.o-scroll` container with `data-module="Scroll"`
 - in the module `Scroll.js` you have a basic initialisation

### Options

Options | Type | Description
--- | --- | ---
container | $element | Scroll container (with the smooth scroll, this container will be transform)
selector | String | Every elements will be check by the scroll, can be affect by a followed data attributes
smooth | Boolean | If you want a smooth scroll
smoothMobile | Boolean | If you want a smooth scroll on mobile
mobileContainer | $element | Scroll container on mobile, document by default
getWay | Boolean | if true, the animate will determine if you scroll down or scroll up
getSpeed | Boolean | if true, the animate will calcul the velocity of your scroll. Access with `this.scroll.y`

### Data attributes

Data | Value | Description
--- | --- | ---
data-speed | number | Speed of transform for parallax elements
data-repeat | false | Determine if the "In View" class is added one or each times
data-inview-class | is-show | CSS Class when the element is in view.
data-position | top/bottom | Trigger from top/bottom of the window instead of the default from bottom to top
data-target | #id, .class | Trigger from another element
data-horizontal | false | Use transformX instead of transformY
data-sticky | false | Set $element sticky when it's in viewport
data-sticky-target | #id | Stop the element stick when the target is in viewport
data-callback | `test.Scroll(test:0)` | trigger event, with options way wich return "leave" or "enter" when $element is in viewport
data-viewport-offset | i,j | value between 0 to 1 (0.3 to start at 30% of the bottom of the viewport), useful to trigger a sequence of callbacks. (i : value wich start at the bottom, j : start at the top, j is optional)

