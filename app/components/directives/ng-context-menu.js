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

define(function () {
    return function () {
        var renderContextMenu = function ($scope, event, options) {
            if (!$) {
                var $ = angular.element;
            }
            $(event.currentTarget).addClass('context');
            var $contextMenu = $('<div>');
            $contextMenu.addClass('dropdown clearfix');
            var $ul = $('<ul>');
            $ul.addClass('dropdown-menu');
            $ul.attr({'role': 'menu'});
            $ul.css({
                display: 'block',
                position: 'absolute',
                left: event.pageX + 'px',
                top: event.pageY + 'px'
            });
            angular.forEach(options, function (item, i) {
                var $li = $('<li>');
                if (item === null) {
                    $li.addClass('divider');
                } else {
                    $a = $('<a>');
                    $a.attr({tabindex: '-1', href: '#'});
                    $a.text(item[0]);
                    $li.append($a);
                    $li.on('click', function () {
                        $scope.$apply(function () {
                            item[1].call($scope, $scope);
                        });
                    });
                }
                $ul.append($li);
            });
            $contextMenu.append($ul);
            $contextMenu.css({
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9999
            });
            $(document).find('body').append($contextMenu);
            $contextMenu.on("click", function (e) {
                $(event.currentTarget).removeClass('context');
                $contextMenu.remove();
            }).on('contextmenu', function (event) {
                $(event.currentTarget).removeClass('context');
                event.preventDefault();
                $contextMenu.remove();
            });
        };
        return function ($scope, element, attrs) {
            element.on('contextmenu', function (event) {
                $scope.$apply(function () {
                    event.preventDefault();
                    var options = $scope.$eval(attrs.ngContextMenu);
                    if (options instanceof Array) {
                        renderContextMenu($scope, event, options);
                    } else {
                        throw '"' + attrs.ngContextMenu + '" not an array';
                    }
                });
            });
        };
    };
});
