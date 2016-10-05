/*
 * Copyright 2016 Claymore Minds Limited and Niche Solutions (UK) Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require.config({
    paths: {
        bootstrap: 'js/apps/mixer-browser/bootstrap.min',
        angular: 'bower_components/angular/angular.min',
        angularRoute: 'bower_components/angular-route/angular-route.min',
        angularBootstrap: 'bower_components/angular-bootstrap/ui-bootstrap.min',
        angularBootstrapTemplates: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        augment: 'bower_components/augment/augment',
        jquery: 'bower_components/jquery/dist/jquery.min',
        jqueryResize: 'bower_components/javascript-detect-element-resize/jquery.resize.min',
        text: 'bower_components/requirejs-text/text.min',
        uiGrid: 'bower_components/angular-ui-grid/ui-grid',
        angularLocalStorage: 'bower_components/angular-local-storage/angular-local-storage.min',
        spin: 'bower_components/spin/spin.min',
        angularDebounce: 'bower_components/angular-debounce/dist/angular-debounce.min',
        api: 'bower_components/viewserver-js-api/api'
    },
    shim: {
        'angular': {'exports': 'angular'},
        'angularRoute': ['angular'],
        'angularBootstrap': ['angular'],
        'angularBootstrapTemplates' : ['angular', 'angularBootstrap'],
        'uiGrid': { exports: 'uiGrid', deps: ['jquery', 'angular']},
        'angularLocalStorage': { exports: 'angularLocalStorage', deps: ['angular']},
        'angularDebounce': { exports: 'angularDebounce', deps: ['angular']},
        'api' : {
            exports: 'api',
            deps:['jquery', 'angular']
        }
    },
    priority: [
        "angular"
    ]
});