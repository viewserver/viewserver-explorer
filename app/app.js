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

define(function (require) {
    'use strict';

    var $ = require('jquery');
    var angular = require('angular');

    require('angularBootstrap');
    require('angularBootstrapTemplates');
    require('angularLocalStorage');
    require('angularDebounce');
    require('augment');
    require('components/directives/directives');
    require('components/filters/filters');
    require('components/connection/connection');
    require('components/globalData/globalData');
    require('components/grid/catalogGrid/catalogGrid');
    require('components/grid/schemaGrid/schemaGrid');
    require('api');

    var module = angular.module('viewserverExplorer.app', [
        'ngRoute',
        'ui.bootstrap',
        'LocalStorageModule',
        'filters',
        'directives',
        'cmm.viewserverExplorer.globalData',
        'cmm.viewserverExplorer.connection',
        'cmm.viewserverExplorer.catalogGrid',
        'cmm.viewserverExplorer.schemaGrid',
        'rt.debounce',
        'cmm.api'
    ]);

    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/connection'});
    }]);

    var explorerDataSink = require('explorer-dataSink');
    module.factory('ExplorerDataSink', explorerDataSink);



    return module;
});
