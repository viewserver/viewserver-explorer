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
    return function CatalogGridCtrl($scope, $rootScope, $location, $timeout, $route, $routeParams, localStorageService, debounce, VirtualTableService, ExplorerDataSink, Logger, GlobalDataService) {
        $scope.optsForSpinner = {
            lines: 13,
            length: 20,
            width: 10,
            radius: 30,
            corners: 1,
            rotate: 0,
            direction: 1,
            color: '#fff',
            speed: 1,
            trail: 60,
            shadow: false,
            hwaccel: false,
            className: 'spinner',
            zIndex: 2e9,
            top: '50%',
            left: '50%'
        };
        $scope.spinner = new Spinner($scope.optsForSpinner);

        $scope.pageSize = 100;

        $scope.defaultColumnDef = {
            width: 200,
            minWidth: 200,
            maxWidth: 400,
            sortable: true
        };

        $scope.dataSink = new ExplorerDataSink($scope.defaultColumnDef, $scope);
        GlobalDataService.setActiveSchema($scope.dataSink.schema);

        $scope.gridOptions = {
            data: $scope.dataSink.data,
            columnDefs: $scope.dataSink.columnDefs,
            exporterMenuPdf: false,
            enableGridMenu: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            multiSelect: false,
            enableColumnResizing: true,
            useExternalSorting: true,
            enableFiltering: true,
            useExternalFiltering: true,
            infiniteScrollRowsFromEnd: 40,
            infiniteScrollUp: true,
            infiniteScrollDown: true,
            saveScroll: false,
            saveFocus: false,
            savePinning: false,
            saveGrouping: false,
            saveGroupingExpandedStates: false,
            saveTreeView: false,
            saveSelection: false
        };

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.initGrid();
            $scope.resetGrid();
            $scope.loadData($scope.subscriptionPath, $scope.subscriptionFilter);

            gridApi.selection.on.rowSelectionChanged($scope, $scope.onRowSelect);
            gridApi.core.on.sortChanged($scope, $scope.sort);
            gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.page);
            gridApi.core.on.filterChanged($scope, function () {
                $scope.filter(this.grid);
            });

            //save the grid state when various things are changed
            gridApi.colMovable.on.columnPositionChanged($scope, $scope.saveGridState);
            gridApi.colResizable.on.columnSizeChanged($scope, $scope.saveGridState);
            gridApi.core.on.columnVisibilityChanged($scope, $scope.saveGridState);
            gridApi.core.on.filterChanged($scope, $scope.saveGridState);
            gridApi.core.on.sortChanged($scope, $scope.saveGridState);
        };

        $rootScope.$on('dataMixer.disconnect', function (event) {
            $scope.resetGrid();
        });

        $rootScope.$on('$destroy', function () {
            $scope.resetGrid();
        });

        $scope.initGrid = function () {
            $scope.contextMenuOptions = [
                ['Open in New Tab', function ($itemScope) {
                    var row = $itemScope.$parent.row;
                    var path = $scope.getDirectoryPathFromRow(row);

                    if (path) {
                        if ($routeParams.path) {
                            if (path.startsWith('/')) {
                                path = path.substr(1);
                            }
                            $route.updateParams({path: path});
                        } else {

                        }
                    }
                }]
            ];

            $scope.dataSink.getSnapshotPromise().then($scope.loadGridState);
        };

        $scope.resetGrid = function () {
            $scope.currentPageSize = $scope.pageSize;

            if ($scope.virtualTable) {
                $scope.virtualTable.unsubscribe();
            }

            $scope.virtualTable = null;
        };

        $scope.loadData = function (directory, filter) {
            $scope.resetGrid();

            $scope.currentDirectory = directory;

            Logger.debug("Loading : " + directory + " with filter " + filter);
            $scope.spinner.spin($scope.getSpinnerTarget());

            var operatorName = directory;
            var output = undefined;
            var dotIndex = directory.indexOf('.');
            if (dotIndex > -1) {
                operatorName = directory.substr(0, dotIndex);
                output = directory.substr(dotIndex + 1);
            }
            var promise = VirtualTableService.subscribe(
                operatorName,
                {
                    offset: 0,
                    limit: $scope.currentPageSize,
                    filterMode: filter ? 2 : 1,
                    filterExpression: filter
                },
                $scope.dataSink,
                output,
                $scope.subscriptionProjection
            );

            promise.then(
                function (virtualTable) {
                    $scope.virtualTable = virtualTable;
                    $rootScope.$broadcast('dataMixer.subscribe.success', directory, $scope.getGridType());

                },
                function (errorMessage) {
                    Logger.error(errorMessage);
                }
            )
        };

        $scope.getColumnDef = function (column) {
            return {
                field: column.name,
                cellFilter: $scope.getCellFilter(column),
                visible: (column.name !== 'rank'),
                dataType: column.type,
                cellClass: function (grid, row, col) {
                    return $scope.getDirectoryPathFromRow(row) ? 'clickable' : '';
                }
            };
        };

        $scope.saveGridState = function () {
            var state = $scope.gridApi.saveState.save();
            localStorageService.set($scope.subscriptionPath, state);
            return state;
        };

        $scope.loadGridState = function () {
            var state = localStorageService.get($scope.subscriptionPath);

            if (state !== undefined && state !== null) {
                $scope.gridApi.saveState.restore($scope, state);
            }
        };

        $scope.getGridType = function () {
            return $scope.gridType;
        };

        $scope.getSpinnerTarget = function () {
            return document.getElementById('mainGrid');
        };

        $scope.getCellFilter = function (column) {
            switch (column.dataType) {
                case 4:
                case 5:
                case 6:
                case 7:
                    return 'numberNullToZero';
                    break;
                case 10:
                    return 'nullToDash'
                    break;
                default:
                    return;
            }
        };

        $scope.onRowSelect = function (row) {
            if (row.isSelected) {
                var path = $scope.getDirectoryPathFromRow(row);

                if (path) {
                    $location.path('/connection' + path);
                }
            }
        };

        $scope.sort = function (grid, sortColumns) {
            var parsedSortColumns = [];

            if ($scope.virtualTable) {
                if (sortColumns.length === 0) {
                    parsedSortColumns.push({name: 'Rank', direction: 'asc'});
                } else {
                    for (var i = 0; i < sortColumns.length; i++) {
                        var sortColumn = sortColumns[i].name;
                        var sortDirection = sortColumns[i].sort.direction;
                        parsedSortColumns.push({name: sortColumn, direction: sortDirection});
                    }
                }

                if (sortColumns.length) {
                    $scope.virtualTable.sort(parsedSortColumns);
                }
            }
        };

        $scope.page = function () {
            if ($scope.dataSink.data.length >= $scope.currentPageSize) {
                $scope.currentPageSize += $scope.pageSize;
                Logger.debug('Paging report to ' + $scope.currentPageSize + " rows");

                $scope.virtualTable.page(0, $scope.currentPageSize).then(function () {
                    $scope.gridApi.infiniteScroll.dataLoaded();
                });
            } else {
                $scope.gridApi.infiniteScroll.dataLoaded(false, false);
            }
        };

        $scope.filter = function (grid) {
            var filterExpression = '';
            var filterCount = 0;
            var colCount = grid.columns.length;

            if ($scope.virtualTable) {
                grid.columns.forEach(function (col, i) {
                    if ($scope.filterNotEmpty(col)) {
                        var filterText = col.filters[0].term;
                        filterExpression += filterCount > 0 && col.index < colCount - 1 ? ' && ' : '';

                        switch (col.colDef.dataType) {
                            //Numeric type columns
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                                filterExpression += col.name + ' == ' + filterText;
                                break;
                            //String type columns
                            case 8:
                                filterExpression += col.name + ' like \"' + filterText + '\"';
                                break;
                            default:
                                filterExpression += col.name + ' == ' + filterText;
                        }

                        filterCount++;
                    }
                });


                Logger.debug("Filtering by: " + filterExpression);
                if (filterExpression === '') {
                    $scope.virtualTable.filter(1);
                } else {
                    $scope.virtualTable.filter(2, filterExpression);
                }
            }

        };

        $scope.filterNotEmpty = function (col) {
            return col.visible && col.filters.length > 0 && col.filters[0].term !== undefined && col.filters[0].term !== null && col.filters[0].term !== '';
        };

        $scope.getDirectoryPathFromRow = function (row) {
            var path = row.entity["path"];

            if (path) {
                var opType = row.entity["type"];

                switch (opType) {
                    //these operator types cannot be drilled in to
                    case 'com.db.bandwagon.mixer.core.change.ChangeRecorder':
                    case 'com.db.bandwagon.mixer.meta.MetadataRegistry$MetadataExposingOperator':
                    case 'com.db.mixer.operators.index.IndexOperator2':
                    case 'com.db.mixer.reporting.plugin.ReportingEngineUserStats':
                    case'':
                        return;
                        break;
                    default:
                }
                return path.toString();
            }
            return null;
        };
    };
});