<?php
$pathSegments = explode('/', getenv('REQUEST_URI'));
// Initialize an empty key-value array
$keyValuePairs = [];

// Iterate through the segments to extract key-value pairs
$count = count($pathSegments);
for ($i = 0; $i < $count; $i += 2) {
    // Check if the segment has both key and value
    if (isset($pathSegments[$i + 1])) {
        $key = $pathSegments[$i];
        $value = $pathSegments[$i + 1];
        $keyValuePairs[$key] = $value;
    }
}

$items = [
    'item 1',
    'item 2',
    'item 3',
    'item 4',
    'item 5',
    'item 6',
    'item 7',
    'item 8',
    'item 9',
    'item 10',
    'item 11',
    'item 12',
];

?>
<!doctype html>
<html class="is-loading" lang="en" data-page="home">

<head>
    <meta charset="utf-8">
    <title>Locomotive Boilerplate</title>

    <base href="/index.php">

    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="theme-color" content="#ffffff">
    <meta name="msapplication-TileColor" content="#ffffff">
    <link rel="manifest" href="site.webmanifest">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicons/favicon-16x16.png">
    <link rel="mask-icon" href="assets/images/favicons/safari-pinned-tab.svg" color="#000000">
    <!-- For a dark mode managment and svg favicon add this in your favicon.svg -->
    <!--
            <style>
                path {
                    fill: #000;
                }
                @media (prefers-color-scheme: dark) {
                    path {
                        fill: #fff;
                    }
                }
            </style>
        -->
    <!-- <link rel="icon" href="assets/images/favicons/favicon.svg"> -->

    <!-- Preload Fonts -->
    <link rel="preload" href="assets/fonts/SourceSans3-Bold.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/fonts/SourceSans3-BoldIt.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/fonts/SourceSans3-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/fonts/SourceSans3-RegularIt.woff2" as="font" type="font/woff2" crossorigin>

    <link id="main-css" rel="stylesheet" href="assets/styles/main.css" media="print"
        onload="this.media='all'; this.onload=null; this.isLoaded=true">
</head>

<body data-module-load>
    <main data-load-container>

        <dialog id="dialog" data-module-dialog>
            <a href="/" data-swup-link-to-fragment="#paginated" style="float: right;" data-dialog="close">Close</a>
        </dialog>

        <div data-module-scroll="main">
            <header>
                <a href="/">
                    <h1>Locomotive Boilerplate</h1>
                </a>
                <nav>
                    <ul>
                        <li><a href="/images.html">Images</a></li>
                        <li><a href="/form.html" data-load="customTransition">Form</a></li>
                        <li><a href="/grid.html">Grid</a></li>
                    </ul>
                </nav>
            </header>

            <?php
            if(isset($keyValuePairs['modal'])) { ?>
                <main id="modal">
                    <h1><?= $items[$keyValuePairs['modal']] ?></h1>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum, sed, dolorum quae velit totam sit reprehenderit soluta beatae error iure aliquid laborum voluptatum sunt eum cum harum corporis! Perspiciatis, impedit!</p>

                    <?php if($keyValuePairs['modal'] > 0) { ?>
                    <a style="float: left;" href="/index.php/modal/<?= $keyValuePairs['modal'] - 1 ?>">Prev</a>
                    <?php }
                    if($keyValuePairs['modal']+1 < sizeof($items)) { ?>
                    <a style="float: right;" href="/index.php/modal/<?= $keyValuePairs['modal'] + 1 ?>">Next</a>
                    <?php } ?>
                    <div style="clear: both;"></div>
                </main>
            <?php } else { ?>
                <main data-module-example>
                    <div class="o-container">
                        <h1 class="c-heading -h1">Hello</h1>

                        <div id="paginated">
                            <ul>
                            <?php

                            $page = $keyValuePairs['page'] ?? 1;
                            $per_page = $keyValuePairs['per_page'] ?? 3;

                            foreach (array_slice($items, ($page-1) * $per_page, $per_page) as $item) {
                                $key = array_search($item, $items);
                                ?>
                                <li>
                                    <a href="/index.php/modal/<?= $key ?>"><?= $item ?></a>
                                </li>
                            <?php
                            }
                            ?>
                            </ul>

                            <?php for ($i=1; $i <= ceil(sizeof($items)/$per_page); $i++) { ?>
                                <?php if($i == $page) { ?>
                                        <span><?= $i ?></span>
                                    <?php } else { ?>
                                        <a href="/index.php/per_page/<?= $per_page ?>/page/<?= $i ?>"><?= $i ?></a>
                                <?php } ?>
                            <?php } ?>
                        </div>
                    </div>
                </main>

                <template id="modal"></template>
            <?php } ?>

            <footer>
                <p>Made with <a href="https://github.com/locomotivemtl/locomotive-boilerplate"
                        title="Locomotive Boilerplate" target="_blank" rel="noopener">🚂</a></p>
            </footer>
        </div>
    </main>

    <script nomodule src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.6.0/polyfill.min.js"
        crossorigin="anonymous"></script>
    <script nomodule
        src="https://polyfill.io/v3/polyfill.min.js?features=Element.prototype.remove%2CElement.prototype.append%2Cfetch%2CCustomEvent%2CElement.prototype.matches%2CNodeList.prototype.forEach%2CAbortController"
        crossorigin="anonymous"></script>

    <script src="assets/scripts/vendors.js" defer></script>
    <script src="assets/scripts/app.js" defer></script>
</body>

</html>
