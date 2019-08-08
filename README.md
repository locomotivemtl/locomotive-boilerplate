<p align="center">
    <a href="https://github.com/locomotivemtl/locomotive-boilerplate">
        <img src="https://user-images.githubusercontent.com/4596862/54868065-c2aea200-4d5e-11e9-9ce3-e0013c15f48c.png" height="140">
    </a>
</p>
<h1 align="center">Locomotive Boilerplate</h1>
<p align="center">Front-end boilerplate for projects by Locomotive.</p>

## Installation
```sh
npm install mbp gulp -g
```

## Usage
```sh
# init your project
mbp init locomotivemtl/locomotive-boilerplate <directory>

# run default watch task
gulp
```

## Configuration
Change the mentions of `boilerplate` for your project's name in `mconfig.json`. It is based on [modularBP](https://github.com/modularorg/modularbp).

[Learn more](https://github.com/modularorg/modularbp)

## Build
[gulp](https://github.com/gulpjs/gulp) is our build system. It compiles our styles and scripts, generate svg sprites, live reload the browser and minify everything.  

#### Tasks
```sh
# watch
gulp

# compile
gulp compile

# minify
gulp build
```

[Learn more](https://github.com/modularorg/modularbp-gulp)

## Styles
[Sass](https://github.com/sass/node-sass) is our CSS preprocessor. [Autoprefixer](https://github.com/postcss/autoprefixer) is also included.

#### Architecture
[ITCSS](https://github.com/itcss) is our CSS architecture.

* `settings`: Global variables, site-wide settings, config switches, etc.
* `tools`: Site-wide mixins and functions.
* `generic`: Low-specificity, far-reaching rulesets (e.g. resets).
* `elements`: Unclassed HTML elements (e.g. `a {}`, `blockquote {}`, `address {}`).
* `objects`: Objects, abstractions, and design patterns (e.g. `.o-layout {}`).
* `components`: Discrete, complete chunks of UI (e.g. `.c-carousel {}`).
* `utilities`: High-specificity, very explicit selectors. Overrides and helper
  classes (e.g. `.u-hidden {}`)

[_source_](https://github.com/inuitcss/inuitcss#css-directory-structure)

#### Naming
We use a simplified [BEM](https://github.com/bem) syntax.

 `.block .block_element -modifier`

#### Namespaces
We namespace our classes for more [transparency](https://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/).

* `o-`: Object that it may be used in any number of unrelated contexts to the one you can currently see it in. Making modifications to these types of class could potentially have knock-on effects in a lot of other unrelated places.
* `c-`: Component is a concrete, implementation-specific piece of UI. All of the changes you make to its styles should be detectable in the context you’re currently looking at. Modifying these styles should be safe and have no side effects.
* `u-`: Utility has a very specific role (often providing only one declaration) and should not be bound onto or changed. It can be reused and is not tied to any specific piece of UI.
* `s-`: Scope creates a new styling context. Similar to a Theme, but not necessarily cosmetic, these should be used sparingly—they can be open to abuse and lead to poor CSS if not used wisely.
* `is-`, `has-`: Is currently styled a certain way because of a state or condition. It tells us that the DOM currently has a temporary, optional, or short-lived style applied to it due to a certain state being invoked.

[_source_](https://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/#the-namespaces)

#### Example
```html
<div class="c-block -large">
    <div class="c-block_layout o-layout">
        <div class="o-layout_item u-1/2@from-medium">
            <div class="c-block_heading o-h -medium">Heading</div>
        </div>
        <div class="o-layout_item u-1/2@from-medium">
           <a class="c-block_button o-button -outline" href="#">Button</a>
        </div>
    </div>
</div>
```
```scss
.c-block {
    &.-large {
        padding: rem(60px);
    }
}

.c-block_heading {
    @media (max-width: $to-medium) {
        .c-block.-large & {
            margin-bottom: rem(40px);
        } 
    }
}
```

## Scripts
[modularJS](https://github.com/modularorg/modularjs) is a small framework we use on top of ES modules. It compiles with [Rollup](https://github.com/rollup/rollup) and [Babel](https://github.com/babel/babel).

#### Why
- Automatically init visible modules.
- Easily call other modules methods.
- Quickly set scoped events with delegation.
- Simply select DOM elements scoped in their module.

[_source_](https://github.com/modularorg/modularjs#why)

#### Example
```html
<div data-module-example>
    <div data-example="main">
        <h2>Example</h2>
    </div>
    <button data-example="load">More</button>
</div>
```
```js
import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);

        this.events = {
            click: {
                load: 'loadMore'
            }
        }
    }

    loadMore() {
        this.$('main').classList.add('is-loading');
    }
}
```

[Learn more](https://github.com/modularorg/modularjs)

## Page transitions
[modularLoad](https://github.com/modularorg/modularload) is used for page transitions and lazy loading.

#### Example
```html
<nav>
    <a href="/">Home</a>
    <a href="/page" data-load="transitionName">Page</a>
</nav>
<div data-load-container>
    <img data-load-src="assets/images/hello.jpg">
</div>
```
```js
import modularLoad from 'modularload';

this.load = new modularLoad({
    enterDelay: 300,
    transitions: {
        transitionName: {
            enterDelay: 450
        }
    }
});
```

[Learn more](https://github.com/modularorg/modularload)

## Scroll detection
 [Locomotive Scroll](https://github.com/locomotivemtl/locomotive-scroll) is used for elements in viewport detection and smooth scrolling with parallax.

#### Example
```html
<div data-module-scroll>
    <div data-scroll>Trigger</div>
    <div data-scroll data-scroll-speed="1">Parallax</div>
</div>
```
```js
import LocomotiveScroll from 'locomotive-scroll';

this.scroll = new LocomotiveScroll({
    el: this.el,
    smooth: true
});
````

[Learn more](https://github.com/locomotivemtl/locomotive-scroll)
