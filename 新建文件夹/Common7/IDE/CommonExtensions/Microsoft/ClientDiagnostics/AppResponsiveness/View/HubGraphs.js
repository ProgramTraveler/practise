// 
// Copyright (C) Microsoft. All rights reserved.
//
var VisualProfiler;
(function (VisualProfiler) {
    var Graphs;
    (function (Graphs) {
        "use strict";
        /* A helper class to get graph data from the analyzer.
         */
        var DataUtilities = (function () {
            function DataUtilities() {
            }
            DataUtilities.getFilteredResult = function (dataWarehouse, analyzerId, counterId, timespan, customData) {
                var contextData = {
                    timeDomain: timespan,
                    customDomain: {
                        CounterId: counterId
                    }
                };
                if (customData) {
                    for (var key in customData) {
                        if (customData.hasOwnProperty(key)) {
                            contextData.customDomain[key] = customData[key];
                        }
                    }
                }
                return dataWarehouse.getFilteredData(contextData, analyzerId);
            };
            return DataUtilities;
        }());
        Graphs.DataUtilities = DataUtilities;
    })(Graphs = VisualProfiler.Graphs || (VisualProfiler.Graphs = {}));
})(VisualProfiler || (VisualProfiler = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VisualProfiler;
(function (VisualProfiler) {
    var Graphs;
    (function (Graphs) {
        "use strict";
        /* A helper class to get the resource string either from the hub resource dictionary or from Microsoft.Plugin.
         */
        var GraphResources = (function () {
            function GraphResources(resources) {
                this._graphResources = resources;
            }
            GraphResources.prototype.getString = function (resourceId) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                // First try to get the resource from the dictionary
                if (this._graphResources) {
                    var resourceString = this._graphResources[resourceId];
                    if (resourceString !== undefined) {
                        resourceString = GraphResources.format(resourceId, resourceString, args);
                        return resourceString;
                    }
                }
                // Fallback to the Microsoft.Plugin resources
                try {
                    return Microsoft.Plugin.Resources.getString.apply(Microsoft.Plugin.Resources, arguments);
                }
                catch (e) { }
                return resourceId;
            };
            GraphResources.format = function (resourceId, format, args) {
                return format.replace(GraphResources.FORMAT_REG_EXP, function (match, index) {
                    var replacer;
                    switch (match) {
                        case "{{":
                            replacer = "{";
                            break;
                        case "}}":
                            replacer = "}";
                            break;
                        case "{":
                        case "}":
                            throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPlugin.3002"));
                        default:
                            var argsIndex = parseInt(index);
                            if (args && argsIndex < args.length) {
                                replacer = args[argsIndex];
                            }
                            else {
                                throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPlugin.3003") + " (resourceId = " + resourceId + ")");
                            }
                            break;
                    }
                    if (replacer === undefined || replacer === null) {
                        replacer = "";
                    }
                    if (typeof replacer !== "string") {
                        replacer = replacer.toString();
                    }
                    return replacer;
                });
            };
            GraphResources.FORMAT_REG_EXP = /\{{2}|\{(\d+)\}|\}{2}|\{|\}/g;
            return GraphResources;
        }());
        Graphs.GraphResources = GraphResources;
    })(Graphs = VisualProfiler.Graphs || (VisualProfiler.Graphs = {}));
})(VisualProfiler || (VisualProfiler = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VisualProfiler;
(function (VisualProfiler) {
    var Graphs;
    (function (Graphs) {
        "use strict";
        var DiagnosticsHub = Microsoft.VisualStudio.DiagnosticsHub;
        var DataSeriesInfo = (function () {
            function DataSeriesInfo(name, cssClass, sortOrder) {
                if (!name || sortOrder === undefined || sortOrder === null) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1044"));
                }
                this._name = name;
                this._cssClass = cssClass;
                this._sortOrder = sortOrder;
            }
            Object.defineProperty(DataSeriesInfo.prototype, "cssClass", {
                get: function () {
                    return this._cssClass;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataSeriesInfo.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataSeriesInfo.prototype, "sortOrder", {
                get: function () {
                    return this._sortOrder;
                },
                enumerable: true,
                configurable: true
            });
            return DataSeriesInfo;
        }());
        Graphs.DataSeriesInfo = DataSeriesInfo;
        var StackedBarChartPresenter = (function () {
            function StackedBarChartPresenter(options) {
                this._data = [];
                this._dataSeriesInfo = {};
                this._maximumYValue = Number.NEGATIVE_INFINITY;
                this.viewModel = [];
                this._options = options;
                this.validateOptions();
                this._pixelHorizontalValue = this.xWidth / this._options.width;
            }
            Object.defineProperty(StackedBarChartPresenter.prototype, "maximumYValue", {
                get: function () {
                    return this._maximumYValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StackedBarChartPresenter.prototype, "xWidth", {
                get: function () {
                    return this._options.maxX - this._options.minX;
                },
                enumerable: true,
                configurable: true
            });
            StackedBarChartPresenter.prototype.addData = function (chartData) {
                var _this = this;
                chartData.forEach(function (dataItem) {
                    if (_this._dataSeriesInfo.hasOwnProperty(dataItem.series)) {
                        _this._data.push(dataItem);
                    }
                    else {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1043"));
                    }
                });
                this.generateViewModel();
            };
            StackedBarChartPresenter.prototype.addSeries = function (seriesInfo) {
                for (var i = 0; i < seriesInfo.length; i++) {
                    var info = seriesInfo[i];
                    if (this._dataSeriesInfo.hasOwnProperty(info.name)) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1045"));
                    }
                    this._dataSeriesInfo[info.name] = info;
                }
            };
            StackedBarChartPresenter.prototype.getViewOptions = function () {
                var viewOptions = {
                    ariaDescription: this._options.ariaDescription,
                    ariaLabelCallback: this._options.ariaLabelCallback,
                    height: this._options.height,
                    width: this._options.width,
                    tooltipCallback: this._options.tooltipCallback,
                    legendData: this._dataSeriesInfo
                };
                return viewOptions;
            };
            StackedBarChartPresenter.prototype.convertChartAreaPercentToDataValue = function (percent) {
                return Math.round(percent * this.xWidth / 100) + this._options.minX;
            };
            StackedBarChartPresenter.prototype.determineYAxisScale = function (allBars) {
                for (var i = 0; i < allBars.length; i++) {
                    var totalStackHeight = 0;
                    var currentBar = allBars[i];
                    for (var j = 0; j < currentBar.length; j++) {
                        var stackComponent = currentBar[j];
                        if (stackComponent.height > 0) {
                            totalStackHeight += stackComponent.height;
                        }
                    }
                    this._maximumYValue = Math.max(this._maximumYValue, totalStackHeight);
                }
                this._maximumYValue = Math.max(this._options.minYHeight, this._maximumYValue);
                // Round the max value to the next 100, taking into account real precision (to avoid scaling up by 100 to cater
                // for the 100.0000000001 case)
                this._maximumYValue = Math.ceil(Math.floor(this._maximumYValue) / 100) * 100;
                var availableAxisHight = this._options.height - StackedBarChartPresenter.YAXIS_PIXEL_PADDING;
                if (availableAxisHight <= 0) {
                    availableAxisHight = this._options.height;
                }
                this._pixelVerticalValue = this._maximumYValue / availableAxisHight;
                this._maximumYValue = this._options.height * this._pixelVerticalValue;
            };
            StackedBarChartPresenter.prototype.generateViewModel = function () {
                var allBars = [[]];
                var singleBar = [];
                var barWidthAndMargin = this._options.barWidth + this._options.barGap;
                var currentXValue = this._options.minX;
                var prevValue = Number.NEGATIVE_INFINITY;
                var x = 0;
                var i = 0;
                while (i < this._data.length) {
                    var dataItem = this._data[i];
                    if (dataItem.x < prevValue) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1046"));
                    }
                    if (dataItem.x > this._options.maxX) {
                        break;
                    }
                    prevValue = dataItem.x;
                    var currentXValue = Math.floor(x * this._pixelHorizontalValue + this._options.minX);
                    var currentBarMinValue = currentXValue;
                    var currentBarMaxValue = currentXValue + Math.floor((this._options.barWidth + this._options.barGap) * this._pixelHorizontalValue);
                    if (dataItem.x < currentBarMinValue) {
                        i++;
                        continue;
                    }
                    if (dataItem.x < currentBarMaxValue) {
                        dataItem.x = x;
                        singleBar.push(dataItem);
                        i++;
                    }
                    else {
                        allBars.push(singleBar);
                        singleBar = [];
                        x += barWidthAndMargin;
                    }
                }
                allBars.push(singleBar);
                this.determineYAxisScale(allBars);
                for (var i = 0; i < allBars.length; i++) {
                    this.generateViewModelForSingleStack(allBars[i]);
                }
            };
            StackedBarChartPresenter.prototype.generateViewModelForSingleStack = function (dataItems) {
                if (!dataItems || dataItems.length === 0) {
                    return;
                }
                dataItems.sort(this.sortBySeries.bind(this));
                var accumulatedHeight = 0;
                var maxHeightExceeded = false;
                var singleBarViewModel = [];
                for (var i = dataItems.length - 1; i >= 0; i--) {
                    var dataItem = dataItems[i];
                    if (dataItem.height <= 0) {
                        continue;
                    }
                    // We want to display the small amounts as 1-pixel bars, but need to round the rest
                    // to reduce the liklihood of exceeding 100% for the stack on the graph.
                    var barHeight = Math.round(dataItem.height / this._pixelVerticalValue);
                    if (dataItem.height > 0 && barHeight < 1) {
                        barHeight = 1;
                    }
                    var startY = this._options.height - (barHeight + accumulatedHeight) - 1;
                    if (startY < 0) {
                        barHeight = this._options.height - accumulatedHeight;
                        startY = 0;
                        maxHeightExceeded = true;
                    }
                    accumulatedHeight += barHeight;
                    if (this._options.showStackGap && barHeight > 1) {
                        barHeight -= 1;
                        startY += 1;
                    }
                    var rectangle = {
                        x: dataItem.x,
                        y: startY,
                        height: barHeight,
                        width: this._options.barWidth,
                        className: this._dataSeriesInfo[dataItem.series].cssClass,
                        chartItem: dataItem
                    };
                    this.viewModel.push(rectangle);
                    if (maxHeightExceeded) {
                        break;
                    }
                }
            };
            StackedBarChartPresenter.prototype.sortBySeries = function (chartItem1, chartItem2) {
                return this._dataSeriesInfo[chartItem2.series].sortOrder - this._dataSeriesInfo[chartItem1.series].sortOrder;
            };
            StackedBarChartPresenter.prototype.validateOptions = function () {
                if (!this._options) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1047"));
                }
                if ((this._options.minX === undefined || this._options.minX === null) ||
                    (this._options.maxX === undefined || this._options.maxX === null) ||
                    (this._options.minY === undefined || this._options.minY === null) ||
                    (this._options.minX > this._options.maxX) ||
                    (!this._options.height || !this._options.width || this._options.height < 0 || this._options.width < 0) ||
                    (!this._options.barWidth || this._options.barWidth < 0)) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1048"));
                }
                this._options.barGap = this._options.barGap || 0;
                this._options.showStackGap = this._options.showStackGap || false;
                this._options.minYHeight = this._options.minYHeight || this._options.minY;
            };
            StackedBarChartPresenter.YAXIS_PIXEL_PADDING = 10;
            return StackedBarChartPresenter;
        }());
        Graphs.StackedBarChartPresenter = StackedBarChartPresenter;
        var StackedBarChartView = (function () {
            function StackedBarChartView() {
                this._idCount = 0;
                this._selectedId = -1;
                this.rootElement = document.createElement("div");
                this.rootElement.style.width = this.rootElement.style.height = "100%";
            }
            Object.defineProperty(StackedBarChartView.prototype, "presenter", {
                set: function (value) {
                    this._presenter = value;
                    this._viewData = this._presenter.viewModel;
                    this._options = value.getViewOptions();
                    this._barGraphWidth = this._options.width;
                    this.drawChart();
                },
                enumerable: true,
                configurable: true
            });
            StackedBarChartView.prototype.convertPageXToChartAreaPercent = function (pageX) {
                var rect = this._chartAreaContainer.getBoundingClientRect();
                return (pageX - rect.left) / this._barGraphWidth * 100;
            };
            StackedBarChartView.prototype.createContainer = function () {
                if (!this._chartAreaContainer) {
                    this._chartAreaContainer = document.createElement("div");
                    this.rootElement.appendChild(this._chartAreaContainer);
                }
                else {
                    this._chartAreaContainer.innerHTML = "";
                }
                this._chartAreaContainer.style.width = this._options.width + "px";
                this._chartAreaContainer.style.height = this._options.height + "px";
                this._chartAreaContainer.classList.add("stackedBarChart");
                this._chartAreaContainer.style.display = "-ms-grid";
            };
            StackedBarChartView.prototype.createRect = function (x, y, height, width, className) {
                var rect = document.createElement("div");
                rect.id = StackedBarChartView._barIdPrefix + this._idCount;
                rect.tabIndex = -1;
                this._idCount++;
                rect.classList.add("bar");
                rect.classList.add(className);
                rect.style.left = x + "px";
                rect.style.bottom = (this._options.height - y - height) + "px";
                rect.style.height = height + "px";
                rect.style.width = width + "px";
                return rect;
            };
            StackedBarChartView.prototype.drawChart = function () {
                if (!this._viewData) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1049"));
                }
                this.createContainer();
                this.initializeBarGraph();
                this.renderViewData(this._barGraph, this._viewData);
                this._chartAreaContainer.appendChild(this._barGraph);
            };
            StackedBarChartView.prototype.initializeBarGraph = function () {
                var _this = this;
                this._selectedId = -1;
                this._idCount = 0;
                this._barGraph = document.createElement("div");
                this._barGraph.classList.add("barGraph");
                this._barGraph.tabIndex = 0;
                this._barGraph.style.height = this._options.height + "px";
                this._barGraph.style.width = this._barGraphWidth + "px";
                this._barGraph.addEventListener("keydown", this.onBarGraphKeydown.bind(this));
                this._barGraph.addEventListener("focus", function () { _this._selectedId = -1; });
                if (this._options.ariaDescription) {
                    this._barGraph.setAttribute("aria-label", this._options.ariaDescription);
                }
            };
            StackedBarChartView.prototype.onBarBlur = function (event) {
                var bar = event.currentTarget;
                bar.classList.remove("focused");
                Microsoft.Plugin.Tooltip.dismiss();
            };
            StackedBarChartView.prototype.onBarFocus = function (chartItem, event) {
                var bar = event.currentTarget;
                bar.classList.add("focused");
                if (this._options.ariaLabelCallback) {
                    var ariaLabel = this._options.ariaLabelCallback(chartItem);
                    bar.setAttribute("aria-label", ariaLabel);
                }
            };
            StackedBarChartView.prototype.onBarGraphKeydown = function (event) {
                if (event.keyCode === DiagnosticsHub.Common.KeyCodes.ArrowLeft || event.keyCode === DiagnosticsHub.Common.KeyCodes.ArrowRight) {
                    if (event.keyCode === DiagnosticsHub.Common.KeyCodes.ArrowLeft) {
                        if ((this._selectedId === 0) || (this._selectedId === -1)) {
                            this._selectedId = this._idCount;
                        }
                        this._selectedId--;
                    }
                    else if (event.keyCode === DiagnosticsHub.Common.KeyCodes.ArrowRight) {
                        this._selectedId++;
                        if (this._selectedId === this._idCount) {
                            this._selectedId = 0;
                        }
                    }
                    var bar = document.getElementById(StackedBarChartView._barIdPrefix + this._selectedId);
                    bar.focus();
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                return true;
            };
            StackedBarChartView.prototype.onBarKeydown = function (objectForTooltip, event) {
                if (event.keyCode === DiagnosticsHub.Common.KeyCodes.Enter) {
                    var element = event.currentTarget;
                    var offsetX = window.screenLeft + element.offsetLeft + element.clientWidth;
                    var offsetY = window.screenTop + element.offsetTop;
                    element = element.offsetParent;
                    while (element) {
                        offsetX += element.offsetLeft;
                        offsetY += element.offsetTop;
                        element = element.offsetParent;
                    }
                    this.showTooltip(objectForTooltip, offsetX, offsetY);
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                return true;
            };
            StackedBarChartView.prototype.renderViewData = function (container, viewData) {
                for (var i = 0; i < viewData.length; i++) {
                    var barInfo = viewData[i];
                    var rectangle = this.createRect(barInfo.x, barInfo.y, barInfo.height, barInfo.width, barInfo.className);
                    rectangle.addEventListener("mouseover", this.showTooltip.bind(this, barInfo.chartItem));
                    rectangle.addEventListener("mouseout", function () { return Microsoft.Plugin.Tooltip.dismiss(); });
                    rectangle.addEventListener("keydown", this.onBarKeydown.bind(this, barInfo.chartItem));
                    rectangle.addEventListener("focus", this.onBarFocus.bind(this, barInfo.chartItem));
                    rectangle.addEventListener("blur", this.onBarBlur.bind(this));
                    container.appendChild(rectangle);
                }
            };
            StackedBarChartView.prototype.showTooltip = function (chartItem, x, y) {
                if (this._options.tooltipCallback) {
                    var toolTipContent = this._options.tooltipCallback(chartItem);
                    var config = { content: toolTipContent, delay: 0, x: x, y: y, contentContainsHTML: true };
                    Microsoft.Plugin.Tooltip.show(config);
                }
            };
            StackedBarChartView._barIdPrefix = "bar";
            return StackedBarChartView;
        }());
        Graphs.StackedBarChartView = StackedBarChartView;
    })(Graphs = VisualProfiler.Graphs || (VisualProfiler.Graphs = {}));
})(VisualProfiler || (VisualProfiler = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="StackedBarChart.ts" />
/// <reference path="DataTypes.d.ts" />
/// <reference path="DataUtilities.ts" />
/// <reference path="GraphResources.ts" />
var VisualProfiler;
(function (VisualProfiler) {
    var Graphs;
    (function (Graphs) {
        "use strict";
        var DiagnosticsHub = Microsoft.VisualStudio.DiagnosticsHub;
        var Category = (function () {
            function Category() {
            }
            Category.parsingCategory = "Parsing_Category";
            Category.layoutCategory = "Layout_Category";
            Category.appCodeCategory = "AppCode_Category";
            Category.xamlOtherCategory = "XamlOther_Category";
            Category.renderCategory = "Render_Category";
            Category.ioCategory = "IO_Category";
            return Category;
        }());
        Graphs.Category = Category;
        var StackedBarGraph = (function () {
            function StackedBarGraph(config) {
                this._scaleChangedEvent = new DiagnosticsHub.AggregatedEvent();
                this._config = config;
                this._graphResources = new Graphs.GraphResources(this._config.resources);
                this._timeRange = this._config.timeRange || new DiagnosticsHub.JsonTimespan(new DiagnosticsHub.BigNumber(0, 0), new DiagnosticsHub.BigNumber(0, 0));
                this._container = document.createElement("div");
                StackedBarGraph.validateConfiguration(this._config);
                this._dataSource = this._config.jsonConfig.Series[0].DataSource;
                if (config.pathToScriptFolder && config.loadCss) {
                    config.loadCss(config.pathToScriptFolder + "/CSS/hubGraphs/StackedBarChart.css");
                    config.loadCss(config.pathToScriptFolder + "/DataCategoryStyles.css");
                }
                // Setup scale
                this._config.scale = this._config.scale || {};
                this._config.scale.minimum = 0;
                this._config.scale.maximum = 120;
                this._config.scale.axes = [];
                this._config.scale.axes.push({
                    value: 100
                });
                // add series and legend to config
                this._config.legend = this._config.legend || [];
                var seriesCollection = this._config.jsonConfig.Series;
                for (var i = 0; i < seriesCollection.length; i++) {
                    var series = seriesCollection[i];
                    this._config.legend.push({
                        color: series.Color,
                        legendText: this._graphResources.getString(series.Legend),
                        legendTooltip: (series.LegendTooltip ? this._graphResources.getString(series.LegendTooltip) : null)
                    });
                }
            }
            Object.defineProperty(StackedBarGraph.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StackedBarGraph.prototype, "scaleChangedEvent", {
                get: function () {
                    return this._scaleChangedEvent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StackedBarGraph.prototype, "containerOffsetWidth", {
                get: function () {
                    if (this._containerOffsetWidth === undefined) {
                        this._containerOffsetWidth = this._container.offsetWidth;
                    }
                    return this._containerOffsetWidth;
                },
                enumerable: true,
                configurable: true
            });
            StackedBarGraph.prototype.onDataUpdate = function (timestampNs) {
                // Not implemented
            };
            StackedBarGraph.prototype.addSeriesData = function (counterId, points, fullRender, dropOldData) {
                // Not implemented
            };
            StackedBarGraph.prototype.getDataPresenter = function () {
                var presenterOptions = {
                    ariaDescription: this._graphResources.getString("UiThreadActivityAriaLabel"),
                    height: this._config.height,
                    width: this.containerOffsetWidth,
                    minX: parseInt(this._timeRange.begin.value),
                    maxX: parseInt(this._timeRange.end.value),
                    minY: 0,
                    minYHeight: 100,
                    barWidth: this._config.jsonConfig.BarWidth,
                    barGap: this._config.jsonConfig.BarGap,
                    showStackGap: this._config.jsonConfig.ShowStackGap,
                    tooltipCallback: this.createTooltip.bind(this),
                    ariaLabelCallback: this.createAriaLabel.bind(this)
                };
                var presenter = new Graphs.StackedBarChartPresenter(presenterOptions);
                //
                // Add series information to the presenter
                //
                var dataSeriesInfo = [];
                var stackedDataSeries = this._config.jsonConfig.Series;
                for (var i = 0; i < stackedDataSeries.length; i++) {
                    var seriesItem = stackedDataSeries[i];
                    dataSeriesInfo.push({
                        cssClass: seriesItem.CssClass,
                        name: seriesItem.Category,
                        sortOrder: i + 1
                    });
                }
                presenter.addSeries(dataSeriesInfo);
                return presenter;
            };
            StackedBarGraph.prototype.getGranularity = function () {
                var bucketWidth = this._config.jsonConfig.BarGap + this._config.jsonConfig.BarWidth;
                var graphDuration = parseInt(this._timeRange.elapsed.value);
                if (graphDuration <= 0 || this.containerOffsetWidth <= 0) {
                    return 0;
                }
                return Math.floor(bucketWidth / this.containerOffsetWidth * graphDuration);
            };
            StackedBarGraph.prototype.removeInvalidPoints = function (base) {
                // Not implemented
            };
            StackedBarGraph.prototype.render = function (fullRender) {
                if (this._config.jsonConfig.GraphBehaviour == DiagnosticsHub.GraphBehaviourType.PostMortem) {
                    this.setData(this._timeRange);
                }
            };
            StackedBarGraph.prototype.resize = function (evt) {
                this._containerOffsetWidth = undefined;
                this.render();
            };
            StackedBarGraph.prototype.onViewportChanged = function (viewportArgs) {
                if (this._timeRange.equals(viewportArgs.currentTimespan)) {
                    // Only selection changed, ignore this event
                    return;
                }
                this._timeRange = viewportArgs.currentTimespan;
                this.render();
            };
            StackedBarGraph.validateConfiguration = function (config) {
                if (!config) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1070"));
                }
                var jsonObject = config.jsonConfig;
                if (!jsonObject) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1071"));
                }
                if (!jsonObject.Series || jsonObject.Series.length === 0) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1072"));
                }
                jsonObject.BarWidth = jsonObject.BarWidth || 4;
                jsonObject.BarGap = jsonObject.BarGap || 0;
                jsonObject.ShowStackGap = jsonObject.ShowStackGap || false;
                if ((!config.height || config.height < 0) ||
                    jsonObject.BarWidth < 0) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1048"));
                }
            };
            StackedBarGraph.prototype.createTooltip = function (cpuUsage) {
                var tooltip = this._graphResources.getString(cpuUsage.series) + ": " + (Math.round(cpuUsage.height * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) + "%";
                return tooltip;
            };
            StackedBarGraph.prototype.createAriaLabel = function (cpuUsage) {
                var percentageUtilization = (Math.round(cpuUsage.height * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
                var formattedTime = DiagnosticsHub.RulerUtilities.formatTime(DiagnosticsHub.BigNumber.convertFromNumber(cpuUsage.x), DiagnosticsHub.UnitFormat.fullName);
                return this._graphResources.getString("UiThreadActivityBarAriaLabel", this._graphResources.getString(cpuUsage.series), percentageUtilization, formattedTime);
            };
            StackedBarGraph.jsonTimeToNanoseconds = function (bigNumber) {
                var l = bigNumber.l;
                var h = bigNumber.h;
                if (l < 0) {
                    l = l >>> 0;
                }
                if (h < 0) {
                    h = h >>> 0;
                }
                var nsec = h * 0x100000000 + l;
                return nsec;
            };
            StackedBarGraph.prototype.setData = function (timeRange) {
                var _this = this;
                if (this._settingDataPromise) {
                    this._settingDataPromise.cancel();
                    this._settingDataPromise = null;
                }
                if (!this._dataSource || !this._dataSource.CounterId || !this._dataSource.AnalyzerId) {
                    // No data to set if there is no data source
                    return;
                }
                this._settingDataPromise = this.getDataWarehouse().then(function (dataWarehouse) {
                    var granuality = _this.getGranularity();
                    if (granuality > 0) {
                        return Graphs.DataUtilities.getFilteredResult(dataWarehouse, _this._dataSource.AnalyzerId, _this._dataSource.CounterId, timeRange, {
                            granularity: granuality.toString(),
                            task: "1" // AnalysisTaskType::GetUIThreadActivityData in XamlProfiler\DataModel\XamlAnalyzer.h
                        });
                    }
                    else {
                        return Microsoft.Plugin.Promise.wrap([]);
                    }
                }).then(function (cpuUsageResult) {
                    if (_this._chart) {
                        _this._container.removeChild(_this._chart.rootElement);
                        _this._chart = null;
                    }
                    if (cpuUsageResult) {
                        var chartItems = [];
                        for (var i = 0; i < cpuUsageResult.length; i++) {
                            var cpuUsagePoint = cpuUsageResult[i];
                            var parsingTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.ParsingTime);
                            var layoutTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.LayoutTime);
                            var appCodeTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.AppCodeTime);
                            var xamlOtherTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.XamlOther);
                            var unknownTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.Unknown);
                            var renderTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.RenderTime);
                            var ioTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.IOTime);
                            var startTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.StartTime);
                            var endTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.EndTime);
                            var totalTime = endTime - startTime;
                            if (parsingTime > 0) {
                                chartItems.push({
                                    series: Category.parsingCategory,
                                    x: startTime,
                                    height: parsingTime * 100.0 / totalTime
                                });
                            }
                            if (layoutTime > 0) {
                                chartItems.push({
                                    series: Category.layoutCategory,
                                    x: startTime,
                                    height: layoutTime * 100.0 / totalTime
                                });
                            }
                            if (appCodeTime > 0) {
                                chartItems.push({
                                    series: Category.appCodeCategory,
                                    x: startTime,
                                    height: appCodeTime * 100.0 / totalTime
                                });
                            }
                            if (xamlOtherTime > 0) {
                                chartItems.push({
                                    series: Category.xamlOtherCategory,
                                    x: startTime,
                                    height: xamlOtherTime * 100.0 / totalTime
                                });
                            }
                            if (renderTime > 0) {
                                chartItems.push({
                                    series: Category.renderCategory,
                                    x: startTime,
                                    height: renderTime * 100.0 / totalTime
                                });
                            }
                            if (ioTime > 0) {
                                chartItems.push({
                                    series: Category.ioCategory,
                                    x: startTime,
                                    height: ioTime * 100.0 / totalTime
                                });
                            }
                        }
                        var dataPresenter = _this.getDataPresenter();
                        dataPresenter.addData(chartItems);
                        _this._chart = new Graphs.StackedBarChartView();
                        _this._chart.presenter = dataPresenter;
                        // Update the y-axis scale maximum
                        _this._scaleChangedEvent.invokeEvent({
                            minimum: 0,
                            maximum: dataPresenter.maximumYValue
                        });
                        _this._container.appendChild(_this._chart.rootElement);
                    }
                }).then(function () {
                    _this._settingDataPromise = null;
                });
            };
            StackedBarGraph.prototype.getDataWarehouse = function () {
                var _this = this;
                if (this._dataWarehouse) {
                    return Microsoft.Plugin.Promise.as(this._dataWarehouse);
                }
                else {
                    return DiagnosticsHub.DataWarehouse.loadDataWarehouse().then(function (dataWarehouse) {
                        _this._dataWarehouse = dataWarehouse;
                        return _this._dataWarehouse;
                    });
                }
            };
            return StackedBarGraph;
        }());
        Graphs.StackedBarGraph = StackedBarGraph;
    })(Graphs = VisualProfiler.Graphs || (VisualProfiler.Graphs = {}));
})(VisualProfiler || (VisualProfiler = {}));
//# sourceMappingURL=HubGraphs.js.map
// SIG // Begin signature block
// SIG // MIIkVgYJKoZIhvcNAQcCoIIkRzCCJEMCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // +jQXEhF1HTLo+zqMMxENphocsSId2BahP/l0GUn0Af6g
// SIG // gg2BMIIF/zCCA+egAwIBAgITMwAAAQNeJRyZH6MeuAAA
// SIG // AAABAzANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTE4MDcxMjIwMDg0OFoX
// SIG // DTE5MDcyNjIwMDg0OFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // 0ZR2NuaGqzb+aflGfIuIUMuQcH+wVakkHX455wWfD6x7
// SIG // l7LOcwr71JskXBa1Od0bfjNsEfw7JvOYql1Ta6rD7BO4
// SIG // 0u/PV3/MZcuvTS4ysVYrTjQHif5pIb0+RPveEp2Fv3x2
// SIG // hn1ysXabYeaKZExGzrbVOox3k3dnIZy2WgZeR4b1PNEJ
// SIG // yg09zbLpoVB40YSI4gE8IvyvlgjMXZnA7eulWpiS9chA
// SIG // Tmpzr97jdHrTX0aXvOJnKHeZrMEOMRaPAA8B/kteVA/K
// SIG // xGU/CuOjRtv2LAM6Gb5oBRac5n80v6eHjWU5Jslj1O/F
// SIG // 3b0l/v0o9DSGeawq1V8wkTvkFGrrscoEIwIDAQABo4IB
// SIG // fjCCAXowHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFEe+wMvhpj/9ZdY48gNdt693
// SIG // 90D/MFAGA1UdEQRJMEekRTBDMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEWMBQG
// SIG // A1UEBRMNMjMwMDEyKzQzNzk2NTAfBgNVHSMEGDAWgBRI
// SIG // bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmg
// SIG // R6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcw
// SIG // AoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
// SIG // cy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEL
// SIG // BQADggIBAJ/1yVMNPw0m7KJE2A3Rn2OWBks/HlzFM6Ok
// SIG // w2yvH8ABuutl7J4zEA+nrFvUvZBhF+cx58MmtKz1J9NI
// SIG // k4aI/hI1kWQi0WstO6gsFZQp0jeW5jX/DM7IBhYWniSx
// SIG // 4jn5bg542AwbtilgJ3Y0JJvduZd1ywE7rYISFiKAiRWE
// SIG // u5hQILAXJoZJr859RRVDNJbPgVwYLNST8mer4nPIPaPN
// SIG // /DIeYBzpsBsw+yy7By6WhJNFKFRczZb9oNuB2LYwykOx
// SIG // 80jAskYcXV52Klif1O7y9PpITLVhi7CMQemquJ2Q9P9q
// SIG // Qg+5PukO7JT8jYC7eOMjp3hbsm0f+VnBfbbROcl54IMc
// SIG // YAraPbDR7Ta/RQfpGzZu5T07BQOn1KclEo/mdqMTs0Va
// SIG // QzGC2tiErrmwH3X19h19URE3J+i1NYRx91eqrvqJccmY
// SIG // 0p5aZHa+jMN9FWqR8RT08tk1Mbjbcvq0dciIm2q/mEXH
// SIG // ZrLX/86SkHXk6+aG0sgb2yfAW5VvSW9YXWkq3lNL+OjK
// SIG // e/ZsFfkDGQ8RhapPmr+qV91gxvVxIPRRqJrK6dHrNEc9
// SIG // dfoi7FU/ahk5axDpWj+O9CN4MLLypjjLNY2qmFkkQLg6
// SIG // Z6QHX6D+2DtJE/sM4e0LbYNQzvB/PuDZCOiMIUpBwt7r
// SIG // jlvuA8Mdbm7mVDVmZ3J8GupS9iLEcj+uMIIHejCCBWKg
// SIG // AwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
// SIG // OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
// SIG // Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDEx
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4Bjga
// SIG // BEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSH
// SIG // fpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpg
// SIG // GgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpc
// SIG // oRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnn
// SIG // Db6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD
// SIG // 2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLT
// SIG // swM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOE
// SIG // y/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2
// SIG // z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8k
// SIG // A/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
// SIG // 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uD
// SIG // jexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyim
// SIG // p31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
// SIG // hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX
// SIG // 3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXT
// SIG // gqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx
// SIG // 0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4G
// SIG // CCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNV
// SIG // HSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
// SIG // BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUF
// SIG // BwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
// SIG // AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
// SIG // mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np
// SIG // 22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r
// SIG // 4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQdION
// SIG // 9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWlu
// SIG // WpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiX
// SIG // mE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ
// SIG // 2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNA
// SIG // BQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPD
// SIG // XVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yH
// SIG // PgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ah
// SIG // XJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
// SIG // oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5
// SIG // GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E9
// SIG // 0Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFi0w
// SIG // ghYpAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAEDXiUcmR+jHrgAAAAAAQMwDQYJYIZI
// SIG // AWUDBAIBBQCgga4wGQYJKoZIhvcNAQkDMQwGCisGAQQB
// SIG // gjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcC
// SIG // ARUwLwYJKoZIhvcNAQkEMSIEIGrQEKR9DTODb0kJ8F8h
// SIG // MPPx8uzbA7wnrKXdCUDGFEn4MEIGCisGAQQBgjcCAQwx
// SIG // NDAyoBSAEgBNAGkAYwByAG8AcwBvAGYAdKEagBhodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEB
// SIG // BQAEggEAYXhvZn3Ur/nhPqGgIUVajGbE1uvI4XXRNbmf
// SIG // ShPv2EgSULFODr+fKROpwlkcqZLP9jsHTPLcKEKoi8e+
// SIG // pQ/0SqUm/XRHL5DEKpXcZTB4KK1hYPEeZ1zMkITSLP9C
// SIG // TvfOyIAH7SKWyH1XfNz4YEDi5mwk8hxE6EqcMHVO+2HO
// SIG // HnYx0N+t1olOpKsa2E+c6FXfIEMuNC/GdGGY/A5CoC7X
// SIG // 6siwB8XO5BBc5vbH4hwYgvDctL2tIS3aGYR+c6BcsQ0A
// SIG // 0CMASPVsYFU/x5C28YtkZQZbH3NZcYvT3OOhomjyPyZm
// SIG // yGuhDOIYhDVqll38gIkndOuScGyZahYPm4tjh+G5l6GC
// SIG // E7cwghOzBgorBgEEAYI3AwMBMYITozCCE58GCSqGSIb3
// SIG // DQEHAqCCE5AwghOMAgEDMQ8wDQYJYIZIAWUDBAIBBQAw
// SIG // ggFYBgsqhkiG9w0BCRABBKCCAUcEggFDMIIBPwIBAQYK
// SIG // KwYBBAGEWQoDATAxMA0GCWCGSAFlAwQCAQUABCCy0S/X
// SIG // MKNfu14eyxp0JLF6Pw7NFAaSIIw2h+sKqcDYWwIGW4hY
// SIG // 5mlkGBMyMDE4MDkwODAzMjc0MS4zODJaMAcCAQGAAgH0
// SIG // oIHUpIHRMIHOMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYD
// SIG // VQQLEyBNaWNyb3NvZnQgT3BlcmF0aW9ucyBQdWVydG8g
// SIG // UmljbzEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046QjhF
// SIG // Qy0zMEE0LTcxNDQxJTAjBgNVBAMTHE1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFNlcnZpY2Wggg8fMIIGcTCCBFmgAwIB
// SIG // AgIKYQmBKgAAAAAAAjANBgkqhkiG9w0BAQsFADCBiDEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWljcm9z
// SIG // b2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIw
// SIG // MTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1
// SIG // WjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1N
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKkdDbx3
// SIG // EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPl
// SIG // YcJ2tz5mK1vwFVMnBDEfQRsalR3OCROOfGEwWbEwRA/x
// SIG // YIiEVEMM1024OAizQt2TrNZzMFcmgqNFDdDq9UeBzb8k
// SIG // YDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFhE24o
// SIG // xhr5hoC732H8RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3w
// SIG // V3WsvYpCTUBR0Q+cBj5nf/VmwAOWRH7v0Ev9buWayrGo
// SIG // 8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn9NxkvaQB
// SIG // wSAJk3jN/LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHi
// SIG // MBAGCSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBTVYzpc
// SIG // ijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3FAIEDB4K
// SIG // AFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/
// SIG // BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbLj+iiXGJo0T2U
// SIG // kFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcmwwWgYI
// SIG // KwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8v
// SIG // d3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jv
// SIG // b0NlckF1dF8yMDEwLTA2LTIzLmNydDCBoAYDVR0gAQH/
// SIG // BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEwPQYIKwYBBQUH
// SIG // AgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9QS0kv
// SIG // ZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIw
// SIG // NB4yIB0ATABlAGcAYQBsAF8AUABvAGwAaQBjAHkAXwBT
// SIG // AHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQEL
// SIG // BQADggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+
// SIG // zwXiqf76V20ZMLPCxWbJat/15/B4vceoniXj+bzta1RX
// SIG // CCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5Xhc1mCRW
// SIG // S3TvQhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl
// SIG // 2am1a+THzvbKegBvSzBEJCI8z+0DpZaPWSm8tv0E4XCf
// SIG // Mkon/VWvL/625Y4zu2JfmttXQOnxzplmkIz/amJ/3cVK
// SIG // C5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd
// SIG // /DjYlPTGpQqWhqS9nhquBEKDuLWAmyI4ILUl5WTs9/S/
// SIG // fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua2A5HmoDF0M2n
// SIG // 0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3
// SIG // ZUd46PioSKv33nJ+YWtvd6mBy6cJrDm77MbL2IK0cs0d
// SIG // 9LiFAR6A+xuJKlQ5slvayA1VmXqHczsI5pgt6o3gMy4S
// SIG // KfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5Kpqj
// SIG // EWYw07t0MkvfY3v1mYovG8chr1m1rtxEPJdQcdeh0sVV
// SIG // 42neV8HR3jDA/czmTfsNv11P6Z0eGTgvvM9YBS7vDaBQ
// SIG // NdrvCScc1bN+NR4Iuto229Nfj950iEkSMIIE9TCCA92g
// SIG // AwIBAgITMwAAAMw6vTtyOBEFugAAAAAAzDANBgkqhkiG
// SIG // 9w0BAQsFADB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MDAeFw0xODA4MjMyMDI2MjVaFw0xOTExMjMyMDI2MjVa
// SIG // MIHOMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBN
// SIG // aWNyb3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEm
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046QjhFQy0zMEE0
// SIG // LTcxNDQxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IB
// SIG // DwAwggEKAoIBAQDH0FWliiYVaxXd8HeYu7X5zFNLBnEx
// SIG // JxJk6j0vI/p5USi1aLW63x1b07oLgwpViHNfpZ7MOoJ8
// SIG // /poCU+WOlcyBqcGkWEzHt3CfV//1zmQWu8bl7vQOOh4j
// SIG // tk+a6CQZCfZSLduvL6Er15oxkAPddzdZ1obHOlBOFbjr
// SIG // D+eoh7rYh0rSdgIDGKw66SRASNilFZP1whG6YiGmchJ+
// SIG // fbIe4jASJNTiadyEo0F7fgGI8YEqFmqs0rzf6I9UVrvr
// SIG // 9IBXi0QZXaxYoRTvT72dx6kierO3LZjmZGJ35jYzsIXl
// SIG // ZnR490J7nm23mNITgxbVV2Jb0FOw8NkgUOlxHJ5esWBy
// SIG // 5SKLAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQUralNpkrC
// SIG // ZRBP1+t7HiGaMTNI66kwHwYDVR0jBBgwFoAU1WM6XIox
// SIG // kPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZF
// SIG // aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwv
// SIG // cHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEu
// SIG // Y3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0
// SIG // cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYD
// SIG // VR0TAQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDAN
// SIG // BgkqhkiG9w0BAQsFAAOCAQEAPV1daoLp4mVRNVLDyRy/
// SIG // 4BFgVhCnmHLmQ7p4IQjBs6twKdtJPKrEYyhMJi6cI0Cu
// SIG // BKx4YGS7o2AgkZMaQHB3KlK83wUJeoTGy6icCTUZhbv+
// SIG // x+DCQHJJfuJSJjlLCUQI4oXh5eu36uVfovCzAYPC2DTy
// SIG // suJAqE1L0v6oFITq1Z0AqrRDSUwzMY5jnnszvZL6j7by
// SIG // Me+g0nSrYPj16BP1IF3N8S+kQXjYse+jHVPJSzqoOEtR
// SIG // rPQeSssWb/E7X39ck1PxNpDMDn/EJ81p6uTX2g2dfE1M
// SIG // 5cmnC+Oxh1tyud01nVsrfsX4WBq5NClXB4qc9afdgHtQ
// SIG // XuV+6Uoiay7Y36GCA60wggKVAgEBMIH+oYHUpIHRMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046QjhFQy0zMEE0LTcx
// SIG // NDQxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2WiJQoBATAJBgUrDgMCGgUAAxUAc9qHMf0u
// SIG // +zxorOfoRpRzRIe/lk2ggd4wgdukgdgwgdUxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBP
// SIG // cGVyYXRpb25zIFB1ZXJ0byBSaWNvMScwJQYDVQQLEx5u
// SIG // Q2lwaGVyIE5UUyBFU046NTdGNi1DMUUwLTU1NEMxKzAp
// SIG // BgNVBAMTIk1pY3Jvc29mdCBUaW1lIFNvdXJjZSBNYXN0
// SIG // ZXIgQ2xvY2swDQYJKoZIhvcNAQEFBQACBQDfPZUEMCIY
// SIG // DzIwMTgwOTA4MDAyMzMyWhgPMjAxODA5MDkwMDIzMzJa
// SIG // MHQwOgYKKwYBBAGEWQoEATEsMCowCgIFAN89lQQCAQAw
// SIG // BwIBAAICBgEwBwIBAAICGs0wCgIFAN8+5oQCAQAwNgYK
// SIG // KwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAaAKMAgC
// SIG // AQACAxbjYKEKMAgCAQACAwehIDANBgkqhkiG9w0BAQUF
// SIG // AAOCAQEAm/9f80N/apoRlkkCA1piGRe62ZiaS/CocMNi
// SIG // zJglW3ohEFPIU3f+d+sVbeYTdkDrmzCwF5r/NKJt3STG
// SIG // rS7+DgK89R+MFJDRHCfajO2wRSCT8MANdaPAelPvtPE+
// SIG // gGXZdKwDC/426HOcrnHmQSnu6zOqSLrCJAd2M9GBYoUd
// SIG // JMXtknw1+2m7OxMSwuRz4xe5kus8ypUYQ5IEpsjsvnBZ
// SIG // tyxdzVjNGvT4FJ4W+wKAIf3ZYTGZWDwbHJQyXXQ0qEPE
// SIG // 6J2E0vpToWB9CTuTpp6Xjl/+D0mzpCfvjPmZblVsPI7L
// SIG // l1/raN4ThKGhRMNjy0m+JjmaSuxMo7xzS84kRBt8JDGC
// SIG // AvUwggLxAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // JjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
// SIG // QSAyMDEwAhMzAAAAzDq9O3I4EQW6AAAAAADMMA0GCWCG
// SIG // SAFlAwQCAQUAoIIBMjAaBgkqhkiG9w0BCQMxDQYLKoZI
// SIG // hvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIGmjjchEqzvd
// SIG // pjNdhl0zlkxhnL07uTOqIA4FmWC/26yPMIHiBgsqhkiG
// SIG // 9w0BCRACDDGB0jCBzzCBzDCBsQQUc9qHMf0u+zxorOfo
// SIG // RpRzRIe/lk0wgZgwgYCkfjB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMAITMwAAAMw6vTtyOBEFugAAAAAAzDAW
// SIG // BBSFqyI4mWks3KW7MIfWtnSs38NxaDANBgkqhkiG9w0B
// SIG // AQsFAASCAQAvnisZr7Rn1EXhRw3khZavBmgqGX4N5Fhe
// SIG // Rg31DKoKb2UWrhW4+EEL8FSTxWHgLmL/k9uKd/pGPfw/
// SIG // Kl9S1wV/U1kS5AafadjJxcNfo1UEr2iLI/zb7cUT96qJ
// SIG // hjAdvRE463IoEveOgzEkgQfVuGV7PAM6qDzvazEyxZPV
// SIG // J5T7EhH2XV9VJ9/7Tt8vVUBbfFVaRGc9jsjcCIcfmpDB
// SIG // zmEK/Gz1po+zhHGMspvrwNRrI1ixbwr1Fn0e2UUniOdg
// SIG // 3EHtcVJpsnDTIL8vrQat+dhgZnJOfc6dutm8TwtcO2Nz
// SIG // qWlux+L28xn00oHOaR4cWTgyzTpDDgfdryoFlgX364vF
// SIG // End signature block
