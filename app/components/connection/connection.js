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
    var angular = require('angular');

    var module = angular.module('cmm.viewserverExplorer.connection', []);

    module.controller('ConnectionCtrl', require('components/connection/connection-controller'));
    module.directive('vsConnection', require('components/connection/connection-directive'));

    //define the routing for this module
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/connection/:path*', {
                template: '<vs-connection class="full-height dashboard-holder"></div>',
                resolve: {
                    'VirtualTableService': function (GlobalDataService, VirtualTableService) {
                        return VirtualTableService.connect(GlobalDataService.getConnectionOptions());
                    }
                }
            })
            .when('/connection', {
                template: '<vs-connection class="full-height dashboard-holder"></div>',
                resolve: {
                    'VirtualTableService': function (GlobalDataService, VirtualTableService) {
                        return VirtualTableService.connect(GlobalDataService.getConnectionOptions());
                    }
                }
            })
    }]);

    /* Controllers */
    return module
});

