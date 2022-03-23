<p align="center">
    <a href="https://github.com/locomotivemtl/locomotive-boilerplate">
        <img src="https://user-images.githubusercontent.com/4596862/54868065-c2aea200-4d5e-11e9-9ce3-e0013c15f48c.png" height="140">
    </a>
</p>
<h1 align="center">Locomotive Boilerplate</h1>
<p align="center">Front-end boilerplate for projects by <a href="https://locomotive.ca/">Locomotive</a>.</p>

## Features

* Uses a custom, easily configured, wrapper [asset handler](docs/development.md).
* Uses [Sass] for a feature rich extension of CSS.
* Uses [ESBuild] for extremely fast processing of JS/ES6.
* Uses [SVG Mixer] for processing SVG files and generating spritesheets.
* Uses [ITCSS] for a sane and scalable CSS architecture.
* Uses [Locomotive Scroll] for smooth scrolling with parallax effects.
* Uses [BrowserSync] for fast development and testing in browsers.

Learn more about [languages and technologies](docs/technologies.md).

## Getting started

Make sure you have the following installed:

* [Node] — at least 14.17, the latest LTS is recommended.
* [NPM] — at least 6.0, the latest LTS is recommended.

> 💡 You can use [NVM] to install and use different versions of Node via the command-line.

```sh
# Clone the repository.
git clone https://github.com/locomotivemtl/locomotive-boilerplate.git my-new-project

# Enter the newly-cloned directory.
cd my-new-project
```

Then replace the original remote repository with your project's repository.

Then update the following files to suit your project:

* [`README.md`](README.md):
  The file you are currently reading.
* [`package.json`](package.json):
  * Package name: `@locomotivemtl/boilerplate`
  * Package title: `Locomotive Boilerplate`
* [`package-lock.json`](package-lock.json):
  * Package name: `@locomotivemtl/boilerplate`
* [`loconfig.json`](loconfig.json):
  * BrowserSync proxy URL: `locomotive-boilerplate.test`
    Remove `paths.url` to use BrowserSync's built-in server which uses `paths.dest`.
  * View path: `./views/boilerplate/template`
* [`environment.js`](assets/scripts/utils/environment.js):
  * Application name: `Boilerplate`
* [`site.webmanifest`](www/site.webmanifest):
  * Manifest name: `Locomotive Boilerplate`
  * Manifest short name: `Boilerplate`
* HTML files:
  * Page title: `Locomotive Boilerplate`

## Installation

```sh
# Install dependencies from package.json
npm install
```

## Development

```sh
# Watch for file changes and compile assets
npm start

# Compile and minify assets
npm run build
```

Learn more about [development and building](docs/development.md).

## Documentation

* [Development and building](docs/development.md)
* [Languages and technologies](docs/technologies.md)

[BrowserSync]:       https://browsersync.io/
[ESBuild]:           https://esbuild.github.io/
[ITCSS]:             https://itcss.io/
[Locomotive Scroll]: https://github.com/locomotivemtl/locomotive-scroll
[modularJS]:         https://github.com/modularorg/modularjs
[modularLoad]:       https://github.com/modularorg/modularload
[Sass]:              https://sass-lang.com/
[SVG Mixer]:         https://github.com/JetBrains/svg-mixer
[Node]:              https://nodejs.org/
[NPM]:               https://npmjs.com/
[NVM]:               https://github.com/nvm-sh/nvm
