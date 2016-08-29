angular.module('scheduling-app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('index.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "    <title></title>\n" +
    "\n" +
    "    <meta name=\"mobile-web-app-capable\" content=\"yes\">\n" +
    "    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n" +
    "    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">\n" +
    "\n" +
    "    <!-- In windows apps this fixes dynamic content errors -->\n" +
    "    <script type=\"text/javascript\" src=\"cordova.js\"></script>\n" +
    "    <script type=\"text/javascript\" timeout=\"10000\" manifest=\"manifest.json\" server=\"https://www.proxyshift.com\" src=\"bootstrap.js\"></script>\n" +
    "</head>\n" +
    "  <body ng-app=\"scheduling-app\">\n" +
    "    <ion-nav-view></ion-nav-view>\n" +
    "    <noscript>\n" +
    "        <div class=\"login-container centered-input\">\n" +
    "            <div>\n" +
    "                <form>\n" +
    "                    <div class=\"list list-inset\">\n" +
    "                        <a href=\"/\"><img src=\"img/logo.png\" class=\"logo\"></a>\n" +
    "                        <label class=\"item item-input\">\n" +
    "                            <i class=\"icon ion-email placeholder-icon\"></i>\n" +
    "                            <input type=\"text\" ng-model=\"user.username\" placeholder=\"Username or email\">\n" +
    "                        </label>\n" +
    "                        <label class=\"item item-input\">\n" +
    "                            <i class=\"icon ion-locked placeholder-icon\"></i>\n" +
    "                            <input type=\"password\" ng-model=\"user.password\" placeholder=\"Password\">\n" +
    "                        </label>\n" +
    "                        <label class=\"item login-error-message\" ng-show=\"message != null\">\n" +
    "                            <span>Proxy/Shift requires Javascript to be enabled.</span>\n" +
    "                        </label>\n" +
    "                        <button disabled class=\"button button-block\" type=\"submit\">Log in</button>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </noscript>\n" +
    "  </body>\n" +
    "</html>\n"
  );


  $templateCache.put('js/directives/ionic-timepicker-12-hours.html',
    "<div class=\"12HourTimePickerChildDiv\">\n" +
    "    <div class=\"row\">\n" +
    "    <span class=\"button-small col col-25\">\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "              ng-click=\"increaseHours()\">\n" +
    "          <i class=\"icon ion-chevron-up\"></i></button>\n" +
    "      <div ng-bind=\"time.hours\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "              ng-click=\"decreaseHours()\">\n" +
    "          <i class=\"icon ion-chevron-down\"></i></button>\n" +
    "    </span>\n" +
    "        <label class=\"col col-10 timePickerColon\"> : </label>\n" +
    "    <span class=\"button-small col col-25\">\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "              ng-click=\"increaseMinutes()\"><i class=\"icon ion-chevron-up\"></i></button>\n" +
    "      <div ng-bind=\"time.minutes\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "              ng-click=\"decreaseMinutes()\"><i class=\"icon ion-chevron-down\"></i></button>\n" +
    "    </span>\n" +
    "        <label class=\"col col-10 timePickerColon\"> : </label>\n" +
    "    <span class=\"button-small col col-25\">\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "              ng-click=\"changeMeridian()\"><i class=\"icon ion-chevron-up\"></i></button>\n" +
    "      <div ng-bind=\"time.meridian\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "              ng-click=\"changeMeridian()\"><i class=\"icon ion-chevron-down\"></i></button>\n" +
    "    </span>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('js/directives/ionic-timepicker-hours.html',
    "<div class=\"12HourTimePickerChildDiv\">\n" +
    "    <div class=\"row\">\n" +
    "        <span class=\"button-small col col-25\">\n" +
    "            <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "                    ng-click=\"increaseHours()\">\n" +
    "                <i class=\"icon ion-chevron-up\"></i></button>\n" +
    "            <div ng-bind=\"time.hours\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "            <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "                    ng-click=\"decreaseHours()\">\n" +
    "                <i class=\"icon ion-chevron-down\"></i></button>\n" +
    "        </span>\n" +
    "        <label class=\"col col-10 timePickerColon\"> : </label>\n" +
    "        <span class=\"button-small col col-25\">\n" +
    "            <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "                    ng-click=\"increaseMinutes()\"><i class=\"icon ion-chevron-up\"></i></button>\n" +
    "            <div ng-bind=\"time.minutes\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "            <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "                    ng-click=\"decreaseMinutes()\"><i class=\"icon ion-chevron-down\"></i></button>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('js/directives/ionic-timepicker-single.html',
    "<div class=\"12HourTimePickerChildDiv\">\n" +
    "    <div class=\"row\">\n" +
    "        <span class=\"button-small col col-25\">\n" +
    "            <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "                    ng-click=\"increment()\">\n" +
    "                <i class=\"icon ion-chevron-up\"></i></button>\n" +
    "            <div ng-bind=\"time.hours\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "            <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "                    ng-click=\"decrement()\">\n" +
    "                <i class=\"icon ion-chevron-down\"></i></button>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('lib/angular-local-storage/demo/demo.html',
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "<meta charset=\"utf-8\">\n" +
    "\n" +
    "<title>Demo of Angular Local Storage Module</title>\n" +
    "\n" +
    "<meta name=\"description\" content=\"Demo of Angular Local Storage Module\">\n" +
    "<meta name=\"author\" content=\"Gregory Pike\">\n" +
    "\n" +
    "<link rel=\"stylesheet\" href=\"http://necolas.github.com/normalize.css/2.0.1/normalize.css\">\n" +
    "<link href=\"http://netdna.bootstrapcdn.com/twitter-bootstrap/2.1.1/css/bootstrap-combined.min.css\" rel=\"stylesheet\">\n" +
    "<link href=\"http://google-code-prettify.googlecode.com/svn/trunk/src/prettify.css\" rel=\"stylesheet\">\n" +
    "<link href=\"demo-style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "<!--[if lt IE 9]>\n" +
    "<script src=\"http://html5shiv.googlecode.com/svn/trunk/html5.js\"></script>\n" +
    "<![endif]-->\n" +
    "\n" +
    "<body onload=\"prettyPrint()\">\n" +
    "\n" +
    "<!-- BEGIN DEMO -->\n" +
    "\n" +
    "<div class=\"container\" ng-app=\"demoModule\">\n" +
    "\n" +
    "  <div class=\"navbar navbar-inverse\">\n" +
    "    <div class=\"navbar-inner\">\n" +
    "      <a class=\"brand\" href=\"#\">Angular Local Storage</a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"hero-unit\">\n" +
    "\n" +
    "    <h1>Give it a try</h1>\n" +
    "\n" +
    "    <div ng-controller=\"DemoCtrl\">\n" +
    "      <p><input type=\"text\" ng-model=\"localStorageDemo\" placeholder=\"Start typing...\"></p>\n" +
    "\n" +
    "      <blockquote class=\"well\" ng-show=\"localStorageDemoValue\">\n" +
    "        <p ng-bind=\"localStorageDemoValue\"></p>\n" +
    "        <small>{{storageType}} value</small>\n" +
    "      </blockquote>\n" +
    "\n" +
    "      <p><button ng-click=\"clearAll()\">Clear All</button></p>\n" +
    "    </div>\n" +
    "\n" +
    "    <p>The Angular Local Storage Module is meant to be a plug-and-play Angular module for accessing the browsers Local Storage API.</p>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <p>Angular Local Storage offers you access to the browser local storage API through Angular but also allows has the following features:</p>\n" +
    "\n" +
    "  <ul>\n" +
    "    <li>Control local storage access through key prefices (e.g. \"myApp.keyName\")</li>\n" +
    "    <li>Checks browser support and falls back to cookies for antiquated browsers</li>\n" +
    "    <li>Allows programmatic access to remove all keys for a given app</li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <h3>Usage</h3>\n" +
    "\n" +
    "  <!-- Sorry guys, I need to earn a living -->\n" +
    "  <div style=\"float: right\">\n" +
    "    <script async src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>\n" +
    "    <!-- ALS Leaderboard -->\n" +
    "    <ins class=\"adsbygoogle\"\n" +
    "         style=\"display:inline-block;width:728px;height:90px\"\n" +
    "         data-ad-client=\"ca-pub-8242772837340688\"\n" +
    "         data-ad-slot=\"1586567981\"></ins>\n" +
    "    <script>\n" +
    "    (adsbygoogle = window.adsbygoogle || []).push({});\n" +
    "    </script>\n" +
    "  </div>\n" +
    "\n" +
    "  <h6>Dependencies:</h6>\n" +
    "  <ul>\n" +
    "    <li><code>AngularJS</code> <small><a href=\"http://angularjs.org/\">http://angularjs.org/</a></small></li>\n" +
    "    <li><code>Angular Local Storage Module</code> <small><a href=\"../src/angular-local-storage.js\">angular-local-storage.js</a></small></li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <h6>JS Example</h6>\n" +
    "  <pre class=\"prettyprint lang-js\">\n" +
    "var YourCtrl = function($scope, localStorageService, ...) {\n" +
    "  // To add to local storage\n" +
    "  localStorageService.set('localStorageKey','Add this!');\n" +
    "  // Read that value back\n" +
    "  var value = localStorageService.get('localStorageKey');\n" +
    "  // To remove a local storage\n" +
    "  localStorageService.remove('localStorageKey');\n" +
    "  // Removes all local storage\n" +
    "  localStorageService.clearAll();\n" +
    "  // You can also play with cookies the same way\n" +
    "  localStorageService.cookie.set('localStorageKey','I am a cookie value now');\n" +
    "}</pre>\n" +
    "\n" +
    "  <h3>API Access</h3>\n" +
    "\n" +
    "  <table class=\"table table-striped table-bordered\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th>Call</th>\n" +
    "        <th>Arguments</th>\n" +
    "        <th>Action</th>\n" +
    "        <th>Returns</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr>\n" +
    "        <td><code>isSupported</code></td>\n" +
    "        <td class=\"muted\"><small>n/a</small></td>\n" +
    "        <td>Checks the browsers support for local storage</td>\n" +
    "        <td>Boolean for success</td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td><code>set</code></td>\n" +
    "        <td><small>key, value</small></td>\n" +
    "        <td>Adds a key-value pair to the browser local storage</td>\n" +
    "        <td>Boolean for success</td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td><code>get</code></td>\n" +
    "        <td><small>key</small></td>\n" +
    "        <td>Gets a value from local storage</td>\n" +
    "        <td>Stored value</td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td><code>remove</code></td>\n" +
    "        <td><small>key, ...</small></td>\n" +
    "        <td>Removes a key-value pairs from the browser local storage</td>\n" +
    "        <td>n/a</td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td><code>clearAll</code></td>\n" +
    "        <td class=\"muted\">n/a</td>\n" +
    "        <td><span class=\"label label-warning\">Warning</span> Removes all local storage key-value pairs for this app. It will optionally take a string, which is converted to a regular expression, and then clears keys based on that regular expression.</td>\n" +
    "        <td>Boolean for success</td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td><code>cookie</code></td>\n" +
    "        <td><small>set | get | remove | clearAll</small></td>\n" +
    "        <td>Each function within cookie uses the same arguments as the coresponding local storage functions</td>\n" +
    "        <td>n/a</td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!-- END DEMO -->\n" +
    "\n" +
    "<!-- JAVASCRIPT -->\n" +
    "<script src=\"https://ajax.googleapis.com/ajax/libs/angularjs/1.0.1/angular.min.js\"></script>\n" +
    "<script src=\"http://google-code-prettify.googlecode.com/svn/trunk/src/prettify.js\"></script>\n" +
    "<script src=\"https://rawgit.com/grevory/angular-local-storage/master/dist/angular-local-storage.min.js\"></script>\n" +
    "<script src=\"demo-app.js\"></script>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/angular-toastr/src/directives/progressbar/progressbar.html',
    "<div class=\"toast-progress\"></div>\n"
  );


  $templateCache.put('lib/angular-toastr/src/directives/toast/toast.html',
    "<div class=\"{{toastClass}} {{toastType}}\" ng-click=\"tapToast()\">\n" +
    "  <div ng-switch on=\"allowHtml\">\n" +
    "    <div ng-switch-default ng-if=\"title\" class=\"{{titleClass}}\" aria-label=\"{{title}}\">{{title}}</div>\n" +
    "    <div ng-switch-default class=\"{{messageClass}}\" aria-label=\"{{message}}\">{{message}}</div>\n" +
    "    <div ng-switch-when=\"true\" ng-if=\"title\" class=\"{{titleClass}}\" ng-bind-html=\"title\"></div>\n" +
    "    <div ng-switch-when=\"true\" class=\"{{messageClass}}\" ng-bind-html=\"message\"></div>\n" +
    "  </div>\n" +
    "  <progress-bar ng-if=\"progressBar\"></progress-bar>\n" +
    "</div>\n"
  );


  $templateCache.put('lib/bluebird/docs/_layouts/api.html',
    "---\n" +
    "layout: default\n" +
    "---\n" +
    "\n" +
    "<div class=\"post\">\n" +
    "  <article class=\"post-content\">\n" +
    "    {{ content }}\n" +
    "  </article>\n" +
    "</div>\n"
  );


  $templateCache.put('lib/bluebird/docs/_layouts/default.html',
    "<!DOCTYPE html>\n" +
    "<!--[if lt IE 7]>      <html class=\"no-js lt-ie9 lt-ie8 lt-ie7\"> <![endif]-->\n" +
    "<!--[if IE 7]>         <html class=\"no-js lt-ie9 lt-ie8\"> <![endif]-->\n" +
    "<!--[if IE 8]>         <html class=\"no-js lt-ie9\"> <![endif]-->\n" +
    "<!--[if gt IE 8]><!-->\n" +
    "<html class=\"no-js\">\n" +
    " <!--<![endif]-->\n" +
    "<head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
    "    <link href='http://fonts.googleapis.com/css?family=Raleway:400,300,200,700,500,100,800,600,900' rel='stylesheet' type='text/css'>\n" +
    "    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css\" />\n" +
    "    <title>{% if page.title %}{{ page.title }} | {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>\n" +
    "    <meta name=\"description\" content=\"{% if page.excerpt %}{{ page.excerpt | strip_html | strip_newlines | truncate: 160 }}{% else %}{{ site.description }}{% endif %}\">\n" +
    "    <link href=\"//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css\" rel=\"stylesheet\">\n" +
    "    <link rel=\"stylesheet\" href=\"{{ \"/css/mono-blue.css\" | prepend: site.baseurl }}\" type='text/css' />\n" +
    "    <link rel=\"stylesheet\" href=\"{{ \"/css/hover-min.css\" | prepend: site.baseurl }}\" media=\"all\">\n" +
    "    <link rel=\"stylesheet\" href=\"{{ \"/css/main.css\" | prepend: site.baseurl }}\">\n" +
    "    <link rel=\"canonical\" href=\"{{ page.url | replace:'index.html','' | prepend: site.baseurl | prepend: site.url }}\">\n" +
    "    <link rel=\"icon\" href=\"{{ \"/img/favicon.png\" | prepend: site.baseurl }}\" type=\"image/png\" />\n" +
    "  </head>\n" +
    "\n" +
    "  <body>\n" +
    "\n" +
    "    <nav class=\"navbar\" role=\"navigation\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"navbar-header\">\n" +
    "                <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n" +
    "                    <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                    <span class=\"icon-bar\"></span>\n" +
    "                    <span class=\"icon-bar\"></span>\n" +
    "                    <span class=\"icon-bar\"></span>\n" +
    "                </button>\n" +
    "\n" +
    "                <a href=\"/\" class=\"title\">\n" +
    "                    <img src=\"{{ \"/img/logo.png\" | prepend: site.baseurl }}\" class=\"hidden-xs\" />\n" +
    "\n" +
    "                    <span class=\"tagline\">bluebird</span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div id=\"navbar\" class=\"navbar-collapse navbar-bluebird navbar-right collapse\">\n" +
    "                <ul class=\"nav navbar-nav bb-nav\">\n" +
    "                    {% if page.path == 'docs/support.md' %}\n" +
    "                        {% assign name = 'support' %}\n" +
    "                    {% elsif page.path == 'docs/install.md' %}\n" +
    "                        {% assign name = 'install' %}\n" +
    "                    {% else %}\n" +
    "                        {% assign name = 'docs' %}\n" +
    "                    {% endif %}\n" +
    "\n" +
    "                    <li class=\"{% if name == 'docs' %}active{% endif %}\"><a href=\"{{ \"/docs/getting-started.html\" | prepend: site.baseurl }}\">Docs</a></li>\n" +
    "                    <li class=\"{% if name == 'support' %}active{% endif %}\"><a href=\"{{ \"/docs/support.html\" | prepend: site.baseurl }}\">Support</a></li>\n" +
    "                    <li class=\"{% if name == 'install' %}active{% endif %}\"><a href=\"{{ \"/docs/install.html\" | prepend: site.baseurl }}\">Install</a></li>\n" +
    "                    <li><a href=\"https://github.com/petkaantonov/bluebird/\">Github</a></li>\n" +
    "                </ul>\n" +
    "            </div><!--/.navbar-collapse -->\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "   <div class=\"container\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-3\">\n" +
    "            <ul class=\"nav left-nav\">\n" +
    "                <li><a href=\"{{ \"/docs/getting-started.html\" | prepend: site.baseurl }}\">Getting Started</a></li>\n" +
    "                <li><a href=\"{{ \"/docs/features.html\" | prepend: site.baseurl }}\">Features</a></li>\n" +
    "                <li><a href=\"{{ \"/docs/changelog.html\" | prepend: site.baseurl }}\">Changelog</a></li>\n" +
    "                <li><a href=\"{{ \"/docs/api-reference.html\" | prepend: site.baseurl }}\"><strong>API Reference</strong></a></li>\n" +
    "                <li><a href=\"{{ \"/docs/new-in-bluebird-3.html\" | prepend: site.baseurl }}\"><strong>New in 3.0</strong></a></li>\n" +
    "                <li><a href=\"{{ \"/docs/warning-explanations.html\" | prepend: site.baseurl }}\">Warning Explanations</a></li>\n" +
    "                <li><a href=\"{{ \"/docs/error-explanations.html\" | prepend: site.baseurl }}\">Error Explanations</a></li>\n" +
    "                <li><a href=\"{{ \"/docs/contribute.html\" | prepend: site.baseurl }}\">Contribute</a></li>\n" +
    "                <li><a href=\"{{ \"/docs/benchmarks.html\" | prepend: site.baseurl }}\">Benchmarks</a></li>\n" +
    "                <li><a href=\"{{ \"/docs/deprecated-apis.html\" | prepend: site.baseurl }}\">Deprecated APIs</a></li>\n" +
    "                <li><a href=\"{{ \"/docs/download-api-reference.html\" | prepend: site.baseurl }}\">Download API Reference</a></li>\n" +
    "                <li><hr></li>\n" +
    "                <li>Why?\n" +
    "                    <ul class=\"nav nav-child\">\n" +
    "                        <li><a href=\"{{ \"/docs/why-promises.html\" | prepend: site.baseurl }}\">Why Promises?</a></li>\n" +
    "                        <li><a href=\"{{ \"/docs/why-bluebird.html\" | prepend: site.baseurl }}\">Why bluebird?</a></li>\n" +
    "                        <li><a href=\"{{ \"/docs/why-performance.html\" | prepend: site.baseurl }}\">Why Performance?</a></li>\n" +
    "                        <li><a href=\"{{ \"/docs/what-about-generators.html\" | prepend: site.baseurl }}\">What About Generators?</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <li><hr></li>\n" +
    "                <li>\n" +
    "                    Tutorials\n" +
    "                    <ul class=\"nav nav-child\">\n" +
    "                        <li><a href=\"{{ \"/docs/async-dialogs.html\" | prepend: site.baseurl }}\">Async Dialogs</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <li><hr></li>\n" +
    "                <li>\n" +
    "                    Guides\n" +
    "                    <ul class=\"nav nav-child\">\n" +
    "                        <li><a href=\"{{ \"/docs/beginners-guide.html\" | prepend: site.baseurl }}\">Beginner's Guide</a></li>\n" +
    "                        <li><a href=\"{{ \"/docs/anti-patterns.html\" | prepend: site.baseurl }}\">Anti-patterns</a></li>\n" +
    "                        <li><a href=\"{{ \"/docs/working-with-callbacks.html\" | prepend: site.baseurl }}\">Working with Callbacks</a></li>\n" +
    "                        <li><a href=\"{{ \"/docs/coming-from-other-languages.html\" | prepend: site.baseurl }}\">Coming from Other Languages</a></li>\n" +
    "                        <li><a href=\"{{ \"/docs/coming-from-other-libraries.html\" | prepend: site.baseurl }}\">Coming from Other Libraries</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            {% if page.path %}\n" +
    "            <div class=\"post-info\">\n" +
    "                <a href=\"{{ page.path | prepend: \"https://github.com/petkaantonov/bluebird/edit/master/docs/\" }}\">\n" +
    "                    <i class=\"fa fa-edit\"></i>\n" +
    "                    Edit on Github</a>\n" +
    "                <br>\n" +
    "                <i>Updated {{ page.path | file_date | date_to_string }}</i>\n" +
    "            </div>\n" +
    "            <div class=\"clearfix\"></div>\n" +
    "            {% endif %}\n" +
    "            {{ content }}\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <footer></footer>\n" +
    "    <script src=\"https://code.jquery.com/jquery-2.1.3.min.js\"></script>\n" +
    "    <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js\"></script>\n" +
    "    <script src=\"//cdn.jsdelivr.net/bluebird/{{ site.version }}/bluebird.js\"></script>\n" +
    "    <script>\n" +
    "      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n" +
    "      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n" +
    "      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n" +
    "      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n" +
    "\n" +
    "      ga('create', 'UA-46253177-1', 'auto');\n" +
    "      ga('send', 'pageview');\n" +
    "\n" +
    "    </script>\n" +
    "</body>\n" +
    "\n" +
    "</html>\n"
  );


  $templateCache.put('lib/bluebird/docs/_layouts/page.html',
    "---\n" +
    "layout: default\n" +
    "---\n" +
    "<div class=\"post\">\n" +
    "\n" +
    "  <header class=\"post-header\">\n" +
    "    <h1 class=\"post-title\">{{ page.title }}</h1>\n" +
    "  </header>\n" +
    "\n" +
    "  <article class=\"post-content\">\n" +
    "    {{ content }}\n" +
    "  </article>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('lib/bluebird/docs/index.html',
    "<!DOCTYPE html>\n" +
    "<meta charset=utf-8>\n" +
    "<title>Redirecting...</title>\n" +
    "<link rel=canonical href=\"/docs/getting-started.html\">\n" +
    "<meta http-equiv=refresh content=\"0; url=/docs/getting-started.html\">\n" +
    "<h1>Redirecting...</h1>\n" +
    "<a href=\"/docs/getting-started.html\">Click here if you are not redirected.</a>\n" +
    "<script>location='/docs/getting-started.html'</script>\n"
  );


  $templateCache.put('lib/cordova-app-loader/www/autoupdate.html',
    "<!DOCTYPE HTML>\n" +
    "<html>\n" +
    "    <head>\n" +
    "        <title>Cordova App Loader</title>\n" +
    "        <meta name=\"viewport\" content=\"width=device-width, maximum-scale=1, user-scalable=no\" />\n" +
    "        <meta name=\"mobile-web-app-capable\" content=\"yes\" />\n" +
    "        <meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\n" +
    "        <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\" />\n" +
    "        <script type=\"text/javascript\" src=\"cordova.js\"></script>\n" +
    "        <script type=\"text/javascript\" \n" +
    "            timeout=\"5100\" \n" +
    "            server=\"http://data.madebymark.nl/cordova-app-loader/\"\n" +
    "            manifest=\"manifest.json\" \n" +
    "            src=\"bootstrap.js\"></script>\n" +
    "    </head>\n" +
    "    <body>\n" +
    "    </body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/cordova-app-loader/www/index.html',
    "<!DOCTYPE HTML>\n" +
    "<html>\n" +
    "    <head>\n" +
    "        <title>Cordova App Loader</title>\n" +
    "        <meta name=\"viewport\" content=\"width=device-width, maximum-scale=1, user-scalable=no\" />\n" +
    "        <meta name=\"mobile-web-app-capable\" content=\"yes\" />\n" +
    "        <meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\n" +
    "        <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\" />\n" +
    "        <script type=\"text/javascript\" src=\"cordova.js\"></script>\n" +
    "        <script type=\"text/javascript\" \n" +
    "            timeout=\"5100\" \n" +
    "            manifest=\"manifest.json\" \n" +
    "            src=\"bootstrap.js\"></script>\n" +
    "    </head>\n" +
    "    <body>\n" +
    "    </body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/cordova-app-loader/www/template.html',
    "\n" +
    "<h5>App: <span id=\"msg\"></span></h5>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "  <a href=\"#\" class=\"check\" manifest=\"manifest.json\">Original</a> | \n" +
    "  <a href=\"#\" class=\"check\" manifest=\"update/manifest.php\">Update</a> | \n" +
    "  <a href=\"#\" class=\"check\" manifest=\"slow-download/manifest.json\">Slow download</a> | \n" +
    "  <a href=\"#\" class=\"check\" manifest=\"broken-app/manifest.json\">Broken app</a> | \n" +
    "  <a href=\"#\" class=\"check\" manifest=\"broken-url/manifest.json\">Broken download</a>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"manifest\" placeholder=\"url to manifest.json\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "  <button class=\"btn btn-default doCheck\">Check</button> &gt; \n" +
    "  <button class=\"btn btn-default download\">Download</button> &gt; \n" +
    "  <button class=\"btn btn-default update\">Update</button>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <button class=\"btn btn-link factory\">reset to original</button>\n" +
    "  <button class=\"btn btn-link reload\">reload</button>\n" +
    "</div>\n" +
    "\n" +
    "<h5>Download: <span class=\"target\"></span></h5>\n" +
    "<div class=\"progress\">\n" +
    "  <div class=\"progress-bar\" role=\"progressbar\" style=\"width: 0%;\">\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<h5>Status:</h5>\n" +
    "<pre id=\"status\">\n" +
    "</pre>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('lib/ionic-datepicker/src/ionic-datepicker-modal.html',
    "<ion-modal-view class=\"ionic_datepicker_modal\">\n" +
    "  <ion-header-bar ng-class=\"modalHeaderColor\">\n" +
    "    <h1 class=\"title\">{{titleLabel}}</h1>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content class=\"ionic_datepicker_modal_content\">\n" +
    "    <div class=\"ionic_datepicker\">\n" +
    "      <div class=\"selected_date_full\">{{selectedDateFull | date:\"dd-MM-yyyy\"}}</div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col col-10 left_arrow\" ng-click=\"prevMonth()\"\n" +
    "             ng-class=\"{'pointer_events_none':(enableDatesFrom.isSet && enableDatesFrom.epoch > currentMonthFirstDayEpoch)}\">\n" +
    "          <button class=\"button-clear font_22px\"\n" +
    "                  ng-class=\"{'color_blue':((enableDatesFrom.isSet && enableDatesFrom.epoch < currentMonthFirstDayEpoch) || (!enableDatesFrom.isSet))}\">\n" +
    "            <i class=\"icon ion-chevron-left\"></i>\n" +
    "          </button>\n" +
    "        </div>\n" +
    "        <div class=\"col col-80 drop_down\">\n" +
    "          <div class=\"row select_section\">\n" +
    "            <div class=\"col col-50 month_dropdown\">\n" +
    "              <div class=\"list\">\n" +
    "                <label class=\"item item-input item-select\">\n" +
    "                  <select ng-model=\"currentMonth\" ng-change=\"monthChanged(currentMonth)\" class=\"month_select\">\n" +
    "                    <option value=\"{{month}}\" ng-repeat=\"month in monthsList\"\n" +
    "                            ng-selected=\"month == currentMonthSelected\">\n" +
    "                      {{month}}\n" +
    "                    </option>\n" +
    "                  </select>\n" +
    "                </label>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"col col-50 year_dropdown\">\n" +
    "              <div class=\"list\">\n" +
    "                <label class=\"item item-input item-select\">\n" +
    "                  <select ng-model=\"currentYear\" ng-change=\"yearChanged(currentYear)\" class=\"year_select\">\n" +
    "                    <option value=\"{{year}}\" ng-repeat=\"year in yearsList\" ng-selected=\"year == currentYearSelected\">\n" +
    "                      {{year}}\n" +
    "                    </option>\n" +
    "                  </select>\n" +
    "                </label>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col col-10 right_arrow\" ng-click=\"nextMonth()\"\n" +
    "             ng-class=\"{'pointer_events_none':(enableDatesTo.isSet && enableDatesTo.epoch < currentMonthLastDayEpoch)}\">\n" +
    "          <button class=\"button-clear font_22px\"\n" +
    "                  ng-class=\"{'color_blue':((enableDatesTo.isSet && enableDatesTo.epoch > currentMonthLastDayEpoch) || (!enableDatesTo.isSet))}\">\n" +
    "            <i class=\"icon ion-chevron-right\"></i>\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"calendar_grid\">\n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col text-center\" ng-repeat=\"weekName in weekNames track by $index\" style=\"font-weight: bold\"> {{ weekName }}\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "          <div class=\"row\" ng-repeat=\"row in rows track by $index\" style=\"text-align: center;\">\n" +
    "            <div class=\"col no_padding\" ng-repeat=\"col in cols track by $index\"\n" +
    "                 ng-class=\"{'date_col': (dayList[$parent.$index * numColumns + $index].day != undefined),\n" +
    "      'date_selected': (dayList[$parent.$index * numColumns + $index].dateString === selctedDateStringCopy && dayList[$parent.$index * numColumns + $index].day != undefined) ,\n" +
    "      'today' : (dayList[$parent.$index * numColumns + $index].date == today.date && dayList[$parent.$index * numColumns + $index].month == today.month && dayList[$parent.$index * numColumns + $index].year == today.year)}\">\n" +
    "              <div class=\"date_cell\" ng-click=\"dateSelected(dayList[$parent.$index * numColumns + $index])\"\n" +
    "                   ng-class=\"{'pointer_events_none':(disabledDates.indexOf(dayList[$parent.$index * numColumns + $index].epochLocal) > -1) || (enableDatesFrom.isSet && enableDatesFrom.epoch > dayList[$parent.$index * numColumns + $index].epochLocal) || (enableDatesTo.isSet && enableDatesTo.epoch < dayList[$parent.$index * numColumns + $index].epochLocal)}\">\n" +
    "                {{ dayList[$parent.$index * numColumns + $index].date }}\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"error_msg padding-horizontal\"\n" +
    "           ng-show=\"date_selection.submitted === true && date_selection.selected === false\">{{errorMsgLabel}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "  <ion-footer-bar  ng-class=\"modalFooterColor\">\n" +
    "    <div class=\"row no_padding\">\n" +
    "      <div class=\"col-33 text-center\" ng-click=\"closeIonicDatePickerModal()\"><button class=\"button button-clear\">{{closeLabel}}</button></div>\n" +
    "      <div class=\"col-34 text-center\" ng-click=\"setIonicDatePickerTodayDate()\"><button class=\"button button-clear\">{{todayLabel}}</button></div>\n" +
    "      <div class=\"col-33 text-center\" ng-click=\"setIonicDatePickerDate()\"><button class=\"button button-clear\">{{setLabel}}</button></div>\n" +
    "    </div>\n" +
    "  </ion-footer-bar>\n" +
    "</ion-modal-view>\n"
  );


  $templateCache.put('lib/ionic-datepicker/src/ionic-datepicker-popup.html',
    "<div class=\"ionic-datepicker\">\n" +
    "  <div class=\"selected_date_full\">{{selectedDateFull | date:\"dd-MM-yyyy\"}}</div>\n" +
    "  <div class=\"row no_padding\">\n" +
    "    <div class=\"col col-10 left_arrow\" ng-click=\"prevMonth()\"\n" +
    "         ng-class=\"{'pointer_events_none':(enableDatesFrom.isSet && enableDatesFrom.epoch > currentMonthFirstDayEpoch)}\">\n" +
    "      <button class=\"button-clear\"\n" +
    "              ng-class=\"{'color_blue':((enableDatesFrom.isSet && enableDatesFrom.epoch < currentMonthFirstDayEpoch) || (!enableDatesFrom.isSet))}\">\n" +
    "        <i class=\"icon ion-chevron-left\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <div class=\"col col-80 drop_down no_padding\">\n" +
    "      <div class=\"row select_section\">\n" +
    "        <div class=\"col col-50 month_dropdown\">\n" +
    "          <div class=\"list\">\n" +
    "            <label class=\"item item-input item-select\">\n" +
    "              <select ng-model=\"currentMonth\" ng-change=\"monthChanged(currentMonth)\" class=\"month_select\">\n" +
    "                <option value=\"{{month}}\" ng-repeat=\"month in monthsList\" ng-selected=\"month == currentMonthSelected\">\n" +
    "                  {{month}}\n" +
    "                </option>\n" +
    "              </select>\n" +
    "            </label>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col col-50 year_dropdown\">\n" +
    "          <div class=\"list\">\n" +
    "            <label class=\"item item-input item-select\">\n" +
    "              <select ng-model=\"currentYear\" ng-change=\"yearChanged(currentYear)\" class=\"year_select\">\n" +
    "                <option value=\"{{year}}\" ng-repeat=\"year in yearsList\" ng-selected=\"year == currentYearSelected\">\n" +
    "                  {{year}}\n" +
    "                </option>\n" +
    "              </select>\n" +
    "            </label>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col col-10 right_arrow\" ng-click=\"nextMonth()\"\n" +
    "         ng-class=\"{'pointer_events_none':(enableDatesTo.isSet && enableDatesTo.epoch < currentMonthLastDayEpoch)}\">\n" +
    "      <button class=\"button-clear\"\n" +
    "              ng-class=\"{'color_blue':((enableDatesTo.isSet && enableDatesTo.epoch > currentMonthLastDayEpoch) || (!enableDatesTo.isSet))}\">\n" +
    "        <i class=\"icon ion-chevron-right\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"calendar_grid\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col\" ng-repeat=\"weekName in weekNames track by $index\" style=\"font-weight: bold\"> {{ weekName }}</div>\n" +
    "    </div>\n" +
    "    <div style=\"height: 180px;\">\n" +
    "      <div class=\"row\" ng-repeat=\"row in rows track by $index\" style=\"text-align: center;\">\n" +
    "        <div class=\"col no_padding\" ng-repeat=\"col in cols track by $index\"\n" +
    "             ng-class=\"{'date_col': (dayList[$parent.$index * numColumns + $index].day != undefined),\n" +
    "      'date_selected': (dayList[$parent.$index * numColumns + $index].dateString === selctedDateStringCopy && dayList[$parent.$index * numColumns + $index].day != undefined) ,\n" +
    "      'today' : (dayList[$parent.$index * numColumns + $index].date == today.date && dayList[$parent.$index * numColumns + $index].month == today.month && dayList[$parent.$index * numColumns + $index].year == today.year)}\">\n" +
    "          <div class=\"date_cell\" ng-click=\"dateSelected(dayList[$parent.$index * numColumns + $index])\"\n" +
    "               ng-class=\"{'pointer_events_none':(disabledDates.indexOf(dayList[$parent.$index * numColumns + $index].epochLocal) > -1) || (enableDatesFrom.isSet && enableDatesFrom.epoch > dayList[$parent.$index * numColumns + $index].epochLocal) || (enableDatesTo.isSet && enableDatesTo.epoch < dayList[$parent.$index * numColumns + $index].epochLocal)}\">\n" +
    "            {{ dayList[$parent.$index * numColumns + $index].date }}\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"error_msg padding-horizontal\"\n" +
    "       ng-show=\"date_selection.submitted === true && date_selection.selected === false\">{{errorMsgLabel}}\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('lib/ionic-fancy-select/templates/item-template.html',
    "<ion-list>\n" +
    "  <ion-item ng-click=\"showItems($event)\">\n" +
    "    {{text}}\n" +
    "    <span class=\"item-note\">{{noteText}}\n" +
    "      <img class=\"{{noteImgClass}}\" ng-if=\"noteImg != null\" src=\"{{noteImg}}\" />\n" +
    "    </span>\n" +
    "  </ion-item>\n" +
    "</ion-list>\n"
  );


  $templateCache.put('lib/ionic-fancy-select/templates/modal-template.html',
    "<ion-modal-view>\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <button class=\"button button-positive button-icon ion-ios-arrow-back\" ng-click=\"hideItems()\" />\n" +
    "    <h1 class=\"title\">{{headerText}}</h1>\n" +
    "    <button class=\"button button-positive button-icon ion-checkmark\" ng-show=\"multiSelect\" ng-click=\"validate()\" />\n" +
    "  </ion-header-bar>\n" +
    "  \n" +
    "  <ion-content>\n" +
    "    <ion-list>\n" +
    "      <ion-item class=\"item-checkbox\" ng-if=\"multiSelect\" ng-repeat=\"item in items\">\n" +
    "        <label class=\"checkbox\">\n" +
    "          <input type=\"checkbox\" ng-checked=\"item.checked\" ng-model=\"item.checked\">\n" +
    "        </label>\n" +
    "        {{item.Name}}\n" +
    "      </ion-item>\n" +
    "      <label class=\"item\" ng-click=\"validate(item)\" ng-if=\"!multiSelect\" ng-repeat=\"item in items\">\n" +
    "        {{item.Name}}\n" +
    "      </label>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</ion-modal-view>\n" +
    "\n"
  );


  $templateCache.put('lib/ionic-timepicker/src/ionic-timepicker-12-hour.html',
    "<div class=\"12HourTimePickerChildDiv\">\n" +
    "  <div class=\"row\">\n" +
    "    <span class=\"button-small col col-25\">\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "              ng-click=\"increaseHours()\">\n" +
    "        <i class=\"icon ion-chevron-up\"></i></button>\n" +
    "      <div ng-bind=\"time.hours\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "              ng-click=\"decreaseHours()\">\n" +
    "        <i class=\"icon ion-chevron-down\"></i></button>\n" +
    "    </span>\n" +
    "    <label class=\"col col-10 timePickerColon\"> : </label>\n" +
    "    <span class=\"button-small col col-25\">\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "              ng-click=\"increaseMinutes()\"><i class=\"icon ion-chevron-up\"></i></button>\n" +
    "      <div ng-bind=\"time.minutes\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "              ng-click=\"decreaseMinutes()\"><i class=\"icon ion-chevron-down\"></i></button>\n" +
    "    </span>\n" +
    "    <label class=\"col col-10 timePickerColon\"> : </label>\n" +
    "    <span class=\"button-small col col-25\">\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "              ng-click=\"changeMeridian()\"><i class=\"icon ion-chevron-up\"></i></button>\n" +
    "      <div ng-bind=\"time.meridian\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "              ng-click=\"changeMeridian()\"><i class=\"icon ion-chevron-down\"></i></button>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('lib/ionic-timepicker/src/ionic-timepicker-24-hour.html',
    "<div class=\"24HourTimePickerChildDiv\">\n" +
    "  <div class=\"row\">\n" +
    "    <span class=\"button-small col col-offset-20 col-25\">\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "              ng-click=\"increaseHours()\">\n" +
    "        <i class=\"icon ion-chevron-up\"></i></button>\n" +
    "      <div ng-bind=\"time.hours\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "              ng-click=\"decreaseHours()\">\n" +
    "        <i class=\"icon ion-chevron-down\"></i></button>\n" +
    "    </span>\n" +
    "    <label class=\"col col-10 timePickerColon\"> : </label>\n" +
    "    <span class=\"button-small col col-25\">\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginBottom10\"\n" +
    "              ng-click=\"increaseMinutes()\"><i class=\"icon ion-chevron-up\"></i></button>\n" +
    "      <div ng-bind=\"time.minutes\" class=\"ipBoxes timePickerBoxText\"></div>\n" +
    "      <button type=\"button\" class=\"button button-clear button-small button-dark timePickerArrows marginTop10\"\n" +
    "              ng-click=\"decreaseMinutes()\"><i class=\"icon ion-chevron-down\"></i></button>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('lib/ionic/demos/directive/checkbox/simple/index.html',
    "---\n" +
    "name: simple\n" +
    "component: ionCheckbox\n" +
    "---\n" +
    "\n" +
    "<ion-header-bar class=\"bar-positive\">\n" +
    "  <h1 class=\"title\">\n" +
    "    Checkbox: Simple Usage\n" +
    "  </h1>\n" +
    "</ion-header-bar>\n" +
    "<ion-content ng-controller=\"CheckboxSimpleCtrl\" class=\"padding\">\n" +
    "  <h4>Your pizza has {{toppings()}}!</h4>\n" +
    "  <ion-checkbox ng-model=\"pizza.pepperoni\">\n" +
    "    Pepperoni?\n" +
    "  </ion-checkbox>\n" +
    "  <ion-checkbox ng-model=\"pizza.sausage\">\n" +
    "    Sausage?\n" +
    "  </ion-checkbox>\n" +
    "  <ion-checkbox ng-model=\"pizza.jalapenos\">\n" +
    "    Jalapeno?\n" +
    "  </ion-checkbox>\n" +
    "  <ion-checkbox ng-model=\"pizza.anchovies\">\n" +
    "    Anchovies?\n" +
    "  </ion-checkbox>\n" +
    "</ion-content>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/collectionRepeat/contacts/contacts.html',
    "---\n" +
    "name: contacts\n" +
    "component: collectionRepeat\n" +
    "---\n" +
    "\n" +
    "<div ng-controller=\"MainCtrl\">\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">3000 Contacts B</h1>\n" +
    "    <button class=\"button clear\" ng-click=\"data.search = ''\">Clear</button>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-header-bar class=\"bar-subheader item-input-inset\">\n" +
    "    <label class=\"item-input-wrapper\">\n" +
    "      <input type=\"text\" ng-model=\"data.search\" placeholder=\"Filter Contacts...\" type=\"search\">\n" +
    "    </label>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content direction=\"y\">\n" +
    "    <ion-list>\n" +
    "      <div collection-repeat=\"item in contacts | filter:data.search | orderBy:'last_name' | ionLetterDividers:'last_name'\"\n" +
    "        divider-collection-repeat\n" +
    "        force-refresh-images>\n" +
    "        <ion-item>\n" +
    "          <h2>{{item.first_name+' '+item.last_name}}</h2>\n" +
    "          <p>{{$index}}</p>\n" +
    "        </ion-item>\n" +
    "      </ion-item>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</div>\n" +
    "<script>\n" +
    "</script>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/footer/simple/index.html',
    "---\n" +
    "name: simple\n" +
    "component: ionFooterBar\n" +
    "---\n" +
    "<div ng-controller=\"FooterBarSimpleCtrl\">\n" +
    "  <ion-footer-bar class=\"bar-assertive\"\n" +
    "      ng-class=\"{'bar-subfooter': data.isSubfooter}\"\n" +
    "      ng-show=\"data.isShown\">\n" +
    "    <h1 class=\"title\">Footer</h1>\n" +
    "  </ion-footer-bar>\n" +
    "  <ion-content>\n" +
    "    <ion-toggle ng-model=\"data.isSubfooter\">\n" +
    "      Make it a Subfooter?\n" +
    "    </ion-toggle>\n" +
    "    <ion-toggle ng-model=\"data.isShown\">\n" +
    "      Show it?\n" +
    "    </ion-toggle>\n" +
    "    <div class=\"list\">\n" +
    "      <div class=\"item\" ng-repeat=\"item in items\">\n" +
    "        {{item}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</div>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/header/simple/index.html',
    "---\n" +
    "name: simple\n" +
    "component: ionHeaderBar\n" +
    "---\n" +
    "<div ng-controller=\"HeaderBarSimpleCtrl\">\n" +
    "  <ion-header-bar class=\"bar-positive\"\n" +
    "    ng-class=\"{'bar-subheader': data.isSubheader}\"\n" +
    "    ng-show=\"data.isShown\">\n" +
    "    <h1 class=\"title\">Tap Me to Scroll Top</h1>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content>\n" +
    "    <ion-toggle ng-model=\"data.isSubheader\">\n" +
    "      Make it a Subheader?\n" +
    "    </ion-toggle>\n" +
    "    <ion-toggle ng-model=\"data.isShown\">\n" +
    "      Show it?\n" +
    "    </ion-toggle>\n" +
    "    <div class=\"list\">\n" +
    "      <div class=\"item\" ng-repeat=\"item in items\">\n" +
    "        {{item}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</div>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/infiniteScroll/forever/index.html',
    "---\n" +
    "name: forever\n" +
    "component: ionInfiniteScroll\n" +
    "---\n" +
    "<ion-header-bar>\n" +
    "  <h1 class=\"title\">Scroll Down to Load More</h1>\n" +
    "</ion-header-bar>\n" +
    "<ion-content ng-controller=\"ForeverCtrl\">\n" +
    "  <div class=\"list\">\n" +
    "    <div class=\"item\" ng-repeat=\"item in items\">\n" +
    "      {{item}}\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <ion-infinite-scroll on-infinite=\"loadMoreItems()\" icon=\"ion-loading-c\">\n" +
    "  </ion-infinite-scroll>\n" +
    "</ion-content>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/list/animated/index.html',
    "---\n" +
    "name: animated\n" +
    "component: ionList\n" +
    "---\n" +
    "<div ng-controller=\"AnimatedListCtrl\">\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Animated List</h1>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content>\n" +
    "    <ion-list show-delete=\"showDelete\">\n" +
    "\n" +
    "      <ion-item class=\"animated-item\"\n" +
    "                ng-repeat=\"item in items\">\n" +
    "        {{item}}\n" +
    "        <div class=\"item-note\">\n" +
    "          <a class=\"button button-small\"\n" +
    "             ng-click=\"addItem($index)\">\n" +
    "             Add\n" +
    "          </a>\n" +
    "          <a class=\"button button-small\"\n" +
    "             ng-click=\"items.splice($index, 1)\">\n" +
    "            Remove\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </ion-item>\n" +
    "\n" +
    "    </ion-list>\n" +
    "  </ion-content>\n" +
    "</div>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/list/reorderDelete/index.html',
    "---\n" +
    "name: reorderDelete\n" +
    "component: ionList\n" +
    "---\n" +
    "<div ng-controller=\"ListCtrl\">\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <a class=\"button\" ng-click=\"toggleDelete()\">\n" +
    "      Delete\n" +
    "    </a>\n" +
    "    <h1 class=\"title\">List</h1>\n" +
    "    <a class=\"button\" ng-click=\"toggleReorder()\">\n" +
    "      Reorder\n" +
    "    </a>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content>\n" +
    "    <ion-list show-delete=\"data.showDelete\"\n" +
    "              show-reorder=\"data.showReorder\">\n" +
    "      <ion-item ng-repeat=\"item in items\"\n" +
    "                class=\"item-thumbnail-left\">\n" +
    "\n" +
    "        <img src=\"\" style=\"background:black; width:80px; height:80px;\">\n" +
    "        <h2>Item {{item}}</h2>\n" +
    "        <p>Here's an item description.</p>\n" +
    "        <ion-option-button class=\"button-positive\"\n" +
    "                           ng-click=\"share(item)\">\n" +
    "          Share\n" +
    "        </ion-option-button>\n" +
    "        <ion-option-button class=\"button-info\"\n" +
    "                           ng-click=\"edit(item)\">\n" +
    "          Edit\n" +
    "        </ion-option-button>\n" +
    "        <ion-delete-button class=\"ion-minus-circled\"\n" +
    "                           ng-click=\"items.splice($index, 1)\">\n" +
    "        </ion-delete-button>\n" +
    "        <ion-reorder-button class=\"ion-navicon\"\n" +
    "                            on-reorder=\"reorderItem(item, $fromIndex, $toIndex)\">\n" +
    "        </ion-reorder-button>\n" +
    "\n" +
    "      </ion-item>\n" +
    "    </ion-list>\n" +
    "  </ion-content>\n" +
    "</div>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/radio/chooseOne/index.html',
    "---\n" +
    "name: chooseOne\n" +
    "component: ionRadio\n" +
    "---\n" +
    "<ion-header-bar class=\"bar-positive\">\n" +
    "  <h1 class=\"title\">Radios</h1>\n" +
    "</ion-header-bar>\n" +
    "<ion-content ng-controller=\"ChooseOneCtrl\">\n" +
    "  <h1>\n" +
    "    Your Choice: <span class=\"assertive\">{{choice}}</span> \n" +
    "  </h1>\n" +
    "  <ion-radio ng-model=\"choice\" value=\"one\">One</ion-radio>\n" +
    "  <ion-radio ng-model=\"choice\" value=\"two\">Two</ion-radio>\n" +
    "  <ion-radio ng-model=\"choice\" ng-value=\"'three'\">Three</ion-radio>\n" +
    "  <ion-radio ng-model=\"choice\" ng-value=\"'four'\">Four</ion-radio>\n" +
    "  <ion-radio ng-model=\"choice\" value=\"five\">Five</ion-radio>\n" +
    "</ion-content>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/refresher/refreshList/index.html',
    "---\n" +
    "name: refreshList\n" +
    "component: ionRefresher\n" +
    "---\n" +
    "<ion-header-bar class=\"bar-positive\">\n" +
    "  <h1 class=\"title\">Pull to Refresh</h1>\n" +
    "</ion-header-bar>\n" +
    "\n" +
    "<ion-content ng-controller=\"RefresherCtrl\">\n" +
    "\n" +
    "  <ion-refresher on-refresh=\"doRefresh()\"\n" +
    "                 pulling-text=\"Pull...\"\n" +
    "                 refreshing-text=\"Refreshing!\"\n" +
    "                 refreshing-icon=\"ion-loading-c\">\n" +
    "  </ion-refresher>\n" +
    "\n" +
    "  <ion-list>\n" +
    "    <ion-item ng-repeat=\"item in items\">{{item}}</ion-item>\n" +
    "  </ion-list>\n" +
    "\n" +
    "</ion-content>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/sideMenus/navWithMenu/index.html',
    "---\n" +
    "name: navWithMenu\n" +
    "component: ionSideMenus\n" +
    "---\n" +
    "<ion-nav-view>\n" +
    "</ion-nav-view>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"templates/menu.html\">\n" +
    "  <ion-side-menus>\n" +
    "\n" +
    "    <ion-pane ion-side-menu-content>\n" +
    "      <ion-nav-bar class=\"bar-stable nav-title-slide-ios7\">\n" +
    "        <ion-nav-back-button class=\"button-clear\"><i class=\"icon ion-chevron-left\"></i> Back</ion-nav-back-button>\n" +
    "      </ion-nav-bar>\n" +
    "      <ion-nav-view name=\"menuContent\" animation=\"slide-left-right\"></ion-nav-view>\n" +
    "    </ion-pane>\n" +
    "\n" +
    "    <ion-side-menu side=\"left\">\n" +
    "      <header class=\"bar bar-header bar-stable\">\n" +
    "        <h1 class=\"title\">Left</h1>\n" +
    "      </header>\n" +
    "      <ion-content class=\"has-header\" scroll=\"false\">\n" +
    "        <ion-list>\n" +
    "          <ion-item nav-clear menu-close href=\"#/app/search\">\n" +
    "            Search\n" +
    "          </ion-item>\n" +
    "          <ion-item nav-clear menu-close href=\"#/app/browse\">\n" +
    "            Browse\n" +
    "          </ion-item>\n" +
    "          <ion-item nav-clear menu-close href=\"#/app/playlists\">\n" +
    "            Playlists\n" +
    "          </ion-item>\n" +
    "        </ion-list>\n" +
    "      </ion-content>\n" +
    "    </ion-side-menu>\n" +
    "\n" +
    "  </ion-side-menus>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"templates/browse.html\">\n" +
    "  <ion-view title=\"Browse\">\n" +
    "    <ion-nav-buttons side=\"left\">\n" +
    "      <button menu-toggle=\"left\"class=\"button button-icon icon ion-navicon\"></button>\n" +
    "    </ion-nav-buttons>\n" +
    "    <ion-content class=\"has-header\">\n" +
    "      <h1>Browse</h1>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"templates/playlist.html\">\n" +
    "  <ion-view title=\"Playlist\">\n" +
    "    <ion-content class=\"has-header\">\n" +
    "      <h1>Playlist</h1>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"templates/playlists.html\">\n" +
    "  <ion-view title=\"Playlists\">\n" +
    "    <ion-nav-buttons side=\"left\">\n" +
    "      <button menu-toggle=\"left\" class=\"button button-icon icon ion-navicon\"></button>\n" +
    "    </ion-nav-buttons>\n" +
    "    <ion-content class=\"has-header\">\n" +
    "      <ion-list>\n" +
    "        <ion-item ng-repeat=\"playlist in playlists\" href=\"#/app/playlists/{{playlist.id}}\">\n" +
    "          {{playlist.title}}\n" +
    "        </ion-item>\n" +
    "      </ion-list>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"templates/search.html\">\n" +
    "  <ion-view title=\"Search\">\n" +
    "    <ion-nav-buttons side=\"left\">\n" +
    "      <button menu-toggle=\"left\" class=\"button button-icon icon ion-navicon\"></button>\n" +
    "    </ion-nav-buttons>\n" +
    "    <ion-content class=\"has-header\">\n" +
    "      <h1>Search</h1>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/sideMenus/simple/index.html',
    "---\n" +
    "name: simple\n" +
    "component: ionSideMenus\n" +
    "---\n" +
    "<ion-side-menus ng-controller=\"SideMenusSimpleCtrl\">\n" +
    "\n" +
    "  <ion-side-menu-content>\n" +
    "    <ion-header-bar class=\"bar-positive\">\n" +
    "      <div class=\"buttons\">\n" +
    "        <div class=\"button button-clear\" ng-click=\"toggleLeft()\">\n" +
    "          <i class=\"icon ion-navicon\"></i>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <h1 class=\"title\">\n" +
    "        Side\n" +
    "      </h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"padding\">\n" +
    "      <p>Slide the content or press the button on the header to open a side menu.</p>\n" +
    "    </ion-content>\n" +
    "  </ion-side-menu-content>\n" +
    "\n" +
    "  <ion-side-menu side=\"left\">\n" +
    "    <ion-header-bar class=\"bar-positive\">\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "      <a class=\"item\" ng-click=\"toggleLeft()\">\n" +
    "        Close Menu\n" +
    "      </a>\n" +
    "    </ion-content>\n" +
    "  </ion-side-menu>\n" +
    "\n" +
    "</ion-side-menus>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/slideBox/appIntro/index.html',
    "---\n" +
    "name: appIntro\n" +
    "component: ionSlideBox\n" +
    "---\n" +
    "<ion-nav-bar class=\"nav-title-slide-ios7 bar-light\">\n" +
    "  <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n" +
    "  </ion-nav-back-button>\n" +
    "</ion-nav-bar>\n" +
    "\n" +
    "<ion-nav-view animation=\"slide-left-right-ios7\"></ion-nav-view>\n" +
    "\n" +
    "<script id=\"intro.html\" type=\"text/ng-template\">\n" +
    "  <ion-view>\n" +
    "\n" +
    "    <ion-nav-buttons side=\"left\">\n" +
    "      <button class=\"button button-positive button-clear no-animation\"\n" +
    "              ng-click=\"startApp()\" ng-if=\"!slideIndex\">\n" +
    "        Skip Intro\n" +
    "      </button>\n" +
    "      <button class=\"button button-positive button-clear no-animation\"\n" +
    "              ng-click=\"previous()\" ng-if=\"slideIndex > 0\">\n" +
    "        Previous Slide\n" +
    "      </button>\n" +
    "    </ion-nav-buttons>\n" +
    "    <ion-nav-buttons side=\"right\">\n" +
    "      <button class=\"button button-positive button-clear no-animation\"\n" +
    "              ng-click=\"next()\" ng-if=\"slideIndex != 2\">\n" +
    "        Next\n" +
    "      </button>\n" +
    "      <button class=\"button button-positive button-clear no-animation\"\n" +
    "              ng-click=\"startApp()\" ng-if=\"slideIndex == 2\">\n" +
    "        Start using MyApp\n" +
    "      </button>\n" +
    "    </ion-nav-buttons>\n" +
    "\n" +
    "    <ion-slide-box on-slide-changed=\"slideChanged($index)\">\n" +
    "      <ion-slide>\n" +
    "        <h3>Thank you for choosing the Awesome App!</h3>\n" +
    "        <div id=\"logo\">\n" +
    "          <img src=\"\" style=\"background: black; width: 152px; height: 152px;\">\n" +
    "        </div>\n" +
    "        <p>\n" +
    "          We've worked super hard to make you happy.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          But if you are angry, too bad.\n" +
    "        </p>\n" +
    "      </ion-slide>\n" +
    "      <ion-slide>\n" +
    "        <h3>Using Awesome</h3>\n" +
    "\n" +
    "        <div id=\"list\">\n" +
    "          <h5>Just three steps:</h5>\n" +
    "          <ol>\n" +
    "            <li>Be awesome</li>\n" +
    "            <li>Stay awesome</li>\n" +
    "            <li>There is no step 3</li>\n" +
    "          </ol>\n" +
    "        </div>\n" +
    "      </ion-slide>\n" +
    "      <ion-slide>\n" +
    "        <h3>Any questions?</h3>\n" +
    "        <p>\n" +
    "          Too bad!\n" +
    "        </p>\n" +
    "      </ion-slide>\n" +
    "    </ion-slide-box>\n" +
    "\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script id=\"main.html\" type=\"text/ng-template\">\n" +
    "  <ion-view hide-back-button=\"true\" title=\"Awesome\">\n" +
    "    <ion-content padding=\"true\">\n" +
    "      <h1>Main app here</h1>\n" +
    "      <button class=\"button\" ng-click=\"toIntro()\">Do Tutorial Again</button>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/tabs/tabsAndNav/index.html',
    "---\n" +
    "name: tabsAndNav\n" +
    "component: ionTabs\n" +
    "---\n" +
    "<ion-nav-bar class=\"nav-title-slide-ios7 bar-positive\">\n" +
    "  <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n" +
    "  </ion-nav-back-button>\n" +
    "</ion-nav-bar>\n" +
    "\n" +
    "<ion-nav-view animation=\"slide-left-right\"></ion-nav-view>\n" +
    "\n" +
    "<script id=\"tabs.html\" type=\"text/ng-template\">\n" +
    "  <ion-tabs class=\"tabs-icon-top tabs-positive\">\n" +
    "\n" +
    "    <ion-tab title=\"Home\" icon=\"ion-home\" href=\"#/tab/home\">\n" +
    "      <ion-nav-view name=\"home-tab\"></ion-nav-view>\n" +
    "    </ion-tab>\n" +
    "\n" +
    "    <ion-tab title=\"About\" icon=\"ion-ios7-information\" href=\"#/tab/about\">\n" +
    "      <ion-nav-view name=\"about-tab\"></ion-nav-view>\n" +
    "    </ion-tab>\n" +
    "\n" +
    "    <ion-tab title=\"Contact\" icon=\"ion-ios7-world\" ui-sref=\"tabs.contact\">\n" +
    "      <ion-nav-view name=\"contact-tab\"></ion-nav-view>\n" +
    "    </ion-tab>\n" +
    "\n" +
    "  </ion-tabs>\n" +
    "</script>\n" +
    "\n" +
    "<script id=\"home.html\" type=\"text/ng-template\">\n" +
    "  <ion-view title=\"Home\">\n" +
    "    <ion-content class=\"padding\">\n" +
    "      <p>Example of Ionic tabs. Navigate to each tab, and\n" +
    "      navigate to child views of each tab and notice how\n" +
    "      each tab has its own navigation history.</p>\n" +
    "      <p>\n" +
    "        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts\">Scientific Facts</a>\n" +
    "      </p>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script id=\"facts.html\" type=\"text/ng-template\">\n" +
    "  <ion-view title=\"Facts\" class=\"padding\">\n" +
    "    <ion-content>\n" +
    "      <p>Banging your head against a wall uses 150 calories an hour.</p>\n" +
    "      <p>Dogs have four toes on their hind feet, and five on their front feet.</p>\n" +
    "      <p>The ant can lift 50 times its own weight, can pull 30 times its own weight and always falls over on its right side when intoxicated.</p>\n" +
    "      <p>A cockroach will live nine days without it's head, before it starves to death.</p>\n" +
    "      <p>Polar bears are left handed.</p>\n" +
    "      <p>\n" +
    "        <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n" +
    "        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts2\">More Facts</a>\n" +
    "      </p>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script id=\"facts2.html\" type=\"text/ng-template\">\n" +
    "  <ion-view title=\"Also Factual\">\n" +
    "    <ion-content class=\"padding\">\n" +
    "      <p>111,111,111 x 111,111,111 = 12,345,678,987,654,321</p>\n" +
    "      <p>1 in every 4 Americans has appeared on T.V.</p>\n" +
    "      <p>11% of the world is left-handed.</p>\n" +
    "      <p>1 in 8 Americans has worked at a McDonalds restaurant.</p>\n" +
    "      <p>$283,200 is the absolute highest amount of money you can win on Jeopardy.</p>\n" +
    "      <p>101 Dalmatians, Peter Pan, Lady and the Tramp, and Mulan are the only Disney cartoons where both parents are present and don't die throughout the movie.</p>\n" +
    "      <p>\n" +
    "        <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n" +
    "        <a class=\"button icon ion-chevron-left\" href=\"#/tab/facts\"> Scientific Facts</a>\n" +
    "      </p>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script id=\"about.html\" type=\"text/ng-template\">\n" +
    "  <ion-view title=\"About\">\n" +
    "    <ion-content class=\"padding\">\n" +
    "      <h3>Create hybrid mobile apps with the web technologies you love.</h3>\n" +
    "      <p>Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components for building highly interactive apps.</p>\n" +
    "      <p>Built with Sass and optimized for AngularJS.</p>\n" +
    "      <p>\n" +
    "        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/navstack\">Tabs Nav Stack</a>\n" +
    "      </p>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script id=\"nav-stack.html\" type=\"text/ng-template\">\n" +
    "  <ion-view title=\"Tab Nav Stack\">\n" +
    "    <ion-content class=\"padding\">\n" +
    "\n" +
    "      <p>Almost every mobile application has some form of tab bar interface.</p>\n" +
    "\n" +
    "      <p>Ionic has a built-in <code>ion-tabs</code> directive that we can use in order to build our tabbed interface. Create the <code>ion-tabs</code> directive and we can start filling it with tabs. The directive to create a tab is just the <code>ion-tab</code> directive. This takes a title, and this specifies what the title of our tab will be. </p>\n" +
    "\n" +
    "      <p>When we save this, we now have a tab that pops up with the text of “Home tab”.</p>\n" +
    "\n" +
    "      <p>Let’s add a second tab, because a single-tabbed app is pretty boring. I’m just going to call this one “About”. I’m going to create some equally interesting content.</p>\n" +
    "\n" +
    "      <p>We can now swap between our tabs, and see that things happen! We may want to change the color scheme of our tabs. Ionic ships with several colors that are detailed in the documentation in the notes, but if we want to update that, we can set a class of <code>ion-tabs</code>.</p>\n" +
    "\n" +
    "      <p>Now, if we look in the documentation, the colors are unprefixed. If we want the blue color, we use the <code>positive</code> class. However, in the case of tabs, we want those to be able to be sub-customizable. For this, we have to prefix this class with ‘tabs-‘. Saving, we now see the nice color.</p>\n" +
    "\n" +
    "      <p>Let’s add a header. This can be added with the <code>ion-header-bar</code> directive. Inside, we can set what we want the title to be. Let’s set a color on it. This is interesting, but what if we want a different title for each section of the application?</p>\n" +
    "\n" +
    "      <p>You can set a navigation system up, which is detailed in more advanced videos and formulas. For the sake of simplicity in this video, we will create an <code>ion-header-bar</code> in each tab of our app. Copy the header bar, change the titles, and save. We now have updating headers across our tabs!</p>\n" +
    "\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n" +
    "\n" +
    "<script id=\"contact.html\" type=\"text/ng-template\">\n" +
    "  <ion-view title=\"Contact\">\n" +
    "    <ion-content>\n" +
    "      <p>@IonicFramework</p>\n" +
    "      <p>@DriftyCo</p>\n" +
    "    </ion-content>\n" +
    "  </ion-view>\n" +
    "</script>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/textInput/floatingLabel/index.html',
    "---\n" +
    "name: floatingLabel\n" +
    "component: itemFloatingLabel\n" +
    "---\n" +
    "\n" +
    "<ion-header-bar class=\"bar-positive\">\n" +
    "  <h1 class=\"title\">\n" +
    "    Text Input: Floating Label\n" +
    "  </h1>\n" +
    "</ion-header-bar>\n" +
    "\n" +
    "<ion-content ng-controller=\"AppCtrl\">\n" +
    "\n" +
    "  <div class=\"list\">\n" +
    "    <label class=\"item item-input item-floating-label\">\n" +
    "      <span class=\"input-label\">Name</span>\n" +
    "      <input type=\"text\" placeholder=\"Name\">\n" +
    "    </label>\n" +
    "    <label class=\"item item-input item-floating-label\">\n" +
    "      <span class=\"input-label\">Profession</span>\n" +
    "      <input type=\"text\" placeholder=\"Profession\">\n" +
    "    </label>\n" +
    "    <label class=\"item item-input item-floating-label\">\n" +
    "      <span class=\"input-label\">Favorite Song</span>\n" +
    "      <textarea placeholder=\"Favorite Song\" ng-model=\"favSong\"></textarea>\n" +
    "    </label>\n" +
    "  </div>\n" +
    "\n" +
    "</ion-content>\n"
  );


  $templateCache.put('lib/ionic/demos/directive/toggle/simple/index.html',
    "---\n" +
    "name: simple\n" +
    "component: ionToggle\n" +
    "---\n" +
    "\n" +
    "<ion-header-bar class=\"bar-positive\">\n" +
    "  <h1 class=\"title\">\n" +
    "    Toggle: Simple Usage\n" +
    "  </h1>\n" +
    "</ion-header-bar>\n" +
    "<ion-content ng-controller=\"MainCtrl\" class=\"padding\">\n" +
    "  <h4>Your pizza has {{toppings()}}!</h4>\n" +
    "  <ion-toggle ng-model=\"pizza.pepperoni\">\n" +
    "    Pepperoni?\n" +
    "  </ion-toggle>\n" +
    "  <ion-toggle ng-model=\"pizza.sausage\" toggle-class=\"toggle-energized\">\n" +
    "    Sausage?\n" +
    "  </ion-toggle>\n" +
    "  <ion-toggle ng-model=\"pizza.jalapenos\" toggle-class=\"toggle-calm\">\n" +
    "    Jalapeno?\n" +
    "  </ion-toggle>\n" +
    "  <ion-toggle ng-model=\"pizza.anchovies\" toggle-class=\"toggle-royal\">\n" +
    "    Anchovies?\n" +
    "  </ion-toggle>\n" +
    "</ion-content>\n"
  );


  $templateCache.put('lib/ionic/demos/old/actionsheet/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Actionsheet</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script type=\"text/javascript\" charset=\"utf-8\" src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"AppCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Action Sheet</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content class=\"has-header padding\">\n" +
    "    <button class=\"button\" ng-click=\"showActionsheet()\">\n" +
    "      Show Actionsheet\n" +
    "    </button>\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/app-intro-walkthrough/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic App</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body animation=\"slide-left-right-ios7\">\n" +
    "\n" +
    "  <ion-nav-bar class=\"nav-title-slide-ios7 bar-light\">\n" +
    "    <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n" +
    "    </ion-nav-back-button>\n" +
    "  </ion-nav-bar>\n" +
    "\n" +
    "  <ion-nav-view></ion-nav-view>\n" +
    "\n" +
    "  <script id=\"intro.html\" type=\"text/ng-template\">\n" +
    "    <ion-view>\n" +
    "\n" +
    "      <ion-nav-buttons side=\"left\">\n" +
    "        <button class=\"button button-positive button-clear no-animation\"\n" +
    "                ng-click=\"startApp()\" ng-if=\"!slideIndex\">\n" +
    "          Skip Intro\n" +
    "        </button>\n" +
    "        <button class=\"button button-positive button-clear no-animation\"\n" +
    "                ng-click=\"previous()\" ng-if=\"slideIndex > 0\">\n" +
    "          Previous Slide\n" +
    "        </button>\n" +
    "      </ion-nav-buttons>\n" +
    "      <ion-nav-buttons side=\"right\">\n" +
    "        <button class=\"button button-positive button-clear no-animation\"\n" +
    "                ng-click=\"next()\" ng-if=\"slideIndex != 2\">\n" +
    "          Next\n" +
    "        </button>\n" +
    "        <button class=\"button button-positive button-clear no-animation\"\n" +
    "                ng-click=\"startApp()\" ng-if=\"slideIndex == 2\">\n" +
    "          Start using MyApp\n" +
    "        </button>\n" +
    "      </ion-nav-buttons>\n" +
    "\n" +
    "      <ion-slide-box on-slide-changed=\"slideChanged(index)\">\n" +
    "        <ion-slide>\n" +
    "          <h3>Thank you for choosing the Awesome App!</h3>\n" +
    "          <div id=\"logo\">\n" +
    "            <img src=\"http://code.ionicframework.com/assets/img/app_icon.png\">\n" +
    "          </div>\n" +
    "          <p>\n" +
    "            We've worked super hard to make you happy.\n" +
    "          </p>\n" +
    "          <p>\n" +
    "            But if you are angry, too bad.\n" +
    "          </p>\n" +
    "        </ion-slide>\n" +
    "        <ion-slide>\n" +
    "          <h3>Using Awesome</h3>\n" +
    "\n" +
    "          <div id=\"list\">\n" +
    "            <h5>Just three steps:</h5>\n" +
    "            <ol>\n" +
    "              <li>Be awesome</li>\n" +
    "              <li>Stay awesome</li>\n" +
    "              <li>There is no step 3</li>\n" +
    "            </ol>\n" +
    "          </div>\n" +
    "        </ion-slide>\n" +
    "        <ion-slide>\n" +
    "          <h3>Any questions?</h3>\n" +
    "          <p>\n" +
    "            Too bad!\n" +
    "          </p>\n" +
    "        </ion-slide>\n" +
    "      </ion-slide-box>\n" +
    "\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"main.html\" type=\"text/ng-template\">\n" +
    "    <ion-view hide-back-button=\"true\" title=\"Awesome\">\n" +
    "      <ion-content padding=\"true\">\n" +
    "        <h1>Main app here</h1>\n" +
    "        <button class=\"button\" ng-click=\"toIntro()\">Do Tutorial Again</button>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/checkbox/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Checkboxes</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MainCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Checkboxes</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content>\n" +
    "\n" +
    "    <div class=\"list\">\n" +
    "\n" +
    "      <ion-checkbox ng-repeat=\"item in devList\" ng-model=\"item.checked\" ng-checked=\"item.checked\">\n" +
    "        {{ item.text }}\n" +
    "      </ion-checkbox>\n" +
    "\n" +
    "      <div class=\"item\">\n" +
    "        <pre ng-bind=\"devList | json\"></pre>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"item item-divider\">\n" +
    "        Notifications\n" +
    "      </div>\n" +
    "\n" +
    "      <ion-checkbox ng-model=\"pushNotification.checked\" ng-change=\"pushNotificationChange()\">\n" +
    "        Push Notifications\n" +
    "      </ion-checkbox>\n" +
    "\n" +
    "      <div class=\"item\">\n" +
    "        <pre ng-bind=\"pushNotification | json\"></pre>\n" +
    "      </div>\n" +
    "\n" +
    "      <ion-checkbox ng-model=\"emailNotification\" ng-true-value=\"Subscribed\" ng-false-value=\"Unubscribed\">\n" +
    "        Newsletter\n" +
    "      </ion-checkbox>\n" +
    "\n" +
    "      <div class=\"item\">\n" +
    "        <pre ng-bind=\"emailNotification | json\"></pre>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/collection-repeat/index.html',
    "<html ng-app=\"contactsApp\">\n" +
    "<head>\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Collection-Repeat: Early Preview</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.css\" rel=\"stylesheet\">\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.js\"></script>\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "  <script src=\"script.js\"></script>\n" +
    "  <script src=\"contacts.js\"></script>\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MainCtrl\">\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">3000 Contacts</h1>\n" +
    "    <div class=\"button\" ng-click=\"scrollBottom()\">\n" +
    "      Scroll Bottom\n" +
    "    </div>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-header-bar class=\"bar-light bar-subheader\">\n" +
    "    <input type=\"search\"\n" +
    "      placeholder=\"Filter contacts...\"\n" +
    "      ng-model=\"search\"\n" +
    "      ng-change=\"scrollTop()\">\n" +
    "    <button ng-if=\"search.length\"\n" +
    "      class=\"button button-icon ion-android-close input-button\"\n" +
    "      ng-click=\"clearSearch()\">\n" +
    "    </button>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content>\n" +
    "    <div class=\"list\">\n" +
    "      <a class=\"item my-item\"\n" +
    "        collection-repeat=\"item in getContacts()\"\n" +
    "        collection-item-height=\"getItemHeight(item)\"\n" +
    "        collection-item-width=\"100 + '%'\"\n" +
    "        ng-href=\"https://www.google.com/#q={{item.first_name + '+' + item.last_name}}\"\n" +
    "        ng-style=\"{'line-height': getItemHeight(item) + 'px'}\"\n" +
    "        ng-class=\"{'item-divider': item.isLetter}\">\n" +
    "        <img ng-if=\"!item.isLetter\" ng-src=\"http://placekitten.com/60/{{55 + ($index % 10)}}\">\n" +
    "        {{item.letter || (item.first_name+' '+item.last_name)}}\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/flickr-search-example/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Flickr</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"http://code.angularjs.org/1.2.12/angular-resource.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"FlickrCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-dark\">\n" +
    "    <h1 class=\"title\">Flickr Search</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <div id=\"search-bar\">\n" +
    "    <div class=\"item item-input-inset\">\n" +
    "      <label class=\"item-input-wrapper\" id=\"search-input\">\n" +
    "        <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "        <input type=\"text\" placeholder=\"Search\" ng-model=\"query\" ng-change=\"search()\">\n" +
    "      </label>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <ion-content id=\"content\" push-search>\n" +
    "    <div id=\"photos\" class=\"clearfix\">\n" +
    "      <div class=\"photo\" ng-repeat=\"photo in photos.items\">\n" +
    "        <img ng-src=\"{{ photo.media.m }}\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/frosted-glass-effect/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"starter\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Frosted Glass</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"http://code.ionicframework.com/contrib/ionic-contrib-frosted-glass/ionic.contrib.frostedGlass.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"http://code.ionicframework.com/contrib/ionic-contrib-frosted-glass/ionic.contrib.frostedGlass.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body>\n" +
    "\n" +
    "  <ion-pane ng-controller=\"PageCtrl\">\n" +
    "    <header frosted-bar class=\"bar bar-header bar-frosted\">\n" +
    "      <h1 class=\"title\">Blurred!</h1>\n" +
    "    </header>\n" +
    "    <ion-content padding=\"true\" class=\"has-header\" start-y=\"120\">\n" +
    "      <ol class=\"messages\">\n" +
    "        <li ng-repeat=\"message in messages\" ng-bind-html=\"message.content\"></li>\n" +
    "      </ol>\n" +
    "    </ion-content>\n" +
    "    <ion-footer-bar class=\"bar-frosted\">\n" +
    "      <button class=\"button button-clear button-positive\" ng-click=\"add()\">Add Message</button>\n" +
    "    </ion-footer-bar>\n" +
    "  </ion-pane>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/google-maps/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Google Map</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es&sensor=true\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MapCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-dark\">\n" +
    "    <h1 class=\"title\">Map</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content scroll=\"false\">\n" +
    "    <div id=\"map\"></div>\n" +
    "  </ion-content>\n" +
    "\n" +
    "  <ion-footer-bar class=\"bar-dark\">\n" +
    "    <a ng-click=\"centerOnMe()\" class=\"button button-icon icon ion-navigate\">Find Me</a>\n" +
    "  </ion-footer-bar>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/lists/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\">\n" +
    "\n" +
    "  <title>Ionic List</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MyCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <div class=\"buttons\">\n" +
    "      <button class=\"button button-icon icon ion-ios7-minus-outline\" ng-click=\"data.showDelete = !data.showDelete\"></button>\n" +
    "    </div>\n" +
    "    <h1 class=\"title\">Ionic Delete/Option Buttons</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content>\n" +
    "\n" +
    "    <ion-list show-delete=\"data.showDelete\" on-delete=\"onItemDelete(item)\" option-buttons=\"itemButtons\">\n" +
    "\n" +
    "      <ion-item ng-repeat=\"item in items\" item=\"item\" href=\"#/item/{{item.id}}\">\n" +
    "        Item {{ item.id }}\n" +
    "      </ion-item>\n" +
    "\n" +
    "    </ion-list>\n" +
    "\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/loading-bar/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Loading Bar</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MainCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Hello!</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <div class=\"bar bar-loading bar-assertive\" ng-if=\"data.isLoading\">\n" +
    "    Loading...\n" +
    "  </div>\n" +
    "\n" +
    "  <ion-content ng-class=\"{'has-loading': data.isLoading}\">\n" +
    "    <ion-toggle ng-model=\"data.isLoading\">Toggle me to toggle loading!</ion-toggle>\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/modal/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Modal</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"AppCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Contacts</h1>\n" +
    "    <div class=\"buttons\">\n" +
    "      <button class=\"button button-icon ion-compose\" ng-click=\"modal.show()\">\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content>\n" +
    "    <ion-list>\n" +
    "      <ion-item ng-repeat=\"contact in contacts\">\n" +
    "        {{contact.name}}\n" +
    "      </ion-item>\n" +
    "    </ion-list>\n" +
    "  </ion-content>\n" +
    "\n" +
    "  <script id=\"modal.html\" type=\"text/ng-template\">\n" +
    "    <div class=\"modal\" ng-controller=\"ModalCtrl\">\n" +
    "      <ion-header-bar class=\"bar bar-header bar-positive\">\n" +
    "        <h1 class=\"title\">New Contact</h1>\n" +
    "        <button class=\"button button-clear button-primary\" ng-click=\"modal.hide()\">Cancel</button>\n" +
    "      </ion-header-bar>\n" +
    "      <ion-content>\n" +
    "        <div class=\"padding\">\n" +
    "          <div class=\"list\">\n" +
    "            <label class=\"item item-input\">\n" +
    "              <span class=\"input-label\">First Name</span>\n" +
    "              <input ng-model=\"newUser.firstName\" type=\"text\">\n" +
    "            </label>\n" +
    "            <label class=\"item item-input\">\n" +
    "              <span class=\"input-label\">Last Name</span>\n" +
    "              <input ng-model=\"newUser.lastName\" type=\"text\">\n" +
    "            </label>\n" +
    "            <label class=\"item item-input\">\n" +
    "              <span class=\"input-label\">Email</span>\n" +
    "              <input ng-model=\"newUser.email\" type=\"text\">\n" +
    "            </label>\n" +
    "            <button class=\"button button-full button-positive\" ng-click=\"createContact()\">Create</button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </ion-content>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/popup/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Popup</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"PopupCtrl\" class=\"padding\">\n" +
    "\n" +
    "  <button class=\"button button-dark\" ng-click=\"showPopup()\">Multiple</button>\n" +
    "  <button class=\"button button-primary\" ng-click=\"showConfirm()\">Confirm</button>\n" +
    "  <button class=\"button button-balanced\" ng-click=\"showPrompt()\">Prompt</button>\n" +
    "  <button class=\"button button-assertive\" ng-click=\"showPasswordPrompt()\">Password Prompt</button>\n" +
    "  <button class=\"button button-positive\" ng-click=\"showAlert()\">Alert</button>\n" +
    "\n" +
    "  <script id=\"popup-template.html\" type=\"text/ng-template\">\n" +
    "    < input ng - model = \"data.wifi\"\n" +
    "    type = \"text\"\n" +
    "    placeholder = \"Password\" >\n" +
    "  </script>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/pull-to-refresh/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Template</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MyCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Refresher</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content>\n" +
    "\n" +
    "    <ion-refresher on-refresh=\"doRefresh()\" pulling-text=\"Pull to refresh...\" refreshing-text=\"Refreshing!\" refreshing-icon=\"ion-loading-c\">\n" +
    "    </ion-refresher>\n" +
    "\n" +
    "    <ion-list>\n" +
    "      <ion-item ng-repeat=\"item in items\">{{item}}</ion-item>\n" +
    "    </ion-list>\n" +
    "\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/radio-buttons/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Radio Buttons</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MainCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Radio Buttons</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content>\n" +
    "\n" +
    "    <div class=\"list\">\n" +
    "\n" +
    "      <div class=\"item item-divider\">\n" +
    "        Clientside, Selected Value: {{ data.clientSide }}\n" +
    "      </div>\n" +
    "\n" +
    "      <ion-radio ng-repeat=\"item in clientSideList\" ng-value=\"item.value\" ng-model=\"data.clientSide\">\n" +
    "        {{ item.text }}\n" +
    "      </ion-radio>\n" +
    "\n" +
    "      <div class=\"item item-divider\">\n" +
    "        Serverside, Selected Value: {{ data.serverSide }}\n" +
    "      </div>\n" +
    "\n" +
    "      <ion-radio ng-repeat=\"item in serverSideList\" ng-value=\"item.value\" ng-model=\"data.serverSide\" ng-change=\"serverSideChange(item)\" name=\"server-side\">\n" +
    "        {{ item.text }}\n" +
    "      </ion-radio>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/shrinking-header/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Shrinking Header</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body>\n" +
    "\n" +
    "  <fake-statusbar></fake-statusbar>\n" +
    "\n" +
    "  <ion-pane>\n" +
    "\n" +
    "    <ion-header-bar class=\"bar-positive\">\n" +
    "      <div class=\"buttons\">\n" +
    "        <button class=\"button button-icon ion-navicon\"></button>\n" +
    "      </div>\n" +
    "      <h1 class=\"title\">Things</h1>\n" +
    "    </ion-header-bar>\n" +
    "\n" +
    "    <ion-content header-shrink scroll-event-interval=\"5\">\n" +
    "\n" +
    "      <div class=\"list card\">\n" +
    "\n" +
    "        <div class=\"item item-avatar\">\n" +
    "          <img src=\"http://ionicframework.com/img/docs/mcfly.jpg\">\n" +
    "          <h2>Marty McFly</h2>\n" +
    "          <p>November 05, 1955</p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"item item-body\">\n" +
    "          <img class=\"full-image\" src=\"http://ionicframework.com/img/docs/delorean.jpg\">\n" +
    "          <p>\n" +
    "            This is a \"Facebook\" styled Card. The header is created from a Thumbnail List item, the content is from a card-body consisting of an image and paragraph text. The footer consists of tabs, icons aligned left, within the card-footer.\n" +
    "          </p>\n" +
    "          <p>\n" +
    "            <a href=\"#\" class=\"subdued\">1 Like</a>\n" +
    "            <a href=\"#\" class=\"subdued\">5 Comments</a>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"item tabs tabs-secondary tabs-icon-left\">\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-thumbsup\"></i>\n" +
    "            Like\n" +
    "          </a>\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-chatbox\"></i>\n" +
    "            Comment\n" +
    "          </a>\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-share\"></i>\n" +
    "            Share\n" +
    "          </a>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "      <div class=\"list card\">\n" +
    "\n" +
    "        <div class=\"item item-avatar\">\n" +
    "          <img src=\"http://ionicframework.com/img/docs/mcfly.jpg\">\n" +
    "          <h2>Marty McFly</h2>\n" +
    "          <p>November 05, 1955</p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"item item-body\">\n" +
    "          <img class=\"full-image\" src=\"http://ionicframework.com/img/docs/delorean.jpg\">\n" +
    "          <p>\n" +
    "            This is a \"Facebook\" styled Card. The header is created from a Thumbnail List item, the content is from a card-body consisting of an image and paragraph text. The footer consists of tabs, icons aligned left, within the card-footer.\n" +
    "          </p>\n" +
    "          <p>\n" +
    "            <a href=\"#\" class=\"subdued\">1 Like</a>\n" +
    "            <a href=\"#\" class=\"subdued\">5 Comments</a>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"item tabs tabs-secondary tabs-icon-left\">\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-thumbsup\"></i>\n" +
    "            Like\n" +
    "          </a>\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-chatbox\"></i>\n" +
    "            Comment\n" +
    "          </a>\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-share\"></i>\n" +
    "            Share\n" +
    "          </a>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "      <div class=\"list card\">\n" +
    "\n" +
    "        <div class=\"item item-avatar\">\n" +
    "          <img src=\"http://ionicframework.com/img/docs/mcfly.jpg\">\n" +
    "          <h2>Marty McFly</h2>\n" +
    "          <p>November 05, 1955</p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"item item-body\">\n" +
    "          <img class=\"full-image\" src=\"http://ionicframework.com/img/docs/delorean.jpg\">\n" +
    "          <p>\n" +
    "            This is a \"Facebook\" styled Card. The header is created from a Thumbnail List item, the content is from a card-body consisting of an image and paragraph text. The footer consists of tabs, icons aligned left, within the card-footer.\n" +
    "          </p>\n" +
    "          <p>\n" +
    "            <a href=\"#\" class=\"subdued\">1 Like</a>\n" +
    "            <a href=\"#\" class=\"subdued\">5 Comments</a>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"item tabs tabs-secondary tabs-icon-left\">\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-thumbsup\"></i>\n" +
    "            Like\n" +
    "          </a>\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-chatbox\"></i>\n" +
    "            Comment\n" +
    "          </a>\n" +
    "          <a class=\"tab-item\" href=\"#\">\n" +
    "            <i class=\"icon ion-share\"></i>\n" +
    "            Share\n" +
    "          </a>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </ion-content>\n" +
    "\n" +
    "  </ion-pane>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n" +
    "\n"
  );


  $templateCache.put('lib/ionic/demos/old/side-menu-and-navigation/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Side Menus</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body>\n" +
    "\n" +
    "  <div ng-controller=\"MainCtrl\">\n" +
    "    <ion-nav-view></ion-nav-view>\n" +
    "  </div>\n" +
    "\n" +
    "  <script id=\"event-menu.html\" type=\"text/ng-template\">\n" +
    "    <ion-side-menus>\n" +
    "\n" +
    "      <ion-side-menu-content>\n" +
    "        <ion-nav-bar class=\"bar-positive\">\n" +
    "          <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n" +
    "          </ion-nav-back-button>\n" +
    "        </ion-nav-bar>\n" +
    "        <ion-nav-buttons side=\"left\">\n" +
    "          <button class=\"button button-icon button-clear ion-navicon\" ng-click=\"toggleLeft()\">\n" +
    "          </button>\n" +
    "        </ion-nav-buttons>\n" +
    "        <ion-nav-view name=\"menuContent\"></ion-nav-view>\n" +
    "      </ion-side-menu-content>\n" +
    "\n" +
    "      <ion-side-menu side=\"left\">\n" +
    "        <ion-header-bar class=\"bar-assertive\">\n" +
    "          <h1 class=\"title\">Left Menu</h1>\n" +
    "        </ion-header-bar>\n" +
    "        <ion-content>\n" +
    "          <ul class=\"list\">\n" +
    "            <a href=\"#/event/check-in\" class=\"item\" menu-toggle=\"left\">Check-in</a>\n" +
    "            <a href=\"#/event/attendees\" class=\"item\" menu-toggle=\"left\">Attendees</a>\n" +
    "          </ul>\n" +
    "        </ion-content>\n" +
    "      </ion-side-menu>\n" +
    "\n" +
    "    </ion-side-menus>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"home.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Welcome\">\n" +
    "      <ion-content padding=\"true\">\n" +
    "        <p>Swipe to the right to reveal the left menu.</p>\n" +
    "        <p>(On desktop click and drag from left to right)</p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"check-in.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Event Check-in\">\n" +
    "      <ion-content>\n" +
    "        <form class=\"list\" ng-show=\"showForm\">\n" +
    "          <div class=\"item item-divider\">\n" +
    "            Attendee Info\n" +
    "          </div>\n" +
    "          <label class=\"item item-input\">\n" +
    "            <input type=\"text\" placeholder=\"First Name\" ng-model=\"attendee.firstname\">\n" +
    "          </label>\n" +
    "          <label class=\"item item-input\">\n" +
    "            <input type=\"text\" placeholder=\"Last Name\" ng-model=\"attendee.lastname\">\n" +
    "          </label>\n" +
    "          <div class=\"item item-divider\">\n" +
    "            Shirt Size\n" +
    "          </div>\n" +
    "          <ion-radio ng-repeat=\"shirtSize in shirtSizes\"\n" +
    "                     ng-value=\"shirtSize.value\"\n" +
    "                     ng-model=\"attendee.shirtSize\">\n" +
    "            {{ shirtSize.text }}\n" +
    "          </ion-radio>\n" +
    "          <div class=\"item item-divider\">\n" +
    "            Lunch\n" +
    "          </div>\n" +
    "          <ion-toggle ng-model=\"attendee.vegetarian\">\n" +
    "            Vegetarian\n" +
    "          </ion-toggle>\n" +
    "          <div class=\"padding\">\n" +
    "            <button class=\"button button-block\" ng-click=\"submit()\">Checkin</button>\n" +
    "          </div>\n" +
    "        </form>\n" +
    "\n" +
    "        <div ng-hide=\"showForm\">\n" +
    "          <pre ng-bind=\"attendee | json\"></pre>\n" +
    "          <a href=\"#/event/attendees\">View attendees</a>\n" +
    "        </div>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"attendees.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Event Attendees\" left-buttons=\"leftButtons\">\n" +
    "      <ion-content>\n" +
    "        <div class=\"list\">\n" +
    "          <ion-toggle ng-repeat=\"attendee in attendees | orderBy:'firstname' | orderBy:'lastname'\"\n" +
    "                      ng-model=\"attendee.arrived\"\n" +
    "                      ng-change=\"arrivedChange(attendee)\">\n" +
    "            {{ attendee.firstname }}\n" +
    "            {{ attendee.lastname }}\n" +
    "          </ion-toggle>\n" +
    "          <div class=\"item item-divider\">\n" +
    "            Activity\n" +
    "          </div>\n" +
    "          <div class=\"item\" ng-repeat=\"msg in activity\">\n" +
    "            {{ msg }}\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/sign-in-then-tabs/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Sign-in, Then Tabs Example</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body>\n" +
    "\n" +
    "  <ion-nav-bar class=\"bar-positive nav-title-slide-ios7\">\n" +
    "    <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n" +
    "    </ion-nav-back-button>\n" +
    "  </ion-nav-bar>\n" +
    "\n" +
    "  <ion-nav-view animation=\"slide-left-right\"></ion-nav-view>\n" +
    "\n" +
    "  <script id=\"sign-in.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Sign-In\">\n" +
    "      <ion-content>\n" +
    "        <div class=\"list\">\n" +
    "          <label class=\"item item-input\">\n" +
    "            <span class=\"input-label\">Username</span>\n" +
    "            <input type=\"text\" ng-model=\"user.username\">\n" +
    "          </label>\n" +
    "          <label class=\"item item-input\">\n" +
    "            <span class=\"input-label\">Password</span>\n" +
    "            <input type=\"password\" ng-model=\"user.password\">\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"padding\">\n" +
    "          <button class=\"button button-block button-positive\" ng-click=\"signIn(user)\">\n" +
    "            Sign-In\n" +
    "          </button>\n" +
    "          <p class=\"text-center\">\n" +
    "            <a href=\"#/forgot-password\">Forgot password</a>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"forgot-password.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Forgot Password\">\n" +
    "      <ion-content padding=\"true\">\n" +
    "        <p>\n" +
    "          Yeah this is just a demo showing how views can be shown without tabs, then you can navigate\n" +
    "          to views within tabs. Additionally, only one set of tabs needs to be written for all of the different views that should go inside the tabs. (Compared to written the same tab links in the footer of every view that's in a tab.)\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          There's no username/password, just click\n" +
    "          the Sign-In button back a the sign-in view.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          Return to <a href=\"#/sign-in\">Sign-In</a>.\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"tabs.html\" type=\"text/ng-template\">\n" +
    "    <ion-tabs class=\"tabs-icon-top tabs-positive\">\n" +
    "\n" +
    "      <ion-tab title=\"Home\" icon=\"ion-home\" href=\"#/tab/home\">\n" +
    "        <ion-nav-view name=\"home-tab\"></ion-nav-view>\n" +
    "      </ion-tab>\n" +
    "\n" +
    "      <ion-tab title=\"About\" icon=\"ion-ios7-information\" href=\"#/tab/about\">\n" +
    "        <ion-nav-view name=\"about-tab\"></ion-nav-view>\n" +
    "      </ion-tab>\n" +
    "\n" +
    "      <ion-tab title=\"Sign-Out\" icon=\"ion-log-out\" href=\"#/sign-in\">\n" +
    "      </ion-tab>\n" +
    "\n" +
    "    </ion-tabs>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"home.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Home\">\n" +
    "      <ion-content padding=\"true\">\n" +
    "        <p>Example of Ionic tabs. Navigate to each tab, and\n" +
    "        navigate to child views of each tab and notice how\n" +
    "        each tab has its own navigation history.</p>\n" +
    "        <p>\n" +
    "          <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts\">Scientific Facts</a>\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"facts.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Facts\">\n" +
    "      <ion-content padding=\"true\">\n" +
    "        <p>Banging your head against a wall uses 150 calories an hour.</p>\n" +
    "        <p>Dogs have four toes on their hind feet, and five on their front feet.</p>\n" +
    "        <p>The ant can lift 50 times its own weight, can pull 30 times its own weight and always falls over on its right side when intoxicated.</p>\n" +
    "        <p>A cockroach will live nine days without it's head, before it starves to death.</p>\n" +
    "        <p>Polar bears are left handed.</p>\n" +
    "        <p>\n" +
    "          <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n" +
    "          <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts2\">More Facts</a>\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"facts2.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Also Factual\">\n" +
    "      <ion-content padding=\"true\">\n" +
    "        <p>111,111,111 x 111,111,111 = 12,345,678,987,654,321</p>\n" +
    "        <p>1 in every 4 Americans has appeared on T.V.</p>\n" +
    "        <p>11% of the world is left-handed.</p>\n" +
    "        <p>1 in 8 Americans has worked at a McDonalds restaurant.</p>\n" +
    "        <p>$283,200 is the absolute highest amount of money you can win on Jeopardy.</p>\n" +
    "        <p>101 Dalmatians, Peter Pan, Lady and the Tramp, and Mulan are the only Disney cartoons where both parents are present and don't die throughout the movie.</p>\n" +
    "        <p>\n" +
    "          <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n" +
    "          <a class=\"button icon ion-chevron-left\" href=\"#/tab/facts\"> Scientific Facts</a>\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"about.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"About\">\n" +
    "      <ion-content padding=\"true\">\n" +
    "        <h3>Create hybrid mobile apps with the web technologies you love.</h3>\n" +
    "        <p>Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components for building highly interactive apps.</p>\n" +
    "        <p>Built with Sass and optimized for AngularJS.</p>\n" +
    "        <p>\n" +
    "          <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/navstack\">Tabs Nav Stack</a>\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"nav-stack.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Tab Nav Stack\">\n" +
    "      <ion-content padding=\"true\">\n" +
    "        <p><img src=\"http://ionicframework.com/img/diagrams/tabs-nav-stack.png\" style=\"width:100%\"></p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/starter-template/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Starter Template</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MyCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <button class=\"button\" ng-click=\"doSomething()\">\n" +
    "      Do Something!\n" +
    "    </button>\n" +
    "    <h1 class=\"title\">{{myTitle}}</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content class=\"padding\">\n" +
    "    <h2>Content</h2>\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/swipeable-cards/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"cardsApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Swipeable Cards</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"http://code.ionicframework.com/contrib/ionic-contrib-swipecards/ionic.swipecards.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body class=\"slide-left-right-ios7\" no-scroll>\n" +
    "\n" +
    "  <ion-pane ng-controller=\"CardsCtrl\">\n" +
    "    <ion-header-bar class=\"bar-transparent\">\n" +
    "      <h1 class=\"title\">Help Out</h1>\n" +
    "    </ion-header-bar>\n" +
    "\n" +
    "    <swipe-cards on-swipe=\"onSwipe($event)\">\n" +
    "\n" +
    "      <swipe-cards>\n" +
    "        <swipe-card on-swipe=\"cardSwiped()\" id=\"start-card\">\n" +
    "          Swipe down for a new card\n" +
    "        </swipe-card>\n" +
    "        <swipe-card ng-repeat=\"card in cards\" on-destroy=\"cardDestroyed($index)\" on-swipe=\"cardSwiped($index)\">\n" +
    "\n" +
    "          <div ng-controller=\"CardCtrl\">\n" +
    "            <div class=\"title\">\n" +
    "              {{card.title}}\n" +
    "            </div>\n" +
    "            <div class=\"image\">\n" +
    "              <img ng-src=\"{{card.image}}\">\n" +
    "            </div>\n" +
    "            <div class=\"button-bar\">\n" +
    "              <button class=\"button button-clear button-positive\" ng-click=\"goAway()\">Answer</button>\n" +
    "              <button class=\"button button-clear button-positive\" ng-click=\"goAway()\">Decline</button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </swipe-card>\n" +
    "      </swipe-cards>\n" +
    "  </ion-pane>\n" +
    "\n" +
    "  <!-- quick cache hack -->\n" +
    "  <img src=\"http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic.png\" style=\"display: none\">\n" +
    "  <img src=\"http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic1.png\" style=\"display: none\">\n" +
    "  <img src=\"http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic2.png\" style=\"display: none\">\n" +
    "  <img src=\"http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic3.png\" style=\"display: none\">\n" +
    "  <img src=\"http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic4.png\" style=\"display: none\">\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/tabs-and-navigation/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Tabs and Navigation</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body>\n" +
    "\n" +
    "  <ion-nav-bar class=\"nav-title-slide-ios7 bar-positive\">\n" +
    "    <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n" +
    "    </ion-nav-back-button>\n" +
    "  </ion-nav-bar>\n" +
    "\n" +
    "  <ion-nav-view animation=\"slide-left-right\"></ion-nav-view>\n" +
    "\n" +
    "  <script id=\"tabs.html\" type=\"text/ng-template\">\n" +
    "    <ion-tabs class=\"tabs-icon-top tabs-positive\">\n" +
    "\n" +
    "      <ion-tab title=\"Home\" icon=\"ion-home\" href=\"#/tab/home\">\n" +
    "        <ion-nav-view name=\"home-tab\"></ion-nav-view>\n" +
    "      </ion-tab>\n" +
    "\n" +
    "      <ion-tab title=\"About\" icon=\"ion-ios7-information\" href=\"#/tab/about\">\n" +
    "        <ion-nav-view name=\"about-tab\"></ion-nav-view>\n" +
    "      </ion-tab>\n" +
    "\n" +
    "      <ion-tab title=\"Contact\" icon=\"ion-ios7-world\" ui-sref=\"tabs.contact\">\n" +
    "        <ion-nav-view name=\"contact-tab\"></ion-nav-view>\n" +
    "      </ion-tab>\n" +
    "\n" +
    "    </ion-tabs>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"home.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Home\">\n" +
    "      <ion-content class=\"padding\">\n" +
    "        <p>Example of Ionic tabs. Navigate to each tab, and\n" +
    "        navigate to child views of each tab and notice how\n" +
    "        each tab has its own navigation history.</p>\n" +
    "        <p>\n" +
    "          <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts\">Scientific Facts</a>\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"facts.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Facts\" class=\"padding\">\n" +
    "      <ion-content>\n" +
    "        <p>Banging your head against a wall uses 150 calories an hour.</p>\n" +
    "        <p>Dogs have four toes on their hind feet, and five on their front feet.</p>\n" +
    "        <p>The ant can lift 50 times its own weight, can pull 30 times its own weight and always falls over on its right side when intoxicated.</p>\n" +
    "        <p>A cockroach will live nine days without it's head, before it starves to death.</p>\n" +
    "        <p>Polar bears are left handed.</p>\n" +
    "        <p>\n" +
    "          <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n" +
    "          <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts2\">More Facts</a>\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"facts2.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Also Factual\">\n" +
    "      <ion-content class=\"padding\">\n" +
    "        <p>111,111,111 x 111,111,111 = 12,345,678,987,654,321</p>\n" +
    "        <p>1 in every 4 Americans has appeared on T.V.</p>\n" +
    "        <p>11% of the world is left-handed.</p>\n" +
    "        <p>1 in 8 Americans has worked at a McDonalds restaurant.</p>\n" +
    "        <p>$283,200 is the absolute highest amount of money you can win on Jeopardy.</p>\n" +
    "        <p>101 Dalmatians, Peter Pan, Lady and the Tramp, and Mulan are the only Disney cartoons where both parents are present and don't die throughout the movie.</p>\n" +
    "        <p>\n" +
    "          <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n" +
    "          <a class=\"button icon ion-chevron-left\" href=\"#/tab/facts\"> Scientific Facts</a>\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"about.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"About\">\n" +
    "      <ion-content class=\"padding\">\n" +
    "        <h3>Create hybrid mobile apps with the web technologies you love.</h3>\n" +
    "        <p>Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components for building highly interactive apps.</p>\n" +
    "        <p>Built with Sass and optimized for AngularJS.</p>\n" +
    "        <p>\n" +
    "          <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/navstack\">Tabs Nav Stack</a>\n" +
    "        </p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"nav-stack.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Tab Nav Stack\">\n" +
    "      <ion-content class=\"padding\">\n" +
    "        <p><img src=\"http://ionicframework.com/img/diagrams/tabs-nav-stack.png\" style=\"width:100%\"></p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "  <script id=\"contact.html\" type=\"text/ng-template\">\n" +
    "    <ion-view title=\"Contact\">\n" +
    "      <ion-content>\n" +
    "        <p>@IonicFramework</p>\n" +
    "        <p>@DriftyCo</p>\n" +
    "      </ion-content>\n" +
    "    </ion-view>\n" +
    "  </script>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/thumbnail-list/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Simple List</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MyCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Canadian Music</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content>\n" +
    "\n" +
    "    <div class=\"list\">\n" +
    "\n" +
    "      <a ng-repeat=\"item in items\" href=\"#/{{item.id}}\" class=\"item item-thumbnail-left\">\n" +
    "        <img ng-src=\"{{ item.image }}\">\n" +
    "        <h2>{{ item.album }}</h2>\n" +
    "        <h4>{{ item.artist }}</h4>\n" +
    "      </a>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/old/toggle/index.html',
    "<!DOCTYPE html>\n" +
    "<html ng-app=\"ionicApp\">\n" +
    "<head>\n" +
    "\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "\n" +
    "  <title>Ionic Toggles</title>\n" +
    "\n" +
    "  <link href=\"http://code.ionicframework.com/nightly/css/ionic.min.css\" rel=\"stylesheet\">\n" +
    "  <link href=\"style.css\" rel=\"stylesheet\">\n" +
    "\n" +
    "  <script src=\"http://code.ionicframework.com/nightly/js/ionic.bundle.min.js\"></script>\n" +
    "  <script src=\"script.js\"></script>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body ng-controller=\"MainCtrl\">\n" +
    "\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Toggles</h1>\n" +
    "  </ion-header-bar>\n" +
    "\n" +
    "  <ion-content>\n" +
    "\n" +
    "    <div class=\"list\">\n" +
    "\n" +
    "      <div class=\"item item-divider\">\n" +
    "        Settings\n" +
    "      </div>\n" +
    "\n" +
    "      <ion-toggle ng-repeat=\"item in settingsList\" ng-model=\"item.checked\" ng-checked=\"item.checked\">\n" +
    "        {{ item.text }}\n" +
    "      </ion-toggle>\n" +
    "\n" +
    "      <div class=\"item\">\n" +
    "        <pre ng-bind=\"settingsList | json\"></pre>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"item item-divider\">\n" +
    "        Notifications\n" +
    "      </div>\n" +
    "\n" +
    "      <ion-toggle ng-model=\"pushNotification.checked\" ng-change=\"pushNotificationChange()\">\n" +
    "        Push Notifications\n" +
    "      </ion-toggle>\n" +
    "\n" +
    "      <div class=\"item\">\n" +
    "        <pre ng-bind=\"pushNotification | json\"></pre>\n" +
    "      </div>\n" +
    "\n" +
    "      <ion-toggle ng-model=\"emailNotification\" ng-true-value=\"Subscribed\" ng-false-value=\"Unubscribed\">\n" +
    "        Newsletter\n" +
    "      </ion-toggle>\n" +
    "\n" +
    "      <div class=\"item\">\n" +
    "        <pre ng-bind=\"emailNotification | json\"></pre>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </ion-content>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/ionic/demos/service/actionSheet/index.html',
    "---\n" +
    "name: takeAction\n" +
    "component: $ionicActionSheet\n" +
    "---\n" +
    "<ion-header-bar class=\"bar-positive\">\n" +
    "  <h1 class=\"title\">Action</h1>\n" +
    "</ion-header-bar>\n" +
    "<ion-content ng-controller=\"ActionSheetCtrl\" class=\"padding\">\n" +
    "  <div class=\"button button-assertive button-block\" ng-click=\"takeAction()\">\n" +
    "    Take Action!\n" +
    "  </div>\n" +
    "  <div class=\"card\" ng-show=\"messages.length\">\n" +
    "    <div class=\"item item-divider\">\n" +
    "      User Log\n" +
    "    </div>\n" +
    "    <div class=\"item item-text-wrap\">\n" +
    "      <div ng-repeat=\"message in messages\">\n" +
    "        {{message.text}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</ion-content>\n"
  );


  $templateCache.put('lib/ionic/demos/service/loading/index.html',
    "---\n" +
    "name: complete\n" +
    "component: $ionicLoading\n" +
    "---\n" +
    "<div ng-controller=\"LoadingCtrl\">\n" +
    "  <ion-header-bar class=\"bar-positive\">\n" +
    "    <h1 class=\"title\">Loading Demo</h1>\n" +
    "    <a class=\"button\" ng-click=\"showLoading()\">\n" +
    "      <i class=\"icon ion-more\"></i> Load\n" +
    "    </a>\n" +
    "  </ion-header-bar>\n" +
    "  <ion-content>\n" +
    "    <div class=\"list\">\n" +
    "      <label class=\"item item-input item-stacked-label\">\n" +
    "        <span class=\"input-label\">Loading Duration (ms)</span>\n" +
    "        <input type=\"number\" ng-model=\"loadingOptions.duration\">\n" +
    "      </label>\n" +
    "      <label class=\"item item-input item-stacked-label\">\n" +
    "        <span class=\"input-label\">Loading Delay (ms)</span>\n" +
    "        <input type=\"number\" ng-model=\"loadingOptions.delay\">\n" +
    "      </label>\n" +
    "      <label class=\"item item-input item-stacked-label\">\n" +
    "        <span class=\"input-label\">Loading Template</span>\n" +
    "        <textarea rows=\"3\" ng-model=\"loadingOptions.template\"></textarea>\n" +
    "      </label>\n" +
    "      <ion-toggle class=\"item item-toggle\"\n" +
    "                  ng-model=\"loadingOptions.noBackdrop\">\n" +
    "        Hide Backdrop?\n" +
    "      </ion-toggle>\n" +
    "    </div>\n" +
    "  </ion-content>\n" +
    "</div>\n"
  );


  $templateCache.put('lib/ionic/demos/service/popover/index.html',
    "---\n" +
    "name: popover\n" +
    "component: $ionicPopover\n" +
    "---\n" +
    "\n" +
    "<ion-header-bar class=\"bar-positive\" title=\"Popover\" ng-controller=\"HeaderCtrl\">\n" +
    "  <div class=\"buttons\">\n" +
    "    <button class=\"button button-icon ion-android-more\" ng-click=\"openPopover($event)\" id=\"icon-btn\"></button>\n" +
    "  </div>\n" +
    "  <h1 class=\"title\">Popover</h1>\n" +
    "  <div class=\"buttons\">\n" +
    "    <button class=\"button\" ng-click=\"openPopover2($event)\" id=\"mid-btn\">Popover 2</button>\n" +
    "    <button class=\"button\" ng-click=\"openPopover($event)\" id=\"right-btn\">Popover</button>\n" +
    "  </div>\n" +
    "</ion-header-bar>\n" +
    "\n" +
    "<ion-content class=\"padding has-header\" ng-controller=\"PlatformCtrl\">\n" +
    "  <p>\n" +
    "    <button class=\"button\" ng-click=\"setPlatform('ios')\" id=\"ios\">iOS</button>\n" +
    "    <button class=\"button\" ng-click=\"setPlatform('android')\" id=\"android\">Android</button>\n" +
    "    <button class=\"button\" ng-click=\"setPlatform('base')\" id=\"base\">Base</button>\n" +
    "  </p>\n" +
    "</ion-content>\n" +
    "\n" +
    "<script id=\"popover.html\" type=\"text/ng-template\">\n" +
    "  <ion-popover-view>\n" +
    "    <ion-header-bar>\n" +
    "      <h1 class=\"title\">Popover Header</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "      <div class=\"list\">\n" +
    "        <label class=\"item item-input\">\n" +
    "          <span class=\"input-label\">First Name</span>\n" +
    "          <input type=\"text\" placeholder=\"\">\n" +
    "        </label>\n" +
    "        <label class=\"item item-input\">\n" +
    "          <span class=\"input-label\">Last Name</span>\n" +
    "          <input type=\"text\" placeholder=\"\">\n" +
    "        </label>\n" +
    "        <label class=\"item item-input\">\n" +
    "          <span class=\"input-label\">Email</span>\n" +
    "          <input type=\"text\" placeholder=\"\">\n" +
    "        </label>\n" +
    "        <button class=\"button button-block button-positive\">Submit</button>\n" +
    "      </div>\n" +
    "    </ion-content>\n" +
    "  </ion-popover-view>\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<script id=\"popover2.html\" type=\"text/ng-template\">\n" +
    "  <ion-popover-view>\n" +
    "    <ion-content>\n" +
    "      <div class=\"list\">\n" +
    "        <div class=\"item\">\n" +
    "          Item 1\n" +
    "        </div>\n" +
    "        <div class=\"item\">\n" +
    "          Item 2\n" +
    "        </div>\n" +
    "        <div class=\"item\">\n" +
    "          Item 3\n" +
    "        </div>\n" +
    "        <div class=\"item\">\n" +
    "          Item 4\n" +
    "        </div>\n" +
    "        <div class=\"item\">\n" +
    "          Item 5\n" +
    "        </div>\n" +
    "        <div class=\"item\">\n" +
    "          Item 6\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </ion-content>\n" +
    "  </ion-popover-view>\n" +
    "</script>\n"
  );


  $templateCache.put('lib/ionic/demos/service/popup/popping/index.html',
    "---\n" +
    "name: popping\n" +
    "component: $ionicPopup\n" +
    "---\n" +
    "\n" +
    "<ion-header-bar class=\"bar-positive\">\n" +
    "  <h1 class=\"title\">Popups</h1>\n" +
    "</ion-header-bar>\n" +
    "<ion-content ng-controller=\"PopupCtrl\">\n" +
    "  <button class=\"button button-dark\" ng-click=\"showPopup()\">Generic</button>\n" +
    "  <button class=\"button button-primary\" ng-click=\"showConfirm()\">Confirm</button>\n" +
    "  <button class=\"button button-balanced\" ng-click=\"showPrompt()\">Prompt</button>\n" +
    "  <button class=\"button button-balanced\" ng-click=\"showPasswordPrompt()\">Password Prompt</button>\n" +
    "  <button class=\"button button-positive\" ng-click=\"showAlert()\">Alert</button>\n" +
    "  <div class=\"list\">\n" +
    "    <a class=\"item\" href=\"#\"\n" +
    "      ng-repeat=\"item in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\">\n" +
    "      Item {{item}}\n" +
    "    </a>\n" +
    "  </div>\n" +
    "</ion-content>\n" +
    "\n" +
    "<script id=\"popup-template.html\" type=\"text/ng-template\">\n" +
    "  <input ng-model=\"data.wifi\" type=\"text\" placeholder=\"Password\">\n" +
    "</script>\n"
  );


  $templateCache.put('lib/jstz/example.html',
    "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
    "<head><title>jstz example</title></head>\n" +
    "<body>\n" +
    "<script type=\"text/javascript\" src=\"jstz.js\"></script>\n" +
    "<script language=\"JavaScript\">\n" +
    "  var tz = jstz(), text = '';\n" +
    "	text += '<br>Timezone name: ' + tz.timezone_name;\n" +
    "	text += '<br>Uses DST: ' + tz.uses_dst ;\n" +
    "	text += '<br>UTC offset: ' + tz.utc_offset;\n" +
    "	text += '<br>UTC name: ' + tz.utc_name;\n" +
    "	text += '<br>Hemisphere: ' + tz.hemisphere;\n" +
    "	document.write(text);\n" +
    "</script>\n" +
    "</body>	\n" +
    "</html>\n"
  );


  $templateCache.put('lib/lodash/perf/index.html',
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>lodash Performance Suite</title>\n" +
    "    <style>\n" +
    "      html, body {\n" +
    "        margin: 0;\n" +
    "        padding: 0;\n" +
    "        height: 100%;\n" +
    "      }\n" +
    "      #FirebugUI {\n" +
    "        top: 2em;\n" +
    "      }\n" +
    "      #perf-toolbar {\n" +
    "        background-color: #EEE;\n" +
    "        color: #5E740B;\n" +
    "        font-family: \"Helvetica Neue Light\", \"HelveticaNeue-Light\", \"Helvetica Neue\", Calibri, Helvetica, Arial, sans-serif;\n" +
    "        font-size: small;\n" +
    "        padding: 0.5em 0 0.5em 2em;\n" +
    "        overflow: hidden;\n" +
    "      }\n" +
    "    </style>\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <div id=\"perf-toolbar\"></div>\n" +
    "    <script src=\"../lodash.js\"></script>\n" +
    "    <script src=\"../node_modules/platform/platform.js\"></script>\n" +
    "    <script src=\"../node_modules/benchmark/benchmark.js\"></script>\n" +
    "    <script src=\"../vendor/firebug-lite/src/firebug-lite-debug.js\"></script>\n" +
    "    <script src=\"./asset/perf-ui.js\"></script>\n" +
    "    <script>\n" +
    "      document.write('<script src=\"' + ui.buildPath + '\"><\\/script>');\n" +
    "    </script>\n" +
    "    <script>\n" +
    "      var lodash = _.noConflict();\n" +
    "    </script>\n" +
    "    <script>\n" +
    "      document.write('<script src=\"' + ui.otherPath + '\"><\\/script>');\n" +
    "    </script>\n" +
    "    <script src=\"perf.js\"></script>\n" +
    "    <script>\n" +
    "      (function() {\n" +
    "        var measured,\n" +
    "            perfNow,\n" +
    "            begin = new Date;\n" +
    "\n" +
    "        function init() {\n" +
    "          var fbUI = document.getElementById('FirebugUI'),\n" +
    "              fbDoc = fbUI && (fbDoc = fbUI.contentWindow || fbUI.contentDocument).document || fbDoc,\n" +
    "              fbCommandLine = fbDoc && fbDoc.getElementById('fbCommandLine');\n" +
    "\n" +
    "          if (!fbCommandLine) {\n" +
    "            return setTimeout(init, 15);\n" +
    "          }\n" +
    "          fbUI.style.height = (\n" +
    "            Math.max(document.documentElement.clientHeight, document.body.clientHeight) -\n" +
    "            document.getElementById('perf-toolbar').clientHeight\n" +
    "          ) + 'px';\n" +
    "\n" +
    "          fbDoc.body.style.height = fbDoc.documentElement.style.height = '100%';\n" +
    "          setTimeout(run, 15);\n" +
    "        }\n" +
    "\n" +
    "        window.onload = init;\n" +
    "      }());\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/lodash/test/backbone.html',
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>Backbone Test Suite</title>\n" +
    "    <link rel=\"stylesheet\" href=\"../node_modules/qunitjs/qunit/qunit.css\">\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <script>\n" +
    "      // Avoid reporting tests to Sauce Labs when script errors occur.\n" +
    "      if (location.port == '9001') {\n" +
    "        window.onerror = function(message) {\n" +
    "          if (window.QUnit) {\n" +
    "            QUnit.config.done.length = 0;\n" +
    "          }\n" +
    "          global_test_results = { 'message': message };\n" +
    "        };\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script src=\"../node_modules/qunitjs/qunit/qunit.js\"></script>\n" +
    "    <script src=\"../node_modules/qunit-extras/qunit-extras.js\"></script>\n" +
    "    <script src=\"../vendor/json-js/json2.js\"></script>\n" +
    "    <script src=\"../node_modules/platform/platform.js\"></script>\n" +
    "    <script src=\"./asset/test-ui.js\"></script>\n" +
    "    <script src=\"../lodash.js\"></script>\n" +
    "    <script>\n" +
    "      QUnit.config.asyncRetries = 10;\n" +
    "      QUnit.config.hidepassed = true;\n" +
    "\n" +
    "      var mixinPrereqs = (function() {\n" +
    "        var aliasToReal = {\n" +
    "          'indexBy': 'keyBy',\n" +
    "          'invoke': 'invokeMap'\n" +
    "        };\n" +
    "\n" +
    "        var keyMap = {\n" +
    "          'rest': 'tail'\n" +
    "        };\n" +
    "\n" +
    "        var lodash = _.noConflict();\n" +
    "\n" +
    "        return function(_) {\n" +
    "          lodash.defaultsDeep(_, { 'templateSettings': lodash.templateSettings });\n" +
    "          lodash.mixin(_, lodash.pick(lodash, lodash.difference([\n" +
    "            'countBy',\n" +
    "            'debounce',\n" +
    "            'difference',\n" +
    "            'find',\n" +
    "            'findIndex',\n" +
    "            'findLastIndex',\n" +
    "            'groupBy',\n" +
    "            'includes',\n" +
    "            'invert',\n" +
    "            'invokeMap',\n" +
    "            'keyBy',\n" +
    "            'omit',\n" +
    "            'partition',\n" +
    "            'reduceRight',\n" +
    "            'reject',\n" +
    "            'sample',\n" +
    "            'without'\n" +
    "          ], lodash.functions(_))));\n" +
    "\n" +
    "          lodash.forOwn(keyMap, function(realName, otherName) {\n" +
    "            _[otherName] = lodash[realName];\n" +
    "            _.prototype[otherName] = lodash.prototype[realName];\n" +
    "          });\n" +
    "\n" +
    "          lodash.forOwn(aliasToReal, function(realName, alias) {\n" +
    "            _[alias] = _[realName];\n" +
    "            _.prototype[alias] = _.prototype[realName];\n" +
    "          });\n" +
    "        };\n" +
    "      }());\n" +
    "\n" +
    "      // Load prerequisite scripts.\n" +
    "      document.write(ui.urlParams.loader == 'none'\n" +
    "        ? '<script src=\"' + ui.buildPath + '\"><\\/script>'\n" +
    "        : '<script data-dojo-config=\"async:1\" src=\"' + ui.loaderPath + '\"><\\/script>'\n" +
    "      );\n" +
    "    </script>\n" +
    "    <script>\n" +
    "      if (ui.urlParams.loader == 'none') {\n" +
    "        mixinPrereqs(_);\n" +
    "        document.write([\n" +
    "          '<script src=\"../node_modules/jquery/dist/jquery.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/backbone.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/setup/dom-setup.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/setup/environment.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/noconflict.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/events.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/model.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/collection.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/router.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/view.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/backbone/test/sync.js\"><\\/script>'\n" +
    "        ].join('\\n'));\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script>\n" +
    "      (function() {\n" +
    "        if (window.curl) {\n" +
    "          curl.config({ 'apiName': 'require' });\n" +
    "        }\n" +
    "        if (!window.require) {\n" +
    "          return;\n" +
    "        }\n" +
    "        var reBasename = /[\\w.-]+$/,\n" +
    "            basePath = ('//' + location.host + location.pathname.replace(reBasename, '')).replace(/\\btest\\/$/, ''),\n" +
    "            modulePath = ui.buildPath.replace(/\\.js$/, ''),\n" +
    "            locationPath = modulePath.replace(reBasename, '').replace(/^\\/|\\/$/g, ''),\n" +
    "            moduleMain = modulePath.match(reBasename)[0],\n" +
    "            uid = +new Date;\n" +
    "\n" +
    "        function getConfig() {\n" +
    "          var result = {\n" +
    "            'baseUrl': './',\n" +
    "            'urlArgs': 't=' + uid++,\n" +
    "            'waitSeconds': 0,\n" +
    "            'paths': {\n" +
    "              'backbone': '../vendor/backbone/backbone',\n" +
    "              'jquery': '../node_modules/jquery/dist/jquery'\n" +
    "            },\n" +
    "            'packages': [{\n" +
    "              'name': 'test',\n" +
    "              'location': '../vendor/backbone/test',\n" +
    "              'config': {\n" +
    "                // Work around no global being exported.\n" +
    "                'exports': 'QUnit',\n" +
    "                'loader': 'curl/loader/legacy'\n" +
    "              }\n" +
    "            }]\n" +
    "          };\n" +
    "\n" +
    "          if (ui.isModularize) {\n" +
    "            result.packages.push({\n" +
    "              'name': 'underscore',\n" +
    "              'location': locationPath,\n" +
    "              'main': moduleMain\n" +
    "            });\n" +
    "          } else {\n" +
    "            result.paths.underscore = modulePath;\n" +
    "          }\n" +
    "          return result;\n" +
    "        }\n" +
    "\n" +
    "        QUnit.config.autostart = false;\n" +
    "\n" +
    "        require(getConfig(), ['underscore'], function(lodash) {\n" +
    "          mixinPrereqs(lodash);\n" +
    "          require(getConfig(), ['backbone'], function() {\n" +
    "            require(getConfig(), [\n" +
    "              'test/setup/dom-setup',\n" +
    "              'test/setup/environment',\n" +
    "              'test/noconflict',\n" +
    "              'test/events',\n" +
    "              'test/model',\n" +
    "              'test/collection',\n" +
    "              'test/router',\n" +
    "              'test/view',\n" +
    "              'test/sync'\n" +
    "            ], function() {\n" +
    "              QUnit.start();\n" +
    "            });\n" +
    "          });\n" +
    "        });\n" +
    "      }());\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/lodash/test/fp.html',
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>lodash-fp Test Suite</title>\n" +
    "    <link rel=\"stylesheet\" href=\"../node_modules/qunitjs/qunit/qunit.css\">\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <script>\n" +
    "      // Avoid reporting tests to Sauce Labs when script errors occur.\n" +
    "      if (location.port == '9001') {\n" +
    "        window.onerror = function(message) {\n" +
    "          if (window.QUnit) {\n" +
    "            QUnit.config.done.length = 0;\n" +
    "          }\n" +
    "          global_test_results = { 'message': message };\n" +
    "        };\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script src=\"../lodash.js\"></script>\n" +
    "    <script src=\"../dist/lodash.fp.js\"></script>\n" +
    "    <script src=\"../dist/mapping.fp.js\"></script>\n" +
    "    <script src=\"../node_modules/qunitjs/qunit/qunit.js\"></script>\n" +
    "    <script src=\"../node_modules/qunit-extras/qunit-extras.js\"></script>\n" +
    "    <script src=\"../node_modules/platform/platform.js\"></script>\n" +
    "    <script src=\"./test-fp.js\"></script>\n" +
    "    <div id=\"qunit\"></div>\n" +
    "    <script>\n" +
    "      // Set a more readable browser name.\n" +
    "      window.onload = function() {\n" +
    "        var timeoutId = setInterval(function() {\n" +
    "          var ua = document.getElementById('qunit-userAgent');\n" +
    "          if (ua) {\n" +
    "            ua.innerHTML = platform;\n" +
    "            clearInterval(timeoutId);\n" +
    "          }\n" +
    "        }, 16);\n" +
    "      };\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/lodash/test/index.html',
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>lodash Test Suite</title>\n" +
    "    <link rel=\"stylesheet\" href=\"../node_modules/qunitjs/qunit/qunit.css\">\n" +
    "    <style>\n" +
    "      #exports, #module {\n" +
    "        display: none;\n" +
    "      }\n" +
    "    </style>\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <script>\n" +
    "      // Avoid reporting tests to Sauce Labs when script errors occur.\n" +
    "      if (location.port == '9001') {\n" +
    "        window.onerror = function(message) {\n" +
    "          if (window.QUnit) {\n" +
    "            QUnit.config.done.length = 0;\n" +
    "          }\n" +
    "          global_test_results = { 'message': message };\n" +
    "        };\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script src=\"../node_modules/lodash/index.js\"></script>\n" +
    "    <script>var lodashStable = _.noConflict();</script>\n" +
    "    <script src=\"../node_modules/qunitjs/qunit/qunit.js\"></script>\n" +
    "    <script src=\"../node_modules/qunit-extras/qunit-extras.js\"></script>\n" +
    "    <script src=\"../node_modules/platform/platform.js\"></script>\n" +
    "    <script src=\"./asset/test-ui.js\"></script>\n" +
    "    <div id=\"qunit\"></div>\n" +
    "    <div id=\"exports\"></div>\n" +
    "    <div id=\"module\"></div>\n" +
    "    <script>\n" +
    "      function setProperty(object, key, value) {\n" +
    "        try {\n" +
    "          Object.defineProperty(object, key, {\n" +
    "            'configurable': true,\n" +
    "            'enumerable': false,\n" +
    "            'writable': true,\n" +
    "            'value': value\n" +
    "          });\n" +
    "        } catch (e) {\n" +
    "          object[key] = value;\n" +
    "        }\n" +
    "        return object;\n" +
    "      }\n" +
    "\n" +
    "      function addBizarroMethods() {\n" +
    "        var funcProto = Function.prototype,\n" +
    "            objectProto = Object.prototype;\n" +
    "\n" +
    "        var hasOwnProperty = objectProto.hasOwnProperty,\n" +
    "            fnToString = funcProto.toString,\n" +
    "            nativeString = fnToString.call(objectProto.toString),\n" +
    "            noop = function() {},\n" +
    "            propertyIsEnumerable = objectProto.propertyIsEnumerable,\n" +
    "            reToString = /toString/g;\n" +
    "\n" +
    "        function constant(value) {\n" +
    "          return function() {\n" +
    "            return value;\n" +
    "          };\n" +
    "        }\n" +
    "\n" +
    "        function createToString(funcName) {\n" +
    "          return constant(nativeString.replace(reToString, funcName));\n" +
    "        }\n" +
    "\n" +
    "        // Allow bypassing native checks.\n" +
    "        setProperty(funcProto, 'toString', (function() {\n" +
    "          function wrapper() {\n" +
    "            setProperty(funcProto, 'toString', fnToString);\n" +
    "            var result = hasOwnProperty.call(this, 'toString') ? this.toString() : fnToString.call(this);\n" +
    "            setProperty(funcProto, 'toString', wrapper);\n" +
    "            return result;\n" +
    "          }\n" +
    "          return wrapper;\n" +
    "        }()));\n" +
    "\n" +
    "        // Add prototype extensions.\n" +
    "        funcProto._method = noop;\n" +
    "\n" +
    "        // Set bad shims.\n" +
    "        setProperty(Object, '_create', Object.create);\n" +
    "        setProperty(Object, 'create', (function() {\n" +
    "          function object() {}\n" +
    "          return function(prototype) {\n" +
    "            if (prototype === Object(prototype)) {\n" +
    "              object.prototype = prototype;\n" +
    "              var result = new object;\n" +
    "              object.prototype = undefined;\n" +
    "            }\n" +
    "            return result || {};\n" +
    "          };\n" +
    "        }()));\n" +
    "\n" +
    "        setProperty(Object, '_getOwnPropertySymbols', Object.getOwnPropertySymbols);\n" +
    "        setProperty(Object, 'getOwnPropertySymbols', undefined);\n" +
    "\n" +
    "        setProperty(objectProto, '_propertyIsEnumerable', propertyIsEnumerable);\n" +
    "        setProperty(objectProto, 'propertyIsEnumerable', function(key) {\n" +
    "          return !(key == 'valueOf' && this && this.valueOf === 1) && _propertyIsEnumerable.call(this, key);\n" +
    "        });\n" +
    "\n" +
    "        setProperty(window, '_Map', window.Map);\n" +
    "        if (_Map) {\n" +
    "          setProperty(window, 'Map', (function(Map) {\n" +
    "            var count = 0;\n" +
    "            return function() {\n" +
    "              if (count++) {\n" +
    "                return new Map;\n" +
    "              }\n" +
    "              var result = {};\n" +
    "              setProperty(window, 'Map', Map);\n" +
    "              return result;\n" +
    "            };\n" +
    "          }(_Map)));\n" +
    "\n" +
    "          setProperty(Map, 'toString', createToString('Map'));\n" +
    "        }\n" +
    "        setProperty(window, '_Set', window.Set);\n" +
    "        setProperty(window, 'Set', noop);\n" +
    "\n" +
    "        setProperty(window, '_Symbol', window.Symbol);\n" +
    "        setProperty(window, 'Symbol', undefined);\n" +
    "\n" +
    "        setProperty(window, '_WeakMap', window.WeakMap);\n" +
    "        setProperty(window, 'WeakMap', noop);\n" +
    "\n" +
    "        // Fake `WinRTError`.\n" +
    "        setProperty(window, 'WinRTError', Error);\n" +
    "\n" +
    "        // Fake free variable `global`.\n" +
    "        setProperty(window, 'exports', window);\n" +
    "        setProperty(window, 'global', window);\n" +
    "        setProperty(window, 'module', {});\n" +
    "      }\n" +
    "\n" +
    "      function removeBizarroMethods() {\n" +
    "        var funcProto = Function.prototype,\n" +
    "            objectProto = Object.prototype;\n" +
    "\n" +
    "        setProperty(objectProto, 'propertyIsEnumerable', objectProto._propertyIsEnumerable);\n" +
    "\n" +
    "        if (Object._create) {\n" +
    "          Object.create = Object._create;\n" +
    "        } else {\n" +
    "          delete Object.create;\n" +
    "        }\n" +
    "        if (Object._getOwnPropertySymbols) {\n" +
    "          Object.getOwnPropertySymbols = Object._getOwnPropertySymbols;\n" +
    "        } else {\n" +
    "          delete Object.getOwnPropertySymbols;\n" +
    "        }\n" +
    "        if (_Map) {\n" +
    "          Map = _Map;\n" +
    "        } else {\n" +
    "          setProperty(window, 'Map', undefined);\n" +
    "        }\n" +
    "        if (_Set) {\n" +
    "          Set = _Set;\n" +
    "        } else {\n" +
    "          setProperty(window, 'Set', undefined);\n" +
    "        }\n" +
    "        if (_Symbol) {\n" +
    "          Symbol = _Symbol;\n" +
    "        }\n" +
    "        if (_WeakMap) {\n" +
    "          WeakMap = _WeakMap;\n" +
    "        } else {\n" +
    "          setProperty(window, 'WeakMap', undefined);\n" +
    "        }\n" +
    "        setProperty(window, '_Map', undefined);\n" +
    "        setProperty(window, '_Set', undefined);\n" +
    "        setProperty(window, '_Symbol', undefined);\n" +
    "        setProperty(window, '_WeakMap', undefined);\n" +
    "\n" +
    "        setProperty(window, 'WinRTError', undefined);\n" +
    "\n" +
    "        setProperty(window, 'exports', document.getElementById('exports'));\n" +
    "        setProperty(window, 'global', undefined);\n" +
    "        setProperty(window, 'module', document.getElementById('module'));\n" +
    "\n" +
    "        delete funcProto._method;\n" +
    "        delete Object._create;\n" +
    "        delete Object._getOwnPropertySymbols;\n" +
    "        delete objectProto._propertyIsEnumerable;\n" +
    "      }\n" +
    "\n" +
    "      // Load lodash to expose it to the bad extensions/shims.\n" +
    "      if (!ui.isModularize) {\n" +
    "        addBizarroMethods();\n" +
    "        document.write('<script src=\"' + ui.buildPath + '\"><\\/script>');\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script>\n" +
    "      // Store lodash to test for bad extensions/shims.\n" +
    "      if (!ui.isModularize) {\n" +
    "        var lodashBizarro = window._;\n" +
    "        window._ = undefined;\n" +
    "        removeBizarroMethods();\n" +
    "      }\n" +
    "      // Load test scripts.\n" +
    "      document.write((ui.isForeign || ui.urlParams.loader == 'none')\n" +
    "        ? '<script src=\"' + ui.buildPath + '\"><\\/script><script src=\"test.js\"><\\/script>'\n" +
    "        : '<script data-dojo-config=\"async:1\" src=\"' + ui.loaderPath + '\"><\\/script>'\n" +
    "      );\n" +
    "    </script>\n" +
    "    <script>\n" +
    "      var lodashModule,\n" +
    "          shimmedModule,\n" +
    "          underscoreModule;\n" +
    "\n" +
    "      (function() {\n" +
    "        if (window.curl) {\n" +
    "          curl.config({ 'apiName': 'require' });\n" +
    "        }\n" +
    "        if (ui.isForeign || !window.require) {\n" +
    "          return;\n" +
    "        }\n" +
    "        var reBasename = /[\\w.-]+$/,\n" +
    "            basePath = ('//' + location.host + location.pathname.replace(reBasename, '')).replace(/\\btest\\/$/, ''),\n" +
    "            modulePath = ui.buildPath.replace(/\\.js$/, ''),\n" +
    "            moduleMain = modulePath.match(reBasename)[0],\n" +
    "            locationPath = modulePath.replace(reBasename, '').replace(/^\\/|\\/$/g, ''),\n" +
    "            shimmedLocationPath = './abc/../' + locationPath,\n" +
    "            underscoreLocationPath = './xyz/../' + locationPath,\n" +
    "            uid = +new Date;\n" +
    "\n" +
    "        function getConfig() {\n" +
    "          var result = {\n" +
    "            'baseUrl': './',\n" +
    "            'urlArgs': 't=' + uid++,\n" +
    "            'waitSeconds': 0,\n" +
    "            'paths': {},\n" +
    "            'packages': [{\n" +
    "              'name': 'test',\n" +
    "              'location': basePath + 'test',\n" +
    "              'main': 'test',\n" +
    "              'config': {\n" +
    "                // Work around no global being exported.\n" +
    "                'exports': 'QUnit',\n" +
    "                'loader': 'curl/loader/legacy'\n" +
    "              }\n" +
    "            }],\n" +
    "            'shim': {\n" +
    "              'shimmed': {\n" +
    "                'exports': '_'\n" +
    "              }\n" +
    "            }\n" +
    "          };\n" +
    "\n" +
    "          if (ui.isModularize) {\n" +
    "            result.packages.push({\n" +
    "              'name': 'lodash',\n" +
    "              'location': locationPath,\n" +
    "              'main': moduleMain\n" +
    "            }, {\n" +
    "              'name': 'shimmed',\n" +
    "              'location': shimmedLocationPath,\n" +
    "              'main': moduleMain\n" +
    "            }, {\n" +
    "              'name': 'underscore',\n" +
    "              'location': underscoreLocationPath,\n" +
    "              'main': moduleMain\n" +
    "            });\n" +
    "          } else {\n" +
    "            result.paths.lodash = modulePath;\n" +
    "            result.paths.shimmed = shimmedLocationPath + '/' + moduleMain;\n" +
    "            result.paths.underscore = underscoreLocationPath + '/' + moduleMain;\n" +
    "          }\n" +
    "          return result;\n" +
    "        }\n" +
    "\n" +
    "        function loadTests() {\n" +
    "          require(getConfig(), ['test'], function() {\n" +
    "            QUnit.start();\n" +
    "          });\n" +
    "        }\n" +
    "\n" +
    "        function loadModulesAndTests() {\n" +
    "          require(getConfig(), ['lodash', 'shimmed', 'underscore'], function(lodash, shimmed, underscore) {\n" +
    "            lodashModule = lodash;\n" +
    "            lodashModule.moduleName = 'lodash';\n" +
    "\n" +
    "            if (shimmed) {\n" +
    "              shimmedModule = shimmed.result(shimmed, 'noConflict') || shimmed;\n" +
    "              shimmedModule.moduleName = 'shimmed';\n" +
    "            }\n" +
    "            if (underscore) {\n" +
    "              underscoreModule = underscore.result(underscore, 'noConflict') || underscore;\n" +
    "              underscoreModule.moduleName = 'underscore';\n" +
    "            }\n" +
    "            window._ = lodash;\n" +
    "\n" +
    "            if (ui.isModularize) {\n" +
    "              require(getConfig(), [\n" +
    "                'lodash/internal/baseEach',\n" +
    "                'lodash/internal/isIndex',\n" +
    "                'lodash/internal/isIterateeCall'\n" +
    "              ], function(baseEach, isIndex, isIterateeCall) {\n" +
    "                lodash._baseEach = baseEach;\n" +
    "                lodash._isIndex = isIndex;\n" +
    "                lodash._isIterateeCall = isIterateeCall;\n" +
    "                loadTests();\n" +
    "              });\n" +
    "            } else {\n" +
    "              loadTests();\n" +
    "            }\n" +
    "          });\n" +
    "        }\n" +
    "\n" +
    "        QUnit.config.autostart = false;\n" +
    "\n" +
    "        if (window.requirejs) {\n" +
    "          addBizarroMethods();\n" +
    "          require(getConfig(), ['lodash'], function(lodash) {\n" +
    "            lodashBizarro = lodash.result(lodash, 'noConflict') || lodash;\n" +
    "            delete requirejs.s.contexts._;\n" +
    "\n" +
    "            removeBizarroMethods();\n" +
    "            loadModulesAndTests();\n" +
    "          });\n" +
    "        } else {\n" +
    "          loadModulesAndTests();\n" +
    "        }\n" +
    "      }());\n" +
    "\n" +
    "      // Set a more readable browser name.\n" +
    "      window.onload = function() {\n" +
    "        var timeoutId = setInterval(function() {\n" +
    "          var ua = document.getElementById('qunit-userAgent');\n" +
    "          if (ua) {\n" +
    "            ua.innerHTML = platform;\n" +
    "            clearInterval(timeoutId);\n" +
    "          }\n" +
    "        }, 16);\n" +
    "      };\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/lodash/test/underscore.html',
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>Underscore Test Suite</title>\n" +
    "    <link rel=\"stylesheet\" href=\"../node_modules/qunitjs/qunit/qunit.css\">\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <div id=\"qunit\"></div>\n" +
    "    <script>\n" +
    "      // Avoid reporting tests to Sauce Labs when script errors occur.\n" +
    "      if (location.port == '9001') {\n" +
    "        window.onerror = function(message) {\n" +
    "          if (window.QUnit) {\n" +
    "            QUnit.config.done.length = 0;\n" +
    "          }\n" +
    "          global_test_results = { 'message': message };\n" +
    "        };\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script src=\"../node_modules/qunitjs/qunit/qunit.js\"></script>\n" +
    "    <script src=\"../node_modules/qunit-extras/qunit-extras.js\"></script>\n" +
    "    <script src=\"../node_modules/jquery/dist/jquery.js\"></script>\n" +
    "    <script src=\"../node_modules/platform/platform.js\"></script>\n" +
    "    <script src=\"./asset/test-ui.js\"></script>\n" +
    "    <script src=\"../lodash.js\"></script>\n" +
    "    <script>\n" +
    "      QUnit.config.asyncRetries = 10;\n" +
    "      QUnit.config.hidepassed = true;\n" +
    "      QUnit.config.excused = {\n" +
    "        'Arrays': {\n" +
    "          'difference': [\n" +
    "            'can perform an OO-style difference'\n" +
    "          ],\n" +
    "          'drop': [\n" +
    "            'is an alias for rest'\n" +
    "          ],\n" +
    "          'first': [\n" +
    "            'returns an empty array when n <= 0 (0 case)',\n" +
    "            'returns an empty array when n <= 0 (negative case)',\n" +
    "            'can fetch the first n elements',\n" +
    "            'returns the whole array if n > length'\n" +
    "          ],\n" +
    "          'findIndex': [\n" +
    "            'called with context'\n" +
    "          ],\n" +
    "          'findLastIndex': [\n" +
    "            'called with context'\n" +
    "          ],\n" +
    "          'flatten': [\n" +
    "            'supports empty arrays',\n" +
    "            'can flatten nested arrays',\n" +
    "            'works on an arguments object',\n" +
    "            'can handle very deep arrays'\n" +
    "          ],\n" +
    "          'head': [\n" +
    "            'is an alias for first'\n" +
    "          ],\n" +
    "          'indexOf': [\n" +
    "            \"sorted indexOf doesn't uses binary search\",\n" +
    "            '0'\n" +
    "          ],\n" +
    "          'initial': [\n" +
    "            'returns all but the last n elements',\n" +
    "            'returns an empty array when n > length',\n" +
    "            'works on an arguments object'\n" +
    "          ],\n" +
    "          'intersection': [\n" +
    "            'can perform an OO-style intersection'\n" +
    "          ],\n" +
    "          'last': [\n" +
    "            'returns an empty array when n <= 0 (0 case)',\n" +
    "            'returns an empty array when n <= 0 (negative case)',\n" +
    "            'can fetch the last n elements',\n" +
    "            'returns the whole array if n > length'\n" +
    "          ],\n" +
    "          'lastIndexOf': [\n" +
    "            'should treat falsey `fromIndex` values, except `0` and `NaN`, as `array.length`',\n" +
    "            'should treat non-number `fromIndex` values as `array.length`',\n" +
    "            '[0,-1,-1]'\n" +
    "          ],\n" +
    "          'object': [\n" +
    "            'an array of pairs zipped together into an object',\n" +
    "            'an object converted to pairs and back to an object'\n" +
    "          ],\n" +
    "          'range': [\n" +
    "            'range with two arguments a &amp; b, b&lt;a generates an empty array'\n" +
    "          ],\n" +
    "          'rest': [\n" +
    "            'returns the whole array when index is 0',\n" +
    "            'returns elements starting at the given index',\n" +
    "            'works on an arguments object'\n" +
    "          ],\n" +
    "          'sortedIndex': [\n" +
    "            '2',\n" +
    "            '3'\n" +
    "          ],\n" +
    "          'tail': [\n" +
    "            'is an alias for rest'\n" +
    "          ],\n" +
    "          'take': [\n" +
    "            'is an alias for first'\n" +
    "          ],\n" +
    "          'uniq': [\n" +
    "            'uses the result of `iterator` for uniqueness comparisons (unsorted case)',\n" +
    "            '`sorted` argument defaults to false when omitted',\n" +
    "            'when `iterator` is a string, uses that key for comparisons (unsorted case)',\n" +
    "            'uses the result of `iterator` for uniqueness comparisons (sorted case)',\n" +
    "            'when `iterator` is a string, uses that key for comparisons (sorted case)',\n" +
    "            'can use falsey pluck like iterator'\n" +
    "          ],\n" +
    "          'union': [\n" +
    "            'can perform an OO-style union'\n" +
    "          ]\n" +
    "        },\n" +
    "        'Chaining': {\n" +
    "          'pop': true,\n" +
    "          'shift': true,\n" +
    "          'splice': true,\n" +
    "          'reverse/concat/unshift/pop/map': [\n" +
    "            'can chain together array functions.'\n" +
    "          ]\n" +
    "        },\n" +
    "        'Collections': {\n" +
    "          'lookupIterator with contexts': true,\n" +
    "          'Iterating objects with sketchy length properties': true,\n" +
    "          'Resistant to collection length and properties changing while iterating': true,\n" +
    "          'countBy': [\n" +
    "            'true'\n" +
    "          ],\n" +
    "          'each': [\n" +
    "            'context object property accessed'\n" +
    "          ],\n" +
    "          'every': [\n" +
    "            'Can be called with object',\n" +
    "            'Died on test #15',\n" +
    "            'context works'\n" +
    "          ],\n" +
    "          'filter': [\n" +
    "            'given context',\n" +
    "            '[{\"a\":1,\"b\":2},{\"a\":1,\"b\":3},{\"a\":1,\"b\":4}]',\n" +
    "            '[{\"a\":1,\"b\":2},{\"a\":2,\"b\":2}]',\n" +
    "            'Empty object accepts all items',\n" +
    "            'OO-filter'\n" +
    "          ],\n" +
    "          'find': [\n" +
    "            '{\"a\":1,\"b\":4}',\n" +
    "            'undefined when not found',\n" +
    "            'undefined when searching empty list',\n" +
    "            'works on objects',\n" +
    "            'undefined',\n" +
    "            'called with context'\n" +
    "          ],\n" +
    "          'findWhere': [\n" +
    "            'checks properties given function'\n" +
    "          ],\n" +
    "          'groupBy': [\n" +
    "            'true'\n" +
    "          ],\n" +
    "          'includes': [\n" +
    "            \"doesn't delegate to binary search\"\n" +
    "          ],\n" +
    "          'invoke': [\n" +
    "            'handles null & undefined'\n" +
    "          ],\n" +
    "          'map': [\n" +
    "            'tripled numbers with context',\n" +
    "            'OO-style doubled numbers'\n" +
    "          ],\n" +
    "          'max': [\n" +
    "            'can handle null/undefined',\n" +
    "            'can perform a computation-based max',\n" +
    "            'Maximum value of an empty object',\n" +
    "            'Maximum value of an empty array',\n" +
    "            'Maximum value of a non-numeric collection',\n" +
    "            'Finds correct max in array starting with num and containing a NaN',\n" +
    "            'Finds correct max in array starting with NaN',\n" +
    "            'Respects iterator return value of -Infinity',\n" +
    "            'String keys use property iterator',\n" +
    "            'Iterator context',\n" +
    "            'Lookup falsy iterator'\n" +
    "          ],\n" +
    "          'min': [\n" +
    "            'can handle null/undefined',\n" +
    "            'can perform a computation-based min',\n" +
    "            'Minimum value of an empty object',\n" +
    "            'Minimum value of an empty array',\n" +
    "            'Minimum value of a non-numeric collection',\n" +
    "            'Finds correct min in array starting with NaN',\n" +
    "            'Respects iterator return value of Infinity',\n" +
    "            'String keys use property iterator',\n" +
    "            'Iterator context',\n" +
    "            'Lookup falsy iterator'\n" +
    "          ],\n" +
    "          'partition': [\n" +
    "            'can reference the array index',\n" +
    "            'Died on test #8',\n" +
    "            'partition takes a context argument',\n" +
    "            'function(a){[code]}'\n" +
    "          ],\n" +
    "          'pluck': [\n" +
    "            '[1]'\n" +
    "          ],\n" +
    "          'reduce': [\n" +
    "            'can reduce with a context object'\n" +
    "          ],\n" +
    "          'reject': [\n" +
    "            'Returns empty list given empty array'\n" +
    "          ],\n" +
    "          'sample': [\n" +
    "            'behaves correctly on negative n',\n" +
    "            'Died on test #3'\n" +
    "          ],\n" +
    "          'some': [\n" +
    "            'Can be called with object',\n" +
    "            'Died on test #17',\n" +
    "            'context works'\n" +
    "          ],\n" +
    "          'where': [\n" +
    "            'checks properties given function'\n" +
    "          ],\n" +
    "          'Can use various collection methods on NodeLists': [\n" +
    "            '<span id=\"id2\"></span>',\n" +
    "            '<span id=\"id1\"></span>'\n" +
    "          ]\n" +
    "        },\n" +
    "        'Functions': {\n" +
    "          'debounce asap': true,\n" +
    "          'debounce asap cancel': true,\n" +
    "          'debounce after system time is set backwards': true,\n" +
    "          'debounce asap recursively': true,\n" +
    "          'throttle repeatedly with results': true,\n" +
    "          'more throttle does not trigger leading call when leading is set to false': true,\n" +
    "          'throttle does not trigger trailing call when trailing is set to false': true,\n" +
    "          'before': [\n" +
    "            'stores a memo to the last value',\n" +
    "            'provides context'\n" +
    "          ],\n" +
    "          'bind': [\n" +
    "            'Died on test #2'\n" +
    "          ],\n" +
    "          'bindAll': [\n" +
    "            'throws an error for bindAll with no functions named'\n" +
    "          ],\n" +
    "          'memoize': [\n" +
    "            '{\"bar\":\"BAR\",\"foo\":\"FOO\"}',\n" +
    "            'Died on test #8'\n" +
    "          ],\n" +
    "          'partial':[\n" +
    "            'can partially apply with placeholders',\n" +
    "            'accepts more arguments than the number of placeholders',\n" +
    "            'accepts fewer arguments than the number of placeholders',\n" +
    "            'unfilled placeholders are undefined',\n" +
    "            'keeps prototype',\n" +
    "            'allows the placeholder to be swapped out'\n" +
    "          ]\n" +
    "        },\n" +
    "        'Objects': {\n" +
    "          '#1929 Typed Array constructors are functions': true,\n" +
    "          'allKeys': [\n" +
    "            'is not fooled by sparse arrays; see issue #95',\n" +
    "            'is not fooled by sparse arrays with additional properties',\n" +
    "            '[]'\n" +
    "          ],\n" +
    "          'defaults': [\n" +
    "            'defaults skips nulls',\n" +
    "            'defaults skips undefined'\n" +
    "          ],\n" +
    "          'extend': [\n" +
    "            'extending null results in null',\n" +
    "            'extending undefined results in undefined'\n" +
    "          ],\n" +
    "          'extendOwn': [\n" +
    "            'extending non-objects results in returning the non-object value',\n" +
    "            'extending undefined results in undefined'\n" +
    "          ],\n" +
    "          'functions': [\n" +
    "            'also looks up functions on the prototype'\n" +
    "          ],\n" +
    "          'isEqual': [\n" +
    "            '`0` is not equal to `-0`',\n" +
    "            'Commutative equality is implemented for `0` and `-0`',\n" +
    "            '`new Number(0)` and `-0` are not equal',\n" +
    "            'Commutative equality is implemented for `new Number(0)` and `-0`',\n" +
    "            'false'\n" +
    "          ],\n" +
    "          'isFinite': [\n" +
    "            'Numeric strings are numbers',\n" +
    "            'Number instances can be finite'\n" +
    "          ],\n" +
    "          'isMatch': [\n" +
    "            'doesnt falsey match constructor on undefined/null'\n" +
    "          ],\n" +
    "          'findKey': [\n" +
    "            'called with context'\n" +
    "          ],\n" +
    "          'keys': [\n" +
    "            'is not fooled by sparse arrays; see issue #95',\n" +
    "            '[]'\n" +
    "          ],\n" +
    "          'mapObject': [\n" +
    "            'keep context',\n" +
    "            'called with context',\n" +
    "            'mapValue identity'\n" +
    "          ],\n" +
    "          'matcher': [\n" +
    "            'null matches null',\n" +
    "            'treats primitives as empty'\n" +
    "          ],\n" +
    "          'omit': [\n" +
    "            'can accept a predicate',\n" +
    "            'function is given context'\n" +
    "          ],\n" +
    "          'pick': [\n" +
    "            'can accept a predicate and context',\n" +
    "            'function is given context'\n" +
    "          ]\n" +
    "        },\n" +
    "        'Utility': {\n" +
    "          'noConflict (node vm)': true,\n" +
    "          'now': [\n" +
    "            'Produces the correct time in milliseconds'\n" +
    "          ],\n" +
    "          'times': [\n" +
    "            'works as a wrapper'\n" +
    "          ]\n" +
    "        }\n" +
    "      };\n" +
    "\n" +
    "      var mixinPrereqs = (function() {\n" +
    "        var aliasToReal = {\n" +
    "          'all': 'every',\n" +
    "          'allKeys': 'keysIn',\n" +
    "          'any': 'some',\n" +
    "          'collect': 'map',\n" +
    "          'compose': 'flowRight',\n" +
    "          'contains': 'includes',\n" +
    "          'detect': 'find',\n" +
    "          'extendOwn': 'assign',\n" +
    "          'findWhere': 'find',\n" +
    "          'foldl': 'reduce',\n" +
    "          'foldr': 'reduceRight',\n" +
    "          'include': 'includes',\n" +
    "          'indexBy': 'keyBy',\n" +
    "          'inject': 'reduce',\n" +
    "          'invoke': 'invokeMap',\n" +
    "          'mapObject': 'mapValues',\n" +
    "          'matcher': 'matches',\n" +
    "          'methods': 'functions',\n" +
    "          'object': 'zipObject',\n" +
    "          'pairs': 'toPairs',\n" +
    "          'pluck': 'map',\n" +
    "          'restParam': 'restArgs',\n" +
    "          'select': 'filter',\n" +
    "          'unique': 'uniq',\n" +
    "          'where': 'filter'\n" +
    "        };\n" +
    "\n" +
    "        var keyMap = {\n" +
    "          'rest': 'tail',\n" +
    "          'restArgs': 'rest'\n" +
    "        };\n" +
    "\n" +
    "        var lodash = _.noConflict();\n" +
    "\n" +
    "        return function(_) {\n" +
    "          lodash.defaultsDeep(_, { 'templateSettings': lodash.templateSettings });\n" +
    "          lodash.mixin(_, lodash.pick(lodash, lodash.difference(lodash.functions(lodash), lodash.functions(_))));\n" +
    "\n" +
    "          lodash.forOwn(keyMap, function(realName, otherName) {\n" +
    "            _[otherName] = lodash[realName];\n" +
    "            _.prototype[otherName] = lodash.prototype[realName];\n" +
    "          });\n" +
    "\n" +
    "          lodash.forOwn(aliasToReal, function(realName, alias) {\n" +
    "            _[alias] = _[realName];\n" +
    "            _.prototype[alias] = _.prototype[realName];\n" +
    "          });\n" +
    "        };\n" +
    "      }());\n" +
    "\n" +
    "      // Only excuse in Sauce Labs.\n" +
    "      if (!ui.isSauceLabs) {\n" +
    "        delete QUnit.config.excused.Functions['throttle repeatedly with results'];\n" +
    "        delete QUnit.config.excused.Functions['more throttle does not trigger leading call when leading is set to false'];\n" +
    "        delete QUnit.config.excused.Functions['throttle does not trigger trailing call when trailing is set to false'];\n" +
    "        delete QUnit.config.excused.Utility.now;\n" +
    "      }\n" +
    "      // Load prerequisite scripts.\n" +
    "      document.write(ui.urlParams.loader == 'none'\n" +
    "        ? '<script src=\"' + ui.buildPath + '\"><\\/script>'\n" +
    "        : '<script data-dojo-config=\"async:1\" src=\"' + ui.loaderPath + '\"><\\/script>'\n" +
    "      );\n" +
    "    </script>\n" +
    "    <script>\n" +
    "      if (ui.urlParams.loader == 'none') {\n" +
    "        mixinPrereqs(_);\n" +
    "        document.write([\n" +
    "          '<script src=\"../vendor/underscore/test/collections.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/underscore/test/arrays.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/underscore/test/functions.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/underscore/test/objects.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/underscore/test/cross-document.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/underscore/test/utility.js\"><\\/script>',\n" +
    "          '<script src=\"../vendor/underscore/test/chaining.js\"><\\/script>'\n" +
    "        ].join('\\n'));\n" +
    "      }\n" +
    "    </script>\n" +
    "    <script>\n" +
    "      (function() {\n" +
    "        if (window.curl) {\n" +
    "          curl.config({ 'apiName': 'require' });\n" +
    "        }\n" +
    "        if (!window.require) {\n" +
    "          return;\n" +
    "        }\n" +
    "        // Wrap to work around tests assuming Node `require` use.\n" +
    "        require = (function(func) {\n" +
    "          return function() {\n" +
    "            return arguments[0] === '..' ? window._ : func.apply(null, arguments);\n" +
    "          };\n" +
    "        }(require));\n" +
    "\n" +
    "        var reBasename = /[\\w.-]+$/,\n" +
    "            basePath = ('//' + location.host + location.pathname.replace(reBasename, '')).replace(/\\btest\\/$/, ''),\n" +
    "            modulePath = ui.buildPath.replace(/\\.js$/, ''),\n" +
    "            locationPath = modulePath.replace(reBasename, '').replace(/^\\/|\\/$/g, ''),\n" +
    "            moduleId = /\\bunderscore\\b/i.test(ui.buildPath) ? 'underscore' : 'lodash',\n" +
    "            moduleMain = modulePath.match(reBasename)[0],\n" +
    "            uid = +new Date;\n" +
    "\n" +
    "        function getConfig() {\n" +
    "          var result = {\n" +
    "            'baseUrl': './',\n" +
    "            'urlArgs': 't=' + uid++,\n" +
    "            'waitSeconds': 0,\n" +
    "            'paths': {},\n" +
    "            'packages': [{\n" +
    "              'name': 'test',\n" +
    "              'location': '../vendor/underscore/test',\n" +
    "              'config': {\n" +
    "                // Work around no global being exported.\n" +
    "                'exports': 'QUnit',\n" +
    "                'loader': 'curl/loader/legacy'\n" +
    "              }\n" +
    "            }]\n" +
    "          };\n" +
    "\n" +
    "          if (ui.isModularize) {\n" +
    "            result.packages.push({\n" +
    "              'name': moduleId,\n" +
    "              'location': locationPath,\n" +
    "              'main': moduleMain\n" +
    "            });\n" +
    "          } else {\n" +
    "            result.paths[moduleId] = modulePath;\n" +
    "          }\n" +
    "          return result;\n" +
    "        }\n" +
    "\n" +
    "        QUnit.config.autostart = false;\n" +
    "\n" +
    "        require(getConfig(), [moduleId], function(lodash) {\n" +
    "          mixinPrereqs(lodash);\n" +
    "          require(getConfig(), [\n" +
    "            'test/collections',\n" +
    "            'test/arrays',\n" +
    "            'test/functions',\n" +
    "            'test/objects',\n" +
    "            'test/cross-document',\n" +
    "            'test/utility',\n" +
    "            'test/chaining'\n" +
    "          ], function() {\n" +
    "            QUnit.start();\n" +
    "          });\n" +
    "        });\n" +
    "      }());\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>\n"
  );


  $templateCache.put('lib/lodash/vendor/firebug-lite/skin/xp/firebug.html',
    "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/DTD/strict.dtd\">\n" +
    "<html>\n" +
    "<head>\n" +
    "<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n" +
    "<title>Firebug Lite</title>\n" +
    "<!-- An empty script to avoid FOUC when loading the stylesheet -->\n" +
    "<script type=\"text/javascript\"></script>\n" +
    "<style type=\"text/css\" media=\"screen\">@import \"firebug.css\";</style>\n" +
    "<style>html,body{margin:0;padding:0;overflow:hidden;}</style>\n" +
    "</head>\n" +
    "<body class=\"fbBody\">\n" +
    "<table id=\"fbChrome\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
    "  <tbody>\n" +
    "    <tr>\n" +
    "      <!-- Interface - Top Area -->\n" +
    "      <td id=\"fbTop\" colspan=\"2\">\n" +
    "      \n" +
    "        <!-- \n" +
    "        <div>\n" +
    "          --><!-- <span id=\"fbToolbarErrors\" class=\"fbErrors\">2 errors</span> --><!-- \n" +
    "          <input type=\"text\" id=\"fbToolbarSearch\" />\n" +
    "        </div>\n" +
    "        -->\n" +
    "              \n" +
    "        <!-- Window Buttons -->\n" +
    "        <div id=\"fbWindowButtons\">\n" +
    "          <a id=\"fbWindow_btDeactivate\" class=\"fbSmallButton fbHover\" title=\"Deactivate Firebug for this web page\">&nbsp;</a>\n" +
    "          <a id=\"fbWindow_btDetach\" class=\"fbSmallButton fbHover\" title=\"Open Firebug in popup window\">&nbsp;</a>\n" +
    "          <a id=\"fbWindow_btClose\" class=\"fbSmallButton fbHover\" title=\"Minimize Firebug\">&nbsp;</a>\n" +
    "        </div>\n" +
    "        \n" +
    "        <!-- Toolbar buttons and Status Bar -->\n" +
    "        <div id=\"fbToolbar\">\n" +
    "          <div id=\"fbToolbarContent\">\n" +
    "        \n" +
    "          <!-- Firebug Button -->\n" +
    "          <span id=\"fbToolbarIcon\">\n" +
    "            <a id=\"fbFirebugButton\" class=\"fbIconButton\" class=\"fbHover\" target=\"_blank\">&nbsp;</a>\n" +
    "          </span>\n" +
    "          \n" +
    "          <!-- \n" +
    "          <span id=\"fbLeftToolbarErrors\" class=\"fbErrors\">2 errors</span>\n" +
    "           -->\n" +
    "           \n" +
    "          <!-- Toolbar Buttons -->\n" +
    "          <span id=\"fbToolbarButtons\">\n" +
    "            <!-- Fixed Toolbar Buttons -->\n" +
    "            <span id=\"fbFixedButtons\">\n" +
    "                <a id=\"fbChrome_btInspect\" class=\"fbButton fbHover\" title=\"Click an element in the page to inspect\">Inspect</a>\n" +
    "            </span>\n" +
    "            \n" +
    "            <!-- Console Panel Toolbar Buttons -->\n" +
    "            <span id=\"fbConsoleButtons\" class=\"fbToolbarButtons\">\n" +
    "              <a id=\"fbConsole_btClear\" class=\"fbButton fbHover\" title=\"Clear the console\">Clear</a>\n" +
    "            </span>\n" +
    "            \n" +
    "            <!-- HTML Panel Toolbar Buttons -->\n" +
    "            <!-- \n" +
    "            <span id=\"fbHTMLButtons\" class=\"fbToolbarButtons\">\n" +
    "              <a id=\"fbHTML_btEdit\" class=\"fbHover\" title=\"Edit this HTML\">Edit</a>\n" +
    "            </span>\n" +
    "             -->\n" +
    "          </span>\n" +
    "          \n" +
    "          <!-- Status Bar -->\n" +
    "          <span id=\"fbStatusBarBox\">\n" +
    "            <span class=\"fbToolbarSeparator\"></span>\n" +
    "            <!-- HTML Panel Status Bar -->\n" +
    "            <!-- \n" +
    "            <span id=\"fbHTMLStatusBar\" class=\"fbStatusBar fbToolbarButtons\">\n" +
    "            </span>\n" +
    "             -->\n" +
    "          </span>\n" +
    "          \n" +
    "          </div>\n" +
    "          \n" +
    "        </div>\n" +
    "        \n" +
    "        <!-- PanelBars -->\n" +
    "        <div id=\"fbPanelBarBox\">\n" +
    "        \n" +
    "          <!-- Main PanelBar -->\n" +
    "          <div id=\"fbPanelBar1\" class=\"fbPanelBar\">\n" +
    "            <a id=\"fbConsoleTab\" class=\"fbTab fbHover\">\n" +
    "                <span class=\"fbTabL\"></span>\n" +
    "                <span class=\"fbTabText\">Console</span>\n" +
    "                <span class=\"fbTabMenuTarget\"></span>\n" +
    "                <span class=\"fbTabR\"></span>\n" +
    "            </a>\n" +
    "            <a id=\"fbHTMLTab\" class=\"fbTab fbHover\">\n" +
    "                <span class=\"fbTabL\"></span>\n" +
    "                <span class=\"fbTabText\">HTML</span>\n" +
    "                <span class=\"fbTabR\"></span>\n" +
    "            </a>\n" +
    "            <a class=\"fbTab fbHover\">\n" +
    "                <span class=\"fbTabL\"></span>\n" +
    "                <span class=\"fbTabText\">CSS</span>\n" +
    "                <span class=\"fbTabR\"></span>\n" +
    "            </a>\n" +
    "            <a class=\"fbTab fbHover\">\n" +
    "                <span class=\"fbTabL\"></span>\n" +
    "                <span class=\"fbTabText\">Script</span>\n" +
    "                <span class=\"fbTabR\"></span>\n" +
    "            </a>\n" +
    "            <a class=\"fbTab fbHover\">\n" +
    "                <span class=\"fbTabL\"></span>\n" +
    "                <span class=\"fbTabText\">DOM</span>\n" +
    "                <span class=\"fbTabR\"></span>\n" +
    "            </a>\n" +
    "          </div>\n" +
    "\n" +
    "          <!-- Side PanelBars -->\n" +
    "          <div id=\"fbPanelBar2Box\" class=\"hide\">\n" +
    "            <div id=\"fbPanelBar2\" class=\"fbPanelBar\">\n" +
    "            <!-- \n" +
    "              <a class=\"fbTab fbHover\">\n" +
    "                <span class=\"fbTabL\"></span>\n" +
    "                <span class=\"fbTabText\">Style</span>\n" +
    "                <span class=\"fbTabR\"></span>\n" +
    "              </a>\n" +
    "              <a class=\"fbTab fbHover\">\n" +
    "                <span class=\"fbTabL\"></span>\n" +
    "                <span class=\"fbTabText\">Layout</span>\n" +
    "                <span class=\"fbTabR\"></span>\n" +
    "              </a>\n" +
    "              <a class=\"fbTab fbHover\">\n" +
    "                <span class=\"fbTabL\"></span>\n" +
    "                <span class=\"fbTabText\">DOM</span>\n" +
    "                <span class=\"fbTabR\"></span>\n" +
    "              </a>\n" +
    "           -->\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          \n" +
    "        </div>\n" +
    "        \n" +
    "        <!-- Horizontal Splitter -->\n" +
    "        <div id=\"fbHSplitter\">&nbsp;</div>\n" +
    "        \n" +
    "      </td>\n" +
    "    </tr>\n" +
    "    \n" +
    "    <!-- Interface - Main Area -->\n" +
    "    <tr id=\"fbContent\">\n" +
    "    \n" +
    "      <!-- Panels  -->\n" +
    "      <td id=\"fbPanelBox1\">\n" +
    "        <div id=\"fbPanel1\" class=\"fbFitHeight\">\n" +
    "          <div id=\"fbConsole\" class=\"fbPanel\"></div>\n" +
    "          <div id=\"fbHTML\" class=\"fbPanel\"></div>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "      \n" +
    "      <!-- Side Panel Box -->\n" +
    "      <td id=\"fbPanelBox2\" class=\"hide\">\n" +
    "      \n" +
    "        <!-- VerticalSplitter -->\n" +
    "        <div id=\"fbVSplitter\" class=\"fbVSplitter\">&nbsp;</div>\n" +
    "        \n" +
    "        <!-- Side Panels -->\n" +
    "        <div id=\"fbPanel2\" class=\"fbFitHeight\">\n" +
    "        \n" +
    "          <!-- HTML Side Panels -->\n" +
    "          <div id=\"fbHTML_Style\" class=\"fbPanel\"></div>\n" +
    "          <div id=\"fbHTML_Layout\" class=\"fbPanel\"></div>\n" +
    "          <div id=\"fbHTML_DOM\" class=\"fbPanel\"></div>\n" +
    "          \n" +
    "        </div>\n" +
    "        \n" +
    "        <!-- Large Command Line -->\n" +
    "        <textarea id=\"fbLargeCommandLine\" class=\"fbFitHeight\"></textarea>\n" +
    "        \n" +
    "        <!-- Large Command Line Buttons -->\n" +
    "        <div id=\"fbLargeCommandButtons\">\n" +
    "            <a id=\"fbCommand_btRun\" class=\"fbButton fbHover\">Run</a>\n" +
    "            <a id=\"fbCommand_btClear\" class=\"fbButton fbHover\">Clear</a>\n" +
    "            \n" +
    "            <a id=\"fbSmallCommandLineIcon\" class=\"fbSmallButton fbHover\"></a>\n" +
    "        </div>\n" +
    "        \n" +
    "      </td>\n" +
    "      \n" +
    "    </tr>\n" +
    "    \n" +
    "    <!-- Interface - Bottom Area -->\n" +
    "    <tr id=\"fbBottom\" class=\"hide\">\n" +
    "    \n" +
    "      <!-- Command Line -->\n" +
    "      <td id=\"fbCommand\" colspan=\"2\">\n" +
    "        <div id=\"fbCommandBox\">\n" +
    "          <div id=\"fbCommandIcon\">&gt;&gt;&gt;</div>\n" +
    "          <input id=\"fbCommandLine\" name=\"fbCommandLine\" type=\"text\" />\n" +
    "          <a id=\"fbLargeCommandLineIcon\" class=\"fbSmallButton fbHover\"></a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "      \n" +
    "    </tr>\n" +
    "    \n" +
    "  </tbody>\n" +
    "</table> \n" +
    "<span id=\"fbMiniChrome\">\n" +
    "  <span id=\"fbMiniContent\">\n" +
    "    <span id=\"fbMiniIcon\" title=\"Open Firebug Lite\"></span>\n" +
    "    <span id=\"fbMiniErrors\" class=\"fbErrors\"><!-- 2 errors --></span>\n" +
    "  </span>\n" +
    "</span>\n" +
    "<!-- \n" +
    "<div id=\"fbErrorPopup\">\n" +
    "  <div id=\"fbErrorPopupContent\">\n" +
    "    <div id=\"fbErrorIndicator\" class=\"fbErrors\">2 errors</div>\n" +
    "  </div>\n" +
    "</div>\n" +
    " -->\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('loaderio-30bf3d04e2a06876357265dae10aa1b5.html',
    "loaderio-30bf3d04e2a06876357265dae10aa1b5\n"
  );


  $templateCache.put('loaderio-9d5682a238a599101f965cae44771e88.html',
    "loaderio-9d5682a238a599101f965cae44771e88\n"
  );


  $templateCache.put('mobile.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width\">\n" +
    "    <title></title>\n" +
    "\n" +
    "    <link href=\"lib/ionic/release/css/ionic.css\" rel=\"stylesheet\">\n" +
    "    <link href=\"css/proxyshift.css\" rel=\"stylesheet\">\n" +
    "    <link rel=\"stylesheet\" type=\"text/css\" href=\"lib/angular-toastr/dist/angular-toastr.css\">\n" +
    "\n" +
    "    <!-- In windows apps this fixes dynamic content errors -->\n" +
    "    <script src=\"lib/winstore-jscompat/winstore-jscompat.js\"></script>\n" +
    "    <script src=\"lib/ionic/release/js/ionic.bundle.min.js\"></script>\n" +
    "    <script src=\"lib/validator-js/validator.min.js\"></script>\n" +
    "    <script src=\"lib/angular-toastr/dist/angular-toastr.tpls.js\"></script>\n" +
    "    <script src=\"lib/ng-material-floating-button/src/mfb-directive.js\"></script>\n" +
    "    <script src=\"libs.min.js\"></script>\n" +
    "    <script src=\"template.js\"></script>\n" +
    "</head>\n" +
    "<body ng-app=\"scheduling-app\">\n" +
    "<ion-nav-view></ion-nav-view>\n" +
    "<noscript>\n" +
    "    <div class=\"login-container centered-input\">\n" +
    "        <div>\n" +
    "            <form>\n" +
    "                <div class=\"list list-inset\">\n" +
    "                    <a href=\"/\"><img src=\"img/logo.png\" class=\"logo\"></a>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <i class=\"icon ion-email placeholder-icon\"></i>\n" +
    "                        <input  type=\"text\" ng-model=\"user.username\" placeholder=\"Username or email\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <i class=\"icon ion-locked placeholder-icon\"></i>\n" +
    "                        <input  type=\"password\" ng-model=\"user.password\" placeholder=\"Password\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item login-error-message\" ng-show=\"message != null\">\n" +
    "                        <span>Proxy/Shift requires Javascript to be enabled.</span>\n" +
    "                    </label>\n" +
    "                    <button disabled class=\"button button-block\" type=\"submit\">Log in</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</noscript>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('partials/loginLogoutButton.html',
    "<div ng-show=\"authenticated == false\" ng-click=\"login()\">\n" +
    "    <a>Login</a>\n" +
    "</div>\n" +
    "<div ng-show=\"authenticated == true\" ng-click=\"logout()\">\n" +
    "    <a>Logout</a>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/_login.html',
    "<div class=\"login-container centered-input\">\n" +
    "    <div>\n" +
    "        <form ng-submit=\"login()\">\n" +
    "            <div class=\"list list-inset\">\n" +
    "                <img src=\"img/logo.png\" class=\"logo\">\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <i class=\"icon ion-email placeholder-icon\"></i>\n" +
    "                    <input type=\"text\" ng-model=\"user.username\" placeholder=\"Username or email\">\n" +
    "                </label>\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <i class=\"icon ion-locked placeholder-icon\"></i>\n" +
    "                    <input type=\"password\" ng-model=\"user.password\" placeholder=\"Password\">\n" +
    "                </label>\n" +
    "                <!--\n" +
    "                <label class=\"item item-toggle\">\n" +
    "                    Keep me logged in\n" +
    "                    <label class=\"toggle\">\n" +
    "                        <input type=\"checkbox\" id=\"remember_me\" name=\"remember_me\" ng-model=\"user.remember_me\">\n" +
    "                        <div class=\"track\">\n" +
    "                            <div class=\"handle\"></div>\n" +
    "                        </div>\n" +
    "                    </label>\n" +
    "                </label>\n" +
    "                -->\n" +
    "                <label class=\"item login-error-message\" ng-show=\"message != null\">\n" +
    "                    <span>{{message}}</span>\n" +
    "                </label>\n" +
    "                <button class=\"button button-block\" type=\"submit\">Log in</button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"forgot-password\">\n" +
    "        <p>\n" +
    "            <a ng-click=\"forgot()\" href=\"#\">Forgot your password?</a>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--\n" +
    "    <div class=\"new-account\">\n" +
    "        <p>Don't have an account? <a ng-click=\"signup()\" href=\"#\">Create one</a></p>\n" +
    "    </div>\n" +
    "    -->\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('templates/_openshifts.html',
    "<ion-item\n" +
    "    ng-show=\"AllShifts\"\n" +
    "    class=\"item item-icon-right\" ng-repeat=\"shift in AllShifts\">\n" +
    "    <h2>{{getReadableLocalShiftStartTime(shift)}} - {{getReadableLocalShiftEndTime(shift)}} - {{getReadableLocalShiftDiffTime(shift)}}</h2>\n" +
    "    <h2 ng-show=\"{{userIsInDifferentTimeZone(shift)}}\">{{getReadableUsersShiftStartTime(shift)}} - {{getReadableUsersShiftEndTime(shift)}} (your time)</h2>\n" +
    "    <p class=\"shift-title\">{{shift.title}}</p>\n" +
    "    <p class=\"location-address\" ng-show=\"{{!shift.sublocation_id}}\">{{getShiftsLocation(shift).address}}</p>\n" +
    "    <p class=\"location-address\" ng-show=\"{{shift.sublocation_id}}\">{{getShiftsLocation(shift).address}} - {{getShiftsSublocation(shift).title}}</p>\n" +
    "    <i class=\"icon ion-close\" ng-click=\"ignoreShift({{shift.id}})\"></i>\n" +
    "    <i class=\"icon ion-close\"></i>\n" +
    "</ion-item>\n" +
    "<ion-item\n" +
    "    ng-hide=\"AllShifts\"\n" +
    "    class=\"item item-icon-right\">\n" +
    "    <p>There are currently no open shifts</p>\n" +
    "</ion-item>\n"
  );


  $templateCache.put('templates/_shiftcalendar.html',
    "<div class=\"calendarWrapper\" ng-show=\"show\">\n" +
    "    <div ng-show=\"calendarData\" class=\"calendar-month\" ng-class=\"{'calendar-loading': calendarData.loading}\">\n" +
    "        <div class=\"arrow-btn-container click-doesnt-close\">\n" +
    "            <a ng-click=\"previousMonth()\" class=\"arrow-btn calendar-back click-doesnt-close\">\n" +
    "                <span class=\"icon ion-chevron-left click-doesnt-close\"></span>\n" +
    "            </a>\n" +
    "                <h4 class=\"titler calendar-now click-doesnt-close\" ng-click=\"currentMonth()\">{{monthData.name}} {{monthData.year}}</h4>\n" +
    "            <a ng-click=\"nextMonth()\" class=\"arrow-btn calendar-next click-doesnt-close\">\n" +
    "                <span class=\"icon ion-chevron-right click-doesnt-close\"></span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <table class=\"calendar\">\n" +
    "            <tr class=\"days-week click-doesnt-close\">\n" +
    "                <th ng-repeat=\"day in weekData\" class=\"click-doesnt-close\">{{day}}</th>\n" +
    "            </tr>\n" +
    "            <tr class=\"calendar-week\" ng-repeat=\"week in calendarData\">\n" +
    "                <td class=\"calendar-day\" ng-repeat=\"day in week\" ng-class=\"{'calendar-day-currentmonth': day.thisMonth, 'calendar-day-othermonth': !day.thisMonth, 'calendar-day-today': day.today}\">\n" +
    "                    <p ng-class=\"{'shift': day.shifts, 'noshift': !day.shifts, 'calendar-day-selected': day.selected}\" ng-click=\"dayClicked(day)\">{{day.number}}<span></span></p>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div ng-hide=\"calendarData\">\n" +
    "        <div class=\"calendar\">\n" +
    "            <div class=\"calendar-loading\">\n" +
    "                Calendar loading...\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/_shiftlist.html',
    "<link href=\"../css/shifts.css\" rel=\"stylesheet\">\n" +
    "<ion-list\n" +
    "    class=\"has-header\"\n" +
    "    show-delete=\"false\"\n" +
    "    show-reorder=\"false\"\n" +
    "    ng-if=\"Model\"\n" +
    "    can-swipe=\"swipable\">\n" +
    "    <div collection-repeat=\"shift in Model\" item-height=\"shift.canceled || (acceptedOnly && (!acceptedOnly || !acceptedOrApprovedShiftOrDivider(shift))) ? 0:(shift.isDivider ? 40:120)\"\n" +
    "         item-width=\"100%\"\n" +
    "         class=\"shift-list\"\n" +
    "         ng-show=\"(!shift.canceled && (!acceptedOnly || (acceptedOnly && acceptedOrApprovedShiftOrDivider(shift))) && markShiftVisible(shift)) || markShiftNotVisible(shift)\">\n" +
    "        <div ng-class=\"{'card': !shift.isDivider, 'divider-card': shift.isDivider, 'applied-to-shift': manageable ? (!shift.isDivider && isShiftApproved(shift)) : (acceptedOnly ? isShiftApproved(shift) : shift.applied), 'ignored-shift': manageable ? (!shift.isDivider && !isShiftAppliedFor(shift)):ignoredShift(shift), 'pending-approval': manageable ? (!shift.isDivider && isShiftAppliedFor(shift) && !isShiftApproved(shift)) : (acceptedOnly ? (shift.applied && !isShiftApproved(shift)) : false)}\">\n" +
    "            <ion-item\n" +
    "                class=\"item\"\n" +
    "                item-height=\"shift.isDivider ? 32:(64 + (4 * 2))\"\n" +
    "                ng-show=\"Model\">\n" +
    "                <a name=\"{{shift.start}}\"></a>\n" +
    "                <div ng-if=\"shift.isDivider && shift.type == 'pendingApproval'\"\n" +
    "                     class=\"shift-item list-padding\">\n" +
    "                    Shifts pending manager approval\n" +
    "                </div>\n" +
    "                <div ng-if=\"shift.isDivider && shift.type == 'noApplications'\"\n" +
    "                     class=\"shift-item list-padding\">\n" +
    "                    Shifts without applications\n" +
    "                </div>\n" +
    "                <div ng-if=\"shift.isDivider && shift.type == 'approved'\"\n" +
    "                     class=\"shift-item list-padding\">\n" +
    "                    Approved shifts\n" +
    "                </div>\n" +
    "                <div ng-if=\"shift.isDivider && shift.type == 'declined'\"\n" +
    "                     class=\"shift-item list-padding\">\n" +
    "                    Declined shifts\n" +
    "                </div>\n" +
    "                <div ng-if=\"shift.isDivider && shift.type == 'expired'\"\n" +
    "                     class=\"shift-item list-padding\">\n" +
    "                    Expired shifts\n" +
    "                </div>\n" +
    "                <div ng-if=\"shift.isDivider && shift.type == 'expiredSeeMore'\"\n" +
    "                     class=\"shift-item list-padding\">\n" +
    "                    <a ui-sref=\"app.expired\">See more expired shifts....</a>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!shift.isDivider\">\n" +
    "                    <div class=\"shift-item list-padding\">\n" +
    "                        <div class=\"shift-left-icon\"><i class=\"icon ion-ios-checkmark-outline\"></i></div>\n" +
    "                        <div ng-class=\"{'shift-expanded': shift.expanded, 'shift-collapsed': !shift.expanded}\">\n" +
    "                            <div class=\"shift-right\">\n" +
    "                                <p class=\"shift-star\" ng-hide=\"{{userIsInDifferentTimeZone(shift)}}\">{{getReadableLocalShiftStartEndTime(shift)}}</p>\n" +
    "                                <p class=\"shift-star\" ng-show=\"{{userIsInDifferentTimeZone(shift)}}\">{{getReadableLocalShiftStartEndTime(shift)}} (local)</p>\n" +
    "                                <p class=\"shift-duration\">{{getReadableShiftDuration(shift)}}</p>\n" +
    "                            </div>\n" +
    "                            <div class=\"shift-info\">\n" +
    "                                <p class=\"shift-location\">{{getShiftsLocation(shift).address || \"UNKNOWN LOCATION\"}}</p>\n" +
    "                                <p class=\"shift-title shift-location-floor\" ng-show=\"{{shift.sublocation_id != undefined && shift.sublocation_id != null}}\">{{getShiftsSublocation(shift).title || \"UNKNOWN\"}} - {{getReadableClassType(shift)}}</p>\n" +
    "                                <p class=\"shift-title\" ng-show=\"{{shift.sublocation_id == undefined || shift.sublocation_id == null}}\">{{getReadableClassType(shift)}}</p>\n" +
    "                                <p class=\"shift-desc\">{{shift.description}}</p>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"shift-bottom\" ng-show=\"shift.expanded\">\n" +
    "                        <button class=\"button button-outline button-positive shift-accept shift-left\">Accept</button>\n" +
    "                        <button class=\"button button-outline button-assertive shift-decline shift-right\">Decline</button>\n" +
    "                    </div>\n" +
    "                    <ion-option-button class=\"shift-button-manage\"\n" +
    "                                       ng-click=\"info(shift)\">\n" +
    "                        Details\n" +
    "                    </ion-option-button>\n" +
    "                    <div ng-if=\"!manageable\">\n" +
    "                        <ion-option-button class=\"shift-button-apply\"\n" +
    "                                           ng-if=\"!shift.applied\"\n" +
    "                                           ng-click=\"accept(shift)\">\n" +
    "                            Apply\n" +
    "                        </ion-option-button>\n" +
    "                        <ion-option-button class=\"shift-button-decline\"\n" +
    "                                           ng-click=\"decline(shift)\"\n" +
    "                                           ng-if=\"shift.applied\">\n" +
    "                            Cancel\n" +
    "                        </ion-option-button>\n" +
    "                        <ion-option-button class=\"shift-button-ignore\"\n" +
    "                                           ng-click=\"ignore(shift)\"\n" +
    "                                           ng-if=\"!shift.applied && !ignoredShift(shift)\">\n" +
    "                            Ignore\n" +
    "                        </ion-option-button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </ion-item>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <ion-item\n" +
    "        ng-show=\"Model.length == 0 && myUserClasses.length > 0\"\n" +
    "        class=\"item item-icon-right\">\n" +
    "        <p>There are currently no open shifts</p>\n" +
    "    </ion-item>\n" +
    "    <ion-item\n" +
    "        ng-show=\"(!Model || Model.length == 0) && !getGroupId()\"\n" +
    "        class=\"item item-icon-right\">\n" +
    "        You are currently not registered with a company. Please contact your manager for an invite link to start receiving shift notifications.\n" +
    "    </ion-item>\n" +
    "    <ion-item\n" +
    "        ng-show=\"(!Model || Model.length == 0) && !hasUserClasses() && getGroupId()\"\n" +
    "        class=\"item item-icon-right\">\n" +
    "        <p>Please <a ui-sref=\"settings.group.jobs({group_id: groupId})\">CLICK HERE</a> to select your job title and select locations you want to receive notifications from.</p>\n" +
    "    </ion-item>\n" +
    "    <!--\n" +
    "    <div class=\"item item-divider\"\n" +
    "         ng-show=\"ignorableShiftsExist()\">\n" +
    "        {{declinedshifttitle}}\n" +
    "    </div>\n" +
    "    -->\n" +
    "</ion-list>\n"
  );


  $templateCache.put('templates/_signup.html',
    ""
  );


  $templateCache.put('templates/_user.html',
    "<ion-list>\n" +
    "    <ion-item ng-repeat=\"user in UsersModel\" href=\"#/app/playlists/{{user.id}}\">\n" +
    "        {{user.username}}\n" +
    "        <ion-option-button class=\"button-steelblue\" ng-click=\"add()\">+</ion-option-button>\n" +
    "    </ion-item>\n" +
    "</ion-list>\n"
  );


  $templateCache.put('templates/browse.html',
    "<ion-view view-title=\"Browse\">\n" +
    "  <ion-content>\n" +
    "    <h1>Browse</h1>\n" +
    "  </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/contactus.html',
    "<ion-view view-title=\"Contact Us\">\n" +
    "    <ion-content>\n" +
    "        Contact us...\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/creategroup.html',
    "<ion-modal-view>\n" +
    "    <ion-header-bar>\n" +
    "        <h1 class=\"title\">Create Company</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div ng-controller=\"CreateGroupController\">\n" +
    "            <form ng-submit=\"doCreate()\">\n" +
    "                <div class=\"list\">\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Company Name</span>\n" +
    "                        <input type=\"text\" ng-model=\"group.name\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">State</span>\n" +
    "                        <input type=\"text\" ng-model=\"group.state\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">City</span>\n" +
    "                        <input type=\"text\" ng-model=\"group.city\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Address</span>\n" +
    "                        <input type=\"text\" ng-model=\"group.address\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">zipcode</span>\n" +
    "                        <input type=\"text\" ng-model=\"group.zipcode\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">URL</span>\n" +
    "                        <input type=\"text\" ng-model=\"group.weburl\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Contact Email</span>\n" +
    "                        <input type=\"text\" ng-model=\"group.contactemail\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Contact Phone</span>\n" +
    "                        <input type=\"text\" ng-model=\"group.contactphone\">\n" +
    "                    </label>\n" +
    "                    <label class=\"item\" ng-show=\"message != null\">\n" +
    "                        <span>{{message}}</span>\n" +
    "                    </label>\n" +
    "                    <button class=\"button button-block button-steelblue\" type=\"submit\">Create</button>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-modal-view>\n"
  );


  $templateCache.put('templates/currentgroupmembers.html',
    "<ion-view view-title=\"Member Management\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list list-inset centered-input\">\n" +
    "            <div class=\"item-indent\">\n" +
    "                <ion-item href=\"#/settings/group/{{group_id}}/invite\" class=\"item-remove-animate\">\n" +
    "                    <i class=\"icon ion-plus\"></i>\n" +
    "                    Member Invite\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Member Management\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                    <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                           ng-change=\"queryChanged(query)\"\n" +
    "                           placeholder=\"Search by name, email or phone\">\n" +
    "                </label>\n" +
    "                <ion-list>\n" +
    "                    <ion-item ng-repeat=\"user in users | filter:query\"\n" +
    "                        href=\"#/settings/group/{{group_id}}/members/{{ user.id }}/manage\">\n" +
    "                        {{ user.firstname }} {{ user.lastname }}\n" +
    "                    </ion-item>\n" +
    "                </ion-list>\n" +
    "                <ion-infinite-scroll\n" +
    "                    ng-if=\"moreToLoad()\"\n" +
    "                    on-infinite=\"loadMore()\"\n" +
    "                    distance=\"20%\">\n" +
    "                </ion-infinite-scroll>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/currentlocations.html',
    "<ion-view view-title=\"Location\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list list-inset centered-input\">\n" +
    "            <div class=\"item-indent\">\n" +
    "                <ion-item href=\"#/settings/group/{{group_id}}/newlocation\">\n" +
    "                    <i class=\"icon ion-plus\"></i>\n" +
    "                    New Location\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Current Locations\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                    <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                           placeholder=\"Search by name, email or phone\">\n" +
    "                </label>\n" +
    "                <div class=\"list\">\n" +
    "                    <ion-item ng-repeat=\"location in locations | filter:query\"\n" +
    "                              item=\"location\"\n" +
    "                              href=\"#/settings/group/{{group_id}}/locations/{{ location.id }}/list\">\n" +
    "                        {{ location.title }}\n" +
    "                    </ion-item>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/expired/_expired.html',
    "<shift-list dismissable=\"false\" name=\"{{getName()}}\"></shift-list>\n"
  );


  $templateCache.put('templates/expired/expired.html',
    "<ion-view can-swipe-back=\"false\">\n" +
    "    <ion-header-bar align-title=\"left\" class=\"bar-positive\">\n" +
    "        <h1 class=\"title\">Expired</h1>\n" +
    "        <div class=\"buttons\" side=\"right\">\n" +
    "            <button class=\"button button-icon ion-close\" ng-click=\"close()\"></button>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header\">\n" +
    "        <expired-list model=\"shift\" method=\"expiredMine\"></expired-list>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/forgotpassword.html',
    "<ion-modal-view>\n" +
    "    <ion-header-bar>\n" +
    "        <h1 class=\"title\">Reset password</h1>\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button button-clear\" ng-click=\"closeForgotPassword()\">Close</button>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div ng-controller=\"SignupController\">\n" +
    "            <form name=\"passwordResetForm\" ng-submit=\"forgotPassword(passwordResetForm.$valid)\" novalidate>\n" +
    "                <div class=\"list\">\n" +
    "                    <div class=\"item\">\n" +
    "                        Enter your username or email and we'll send an email shortly\n" +
    "                    </div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Username or email</span>\n" +
    "                        <input type=\"text\" name=\"username\" ng-model=\"usernameOrPassword\" validate-user-username>\n" +
    "                    </label>\n" +
    "                    <button class=\"button button-block button-steelblue\" type=\"submit\">Reset password</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-modal-view>\n"
  );


  $templateCache.put('templates/groupinvitation.html',
    "<ion-view can-swipe-back=\"false\">\n" +
    "    <ion-header-bar>\n" +
    "        <h1 class=\"title\">Group Invitation</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <ion-item>\n" +
    "            You have been Invited as a {{ groupRole }} to the group below.\n" +
    "        </ion-item>\n" +
    "        <div class=\"item item-divider\">\n" +
    "            Invitation Details\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <form name=\"subclassForm\" ng-submit=\"createSubclass(subclassForm)\">\n" +
    "                <div class=\"list\">\n" +
    "                    <div class=\"row\" ng-repeat=\"item in groupDetails\">\n" +
    "                        <div class=\"col col-25\">{{ item.description }}:</div>\n" +
    "                        <div class=\"col col-25\">{{ item.data }}</div>\n" +
    "                    </div>\n" +
    "                    <button class=\"button button-block button-steelblue\" type=\"submit\">Accept Invitation</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/grouplocationsmanageusers.html',
    "<ion-view view-title=\"Members\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"item item-divider\">\n" +
    "            Navigation\n" +
    "        </div>\n" +
    "        <ion-item href=\"#/settings/group/{{group_id}}/invite\" class=\"item-remove-animate\">\n" +
    "            Invitation page\n" +
    "        </ion-item>\n" +
    "        <div class=\"item item-divider\">\n" +
    "            Subscribed Members\n" +
    "        </div>\n" +
    "        <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "        <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "               placeholder=\"Search by name, email or phone\">\n" +
    "        <div class=\"list\">\n" +
    "            <ion-item ng-repeat=\"user in users | filter:query\">\n" +
    "                {{ user.firstname }}\n" +
    "            </ion-item>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/groupmembers.html',
    "<ion-header-bar>\n" +
    "    <h1 class=\"title\"> {{ pageTitle }}</h1>\n" +
    "    <div class=\"buttons\">\n" +
    "        <button class=\"button button-icon ion-close\"></button>\n" +
    "    </div>\n" +
    "</ion-header-bar>\n" +
    "<ion-nav-view name=\"groupmembersContent\" class=\"has-header\">\n" +
    "\n" +
    "</ion-nav-view>\n"
  );


  $templateCache.put('templates/groups.html',
    "<ion-view view-title=\"Companies\" can-swipe-back=\"false\">\n" +
    "    <ion-content>\n" +
    "        <ion-list>\n" +
    "            <ion-item ng-repeat=\"group in GroupsModel\" href=\"#/app/groups/{{group.id}}/settings\">\n" +
    "                {{group.name}}\n" +
    "                <ion-option-button class=\"button-steelblue\" ng-click=\"add()\">+</ion-option-button>\n" +
    "            </ion-item>\n" +
    "        </ion-list>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/groupsettings.html',
    "<ion-view view-title=\"Group\" hide-back-button=\"false\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\">\n" +
    "        <div class=\"list\">\n" +
    "            <div ng-if=\"isPrivilegedGroupMember()\">\n" +
    "                <div class=\"item item-divider\">\n" +
    "                    Management\n" +
    "                </div>\n" +
    "                <div class=\"item-indent\">\n" +
    "                    <ion-item href=\"#/settings/group/{{group_id}}/members\" class=\"item-remove-animate\">\n" +
    "                        Member Management\n" +
    "                    </ion-item>\n" +
    "                    <ion-item href=\"#/settings/group/{{group_id}}/locations/current\" class=\"item-remove-animate\">\n" +
    "                        Location Management\n" +
    "                    </ion-item>\n" +
    "                    <ion-item href=\"#/settings/group/{{group_id}}/types\" class=\"item-remove-animate\">\n" +
    "                        Job types\n" +
    "                    </ion-item>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Manager Appointed Settings\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <ion-toggle ng-model=\"GroupSettings.allowalltocreateshifts\"\n" +
    "                            ng-checked=\"GroupSettings.allowalltocreateshifts\"\n" +
    "                            ng-disabled=\"!isPrivilegedGroupMember()\"\n" +
    "                            ng-click=\"saveSettings()\">\n" +
    "                    Everyone can create shifts\n" +
    "                </ion-toggle>\n" +
    "                <ion-toggle ng-model=\"GroupSettings.requireshiftconfirmation\"\n" +
    "                            ng-checked=\"GroupSettings.requireshiftconfirmation\"\n" +
    "                            ng-disabled=\"!isPrivilegedGroupMember()\"\n" +
    "                            ng-click=\"saveSettings()\">\n" +
    "                    Shifts require confirmation\n" +
    "                </ion-toggle>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                My Settings\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <ion-item href=\"#/settings/group/{{group_id}}/locations/subscription\" class=\"item-remove-animate\">\n" +
    "                    My Location Subscriptions\n" +
    "                </ion-item>\n" +
    "                <ion-item href=\"#/settings/group/{{group_id}}/jobs\" class=\"item-remove-animate\">\n" +
    "                    My Job Title\n" +
    "                </ion-item>\n" +
    "                <ion-item\n" +
    "                    ng-if=\"isPrivilegedGroupMember()\"\n" +
    "                    ui-sref=\"settings.group.locations.managing({group_id: group_id})\"\n" +
    "                    class=\"item-remove-animate\">\n" +
    "                    Managing Jobs\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/home.html',
    "<ion-view view-title=\"Open shifts\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col welcome\">\n" +
    "            <div>WELCOME</div>\n" +
    "            <div class=\"welcome\"><strong>{{userinfo.firstname}}</strong></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <div class='square-box'>\n" +
    "            <a class='square-content' href=\"#{{states.SETTINGS_URL}}\">\n" +
    "                <div class=\"square-content-icon\">\n" +
    "                    <span><i class=\"icon ion-aperture\"></i></span>\n" +
    "                </div>\n" +
    "                <div class=\"square-content-footer\">\n" +
    "                    <span>My Settings</span>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class='square-box'>\n" +
    "            <a class='square-content' href=\"{{currentTabPage || '#' + states.SHIFTS_URL}}\" ng-class=\"{'active': currentState.indexOf('app.shifts.') == 0}\">\n" +
    "                <div class=\"square-content-icon\">\n" +
    "                    <span><i class=\"icon ion-android-time\"></i></span>\n" +
    "                </div>\n" +
    "                <div class=\"square-content-footer\">\n" +
    "                    <span>Shifts</span>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class='square-box'>\n" +
    "            <a class='square-content' href=\"{{currentTabPage || '#' + states.SHIFTS_URL}}\" ng-class=\"{'active': $rootScope.calendarShown}\"\n" +
    "               ng-click=\"toggleCalendar($event)\">\n" +
    "                <div class=\"square-content-icon\">\n" +
    "                    <span><i class=\"icon ion-android-calendar\"></i></span>\n" +
    "                </div>\n" +
    "                <div class=\"square-content-footer\">\n" +
    "                    <span>Calendar</span>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class='square-box'>\n" +
    "            <a class='square-content' ui-sref=\"{{states.SHIFT_REQUEST}}\" ng-class=\"{'active': currentState.indexOf('app.newshift') == 0}\">\n" +
    "                <div class=\"square-content-icon\">\n" +
    "                    <span><i class=\"icon ion-radio-waves\"></i></span>\n" +
    "                </div>\n" +
    "                <div class=\"square-content-footer\">\n" +
    "                    <span>Shift Request</span>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--\n" +
    "    <div>\n" +
    "        <div class='square-box'>\n" +
    "            <div class='square-content'><div><span>I'm a responsive CSS square with centered content!</span></div></div>\n" +
    "        </div>\n" +
    "        <div class='square-box'>\n" +
    "            <div class='square-content'><div><span>I'm a responsive CSS square with centered content!</span></div></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    -->\n" +
    "    <!--\n" +
    "    <ion-content class=\"\">\n" +
    "        <ion-list>\n" +
    "            <ion-item nav-clear menu-close href=\"#{{states.SETTINGS_URL}}\">\n" +
    "                Job Title and My Location Subscriptions\n" +
    "            </ion-item>\n" +
    "            <ion-item nav-clear menu-close href=\"#{{states.SETTINGS_URL}}\">\n" +
    "                Settings\n" +
    "            </ion-item>\n" +
    "            <ion-item nav-clear menu-close href=\"#{{states.LOGOUT_URL}}\">\n" +
    "                Logout\n" +
    "            </ion-item>\n" +
    "        </ion-list>\n" +
    "    </ion-content>\n" +
    "    -->\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/invitation.html',
    "<ion-view can-swipe-back=\"false\">\n" +
    "    <ion-header-bar>\n" +
    "        <h1 class=\"title\">Group Invitation</h1>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <ion-item>\n" +
    "            You have been Invited as a {{ groupRole }} to the group below.\n" +
    "        </ion-item>\n" +
    "        <div class=\"item item-divider\">\n" +
    "            Invitation Details\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <form name=\"subclassForm\" ng-submit=\"createSubclass(subclassForm)\">\n" +
    "                <div class=\"list\">\n" +
    "                    <div class=\"row\" ng-repeat=\"item in groupDetails\">\n" +
    "                        <div class=\"col col-25\">{{ item.description }}:</div>\n" +
    "                        <div class=\"col col-25\">{{ item.data }}</div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div class=\"item item-divider\">\n" +
    "            User Details\n" +
    "        </div>\n" +
    "        <div ng-controller=\"InvitationController\">\n" +
    "            <form name=\"signupForm\" ng-submit=\"doSignup(signupForm.$valid)\" novalidate>\n" +
    "                <div class=\"list\">\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Username</span>\n" +
    "                        <input type=\"text\" name=\"username\" ng-model=\"user.username\" validate-user-username>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-username-messages=\"signupForm.username.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">First Name</span>\n" +
    "                        <input type=\"text\" name=\"firstname\" ng-model=\"user.firstname\" validate-user-firstname>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-firstname-messages=\"signupForm.firstname.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Last Name</span>\n" +
    "                        <input type=\"text\" name=\"lastname\" ng-model=\"user.lastname\" validate-user-lastname>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-lastname-messages=\"signupForm.lastname.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Email</span>\n" +
    "                        <input type=\"text\" name=\"email\" ng-model=\"user.email\" validate-user-email>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-email-messages=\"signupForm.email.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Password</span>\n" +
    "                        <input type=\"password\" name=\"password\" ng-model=\"user.password\" validate-user-password>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-password-messages=\"signupForm.password.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Secret Question</span>\n" +
    "                        <input type=\"text\" name=\"squestion\" ng-model=\"user.squestion\" validate-user-squestion>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-squestion-messages=\"signupForm.squestion.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Secret Answer</span>\n" +
    "                        <input type=\"text\" name=\"sanswer\" ng-model=\"user.sanswer\" validate-user-sanswer>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-sanswer-messages=\"signupForm.sanswer.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Phone (Home)</span>\n" +
    "                        <input type=\"text\" name=\"phonehome\" ng-model=\"user.phonehome\" validate-user-phonehome>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-phonehome-messages=\"signupForm.phonehome.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Phone (Mobile)</span>\n" +
    "                        <input type=\"text\" name=\"phonemobile\" ng-model=\"user.phonemobile\" validate-user-phonemobile>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-phonemobile-messages=\"signupForm.phonemobile.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Pager Number</span>\n" +
    "                        <input type=\"text\" name=\"pagernumber\" ng-model=\"user.pagernumber\" validate-user-pagernumber>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-pagernumber-messages=\"signupForm.pagernumber.$error\"></div>\n" +
    "                    <label class=\"item\" ng-show=\"message != null\">\n" +
    "                        <span>{{message}}</span>\n" +
    "                    </label>\n" +
    "                    <button class=\"button button-block button-steelblue\" type=\"submit\">Accept Invitation</button>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "<    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/invitemember.html',
    "<ion-view view-title=\"Invite\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <form name=\"inviteForm\" ng-submit=\"inviteUsersToGroup(group_id, grouppermission_id, userclass_id, email, message)\">\n" +
    "            <div class=\"list compacted-list list-inset full-width-inputs\">\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Email(s)\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: john@gmail.com, bob@gmail.com, etc\"\n" +
    "                               ng-model=\"email\"\n" +
    "                               name=\"email\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Job type\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <fancy-select\n" +
    "                            header-text=\"Select a job type\"\n" +
    "                            items=\"filteredUserclasses\"\n" +
    "                            value-property=\"id\"\n" +
    "                            value=\"userclass_id\"\n" +
    "                            text-property=\"description\"\n" +
    "                            allow-empty='false'\n" +
    "                            modal-template-url=\"templates/types/typemodal.html\"\n" +
    "                            template-url=\"templates/types/typeitem.html\"\n" +
    "                            value-changed=\"userClassSelected(value)\"\n" +
    "                            >\n" +
    "                        </fancy-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Permission level\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <fancy-select\n" +
    "                            header-text=\"Select a permission level\"\n" +
    "                            items=\"filteredGrouppermissions\"\n" +
    "                            value-property=\"id\"\n" +
    "                            value=\"grouppermission_id\"\n" +
    "                            text-property=\"description\"\n" +
    "                            allow-empty='false'\n" +
    "                            modal-template-url=\"templates/types/typemodal.html\"\n" +
    "                            template-url=\"templates/types/typeitem.html\"\n" +
    "                            value-changed=\"permissionLevelSelected(value)\"\n" +
    "                            >\n" +
    "                        </fancy-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <h4 class=\"new-shift-title\" ng-if=\"error !== undefined\">\n" +
    "                    <div ng-if=\"error === 400 || Math.floor(error / 100) === 5\">An error occurred</div>\n" +
    "                    <div ng-if=\"error !== 400 && Math.floor(error / 100) !== 5\">{{error}}</div>\n" +
    "                </h4>\n" +
    "                <div class=\"item row\">\n" +
    "                    <div class=\"col\">\n" +
    "                        <button ng-disabled=\"invitePending || email === undefined || email.length == 0 || grouppermission_id === undefined || userclass_id == undefined\" class=\"button button-block button-steelblue\" type=\"submit\">\n" +
    "                            <div ng-if=\"invitePending\">\n" +
    "                                Inviting...\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"email === undefined || email.length == 0 || grouppermission_id === undefined || userclass_id == undefined\">\n" +
    "                                Please complete the form\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"!invitePending && email !== undefined && email.length != 0 && grouppermission_id !== undefined && userclass_id !== undefined\">\n" +
    "                                Send invite\n" +
    "                            </div>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/jobsubscriptions.html',
    "<ion-view view-title=\"Subscriptions\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"item item-divider\">\n" +
    "                My Jobs\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\" ng-if=\"!isPrivilegedGroupMember()\">\n" +
    "                Don't see your job type? Contact your manager or IT department.\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <div class=\"list list-inset centered-input\">\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                        <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                               placeholder=\"Search by address, city, state, zipcode or phone\">\n" +
    "                    </label>\n" +
    "                    <ion-toggle ng-repeat=\"userClass in userClasses | filter:query\"\n" +
    "                                ng-model=\"userClass.subscribed\"\n" +
    "                                ng-disabled=\"userClass.persisting\"\n" +
    "                                ng-click=\"saveJob()\"\n" +
    "                                ng-checked=\"isJob(userClass)\">\n" +
    "                        {{ userClass.title }} - {{ userClass.description }}\n" +
    "                    </ion-toggle>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/legal.html',
    "<ion-view view-title=\"Legal\" can-swipe-back=\"false\">\n" +
    "    <ion-content>\n" +
    "        Legal...\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/loading.html',
    "<ion-spinner icon=\"lines\"></ion-spinner>\n"
  );


  $templateCache.put('templates/locations.html',
    "<ion-nav-view>\n" +
    "    <ion-nav-view name=\"locationContent\"></ion-nav-view>\n" +
    "</ion-nav-view>\n"
  );


  $templateCache.put('templates/locations/locationcreate.html',
    "<ion-view view-title=\"Create Location\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list list-inset\">\n" +
    "            <form name=\"locationCreateForm\" ng-submit=\"createLocation()\" novalidate>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Location name\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Building name or Store number\"\n" +
    "                               ng-model=\"location.title\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-location-title>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationCreateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationCreateForm.$dirty\"\n" +
    "                         validate-location-title-messages=\"locationCreateForm.title.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Address\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: 123 Archon Road\"\n" +
    "                               ng-model=\"location.address\"\n" +
    "                               name=\"address\"\n" +
    "                               validate-location-address>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationCreateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationCreateForm.$dirty\"\n" +
    "                         validate-location-address-messages=\"locationCreateForm.address.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            State\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: CA or California\"\n" +
    "                               ng-model=\"location.state\"\n" +
    "                               name=\"State\"\n" +
    "                               validate-location-state>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationCreateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationCreateForm.$dirty\"\n" +
    "                         validate-location-state-messages=\"locationCreateForm.state.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            City\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: San Francisco\"\n" +
    "                               ng-model=\"location.city\"\n" +
    "                               name=\"city\"\n" +
    "                               validate-location-city>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationCreateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationCreateForm.$dirty\"\n" +
    "                         validate-location-city-messages=\"locationCreateForm.city.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Zipcode\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: 13337\"\n" +
    "                               ng-model=\"location.zipcode\"\n" +
    "                               name=\"Zip\"\n" +
    "                               validate-location-zipcode>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Timezone\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <fancy-select\n" +
    "                            header-text=\"Select a timezone\"\n" +
    "                            items=\"timezones\"\n" +
    "                            value-property=\"name\"\n" +
    "                            value=\"location.timezone.name\"\n" +
    "                            text-property=\"description\"\n" +
    "                            allow-empty='false'\n" +
    "                            text=\"Tap here to select a Time Zone\"\n" +
    "                            modal-template-url=\"templates/types/typemodal.html\"\n" +
    "                            template-url=\"templates/types/typeitem.html\"\n" +
    "                            value-changed=\"timezoneSelected(value)\"\n" +
    "                            >\n" +
    "                        </fancy-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationCreateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationCreateForm.$dirty\"\n" +
    "                         validate-location-zipcode-messages=\"locationCreateForm.zipcode.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Phone number\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: 1113337777\"\n" +
    "                               ng-model=\"location.phonenumber\"\n" +
    "                               name=\"phonenumber\"\n" +
    "                               validate-location-phonenumber>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationCreateForm.$dirty\">\n" +
    "                    <div validate-location-phonenumber-messages=\"locationCreateForm.phonenumber.$error\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\" ng-show=\"message.length > 0\">\n" +
    "                    <div class=\"col col list-item-padding\">\n" +
    "                        <h4>{{message}}</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button ng-disabled=\"saving || !locationCreateForm.$valid\"\n" +
    "                        class=\"button button-block button-steelblue\"\n" +
    "                        type=\"submit\">\n" +
    "                    <span ng-if=\"saving\">Creating...</span>\n" +
    "                    <span ng-if=\"!saving\">Create</span>\n" +
    "                </button>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/locations/locationedit.html',
    "<ion-view view-title=\"Edit Location\" can-swipe-back=\"false\"a>\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list list-inset\">\n" +
    "            <form name=\"locationUpdateForm\" ng-submit=\"editLocation()\" novalidate>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Location name\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Building name or Store number\"\n" +
    "                               ng-model=\"location.title\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-location-title>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationUpdateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationUpdateForm.$dirty\"\n" +
    "                         validate-location-title-messages=\"locationUpdateForm.title.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Address\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: 123 Archon Road\"\n" +
    "                               ng-model=\"location.address\"\n" +
    "                               name=\"address\"\n" +
    "                               validate-location-address>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationUpdateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationUpdateForm.$dirty\"\n" +
    "                         validate-location-address-messages=\"locationUpdateForm.address.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            State\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: CA or California\"\n" +
    "                               ng-model=\"location.state\"\n" +
    "                               name=\"State\"\n" +
    "                               validate-location-state>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationUpdateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationUpdateForm.$dirty\"\n" +
    "                         validate-location-state-messages=\"locationUpdateForm.state.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            City\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: San Francisco\"\n" +
    "                               ng-model=\"location.city\"\n" +
    "                               name=\"city\"\n" +
    "                               validate-location-city>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationUpdateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationUpdateForm.$dirty\"\n" +
    "                         validate-location-city-messages=\"locationUpdateForm.city.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Zipcode\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: 13337\"\n" +
    "                               ng-model=\"location.zipcode\"\n" +
    "                               name=\"Zip\"\n" +
    "                               validate-location-zipcode>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Timezone\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <fancy-select\n" +
    "                            header-text=\"Select a timezone\"\n" +
    "                            items=\"timezones\"\n" +
    "                            value-property=\"name\"\n" +
    "                            value=\"location.timezone.name\"\n" +
    "                            text-property=\"description\"\n" +
    "                            allow-empty='false'\n" +
    "                            text=\"Tap here to select a Time Zone\"\n" +
    "                            modal-template-url=\"templates/types/typemodal.html\"\n" +
    "                            template-url=\"templates/types/typeitem.html\"\n" +
    "                            value-changed=\"timezoneSelected(value)\"\n" +
    "                            >\n" +
    "                        </fancy-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationUpdateForm.$dirty\">\n" +
    "                    <i class=\"icon ion-alert\"></i>\n" +
    "                    <div ng-if=\"locationUpdateForm.$dirty\"\n" +
    "                         validate-location-zipcode-messages=\"locationUpdateForm.zipcode.$error\"></div>\n" +
    "                </div>\n" +
    "                -->\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Phone number\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: 1113337777\"\n" +
    "                               ng-model=\"location.phonenumber\"\n" +
    "                               name=\"phonenumber\"\n" +
    "                               validate-location-phonenumber>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-icon-left validation-message\"\n" +
    "                     ng-if=\"locationUpdateForm.$dirty\">\n" +
    "                    <div validate-location-phonenumber-messages=\"locationUpdateForm.phonenumber.$error\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\" ng-show=\"message.length > 0\">\n" +
    "                    <div class=\"col col list-item-padding\">\n" +
    "                        <h4>{{message}}</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button ng-disabled=\"saving || !locationUpdateForm.$valid\"\n" +
    "                        class=\"button button-block button-steelblue\"\n" +
    "                        type=\"submit\">\n" +
    "                    <span ng-if=\"saving\">Updating...</span>\n" +
    "                    <span ng-if=\"!saving\">Update</span>\n" +
    "                </button>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/locations/locationlist.html',
    "<ion-view view-title=\"Location Overview\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list list-inset\">\n" +
    "            <div class=\"item item-input row\">\n" +
    "                <ion-item href=\"#/settings/group/{{group_id}}/locations/{{location_id}}/manage\">\n" +
    "                    <i class=\"icon ion-edit\"></i>\n" +
    "                    Edit Location Details\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "            <div class=\"item item-input row\">\n" +
    "                <ion-item href=\"#/settings/group/{{group_id}}/locations/{{location_id}}/new\">\n" +
    "                    <i class=\"icon ion-plus\"></i>\n" +
    "                    Add a Sublocation (Unit/Floor/Department)\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\" ng-if=\"location\">\n" +
    "                Sublocations for {{ location.title }} (Unit/Floor/Department)\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\" ng-if=\"!location\">\n" +
    "                Sublocations (Unit/Floor/Department)\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\" ng-if=\"location.sublocations.length > 0\">\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                    <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                           placeholder=\"Search by name, email or phone\">\n" +
    "                </label>\n" +
    "                <ion-item ng-repeat=\"sublocation in location.sublocations | filter:query\"\n" +
    "                          item=\"sublocation\"\n" +
    "                          href=\"#/settings/group/{{ group_id }}/locations/{{ location_id }}/sublocations/{{ sublocation.id }}/manage\">\n" +
    "                    {{ sublocation.title }}\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "            <div class=\"item-indent greyed-text\" ng-if=\"location.sublocations.length == 0 || !location.sublocations\">\n" +
    "                There are no associated sublocations.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/locationsubscriptions.html',
    "<ion-view view-title=\"Subscriptions\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Locations\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <div class=\"list list-inset centered-input\">\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                        <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                               placeholder=\"Search by address, city, state, zipcode or phone\">\n" +
    "                    </label>\n" +
    "                    <ion-toggle ng-repeat=\"location in locations | filter:query\"\n" +
    "                                ng-model=\"location.subscribedModified\"\n" +
    "                                ng-click=\"saveLocations()\"\n" +
    "                                ng-checked=\"location.subscribed\">\n" +
    "                        {{ location.title }} - {{ location.address }}\n" +
    "                    </ion-toggle>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/login.html',
    "<ion-view can-swipe-back=\"false\">\n" +
    "    <div login-partial class=\"gradient-color\">\n" +
    "    </div>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/logout.html',
    "<div ng-init=\"logout()\"></div>\n" +
    "Logging out please wait..."
  );


  $templateCache.put('templates/managablelocations.html',
    "<ion-view view-title=\"Subscriptions\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Locations\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <div class=\"list list-inset centered-input\">\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                        <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                               placeholder=\"Search by name, email or phone\">\n" +
    "                    </label>\n" +
    "                    <div class=\"list\">\n" +
    "                        <ion-item ng-repeat=\"location in locations | filter:query\"\n" +
    "                                  ui-sref=\"settings.group.locations.managingsubscriptions({group_id: getGroupId(), location_id: location.id})\">\n" +
    "                            {{ location.title }} - {{ location.address }}\n" +
    "                        </ion-item>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/manage.html',
    "<ion-view view-title=\"Manage\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <ion-refresher\n" +
    "            pulling-text=\"Pull to refresh...\"\n" +
    "            on-refresh=\"fetch()\">\n" +
    "        </ion-refresher>\n" +
    "        <managing-shifts manageable=\"true\" name=\"ManageShifts\"></managing-shifts>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/managelocation.html',
    "<ion-view view-title=\"Manage\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <form name=\"sublocationUpdateForm\" ng-submit=\"editSublocation()\" novalidate>\n" +
    "            <div class=\"list list-inset centered-input\">\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Title\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Floor/Unit/Department name\"\n" +
    "                               ng-model=\"sublocation.title\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-sublocation-title>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Description\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Optional\"\n" +
    "                               ng-model=\"sublocation.description\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-sublocation-description>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button ng-disabled=\"saving || !sublocationUpdateForm.$valid\"\n" +
    "                        class=\"button button-block button-steelblue\"\n" +
    "                        type=\"submit\">\n" +
    "                    <span ng-if=\"saving\">Updating...</span>\n" +
    "                    <span ng-if=\"!saving\">Update</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/manageshift.html',
    "<ion-view view-title=\"Manage\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-tabs-top\">\n" +
    "        <ion-list\n" +
    "            class=\"has-header\"\n" +
    "            show-delete=\"false\"\n" +
    "            show-reorder=\"false\"\n" +
    "            can-swipe=\"false\">\n" +
    "            List of people applying for shift {{shift_id}}\n" +
    "            <ion-item class=\"item item-icon-right\"\n" +
    "                      ng-show=\"{{shift.shiftapplications.length != 0}}\"\n" +
    "                      ng-repeat=\"shiftapplication in shift.shiftapplications\">\n" +
    "                {{shiftapplication}}\n" +
    "                <i class=\"icon ion-minus-circled\" ng-click=\"promptDeclineShiftApplication({{shiftapplication.id}})\"></i>\n" +
    "            </ion-item>\n" +
    "            <ion-item class=\"item\"\n" +
    "                      ng-show=\"{{shift.shiftapplications.length == 0}}\">\n" +
    "                No applicants\n" +
    "            </ion-item>\n" +
    "        </ion-list>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/managingjobsubscriptions.html',
    "<ion-view view-title=\"Subscriptions\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"item item-divider\">\n" +
    "                My Jobs\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\" ng-if=\"!isPrivilegedGroupMember()\">\n" +
    "                Don't see your job type? Contact your manager or IT department.\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <div class=\"list list-inset centered-input\">\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                        <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                               placeholder=\"Search by address, city, state, zipcode or phone\">\n" +
    "                    </label>\n" +
    "                    <ion-toggle ng-repeat=\"userClass in userClasses | filter:query\"\n" +
    "                                ng-model=\"userClass.subscribed\"\n" +
    "                                ng-disabled=\"userClass.persisting\"\n" +
    "                                ng-click=\"saveJob()\"\n" +
    "                                ng-checked=\"isJob(userClass)\">\n" +
    "                        {{ userClass.title }} - {{ userClass.description }}\n" +
    "                    </ion-toggle>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/menu.html',
    "<ion-side-menus enable-menu-with-back-views=\"true\">\n" +
    "    <ion-pane ion-side-menu-content drag-content=\"true\">\n" +
    "\n" +
    "        <ion-view>\n" +
    "            <ion-nav-view name=\"menuContent\" hide-nav-bar=\"true\"></ion-nav-view>\n" +
    "        </ion-view>\n" +
    "    </ion-pane>\n" +
    "\n" +
    "    <ion-side-menu side=\"left\">\n" +
    "        <ion-nav-view name=\"menu\"></ion-nav-view>\n" +
    "    </ion-side-menu>\n" +
    "</ion-side-menus>\n"
  );


  $templateCache.put('templates/menuimpl.html',
    "<ion-header-bar class=\"bar-stable\">\n" +
    "    <h1 class=\"title\">Left</h1>\n" +
    "</ion-header-bar>\n" +
    "<ion-content>\n" +
    "    <ion-list>\n" +
    "        <ion-item nav-clear menu-close href=\"#{{states.HOME_URL}}\">\n" +
    "            Shifts\n" +
    "        </ion-item>\n" +
    "        <ion-item nav-clear menu-close href=\"#{{states.LOGOUT_URL}}\">\n" +
    "            Logout\n" +
    "        </ion-item>\n" +
    "        <ion-item nav-clear menu-close href=\"#{{states.PRIVACY_POLICY_URL}}\">\n" +
    "            Privacy Policy\n" +
    "        </ion-item>\n" +
    "        <ion-item nav-clear menu-close href=\"#{{states.LEGAL_URL}}\">\n" +
    "            Legal information\n" +
    "        </ion-item>\n" +
    "        <ion-item nav-clear menu-close href=\"#{{states.CONTACT_US_URL}}\">\n" +
    "            Contact us\n" +
    "        </ion-item>\n" +
    "        <ion-item nav-clear menu-close href=\"#{{states.SETTINGS_URL}}\">\n" +
    "            Settings\n" +
    "        </ion-item>\n" +
    "    </ion-list>\n" +
    "</ion-content>\n"
  );


  $templateCache.put('templates/modal/createshift.html',
    "<ion-modal-view class=\"create-shift-modal\" ng-controller=\"CreateShiftModalController\">\n" +
    "    <ion-header-bar class=\"bar bar-header bar-dark\">\n" +
    "        <h1 class=\"title\">Request Shift Coverage</h1>\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button button-icon ion-close\" ng-click=\"closeModal()\"></button>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <div class=\"bar bar-subheader bar-dark\">\n" +
    "            <h3 class=\"title\">{{header}}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"create-shift-steps unclickable\">\n" +
    "        <div class=\"row row-no-padding\">\n" +
    "            <div class=\"col-20\"></div>\n" +
    "            <div class=\"col-20\"></div>\n" +
    "            <div class=\"col-20\"></div>\n" +
    "            <div class=\"col-20\"></div>\n" +
    "            <div class=\"col-20\">\n" +
    "                <div ng-show=\"prev\"\n" +
    "                     ng-click=\"prevClicked()\"\n" +
    "                     class=\"icon ion-chevron-up next-button\"></div>\n" +
    "                <div ng-show=\"next\"\n" +
    "                     ng-click=\"nextClicked()\"\n" +
    "                     class=\"icon ion-chevron-down next-button\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <ul id=\"progressbar\">\n" +
    "            <li ng-class=\"{'active': index >= 0, 'review': index >= 4, 'locked': steps['create-shift-date'].locked}\" ng-click=\"navigateTo('create-shift-date')\">DATE(S)</li>\n" +
    "            <li ng-class=\"{'active': index >= 1, 'review': index >= 4, 'locked': steps['create-shift-when'].locked}\" ng-click=\"navigateTo('create-shift-when')\">WHEN</li>\n" +
    "            <li ng-class=\"{'active': index >= 2, 'review': index >= 4, 'locked': steps['create-shift-where'].locked}\" ng-click=\"navigateTo('create-shift-where')\">WHERE</li>\n" +
    "            <li ng-class=\"{'active': index >= 3, 'review': index >= 4, 'locked': steps['create-shift-who'].locked}\" ng-click=\"navigateTo('create-shift-who')\">WHO</li>\n" +
    "            <li ng-class=\"{'active': index >= 4, 'review': index >= 4, 'locked': steps['create-shift-review'].locked}\" ng-click=\"navigateTo('create-shift-review')\">Review</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <ion-content class=\"has-subheader\">\n" +
    "        <div class=\"forms\" id=\"create-shift-date\" ng-class=\"{'create-shift-form-hide': !steps['create-shift-date'].show}\">\n" +
    "            <div class=\"form-offset\">\n" +
    "                <div class=\"create-shift-content\">\n" +
    "                    <shift-calendar toggle=\"false\" show=\"true\" name=\"create-shift-calendar\" multiple=\"true\" clickable=\"true\" cant-click-yesterday=\"true\"></shift-calendar>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"forms\"\n" +
    "             ng-attr-id=\"{{'create-shift-when-' + day.key}}\"\n" +
    "             ng-repeat=\"day in date\"\n" +
    "             ng-class=\"{'create-shift-form-hide': !steps['create-shift-when-' + day.key].show, 'create-shift-form-visible': !sliding && steps['create-shift-when-' + day.key].show}\">\n" +
    "            <div class=\"form-offset\">\n" +
    "                <div class=\"create-shift-content\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col col-20 uniform-padding\">\n" +
    "                            <h4 class=\"sub-subheader\">Start:</h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col col-80\">\n" +
    "                            <input ng-model=\"dateState[day.key].time\" type=\"time\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col col-20 uniform-padding\">\n" +
    "                            <h4 class=\"sub-subheader\">End:</h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col col-80\">\n" +
    "                            <input ng-model=\"dateState[day.key].endtime\" type=\"date\">\n" +
    "                            <input ng-model=\"dateState[day.key].hours\" type=\"time\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col col-20 uniform-padding\">\n" +
    "                            <h4 class=\"sub-subheader nowrap\">Employees needed:</h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col col-80\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <input ng-model=\"dateState[day.key].counter\" min=\"1\" type=\"number\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"forms\" id=\"create-shift-where\" ng-class=\"{'create-shift-form-hide': !steps['create-shift-where'].show, 'create-shift-form-visible': !sliding && steps['create-shift-where'].show}\">\n" +
    "            <div class=\"create-shift-content centered-input\">\n" +
    "                <div class=\"list list-inset\">\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                        <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                               placeholder=\"Search by name, email or phone\">\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <ion-scroll delegate-handle=\"shift-where\" ng-style=\"{'height': currentStepDivHeight / 2}\">\n" +
    "                    <ion-list\n" +
    "                        type=\"list-inset\"\n" +
    "                        show-delete=\"false\"\n" +
    "                        show-reorder=\"false\"\n" +
    "                        can-swipe=\"false\">\n" +
    "                        <ion-item\n" +
    "                            class=\"item clear-padding\"\n" +
    "                            ng-class=\"{'location-selected': location.selected}\"\n" +
    "                            ng-click=\"locationClicked(location)\"\n" +
    "                            ng-repeat=\"location in users | filter:query\">\n" +
    "                            {{location.address}}\n" +
    "                        </ion-item>\n" +
    "                    </ion-list>\n" +
    "                    <ion-infinite-scroll\n" +
    "                        ng-if=\"moreToLoad()\"\n" +
    "                        on-infinite=\"loadMore()\"\n" +
    "                        distance=\"20%\">\n" +
    "                    </ion-infinite-scroll>\n" +
    "                </ion-scroll>\n" +
    "                <div>\n" +
    "                    Floor\n" +
    "                    <ion-list\n" +
    "                        type=\"list-inset\"\n" +
    "                        show-delete=\"false\"\n" +
    "                        show-reorder=\"false\"\n" +
    "                        can-swipe=\"false\">\n" +
    "                        <ion-item\n" +
    "                            class=\"item clear-padding\"\n" +
    "                            ng-class=\"{'location-selected': sublocation.selected}\"\n" +
    "                            ng-click=\"sublocationClicked(sublocation)\"\n" +
    "                            ng-repeat=\"sublocation in sublocations\">\n" +
    "                            {{sublocation.title}}\n" +
    "                        </ion-item>\n" +
    "                    </ion-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"forms\" id=\"create-shift-who\" ng-class=\"{'create-shift-form-hide': !steps['create-shift-who'].show, 'create-shift-form-visible': !sliding && steps['create-shift-who'].show}\">\n" +
    "            <div class=\"create-shift-content\">\n" +
    "                description\n" +
    "                <textarea rows=\"4\" cols=\"50\" style=\"width: 100%; height: 20%;\" ng-model=\"description\"></textarea>\n" +
    "                <ion-scroll delegate-handle=\"shift-who\" ng-style=\"{'height': currentStepDivHeight / 3}\">\n" +
    "                    <ion-list\n" +
    "                        type=\"list-inset\"\n" +
    "                        show-delete=\"false\"\n" +
    "                        show-reorder=\"false\"\n" +
    "                        can-swipe=\"false\">\n" +
    "                        <ion-item\n" +
    "                            class=\"item clear-padding\"\n" +
    "                            ng-class=\"{'location-selected': job.selected}\"\n" +
    "                            ng-click=\"jobTypeClicked(job)\"\n" +
    "                            ng-repeat=\"job in jobTypes\">\n" +
    "                            {{job.title}} - {{job.description}}\n" +
    "                        </ion-item>\n" +
    "                    </ion-list>\n" +
    "                </ion-scroll>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"forms\" id=\"create-shift-review\" ng-class=\"{'create-shift-form-hide': !steps['create-shift-review'].show, 'create-shift-form-visible': !sliding && steps['create-shift-review'].show}\">\n" +
    "            <div class=\"create-shift-content\">\n" +
    "                {{description}}\n" +
    "                <ion-scroll delegate-handle=\"shift-review\" ng-style=\"{'height': currentStepDivHeight * 0.5}\">\n" +
    "                    <div ng-repeat=\"day in date\">\n" +
    "                        <p>Shift {{date.indexOf(day) + 1}}</p>\n" +
    "                        <p>Date: {{day.key}}</p>\n" +
    "                        <p>Begins: {{dateState[day.key].time}}</p>\n" +
    "                        <p>Shift Duration: {{dateState[day.key].hours}} hours</p>\n" +
    "                        <p>Employees needed: {{dateState[day.key].counter}}</p>\n" +
    "                    </div>\n" +
    "                </ion-scroll>\n" +
    "                <ion-button ng-click=\"create()\">Create</ion-button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "    <div class=\"block-input\" ng-show=\"blockInput\"></div>\n" +
    "</ion-modal-view>\n"
  );


  $templateCache.put('templates/mycallouts.html',
    "<ion-view view-title=\"My Callouts\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <ion-refresher\n" +
    "            pulling-text=\"Pull to refresh...\"\n" +
    "            on-refresh=\"fetch()\">\n" +
    "        </ion-refresher>\n" +
    "        <shift-list dismissable=\"true\" name=\"shifts\" showDividers=\"true\"></shift-list>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/myshifts.html',
    "<ion-view view-title=\"My shifts\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <ion-refresher\n" +
    "            pulling-text=\"Pull to refresh...\"\n" +
    "            on-refresh=\"fetch()\">\n" +
    "        </ion-refresher>\n" +
    "        <shift-list dismissable=\"true\" name=\"shifts\" acceptedOnly=\"true\" showDividers=\"true\"></shift-list>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/newshift/dates.html',
    "<ion-view view-title=\"Date(s)\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <h4 class=\"new-shift-title\">Select one or more dates that need shift coverage</h4>\n" +
    "        <shift-calendar toggle=\"false\" show=\"true\" name=\"create-shift-calendar\" multiple=\"true\" clickable=\"true\" cant-click-yesterday=\"true\"></shift-calendar>\n" +
    "        <!--\n" +
    "        <div ng-if=\"getDates()\">\n" +
    "            Selected Shift Dates: {{getDatesString().join(', ')}}\n" +
    "        </div>\n" +
    "        -->\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col\">\n" +
    "                <button ng-disabled=\"date.length == 0\"\n" +
    "                        style=\"width: 100%\"\n" +
    "                        class=\"button button-block button-positive activated \"\n" +
    "                        ui-sref=\"app.newshift.when({dates: getDates()})\">\n" +
    "                    <div ng-if=\"date.length != 0\">\n" +
    "                        Next\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"date.length == 0\">\n" +
    "                        Please complete the form\n" +
    "                    </div>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/newshift/newshiftstabs.html',
    "<div id=\"app-header-tab\" class=\"tabs-striped tabs-top tabs-background-positive tabs-color-light\">\n" +
    "    <div class=\"tabs\" style=\"top: 0\">\n" +
    "        <a class=\"tab-item\"\n" +
    "           ng-disabled=\"!tabState.WHEN\"\n" +
    "           ui-sref=\"{{states.SHIFT_REQUEST}}($rootScope.newShiftTabsStateParams)\"\n" +
    "           ng-class=\"{'active': currentState == states.SHIFT_REQUEST}\">\n" +
    "            WHEN\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\"\n" +
    "           ng-disabled=\"!tabState.DETAILS\"\n" +
    "           ui-sref=\"{{states.SHIFT_REQUEST_WHEN}}($rootScope.newShiftTabsStateParams)\"\n" +
    "           ng-class=\"{'active': currentState == states.SHIFT_REQUEST_WHEN}\">\n" +
    "            DETAILS\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\"\n" +
    "           ng-disabled=\"!tabState.WHERE\"\n" +
    "           ui-sref=\"{{states.SHIFT_REQUEST_WHERE}}($rootScope.newShiftTabsStateParams)\"\n" +
    "           ng-class=\"{'active': currentState == states.SHIFT_REQUEST_WHERE}\">\n" +
    "            WHERE\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\"\n" +
    "           ng-disabled=\"!tabState.WHO\"\n" +
    "           ui-sref=\"{{states.SHIFT_REQUEST_WHO}}($rootScope.newShiftTabsStateParams)\"\n" +
    "           ng-class=\"{'active': currentState == states.SHIFT_REQUEST_WHO}\">\n" +
    "            WHO\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\"\n" +
    "           ng-disabled=\"!tabState.REVIEW\"\n" +
    "           ui-sref=\"{{states.SHIFT_REQUEST_REVIEW}}($rootScope.newShiftTabsStateParams)\"\n" +
    "           ng-class=\"{'active': currentState == states.SHIFT_REQUEST_REVIEW}\">\n" +
    "            REVIEW\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<ion-nav-view name=\"newShiftTabContent\"></ion-nav-view>\n"
  );


  $templateCache.put('templates/newshift/review.html',
    "<ion-view view-title=\"When\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <h4 class=\"new-shift-title\">Please review the shift request before submitting</h4>\n" +
    "        <div class=\"list compacted-list list-inset full-width-inputs\">\n" +
    "            <div ng-if=\"description.length > 0\">\n" +
    "                <div class=\"item item-stacked-label row\">\n" +
    "                    <div class=\"col list-item-padding\">\n" +
    "                        <h4 class=\"\">Shift Description</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item row\">\n" +
    "                    <div class=\"col list-item-padding\">\n" +
    "                        <textarea rows=\"4\" cols=\"50\" style=\"width: 100%;\" disabled>{{description}}</textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <shift-list dismissable=\"true\" name=\"newShifts\" swipable=\"false\"></shift-list>\n" +
    "        <div class=\"list compacted-list list-inset full-width-inputs\">\n" +
    "            <div class=\"item row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <button ng-click=\"create()\"\n" +
    "                            style=\"width: 100%\"\n" +
    "                            class=\"button button-block button-positive activated\">\n" +
    "                        Create\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/newshift/when.html',
    "<ion-view view-title=\"When\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <!--\n" +
    "        <h4 class=\"new-shift-title\">Select shift duration and number of employees needed</h4>\n" +
    "        -->\n" +
    "        <div class=\"list compacted-list list-inset full-width-inputs\"\n" +
    "            ng-repeat=\"date in getDates()\">\n" +
    "            <div class=\"item item-divider item-divider-bright-text\">\n" +
    "                <h2>{{getMoment(date).format('MMMM Do, YYYY')}} - Shift Details:</h2>\n" +
    "            </div>\n" +
    "            <div class=\"item row\">\n" +
    "                <div class=\"col col-50 list-item-padding\">\n" +
    "                    <h4 class=\"sub-subheader\">Start time</h4>\n" +
    "                </div>\n" +
    "                <div class=\"col\">\n" +
    "                    <input ng-model=\"when[date].starttime\" type=\"time\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"item row\">\n" +
    "                <div class=\"col col-50 list-item-padding\">\n" +
    "                    <h4 class=\"sub-subheader\">End time</h4>\n" +
    "                </div>\n" +
    "                <div class=\"col\">\n" +
    "                    <input ng-model=\"when[date].length\" type=\"time\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"item row\">\n" +
    "                <div class=\"col col-50 list-item-padding\">\n" +
    "                    <h4 class=\"sub-subheader\">Date the shift ends</h4>\n" +
    "                </div>\n" +
    "                <div class=\"col\">\n" +
    "                    <input ng-model=\"when[date].endtime\" type=\"date\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"item row\">\n" +
    "                <div class=\"col col-50 list-item-padding\">\n" +
    "                    <h4 class=\"sub-subheader nowrap\">How many employees are needed?</h4>\n" +
    "                </div>\n" +
    "                <div class=\"col col-25 col-offset-25\">\n" +
    "                    <input ng-model=\"when[date].employees\" min=\"1\" type=\"number\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"list compacted-list list-inset full-width-inputs\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <button ng-disabled=\"!progressable()\"\n" +
    "                            style=\"width: 100%\"\n" +
    "                            class=\"button button-block button-positive activated\"\n" +
    "                            ui-sref=\"app.newshift.where(whereStateParams())\">\n" +
    "                        <div ng-if=\"progressable()\">\n" +
    "                            Next\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"!progressable()\">\n" +
    "                            Please complete the form\n" +
    "                        </div>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/newshift/where.html',
    "<ion-view view-title=\"When\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <h4 class=\"new-shift-title\">Where is the shift located</h4>\n" +
    "        <div class=\"list list-inset\">\n" +
    "            <label class=\"item item-input\">\n" +
    "                <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                       placeholder=\"Search by location name, address or phone number\">\n" +
    "            </label>\n" +
    "            <div class=\"item\">\n" +
    "                <ion-scroll delegate-handle=\"shift-where\" ng-style=\"{'height': currentStepDivHeight / 2}\">\n" +
    "                    <ion-list\n" +
    "                        type=\"list-inset\"\n" +
    "                        show-delete=\"false\"\n" +
    "                        show-reorder=\"false\"\n" +
    "                        can-swipe=\"false\">\n" +
    "                        <ion-radio\n" +
    "                            class=\"item clear-padding item-divider-bright-text\"\n" +
    "                            ng-class=\"{'location-selected': location.selected}\"\n" +
    "                            ng-click=\"locationClicked(location)\"\n" +
    "                            ng-model=\"selectedLocationRadio\"\n" +
    "                            ng-value=\"location.id\"\n" +
    "                            ng-repeat=\"location in users | filter:query\">\n" +
    "                            {{location.address}}\n" +
    "                        </ion-radio>\n" +
    "                    </ion-list>\n" +
    "                    <ion-infinite-scroll\n" +
    "                        ng-if=\"moreToLoad()\"\n" +
    "                        on-infinite=\"loadMore()\"\n" +
    "                        distance=\"20%\">\n" +
    "                    </ion-infinite-scroll>\n" +
    "                </ion-scroll>\n" +
    "            </div>\n" +
    "            <h4 ng-if=\"sublocations.length > 0\"\n" +
    "                class=\"new-shift-title\">Select the specific department</h4>\n" +
    "            <div class=\"item\">\n" +
    "                <div ng-if=\"sublocations.length > 0\">\n" +
    "                    <ion-list\n" +
    "                        type=\"list-inset\"\n" +
    "                        show-delete=\"false\"\n" +
    "                        show-reorder=\"false\"\n" +
    "                        can-swipe=\"false\">\n" +
    "                        <ion-item\n" +
    "                            class=\"item clear-padding item-divider-bright-text\"\n" +
    "                            ng-class=\"{'location-selected': sublocation.selected}\"\n" +
    "                            ng-click=\"sublocationClicked(sublocation)\"\n" +
    "                            ng-repeat=\"sublocation in sublocations\">\n" +
    "                            {{sublocation.title}}\n" +
    "                        </ion-item>\n" +
    "                    </ion-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/newshift/who.html',
    "<ion-view view-title=\"When\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <h4 class=\"new-shift-title\">Please select the job type and add any additional information</h4>\n" +
    "        <div class=\"list compacted-list list-inset full-width-inputs\">\n" +
    "            <div class=\"item item-input row\">\n" +
    "                <div class=\"col col-50 list-item-padding\">\n" +
    "                    <h4 class=\"sub-subheader\">Select Job Type</h4>\n" +
    "                </div>\n" +
    "                <div class=\"col\">\n" +
    "                    <select ng-model=\"other.job\">\n" +
    "                        <option ng-repeat=\"job in jobTypes\"\n" +
    "                                ng-selected=\"jobTypes.indexOf(job) == 0\"\n" +
    "                                value=\"{{job.id}}\">\n" +
    "                            {{job.title}} - {{job.description}}\n" +
    "                        </option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"item item-stacked-label row\">\n" +
    "                <div class=\"col list-item-padding\">\n" +
    "                    <h4 class=\"\">Shift Description (Optional)</h4>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"item row\">\n" +
    "                <div class=\"col list-item-padding\">\n" +
    "                    <textarea rows=\"4\" cols=\"50\" style=\"width: 100%;\" ng-model=\"other.description\"></textarea>\n" +
    "                    <div ng-if=\"other.description.length > 0\"\n" +
    "                         class=\"shift-description-character-limit\"\n" +
    "                         ng-class=\"{'too-many-characters': other.description.length > descriptionMaxLength}\">\n" +
    "                        {{other.description.length}}/{{descriptionMaxLength}} characters\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"item row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <button ng-disabled=\"!progressable()\"\n" +
    "                            style=\"width: 100%\"\n" +
    "                            class=\"button button-block button-positive activated\"\n" +
    "                            ng-click=\"next()\">\n" +
    "                        <div ng-if=\"progressable()\">\n" +
    "                            Next\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"!progressable()\">\n" +
    "                            Please complete the form\n" +
    "                        </div>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/notifications/cancelshiftreason.html',
    "<textarea rows=\"3\" ng-model=\"data.reason\"></textarea>\n"
  );


  $templateCache.put('templates/notifications/declineshiftapplicationreason.html',
    "<textarea rows=\"3\" ng-model=\"data.declinereason\"></textarea>\n"
  );


  $templateCache.put('templates/notifications/recindshiftreason.html',
    "<textarea rows=\"3\" ng-model=\"data.recindreason\"></textarea>\n"
  );


  $templateCache.put('templates/notifications/requestshift.html',
    "THIS IS ONLY FOR EMERGENCIES ABUSE PROBABLY WONT BE TOLERATED BY YOUR EMPLOYER\n"
  );


  $templateCache.put('templates/notifications/resetpasswordsuccess.html',
    "If the specified username/email exists we will send an email shortly.\n"
  );


  $templateCache.put('templates/notifications/unknownerror.html',
    "An unknown error occurred\n"
  );


  $templateCache.put('templates/openshifts.html',
    "<ion-view view-title=\"Open shifts\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-tabs-top\">\n" +
    "        <ion-refresher\n" +
    "            pulling-text=\"Pull to refresh...\"\n" +
    "            on-refresh=\"fetch()\">\n" +
    "        </ion-refresher>\n" +
    "        <ion-list\n" +
    "            class=\"has-header\"\n" +
    "            show-delete=\"false\"\n" +
    "            show-reorder=\"false\"\n" +
    "            can-swipe=\"false\">\n" +
    "        </ion-list>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/playlist.html',
    "<ion-view view-title=\"Playlist\">\n" +
    "  <ion-content>\n" +
    "    <h1>Playlist</h1>\n" +
    "  </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/playlists.html',
    "<ion-view view-title=\"Playlists\">\n" +
    "  <ion-content>\n" +
    "    <div user-partial>\n" +
    "\n" +
    "    </div>\n" +
    "    <ion-list>\n" +
    "      <ion-item>\n" +
    "        Start of old way\n" +
    "      </ion-item>\n" +
    "      <ion-item ng-repeat=\"playlist in playlists\" href=\"#/app/playlists/{{playlist.id}}\">\n" +
    "          {{playlist.username}}\n" +
    "        <ion-option-button class=\"button-steelblue\" ng-click=\"add()\">+</ion-option-button>\n" +
    "      </ion-item>\n" +
    "    </ion-list>\n" +
    "  </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/privacypolicy.html',
    "<ion-view view-title=\"Privacy Policy\">\n" +
    "    <ion-content>\n" +
    "        Privacy policy...\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/requestshift.html',
    "<ion-pane id=\"request-shift\">\n" +
    "    <ion-nav-bar>\n" +
    "        <ion-nav-back-button></ion-nav-back-button>\n" +
    "        <ion-nav-buttons side=\"right\">\n" +
    "            <button class=\"button button-icon ion-close\" ng-click=\"close()\"></button>\n" +
    "        </ion-nav-buttons>\n" +
    "    </ion-nav-bar>\n" +
    "    <ion-view>\n" +
    "        <ion-nav-view name=\"content\"></ion-nav-view>\n" +
    "    </ion-view>\n" +
    "</ion-pane>\n"
  );


  $templateCache.put('templates/requestshift/createshift.html',
    "<ion-view view-title=\"When\" can-swipe-back=\"false\">\n" +
    "    <ion-content id=\"request-shift-create-shift\" class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"item\">\n" +
    "                <div ng-if=\"!sublocation\">\n" +
    "                    {{location.address}}\n" +
    "                </div>\n" +
    "                <div ng-if=\"sublocation\">\n" +
    "                    {{location.address}} - {{sublocation.title}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <label class=\"item item-input\">\n" +
    "                <span class=\"input-label\">Title</span>\n" +
    "                <input type=\"text\" ng-model=\"shift.title\">\n" +
    "            </label>\n" +
    "            <label class=\"item item-input\">\n" +
    "                <span class=\"input-label\">Description</span>\n" +
    "                <input type=\"text\" ng-model=\"shift.description\">\n" +
    "            </label>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Date\n" +
    "            </div>\n" +
    "            <div class=\"item item-button-right\">\n" +
    "                <ionic-datepicker input-obj=\"datepickerObject\">\n" +
    "                    <button class=\"button button-block button-steelblue\"> {{datepickerObject.inputDate | date:'dd - MMMM - yyyy'}}</button>\n" +
    "                </ionic-datepicker>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Shift starts at\n" +
    "            </div>\n" +
    "            <div class=\"item\">\n" +
    "                <ionic-timepicker input-obj=\"timePickerObject\">\n" +
    "                    <button class=\"button button-block button-steelblue overflowShow\">\n" +
    "                        <standard-time-meridian etime='timePickerObject.inputEpochTime'></standard-time-meridian>\n" +
    "                        {{timePickerObject.inputEpochTime}}\n" +
    "                    </button>\n" +
    "                </ionic-timepicker>\n" +
    "            </div>\n" +
    "            <label class=\"item item-input\">\n" +
    "                <span class=\"input-label\">Shift length</span>\n" +
    "                <input type=\"text\" ng-model=\"shift.length\">\n" +
    "            </label>\n" +
    "            <div class=\"item\">\n" +
    "                <button class=\"button button-block button-steelblue\" ng-click=\"createShift()\">\n" +
    "                    Create shift\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/requestshift/selectjob.html',
    "<ion-view view-title=\"What position\" can-swipe-back=\"false\">\n" +
    "    <ion-content id=\"request-shift-create-shift\" class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"item\">\n" +
    "                locationid: {{location_id}}\n" +
    "            </div>\n" +
    "            <a href=\"#{{getBaseUrl()}}/{{userclass.id}}\" class=\"item item-icon-right\" ng-repeat=\"(userclass_id, userclass) in userclasses\">\n" +
    "                {{userclass.title}} - {{userclass.description}}\n" +
    "                <i class=\"icon ion-chevron-right\"></i>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/requestshift/selectlocation.html',
    "<ion-view view-title=\"Where is your shift at?\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content id=\"request-shift-select-location\" class=\"has-header\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"\">\n" +
    "                Use this page to request your shift be filled...<br>\n" +
    "                Where do you need to have your shift filled at?\n" +
    "            </div>\n" +
    "            <div ng-repeat=\"(group_id, group) in groups\">\n" +
    "                <div class=\"item item-divider\">\n" +
    "                    {{group.name}}\n" +
    "                </div>\n" +
    "                <div ng-repeat=\"(location_id, location) in group.locations\">\n" +
    "                    <a href=\"#{{getNextPageLocation(location_id)}}\" class=\"item item-icon-right\">\n" +
    "                        {{location.address}}\n" +
    "                        <i class=\"icon ion-chevron-right\"></i>\n" +
    "                    </a>\n" +
    "                    <a href=\"#{{getNextPageSublocation(sublocation.id)}}\" class=\"item item-icon-right\" ng-repeat=\"sublocation in location.sublocations\">\n" +
    "                        {{sublocation.title}}\n" +
    "                        <i class=\"icon ion-chevron-right\"></i>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/search.html',
    "<ion-view view-title=\"Search\">\n" +
    "  <ion-content>\n" +
    "    <h1>Search</h1>\n" +
    "  </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/settings/privacy-policy.html',
    "<ion-view view-title=\"Privacy Policy\" can-swipe-back=\"false\">\n" +
    "\n" +
    "<ion-content>\n" +
    "\n" +
    "<div id=\"tf-contact\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-8 col-md-offset-2\">\n" +
    "                <div id=\"ppHeader\">\n" +
    "                    Privacy Policy\n" +
    "                </div>\n" +
    "                <div id=\"ppBody\">\n" +
    "                    <div class=\"ppConsistencies\">\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"quick-links text-center\">\n" +
    "                                Information Collection\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"quick-links text-center\">\n" +
    "                                Information Usage\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"quick-links text-center\">\n" +
    "                                Information Protection\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"quick-links text-center\">\n" +
    "                                Cookie Usage\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"quick-links text-center\">\n" +
    "                                3rd Party Disclosure\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"quick-links text-center\">\n" +
    "                                3rd Party Links\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\"></div>\n" +
    "                    </div>\n" +
    "                    <div style=\"clear:both;height:10px;\"></div>\n" +
    "                    <div class=\"ppConsistencies\">\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"col-12 quick-links2 gen-text-center\">\n" +
    "                                Google Analytics\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"col-12 quick-links2 gen-text-center\">\n" +
    "                                Fair Information Practices\n" +
    "                                <div class=\"col-8 gen-text-left gen-xs-text-center\" style=\"font-size:12px;position:relative;left:20px;\">\n" +
    "                                    Fair information\n" +
    "                                    <br /> Practices\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"col-12 quick-links2 gen-text-center coppa-pad\">\n" +
    "                                COPPA\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"col-12 quick-links2 quick4 gen-text-center caloppa-pad\">\n" +
    "                                CalOPPA\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-2\">\n" +
    "                            <div class=\"quick-links2 gen-text-center\">\n" +
    "                                Our Contact Information\n" +
    "                                <br />\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div style=\"clear:both;height:10px;\"></div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <span id=\"infoCo\"></span>\n" +
    "                    <br />\n" +
    "                    <div class=\"grayText\">\n" +
    "                        <strong>What personal information do we collect from the people that visit our blog, website or app?</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We do not collect information from visitors of our site.\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"grayText\">\n" +
    "                        <strong>When do we collect information?</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We collect information from you when you register on our site or enter information on our site.\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <span id=\"infoUs\"></span>\n" +
    "                    <br />\n" +
    "                    <div class=\"grayText\">\n" +
    "                        <strong>How do we use your information? </strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We may use the information we collect from you when you register, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> To improve our website in order to better serve you.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> To allow us to better service you in responding to your customer service requests.\n" +
    "                    </div>\n" +
    "                    <span id=\"infoPro\"></span>\n" +
    "                    <br />\n" +
    "                    <div class=\"grayText\">\n" +
    "                        <strong>How do we protect your information?</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We do not use vulnerability scanning and/or scanning to PCI standards since we do not collect any credit card information.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We only provide articles and information. We never ask for credit card numbers.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We use regular Malware Scanning.\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We implement a variety of security measures when a user enters, submits, or accesses their information to maintain the safety of your personal information.\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        All transactions are processed through a gateway provider and are not stored or processed on our servers.\n" +
    "                    </div>\n" +
    "                    <span id=\"coUs\"></span>\n" +
    "                    <br />\n" +
    "                    <div class=\"grayText\">\n" +
    "                        <strong>Do we use 'cookies'?</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember that you are logged in. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />\n" +
    "                        <strong>We use cookies to:</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Keep you logged in.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Understand and save user's preferences for future visits.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Please note that by disabling cookies you may have issues logging into and using the site. Since each browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        If you turn cookies off, some features will be disabled. It won't affect the user's experience that make your site experience more efficient and may not function properly.\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <br />\n" +
    "                    <span id=\"trDi\"></span>\n" +
    "                    <br />\n" +
    "                    <div class=\"grayText\">\n" +
    "                        <strong>Third-party disclosure</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.\n" +
    "                    </div>\n" +
    "                    <span id=\"trLi\"></span>\n" +
    "                    <br />\n" +
    "                    <div class=\"grayText\">\n" +
    "                        <strong>Third-party links</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We do not include or offer third-party products or services on our website.\n" +
    "                    </div>\n" +
    "                    <span id=\"gooAd\"></span>\n" +
    "                    <br />\n" +
    "                    <div class=\"blueText\">\n" +
    "                        <strong>Google</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Google's Analytics' requirements can be summed up by Google's Analytics Principles. They are put in place to provide a positive experience for users. https://support.google.com/analytics#topic=3544906\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />\n" +
    "                        <strong>We have implemented the following:</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Demographics and Interests Reporting\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We, along with third-party vendors such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions and other ad service functions as they relate to our website.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />\n" +
    "                        <strong>Opting out:</strong><br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />\n" +
    "                        Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising Initiative Opt Out page or by using the Google Analytics Opt Out Browser add on.\n" +
    "                    </div>\n" +
    "                    <span id=\"calOppa\"></span><br />\n" +
    "                    <div class=\"blueText\">\n" +
    "                        <strong>California Online Privacy Protection Act</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. - See more at: http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />\n" +
    "                        <strong>According to CalOPPA, we agree to the following:</strong>\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Users can visit our site anonymously.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Our Privacy Policy link includes the word 'Privacy' and can be easily be found on the page specified above.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />You will be notified of any Privacy Policy changes:\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> On our Privacy Policy Page\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Can change your personal information:\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> By logging in to your account\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />\n" +
    "                        <strong>How does our site handle Do Not Track signals?</strong>\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />\n" +
    "                        <strong>Does our site allow third-party behavioral tracking?</strong>\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        It's also important to note that we do not allow third-party behavioral tracking\n" +
    "                    </div><span id=\"coppAct\"></span><br />\n" +
    "                    <div class=\"blueText\">\n" +
    "                        <strong>COPPA (Children Online Privacy Protection Act)</strong>\n" +
    "                    </div><br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        When it comes to the collection of personal information from children under the age of 13 years old, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States' consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online.\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We do not specifically market to children under the age of 13 years old.\n" +
    "                    </div><span id=\"ftcFip\"></span><br />\n" +
    "                    <div class=\"blueText\">\n" +
    "                        <strong>Fair Information Practices</strong>\n" +
    "                    </div><br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <strong>In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We will notify you via email\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Within 1 business day\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        We will notify the users via in-site notification\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Within 1 business day\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />We also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.\n" +
    "                    </div><span id=\"canSpam\"></span><br />\n" +
    "                    <div class=\"blueText\">\n" +
    "                        <strong>CAN SPAM Act</strong>\n" +
    "                    </div><br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <strong>We collect your email address in order to:</strong>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Send information, respond to inquiries, and/or other requests or questions\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Process orders and to send information and updates pertaining to orders.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Send you additional information related to your product and/or service\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <br />\n" +
    "                        <strong>To be in accordance with CANSPAM, we agree to the following:</strong>\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Not use false or misleading subjects or email addresses.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Identify the message as an advertisement in some reasonable way.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Include the physical address of our business or site headquarters.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Monitor third-party email marketing services for compliance, if one is used.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Honor opt-out/unsubscribe requests quickly.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Allow users to unsubscribe by using the link at the bottom of each email.\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        <strong><br />If at any time you would like to unsubscribe from receiving future emails, you can email us at</strong>\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\"><br />\n" +
    "                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <strong>•</strong> Follow the instructions at the bottom of each email and we will promptly remove you from <strong>ALL</strong> correspondence.<br /><span id=\"ourCon\"></span><br />\n" +
    "                    </div>\n" +
    "                    <div class=\"blueText\">\n" +
    "                        <strong>Contacting Us</strong>\n" +
    "                    </div><br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        If there are any questions regarding this privacy policy, you may contact us using the information below.\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        www.Proxyshift.com\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Available Upon Request\n" +
    "                    </div>Chicago, IL 60602\n" +
    "                    <div class=\"innerText\">\n" +
    "                        USA\n" +
    "                    </div>\n" +
    "                    <div class=\"innerText\">\n" +
    "                        Support@Proxyshift.com\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <br />\n" +
    "                    <div class=\"blueText\">\n" +
    "                        <strong>Change log</strong>\n" +
    "                    </div><br />\n" +
    "                    <div class=\"innerText\">\n" +
    "                        7-1-16: Privacy Policy Created\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "</ion-content>\n" +
    "\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/settings/settings.html',
    "<ion-pane id=\"settings-page\" can-swipe-back=\"false\">\n" +
    "    <ion-nav-bar>\n" +
    "        <ion-nav-back-button></ion-nav-back-button>\n" +
    "        <ion-nav-buttons side=\"right\">\n" +
    "            <button class=\"button button-icon ion-close\" ui-sref=\"app.home\"></button>\n" +
    "        </ion-nav-buttons>\n" +
    "    </ion-nav-bar>\n" +
    "    <ion-view>\n" +
    "        <ion-nav-view name=\"content\"></ion-nav-view>\n" +
    "    </ion-view>\n" +
    "</ion-pane>\n"
  );


  $templateCache.put('templates/settings/settingsgroup.html',
    "<ion-pane>\n" +
    "    <ion-nav-view name=\"groupContent\"></ion-nav-view>\n" +
    "</ion-pane>\n"
  );


  $templateCache.put('templates/settings/terms-of-service.html',
    "<ion-view view-title=\"TOS\" can-swipe-back=\"false\">\n" +
    "\n" +
    "<ion-content>\n" +
    "\n" +
    "<div id=\"tf-contact\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-8 col-md-offset-2\">\n" +
    "                <p>\n" +
    "                    <strong>Terms of Service:</strong>\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    The following terms and conditions govern all use of the ProxyShift.com website and all content, services, and products available at or through the\n" +
    "                    website, including, but not limited to, \"Proxy Shift\". Our Services are offered subject to your acceptance without modification of all of the terms and\n" +
    "                    conditions contained herein and all other operating rules, policies (including, without limitation,    <a href=\"/privacy-policy.html\"><u>Proxy Shift’s Privacy Policy</u></a>) and procedures that may be published from time to time by Proxy\n" +
    "                    Shift (collectively, the “Agreement”). You agree that we may automatically upgrade our Services, and these terms will apply to any upgrades. If you reside\n" +
    "                    in the United States, your agreement is with Proxy Shift (US) (each, “Proxy Shift” or “we”).\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    Please read this Agreement carefully before accessing or using our Services. By accessing or using any part of our services, you agree to become bound by\n" +
    "                    the terms and conditions of this agreement. If you do not agree to all the terms and conditions of this agreement, then you may not access or use any of\n" +
    "                    our services. If these terms and conditions are considered an offer by Proxy Shift, acceptance is expressly limited to these terms.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    Our Services are not directed to children younger than 13, and access and use of our Services is only offered to users 13 years of age or older. If you are\n" +
    "                    under 13 years old, please do not register to use our Services. Any person who registers as a user or provides their personal information to our Services\n" +
    "                    represents that they are 13 years of age or older.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    Use of our Services requires a ProxyShift.com account. You agree to provide us with complete and accurate information when you register for an account. You\n" +
    "                    will be solely responsible and liable for any activity that occurs under your username. You are responsible for keeping your password secure.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    1. ProxyShift.com.\n" +
    "                </p>\n" +
    "                <ul>\n" +
    "                    <li>\n" +
    "                        <p>\n" +
    "                            <strong>Your Proxyshift.com Account.</strong>\n" +
    "                            If you create an account Proxyshift.com, you are responsible for maintaining the security of your account and you are fully responsible for all\n" +
    "                            activities that occur under the account and any other actions taken in connection with the account. You must immediately notify Proxy Shift of any\n" +
    "                            unauthorized uses of your account or any other breaches of security. Proxy Shift will not be liable for any acts or omissions by you, including any\n" +
    "                            damages of any kind incurred as a result of such acts or omissions.\n" +
    "                        </p>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <p>\n" +
    "                            <strong>Responsibility of Employers and Employees.</strong>\n" +
    "                            If you use the application you are entirely responsible for the content of, and any harm resulting from, your Content or your conduct. That is the\n" +
    "                            case regardless of what form the Content takes, which includes, but is not limited to text, photo, video, audio, or code. By using ProxyShift.com,\n" +
    "                            you represent and warrant that your Content and conduct do not violate these terms. By creating an account on Proxy Shift you grant Proxy Shift a\n" +
    "                            world-wide, royalty-free, and non-exclusive license to use your company logo on the website. Without limiting any of those representations or\n" +
    "                            warranties, Proxy Shift has the right (though not the obligation) to, in Proxy Shift’s sole discretion, (i) refuse or remove any content that, in\n" +
    "                            Proxy Shift’s reasonable opinion, violates any Proxy Shift policy or is in any way harmful or objectionable, or (ii) terminate or deny access to\n" +
    "                            and use of Proxyshift.com to any individual or entity for any reason. Proxy Shift will have no obligation to provide a refund of any amounts\n" +
    "                            previously paid.\n" +
    "                        </p>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <p>\n" +
    "                            <strong>Web Traffic.</strong>\n" +
    "                            We use a third party, Google Analytics, (“Google Analytics”), to measure ProxyShift.com’s audience and usage. By visiting Proxyshift.com or using\n" +
    "                            the application on you agree to assign the traffic relating to your account to Proxy Shift and authorize us to sign a Traffic Assignment Letter on\n" +
    "                            your behalf for Google Analytics audience measurement reports.\n" +
    "                        </p>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <p>\n" +
    "                            <strong>HTTPS.</strong>\n" +
    "                            We use HTTPS on ProxyShift.com by default, including those using custom domains, via <a href=\"https://letsencrypt.org/\"><u>Let’s Encrypt</u></a>.\n" +
    "                        </p>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <p>\n" +
    "                            <strong>Advertisements.</strong>\n" +
    "                            Proxy Shift currently does not use any advertisements in the application or website however we reserves the right to display advertisements on the\n" +
    "                            application and website in the future.\n" +
    "                        </p>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <p>\n" +
    "                            <strong>Payment and Renewal.</strong>\n" +
    "                        </p>\n" +
    "                        <ul>\n" +
    "                            <li>\n" +
    "                                <p>\n" +
    "                                    <strong>General Terms. </strong>\n" +
    "                                    <br/>\n" +
    "                                    Optional paid services such as custom integration purchases are available (any such services, an “Upgrade”). By selecting an Upgrade you\n" +
    "                                    agree to pay Proxy Shift the monthly or annual subscription fees indicated for that service. Payments will be charged on a pre-pay basis on\n" +
    "                                    the day you sign up for an Upgrade and will cover the use of that service for a monthly or annual subscription period as indicated.\n" +
    "                                </p>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <p>\n" +
    "                                    <strong>Automatic Renewal.</strong>\n" +
    "                                </p>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <p>\n" +
    "                    Unless you notify Proxy Shift before the end of the applicable subscription period that you want to cancel an Upgrade, your Upgrade subscription will\n" +
    "                    automatically renew and you authorize us to collect the then-applicable annual or monthly subscription fee for such Upgrade (as well as any taxes) using\n" +
    "                    any credit card or other payment mechanism we have on record for you. Upgrades can be canceled at any time in the Upgrades section of your website’s\n" +
    "                    dashboard.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    2. Responsibility of Visitors.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    Proxy Shift has not reviewed, and cannot review, all of the material, including computer software, posted to our Services, and cannot therefore be\n" +
    "                    responsible for that material’s content, use or effects. By operating our Services, Proxy Shift does not represent or imply that it endorses the material\n" +
    "                    there posted, or that it believes such material to be accurate, useful, or non-harmful. You are responsible for taking precautions as necessary to protect\n" +
    "                    yourself and your computer systems from viruses, worms, Trojan horses, and other harmful or destructive content. Our Services may contain technical\n" +
    "                    inaccuracies, typographical mistakes, and other errors. Proxy Shift disclaims any responsibility for any harm resulting from the use by visitors of our\n" +
    "                    Services, or from any downloading by those visitors of content there posted.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    3. Copyright Infringement and DMCA Policy.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    As Proxy Shift asks others to respect its intellectual property rights, it respects the intellectual property rights of others. If you believe that\n" +
    "                    material located on or linked to by ProxyShift.com violates your copyright, you are encouraged to notify Proxy Shift. Proxy Shift will respond to all such\n" +
    "                    notices, including as required or appropriate by removing the infringing material or disabling all links to the infringing material.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    4. Intellectual Property.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    This Agreement does not transfer from Proxy Shift to you any Proxy Shift or third party intellectual property, and all right, title, and interest in and to\n" +
    "                    such property will remain (as between the parties) solely with Proxy Shift. Proxy Shift, ProxyShift.com, the ProxyShift.com logo, and all other trademarks,\n" +
    "                    service marks, graphics and logos used in connection with ProxyShift.com or our Services, are trademarks or registered trademarks of Proxy Shift or Proxy\n" +
    "                    Shift’s licensors. Other trademarks, service marks, graphics and logos used in connection with our Services may be the trademarks of other third parties.\n" +
    "                    Your use of our Services grants you no right or license to reproduce or otherwise use any Proxy Shift or third-party trademarks.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    5. Changes.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    We are constantly updating our Services, and that means sometimes we have to change the legal terms under which our Services are offered. If we make\n" +
    "                    changes that are material, we will let you know by posting on one of our blogs, or by sending you an email or other communication before the changes take\n" +
    "                    effect. The notice will designate a reasonable period of time after which the new terms will take effect. If you disagree with our changes, then you should\n" +
    "                    stop using our Services within the designated notice period. Your continued use of our Services will be subject to the new terms. However, any dispute that\n" +
    "                    arose before the changes shall be governed by the Terms (including the binding individual arbitration clause) that were in place when the dispute arose.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    11. Termination.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    Proxy Shift may terminate your access to all or any part of our Services at any time, with or without cause, with or without notice, effective immediately.\n" +
    "                    If you wish to terminate this Agreement or your ProxyShift.com account (if you have one), you may simply discontinue using our Services. All provisions of\n" +
    "                    this Agreement which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty\n" +
    "                    disclaimers, indemnity and limitations of liability.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    12. Disclaimer of Warranties.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    Our Services are provided “as is.” Proxy Shift and its suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including,\n" +
    "                    without limitation, the warranties of merchantability, fitness for a particular purpose and non-infringement. Neither Proxy Shift nor its suppliers and\n" +
    "                    licensors, makes any warranty that our Services will be error free or that access thereto will be continuous or uninterrupted. You understand that you\n" +
    "                    download from, or otherwise obtain content or services through, our Services at your own discretion and risk.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    13. Limitation of Liability.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    In no event will Proxy Shift, or its suppliers or licensors, be liable with respect to any subject matter of this Agreement under any contract, negligence,\n" +
    "                    strict liability or other legal or equitable theory for: (i) any special, incidental or consequential damages; (ii) the cost of procurement for substitute\n" +
    "                    products or services; (iii) for interruption of use or loss or corruption of data; or (iv) for any amounts that exceed the fees paid by you to Proxy Shift\n" +
    "                    under this agreement during the twelve (12) month period prior to the cause of action. Proxy Shift shall have no liability for any failure or delay due to\n" +
    "                    matters beyond their reasonable control. The foregoing shall not apply to the extent prohibited by applicable law.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    14. General Representation and Warranty.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    You represent and warrant that (i) your use of our Services will be in strict accordance with the Proxy Shift Privacy Policy, with this Agreement, and with\n" +
    "                    all applicable laws and regulations (including without limitation any local laws or regulations in your country, state, city, or other governmental area,\n" +
    "                    regarding online conduct and acceptable content, and including all applicable laws regarding the transmission of technical data exported from the United\n" +
    "                    States or the country in which you reside) and (ii) your use of our Services will not infringe or misappropriate the intellectual property rights of any\n" +
    "                    third party.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    15. US Economic Sanctions.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    You expressly represent and warrant that your use of our Services and or associated services and products is not contrary to applicable U.S. Sanctions.\n" +
    "                    Such use is prohibited, and Proxy Shift reserve the right to terminate accounts or access of those in the event of a breach of this condition.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    16. Indemnification.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    You agree to indemnify and hold harmless Proxy Shift, its contractors, and its licensors, and their respective directors, officers, employees, and agents\n" +
    "                    from and against any and all claims and expenses, including attorneys’ fees, arising out of your use of our Services, including but not limited to your\n" +
    "                    violation of this Agreement.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    17. Translation.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    These Terms of Service were originally written in English (US). We may translate these terms into other languages. In the event of a conflict between a\n" +
    "                    translated version of these Terms of Service and the English version, the English version will control.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    18. Miscellaneous.\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    This Agreement constitutes the entire agreement between Proxy Shift and you concerning the subject matter hereof, and they may only be modified by a\n" +
    "                    written amendment signed by an authorized executive of Proxy Shift, or by the posting by Proxy Shift of a revised version. Except to the extent applicable\n" +
    "                    law, if any, provides otherwise, this Agreement, any access to or use of our Services will be governed by the laws of the state of California, U.S.A.,\n" +
    "                    excluding its conflict of law provisions, and the proper venue for any disputes arising out of or relating to any of the same will be the state and federal\n" +
    "                    courts located in San Francisco County, California. Except for claims for injunctive or equitable relief or claims regarding intellectual property rights\n" +
    "                    (which may be brought in any competent court without the posting of a bond), any dispute arising under this Agreement shall be finally settled in\n" +
    "                    accordance with the Comprehensive Arbitration Rules of the Judicial Arbitration and Mediation Service, Inc. (“JAMS”) by three arbitrators appointed in\n" +
    "                    accordance with such Rules. The arbitration shall take place in San Francisco, California, in the English language and the arbitral decision may be\n" +
    "                    enforced in any court. The prevailing party in any action or proceeding to enforce this Agreement shall be entitled to costs and attorneys’ fees. If any\n" +
    "                    part of this Agreement is held invalid or unenforceable, that part will be construed to reflect the parties’ original intent, and the remaining portions\n" +
    "                    will remain in full force and effect. A waiver by either party of any term or condition of this Agreement or any breach thereof, in any one instance, will\n" +
    "                    not waive such term or condition or any subsequent breach thereof. You may assign your rights under this Agreement to any party that consents to, and\n" +
    "                    agrees to be bound by, its terms and conditions; Proxy Shift may assign its rights under this Agreement without condition. This Agreement will be binding\n" +
    "                    upon and will inure to the benefit of the parties, their successors and permitted assigns.\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "</ion-content>\n" +
    "\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/settingsgroupmembersmanage.html',
    "<ion-view view-title=\"Manage member\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <h4 class=\"new-shift-title\">{{user.firstname}} {{user.lastname}}</h4>\n" +
    "        <div class=\"list list-inset\">\n" +
    "            <form name=\"typeEditForm\" ng-submit=\"modifyPrivilegeLevel()\">\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Edit Permission level\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <fancy-select\n" +
    "                            ng-if=\"grouppermission_id != -1 && !isDisallowed()\"\n" +
    "                            header-text=\"Select an option\"\n" +
    "                            items=\"permissions\"\n" +
    "                            value-property=\"id\"\n" +
    "                            value=\"grouppermission_id\"\n" +
    "                            text-property=\"description\"\n" +
    "                            allow-empty='false'\n" +
    "                            modal-template-url=\"templates/types/typemodal.html\"\n" +
    "                            template-url=\"templates/types/typeitem.html\"\n" +
    "                            value-changed=\"permissionLevelSelected(value)\"\n" +
    "                            >\n" +
    "                        </fancy-select>\n" +
    "                        <div ng-if=\"isDisallowed()\">\n" +
    "                            {{getPermissionText()}}\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"grouppermission_id == -1\">\n" +
    "                            Owner\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button ng-if=\"grouppermission_id != -1\"\n" +
    "                        ng-disabled=\"user.grouppermission_id == grouppermission_id || saving || isDisallowed()\"\n" +
    "                        class=\"button button-block button-steelblue\"\n" +
    "                        type=\"submit\">\n" +
    "                    <span ng-if=\"saving\">Saving...</span>\n" +
    "                    <span ng-if=\"!saving && !isDisallowed()\">Save changes</span>\n" +
    "                    <span ng-if=\"isDisallowed()\">Cannot edit your own privilege level</span>\n" +
    "                </button>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/shiftinfo.html',
    "<ion-view can-swipe-back=\"false\">\n" +
    "    <ion-header-bar align-title=\"left\" class=\"bar-positive\">\n" +
    "        <h1 class=\"title\">Shift Details</h1>\n" +
    "        <div class=\"buttons\" side=\"right\">\n" +
    "            <button class=\"button button-icon ion-close\" ng-click=\"close()\"></button>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header\">\n" +
    "        <div ng-if=\"shift\">\n" +
    "            <h4 class=\"new-shift-title\" ng-if=\"shift.description\">{{shift.description}}</h4>\n" +
    "            <div class=\"list compacted-list list-inset full-width-inputs\">\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">Start</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col list-item-padding\">\n" +
    "                        {{getReadableLocalShiftStartEndTime(shift)}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">Length</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col list-item-padding\">\n" +
    "                        {{getReadableShiftDuration(shift)}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\"\n" +
    "                    ng-if=\"shift.shiftapplications.length > 0\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">Shift Applications</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col list-item-padding\">\n" +
    "                        &nbsp;\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <ul class=\"item item-input row\"\n" +
    "                    ng-repeat=\"shiftapplication in shift.shiftapplications\"\n" +
    "                    ng-if=\"shift.shiftapplications.length > 0\">\n" +
    "                    <div class=\"col list-item-padding\"\n" +
    "                         ng-if=\"!shiftapplication.recinded\">\n" +
    "                        <li class=\"item shiftapplication\" ng-class=\"{'shift-approved': shiftApplicationIsAccepted(shiftapplication), 'shift-declined': shiftApplicationIsDeclined(shiftapplication)}\">\n" +
    "                            <div style=\"float:right;\">\n" +
    "                                <button class=\"button button-assertive\" style=\"float: right;\"\n" +
    "                                        ng-disabled=\"shiftApplicationIsDeclined(shiftapplication)\"\n" +
    "                                        ng-click=\"declineShiftApplication(shiftapplication)\">\n" +
    "                                    <i class=\"icon ion-close\"></i>\n" +
    "                                </button>\n" +
    "                                <button class=\"button button-positive\" style=\"float: right;\"\n" +
    "                                        ng-disabled=\"shiftApplicationIsAccepted(shiftapplication)\"\n" +
    "                                        ng-click=\"approveShiftApplication(shiftapplication)\">\n" +
    "                                    <i class=\"icon ion-checkmark\"></i>\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                            <div style=\"vertical-align: middle; white-space: normal; overflow-wrape: normal;\">\n" +
    "                                {{shiftapplication.user.username}}<br>\n" +
    "                                Applied on <span style=\"white-space: nowrap\">{{getReadableLocalShiftApplicationTime(shift, shiftapplication)}}</span>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </div>\n" +
    "                </ul>\n" +
    "                <div class=\"item row\">\n" +
    "                    <div class=\"col\">\n" +
    "                        <button style=\"width: 100%\"\n" +
    "                                class=\"button button-block button-positive activated\"\n" +
    "                                ng-click=\"next()\">\n" +
    "                            Apply\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <button style=\"width: 100%\"\n" +
    "                                class=\"button button-block button-positive activated\"\n" +
    "                                ng-click=\"next()\">\n" +
    "                            Decline\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item row\">\n" +
    "                    <div class=\"col\">\n" +
    "                        <button style=\"width: 100%\"\n" +
    "                                class=\"button button-block button-assertive activated\"\n" +
    "                                ng-click=\"removeShift(shift)\">\n" +
    "                            DELETE SHIFT\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"!shift\">\n" +
    "            Loading...\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/shifts.html',
    "<ion-view view-title=\"Shifts\" hide-back-button=\"true\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header has-footer\">\n" +
    "        <ion-refresher\n" +
    "            pulling-text=\"Pull to refresh...\"\n" +
    "            on-refresh=\"fetch()\">\n" +
    "        </ion-refresher>\n" +
    "        <shift-list dismissable=\"true\" name=\"AllShifts\"></shift-list>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/shifttabs.html',
    "<div id=\"app-header-tab\" class=\"tabs-striped tabs-top tabs-background-positive tabs-color-light app-header-tab\">\n" +
    "    <div class=\"tabs\" style=\"top: 0\">\n" +
    "        <a class=\"tab-item\" href=\"#{{states.SHIFTS_URL}}\" ng-class=\"{'active': currentState == states.SHIFTS}\">\n" +
    "            Open Shifts\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\" href=\"#{{states.MYSHIFTS_URL}}\" ng-class=\"{'active': currentState == states.MYSHIFTS}\">\n" +
    "            My Shifts\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\" href=\"#{{states.MYCALLOUTS_URL}}\" ng-class=\"{'active': currentState == states.MYCALLOUTS}\">\n" +
    "            My Callouts\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\" href=\"#{{states.MANAGE_URL}}\"\n" +
    "           ng-class=\"{'active': currentState == states.MANAGE}\"\n" +
    "           ng-if=\"userinfo.ownedGroups.length > 0 || userinfo.privilegedMemberOfGroups.length > 0 || userinfo.privilegedMemberOfLocations.length > 0\">\n" +
    "            Manage\n" +
    "        </a>\n" +
    "        <div style=\"position: absolute; top: 100%; left: 0; z-index: 1005; width: inherit; background-color: #FFF;\">\n" +
    "            <shift-calendar value=\"AllShifts\" toggle=\"true\" show=\"false\"></shift-calendar>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<ion-nav-view name=\"shiftTabContent\"></ion-nav-view>\n"
  );


  $templateCache.put('templates/signup.html',
    "<ion-modal-view>\n" +
    "    <ion-header-bar>\n" +
    "        <h1 class=\"title\">Signup</h1>\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button button-clear\" ng-click=\"closeSignup()\">Close</button>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div ng-controller=\"SignupController\">\n" +
    "            <form name=\"signupForm\" ng-submit=\"doSignup(signupForm.$valid)\" novalidate>\n" +
    "                <div class=\"list\">\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Username</span>\n" +
    "                        <input type=\"text\" name=\"username\" ng-model=\"user.username\" validate-user-username>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-username-messages=\"signupForm.username.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">First Name</span>\n" +
    "                        <input type=\"text\" name=\"firstname\" ng-model=\"user.firstname\" validate-user-firstname>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-firstname-messages=\"signupForm.firstname.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Last Name</span>\n" +
    "                        <input type=\"text\" name=\"lastname\" ng-model=\"user.lastname\" validate-user-lastname>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-lastname-messages=\"signupForm.lastname.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Email</span>\n" +
    "                        <input type=\"text\" name=\"email\" ng-model=\"user.email\" validate-user-email>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-email-messages=\"signupForm.email.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Password</span>\n" +
    "                        <input type=\"password\" name=\"password\" ng-model=\"user.password\" validate-user-password>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-password-messages=\"signupForm.password.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Secret Question</span>\n" +
    "                        <input type=\"text\" name=\"squestion\" ng-model=\"user.squestion\" validate-user-squestion>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-squestion-messages=\"signupForm.squestion.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Secret Answer</span>\n" +
    "                        <input type=\"text\" name=\"sanswer\" ng-model=\"user.sanswer\" validate-user-sanswer>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-sanswer-messages=\"signupForm.sanswer.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Phone (Home)</span>\n" +
    "                        <input type=\"text\" name=\"phonehome\" ng-model=\"user.phonehome\" validate-user-phonehome>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-phonehome-messages=\"signupForm.phonehome.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Phone (Mobile)</span>\n" +
    "                        <input type=\"text\" name=\"phonemobile\" ng-model=\"user.phonemobile\" validate-user-phonemobile>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-phonemobile-messages=\"signupForm.phonemobile.$error\"></div>\n" +
    "                    <label class=\"item item-input\">\n" +
    "                        <span class=\"input-label\">Pager Number</span>\n" +
    "                        <input type=\"text\" name=\"pagernumber\" ng-model=\"user.pagernumber\" validate-user-pagernumber>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"signupForm.$dirty\" validate-user-pagernumber-messages=\"signupForm.pagernumber.$error\"></div>\n" +
    "                    <label class=\"item\" ng-show=\"message != null\">\n" +
    "                        <span>{{message}}</span>\n" +
    "                    </label>\n" +
    "                    <button class=\"button button-block button-steelblue\" type=\"submit\">Create Account</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-modal-view>\n"
  );


  $templateCache.put('templates/sublocations.html',
    "<ion-nav-view>\n" +
    "    <ion-nav-view name=\"sublocationContent\"></ion-nav-view>\n" +
    "</ion-nav-view>\n"
  );


  $templateCache.put('templates/sublocations/sublocationcreate.html',
    "<ion-view view-title=\"Manage\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <form name=\"sublocationUpdateForm\" ng-submit=\"createSublocation()\" novalidate>\n" +
    "            <div class=\"list list-inset centered-input\">\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Title\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Floor/Unit/Department name\"\n" +
    "                               ng-model=\"sublocation.title\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-sublocation-title>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Description\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Optional\"\n" +
    "                               ng-model=\"sublocation.description\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-sublocation-description>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button ng-disabled=\"saving || !sublocationUpdateForm.$valid\"\n" +
    "                        class=\"button button-block button-steelblue\"\n" +
    "                        type=\"submit\">\n" +
    "                    <span ng-if=\"saving\">Creating...</span>\n" +
    "                    <span ng-if=\"!saving\">Create</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/sublocationslist.html',
    "<ion-view view-title=\"Sublocations\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"item item-divider\">\n" +
    "            Manage\n" +
    "        </div>\n" +
    "        <ion-item href=\"#/settings/group/{{group_id}}/locations/{{ location_id }}/new\">\n" +
    "            New Sublocation\n" +
    "        </ion-item>\n" +
    "        <div class=\"item item-divider\">\n" +
    "            Current Sublocations\n" +
    "        </div>\n" +
    "        <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "        <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "               placeholder=\"Search by name, email or phone\">\n" +
    "        <div class=\"list\">\n" +
    "            <ion-item ng-repeat=\"sublocation in location.sublocations | filter:query\"\n" +
    "                      item=\"sublocation\"\n" +
    "                      href=\"#/settings/group/{{ group_id }}/locations/{{ location_id }}/sublocations/{{ sublocation.id }}/list\">\n" +
    "                {{ sublocation.title }}\n" +
    "            </ion-item>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/tabs.html',
    "<div id=\"app-footer-tab\" class=\"tabs-striped tabs-background-positive tabs-color-light app-footer-tab\">\n" +
    "    <div class=\"tabs\">\n" +
    "        <a class=\"tab-item\" href=\"#{{states.HOME_URL}}\" ng-class=\"{'active': currentState == states.HOME}\">\n" +
    "            <i class=\"icon ion-home\"></i>\n" +
    "            Home\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\" href=\"{{currentTabPage || '#' + states.SHIFTS_URL}}\" ng-class=\"{'active': currentState.indexOf('app.shifts.') == 0}\">\n" +
    "            <i class=\"icon ion-android-time\"></i>\n" +
    "            Shifts\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\" href=\"{{currentTabPage || '#' + states.SHIFTS_URL}}\" ng-class=\"{'active': $rootScope.calendarShown}\"\n" +
    "           ng-click=\"toggleCalendar($event)\">\n" +
    "            <i class=\"icon ion-android-calendar\"></i>\n" +
    "            Calendar\n" +
    "        </a>\n" +
    "        <a class=\"tab-item\" ui-sref=\"{{states.SHIFT_REQUEST}}\" ng-class=\"{'active': currentState.indexOf('app.newshift') == 0}\">\n" +
    "            <i class=\"icon ion-radio-waves\"></i>\n" +
    "            Shift Request\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<ion-nav-view name=\"tabContent\"></ion-nav-view>\n"
  );


  $templateCache.put('templates/types/typecreate.html',
    "<ion-view view-title=\"Create Job Type\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <form name=\"typeCreateForm\" ng-submit=\"createType()\" novalidate>\n" +
    "            <div class=\"list list-inset centered-input\">\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Job Title\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: Nurse, Cashier, etc\"\n" +
    "                               ng-model=\"type.title\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-groupuserclass-title>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Description\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Optional\"\n" +
    "                               ng-model=\"sublocation.description\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-groupuserclass-description>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <ion-checkbox type=\"checkbox\" name=\"cansendnotification\" ng-model=\"type.cansendnotification\" ng-checked=\"type.cansendnotification\">\n" +
    "                        Can send notifications\n" +
    "                    </ion-checkbox>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <ion-checkbox type=\"checkbox\" name=\"requiremanagerapproval\" ng-model=\"type.requiremanagerapproval\" ng-checked=\"type.requiremanagerapproval\">\n" +
    "                        Requires manager approval\n" +
    "                    </ion-checkbox>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Permission Level\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <fancy-select\n" +
    "                            header-text=\"Select an option\"\n" +
    "                            items=\"permissions\"\n" +
    "                            value-property=\"id\"\n" +
    "                            value=\"type.grouppermissionid\"\n" +
    "                            text-property=\"description\"\n" +
    "                            allow-empty='false'\n" +
    "                            modal-template-url=\"templates/types/typemodal.html\"\n" +
    "                            template-url=\"templates/types/typeitem.html\"\n" +
    "                            value-changed=\"wat(value)\"\n" +
    "                            >\n" +
    "                        </fancy-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button ng-disabled=\"saving || !typeCreateForm.$valid\"\n" +
    "                        class=\"button button-block button-steelblue\"\n" +
    "                        type=\"submit\">\n" +
    "                    <span ng-if=\"saving\">Creating...</span>\n" +
    "                    <span ng-if=\"!saving\">Create</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/types/typeedit.html',
    "<ion-view view-title=\"Modify Job type\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <form name=\"typeUpdateForm\" ng-submit=\"editType()\" novalidate>\n" +
    "            <div class=\"list list-inset centered-input\">\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Job Title\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Ex: Nurse, Cashier, etc\"\n" +
    "                               ng-model=\"type.title\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-groupuserclass-title>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-25 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Description\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"Optional\"\n" +
    "                               ng-model=\"sublocation.description\"\n" +
    "                               name=\"title\"\n" +
    "                               validate-groupuserclass-description>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <ion-checkbox type=\"checkbox\" name=\"cansendnotification\" ng-model=\"type.cansendnotification\" ng-checked=\"type.cansendnotification\">\n" +
    "                        Can send notifications\n" +
    "                    </ion-checkbox>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <ion-checkbox type=\"checkbox\" name=\"requiremanagerapproval\" ng-model=\"type.requiremanagerapproval\" ng-checked=\"type.requiremanagerapproval\">\n" +
    "                        Requires manager approval\n" +
    "                    </ion-checkbox>\n" +
    "                </div>\n" +
    "                <div class=\"item item-input row\">\n" +
    "                    <div class=\"col col-50 list-item-padding\">\n" +
    "                        <h4 class=\"sub-subheader\">\n" +
    "                            <i class=\"icon ion-edit\"></i>\n" +
    "                            Permission Level\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">\n" +
    "                        <fancy-select\n" +
    "                            header-text=\"Select an option\"\n" +
    "                            items=\"permissions\"\n" +
    "                            value-property=\"id\"\n" +
    "                            value=\"type.grouppermissionid\"\n" +
    "                            text-property=\"description\"\n" +
    "                            allow-empty='false'\n" +
    "                            modal-template-url=\"templates/types/typemodal.html\"\n" +
    "                            template-url=\"templates/types/typeitem.html\"\n" +
    "                            value-changed=\"wat(value)\"\n" +
    "                            >\n" +
    "                        </fancy-select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button ng-disabled=\"saving || !typeUpdateForm.$valid\"\n" +
    "                        class=\"button button-block button-steelblue\"\n" +
    "                        type=\"submit\">\n" +
    "                    <span ng-if=\"saving\">Updating...</span>\n" +
    "                    <span ng-if=\"!saving\">Update</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/types/typeitem.html',
    "<ion-list>\n" +
    "    <ion-item ng-click=\"showItems($event)\">\n" +
    "        {{text}}\n" +
    "    <span class=\"item-note\">{{noteText}}\n" +
    "      <img class=\"{{noteImgClass}}\" ng-if=\"noteImg != null\" src=\"{{noteImg}}\" />\n" +
    "    </span>\n" +
    "    </ion-item>\n" +
    "</ion-list>\n"
  );


  $templateCache.put('templates/types/typelist.html',
    "<ion-view view-title=\"Job Types\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list list-inset centered-input\">\n" +
    "            <div class=\"item-indent\">\n" +
    "                <ion-item href=\"#/settings/group/{{group_id}}/createtype\">\n" +
    "                    <i class=\"icon ion-plus\"></i>\n" +
    "                    Add new Job Type\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Current Job Types\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <i class=\"icon ion-search placeholder-icon\"></i>\n" +
    "                    <input type=\"text\" ng-model=\"query\" ng-style=\"{'width' : '100%'}\"\n" +
    "                           placeholder=\"Search by name, email or phone\">\n" +
    "                </label>\n" +
    "                <div class=\"list\">\n" +
    "                    <ion-item ng-repeat=\"type in types | filter:query\"\n" +
    "                        href=\"#/settings/group/{{group_id}}/type/{{type.id}}\">\n" +
    "                        {{ type.title }}{{ isPrivilegedType(type) ? ' - (Admin)':'' }}\n" +
    "                    </ion-item>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );


  $templateCache.put('templates/types/typemodal.html',
    "<ion-modal-view>\n" +
    "    <ion-header-bar class=\"bar-positive\">\n" +
    "        <button class=\"button button-positive button-icon ion-ios-arrow-back\" ng-click=\"hideItems()\" />\n" +
    "        <h1 class=\"title\">{{headerText}}</h1>\n" +
    "        <button class=\"button button-positive button-icon ion-checkmark\" ng-show=\"multiSelect\" ng-click=\"validate()\" />\n" +
    "    </ion-header-bar>\n" +
    "\n" +
    "    <ion-content>\n" +
    "        <ion-list>\n" +
    "            <ion-item class=\"item-checkbox\" ng-if=\"multiSelect\" ng-repeat=\"item in items\">\n" +
    "                <label class=\"checkbox\">\n" +
    "                    <input type=\"checkbox\" ng-checked=\"item.checked\" ng-model=\"item.checked\">\n" +
    "                </label>\n" +
    "                {{item.description}}\n" +
    "            </ion-item>\n" +
    "            <ion-radio\n" +
    "                class=\"item clear-padding item-divider-bright-text\"\n" +
    "                ng-click=\"validate(item)\" ng-if=\"!multiSelect\" ng-repeat=\"item in items\"\n" +
    "                ng-model=\"item.checked\"\n" +
    "                ng-value=\"true\"\n" +
    "                ng-repeat=\"location in users | filter:query\">\n" +
    "                {{item.description}}\n" +
    "            </ion-radio>\n" +
    "        </ion-list>\n" +
    "    </ion-content>\n" +
    "</ion-modal-view>\n"
  );


  $templateCache.put('templates/usersettings.html',
    "<ion-view view-title=\"Settings\" can-swipe-back=\"false\">\n" +
    "    <ion-content class=\"has-header\" hide-back-button=\"false\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Application Settings\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <ion-toggle ng-model=\"UserSettings.pushnotifications\"\n" +
    "                            ng-checked=\"UserSettings.pushnotifications\"\n" +
    "                            ng-click=\"commitSettings()\">\n" +
    "                    <i class=\"icon ion-ios-bell\" ng-if=\"UserSettings.pushnotifications\"></i>\n" +
    "                    <i class=\"icon ion-ios-bell-outline\" ng-if=\"!UserSettings.pushnotifications\"></i>\n" +
    "                    Push Notifications\n" +
    "                </ion-toggle>\n" +
    "                <ion-toggle ng-model=\"UserSettings.emailnotifications\"\n" +
    "                            ng-checked=\"UserSettings.emailnotifications\"\n" +
    "                            ng-click=\"commitSettings()\">\n" +
    "                    <i class=\"icon ion-ios-email\" ng-if=\"UserSettings.emailnotifications\"></i>\n" +
    "                    <i class=\"icon ion-ios-email-outline\" ng-if=\"!UserSettings.emailnotifications\"></i>\n" +
    "                    Email Notifications\n" +
    "                </ion-toggle>\n" +
    "                <!--\n" +
    "                <ion-toggle ng-model=\"UserSettings.textnotifications\"\n" +
    "                            ng-checked=\"UserSettings.textnotifications\"\n" +
    "                            ng-show=\"false\"\n" +
    "                            ng-click=\"commitSettings()\">\n" +
    "                    <i class=\"icon ion-ios-telephone\"></i>\n" +
    "                    Text Notifications\n" +
    "                </ion-toggle>\n" +
    "                -->\n" +
    "                <ion-toggle ng-model=\"localSettings.showIgnoredShifts\"\n" +
    "                            ng-checked=\"localSettings.showIgnoredShifts\">\n" +
    "                    <i class=\"icon ion-ios-clock\" ng-if=\"localSettings.showIgnoredShifts\"></i>\n" +
    "                    <i class=\"icon ion-ios-clock-outline\" ng-if=\"!localSettings.showIgnoredShifts\"></i>\n" +
    "                    Show Ignored Shifts\n" +
    "                </ion-toggle>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                My Company Settings\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <ion-item ng-repeat=\"group in groupsList\"\n" +
    "                          item=\"group\"\n" +
    "                          href=\"#{{states.GROUPSETTINGS_URL}}/{{group.id}}/settings\" class=\"item-remove-animate\">\n" +
    "                    {{ group.name }}\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                More Information\n" +
    "            </div>\n" +
    "            <ion-item>\n" +
    "                Support\n" +
    "            </ion-item>\n" +
    "            <ion-item href=\"#{{states.PRIVACYPOLICY_URL}}\">\n" +
    "                Privacy Policy\n" +
    "            </ion-item>\n" +
    "            <ion-item href=\"#{{states.TOS_URL}}\">\n" +
    "                Terms of Service\n" +
    "            </ion-item>\n" +
    "            <ion-item>\n" +
    "                Licenses\n" +
    "            </ion-item>\n" +
    "            <div class=\"item item-divider\">\n" +
    "                Account Actions\n" +
    "            </div>\n" +
    "            <div class=\"item-indent\">\n" +
    "                <ion-item ng-if=\"checkForUpdate != undefined\"\n" +
    "                          ng-click=\"checkForUpdate()\">\n" +
    "                    <i class=\"icon ion-loop\"></i>\n" +
    "                    Check for Updates\n" +
    "                </ion-item>\n" +
    "                <ion-item href=\"#{{states.LOGOUT_URL}}\">\n" +
    "                    <i class=\"icon ion-log-out\"></i>\n" +
    "                    Logout\n" +
    "                </ion-item>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n"
  );

}]);
