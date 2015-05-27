Charcoal-Boilerplate
====================

Boilerplate for [`Charcoal`](#http://charcoal.locomotive.ca) projects by Locomotive.


## Getting started

### Setup project

1. **Clone the boilerplate module into your own module**
  1. `sh clone.sh {{project-name}}`
    - where `{{project-name}}` is the name of the target project.
    - Note: on windows, the `sh` command is usually ran from cygwin.
2. **Create and setup the database**
  1. Create an empty database (most people use phpmyadmin...)
  2. Setup the database in `www/config/config.json`
3. **Setup configuration**
  1. Setup the proper `URL` in  in `www/config/config.php`
  2. Setup languages and project name, if necessary, in `www/config/config.json`
4. **Initialize Charcoal**
  1. Make sure the Charcoal core is installed
    - Using SVN, this is normally done with a `svn:externals` property in `www/`
  2. Setup a local admin user
    - Visit `http://{{project-url}}/admin` to start the admin user creation wizard.

### Install the node modules / grunt

1. **Get the latest node modules**
  1. `npm install -g npm-check-updates`
  2. `npm-check-updates -u`
  3. `npm install`

2. **Run grunt and start coding**
  - `grunt`


## Grunt
Each Grunt task has it's own file in the `grunt_tasks` folder.

#### BrowserSync
BrowserSync will automatically inject, refresh and sync all your browsers.

Run `grunt sync`

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

### Grid

We are using a simple inline-block grid system.

**Usage**

Insert a `grid` block and add `grid__item` elements inside it.
No rows that contain floats, no twelve columns system; just the number of items you want, with the classes names you want, inside a single block.

- Include the grid mixins in your components classes.
- Create custom width grid items by including the `grid__item` mixin and adding the widths you need or just include the helpers mixins with fractions like names.
- Add media queries, on the helpers mixins or on your custom components to change the grid items widths, for your content, on different screen sizes.

*[Demo](http://codepen.io/AntoineBoulanger/pen/EaLNxe)*

### Form

We included some basic CSS styles and resets to the form elements so we can easily have custom style form elements that work on every browsers.

*[Demo](http://codepen.io/AntoineBoulanger/pen/uBJmi)*
