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

    return function ExplorerDataSink($http, $q, DataSink) {
        return augment(DataSink, function (parent) {
            this.constructor = function (defaultColumnDef, $scope) {
                parent.constructor.call(this);
                this.$scope = $scope;
                this.columnDefs = [];
                this.defaultColumnDef = defaultColumnDef;
                this.snapshotPromise = $q.defer();
            }

            this.onSnapshotComplete = function () {
                parent.onSnapshotComplete.call(this);
                this.apply();
                this.snapshotPromise.resolve();
            };

            this.onDataReset = function(){
                parent.onDataReset.call(this);
            };

            this.onRowAdded = function (rowId, row) {
                parent.onRowAdded.call(this, rowId, row);
                this.apply();
                return row;
            };

            this.onRowUpdated = function (rowId, row) {
                parent.onRowUpdated.call(this, rowId, row);
                this.apply();
                return row;
            };

            this.onRowRemoved = function (rowId) {
                parent.onRowRemoved.call(this, rowId);
                this.apply();
            };

            this.onColumnAdded = function (colId, col) {
                this.columnDefs[colId] = $.extend({}, this.defaultColumnDef, this.$scope.getColumnDef(col));

                parent.onColumnAdded.call(this, colId, col);
            };


            // sort function for report data
            this.sortedData = function () {
                var sort = this.data.concat().sort(function (a, b) {
                    return a.rank > b.rank;
                });

                return sort;
            };

            this.getSnapshotPromise = function(){
                return this.snapshotPromise.promise;
            };

            this.apply = function () {
                if (this.status.snapshotComplete === true) {
                    this.$scope.$apply();
                }
            }
        });
    }
});