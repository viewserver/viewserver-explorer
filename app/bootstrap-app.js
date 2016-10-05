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
    var app = require('app');
    var ngRoute = require('angularRoute');

    var bootstrap = angular.module('viewserverExplorer', [
        app.name
    ]);

    bootstrap.run(function (Logger, GlobalDataService) {
        Logger.setLogLevel(3);

        $.ajax({
            url :'connectionDetails.json',
            async: false,
            success: function(data ){
                GlobalDataService.setConnectionOptions(data);
            }
        });
    });

    // Bootstrap the app on DOM load
    $().ready(function() {
        var $bootstrapElement = $('[data-app-name="' + bootstrap.name + '"]');

        // If no matching element is found, use the page's `body` element as the app root element
        if ($bootstrapElement.length === 0) { $bootstrapElement = $('body'); }

        // Fire up the app
        angular.bootstrap($bootstrapElement, [bootstrap.name]);
        $('body').addClass('ng-app');
        $('.initiallyHidden').show();
    });

    return bootstrap;
});
