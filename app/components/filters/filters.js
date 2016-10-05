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

    var module = angular.module('filters', []);

    module.filter('nullToZero', require('components/filters/nullToZero-filter'));
    module.filter('nullToDash', require('components/filters/nullToDash-filter'));
    module.filter('numberNullToDash', require('components/filters/numberNullToDash-filter'));
    module.filter('dateNullToDash', require('components/filters/dateNullToDash-filter'));
    module.filter('numberNullToZero', require('components/filters/numberNullToZero-filter'));
    module.filter('dataTypeMap', require('components/filters/dataTypeMap-filter'));


    return module
});
