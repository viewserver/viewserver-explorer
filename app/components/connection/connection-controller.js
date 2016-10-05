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

    return function ConnectionCtrl($scope, $rootScope, $timeout, $routeParams, GlobalDataService, VirtualTableService, Projection, Logger) {
        $scope.operatorPath = '/' + ($routeParams['path'] || '');

        $scope.upstreamProjection = new Projection(Projection.Mode.INCLUSIONARY, [
            {inboundName: 'outputOperator', outboundName: 'path'},
            {inboundName: 'outputOperatorType'},
            {inboundName: 'output'},
            {inboundName: 'input'}
        ]);

        $scope.downstreamProjection = new Projection(Projection.Mode.INCLUSIONARY, [
            {inboundName: 'output'},
            {inboundName: 'inputOperator', outboundName: 'path'},
            {inboundName: 'inputOperatorType'},
            {inboundName: 'input'}
        ]);

        $scope.isConnected = function(){
            return VirtualTableService.isConnected();
        };

        $scope.connect = function () {
            if (!VirtualTableService.isConnected()) {
                VirtualTableService.connect(GlobalDataService.getConnectionOptions())
                    .then(function(){
                        $rootScope.$emit('dataMixer.connect');
                    }, function(e){
                        Logger.error(e)
                    })
            }
        };

        $scope.disconnect = function () {
            return VirtualTableService.disconnect();
        };


        $scope.connect();
    }
});