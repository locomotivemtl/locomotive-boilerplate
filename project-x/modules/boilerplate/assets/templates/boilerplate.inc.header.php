<!doctype html>
<html lang="{{lang}}">
    <head>
        <meta charset="utf-8">
        <base href="{{URL}}">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{meta_title}}</title>

        <link rel="icon" type="image/png" href="{{#assets.images}}favicon-16.png{{/assets.images}}" sizes="16x16">
        <link rel="icon" type="image/png" href="{{#assets.images}}favicon-32.png{{/assets.images}}" sizes="32x32">
        <link rel="apple-touch-icon-precomposed" href="{{#assets.images}}favicon-152.png{{/assets.images}}">
        <!--[if IE]><link rel="shortcut icon" href="assets/images/favicon-32.ico"><![endif]-->

        <link rel="stylesheet" href="modules/{{module}}/assets/styles/dist/main.css">

        <meta name="description" content="{{meta_description}}">
        {{opengraph_tags}}

        {{! Only include analytics if it is set in the configuration}}
        {{#cfg.google_analytics}}
        <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', '{{cfg.google_analytics}}', 'auto');
        ga('send', 'pageview');
        </script>
        {{/cfg.google_analytics}}

        {{!A final chance to have custom headers tags (like styles or scripts) in the controllers}}
        {{extra_header_content}}

    </head>
    <body>