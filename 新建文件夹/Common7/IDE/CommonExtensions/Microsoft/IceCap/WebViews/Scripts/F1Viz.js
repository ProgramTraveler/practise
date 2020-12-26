var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var MainViews = (function () {
            function MainViews() {
            }
            Object.defineProperty(MainViews, "Summary", {
                get: function () { return "Summary"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "Contention", {
                get: function () { return "Contention"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "FunctionDetails", {
                get: function () { return "FunctionDetails"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "Functions", {
                get: function () { return "Functions"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "Ips", {
                get: function () { return "Ips"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "CallTree", {
                get: function () { return "CallTree"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "Modules", {
                get: function () { return "Modules"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "Lines", {
                get: function () { return "Lines"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "Allocation", {
                get: function () { return "Allocation"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "ObjectLifetime", {
                get: function () { return "ObjectLifetime"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "Marks", {
                get: function () { return "Marks"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "Processes", {
                get: function () { return "Processes"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "TierInteractions", {
                get: function () { return "TierInteractions"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "CallerCallee", {
                get: function () { return "CallerCallee"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "ResourceDetails", {
                get: function () { return "ResourceDetails"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViews, "ThreadDetails", {
                get: function () { return "ThreadDetails"; },
                enumerable: true,
                configurable: true
            });
            return MainViews;
        }());
        F1Viz.MainViews = MainViews;
        (function (ContextType) {
            ContextType[ContextType["Function"] = 0] = "Function";
            ContextType[ContextType["Line"] = 1] = "Line";
            ContextType[ContextType["Ip"] = 2] = "Ip";
            ContextType[ContextType["Module"] = 3] = "Module";
            ContextType[ContextType["Thread"] = 4] = "Thread";
            ContextType[ContextType["Type"] = 5] = "Type";
            ContextType[ContextType["Resource"] = 6] = "Resource";
        })(F1Viz.ContextType || (F1Viz.ContextType = {}));
        var ContextType = F1Viz.ContextType;
        var MainViewModel = (function () {
            function MainViewModel(reportSummary) {
                var _this = this;
                this._currentStackIndex = ko.observable(0);
                this._infoBars = ko.observableArray([]);
                this._subscriptions = [];
                this._additionalToolbarItems = ko.observableArray([]);
                this._dao = new F1Viz.ReportDAO();
                this._isSerialized = ko.observable(false);
                this._displayTimeType = reportSummary.displayTimeType;
                this._isSerialized(reportSummary.isSerialized);
                this._availableViews = ko.observableArray([
                    { localizedName: Microsoft.Plugin.Resources.getString("SummaryViewName"), component: MainViews.Summary },
                    { localizedName: Microsoft.Plugin.Resources.getString("CallTreeViewName"), component: MainViews.CallTree },
                    { localizedName: Microsoft.Plugin.Resources.getString("ModulesViewName"), component: MainViews.Modules },
                    { localizedName: Microsoft.Plugin.Resources.getString("CallerCalleeViewName"), component: MainViews.CallerCallee },
                    { localizedName: Microsoft.Plugin.Resources.getString("FunctionsViewName"), component: MainViews.Functions }
                ]);
                if (reportSummary.collectionMechanism === F1Viz.CollectionMechanism.Sampling) {
                    this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("LinesViewName"), component: MainViews.Lines });
                }
                if (reportSummary.additionalReportData.indexOf(F1Viz.AdditionalReportData.TierInteractions) !== -1) {
                    this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("TierInteractionsViewName"), component: MainViews.TierInteractions });
                }
                if (reportSummary.type === F1Viz.ReportType.Concurrency) {
                    this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("ResourceDetailsViewName"), component: MainViews.ResourceDetails });
                    this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("ThreadDetailsViewName"), component: MainViews.ThreadDetails });
                    this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("ContentionViewName"), component: MainViews.Contention });
                }
                if (reportSummary.type === F1Viz.ReportType.Memory) {
                    this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("AllocationViewName"), component: MainViews.Allocation });
                }
                if (reportSummary.additionalReportData.indexOf(F1Viz.AdditionalReportData.ObjectLifetime) !== -1) {
                    this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("ObjectLifetimeViewName"), component: MainViews.ObjectLifetime });
                }
                this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("MarksViewName"), component: MainViews.Marks });
                this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("ProcessesViewName"), component: MainViews.Processes });
                this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("FunctionDetailsViewName"), component: MainViews.FunctionDetails });
                if (reportSummary.collectionMechanism !== F1Viz.CollectionMechanism.Instrumentation) {
                    this._availableViews.push({ localizedName: Microsoft.Plugin.Resources.getString("IpViewName"), component: MainViews.Ips });
                }
                this._currentView = ko.pureComputed({
                    read: function () { return _this._navigationStack[_this._currentStackIndex()]; },
                    write: function (value) {
                        var convertedValue = typeof value === "string" ?
                            { name: value } : value;
                        if (_this._currentStackIndex() !== _this._navigationStack.length - 1) {
                            _this._navigationStack.splice(_this._currentStackIndex() + 1);
                        }
                        if (_this._navigationStack.length === 512) {
                            _this._navigationStack.shift();
                            _this._currentStackIndex(_this._currentStackIndex() - 1);
                        }
                        _this._navigationStack.push(convertedValue);
                        _this._currentStackIndex(_this._currentStackIndex() + 1);
                        if (_this._navigationStack.length === 1 ||
                            (_this._navigationStack[_this._navigationStack.length - 2].name !== convertedValue.name)) {
                            _this._dao.viewActivated(convertedValue.name);
                        }
                    }
                });
                this._currentViewName = ko.pureComputed({
                    read: function () { return _this._currentView().name; },
                    write: function (value) { return _this._currentView({ name: value }); }
                });
                this._canNavigateBackward = ko.pureComputed(function () { return _this._currentStackIndex() > 0; });
                this._canNavigateForward = ko.pureComputed(function () { return _this._currentStackIndex() < (_this._navigationStack.length - 1); });
                this.resetNavigationStack();
                this._subscriptions.push(this._currentView.subscribe(function () { return _this._additionalToolbarItems([]); }, null, "beforeChange"));
                this._subscriptions.push(this._currentView.subscribe(function (currentView) {
                    _this._dao.showSourceBrowser(currentView.name === MainViews.FunctionDetails);
                    _this.clearInfoBars();
                }));
            }
            Object.defineProperty(MainViewModel.prototype, "displayTimeType", {
                get: function () {
                    return this._displayTimeType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViewModel.prototype, "isSerialized", {
                get: function () {
                    return this._isSerialized;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViewModel.prototype, "availableViews", {
                get: function () {
                    return this._availableViews;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViewModel.prototype, "currentViewName", {
                get: function () {
                    return this._currentViewName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViewModel.prototype, "currentView", {
                get: function () {
                    return this._currentView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViewModel.prototype, "canNavigateBackward", {
                get: function () {
                    return this._canNavigateBackward;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViewModel.prototype, "canNavigateForward", {
                get: function () {
                    return this._canNavigateForward;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViewModel.prototype, "toolbarItems", {
                get: function () {
                    return this._additionalToolbarItems;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainViewModel.prototype, "infoBars", {
                get: function () {
                    return this._infoBars;
                },
                enumerable: true,
                configurable: true
            });
            MainViewModel.prototype.clearInfoBars = function () {
                this._infoBars([]);
            };
            MainViewModel.prototype.removeInfoBar = function (messageToken) {
                this._infoBars.remove(function (infoBar) { return messageToken === infoBar.messageToken; });
            };
            MainViewModel.prototype.showInfoBar = function (infoBar) {
                this._infoBars.push(infoBar);
            };
            MainViewModel.prototype.navigateToView = function (componentName, componentParams) {
                var avaiableViews = this._availableViews();
                for (var index = 0; index < avaiableViews.length; ++index) {
                    if (avaiableViews[index].component === componentName) {
                        this._currentView({ name: componentName, params: componentParams });
                        return;
                    }
                }
                throw new Error("Unknown view: " + componentName);
            };
            MainViewModel.prototype.resetNavigationStack = function () {
                this._navigationStack = [];
                this._currentStackIndex(-1);
                this._currentViewName(MainViews.Summary);
            };
            MainViewModel.prototype.onNavigateBackward = function (viewModel, event) {
                if (this.canNavigateBackward()) {
                    this._currentStackIndex(this._currentStackIndex() - 1);
                }
            };
            MainViewModel.prototype.onNavigateForward = function (viewModel, event) {
                if (this.canNavigateForward()) {
                    this._currentStackIndex(this._currentStackIndex() + 1);
                }
            };
            MainViewModel.prototype.onSaveReport = function (viewModel, event) {
                this._dao.saveReport();
            };
            MainViewModel.prototype.onExportReport = function (viewModel, event) {
                this._dao.exportReport();
            };
            MainViewModel.prototype.dispose = function () {
                this._subscriptions.forEach(function (subscription) { return subscription.dispose(); });
            };
            return MainViewModel;
        }());
        F1Viz.MainViewModel = MainViewModel;
        var _mainViewModel;
        function onViewReady() {
            Microsoft.F1Viz.InitializeErrorReporting();
            Microsoft.F1Viz.EnableScriptedSandboxDeferredTaskScheduler();
            Microsoft.F1Viz.registerPluginComponentLoader();
            var dao = new F1Viz.ReportDAO();
            dao.getReportSummary()
                .then(function (reportSummary) {
                _mainViewModel = new Microsoft.F1Viz.MainViewModel(reportSummary);
                ko.components.register(MainViews.Summary, {
                    template: "SummaryView",
                    viewModel: function () { return new F1Viz.SummaryViewModel(reportSummary); }
                });
                ko.components.register(MainViews.Functions, {
                    viewModel: function (context) { return new F1Viz.FunctionsViewModel(_mainViewModel.toolbarItems, context); },
                    template: "FunctionsView"
                });
                ko.components.register(MainViews.CallTree, {
                    viewModel: function () { return new F1Viz.CallTreeViewModel(_mainViewModel.toolbarItems); },
                    template: "CallTreeView"
                });
                ko.components.register(MainViews.FunctionDetails, {
                    viewModel: function (context) { return new F1Viz.FunctionDetailsViewModel(reportSummary.type, context); },
                    template: "FunctionDetailsView"
                });
                ko.components.register(MainViews.Modules, {
                    viewModel: function (context) { return new F1Viz.ModulesViewModel(_mainViewModel.toolbarItems, context); },
                    template: "ModulesView"
                });
                ko.components.register(MainViews.Lines, {
                    viewModel: function (context) { return new F1Viz.LinesViewModel(_mainViewModel.toolbarItems, context); },
                    template: "LinesView"
                });
                ko.components.register(MainViews.Marks, {
                    viewModel: function () { return new F1Viz.MarksViewModel(_mainViewModel.toolbarItems); },
                    template: "MarksView"
                });
                ko.components.register(MainViews.Processes, {
                    viewModel: function (context) { return new F1Viz.ProcessesViewModel(reportSummary.type, _mainViewModel.toolbarItems, context); },
                    template: "ProcessesView"
                });
                ko.components.register(MainViews.CallerCallee, {
                    viewModel: function (context) { return new F1Viz.CallerCalleeViewModel(context); },
                    template: "CallerCalleeView"
                });
                if (reportSummary.type != F1Viz.ReportType.Instrumentation) {
                    ko.components.register(MainViews.Ips, {
                        viewModel: function (context) { return new F1Viz.IpViewModel(_mainViewModel.toolbarItems, context); },
                        template: "IpsView"
                    });
                }
                if (reportSummary.type == F1Viz.ReportType.Concurrency) {
                    ko.components.register(MainViews.ThreadDetails, {
                        viewModel: function (context) { return new F1Viz.ResourceThreadDetailsViewModel(F1Viz.ResourceThreadPivot.Thread, context); },
                        template: "ResourceThreadDetailsView"
                    });
                    ko.components.register(MainViews.ResourceDetails, {
                        viewModel: function (context) { return new F1Viz.ResourceThreadDetailsViewModel(F1Viz.ResourceThreadPivot.Resource, context); },
                        template: "ResourceThreadDetailsView"
                    });
                    ko.components.register(MainViews.Contention, {
                        viewModel: function (context) { return new F1Viz.ContentionViewModel(_mainViewModel.toolbarItems, context); },
                        template: "ContentionView"
                    });
                }
                var includeObjectLifetime = reportSummary.additionalReportData.indexOf(F1Viz.AdditionalReportData.ObjectLifetime) !== -1;
                if (reportSummary.type == F1Viz.ReportType.Memory) {
                    ko.components.register(MainViews.Allocation, {
                        viewModel: function (context) { return new F1Viz.AllocationViewModel(includeObjectLifetime, _mainViewModel.toolbarItems, context); },
                        template: "AllocationView"
                    });
                    if (includeObjectLifetime) {
                        ko.components.register(MainViews.ObjectLifetime, {
                            viewModel: function (context) { return new F1Viz.ObjectLifetimeViewModel(_mainViewModel.toolbarItems, context); },
                            template: "ObjectLifetimeView"
                        });
                    }
                }
                var includeTierInteractions = reportSummary.additionalReportData.indexOf(F1Viz.AdditionalReportData.TierInteractions) !== -1;
                if (includeTierInteractions) {
                    ko.components.register(MainViews.TierInteractions, {
                        viewModel: function () { return new F1Viz.TierInteractionsViewModel(); },
                        template: "TierInteractionsView"
                    });
                }
                return Microsoft.Plugin.Promise.join([
                    F1Viz.cacheTemplate("TreeGridView"),
                    F1Viz.cacheTemplate("CopyTreeGridView"),
                    F1Viz.cacheTemplate("SearchControlView"),
                    F1Viz.cacheTemplate("ToolbarItemView"),
                    F1Viz.cacheTemplate("ToggleButtonView"),
                    F1Viz.cacheTemplate("FunctionDetailsInclusivePerfMetricView"),
                    F1Viz.cacheTemplate("FunctionDetailsExclusivePerfMetricView"),
                    F1Viz.cacheTemplate("CopyCallerCalleeView"),
                    F1Viz.cacheTemplate("Loading"),
                    F1Viz.cacheTemplate("DynamicTreeRowView"),
                ]);
            }).then(function () {
                ko.applyBindings(_mainViewModel);
            });
        }
        F1Viz.onViewReady = onViewReady;
        function getMainViewNavigator() {
            return _mainViewModel;
        }
        F1Viz.getMainViewNavigator = getMainViewNavigator;
        function getInfoBarProvider() {
            return _mainViewModel;
        }
        F1Viz.getInfoBarProvider = getInfoBarProvider;
        function getTimeDisplay() {
            return _mainViewModel.displayTimeType;
        }
        F1Viz.getTimeDisplay = getTimeDisplay;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        (function (DataLoadEvent) {
            DataLoadEvent[DataLoadEvent["DataLoadStart"] = 0] = "DataLoadStart";
            DataLoadEvent[DataLoadEvent["DataLoadCompleted"] = 1] = "DataLoadCompleted";
            DataLoadEvent[DataLoadEvent["DataLoadFailed"] = 2] = "DataLoadFailed";
            DataLoadEvent[DataLoadEvent["DataLoadCanceled"] = 3] = "DataLoadCanceled";
        })(F1Viz.DataLoadEvent || (F1Viz.DataLoadEvent = {}));
        var DataLoadEvent = F1Viz.DataLoadEvent;
        (function (SortDirection) {
            SortDirection[SortDirection["Asc"] = 1] = "Asc";
            SortDirection[SortDirection["Desc"] = 2] = "Desc";
        })(F1Viz.SortDirection || (F1Viz.SortDirection = {}));
        var SortDirection = F1Viz.SortDirection;
        (function (AggregateType) {
            AggregateType[AggregateType["Unknown"] = 0] = "Unknown";
            AggregateType[AggregateType["SystemCode"] = 1] = "SystemCode";
            AggregateType[AggregateType["JmcRejected"] = 2] = "JmcRejected";
            AggregateType[AggregateType["ResumingAsyncMethod"] = 3] = "ResumingAsyncMethod";
        })(F1Viz.AggregateType || (F1Viz.AggregateType = {}));
        var AggregateType = F1Viz.AggregateType;
        (function (JmcState) {
            JmcState[JmcState["UnknownCode"] = 0] = "UnknownCode";
            JmcState[JmcState["SystemCode"] = 1] = "SystemCode";
            JmcState[JmcState["LibraryCode"] = 2] = "LibraryCode";
            JmcState[JmcState["UserCode"] = 3] = "UserCode";
            JmcState[JmcState["MarkedHiddenCode"] = 4] = "MarkedHiddenCode";
        })(F1Viz.JmcState || (F1Viz.JmcState = {}));
        var JmcState = F1Viz.JmcState;
        (function (ColumnJustification) {
            ColumnJustification[ColumnJustification["Unknown"] = 0] = "Unknown";
            ColumnJustification[ColumnJustification["Left"] = 1] = "Left";
            ColumnJustification[ColumnJustification["Right"] = 2] = "Right";
            ColumnJustification[ColumnJustification["Center"] = 3] = "Center";
        })(F1Viz.ColumnJustification || (F1Viz.ColumnJustification = {}));
        var ColumnJustification = F1Viz.ColumnJustification;
        (function (ColumnDisplayType) {
            ColumnDisplayType[ColumnDisplayType["Unknown"] = 0] = "Unknown";
            ColumnDisplayType[ColumnDisplayType["Counter"] = 1] = "Counter";
            ColumnDisplayType[ColumnDisplayType["Time"] = 2] = "Time";
            ColumnDisplayType[ColumnDisplayType["Hex"] = 3] = "Hex";
            ColumnDisplayType[ColumnDisplayType["ID"] = 4] = "ID";
        })(F1Viz.ColumnDisplayType || (F1Viz.ColumnDisplayType = {}));
        var ColumnDisplayType = F1Viz.ColumnDisplayType;
        (function (ColumnType) {
            ColumnType[ColumnType["Unknown"] = 0] = "Unknown";
            ColumnType[ColumnType["Counter"] = 1] = "Counter";
            ColumnType[ColumnType["Percent"] = 2] = "Percent";
            ColumnType[ColumnType["String"] = 3] = "String";
            ColumnType[ColumnType["SignedCounter"] = 4] = "SignedCounter";
        })(F1Viz.ColumnType || (F1Viz.ColumnType = {}));
        var ColumnType = F1Viz.ColumnType;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        function InitializeErrorReporting() {
            window.onerror = function (message, filename, lineno, colno, error) {
                var logger = F1Viz.getLogger();
                var errorMessage = "F1Viz script error caught in: " + (filename || "unknown script file") + " at " + lineno + "\n" + message;
                logger.error(errorMessage);
                Microsoft.Plugin.Diagnostics.reportError(message, filename, lineno, message, colno);
                Microsoft.Plugin.Diagnostics.terminate();
            };
        }
        F1Viz.InitializeErrorReporting = InitializeErrorReporting;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _componentLoaderMarshalerProxy = null;
        function cacheTemplate(templateName) {
            return _componentLoaderMarshalerProxy._call("loadHtmlTemplate", templateName)
                .then(function (templateSource) {
                var templateElement = document.createElement("script");
                templateElement.id = templateName;
                templateElement.innerHTML = templateSource;
                templateElement.type = "text/html";
                document.head.appendChild(templateElement);
                return templateElement;
            });
        }
        F1Viz.cacheTemplate = cacheTemplate;
        var pluginComponentLoader = {
            loadTemplate: function (componentName, templateConfig, callback) {
                if (!ko.components.defaultLoader) {
                    return;
                }
                var template = document.getElementById(templateConfig);
                var templatePromise = !template ?
                    cacheTemplate(templateConfig) :
                    Microsoft.Plugin.Promise.as(template);
                templatePromise.then(function (templateElement) {
                    ko.components.defaultLoader.loadTemplate(componentName, templateElement.innerHTML, callback);
                });
            }
        };
        function registerPluginComponentLoader() {
            if (_componentLoaderMarshalerProxy === null) {
                _componentLoaderMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.ComponentLoaderMarshaler", {}, true);
            }
            ko.components.loaders.unshift(pluginComponentLoader);
        }
        F1Viz.registerPluginComponentLoader = registerPluginComponentLoader;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var knockoutDeferredTaskScheduler;
        function EnableScriptedSandboxDeferredTaskScheduler() {
            if (!knockoutDeferredTaskScheduler) {
                knockoutDeferredTaskScheduler = ko.tasks.scheduler;
            }
            var forceScheduleTask = null;
            ko.tasks.scheduler = function (callback) {
                knockoutDeferredTaskScheduler(callback);
                if (forceScheduleTask === null) {
                    forceScheduleTask = setTimeout(function () {
                        forceScheduleTask = null;
                        ko.tasks.runEarly();
                    }, 0);
                    ko.tasks.schedule(function () {
                        if (forceScheduleTask === null) {
                            return;
                        }
                        clearTimeout(forceScheduleTask);
                        forceScheduleTask = null;
                    });
                }
            };
        }
        F1Viz.EnableScriptedSandboxDeferredTaskScheduler = EnableScriptedSandboxDeferredTaskScheduler;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
ko.bindingHandlers["ariaExpanded"] = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        if (typeof value === "boolean") {
            element.setAttribute("aria-expanded", value);
            return;
        }
        if (ko.unwrap(value.expandable)) {
            element.setAttribute("aria-expanded", ko.unwrap(value.expanded));
        }
        else {
            element.removeAttribute("aria-expanded");
        }
    }
};
ko.bindingHandlers["circularFocus"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var bindingValue = valueAccessor();
        var selector = bindingValue.selector;
        var isVertical = bindingValue.vertical;
        var arrowKeyNext = bindingValue.vertical ?
            Microsoft.F1Viz.Common.KeyCodes.ArrowDown :
            Microsoft.F1Viz.Common.KeyCodes.ArrowRight;
        var arrowKeyPrevious = bindingValue.vertical ?
            Microsoft.F1Viz.Common.KeyCodes.ArrowUp :
            Microsoft.F1Viz.Common.KeyCodes.ArrowLeft;
        element.addEventListener("keydown", function (e) {
            if (e.keyCode !== arrowKeyPrevious && e.keyCode !== arrowKeyNext) {
                return;
            }
            var elements = element.querySelectorAll(selector);
            if (elements.length === 0) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            var isDisabled = function (element) { return element.disabled; };
            var isHidden = function (element) { return element.offsetHeight === 0; };
            var start = e.keyCode === arrowKeyNext ? 0 : elements.length - 1;
            var end = e.keyCode === arrowKeyNext ? elements.length - 1 : 0;
            var increment = e.keyCode === arrowKeyNext ? 1 : -1;
            for (var i = 0; i < elements.length; ++i) {
                if (elements[i] !== document.activeElement) {
                    continue;
                }
                for (var next = 1; next < elements.length; ++next) {
                    var nextIndex = (i + (next * increment) + elements.length) % elements.length;
                    var maybeFocusable = elements[nextIndex];
                    if (!isHidden(maybeFocusable) && !isDisabled(maybeFocusable)) {
                        maybeFocusable.focus();
                        return;
                    }
                }
                return;
            }
            for (var i = 0; i < elements.length; ++i) {
                var index = (i * increment) + start;
                var maybeFocusable = elements[index];
                if (!isHidden(maybeFocusable) && !isDisabled(maybeFocusable)) {
                    maybeFocusable.focus();
                    return;
                }
            }
        });
    }
};
var _dynamicContextMenu;
ko.bindingHandlers["dynamicContextMenu"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var factoryFunction = valueAccessor();
        var domElement = element;
        domElement.addEventListener("contextmenu", function (event) {
            var context = ko.contextFor(event.target);
            if (!context && context.$data) {
                return;
            }
            if (_dynamicContextMenu) {
                _dynamicContextMenu.dispose();
            }
            _dynamicContextMenu = factoryFunction.call(viewModel, context.$data, event);
            if (_dynamicContextMenu) {
                event.preventDefault();
                event.stopPropagation();
                if (event.pointerType === "mouse") {
                    _dynamicContextMenu.show(event.clientX, event.clientY);
                }
                else {
                    var target = event.target;
                    var rect = target.getBoundingClientRect();
                    _dynamicContextMenu.show(rect.left, rect.top + rect.height);
                }
            }
        });
    }
};
ko.bindingHandlers["documentFragment"] = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        var value = ko.unwrap(valueAccessor());
        element.appendChild(value);
    }
};
ko.bindingHandlers["formatInteger"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        ko.utils.setHtml(element, Microsoft.F1Viz.CpuSamplingUtilities.localizeNumber(value));
    }
};
ko.bindingHandlers["formatPercent"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        ko.utils.setHtml(element, Microsoft.F1Viz.CpuSamplingUtilities.localizeNumber(value, { style: 'percent', minimumFractionDigits: 2 }));
    }
};
ko.bindingHandlers["formatTime"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var format = valueAccessor();
        var value = ko.unwrap(format.value);
        if (value === null) {
            return;
        }
        var timeType = ko.unwrap(format.timeType);
        var valueText;
        if (timeType === Microsoft.F1Viz.TimeType.Milliseconds) {
            valueText = Microsoft.F1Viz.CpuSamplingUtilities.localizeNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        else {
            valueText = Microsoft.F1Viz.CpuSamplingUtilities.localizeNumber(value);
        }
        ko.utils.setHtml(element, valueText);
    }
};
ko.bindingHandlers["iControl"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.virtualElements.emptyNode(element);
        var control = ko.unwrap(valueAccessor());
        if (!control) {
            return;
        }
        ko.virtualElements.insertAfter(element, control.container, null);
        if (control.resize) {
            control.resize(null);
        }
    }
};
ko.virtualElements.allowedBindings["iControl"] = true;
ko.bindingHandlers["focus"] = {
    previousElement: null,
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var onFocus = function () {
            if (ko.bindingHandlers["focus"].previousElement && ko.bindingHandlers["focus"].previousElement !== element) {
                var e = document.createEvent("Event");
                e.initEvent("blur", false, false);
                ko.bindingHandlers["focus"].previousElement.dispatchEvent(e);
            }
            var hasFocusObservable = valueAccessor();
            if (ko.isWriteableObservable(hasFocusObservable) && !hasFocusObservable()) {
                hasFocusObservable(true);
            }
            ko.bindingHandlers["focus"].previousElement = element;
        };
        var onBlur = function () {
            var hasFocusObservable = valueAccessor();
            if (ko.isWriteableObservable(hasFocusObservable) && !!hasFocusObservable()) {
                hasFocusObservable(false);
            }
        };
        element.addEventListener("focus", onFocus);
        element.addEventListener("blur", onBlur);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        if (!ko.unwrap(valueAccessor())) {
            element.blur();
        }
        else {
            element.focus();
        }
    }
};
ko.bindingHandlers["localizedAriaLabel"] = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var keyWithArgs = valueAccessor();
        if (!Array.isArray(keyWithArgs)) {
            keyWithArgs = [keyWithArgs];
        }
        var unwrappedArgs = keyWithArgs.map(function (value) { return ko.unwrap(value); });
        var localizedText = Microsoft.Plugin.Resources.getString.apply(null, unwrappedArgs);
        element.setAttribute("aria-label", localizedText);
    }
};
ko.bindingHandlers["localizedPlaceholderText"] = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var keyWithArgs = valueAccessor();
        if (!Array.isArray(keyWithArgs)) {
            keyWithArgs = [keyWithArgs];
        }
        var unwrappedArgs = keyWithArgs.map(function (value) { return ko.unwrap(value); });
        var localizedText = Microsoft.Plugin.Resources.getString.apply(null, unwrappedArgs);
        element.setAttribute("placeholder", localizedText);
    }
};
ko.bindingHandlers["localizedText"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var keyWithArgs = valueAccessor();
        if (!Array.isArray(keyWithArgs)) {
            keyWithArgs = [keyWithArgs];
        }
        var unwrappedArgs = keyWithArgs.map(function (value) { return ko.unwrap(value); });
        var localizedText = Microsoft.Plugin.Resources.getString.apply(null, unwrappedArgs);
        ko.utils.setHtml(element, localizedText);
    }
};
ko.bindingHandlers["localizedTooltip"] = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var keyWithArgs = valueAccessor();
        if (!Array.isArray(keyWithArgs)) {
            keyWithArgs = [keyWithArgs];
        }
        var unwrappedArgs = keyWithArgs.map(function (value) { return ko.unwrap(value); });
        element.setAttribute("data-plugin-vs-tooltip", JSON.stringify({
            content: Microsoft.Plugin.Resources.getString.apply(null, unwrappedArgs),
            delay: Microsoft.F1Viz.Constants.TooltipTimeoutMs
        }));
    }
};
ko.bindingHandlers["onEnter"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        element.addEventListener("keydown", function (e) {
            if (Microsoft.F1Viz.Common.KeyCodes.Enter !== e.keyCode) {
                return;
            }
            var eventHandler = valueAccessor();
            var allowPropagation = eventHandler.apply(viewModel, [viewModel, e]);
            if (!allowPropagation) {
                e.preventDefault();
            }
        });
    }
};
ko.bindingHandlers["svgImage"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var svgKey = ko.unwrap(valueAccessor());
        if (!svgKey) {
            return;
        }
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element.appendChild(Microsoft.F1Viz.Utilities.getSVGPlaceHolder(svgKey));
        Microsoft.Plugin.Theme.processInjectedSvg(element);
        element.setAttribute("role", "img");
    }
};
ko.bindingHandlers["tooltip"] = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var tooltipText = valueAccessor();
        if (!tooltipText) {
            element.removeAttribute("data-plugin-vs-tooltip");
        }
        else {
            element.setAttribute("data-plugin-vs-tooltip", JSON.stringify({
                content: tooltipText,
                delay: Microsoft.F1Viz.Constants.TooltipTimeoutMs
            }));
        }
    }
};
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _allocationMarshalerProxy = null;
        var AllocationDAO = (function () {
            function AllocationDAO(config) {
                this._config = config;
            }
            AllocationDAO.create = function () {
                if (_allocationMarshalerProxy === null) {
                    _allocationMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.AllocationMarshaler", {}, true);
                }
                return _allocationMarshalerProxy._call("config")
                    .then(function (config) { return new AllocationDAO(config); });
            };
            Object.defineProperty(AllocationDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            AllocationDAO.prototype.getHeaderConfig = function () {
                return _allocationMarshalerProxy._call("header");
            };
            AllocationDAO.prototype.expandHotPath = function (startingRow) {
                if (startingRow) {
                    return _allocationMarshalerProxy._call("expandHotPath", startingRow.dto.uid);
                }
                else {
                    return _allocationMarshalerProxy._call("expandHotPath");
                }
            };
            AllocationDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                return _allocationMarshalerProxy._call("getRoots")
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (roots) { return _this.sort(roots, sortInfo); });
            };
            AllocationDAO.prototype.expand = function (row, sortInfo) {
                var _this = this;
                var dataLoadPromise = Microsoft.Plugin.Promise.as(void 0);
                var treeRow = row;
                if (treeRow.expanded === null) {
                    return dataLoadPromise;
                }
                if (treeRow.children().length === 0) {
                    dataLoadPromise = _allocationMarshalerProxy._call("getChildren", treeRow.dto.uid)
                        .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(treeRow, dto, _this._config.columns, row.depth + 1); }); })
                        .then(function (children) { return _this.sort(children, sortInfo); })
                        .then(function (sortedChildren) { return row.children(sortedChildren); });
                }
                return dataLoadPromise.then(function () { return treeRow.expanded(!treeRow.expanded()); });
            };
            AllocationDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                return _allocationMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startingRow ? startingRow.dto.uid : null)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            AllocationDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                var sortChildren = function (element) {
                    if (element.children) {
                        element.children.sort(sortFunc);
                        element.children().forEach(sortChildren);
                    }
                };
                return _allocationMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () {
                    roots.sort(sortFunc);
                    roots.forEach(sortChildren);
                    return roots;
                });
            };
            AllocationDAO.prototype.clearCache = function () {
                _allocationMarshalerProxy._post("clearCache");
            };
            AllocationDAO.prototype.shouldShowInfoBar = function () {
                return _allocationMarshalerProxy._call("shouldShowInfoBar");
            };
            AllocationDAO.prototype.showNoiseReduction = function () {
                return _allocationMarshalerProxy._call("showNoiseReduction");
            };
            AllocationDAO.prototype.getColumnSettings = function () {
                return _allocationMarshalerProxy._call("columnSettings");
            };
            AllocationDAO.prototype.onColumnChanged = function (column) {
                _allocationMarshalerProxy._call("columnSettingsChanged", column);
            };
            AllocationDAO.prototype.viewSource = function (filePath, lineNumber) {
                _allocationMarshalerProxy._call("viewSource", filePath, lineNumber);
            };
            return AllocationDAO;
        }());
        F1Viz.AllocationDAO = AllocationDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _callTreeMarshalerProxy = null;
        var CallTreeDAO = (function () {
            function CallTreeDAO(config) {
                this._root = ko.observable(null);
                this._config = config;
            }
            CallTreeDAO.create = function () {
                if (_callTreeMarshalerProxy === null) {
                    _callTreeMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.CallTreeMarshaler", {}, true);
                }
                return _callTreeMarshalerProxy._call("config")
                    .then(function (config) { return new CallTreeDAO(config); });
            };
            Object.defineProperty(CallTreeDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            CallTreeDAO.prototype.getHeader = function () {
                return _callTreeMarshalerProxy._call("header");
            };
            Object.defineProperty(CallTreeDAO.prototype, "root", {
                get: function () {
                    return this._root;
                },
                enumerable: true,
                configurable: true
            });
            CallTreeDAO.prototype.clearCache = function () {
                _callTreeMarshalerProxy._post("clearCache");
            };
            CallTreeDAO.prototype.shouldShowInfoBar = function () {
                return _callTreeMarshalerProxy._call("shouldShowInfoBar");
            };
            CallTreeDAO.prototype.showNoiseReduction = function () {
                return _callTreeMarshalerProxy._call("showNoiseReduction");
            };
            CallTreeDAO.prototype.trimCallTree = function () {
                return _callTreeMarshalerProxy._call("trimCallTree");
            };
            CallTreeDAO.prototype.viewSource = function (filePath, lineNumber) {
                _callTreeMarshalerProxy._call("viewSource", filePath, lineNumber);
            };
            CallTreeDAO.prototype.expandHotPath = function (startingRow) {
                if (startingRow) {
                    return _callTreeMarshalerProxy._call("expandHotPath", startingRow.dto.uid);
                }
                else {
                    return _callTreeMarshalerProxy._call("expandHotPath");
                }
            };
            CallTreeDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                if (this.root()) {
                    return Microsoft.Plugin.Promise.as([new F1Viz.DynamicTreeRowViewModel(null, this.root(), this._config.columns, 0)]);
                }
                return _callTreeMarshalerProxy._call("roots")
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (roots) { return _this.sort(roots, sortInfo); });
            };
            CallTreeDAO.prototype.expand = function (row, sortInfo) {
                var _this = this;
                var dataLoadPromise = Microsoft.Plugin.Promise.as(void 0);
                var treeRow = row;
                if (treeRow.expanded === null) {
                    return dataLoadPromise;
                }
                if (treeRow.children().length === 0) {
                    dataLoadPromise = _callTreeMarshalerProxy._call("children", treeRow.dto.uid)
                        .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(treeRow, dto, _this._config.columns, row.depth + 1); }); })
                        .then(function (children) { return _this.sort(children, sortInfo); })
                        .then(function (sortedChildren) { return row.children(sortedChildren); });
                }
                return dataLoadPromise.then(function () { return treeRow.expanded(!treeRow.expanded()); });
            };
            CallTreeDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                return _callTreeMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startingRow ? startingRow.dto.uid : null)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            CallTreeDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                var sortChildren = function (element) {
                    if (element.children) {
                        element.children.sort(sortFunc);
                        element.children().forEach(sortChildren);
                    }
                };
                return _callTreeMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () {
                    roots.sort(sortFunc);
                    roots.forEach(sortChildren);
                    return roots;
                });
            };
            CallTreeDAO.prototype.getColumnSettings = function () {
                return _callTreeMarshalerProxy._call("columnSettings");
            };
            CallTreeDAO.prototype.onColumnChanged = function (column) {
                _callTreeMarshalerProxy._call("columnSettingsChanged", column);
            };
            return CallTreeDAO;
        }());
        F1Viz.CallTreeDAO = CallTreeDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _callerCalleeMarshalerProxy = null;
        var CallerCalleeDAO = (function () {
            function CallerCalleeDAO(config) {
                this._logger = Microsoft.F1Viz.getLogger();
                this._config = config;
            }
            CallerCalleeDAO.create = function () {
                if (_callerCalleeMarshalerProxy === null) {
                    _callerCalleeMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.CallerCalleeMarshaler", {}, true);
                }
                return _callerCalleeMarshalerProxy._call("config")
                    .then(function (config) { return new CallerCalleeDAO(config); });
            };
            Object.defineProperty(CallerCalleeDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            CallerCalleeDAO.prototype.getHeader = function () {
                return _callerCalleeMarshalerProxy._call("header");
            };
            CallerCalleeDAO.prototype.getData = function (sortInfo, context) {
                var _this = this;
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                return _callerCalleeMarshalerProxy._call("getCallerCallee", context).then(function (data) {
                    var callers = data.callers.map(function (callerRow) { return new F1Viz.DynamicTreeRowViewModel(null, callerRow, _this._config.columns, 0); });
                    var callees = data.callees.map(function (calleeRow) { return new F1Viz.DynamicTreeRowViewModel(null, calleeRow, _this._config.columns, 0); });
                    return {
                        current: new F1Viz.DynamicTreeRowViewModel(null, data.current, _this._config.columns, 0),
                        callers: callers.sort(sortFunc),
                        callees: callees.sort(sortFunc)
                    };
                });
            };
            CallerCalleeDAO.prototype.viewSource = function (filePath, lineNumber) {
                _callerCalleeMarshalerProxy._call("viewSource", filePath, lineNumber);
            };
            CallerCalleeDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                roots.sort(sortFunc);
                return Microsoft.Plugin.Promise.as(roots);
            };
            CallerCalleeDAO.prototype.getColumnSettings = function () {
                return _callerCalleeMarshalerProxy._call("columnSettings");
            };
            CallerCalleeDAO.prototype.onColumnChanged = function (column) {
                _callerCalleeMarshalerProxy._call("columnSettingsChanged", column);
            };
            return CallerCalleeDAO;
        }());
        F1Viz.CallerCalleeDAO = CallerCalleeDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _contentionMarshalerProxy = null;
        var ContentionDAO = (function () {
            function ContentionDAO(config) {
                this._config = config;
            }
            ContentionDAO.create = function () {
                if (_contentionMarshalerProxy === null) {
                    _contentionMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.ContentionMarshaler", {}, true);
                }
                return _contentionMarshalerProxy._call("config")
                    .then(function (config) { return new ContentionDAO(config); });
            };
            Object.defineProperty(ContentionDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            ContentionDAO.prototype.getHeader = function () {
                return _contentionMarshalerProxy._call("header");
            };
            ContentionDAO.prototype.expandHotPath = function (startingRow) {
                if (startingRow) {
                    return _contentionMarshalerProxy._call("expandHotPath", startingRow.dto.uid);
                }
                else {
                    return _contentionMarshalerProxy._call("expandHotPath");
                }
            };
            ContentionDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                return _contentionMarshalerProxy._call("getRoots")
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (roots) { return _this.sort(roots, sortInfo); });
            };
            ContentionDAO.prototype.expand = function (row, sortInfo) {
                var _this = this;
                var dataLoadPromise = Microsoft.Plugin.Promise.as(void 0);
                var treeRow = row;
                if (treeRow.expanded === null) {
                    return dataLoadPromise;
                }
                if (treeRow.children().length === 0) {
                    dataLoadPromise = _contentionMarshalerProxy._call("getChildren", treeRow.dto.uid)
                        .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(treeRow, dto, _this._config.columns, row.depth + 1); }); })
                        .then(function (children) { return _this.sort(children, sortInfo); })
                        .then(function (sortedChildren) { return row.children(sortedChildren); });
                }
                return dataLoadPromise.then(function () { return treeRow.expanded(!treeRow.expanded()); });
            };
            ContentionDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                return _contentionMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startingRow ? startingRow.dto.uid : null)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            ContentionDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                var sortChildren = function (element) {
                    if (element.children) {
                        element.children.sort(sortFunc);
                        element.children().forEach(sortChildren);
                    }
                };
                return _contentionMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () {
                    roots.forEach(sortChildren);
                    return roots.sort(sortFunc);
                });
            };
            ContentionDAO.prototype.clearCache = function () {
                _contentionMarshalerProxy._post("clearCache");
            };
            ContentionDAO.prototype.shouldShowInfoBar = function () {
                return _contentionMarshalerProxy._call("shouldShowInfoBar");
            };
            ContentionDAO.prototype.showNoiseReduction = function () {
                return _contentionMarshalerProxy._call("showNoiseReduction");
            };
            ContentionDAO.prototype.viewSource = function (filePath, lineNumber) {
                _contentionMarshalerProxy._call("viewSource", filePath, lineNumber);
            };
            ContentionDAO.prototype.getColumnSettings = function () {
                return _contentionMarshalerProxy._call("columnSettings");
            };
            ContentionDAO.prototype.onColumnChanged = function (column) {
                _contentionMarshalerProxy._call("columnSettingsChanged", column);
            };
            return ContentionDAO;
        }());
        F1Viz.ContentionDAO = ContentionDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        (function (PerfMetricType) {
            PerfMetricType[PerfMetricType["Text"] = 0] = "Text";
            PerfMetricType[PerfMetricType["Number"] = 1] = "Number";
            PerfMetricType[PerfMetricType["Percent"] = 2] = "Percent";
            PerfMetricType[PerfMetricType["Time"] = 3] = "Time";
        })(F1Viz.PerfMetricType || (F1Viz.PerfMetricType = {}));
        var PerfMetricType = F1Viz.PerfMetricType;
        var _functionDetailsMarshalerProxy = null;
        var FunctionDetailsDAO = (function () {
            function FunctionDetailsDAO() {
                if (_functionDetailsMarshalerProxy === null) {
                    _functionDetailsMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.FunctionDetailsMarshaler", {}, true);
                }
            }
            FunctionDetailsDAO.prototype.getData = function (metricIndex, context) {
                return _functionDetailsMarshalerProxy._call("callerCallee", metricIndex, context);
            };
            FunctionDetailsDAO.prototype.updateSourceBrowser = function (contextId, metricIndex) {
                return _functionDetailsMarshalerProxy._call("updateSourceBrowser", contextId, metricIndex);
            };
            return FunctionDetailsDAO;
        }());
        F1Viz.FunctionDetailsDAO = FunctionDetailsDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _functionsMarshalerProxy = null;
        var FunctionsDAO = (function () {
            function FunctionsDAO(config) {
                this._config = config;
            }
            FunctionsDAO.create = function () {
                if (_functionsMarshalerProxy === null) {
                    _functionsMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.FunctionsMarshaler", {}, true);
                }
                return _functionsMarshalerProxy._call("config")
                    .then(function (config) { return new FunctionsDAO(config); });
            };
            Object.defineProperty(FunctionsDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            FunctionsDAO.prototype.getHeader = function () {
                return _functionsMarshalerProxy._call("header");
            };
            FunctionsDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                var navigator = F1Viz.getMainViewNavigator();
                var crossReference = function (dto) { return navigator.navigateToView(F1Viz.MainViews.FunctionDetails, dto.k); };
                return _functionsMarshalerProxy._call("getFunctions")
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0, crossReference); }); })
                    .then(function (rows) { return _this.sort(rows, sortInfo); });
            };
            FunctionsDAO.prototype.expand = function (row, sortInfo) {
                return null;
            };
            FunctionsDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                var startId = startingRow ? startingRow.id : null;
                return _functionsMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startId)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            FunctionsDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                return _functionsMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () { return roots.sort(sortFunc); });
            };
            FunctionsDAO.prototype.viewSource = function (filePath, lineNumber) {
                _functionsMarshalerProxy._call("viewSource", filePath, lineNumber);
            };
            FunctionsDAO.prototype.getColumnSettings = function () {
                return _functionsMarshalerProxy._call("columnSettings");
            };
            FunctionsDAO.prototype.onColumnChanged = function (column) {
                _functionsMarshalerProxy._call("columnSettingsChanged", column);
            };
            return FunctionsDAO;
        }());
        F1Viz.FunctionsDAO = FunctionsDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _ipMarshalerProxy = null;
        var IpDAO = (function () {
            function IpDAO(config) {
                this._config = config;
            }
            IpDAO.create = function () {
                if (_ipMarshalerProxy === null) {
                    _ipMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.IpMarshaler", {}, true);
                }
                return _ipMarshalerProxy._call("config")
                    .then(function (config) { return new IpDAO(config); });
            };
            Object.defineProperty(IpDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            IpDAO.prototype.getHeader = function () {
                return _ipMarshalerProxy._call("header");
            };
            IpDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                return _ipMarshalerProxy._call("getIpRows")
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (rows) { return _this.sort(rows, sortInfo); });
            };
            IpDAO.prototype.expand = function (row, sortInfo) {
                return null;
            };
            IpDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                var startId = startingRow ? startingRow.id : null;
                return _ipMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startId)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            IpDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                return _ipMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () { return roots.sort(sortFunc); });
            };
            IpDAO.prototype.getColumnSettings = function () {
                return _ipMarshalerProxy._call("columnSettings");
            };
            IpDAO.prototype.onColumnChanged = function (column) {
                _ipMarshalerProxy._call("columnSettingsChanged", column);
            };
            IpDAO.prototype.viewSource = function (filePath, lineNumber) {
                _ipMarshalerProxy._call("viewSource", filePath, lineNumber);
            };
            return IpDAO;
        }());
        F1Viz.IpDAO = IpDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _linesMarshalerProxy = null;
        var LinesDAO = (function () {
            function LinesDAO(config) {
                this._logger = Microsoft.F1Viz.getLogger();
                this._config = config;
            }
            LinesDAO.create = function () {
                if (_linesMarshalerProxy === null) {
                    _linesMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.LinesMarshaler", {}, true);
                }
                return _linesMarshalerProxy._call("config")
                    .then(function (config) { return new LinesDAO(config); });
            };
            Object.defineProperty(LinesDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            LinesDAO.prototype.getHeader = function () {
                return _linesMarshalerProxy._call("header");
            };
            LinesDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                return _linesMarshalerProxy._call("getLines")
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (rows) { return _this.sort(rows, sortInfo); });
            };
            LinesDAO.prototype.expand = function (row, sortInfo) {
                return null;
            };
            LinesDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                var startId = startingRow ? startingRow.id : null;
                return _linesMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startId)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            LinesDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                return _linesMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () { return roots.sort(sortFunc); });
            };
            LinesDAO.prototype.viewSource = function (filePath, lineNumber) {
                _linesMarshalerProxy._call("viewSource", filePath, lineNumber);
            };
            LinesDAO.prototype.getColumnSettings = function () {
                return _linesMarshalerProxy._call("columnSettings");
            };
            LinesDAO.prototype.onColumnChanged = function (column) {
                _linesMarshalerProxy._call("columnSettingsChanged", column);
            };
            return LinesDAO;
        }());
        F1Viz.LinesDAO = LinesDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _marksMarshalerProxy = null;
        var MarksDAO = (function () {
            function MarksDAO(config) {
                this._config = config;
            }
            MarksDAO.create = function () {
                if (_marksMarshalerProxy === null) {
                    _marksMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.MarksMarshaler", {}, true);
                }
                return _marksMarshalerProxy._call("config")
                    .then(function (config) { return new MarksDAO(config); });
            };
            Object.defineProperty(MarksDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            MarksDAO.prototype.getHeader = function () {
                return _marksMarshalerProxy._call("header");
            };
            MarksDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                return _marksMarshalerProxy._call("getMarks")
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (rows) { return _this.sort(rows, sortInfo); });
            };
            MarksDAO.prototype.expand = function (row, sortInfo) {
                return null;
            };
            MarksDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                return _marksMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startingRow ? startingRow.id : null)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            MarksDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                return _marksMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () { return roots.sort(sortFunc); });
            };
            MarksDAO.prototype.getColumnSettings = function () {
                return _marksMarshalerProxy._call("columnSettings");
            };
            MarksDAO.prototype.onColumnChanged = function (column) {
                _marksMarshalerProxy._call("columnSettingsChanged", column);
            };
            return MarksDAO;
        }());
        F1Viz.MarksDAO = MarksDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _modulesMarshalerProxy = null;
        var ModulesDAO = (function () {
            function ModulesDAO(config, context) {
                this._context = null;
                this._context = context;
                this._config = config;
            }
            ModulesDAO.create = function (context) {
                if (_modulesMarshalerProxy === null) {
                    _modulesMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.ModulesMarshaler", {}, true);
                }
                return _modulesMarshalerProxy._call("config")
                    .then(function (config) { return new ModulesDAO(config, context); });
            };
            Object.defineProperty(ModulesDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            ModulesDAO.prototype.getHeader = function () {
                return _modulesMarshalerProxy._call("header");
            };
            ModulesDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                var expandContext = function (rows) { return rows; };
                if (this._context) {
                    expandContext = function (rows) {
                        rows.forEach(function (row) {
                            if (row.children && row.children().length) {
                                row.expanded(true);
                                expandContext(row.children());
                            }
                        });
                        return rows;
                    };
                }
                return _modulesMarshalerProxy._call("roots", this._context)
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (roots) { return expandContext(roots); })
                    .then(function (roots) { return _this.sort(roots, sortInfo); });
            };
            ModulesDAO.prototype.expand = function (row, sortInfo) {
                var _this = this;
                var dataLoadPromise = Microsoft.Plugin.Promise.as(void 0);
                var treeRow = row;
                if (treeRow.expanded === null) {
                    return dataLoadPromise;
                }
                if (treeRow.children().length === 0) {
                    var idPath = [];
                    var currentNode = treeRow;
                    while (currentNode) {
                        idPath.push(currentNode.id);
                        currentNode = currentNode.parent;
                    }
                    idPath.reverse();
                    dataLoadPromise = _modulesMarshalerProxy._call("children", idPath)
                        .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(treeRow, dto, _this._config.columns, treeRow.depth + 1); }); })
                        .then(function (children) { return _this.sort(children, sortInfo); })
                        .then(function (sortedChildren) { return treeRow.children(sortedChildren); });
                }
                return dataLoadPromise.then(function () { return treeRow.expanded(!treeRow.expanded()); });
            };
            ModulesDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                var startingContext = startingRow ? startingRow.dto.k : null;
                return _modulesMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startingContext)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            ModulesDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                var sortChildren = function (element) {
                    if (element.children) {
                        element.children.sort(sortFunc);
                        element.children().forEach(sortChildren);
                    }
                };
                return _modulesMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () {
                    roots.forEach(sortChildren);
                    return roots.sort(sortFunc);
                });
            };
            ModulesDAO.prototype.getColumnSettings = function () {
                return _modulesMarshalerProxy._call("columnSettings");
            };
            ModulesDAO.prototype.onColumnChanged = function (column) {
                _modulesMarshalerProxy._call("columnSettingsChanged", column);
            };
            return ModulesDAO;
        }());
        F1Viz.ModulesDAO = ModulesDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _objectLifetimeMarshalerProxy = null;
        var ObjectLifetimeDAO = (function () {
            function ObjectLifetimeDAO(config) {
                this._config = config;
            }
            ObjectLifetimeDAO.create = function () {
                if (_objectLifetimeMarshalerProxy === null) {
                    _objectLifetimeMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.ObjectLifetimeMarshaler", {}, true);
                }
                return _objectLifetimeMarshalerProxy._call("config")
                    .then(function (config) { return new ObjectLifetimeDAO(config); });
            };
            Object.defineProperty(ObjectLifetimeDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            ObjectLifetimeDAO.prototype.getHeader = function () {
                return _objectLifetimeMarshalerProxy._call("header");
            };
            ObjectLifetimeDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                return _objectLifetimeMarshalerProxy._call("getTypes")
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (rows) { return _this.sort(rows, sortInfo); });
            };
            ObjectLifetimeDAO.prototype.expand = function (row, sortInfo) {
                return null;
            };
            ObjectLifetimeDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                var startId = startingRow ? startingRow.id : null;
                return _objectLifetimeMarshalerProxy._call("search", query, isCaseSensitive, isRegex, startId)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            ObjectLifetimeDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                return _objectLifetimeMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () { return roots.sort(sortFunc); });
            };
            ObjectLifetimeDAO.prototype.getColumnSettings = function () {
                return _objectLifetimeMarshalerProxy._call("columnSettings");
            };
            ObjectLifetimeDAO.prototype.onColumnChanged = function (column) {
                _objectLifetimeMarshalerProxy._call("columnSettingsChanged", column);
            };
            return ObjectLifetimeDAO;
        }());
        F1Viz.ObjectLifetimeDAO = ObjectLifetimeDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _processesMarshalerProxy = null;
        var ProcessesDAO = (function () {
            function ProcessesDAO(config) {
                this._config = config;
            }
            ProcessesDAO.create = function () {
                if (_processesMarshalerProxy === null) {
                    _processesMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.ProcessesMarshaler", {}, true);
                }
                return _processesMarshalerProxy._call("config")
                    .then(function (config) { return new ProcessesDAO(config); });
            };
            Object.defineProperty(ProcessesDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            ProcessesDAO.prototype.getHeader = function () {
                return _processesMarshalerProxy._call("header");
            };
            ProcessesDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                var processes = _processesMarshalerProxy._call("getProcesses");
                return processes
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (roots) {
                    var expands = roots.map(function (row) { return _this.expand(row, sortInfo); });
                    return Microsoft.Plugin.Promise.join(expands).then(function () { return roots; });
                })
                    .then(function (rows) { return _this.sort(rows, sortInfo); });
            };
            ProcessesDAO.prototype.expand = function (row, sortInfo) {
                var _this = this;
                var dataLoadPromise = Microsoft.Plugin.Promise.as(void 0);
                var treeRow = row;
                if (treeRow.expanded === null) {
                    return dataLoadPromise;
                }
                if (treeRow.children().length === 0) {
                    var children = treeRow.dto.c.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(treeRow, dto, _this._config.columns, treeRow.depth + 1); });
                    row.children(children);
                }
                treeRow.expanded(!treeRow.expanded());
                return dataLoadPromise;
            };
            ProcessesDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                var row = startingRow;
                return _processesMarshalerProxy._call("search", query, isCaseSensitive, isRegex, row ? row.dto.id : null, row ? !row.parent : null)
                    .then(function (ids) { return ids.map(function (id) { return { nodeId: id }; }); });
            };
            ProcessesDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                var sortChildren = function (element) {
                    if (element.children) {
                        element.children.sort(sortFunc);
                        element.children().forEach(sortChildren);
                    }
                };
                return _processesMarshalerProxy._call("sort", sortInfo.columnId, sortInfo.direction)
                    .then(function () {
                    roots.sort(sortFunc);
                    roots.forEach(sortChildren);
                    return roots;
                });
            };
            ProcessesDAO.prototype.getColumnSettings = function () {
                return _processesMarshalerProxy._call("columnSettings");
            };
            ProcessesDAO.prototype.onColumnChanged = function (column) {
                _processesMarshalerProxy._call("columnSettingsChanged", column);
            };
            return ProcessesDAO;
        }());
        F1Viz.ProcessesDAO = ProcessesDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        (function (CollectionMechanism) {
            CollectionMechanism[CollectionMechanism["Sampling"] = 0] = "Sampling";
            CollectionMechanism[CollectionMechanism["Instrumentation"] = 1] = "Instrumentation";
        })(F1Viz.CollectionMechanism || (F1Viz.CollectionMechanism = {}));
        var CollectionMechanism = F1Viz.CollectionMechanism;
        (function (ReportType) {
            ReportType[ReportType["Sampling"] = 0] = "Sampling";
            ReportType[ReportType["Instrumentation"] = 1] = "Instrumentation";
            ReportType[ReportType["Concurrency"] = 2] = "Concurrency";
            ReportType[ReportType["Memory"] = 3] = "Memory";
        })(F1Viz.ReportType || (F1Viz.ReportType = {}));
        var ReportType = F1Viz.ReportType;
        (function (TimeType) {
            TimeType[TimeType["CpuTicks"] = 0] = "CpuTicks";
            TimeType[TimeType["Milliseconds"] = 1] = "Milliseconds";
        })(F1Viz.TimeType || (F1Viz.TimeType = {}));
        var TimeType = F1Viz.TimeType;
        (function (AdditionalReportData) {
            AdditionalReportData[AdditionalReportData["Counters"] = 0] = "Counters";
            AdditionalReportData[AdditionalReportData["ObjectLifetime"] = 1] = "ObjectLifetime";
            AdditionalReportData[AdditionalReportData["TierInteractions"] = 2] = "TierInteractions";
        })(F1Viz.AdditionalReportData || (F1Viz.AdditionalReportData = {}));
        var AdditionalReportData = F1Viz.AdditionalReportData;
        var _reportMarshalerProxy = null;
        var ReportDAO = (function () {
            function ReportDAO() {
                if (_reportMarshalerProxy === null) {
                    _reportMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.ReportMarshaler", {}, true);
                }
            }
            ReportDAO.prototype.getReportSummary = function () {
                return _reportMarshalerProxy._call("reportSummary")
                    .then(function (dto) {
                    return {
                        collectionMechanism: dto.collectionMechanism,
                        type: dto.reportType,
                        totalTime: new F1Viz.JsonTimespan(new F1Viz.BigNumber(dto.totalTime.begin.h, dto.totalTime.begin.l), new F1Viz.BigNumber(dto.totalTime.end.h, dto.totalTime.end.l)),
                        displayTimeType: dto.displayTimeType,
                        isSerialized: dto.isSerialized,
                        additionalReportData: dto.additionalReportData
                    };
                });
            };
            ReportDAO.prototype.saveReport = function () {
                return _reportMarshalerProxy._call("saveReport");
            };
            ReportDAO.prototype.exportReport = function () {
                return _reportMarshalerProxy._call("exportReport");
            };
            ReportDAO.prototype.viewActivated = function (view) {
                return _reportMarshalerProxy._call("viewActivated", view);
            };
            ReportDAO.prototype.showSourceBrowser = function (show) {
                return _reportMarshalerProxy._call("showSourceBrowser", show);
            };
            return ReportDAO;
        }());
        F1Viz.ReportDAO = ReportDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var SortFunctions = (function () {
            function SortFunctions() {
            }
            SortFunctions.getSortFunc = function (columnId, columnConfig, sortDirection) {
                for (var index = 0; index < columnConfig.length; ++index) {
                    if (columnConfig[index].id === columnId) {
                        if (columnConfig[index].type === F1Viz.ColumnType.String) {
                            return SortFunctions.stringSortDto(index, sortDirection);
                        }
                        else {
                            return SortFunctions.numericSortDto(index, sortDirection);
                        }
                    }
                }
                var direction = sortDirection === F1Viz.SortDirection.Asc ? -1 : 1;
                return function (left, right) {
                    return direction;
                };
            };
            SortFunctions.numericSortDto = function (columnIndex, sortDirection) {
                var direction = sortDirection === F1Viz.SortDirection.Asc ? 1 : -1;
                return function (left, right) {
                    var leftValue = left.dto.d[columnIndex].v;
                    var rightValue = right.dto.d[columnIndex].v;
                    if (leftValue === rightValue) {
                        return 0;
                    }
                    return leftValue < rightValue ? -direction : direction;
                };
            };
            SortFunctions.stringSortDto = function (columnIndex, sortDirection) {
                var direction = sortDirection === F1Viz.SortDirection.Asc ? 1 : -1;
                return function (left, right) {
                    var leftValue = left.dto.d[columnIndex].v;
                    var rightValue = right.dto.d[columnIndex].v;
                    leftValue = leftValue.toUpperCase();
                    rightValue = rightValue.toUpperCase();
                    if (leftValue === rightValue) {
                        return 0;
                    }
                    return leftValue < rightValue ? -direction : direction;
                };
            };
            SortFunctions.numberComparator = function (left, right) {
                return left - right;
            };
            return SortFunctions;
        }());
        F1Viz.SortFunctions = SortFunctions;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _resourceThreadDetailsMarshalerProxy = null;
        var ResourceThreadDetailsDAO = (function () {
            function ResourceThreadDetailsDAO(config, pivot) {
                this._config = config;
                this._pivot = pivot;
            }
            ResourceThreadDetailsDAO.create = function (pivot) {
                if (_resourceThreadDetailsMarshalerProxy === null) {
                    _resourceThreadDetailsMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.ResourceThreadDetailsMarshaler", {}, true);
                }
                var configPromise = pivot === F1Viz.ResourceThreadPivot.Resource
                    ? _resourceThreadDetailsMarshalerProxy._call("resourcesConfig")
                    : _resourceThreadDetailsMarshalerProxy._call("threadConfig");
                return configPromise
                    .then(function (config) { return new ResourceThreadDetailsDAO(config, pivot); });
            };
            Object.defineProperty(ResourceThreadDetailsDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            ResourceThreadDetailsDAO.prototype.getHeader = function () {
                return this._pivot === F1Viz.ResourceThreadPivot.Resource
                    ? _resourceThreadDetailsMarshalerProxy._call("resourcesHeader")
                    : _resourceThreadDetailsMarshalerProxy._call("threadHeader");
            };
            ResourceThreadDetailsDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                if (!this._context) {
                    return Microsoft.Plugin.Promise.as([]);
                }
                var getRootsPromise = this._pivot === F1Viz.ResourceThreadPivot.Resource
                    ? _resourceThreadDetailsMarshalerProxy._call("getThreads", this._context)
                    : _resourceThreadDetailsMarshalerProxy._call("getResources", this._context);
                return getRootsPromise
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (roots) { return _this.sort(roots, sortInfo); });
            };
            ResourceThreadDetailsDAO.prototype.expand = function (row, sortInfo) {
                return null;
            };
            ResourceThreadDetailsDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                return null;
            };
            ResourceThreadDetailsDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                roots.sort(sortFunc);
                return Microsoft.Plugin.Promise.as(roots);
            };
            ResourceThreadDetailsDAO.prototype.getContextInfo = function (context) {
                return this._pivot === F1Viz.ResourceThreadPivot.Resource
                    ? _resourceThreadDetailsMarshalerProxy._call("getResourceInfo", context)
                    : _resourceThreadDetailsMarshalerProxy._call("getThreadInfo", context);
            };
            Object.defineProperty(ResourceThreadDetailsDAO.prototype, "context", {
                set: function (value) {
                    this._context = value;
                },
                enumerable: true,
                configurable: true
            });
            ResourceThreadDetailsDAO.prototype.getColumnSettings = function () {
                if (this._pivot === F1Viz.ResourceThreadPivot.Resource) {
                    return Microsoft.Plugin.Promise.as([
                        { columnId: "name", isHidden: false, width: 100 },
                        { columnId: "tid", isHidden: false, width: 100 },
                        { columnId: "ct", isHidden: false, width: 100 },
                        { columnId: "bt", isHidden: false, width: 100 },
                    ]);
                }
                else {
                    return Microsoft.Plugin.Promise.as([
                        { columnId: "name", isHidden: false, width: 100 },
                        { columnId: "ct", isHidden: false, width: 100 },
                        { columnId: "bt", isHidden: false, width: 100 },
                    ]);
                }
            };
            ResourceThreadDetailsDAO.prototype.onColumnChanged = function (column) {
            };
            return ResourceThreadDetailsDAO;
        }());
        F1Viz.ResourceThreadDetailsDAO = ResourceThreadDetailsDAO;
        var ContentionInstancesDAO = (function () {
            function ContentionInstancesDAO(config, pivot) {
                this._contentionContextKeys = [];
                this._config = config;
                this._pivot = pivot;
            }
            ContentionInstancesDAO.create = function (pivot) {
                if (_resourceThreadDetailsMarshalerProxy === null) {
                    _resourceThreadDetailsMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.ResourceThreadDetailsMarshaler", {}, true);
                }
                return _resourceThreadDetailsMarshalerProxy._call("contentionConfig")
                    .then(function (config) { return new ContentionInstancesDAO(config, pivot); });
            };
            Object.defineProperty(ContentionInstancesDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            ContentionInstancesDAO.prototype.getHeader = function () {
                return _resourceThreadDetailsMarshalerProxy._call("contentionHeader");
            };
            ContentionInstancesDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                if (!this._context || this._contentionContextKeys.length === 0) {
                    return Microsoft.Plugin.Promise.as([]);
                }
                var getRootsPromise = this._pivot === F1Viz.ResourceThreadPivot.Resource
                    ? _resourceThreadDetailsMarshalerProxy._call("getThreadContentions", this._context, this._contentionContextKeys)
                    : _resourceThreadDetailsMarshalerProxy._call("getResourceContentions", this._context, this._contentionContextKeys);
                return getRootsPromise
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (roots) { return _this.sort(roots, sortInfo); });
            };
            ContentionInstancesDAO.prototype.expand = function (row, sortInfo) {
                return null;
            };
            ContentionInstancesDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                return null;
            };
            ContentionInstancesDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                roots.sort(sortFunc);
                return Microsoft.Plugin.Promise.as(roots);
            };
            ContentionInstancesDAO.prototype.getCallStack = function (contentionId) {
                return _resourceThreadDetailsMarshalerProxy._call("getContentionCallStack", contentionId);
            };
            Object.defineProperty(ContentionInstancesDAO.prototype, "context", {
                set: function (value) {
                    this._context = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContentionInstancesDAO.prototype, "contentionContextKeys", {
                set: function (value) {
                    this._contentionContextKeys = value;
                },
                enumerable: true,
                configurable: true
            });
            ContentionInstancesDAO.prototype.clearCache = function () {
                return _resourceThreadDetailsMarshalerProxy._call("clearCache");
            };
            ContentionInstancesDAO.prototype.getColumnSettings = function () {
                return Microsoft.Plugin.Promise.as([
                    { columnId: "s", isHidden: false, width: 100 },
                    { columnId: "el", isHidden: false, width: 100 },
                    { columnId: "e", isHidden: false, width: 100 },
                    { columnId: "r", isHidden: true, width: 100 },
                    { columnId: "tn", isHidden: true, width: 100 },
                    { columnId: "ctid", isHidden: true, width: 100 }
                ]);
            };
            ContentionInstancesDAO.prototype.onColumnChanged = function (column) {
            };
            return ContentionInstancesDAO;
        }());
        F1Viz.ContentionInstancesDAO = ContentionInstancesDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _summaryMarshalerProxy = null;
        var SummaryDAO = (function () {
            function SummaryDAO() {
                if (_summaryMarshalerProxy === null) {
                    _summaryMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.SummaryMarshaler", {}, true);
                }
            }
            SummaryDAO.prototype.isJmcEnabled = function () {
                return _summaryMarshalerProxy._call("isJmcEnabled");
            };
            SummaryDAO.prototype.toggleJmc = function () {
                return _summaryMarshalerProxy._call("toggleJmc");
            };
            SummaryDAO.prototype.timeFilter = function () {
                return _summaryMarshalerProxy._call("timeFilter")
                    .then(function (dto) {
                    if (!dto) {
                        return null;
                    }
                    return new F1Viz.JsonTimespan(new F1Viz.BigNumber(dto.begin.h, dto.begin.l), new F1Viz.BigNumber(dto.end.h, dto.end.l));
                });
            };
            SummaryDAO.prototype.getMetricTotal = function () {
                return _summaryMarshalerProxy._call("metricTotal");
            };
            SummaryDAO.prototype.getHotPathData = function () {
                return _summaryMarshalerProxy._call("hotPathData");
            };
            SummaryDAO.prototype.getFunctionsListData = function () {
                return _summaryMarshalerProxy._call("functionsListData");
            };
            SummaryDAO.prototype.getResourcesListData = function () {
                return _summaryMarshalerProxy._call("resourcesListData");
            };
            SummaryDAO.prototype.getThreadsListData = function () {
                return _summaryMarshalerProxy._call("threadsListData");
            };
            SummaryDAO.prototype.getTypesMemoryListData = function () {
                return _summaryMarshalerProxy._call("typesMemoryListData");
            };
            SummaryDAO.prototype.getTypesInstancesListData = function () {
                return _summaryMarshalerProxy._call("typesInstancesListData");
            };
            SummaryDAO.prototype.getSummaryGraphData = function () {
                return _summaryMarshalerProxy._call("summaryGraphData");
            };
            SummaryDAO.prototype.containsData = function () {
                return _summaryMarshalerProxy._call("containsData");
            };
            SummaryDAO.prototype.haveViewGuidance = function () {
                return _summaryMarshalerProxy._call("haveViewGuidance");
            };
            SummaryDAO.prototype.haveMarks = function () {
                return _summaryMarshalerProxy._call("haveMarks");
            };
            SummaryDAO.prototype.showGuidance = function () {
                _summaryMarshalerProxy._call("showGuidance");
            };
            SummaryDAO.prototype.compareReports = function () {
                _summaryMarshalerProxy._call("compareReports");
            };
            SummaryDAO.prototype.toggleFullscreen = function () {
                _summaryMarshalerProxy._call("toggleFullscreen");
            };
            SummaryDAO.prototype.showSymbolsOptions = function () {
                _summaryMarshalerProxy._call("showSymbolsOptions");
            };
            SummaryDAO.prototype.saveAnalyzedReport = function () {
                _summaryMarshalerProxy._call("saveAnalyzedReport");
            };
            SummaryDAO.prototype.viewSource = function (filePath, lineNumber) {
                _summaryMarshalerProxy._call("viewSource", filePath, lineNumber);
            };
            SummaryDAO.prototype.setTimeFilter = function (selection) {
                if (selection) {
                    return _summaryMarshalerProxy._call("setTimeFilter", selection.begin.jsonValue, selection.end.jsonValue);
                }
                else {
                    return _summaryMarshalerProxy._call("setTimeFilter", null, null);
                }
            };
            return SummaryDAO;
        }());
        F1Viz.SummaryDAO = SummaryDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var _tierInteractionsMarshalerProxy = null;
        var TierInteractionsDAO = (function () {
            function TierInteractionsDAO(config) {
                this._config = config;
            }
            TierInteractionsDAO.create = function () {
                if (_tierInteractionsMarshalerProxy === null) {
                    _tierInteractionsMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.TierInteractionsMarshaler", {}, true);
                }
                return _tierInteractionsMarshalerProxy._call("configInteraction")
                    .then(function (config) { return new TierInteractionsDAO(config); });
            };
            Object.defineProperty(TierInteractionsDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            TierInteractionsDAO.prototype.getHeader = function () {
                return _tierInteractionsMarshalerProxy._call("headerInteraction");
            };
            TierInteractionsDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                return _tierInteractionsMarshalerProxy._call("getRoots")
                    .then(function (dtos) { return dtos.map(function (dto) {
                    return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0);
                }); })
                    .then(function (roots) { return _this.sort(roots, sortInfo); });
            };
            TierInteractionsDAO.prototype.expand = function (row, sortInfo) {
                var _this = this;
                var dataLoadPromise = Microsoft.Plugin.Promise.as(void 0);
                if (row.expanded === null) {
                    return dataLoadPromise;
                }
                var treeRow = row;
                if (treeRow.children().length === 0) {
                    dataLoadPromise = _tierInteractionsMarshalerProxy._call("getChildren", treeRow.id)
                        .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(treeRow, dto, _this._config.columns, treeRow.depth + 1); }); })
                        .then(function (children) { return _this.sort(children, sortInfo); })
                        .then(function (sortedChildren) { return treeRow.children(sortedChildren); });
                }
                return dataLoadPromise.then(function () { return treeRow.expanded(!treeRow.expanded()); });
            };
            TierInteractionsDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                return null;
            };
            TierInteractionsDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                var sortChildren = function (element) {
                    if (element.children) {
                        element.children.sort(sortFunc);
                        element.children().forEach(sortChildren);
                    }
                };
                roots.sort(sortFunc);
                roots.forEach(sortChildren);
                return Microsoft.Plugin.Promise.as(roots);
            };
            TierInteractionsDAO.prototype.showHelp = function () {
                return _tierInteractionsMarshalerProxy._call("showHelp");
            };
            TierInteractionsDAO.prototype.getColumnSettings = function () {
                return _tierInteractionsMarshalerProxy._call("columnSettingsInteraction");
            };
            TierInteractionsDAO.prototype.onColumnChanged = function (column) {
                _tierInteractionsMarshalerProxy._call("columnSettingsChangedInteraction", column);
            };
            return TierInteractionsDAO;
        }());
        F1Viz.TierInteractionsDAO = TierInteractionsDAO;
        var DatabaseCommandsDAO = (function () {
            function DatabaseCommandsDAO(config) {
                this._config = config;
            }
            DatabaseCommandsDAO.create = function () {
                if (_tierInteractionsMarshalerProxy === null) {
                    _tierInteractionsMarshalerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.PerformanceTools.TierInteractionsMarshaler", {}, true);
                }
                return _tierInteractionsMarshalerProxy._call("configDatabase")
                    .then(function (config) { return new DatabaseCommandsDAO(config); });
            };
            Object.defineProperty(DatabaseCommandsDAO.prototype, "defaultSortColumn", {
                get: function () {
                    return this._config.defaultSortColumn;
                },
                enumerable: true,
                configurable: true
            });
            DatabaseCommandsDAO.prototype.getHeader = function () {
                return _tierInteractionsMarshalerProxy._call("headerDatabase");
            };
            DatabaseCommandsDAO.prototype.getRoots = function (resultId, sortInfo) {
                var _this = this;
                if (!this._tierInteraction || !this._tierInteraction.parent) {
                    return Microsoft.Plugin.Promise.as([]);
                }
                return _tierInteractionsMarshalerProxy._call("getConnectionDetails", this._tierInteraction.id)
                    .then(function (dtos) { return dtos.map(function (dto) { return new F1Viz.DynamicTreeRowViewModel(null, dto, _this._config.columns, 0); }); })
                    .then(function (roots) { return _this.sort(roots, sortInfo); });
            };
            DatabaseCommandsDAO.prototype.expand = function (row, sortInfo) {
                return null;
            };
            DatabaseCommandsDAO.prototype.search = function (query, isCaseSensitive, isRegex, startingRow, sortInfo) {
                return null;
            };
            DatabaseCommandsDAO.prototype.sort = function (roots, sortInfo) {
                var sortFunc = F1Viz.SortFunctions.getSortFunc(sortInfo.columnId, this._config.columns, sortInfo.direction);
                roots.sort(sortFunc);
                return Microsoft.Plugin.Promise.as(roots);
            };
            DatabaseCommandsDAO.prototype.getColumnSettings = function () {
                return _tierInteractionsMarshalerProxy._call("columnSettingsDatabase");
            };
            DatabaseCommandsDAO.prototype.onColumnChanged = function (column) {
                _tierInteractionsMarshalerProxy._call("columnSettingsChangedDatabase", column);
            };
            Object.defineProperty(DatabaseCommandsDAO.prototype, "tierInteraction", {
                set: function (value) {
                    this._tierInteraction = value;
                },
                enumerable: true,
                configurable: true
            });
            DatabaseCommandsDAO.prototype.viewCommandText = function (commandText) {
                return _tierInteractionsMarshalerProxy._call("viewCommandText", commandText);
            };
            return DatabaseCommandsDAO;
        }());
        F1Viz.DatabaseCommandsDAO = DatabaseCommandsDAO;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var ColumnResizer = (function () {
            function ColumnResizer(headerColumn, header, tableColumn, table, columnConfig, columnProvider) {
                this._resizedEvent = new F1Viz.AggregatedEvent();
                this._leftOffset = null;
                this._columnWidth = null;
                this._initialX = null;
                this._initialHeaderWidth = null;
                this._minWidth = null;
                this._hidden = false;
                this._headerColumn = headerColumn;
                this._header = header;
                this._tableColumn = tableColumn;
                this._table = table;
                this._minWidth = 40;
                this._columnWidth = columnConfig.width;
                this._id = columnConfig.columnId;
                this._hidden = false;
                this._columnProvider = columnProvider;
                this._resizer = document.createElement("div");
                this._resizer.classList.add("columnResizer");
                this._resizer.style.width = this.width + "px";
                this._resizer.onmousedown = this.onMouseDown.bind(this);
                this._resizer.onmousemove = this.onMouseMove.bind(this);
                this._resizer.onmouseup = this.onMouseUp.bind(this);
                this._headerColumn.style.width = this._columnWidth + "px";
                this._tableColumn.style.width = this._columnWidth + "px";
                this._header.parentElement.insertAdjacentElement("afterBegin", this._resizer);
            }
            Object.defineProperty(ColumnResizer.prototype, "width", {
                get: function () {
                    return 8;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnResizer.prototype, "columnConfig", {
                get: function () {
                    return {
                        columnId: this._id,
                        isHidden: this._hidden,
                        width: this._columnWidth,
                    };
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnResizer.prototype, "resizedEvent", {
                get: function () {
                    return this._resizedEvent;
                },
                enumerable: true,
                configurable: true
            });
            ColumnResizer.prototype.dispose = function () {
                this._resizedEvent.dispose();
            };
            ColumnResizer.prototype.onColumnVisiblityChanged = function (visible) {
                if (this._hidden !== visible) {
                    return;
                }
                this._hidden = !visible;
                var delta = this._hidden ? -this._columnWidth : this._columnWidth;
                var headerWidth = parseInt(this._header.style.width.slice(0, -2));
                this._header.style.width = (headerWidth + delta) + "px";
                this._table.style.width = (headerWidth + delta) + "px";
                this._resizer.style.display = this._hidden ? "none" : "";
                if (this._hidden && document.activeElement === this._headerColumn) {
                    this._headerColumn.parentElement.focus();
                }
                this._resizedEvent.invokeEvent(this);
            };
            ColumnResizer.prototype.resetLocation = function () {
                this._leftOffset = this._headerColumn.offsetLeft + this._headerColumn.offsetWidth - Math.floor(this.width / 2);
                this._resizer.style.left = this._leftOffset + "px";
            };
            ColumnResizer.prototype.changeWidth = function (delta, isIntermittent) {
                var width = Math.max(this._columnWidth + delta, this._minWidth);
                var clampedDelta = width - this._columnWidth;
                this._header.style.width = (this._initialHeaderWidth + clampedDelta) + "px";
                this._headerColumn.style.width = (this._columnWidth + clampedDelta) + "px";
                this._resizer.style.left = (this._leftOffset + clampedDelta) + "px";
                this._resizedEvent.invokeEvent(this);
                if (!isIntermittent) {
                    this._table.style.width = (this._initialHeaderWidth + clampedDelta) + "px";
                    this._tableColumn.style.width = (this._columnWidth + clampedDelta) + "px";
                    this._columnWidth += clampedDelta;
                    this._leftOffset += clampedDelta;
                    this._columnProvider.onColumnChanged(this.columnConfig);
                }
            };
            ColumnResizer.prototype.onMouseDown = function (event) {
                if (this._initialX !== null) {
                    this.onMouseUp(event);
                    return;
                }
                this._initialX = event.clientX;
                this._initialHeaderWidth = parseInt(this._header.style.width.slice(0, -2));
                F1Viz.Utilities.setCapture(this._resizer);
            };
            ColumnResizer.prototype.onMouseMove = function (event) {
                if (this._initialX === null) {
                    return;
                }
                this.changeWidth(event.clientX - this._initialX, true);
            };
            ColumnResizer.prototype.onMouseUp = function (event) {
                if (this._initialX === null) {
                    return;
                }
                F1Viz.Utilities.releaseCapture(this._resizer);
                this.changeWidth(event.clientX - this._initialX, false);
                this._initialX = null;
                this._initialHeaderWidth = null;
            };
            return ColumnResizer;
        }());
        F1Viz.ColumnResizer = ColumnResizer;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var TreeGridHeaderViewModel = (function () {
            function TreeGridHeaderViewModel(columns, columnSettingsProvider, initialSortColumnId) {
                var _this = this;
                this._hiddenColumns = ko.observableArray([]);
                this._resizers = {};
                this._syncScrollBoundFunction = this.syncScroll.bind(this);
                this._sortDirection = ko.observable(F1Viz.SortDirection.Desc);
                this._columnOrder = ko.observableArray([]);
                this._isResizing = false;
                this._delta = 0;
                this._columnConfigLoadStatus = ko.observable(F1Viz.DataLoadEvent.DataLoadStart);
                this._sortInfo = ko.pureComputed(function () {
                    return {
                        columnId: _this._sortColumnId(),
                        direction: _this._sortDirection()
                    };
                });
                this._columns = columns;
                this._columnSettingsProvider = columnSettingsProvider;
                this._sortColumnId = ko.observable(initialSortColumnId);
                this._columnOrder(columns.map(function (column) { return column.id; }));
            }
            Object.defineProperty(TreeGridHeaderViewModel.prototype, "visibilityContextMenuBinding", {
                get: function () {
                    return {
                        hiddenColumns: this._hiddenColumns,
                        columns: this._columns
                            .filter(function (column) { return column.hideable; })
                            .map(function (column) { return {
                            id: column.id,
                            text: column.text
                        }; })
                    };
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridHeaderViewModel.prototype, "columns", {
                get: function () {
                    return this._columns;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridHeaderViewModel.prototype, "hiddenColumns", {
                get: function () {
                    return this._hiddenColumns;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridHeaderViewModel.prototype, "columnOrder", {
                get: function () {
                    return this._columnOrder;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridHeaderViewModel.prototype, "sortInfo", {
                get: function () {
                    return this._sortInfo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridHeaderViewModel.prototype, "sortColumnId", {
                get: function () {
                    return this._sortColumnId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridHeaderViewModel.prototype, "sortDirection", {
                get: function () {
                    return this._sortDirection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridHeaderViewModel.prototype, "columnConfigLoadStatus", {
                get: function () {
                    return this._columnConfigLoadStatus;
                },
                enumerable: true,
                configurable: true
            });
            TreeGridHeaderViewModel.prototype.onAfterDomInsert = function (headerContainer, bodyContainer) {
                var _this = this;
                this._headerContainer = headerContainer;
                this._bodyContainer = bodyContainer;
                this._header = this._headerContainer.querySelector("table");
                this._body = this._bodyContainer.querySelector("table");
                var headerRow = this._headerContainer.querySelector("tr");
                headerRow.tabIndex = 0;
                headerRow.onkeydown = this.onKeyDownHeader.bind(this, headerRow);
                headerRow.onkeyup = this.onKeyUpHeader.bind(this, headerRow);
                var tableWidth = 0;
                this._resizers = {};
                var columnsToHide = [];
                return this._columnSettingsProvider.getColumnSettings()
                    .done(function (columnSettings) {
                    columnSettings.forEach(function (column) {
                        var headerColumn = _this._header.querySelector("th[data-columnid='" + column.columnId + "']");
                        headerColumn.tabIndex = -1;
                        var tableColumn = _this._body.querySelector("th[data-columnid='" + column.columnId + "']");
                        var resizer = new F1Viz.ColumnResizer(headerColumn, _this._header, tableColumn, _this._body, column, _this._columnSettingsProvider);
                        _this._resizers[column.columnId] = resizer;
                        tableWidth += column.width;
                        if (column.isHidden) {
                            columnsToHide.push(column.columnId);
                        }
                        resizer.resizedEvent.addEventListener(function () { return _this.adjustResizerLocation(); });
                    });
                    _this._header.style.width = tableWidth + "px";
                    _this._body.style.width = tableWidth + "px";
                    _this.adjustResizerLocation();
                    window.addEventListener("resize", _this._syncScrollBoundFunction);
                    _this._bodyContainer.addEventListener("scroll", _this._syncScrollBoundFunction);
                    var headerOnScroll = function () {
                        _this._bodyContainer.scrollLeft = _this._headerContainer.scrollLeft;
                    };
                    _this._headerContainer.addEventListener("scroll", headerOnScroll);
                    var subscriptions = [
                        _this._hiddenColumns.subscribe(_this.onHiddenColumnsChanged.bind(_this), null, "arrayChange"),
                        _this._columnOrder.subscribe(function () { return _this.adjustResizerLocation(); })
                    ];
                    ko.utils.domNodeDisposal.addDisposeCallback(_this._bodyContainer, function () {
                        window.removeEventListener("resize", _this._syncScrollBoundFunction);
                        _this._bodyContainer.removeEventListener("scroll", _this._syncScrollBoundFunction);
                        _this._headerContainer.removeEventListener("scroll", headerOnScroll);
                        subscriptions.forEach(function (s) { return s.dispose(); });
                        _this._hiddenColumns.removeAll();
                        for (var id in _this._resizers) {
                            _this._resizers[id].dispose();
                        }
                    });
                    _this._hiddenColumns(columnsToHide);
                    _this._columnConfigLoadStatus(F1Viz.DataLoadEvent.DataLoadCompleted);
                });
            };
            TreeGridHeaderViewModel.prototype.syncScroll = function () {
                var width = this._bodyContainer.clientWidth;
                var scroll = this._bodyContainer.scrollLeft;
                this._headerContainer.style.width = width + "px";
                this._headerContainer.scrollLeft = scroll;
            };
            TreeGridHeaderViewModel.prototype.onHiddenColumnsChanged = function (changes) {
                var _this = this;
                changes.forEach(function (change) {
                    if (change.status === "added") {
                        var resizer = _this._resizers[change.value];
                        resizer.onColumnVisiblityChanged(false);
                        _this._columnSettingsProvider.onColumnChanged(resizer.columnConfig);
                    }
                    else if (change.status === "deleted") {
                        var resizer = _this._resizers[change.value];
                        resizer.onColumnVisiblityChanged(true);
                        _this._columnSettingsProvider.onColumnChanged(resizer.columnConfig);
                    }
                });
            };
            TreeGridHeaderViewModel.prototype.onKeyDownHeader = function (header, event) {
                this._isResizing = false;
                if (event.ctrlKey && !event.shiftKey && event.keyCode === F1Viz.Common.KeyCodes.Ctrl) {
                    this._isResizing = true;
                    return;
                }
                if (event.keyCode !== F1Viz.Common.KeyCodes.ArrowLeft && event.keyCode !== F1Viz.Common.KeyCodes.ArrowRight) {
                    return;
                }
                else if (event.shiftKey || event.ctrlKey) {
                    return;
                }
                else if (document.activeElement !== header && !header.contains(document.activeElement)) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                if (this._isResizing) {
                    if (document.activeElement !== header) {
                        this._delta += event.keyCode === F1Viz.Common.KeyCodes.ArrowRight ? 4 : -4;
                        this.resizeActiveColumnHeader(true);
                    }
                    return;
                }
                var isColumnHidden = function (element) { return element.offsetHeight === 0; };
                var nextElement;
                if (event.keyCode === F1Viz.Common.KeyCodes.ArrowRight) {
                    nextElement = document.activeElement === header || document.activeElement.nextElementSibling === null ?
                        header.firstElementChild :
                        document.activeElement.nextElementSibling;
                    for (var i = 0; isColumnHidden(nextElement) && i < this._columns.length; ++i) {
                        nextElement = nextElement.nextElementSibling !== null ?
                            nextElement.nextElementSibling :
                            header.firstElementChild;
                    }
                }
                else {
                    nextElement = document.activeElement === header || document.activeElement.previousElementSibling === null ?
                        header.lastElementChild :
                        document.activeElement.previousElementSibling;
                    for (var i = 0; isColumnHidden(nextElement) && i < this._columns.length; ++i) {
                        nextElement = nextElement.previousElementSibling !== null ?
                            nextElement.previousElementSibling :
                            header.lastElementChild;
                    }
                }
                nextElement.focus();
            };
            TreeGridHeaderViewModel.prototype.onKeyUpHeader = function (header, event) {
                if (!this._isResizing) {
                    return;
                }
                this._isResizing = event.ctrlKey;
                event.preventDefault();
                event.stopPropagation();
                this.resizeActiveColumnHeader(false);
                this._delta = 0;
            };
            TreeGridHeaderViewModel.prototype.resizeActiveColumnHeader = function (isIntermittent) {
                var colId = document.activeElement.getAttribute("data-columnid");
                if (!colId) {
                    return;
                }
                this._resizers[colId].changeWidth(this._delta, isIntermittent);
            };
            TreeGridHeaderViewModel.prototype.adjustResizerLocation = function () {
                var _this = this;
                ko.tasks.runEarly();
                ko.tasks.schedule(function () {
                    for (var id in _this._resizers) {
                        _this._resizers[id].resetLocation();
                    }
                });
            };
            return TreeGridHeaderViewModel;
        }());
        F1Viz.TreeGridHeaderViewModel = TreeGridHeaderViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var TreeGridUtils = (function () {
            function TreeGridUtils() {
            }
            TreeGridUtils.expandAll = function (treeGrid, dao) {
                var expandAll = function (element) {
                    if (element.expanded === null) {
                        return;
                    }
                    var expandPromise = element.expanded()
                        ? Microsoft.Plugin.Promise.as(void 0)
                        : dao.expand(element, treeGrid.header.sortInfo());
                    expandPromise.then(function () {
                        element.children().forEach(expandAll);
                    });
                };
                treeGrid.selectedRows([]);
                ko.tasks.runEarly();
                treeGrid.roots().forEach(expandAll);
            };
            TreeGridUtils.expandSelection = function (treeGrid, dao) {
                var expandAll = function (element) {
                    if (element.expanded === null) {
                        return;
                    }
                    var expandPromise = element.expanded()
                        ? Microsoft.Plugin.Promise.as(void 0)
                        : dao.expand(element, treeGrid.header.sortInfo());
                    expandPromise.then(function () {
                        element.children().forEach(expandAll);
                    });
                };
                var selectedElements = treeGrid.selectedRows().map(function (index) { return treeGrid.treeAsArray()[index]; });
                treeGrid.selectedRows([]);
                ko.tasks.runEarly();
                selectedElements.forEach(expandAll);
            };
            TreeGridUtils.collapseAll = function (treeGrid) {
                var collapseAll = function (element) {
                    if (element.expanded !== null) {
                        element.expanded(false);
                        element.children().forEach(collapseAll);
                    }
                };
                treeGrid.selectedRows([]);
                ko.tasks.runEarly();
                treeGrid.roots().forEach(collapseAll);
            };
            TreeGridUtils.collapseSelected = function (treeGrid) {
                var collapseAll = function (element) {
                    if (element.expanded !== null) {
                        element.expanded(false);
                        element.children().forEach(collapseAll);
                    }
                };
                var selectedElements = treeGrid.selectedRows().map(function (index) { return treeGrid.treeAsArray()[index]; });
                treeGrid.selectedRows([]);
                ko.tasks.runEarly();
                selectedElements.forEach(collapseAll);
            };
            TreeGridUtils.selectParentsOfFocusedRow = function (treeGrid) {
                var currentRowIndex = treeGrid.focusedRowIndex();
                if (currentRowIndex === -1) {
                    return;
                }
                var currentRow = treeGrid.treeAsArray()[currentRowIndex];
                while (currentRow.parent) {
                    currentRowIndex = treeGrid.treeAsArray().lastIndexOf(currentRow.parent, currentRowIndex);
                    if (currentRowIndex === -1) {
                        break;
                    }
                    treeGrid.selectedRows.push(currentRowIndex);
                    currentRow = treeGrid.treeAsArray()[currentRowIndex];
                }
            };
            TreeGridUtils.formatTreeGridSelectedToText = function (treeGrid, showDiscontiguousBreaks) {
                if (showDiscontiguousBreaks === void 0) { showDiscontiguousBreaks = true; }
                var selectedIndexes = treeGrid.selectedRows().sort(F1Viz.SortFunctions.numberComparator);
                var isColumnHidden = {};
                treeGrid.header.hiddenColumns().forEach(function (columnId) { return isColumnHidden[columnId] = true; });
                var formattedSelection = "";
                var renderedTreeGridCopy = document.createDocumentFragment();
                ko.renderTemplate("CopyTreeGridView", treeGrid, {}, renderedTreeGridCopy, "replaceChildren");
                var headerColumns = renderedTreeGridCopy.querySelectorAll("th");
                var delimiter = "";
                for (var column = 0; column < headerColumns.length; ++column) {
                    var columnElement = headerColumns[column];
                    var columnId = columnElement.getAttribute("data-columnid");
                    if (isColumnHidden[columnId]) {
                        continue;
                    }
                    formattedSelection += delimiter;
                    formattedSelection += columnElement.innerText;
                    delimiter = "\t";
                }
                var previousIndex = -1;
                var metadata = renderedTreeGridCopy.querySelectorAll("tbody > tr.copy-metadata");
                var rows = renderedTreeGridCopy.querySelectorAll("tbody > tr:not(.copy-metadata)");
                for (var rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
                    var row = rows[rowIndex];
                    formattedSelection += TreeGridUtils.NewLine;
                    var index = treeGrid.selectedRows()[rowIndex];
                    if (showDiscontiguousBreaks && previousIndex !== -1 && previousIndex + 1 !== index) {
                        formattedSelection += "[...]" + TreeGridUtils.NewLine;
                    }
                    var metadataCells = metadata[rowIndex].querySelectorAll("td");
                    for (var i = 0; i < metadataCells.length; ++i) {
                        formattedSelection += metadataCells[i].innerText;
                    }
                    var cells = row.querySelectorAll("td");
                    var cellDelimiter = "";
                    for (var columnIndex = 0; columnIndex < cells.length; ++columnIndex) {
                        var columnElement = cells[columnIndex];
                        var columnId = columnElement.getAttribute("data-columnid");
                        if (isColumnHidden[columnId]) {
                            continue;
                        }
                        formattedSelection += cellDelimiter;
                        formattedSelection += columnElement.innerText.replace(/^\s+|\s+$/g, '');
                        cellDelimiter = "\t";
                    }
                    previousIndex = index;
                }
                return formattedSelection;
            };
            TreeGridUtils.NewLine = "\r\n";
            return TreeGridUtils;
        }());
        F1Viz.TreeGridUtils = TreeGridUtils;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var TreeGridViewModel = (function () {
            function TreeGridViewModel(dao, header, ariaLabelToken) {
                var _this = this;
                this._roots = ko.observableArray([]);
                this._treeAsArrayProjection = ko.pureComputed(function () { return _this.computeTreeAsArrayProjection(); });
                this._selectedRows = ko.observableArray([]);
                this._focusedRowIndex = ko.pureComputed(function () { return _this.computedFocusedRowIndex(); });
                this._focusedRow = ko.pureComputed(function () { return _this.computeFocusedRow(); });
                this._scrollTop = ko.observable(0);
                this._clientHeight = ko.observable(0);
                this._logger = F1Viz.getLogger();
                this._dataLoadStatus = ko.observable(F1Viz.DataLoadEvent.DataLoadCompleted);
                this._dao = dao;
                this._header = header;
                this._ariaLabelToken = ariaLabelToken;
                this._header.sortInfo.subscribe(this.onSortChanged.bind(this));
                this._selectedRows.subscribe(this.onSelectionChanged.bind(this), null, "arrayChange");
                this.loadDataOperation(function () { return _this._dao.getRoots(0, _this._header.sortInfo()); });
            }
            Object.defineProperty(TreeGridViewModel.prototype, "dataLoadPromise", {
                get: function () {
                    return !this._dataLoadPromise ?
                        Microsoft.Plugin.Promise.as(void (0)) : this._dataLoadPromise;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "roots", {
                get: function () {
                    return this._roots;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "treeAsArray", {
                get: function () {
                    return this._treeAsArrayProjection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "selectedRows", {
                get: function () {
                    return this._selectedRows;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "header", {
                get: function () {
                    return this._header;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "ariaLabelToken", {
                get: function () {
                    return this._ariaLabelToken;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "scrollTop", {
                get: function () {
                    return this._scrollTop;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "clientHeight", {
                get: function () {
                    return this._clientHeight;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "dataLoadStatus", {
                get: function () {
                    return this._dataLoadStatus;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "focusedRowIndex", {
                get: function () {
                    return this._focusedRowIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeGridViewModel.prototype, "focusedRow", {
                get: function () {
                    return this._focusedRow;
                },
                enumerable: true,
                configurable: true
            });
            TreeGridViewModel.prototype.reloadData = function () {
                var _this = this;
                this.loadDataOperation(function () { return _this._dao.getRoots(0, _this._header.sortInfo()); });
            };
            TreeGridViewModel.prototype.onAfterDomInsert = function (elements, viewModel) {
                var element = elements[0];
                var header = element.querySelector(".treeGridHeader");
                var body = element.querySelector(".treeGridBody");
                viewModel._header.onAfterDomInsert(header, body);
                var updateCachedSizes = function () {
                    viewModel._scrollTop(body.scrollTop);
                    viewModel._clientHeight(body.clientHeight);
                };
                updateCachedSizes();
                var onResizeBoundFunction = F1Viz.eventThrottler(updateCachedSizes, F1Viz.Constants.WindowResizeThrottle);
                body.addEventListener("scroll", updateCachedSizes);
                window.addEventListener("resize", onResizeBoundFunction);
                ko.utils.domNodeDisposal.addDisposeCallback(body, function () {
                    body.removeEventListener("scroll", updateCachedSizes);
                    window.removeEventListener("resize", onResizeBoundFunction);
                });
            };
            TreeGridViewModel.prototype.onSortChanged = function (sortInfo) {
                var _this = this;
                this.loadDataOperation(function () { return _this._dao.sort(_this._roots(), sortInfo); });
            };
            TreeGridViewModel.prototype.search = function (query, isCaseSensitive, isRegex) {
                var _this = this;
                if (this._dataLoadPromise) {
                    this._logger.error("Trying to search while loading data, this should not happen");
                    return Microsoft.Plugin.Promise.as(false);
                }
                if (!query) {
                    return Microsoft.Plugin.Promise.as(false);
                }
                var currentNode = null;
                var currentChildren = this._roots();
                var expandSearch = function (result) {
                    var nodeToExpand = result.shift();
                    for (var nodeIndex = 0; nodeIndex < currentChildren.length; ++nodeIndex) {
                        currentNode = currentChildren[nodeIndex];
                        if (currentNode.id === nodeToExpand.nodeId) {
                            currentChildren = currentNode.children ? currentNode.children() : [];
                            break;
                        }
                    }
                    if (result.length > 0) {
                        if (!currentNode.expanded()) {
                            return _this._dao.expand(currentNode, _this._header.sortInfo())
                                .then(function () { return currentChildren = currentNode.children(); })
                                .then(function () { return expandSearch(result); });
                        }
                        else {
                            return expandSearch(result);
                        }
                    }
                    else {
                        ko.tasks.schedule(function () {
                            var indexToSelect = _this._treeAsArrayProjection().indexOf(currentNode);
                            _this._selectedRows([indexToSelect]);
                        });
                        return Microsoft.Plugin.Promise.as(true);
                    }
                };
                var processSearchResult = function (result) {
                    if (result.length > 0) {
                        return expandSearch(result);
                    }
                    if (_this._selectedRows().length === 0) {
                        window.alert(Microsoft.Plugin.Resources.getString("Message_SearchNoMatches"));
                        return Microsoft.Plugin.Promise.as(false);
                    }
                    return Microsoft.Plugin.Promise.as(window.confirm(Microsoft.Plugin.Resources.getString("Message_SearchStartFromTop")))
                        .then(function (startFromTop) {
                        if (!startFromTop) {
                            return Microsoft.Plugin.Promise.as(false);
                        }
                        _this._selectedRows([]);
                        return _this._dao.search(query, isCaseSensitive, isRegex, null, _this._header.sortInfo())
                            .then(processSearchResult);
                    });
                };
                this._dataLoadPromise = this._dao.search(query, isCaseSensitive, isRegex, this.focusedRow(), this._header.sortInfo())
                    .then(processSearchResult);
                this._dataLoadPromise.done(function () { return _this._dataLoadPromise = null; }, function (error) {
                    _this._dataLoadPromise = null;
                    _this._logger.error("Tree grid search failed");
                    if (isRegex) {
                        window.alert(Microsoft.Plugin.Resources.getString("Message_InvalidRegularExpression"));
                    }
                });
                return this._dataLoadPromise;
            };
            TreeGridViewModel.prototype.onClick = function (viewModel, event) {
                var _this = this;
                if (event.which !== F1Viz.Common.MouseCodes.Left) {
                    return;
                }
                var context = ko.contextFor(event.target);
                if (!context || context.$data === this) {
                    return;
                }
                var row = context.$data;
                var rowIndex = this._treeAsArrayProjection().indexOf(row);
                if (event.target.classList && event.target.classList.contains("treeGridRow-expander")) {
                    this._selectedRows([rowIndex]);
                    ko.tasks.runEarly();
                    this._dao.expand(row, this._header.sortInfo());
                }
                else if (event.ctrlKey) {
                    var selectedIndex = this._selectedRows().indexOf(rowIndex);
                    if (selectedIndex === -1) {
                        this._selectedRows.push(rowIndex);
                    }
                    else {
                        this._selectedRows.splice(selectedIndex, 1);
                    }
                }
                else if (event.shiftKey) {
                    var start = Math.max(Math.min(this.focusedRowIndex(), rowIndex), 0);
                    var end = Math.max(this.focusedRowIndex(), rowIndex);
                    var initialSelection = this._selectedRows();
                    var selectionToAdd = [];
                    for (var indexToSelect = start; indexToSelect <= end; ++indexToSelect) {
                        if (initialSelection.indexOf(indexToSelect) === -1) {
                            selectionToAdd.push(indexToSelect);
                        }
                    }
                    if (this.focusedRowIndex() > rowIndex) {
                        selectionToAdd.reverse();
                    }
                    selectionToAdd.forEach(function (selection) { return _this._selectedRows.push(selection); });
                }
                else {
                    this._selectedRows([rowIndex]);
                }
            };
            TreeGridViewModel.prototype.onDblClick = function (viewModel, event) {
                if (event.which !== F1Viz.Common.MouseCodes.Left) {
                    return;
                }
                var context = ko.contextFor(event.target);
                if (event.target.classList && event.target.classList.contains("treeGridRow-expander")) {
                    var rowIndex = this._treeAsArrayProjection().indexOf(context.$data);
                    this._selectedRows([rowIndex]);
                    ko.tasks.runEarly();
                    this._dao.expand(context.$data, this._header.sortInfo());
                }
                else if (context && context.$data !== this && this._selectedRows().length > 0) {
                    if (this.focusedRow() === context.$data) {
                        this.focusedRow().invoke();
                    }
                    else {
                        this.onClick(viewModel, event);
                    }
                }
            };
            TreeGridViewModel.prototype.onKeyDown = function (viewModel, event) {
                var focusedRow = this.focusedRow();
                if (!focusedRow) {
                    return true;
                }
                if (F1Viz.Common.KeyCodes.Enter === event.keyCode) {
                    focusedRow.invoke();
                    return false;
                }
                if (F1Viz.Common.KeyCodes.Space !== event.keyCode && F1Viz.Common.KeyCodes.ArrowRight !== event.keyCode && F1Viz.Common.KeyCodes.ArrowLeft !== event.keyCode) {
                    return true;
                }
                this._selectedRows([this.focusedRowIndex()]);
                ko.tasks.runEarly();
                if (F1Viz.Common.KeyCodes.Space === event.keyCode) {
                    this._dao.expand(focusedRow, this._header.sortInfo());
                }
                else if (F1Viz.Common.KeyCodes.ArrowLeft === event.keyCode && focusedRow.expanded) {
                    focusedRow.expanded(false);
                }
                else if (F1Viz.Common.KeyCodes.ArrowRight === event.keyCode && focusedRow.expanded && !focusedRow.expanded()) {
                    this._dao.expand(focusedRow, this._header.sortInfo());
                }
                return false;
            };
            TreeGridViewModel.prototype.loadDataOperation = function (operation) {
                var _this = this;
                if (this._dataLoadPromise) {
                    this._dataLoadPromise.cancel();
                }
                this._selectedRows([]);
                ko.tasks.runEarly();
                this._dataLoadStatus(F1Viz.DataLoadEvent.DataLoadStart);
                this._dataLoadPromise = operation().then(function (roots) { return _this._roots(roots); });
                this._dataLoadPromise.done(function () {
                    _this._dataLoadPromise = null;
                    _this._dataLoadStatus(F1Viz.DataLoadEvent.DataLoadCompleted);
                }, function (error) {
                    if (error.name === F1Viz.Constants.errorNameCanceled) {
                        _this._dataLoadStatus(F1Viz.DataLoadEvent.DataLoadCanceled);
                    }
                    else {
                        _this._dataLoadStatus(F1Viz.DataLoadEvent.DataLoadFailed);
                    }
                    _this._dataLoadPromise = null;
                });
            };
            TreeGridViewModel.prototype.computeTreeAsArrayProjection = function () {
                var projection = [];
                var getProjection = function (element) {
                    projection.push(element);
                    if (element.expanded && element.expanded()) {
                        element.children().forEach(getProjection);
                    }
                };
                this._roots().forEach(getProjection);
                return projection;
            };
            TreeGridViewModel.prototype.computedFocusedRowIndex = function () {
                var selectedRows = this._selectedRows();
                return selectedRows.length > 0 ? selectedRows[selectedRows.length - 1] : -1;
            };
            TreeGridViewModel.prototype.computeFocusedRow = function () {
                var focusedIndex = this.computedFocusedRowIndex();
                return focusedIndex !== -1 ? this._treeAsArrayProjection()[focusedIndex] : null;
            };
            TreeGridViewModel.prototype.onSelectionChanged = function (changes) {
                var _this = this;
                changes.forEach(function (change) {
                    if (typeof change.moved !== "undefined") {
                        return;
                    }
                    if (change.status === "added") {
                        _this._treeAsArrayProjection()[change.value].selected(true);
                    }
                    else if (change.status === "deleted") {
                        _this._treeAsArrayProjection()[change.value].selected(false);
                    }
                });
            };
            return TreeGridViewModel;
        }());
        F1Viz.TreeGridViewModel = TreeGridViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
"use strict";
var ArrangeMovementDelta = 10;
ko.bindingHandlers["arrangeableColumns"] = {
    after: ['foreach'],
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var addEventListeners = function (cell) {
            var hoverElement;
            var dropLocation;
            var cursorOffset;
            var initialX;
            var dropCol;
            var updateDropPosition = function (x, y) {
                var cells = element.querySelectorAll("th");
                for (var i = 0; i < cells.length; ++i) {
                    var rect = cells[i].getBoundingClientRect();
                    if (rect.left <= x && x <= rect.right) {
                        dropCol = cells[i];
                        var boundingLeftOffset = Math.round((x - rect.left) / rect.width) * rect.width;
                        dropLocation.style.left = (rect.left + boundingLeftOffset - 4) + "px";
                        return;
                    }
                }
            };
            var mouseUp = function (event) {
                cell.onmousemove = null;
                cell.onmouseup = null;
                Microsoft.F1Viz.Utilities.releaseCapture(cell);
                if (hoverElement) {
                    updateDropPosition(event.clientX, event.clientY);
                    document.body.removeChild(hoverElement);
                    document.body.removeChild(dropLocation);
                    hoverElement = null;
                    dropLocation = null;
                    var colIdToMove = cell.getAttribute("data-columnid");
                    var colIdToDropOnto = dropCol.getAttribute("data-columnid");
                    if (colIdToMove === colIdToDropOnto) {
                        return;
                    }
                    var observableCols = valueAccessor();
                    var cols = observableCols();
                    cols = cols.filter(function (value) { return value !== colIdToMove; });
                    var rect = dropCol.getBoundingClientRect();
                    var boundingLeftOffset = Math.round((event.clientX - rect.left) / rect.width) * rect.width;
                    var index = cols.indexOf(dropCol.getAttribute("data-columnid"));
                    if (boundingLeftOffset !== 0) {
                        index++;
                    }
                    cols.splice(index, 0, colIdToMove);
                    observableCols(cols);
                }
            };
            var mouseMove = function (event) {
                if (event.which !== Microsoft.F1Viz.Common.MouseCodes.Left) {
                    mouseUp(event);
                    return;
                }
                var x = event.clientX;
                var y = event.clientY;
                if (!hoverElement && Math.abs(x - initialX) < ArrangeMovementDelta) {
                    return;
                }
                else if (!hoverElement) {
                    hoverElement = document.createElement("div");
                    hoverElement.id = "arrangeColumn";
                    var rect = cell.getBoundingClientRect();
                    dropCol = cell;
                    cursorOffset = Math.min(rect.width, rect.height) / 2;
                    hoverElement.style.width = rect.width + "px";
                    hoverElement.style.height = rect.height + "px";
                    hoverElement.style.padding = "4px";
                    hoverElement.style.borderWidth = "1px";
                    hoverElement.innerText = cell.innerText;
                    dropLocation = document.createElement("div");
                    dropLocation.id = "arrangeDropLocation";
                    dropLocation.style.top = (rect.top - 4) + "px";
                    dropLocation.style.height = (Math.round(rect.height) * 2 + 4) + "px";
                    document.body.appendChild(hoverElement);
                    document.body.appendChild(dropLocation);
                }
                hoverElement.style.left = (x - cursorOffset) + "px";
                hoverElement.style.top = (y - cursorOffset) + "px";
                updateDropPosition(x, y);
            };
            cell.onmousedown = function (event) {
                if (hoverElement) {
                    mouseUp(event);
                    return;
                }
                if (event.which === Microsoft.F1Viz.Common.MouseCodes.Left) {
                    cell.onmousemove = mouseMove;
                    cell.onmouseup = mouseUp;
                    Microsoft.F1Viz.Utilities.setCapture(cell);
                    initialX = event.clientX;
                }
            };
            cell.onkeydown = function (event) {
                if (!event.ctrlKey || !event.shiftKey) {
                    return;
                }
                var isColumnHidden = function (element) { return element.offsetHeight === 0; };
                if (event.keyCode === Microsoft.F1Viz.Common.KeyCodes.ArrowLeft) {
                    var moveTo = cell.previousElementSibling;
                    while (moveTo !== null && isColumnHidden(moveTo))
                        ;
                    if (!moveTo) {
                        return;
                    }
                    var observableCols = valueAccessor();
                    var cols = observableCols();
                    var colIdToMove = cell.getAttribute("data-columnid");
                    var moveToId = moveTo.getAttribute("data-columnid");
                    cols = cols.filter(function (columnId) { return columnId !== colIdToMove; });
                    cols.splice(cols.indexOf(moveToId), 0, colIdToMove);
                    observableCols(cols);
                }
                else if (event.keyCode === Microsoft.F1Viz.Common.KeyCodes.ArrowRight) {
                    var moveTo = cell.nextElementSibling;
                    while (moveTo !== null && isColumnHidden(moveTo))
                        ;
                    if (!moveTo) {
                        return;
                    }
                    var observableCols = valueAccessor();
                    var cols = observableCols();
                    var colIdToMove = cell.getAttribute("data-columnid");
                    var moveToId = moveTo.getAttribute("data-columnid");
                    cols = cols.filter(function (columnId) { return columnId !== colIdToMove; });
                    cols.splice(cols.indexOf(moveToId) + 1, 0, colIdToMove);
                    observableCols(cols);
                }
            };
        };
        var headerCells = element.querySelectorAll("th");
        for (var i = 0; i < headerCells.length; i++) {
            addEventListeners(headerCells[i]);
        }
    }
};
ko.bindingHandlers["dynamicRowCells"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        ko.virtualElements.emptyNode(element);
        var previousNode = null;
        valueUnwrapped.forEach(function (n) {
            var td = document.createElement("td");
            td.setAttribute("role", "gridcell");
            ko.utils.setHtml(td, Microsoft.F1Viz.CpuSamplingUtilities.localizeNumber(n));
            if (!previousNode) {
                ko.virtualElements.prepend(element, td);
            }
            else {
                ko.virtualElements.insertAfter(element, td, previousNode);
            }
            previousNode = td;
        });
    }
};
ko.virtualElements.allowedBindings["dynamicRowCells"] = true;
ko.bindingHandlers["focusedRow"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var logger = Microsoft.F1Viz.getLogger();
        var multiSelectStart = -1;
        element.addEventListener("keydown", function (event) {
            if (Microsoft.F1Viz.Common.KeyCodes.Shift === event.keyCode) {
                var bindingConfig = valueAccessor();
                multiSelectStart = ko.unwrap(bindingConfig.focused);
                return;
            }
            if (Microsoft.F1Viz.Common.KeyCodes.ArrowUp !== event.keyCode &&
                Microsoft.F1Viz.Common.KeyCodes.ArrowDown !== event.keyCode) {
                return;
            }
            var bindingConfig = valueAccessor();
            var rows = ko.unwrap(bindingConfig.rows);
            if (rows.length === 0) {
                return;
            }
            var focusedIndex = ko.unwrap(bindingConfig.focused);
            var selectedIndex = 0;
            if (Microsoft.F1Viz.Common.KeyCodes.ArrowUp === event.keyCode && focusedIndex !== -1) {
                selectedIndex = Math.max(focusedIndex - 1, 0);
            }
            else if (Microsoft.F1Viz.Common.KeyCodes.ArrowDown === event.keyCode && focusedIndex !== -1) {
                selectedIndex = Math.min(focusedIndex + 1, rows.length - 1);
            }
            if (!event.shiftKey) {
                bindingConfig.selected([selectedIndex]);
            }
            else {
                var start = Math.max(Math.min(selectedIndex, multiSelectStart), 0);
                var end = Math.max(selectedIndex, multiSelectStart);
                var selection = [];
                for (var indexToSelect = start; indexToSelect <= end; ++indexToSelect) {
                    selection.push(indexToSelect);
                }
                if (multiSelectStart > selectedIndex) {
                    selection.reverse();
                }
                bindingConfig.selected(selection);
            }
            event.preventDefault();
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var bindingConfig = valueAccessor();
        var focusedIndex = ko.unwrap(bindingConfig.focused);
        if (focusedIndex === -1) {
            return;
        }
        var rows = ko.unwrap(bindingConfig.rows);
        var scrollTop = element.scrollTop;
        var totalHeight = element.scrollHeight;
        var rowHeight = totalHeight / (rows.length + 1);
        var visibleHeight = element.clientHeight - rowHeight;
        var topPosition = focusedIndex * rowHeight;
        if (topPosition < (scrollTop + rowHeight)) {
            element.scrollTop = Math.max(topPosition - rowHeight, 0);
        }
        else if (topPosition + rowHeight > (scrollTop + (visibleHeight))) {
            element.scrollTop = topPosition + rowHeight - visibleHeight;
        }
    }
};
ko.bindingHandlers["justification"] = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var justification = ko.unwrap(valueAccessor());
        switch (justification) {
            case Microsoft.F1Viz.ColumnJustification.Center:
                element.style.textAlign = "center";
                break;
            case Microsoft.F1Viz.ColumnJustification.Right:
                element.style.textAlign = "right";
                break;
            case Microsoft.F1Viz.ColumnJustification.Left:
            default:
                element.style.textAlign = "left";
                break;
        }
    }
};
ko.bindingHandlers["multiClick"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var events = valueAccessor();
        var doubleClickTimeMs = 500;
        var doubleClickTimer = null;
        var clickHandler = function (event) {
            if (doubleClickTimer !== null) {
                clearTimeout(doubleClickTimer);
                doubleClickTimer = null;
                events.dblclick.apply(viewModel, [viewModel, event]);
            }
            else {
                events.click.apply(viewModel, [viewModel, event]);
                doubleClickTimer = setTimeout(function () {
                    doubleClickTimer = null;
                }, doubleClickTimeMs);
            }
            event.preventDefault();
        };
        element.addEventListener("click", clickHandler, false);
    }
};
"use strict";
ko.bindingHandlers["reorderHeaderColumns"] = {
    after: ['foreach'],
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var columnOrder = ko.unwrap(valueAccessor());
        var row = element;
        var columns = element.querySelectorAll("th");
        for (var i = 0; i < columns.length; ++i) {
            if (columns[i].getAttribute("data-columnid") !== columnOrder[i]) {
                var col = row.querySelector("th[data-columnid='" + columnOrder[i] + "']");
                var isFocused = col === document.activeElement;
                row.insertBefore(col, columns[i]);
                if (isFocused) {
                    col.focus();
                }
            }
            columns = row.querySelectorAll("th");
        }
    }
};
ko.bindingHandlers["rowIndent"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        element.style.display = "inline-block";
        element.style.textOverflow = "ellipsis";
        element.style.width = "calc(100% - 1em)";
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var indent = ko.unwrap(valueAccessor());
        element.style.maxWidth = indent + "em";
    }
};
ko.bindingHandlers["sortable"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        if (!value) {
            return;
        }
        var eventHandler = function () {
            var value = valueAccessor();
            var elementColumnId = value.sortColumnId;
            var currentColumnId = value.currentColumn;
            var currentSortDirection = value.currentDirection;
            if (currentColumnId() === elementColumnId) {
                currentSortDirection(currentSortDirection() === Microsoft.F1Viz.SortDirection.Asc ?
                    Microsoft.F1Viz.SortDirection.Desc :
                    Microsoft.F1Viz.SortDirection.Asc);
            }
            else {
                var defaultDirection = value.defaultDirection || Microsoft.F1Viz.SortDirection.Desc;
                currentColumnId(elementColumnId);
                currentSortDirection(defaultDirection);
            }
        };
        element.addEventListener("click", eventHandler);
        element.addEventListener("keydown", function (e) {
            if (Microsoft.F1Viz.Common.KeyCodes.Enter === e.keyCode) {
                eventHandler();
            }
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        if (!value) {
            return;
        }
        var elementColumnId = value.sortColumnId;
        element.classList.remove("sortAsc");
        element.classList.remove("sortDesc");
        if (elementColumnId === value.currentColumn()) {
            var sortedClass = value.currentDirection() === Microsoft.F1Viz.SortDirection.Asc ?
                "sortAsc" : "sortDesc";
            element.classList.add(sortedClass);
        }
    }
};
ko.bindingHandlers["treeGridExpander"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        element.className = "treeGridRow-expander";
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var expandable = valueAccessor();
        if (expandable === null) {
            element.style.visibility = 'hidden';
        }
        var expanded = ko.unwrap(expandable);
        if (expanded) {
            element.classList.add("expanded");
        }
        else {
            element.classList.remove("expanded");
        }
    }
};
ko.virtualElements.allowedBindings["treeGridExpander"] = false;
ko.bindingHandlers["treeGridRowFocus"] = {
    previousElement: null,
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var onFocus = function () {
            if (ko.bindingHandlers["treeGridRowFocus"].previousElement && ko.bindingHandlers["treeGridRowFocus"].previousElement !== element) {
                var e = document.createEvent("Event");
                e.initEvent("blur", false, false);
                ko.bindingHandlers["treeGridRowFocus"].previousElement.dispatchEvent(e);
            }
            var hasFocusObservable = valueAccessor();
            if (ko.isWriteableObservable(hasFocusObservable) && !hasFocusObservable()) {
                hasFocusObservable(true);
            }
            ko.bindingHandlers["treeGridRowFocus"].previousElement = element;
        };
        var onBlur = function () {
            var hasFocusObservable = valueAccessor();
            if (ko.isWriteableObservable(hasFocusObservable) && !!hasFocusObservable()) {
                hasFocusObservable(false);
            }
        };
        element.addEventListener("focus", onFocus);
        element.addEventListener("blur", onBlur);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        if (!ko.unwrap(valueAccessor())) {
            element.blur();
        }
        else {
            var body = element.parentElement;
            while (body && !body.classList.contains("treeGridBody")) {
                body = body.parentElement;
            }
            if (body) {
                var x = body.scrollLeft;
                element.focus();
                body.scrollLeft = x;
            }
            else {
                ko.tasks.runEarly();
                ko.tasks.schedule(function () {
                    var body = element.parentElement;
                    while (body && !body.classList.contains("treeGridBody")) {
                        body = body.parentElement;
                    }
                    if (body) {
                        var x = body.scrollLeft;
                        element.focus();
                        body.scrollLeft = x;
                    }
                    else {
                        element.focus();
                    }
                });
            }
        }
    }
};
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var F1Viz = Microsoft.F1Viz;
ko.bindingHandlers["virtualizedForEach"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var hiddenTop = document.createElement("div");
        var hiddenBottom = document.createElement("div");
        hiddenTop.innerHTML = "&nbsp;";
        hiddenTop.style.height = "0px";
        hiddenBottom.innerHTML = "&nbsp;";
        hiddenBottom.style.height = "0px";
        element.parentElement.insertAdjacentElement("beforeBegin", hiddenTop);
        element.parentElement.insertAdjacentElement("afterEnd", hiddenBottom);
        ko.utils.domData.set(element, "previousRows", []);
        ko.utils.domData.set(element, "rowHeight", 0);
        ko.utils.domData.set(element, "hiddenTop", hiddenTop);
        ko.utils.domData.set(element, "hiddenBottom", hiddenBottom);
        ko.utils.domData.set(element, "previousOrder", ko.unwrap(valueAccessor().columnOrder).slice(0));
        Microsoft.Plugin.Theme.addEventListener("themechanged", function () {
            ko.utils.domData.set(element, "rowHeight", 0);
        });
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var config = valueAccessor();
        var allRows = ko.unwrap(config.rows);
        var scrollTop = ko.unwrap(config.scrollTop);
        var clientHeight = ko.unwrap(config.clientHeight);
        var columnOrder = ko.unwrap(config.columnOrder);
        var hiddenTop = ko.utils.domData.get(element, "hiddenTop");
        var hiddenBottom = ko.utils.domData.get(element, "hiddenBottom");
        var previousRows = ko.utils.domData.get(element, "previousRows");
        var rowHeight = ko.utils.domData.get(element, "rowHeight");
        var previousOrder = ko.utils.domData.get(element, "previousOrder");
        if (rowHeight === 0) {
            if (allRows.length === 0) {
                return;
            }
            var rowBindingContext = bindingContext.createChildContext(allRows[0]);
            rowHeight = ko.bindingHandlers.virtualizedForEach.measureRowHeight(element, allRows[0], rowBindingContext);
            ko.utils.domData.set(element, "rowHeight", rowHeight);
        }
        var rowsToRemoveAtTop = Math.floor(scrollTop / rowHeight);
        var maxVisibleRows = Math.floor(clientHeight / rowHeight) + 2;
        var bufferSize = Math.floor(maxVisibleRows / 2);
        var endSlice = Math.min(allRows.length, rowsToRemoveAtTop + maxVisibleRows + bufferSize);
        rowsToRemoveAtTop = Math.max(rowsToRemoveAtTop - bufferSize, 0);
        hiddenTop.style.height = (rowsToRemoveAtTop * rowHeight) + "px";
        var visibleRows = allRows.slice(rowsToRemoveAtTop, endSlice);
        hiddenBottom.style.height = ((allRows.length - endSlice) * rowHeight) + "px";
        var rowDifferences = ko.bindingHandlers.virtualizedForEach.calculateNeededChanges(visibleRows, previousRows);
        rowDifferences.removedElements.forEach(function (change) {
            var rowElement = element.children[change.index];
            element.removeChild(rowElement);
        });
        var columnDifferences = ko.bindingHandlers.virtualizedForEach.calculateNeededChanges(columnOrder, previousOrder);
        var rows = element.querySelectorAll("tr");
        columnDifferences.movedElements.forEach(function (change) {
            for (var i = 0; i < rows.length; ++i) {
                var row = rows[i];
                var columns = row.querySelectorAll("td");
                if (columns.length !== columnOrder.length) {
                    continue;
                }
                row.insertBefore(columns[change.fromIndex], columns[change.toIndex]);
            }
        });
        rowDifferences.addedElements.forEach(function (change) {
            var renderedRow = document.createDocumentFragment();
            var rowBindingContext = bindingContext.createChildContext(change.value);
            ko.renderTemplate(change.value.templateName, rowBindingContext, {}, renderedRow, "replaceChildren");
            var rowElement = renderedRow.querySelector("tr");
            var columns = rowElement.querySelectorAll("td");
            for (var i = 0; i < columns.length && columns.length === columnOrder.length; ++i) {
                if (columns[i].getAttribute("data-columnid") !== columnOrder[i]) {
                    rowElement.insertBefore(rowElement.querySelector("td[data-columnid='" + columnOrder[i] + "']"), columns[i]);
                }
                columns = rowElement.querySelectorAll("td");
            }
            element.insertBefore(renderedRow, element.children[change.index] || null);
        });
        rowDifferences.movedElements.forEach(function (change) {
            element.insertBefore(element.children[change.fromIndex], element.children[change.toIndex]);
        });
        ko.utils.domData.set(element, "previousRows", visibleRows);
        ko.utils.domData.set(element, "previousOrder", columnOrder.slice());
    },
    calculateNeededChanges: function (newArray, oldArray) {
        var intermediateArray = oldArray.slice(0);
        var arrayChanges = {
            removedElements: [],
            addedElements: [],
            movedElements: []
        };
        for (var i = oldArray.length - 1; i >= 0; --i) {
            if (newArray.indexOf(oldArray[i]) === -1) {
                arrayChanges.removedElements.push({ value: oldArray[i], index: i });
                intermediateArray.splice(i, 1);
            }
        }
        for (var i = 0; i < newArray.length; i++) {
            if (oldArray.indexOf(newArray[i]) === -1) {
                arrayChanges.addedElements.push({ value: newArray[i], index: i });
                intermediateArray.splice(i, 0, newArray[i]);
            }
        }
        for (var i = 0; i < intermediateArray.length; i++) {
            if (intermediateArray[i] === newArray[i]) {
                continue;
            }
            var fromIndex = intermediateArray.indexOf(newArray[i]);
            arrayChanges.movedElements.push({ fromIndex: fromIndex, toIndex: i });
            var movedElement = intermediateArray.splice(fromIndex, 1)[0];
            intermediateArray.splice(i, 0, movedElement);
        }
        return arrayChanges;
    },
    measureRowHeight: function (element, viewModel, dataOrBindingContext) {
        var renderedTemplate = document.createDocumentFragment();
        ko.renderTemplate(viewModel.templateName, dataOrBindingContext, {}, renderedTemplate, "replaceChildren");
        var measuringRow = renderedTemplate.firstChild;
        element.appendChild(measuringRow);
        var dimensions = measuringRow.getBoundingClientRect();
        element.removeChild(measuringRow);
        return dimensions.height;
    }
};
"use strict";
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
ko.bindingHandlers["visibilityContextMenu"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        var hiddenColumnArray = value.hiddenColumns;
        var contextConfig = value.columns.map(function (binding) {
            var isChecked = function () {
                return hiddenColumnArray.indexOf(binding.id) === -1;
            };
            var callback = function () {
                if (isChecked()) {
                    hiddenColumnArray.push(binding.id);
                }
                else {
                    hiddenColumnArray.remove(binding.id);
                }
            };
            return {
                type: Microsoft.Plugin.ContextMenu.MenuItemType.checkbox,
                label: binding.text,
                callback: callback,
                checked: isChecked
            };
        });
        var contextMenu = Microsoft.Plugin.ContextMenu.create(contextConfig);
        contextMenu.attach(element);
        var styleSheet = document.createElement("style");
        document.body.appendChild(styleSheet);
        ko.utils.domData.set(element, "visibilitySheet", styleSheet);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () { return document.body.removeChild(styleSheet); });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var style = ko.utils.domData.get(element, "visibilitySheet");
        var styleSheet = style.sheet;
        var hiddenColumnArray = ko.unwrap(valueAccessor().hiddenColumns);
        for (var i = 0; i < styleSheet.cssRules.length; ++i) {
            styleSheet.deleteRule(0);
        }
        if (hiddenColumnArray.length === 0) {
            return;
        }
        var selector = hiddenColumnArray.map(function (id) { return "td[data-columnid='" + id + "'],th[data-columnid='" + id + "']"; });
        var rule = selector.join(",") + "{ display: none; }";
        styleSheet.insertRule(rule, 0);
    }
};
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var CallerCalleeColumnProvider = (function () {
            function CallerCalleeColumnProvider(dao, callerHeader, currentHeader, calleeHeader) {
                this._dao = dao;
                this._callerHeader = callerHeader;
                this._currentHeader = currentHeader;
                this._calleeHeader = calleeHeader;
                this._header = document.querySelector(".callerCallee .header table");
                this._innerScrollBar = document.querySelector(".callerCallee .scrollBarInner");
                var scrollBar = document.querySelector(".callerCallee .horizontalScroll");
                var elementsToScroll = document.querySelectorAll(".callerCallee .linkedHorizontalScroll");
                scrollBar.onscroll = function () {
                    var left = scrollBar.scrollLeft;
                    for (var i = 0; i < elementsToScroll.length; ++i) {
                        elementsToScroll[i].scrollLeft = left;
                    }
                };
                var headerScrollable = document.querySelector(".callerCallee .header");
                headerScrollable.onscroll = function () {
                    scrollBar.scrollLeft = headerScrollable.scrollLeft;
                };
            }
            CallerCalleeColumnProvider.prototype.getColumnSettings = function () {
                return this._dao.getColumnSettings();
            };
            CallerCalleeColumnProvider.prototype.onColumnChanged = function (column) {
                var caller = this._callerHeader.querySelector("th[data-columnid='" + column.columnId + "']");
                var current = this._currentHeader.querySelector("th[data-columnid='" + column.columnId + "']");
                var callee = this._calleeHeader.querySelector("th[data-columnid='" + column.columnId + "']");
                caller.style.width = column.width + "px";
                current.style.width = column.width + "px";
                callee.style.width = column.width + "px";
                this.updateLinkedScrollBarWidth();
                this._dao.onColumnChanged(column);
            };
            CallerCalleeColumnProvider.prototype.updateLinkedScrollBarWidth = function () {
                this._innerScrollBar.style.width = this._header.clientWidth + "px";
            };
            return CallerCalleeColumnProvider;
        }());
        F1Viz.CallerCalleeColumnProvider = CallerCalleeColumnProvider;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        (function (UnitFormat) {
            UnitFormat[UnitFormat["italicizedAbbreviations"] = 0] = "italicizedAbbreviations";
            UnitFormat[UnitFormat["fullName"] = 1] = "fullName";
        })(F1Viz.UnitFormat || (F1Viz.UnitFormat = {}));
        var UnitFormat = F1Viz.UnitFormat;
        var Padding = (function () {
            function Padding(left, top, right, bottom) {
                this.left = left;
                this.top = top;
                this.right = right;
                this.bottom = bottom;
            }
            return Padding;
        }());
        F1Viz.Padding = Padding;
        var RectangleDimension = (function (_super) {
            __extends(RectangleDimension, _super);
            function RectangleDimension(left, top, right, bottom) {
                _super.call(this, left, top, right, bottom);
                if (this.left > this.right || this.top > this.bottom) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                }
            }
            Object.defineProperty(RectangleDimension.prototype, "width", {
                get: function () {
                    return this.right - this.left;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RectangleDimension.prototype, "height", {
                get: function () {
                    return this.bottom - this.top;
                },
                enumerable: true,
                configurable: true
            });
            return RectangleDimension;
        }(Padding));
        F1Viz.RectangleDimension = RectangleDimension;
        var MinMaxNumber = (function () {
            function MinMaxNumber(min, max) {
                this.min = min;
                this.max = max;
            }
            Object.defineProperty(MinMaxNumber.prototype, "range", {
                get: function () {
                    if ((this.min || this.min === 0) && (this.max || this.max === 0)) {
                        return this.max - this.min;
                    }
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            return MinMaxNumber;
        }());
        F1Viz.MinMaxNumber = MinMaxNumber;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var SwimlaneViewConstants = (function () {
            function SwimlaneViewConstants() {
            }
            Object.defineProperty(SwimlaneViewConstants, "MinSelectionInPixels", {
                get: function () {
                    return 20;
                },
                enumerable: true,
                configurable: true
            });
            return SwimlaneViewConstants;
        }());
        F1Viz.SwimlaneViewConstants = SwimlaneViewConstants;
        var Constants = (function () {
            function Constants() {
            }
            Object.defineProperty(Constants, "WindowResizeThrottle", {
                get: function () {
                    return 200;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "GridLineZIndex", {
                get: function () {
                    return 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "SelectionOverlayZIndex", {
                get: function () {
                    return 130;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "GraphContainerZIndex", {
                get: function () {
                    return 5;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "TimeoutImmediate", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "TooltipTimeoutMs", {
                get: function () {
                    return 750;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "errorNameCanceled", {
                get: function () {
                    return "Canceled";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "samplesPerSecond", {
                get: function () {
                    return 1000;
                },
                enumerable: true,
                configurable: true
            });
            return Constants;
        }());
        F1Viz.Constants = Constants;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var CpuSamplingUtilities = (function () {
            function CpuSamplingUtilities() {
            }
            CpuSamplingUtilities.numberComparator = function (left, right) {
                return left - right;
            };
            CpuSamplingUtilities.asyncComputed = function (asyncFunc, hasChanged) {
                var observedResult = ko.observable();
                var dataLoadPromise;
                var asyncComputed = observedResult;
                var reevaluateTrigger = ko.observable().extend({ notify: "always" });
                asyncComputed.reevaluate = function () { return reevaluateTrigger.valueHasMutated(); };
                asyncComputed["_asyncRunner"] = ko.computed(function () {
                    reevaluateTrigger();
                    if (dataLoadPromise) {
                        dataLoadPromise.cancel();
                    }
                    dataLoadPromise = asyncFunc();
                    dataLoadPromise.done(function (result) {
                        dataLoadPromise = null;
                        observedResult(result);
                    }, function () {
                        dataLoadPromise = null;
                    });
                });
                if (hasChanged) {
                    hasChanged.addEventListener(function () { return asyncComputed.reevaluate(); });
                }
                return asyncComputed;
            };
            CpuSamplingUtilities.areBigNumbersEqual = function (left, right) {
                return (!left && !right) ||
                    (left && right && left.h === right.h && left.l === right.l);
            };
            CpuSamplingUtilities.areTimespansEqual = function (left, right) {
                return (!left && !right) ||
                    (left && right && left.equals(right));
            };
            CpuSamplingUtilities.localizeNumber = function (value, options) {
                var formatKey = JSON.stringify(options || {});
                var numberFormatter = CpuSamplingUtilities.NumberFormatterMap[formatKey];
                if (!numberFormatter) {
                    if (!window.Intl) {
                        numberFormatter = function (value) { return value.toLocaleString(Microsoft.Plugin.Culture.formatRegion, options); };
                        CpuSamplingUtilities.NumberFormatterMap[formatKey] = numberFormatter;
                    }
                    else {
                        var cachedFormat = (new Intl.NumberFormat(Microsoft.Plugin.Culture.formatRegion, options));
                        numberFormatter = function (value) { return cachedFormat.format(value); };
                        CpuSamplingUtilities.NumberFormatterMap[formatKey] = numberFormatter;
                    }
                }
                return numberFormatter(value);
            };
            CpuSamplingUtilities.NumberFormatterMap = {};
            CpuSamplingUtilities.Initialize = (function () {
                Microsoft.Plugin.Culture.addEventListener("culturechanged", function () { return CpuSamplingUtilities.NumberFormatterMap = {}; });
            })();
            return CpuSamplingUtilities;
        }());
        F1Viz.CpuSamplingUtilities = CpuSamplingUtilities;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        function eventThrottler(callback, timeout) {
            var shouldDrop = false;
            var droppedEvent = false;
            var latestArgs = null;
            var throttle = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                latestArgs = args;
                if (!shouldDrop) {
                    callback.apply(null, args);
                    shouldDrop = true;
                    window.setTimeout(function () {
                        shouldDrop = false;
                        if (droppedEvent) {
                            window.setTimeout(throttle, 0, latestArgs);
                        }
                        droppedEvent = false;
                    }, timeout);
                }
                else {
                    droppedEvent = true;
                }
            };
            return throttle;
        }
        F1Viz.eventThrottler = eventThrottler;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var InformationBarControl = (function () {
            function InformationBarControl(messageToken, onClose, linkTextToken, linkOnClick) {
                this._container = document.createElement("div");
                this._container.classList.add("infoBarContainer");
                this._messageToken = messageToken;
                var icon = document.createElement("div");
                icon.classList.add("icon");
                icon.appendChild(F1Viz.Utilities.getSVGPlaceHolder("infoIcon"));
                Microsoft.Plugin.Theme.processInjectedSvg(icon);
                icon.setAttribute("role", "img");
                this._container.appendChild(icon);
                var message = document.createElement("span");
                message.classList.add("message");
                message.innerHTML = Microsoft.Plugin.Resources.getString(messageToken);
                this._container.appendChild(message);
                if (linkTextToken) {
                    var link = document.createElement("a");
                    link.text = Microsoft.Plugin.Resources.getString(linkTextToken);
                    link.setAttribute("aria-label", Microsoft.Plugin.Resources.getString(linkTextToken));
                    link.tabIndex = 0;
                    link.onclick = linkOnClick;
                    link.onkeydown = function (evt) {
                        if (F1Viz.Common.KeyCodes.Enter === evt.keyCode && linkOnClick) {
                            linkOnClick();
                        }
                    };
                    this._container.appendChild(link);
                }
                var close = document.createElement("div");
                close.classList.add("closeButton");
                close.innerHTML = "r";
                close.tabIndex = 0;
                close.setAttribute("role", "button");
                close.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("InfoBar_Close"));
                close.onclick = onClose;
                close.onkeydown = function (evt) {
                    if (F1Viz.Common.KeyCodes.Enter === evt.keyCode) {
                        onClose();
                    }
                };
                this._container.appendChild(close);
            }
            Object.defineProperty(InformationBarControl.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InformationBarControl.prototype, "messageToken", {
                get: function () {
                    return this._messageToken;
                },
                enumerable: true,
                configurable: true
            });
            return InformationBarControl;
        }());
        F1Viz.InformationBarControl = InformationBarControl;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        var Common;
        (function (Common) {
            "use strict";
            (function (KeyCodes) {
                KeyCodes[KeyCodes["Tab"] = 9] = "Tab";
                KeyCodes[KeyCodes["Enter"] = 13] = "Enter";
                KeyCodes[KeyCodes["Shift"] = 16] = "Shift";
                KeyCodes[KeyCodes["Ctrl"] = 17] = "Ctrl";
                KeyCodes[KeyCodes["Escape"] = 27] = "Escape";
                KeyCodes[KeyCodes["Space"] = 32] = "Space";
                KeyCodes[KeyCodes["PageUp"] = 33] = "PageUp";
                KeyCodes[KeyCodes["PageDown"] = 34] = "PageDown";
                KeyCodes[KeyCodes["End"] = 35] = "End";
                KeyCodes[KeyCodes["Home"] = 36] = "Home";
                KeyCodes[KeyCodes["ArrowLeft"] = 37] = "ArrowLeft";
                KeyCodes[KeyCodes["ArrowFirst"] = 37] = "ArrowFirst";
                KeyCodes[KeyCodes["ArrowUp"] = 38] = "ArrowUp";
                KeyCodes[KeyCodes["ArrowRight"] = 39] = "ArrowRight";
                KeyCodes[KeyCodes["ArrowDown"] = 40] = "ArrowDown";
                KeyCodes[KeyCodes["ArrowLast"] = 40] = "ArrowLast";
                KeyCodes[KeyCodes["Delete"] = 46] = "Delete";
                KeyCodes[KeyCodes["B"] = 66] = "B";
                KeyCodes[KeyCodes["C"] = 67] = "C";
                KeyCodes[KeyCodes["Plus"] = 107] = "Plus";
                KeyCodes[KeyCodes["Minus"] = 109] = "Minus";
                KeyCodes[KeyCodes["F1"] = 112] = "F1";
                KeyCodes[KeyCodes["F2"] = 113] = "F2";
                KeyCodes[KeyCodes["F3"] = 114] = "F3";
                KeyCodes[KeyCodes["F4"] = 115] = "F4";
                KeyCodes[KeyCodes["F5"] = 116] = "F5";
                KeyCodes[KeyCodes["F6"] = 117] = "F6";
                KeyCodes[KeyCodes["F7"] = 118] = "F7";
                KeyCodes[KeyCodes["F8"] = 119] = "F8";
                KeyCodes[KeyCodes["F9"] = 120] = "F9";
                KeyCodes[KeyCodes["F10"] = 121] = "F10";
                KeyCodes[KeyCodes["F11"] = 122] = "F11";
                KeyCodes[KeyCodes["F12"] = 123] = "F12";
            })(Common.KeyCodes || (Common.KeyCodes = {}));
            var KeyCodes = Common.KeyCodes;
            (function (MouseCodes) {
                MouseCodes[MouseCodes["Left"] = 1] = "Left";
                MouseCodes[MouseCodes["Right"] = 3] = "Right";
                MouseCodes[MouseCodes["Middle"] = 2] = "Middle";
            })(Common.MouseCodes || (Common.MouseCodes = {}));
            var MouseCodes = Common.MouseCodes;
        })(Common = F1Viz.Common || (F1Viz.Common = {}));
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var LocalizedUnitConverter = (function () {
            function LocalizedUnitConverter(config, resources) {
                var _this = this;
                this._localizedUnits = [];
                var logger = Microsoft.F1Viz.getLogger();
                if (!config) {
                    return;
                }
                config.forEach(function (unit) {
                    if (resources && resources[unit.Unit]) {
                        _this._localizedUnits.push({
                            Decimals: unit.Decimals,
                            Divider: unit.Divider,
                            LowerBound: unit.LowerBound,
                            Unit: resources[unit.Unit]
                        });
                    }
                    else {
                        _this._localizedUnits.push({
                            Decimals: unit.Decimals,
                            Divider: unit.Divider,
                            LowerBound: unit.LowerBound,
                            Unit: unit.Unit
                        });
                        logger.error("Missing resource string for: " + unit.Unit);
                    }
                });
                config.sort(function (left, right) {
                    if (left.LowerBound < right.LowerBound) {
                        return -1;
                    }
                    else if (left.LowerBound > right.LowerBound) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
            }
            LocalizedUnitConverter.prototype.formatNumber = function (value, decimalPlaces) {
                var scaledNumber = this.scaleValue(value);
                var decimals = typeof (decimalPlaces) === "number" ? decimalPlaces : scaledNumber.decimals;
                var formattedNumber = F1Viz.Utilities.formatNumber(scaledNumber.value, decimals);
                if (scaledNumber.unit) {
                    return Microsoft.Plugin.Resources.getString("FormattedNumberWithUnits", formattedNumber, scaledNumber.unit);
                }
                else {
                    return formattedNumber;
                }
            };
            LocalizedUnitConverter.prototype.scaleValue = function (value) {
                var scaledValue = value;
                var unit;
                var unitDecimals = 0;
                for (var unitNumber = 0; unitNumber < this._localizedUnits.length; ++unitNumber) {
                    var units = this._localizedUnits[unitNumber];
                    if (units.LowerBound <= value) {
                        scaledValue = value;
                        unitDecimals = units.Decimals;
                        if (units.Divider) {
                            scaledValue = scaledValue / units.Divider;
                        }
                        var decimals = Math.pow(10, units.Decimals);
                        scaledValue = Math.round(scaledValue * decimals) / (decimals);
                        unit = units.Unit;
                    }
                    else {
                        break;
                    }
                }
                return {
                    value: scaledValue,
                    unit: unit,
                    decimals: unitDecimals
                };
            };
            return LocalizedUnitConverter;
        }());
        F1Viz.LocalizedUnitConverter = LocalizedUnitConverter;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        var Logger = (function () {
            function Logger() {
            }
            Logger.prototype.info = function (message) {
                console.info(message);
            };
            Logger.prototype.debug = function (message) {
                console.debug(message);
            };
            Logger.prototype.warning = function (message) {
                console.warn(message);
            };
            Logger.prototype.error = function (message) {
                console.error(message);
            };
            return Logger;
        }());
        F1Viz.Logger = Logger;
        var _logger;
        function getLogger() {
            if (!_logger) {
                _logger = new Logger();
            }
            return _logger;
        }
        F1Viz.getLogger = getLogger;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var RulerUtilities = (function () {
            function RulerUtilities() {
            }
            RulerUtilities.getUniqueId = function () {
                return RulerUtilities.Counter++;
            };
            RulerUtilities.getTickMarksPosition = function (timeRange, width, showZero) {
                if (showZero === void 0) { showZero = false; }
                var range = timeRange.elapsed;
                var rangeNum = parseInt(range.value);
                var begin = timeRange.begin;
                var tickMarkList = [];
                var intervalDuration = Math.pow(10, Math.floor(Math.log(rangeNum) / Math.LN10));
                var intervalWidth = (width / rangeNum) * intervalDuration;
                if (intervalWidth < 100) {
                    if (intervalWidth < 25) {
                        intervalDuration *= 8;
                    }
                    else if (intervalWidth < 50) {
                        intervalDuration *= 4;
                    }
                    else if (intervalWidth < 100) {
                        intervalDuration *= 2;
                    }
                }
                else if (intervalWidth > 250) {
                    if (intervalWidth < 400) {
                        intervalDuration /= 2;
                    }
                    else if (intervalWidth < 800) {
                        intervalDuration /= 4;
                    }
                    else if (intervalWidth < 1600) {
                        intervalDuration /= 8;
                    }
                    else {
                        intervalDuration /= 10;
                    }
                }
                if (intervalDuration > 0) {
                    var smallTickDuration = intervalDuration / 10;
                    var mediumTickDuration = intervalDuration / 2;
                    intervalWidth = (width / rangeNum) * intervalDuration;
                    if (intervalWidth < 130) {
                        smallTickDuration = intervalDuration / 5;
                    }
                    tickMarkList = RulerUtilities.generateTickMarks(timeRange, F1Viz.BigNumber.subtract(begin, F1Viz.BigNumber.moduloNumber(begin, intervalDuration)), F1Viz.BigNumber.convertFromNumber(intervalDuration), F1Viz.BigNumber.convertFromNumber(mediumTickDuration), F1Viz.BigNumber.convertFromNumber(smallTickDuration), showZero);
                }
                return tickMarkList;
            };
            RulerUtilities.getVerticalLinePositions = function (timeRange, width) {
                var positions = [];
                var marks = RulerUtilities.getTickMarksPosition(timeRange, width);
                for (var i = 0; i < marks.length; ++i) {
                    var mark = marks[i];
                    if (mark.type === F1Viz.TickMarkType.Big) {
                        var position = parseInt(F1Viz.BigNumber.subtract(mark.value, timeRange.begin).value) / parseInt(timeRange.elapsed.value) * 100;
                        positions.push(position);
                    }
                }
                return positions;
            };
            RulerUtilities.formatTime = function (value, unitFormat) {
                if (unitFormat === void 0) { unitFormat = F1Viz.UnitFormat.italicizedAbbreviations; }
                var time = "0";
                var nf = F1Viz.Utilities.getNumberFormat();
                if (value.greaterOrEqual(F1Viz.BigNumber.convertFromNumber(RulerUtilities.OneSecond - RulerUtilities.NanosecondsSignificanceThreshold))) {
                    var splitTime = RulerUtilities.getSplittedTime(value, (RulerUtilities.OneMillisecond / 2));
                    var hasMinutes = parseInt(splitTime.minString) ? true : false;
                    var hasSeconds = parseInt(splitTime.secString) ? true : false;
                    var hasMillis = parseInt(splitTime.msString) ? true : false;
                    time = hasMinutes ? (splitTime.minString + ":") : "";
                    time += hasSeconds ? splitTime.secString : (hasMinutes ? "00" : "0");
                    if (hasMillis) {
                        time += nf.numberDecimalSeparator + this.removeTrailingZeros(splitTime.msString);
                    }
                }
                else {
                    var splitTime = RulerUtilities.getSplittedTime(value);
                    var hasMillis = parseInt(splitTime.msString) ? true : false;
                    var hasNanos = parseInt(splitTime.nsString) ? true : false;
                    time = hasMillis ? splitTime.msString : "0";
                    if (hasNanos) {
                        time += nf.numberDecimalSeparator + this.removeTrailingZeros(splitTime.nsString);
                    }
                }
                var unit = RulerUtilities.getUnit(parseInt(value.value), unitFormat);
                return time + unit;
            };
            RulerUtilities.formatTitleTime = function (value, unitFormat, isLive, truncateNs) {
                if (unitFormat === void 0) { unitFormat = F1Viz.UnitFormat.fullName; }
                if (isLive === void 0) { isLive = false; }
                if (truncateNs === void 0) { truncateNs = false; }
                var threshold = truncateNs ? RulerUtilities.OneMillisecond : RulerUtilities.NanosecondsSignificanceThreshold;
                var splitTime = RulerUtilities.getSplittedTime(value, threshold);
                var time = "0";
                var nf = F1Viz.Utilities.getNumberFormat();
                var hasMinutes = parseInt(splitTime.minString) ? true : false;
                var hasSeconds = parseInt(splitTime.secString) ? true : false;
                var hasMillis = isLive ? false : (parseInt(splitTime.msString) ? true : false);
                var hasNanos = isLive ? false : (parseInt(splitTime.nsString) ? true : false);
                if (hasMinutes) {
                    var secondsPart = hasSeconds ? splitTime.secString : "00";
                    time = splitTime.minString + ":" + secondsPart;
                }
                else if (hasSeconds) {
                    time = splitTime.secString;
                    if (hasMillis) {
                        time += nf.numberDecimalSeparator + this.removeTrailingZeros(splitTime.msString);
                    }
                }
                else if (hasMillis || hasNanos) {
                    time = hasMillis ? splitTime.msString : hasNanos ? "0" : "";
                    if (hasNanos) {
                        time += nf.numberDecimalSeparator + this.removeTrailingZeros(splitTime.nsString);
                    }
                }
                return time;
            };
            RulerUtilities.formatTotalTime = function (value, unitFormat, isLive) {
                if (unitFormat === void 0) { unitFormat = F1Viz.UnitFormat.fullName; }
                if (isLive === void 0) { isLive = false; }
                var time = RulerUtilities.formatTitleTime(value, unitFormat, isLive);
                var unit = RulerUtilities.getUnit(parseInt(value.value), unitFormat, isLive);
                return time + unit;
            };
            RulerUtilities.generateTickMarks = function (timeRange, start, bigTick, mediumTick, step, showZero) {
                var tickMarkList = [];
                var beginNsec = timeRange.begin;
                var endNsec = timeRange.end;
                if (showZero) {
                    tickMarkList.push({ type: F1Viz.TickMarkType.Big, value: new F1Viz.BigNumber(0, 0), label: "0" });
                }
                if (step.equals(F1Viz.BigNumber.zero)) {
                    step = new F1Viz.BigNumber(0, 1);
                }
                for (var i = start; endNsec.greater(i); i = F1Viz.BigNumber.add(i, step)) {
                    if (i.greater(beginNsec)) {
                        var tickMarkTime = i;
                        if (F1Viz.BigNumber.modulo(i, bigTick).equals(F1Viz.BigNumber.zero)) {
                            tickMarkList.push({ type: F1Viz.TickMarkType.Big, value: tickMarkTime });
                        }
                        else if (F1Viz.BigNumber.modulo(i, mediumTick).equals(F1Viz.BigNumber.zero)) {
                            tickMarkList.push({ type: F1Viz.TickMarkType.Medium, value: tickMarkTime });
                        }
                        else {
                            tickMarkList.push({ type: F1Viz.TickMarkType.Small, value: tickMarkTime });
                        }
                    }
                }
                return tickMarkList;
            };
            RulerUtilities.getUnit = function (valueNs, unitFormat, isLive) {
                if (isLive === void 0) { isLive = false; }
                var units = RulerUtilities.getUnits(unitFormat);
                var unit;
                if (valueNs < RulerUtilities.OneSecond - RulerUtilities.NanosecondsSignificanceThreshold && !isLive) {
                    unit = units.milliseconds;
                }
                else if (valueNs < RulerUtilities.OneMinute - RulerUtilities.NanosecondsSignificanceThreshold) {
                    unit = units.seconds;
                }
                else {
                    unit = units.minutes;
                }
                return unit;
            };
            RulerUtilities.getUnits = function (unitFormat) {
                var unitLabelFormat;
                if (unitFormat === F1Viz.UnitFormat.fullName) {
                    unitLabelFormat = {
                        milliseconds: " " + Microsoft.Plugin.Resources.getString("MillisecondsLabel"),
                        seconds: " " + Microsoft.Plugin.Resources.getString("SecondsLabel"),
                        minutes: " " + Microsoft.Plugin.Resources.getString("MinutesLabel")
                    };
                }
                else {
                    unitLabelFormat = {
                        milliseconds: Microsoft.Plugin.Resources.getString("MillisecondsAbbreviation"),
                        seconds: Microsoft.Plugin.Resources.getString("SecondsAbbreviation"),
                        minutes: Microsoft.Plugin.Resources.getString("MinutesAbbreviation")
                    };
                }
                return unitLabelFormat;
            };
            RulerUtilities.getSplittedTime = function (value, nanosecondsSignificance) {
                if (nanosecondsSignificance === void 0) { nanosecondsSignificance = RulerUtilities.NanosecondsSignificanceThreshold; }
                var nanoseconds = F1Viz.BigNumber.moduloNumber(value, RulerUtilities.OneMillisecond);
                var valueUnaccountedFor = F1Viz.BigNumber.subtract(value, nanoseconds);
                var nanosecondsNum = parseInt(nanoseconds.value);
                var ns = "";
                if (nanosecondsNum < RulerUtilities.OneMillisecond - nanosecondsSignificance) {
                    ns = Math.round(nanosecondsNum / 1000).toString();
                    ns = this.padLeadingZeros(ns, 3);
                }
                else {
                    valueUnaccountedFor = F1Viz.BigNumber.addNumber(valueUnaccountedFor, RulerUtilities.OneMillisecond);
                }
                var milliseconds = F1Viz.BigNumber.moduloNumber(valueUnaccountedFor, RulerUtilities.OneSecond);
                valueUnaccountedFor = F1Viz.BigNumber.subtract(valueUnaccountedFor, milliseconds);
                var millisecondsNum = parseInt(milliseconds.value) / RulerUtilities.OneMillisecond;
                var seconds = F1Viz.BigNumber.moduloNumber(valueUnaccountedFor, RulerUtilities.OneMinute);
                valueUnaccountedFor = F1Viz.BigNumber.subtract(valueUnaccountedFor, seconds);
                var secondsNum = parseInt(seconds.value) / RulerUtilities.OneSecond;
                var minutes = valueUnaccountedFor;
                var minutesNum = parseInt(minutes.value) / RulerUtilities.OneMinute;
                var ms = "";
                if (ns || millisecondsNum) {
                    ms = millisecondsNum.toString();
                    if (secondsNum || minutesNum) {
                        ms = this.padLeadingZeros(ms, 3);
                    }
                }
                var sec = "";
                if (ns || ms || secondsNum) {
                    sec = secondsNum.toString();
                    if (minutesNum) {
                        sec = this.padLeadingZeros(sec, 2);
                    }
                }
                var min = "";
                if (minutesNum) {
                    min = minutesNum.toString();
                }
                return {
                    nsString: ns,
                    msString: ms,
                    secString: sec,
                    minString: min
                };
            };
            RulerUtilities.removeTrailingZeros = function (numericString) {
                return numericString.replace(/0*$/, "");
            };
            RulerUtilities.padLeadingZeros = function (value, totalLength) {
                var padded = value;
                var zeros = "00000000";
                if (padded && totalLength && totalLength > 0) {
                    while (totalLength - padded.length >= 8) {
                        padded = zeros + padded;
                    }
                    padded = zeros.substr(0, totalLength - padded.length) + padded;
                }
                return padded;
            };
            RulerUtilities.OneMillisecond = 1000000;
            RulerUtilities.OneSecond = 1000 * 1000000;
            RulerUtilities.OneMinute = 60 * 1000 * 1000000;
            RulerUtilities.Counter = 0;
            RulerUtilities.NanosecondsSignificanceThreshold = 500;
            return RulerUtilities;
        }());
        F1Viz.RulerUtilities = RulerUtilities;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Utilities = (function () {
            function Utilities() {
            }
            Utilities.findChildById = function (element, id) {
                var queue = [];
                var currentElement = element;
                while (currentElement) {
                    if (currentElement.id === id) {
                        return currentElement;
                    }
                    for (var child = 0; child < currentElement.children.length; ++child) {
                        queue.push(currentElement.children[child]);
                    }
                    currentElement = queue.shift();
                }
                return null;
            };
            Utilities.findLessThan = function (list, value, comp, minIndex, maxIndex) {
                if (minIndex === void 0) { minIndex = 0; }
                if (maxIndex === void 0) { maxIndex = list.length - 1; }
                if (maxIndex === minIndex) {
                    return minIndex;
                }
                else if (maxIndex - minIndex <= 1) {
                    return comp(list[maxIndex], value) ? maxIndex : minIndex;
                }
                var index = Math.floor((maxIndex + minIndex) / 2);
                return comp(value, list[index]) ?
                    Utilities.findLessThan(list, value, comp, minIndex, index) :
                    Utilities.findLessThan(list, value, comp, index, maxIndex);
            };
            Utilities.findGreaterThan = function (list, value, comp, minIndex, maxIndex) {
                if (minIndex === void 0) { minIndex = 0; }
                if (maxIndex === void 0) { maxIndex = list.length - 1; }
                if (maxIndex === minIndex) {
                    return maxIndex;
                }
                else if (maxIndex - minIndex <= 1) {
                    return comp(value, list[minIndex]) ? minIndex : maxIndex;
                }
                var index = Math.floor((maxIndex + minIndex) / 2);
                return comp(value, list[index]) ?
                    Utilities.findGreaterThan(list, value, comp, minIndex, index) :
                    Utilities.findGreaterThan(list, value, comp, index, maxIndex);
            };
            Utilities.scaleToRange = function (value, valueMin, valueMax, newMin, newMax) {
                if (valueMax === valueMin) {
                    return 0;
                }
                return ((newMax - newMin) * (value - valueMin)) / (valueMax - valueMin) + newMin;
            };
            Utilities.linearInterpolate = function (x, x0, y0, x1, y1) {
                if (x0.equals(x1)) {
                    return y0;
                }
                var xDelta = parseInt(F1Viz.BigNumber.subtract(x, x0).value);
                var xRange = parseInt(F1Viz.BigNumber.subtract(x1, x0).value);
                return y0 + (y1 - y0) * xDelta / xRange;
            };
            Utilities.convertToPixel = function (time, timeRange, pixelRange, validateInput) {
                if (validateInput === void 0) { validateInput = true; }
                if (validateInput && (timeRange.elapsed.equals(F1Viz.BigNumber.zero) || pixelRange <= 0)) {
                    return 0;
                }
                var sign = 1;
                var timeFromRangeStart;
                if (timeRange.begin.greater(time)) {
                    sign = -1;
                    timeFromRangeStart = parseInt(F1Viz.BigNumber.subtract(timeRange.begin, time).value);
                }
                else {
                    timeFromRangeStart = parseInt(F1Viz.BigNumber.subtract(time, timeRange.begin).value);
                }
                return sign * (timeFromRangeStart / parseInt(timeRange.elapsed.value)) * pixelRange;
            };
            Utilities.getTimestampAtPixel = function (numPixelsFromLeft, pixelRange, timeRange) {
                if (pixelRange > 0) {
                    return F1Viz.BigNumber.addNumber(timeRange.begin, (parseInt(timeRange.elapsed.value) / pixelRange) * numPixelsFromLeft);
                }
                return F1Viz.BigNumber.zero;
            };
            Utilities.translateNumPixelToDuration = function (pixels, pixelRange, timeRange) {
                if (pixelRange > 0) {
                    return (parseInt(timeRange.elapsed.value) / pixelRange) * pixels;
                }
                return 0;
            };
            Utilities.formatNumber = function (value, decimalPlaces) {
                var valueToFormat;
                if (decimalPlaces === null || typeof (decimalPlaces) === "undefined") {
                    valueToFormat = value.toString();
                }
                else {
                    valueToFormat = value.toFixed(decimalPlaces);
                }
                var numberFormat = Utilities.getNumberFormat();
                return valueToFormat.replace(".", numberFormat.numberDecimalSeparator);
            };
            Utilities.formatString = function (stringToFormat) {
                var values = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    values[_i - 1] = arguments[_i];
                }
                var formatted = stringToFormat;
                values.forEach(function (value, i) {
                    formatted = formatted.replace("{" + i + "}", value);
                });
                return formatted;
            };
            Utilities.getNumberFormat = function () {
                var nf = Microsoft.Plugin.Culture.NumberFormat;
                if (!nf || nf.length === 0) {
                    nf = { numberDecimalSeparator: "." };
                }
                return nf;
            };
            Utilities.containsPoint = function (boundingRect, x, y) {
                return boundingRect.left <= x &&
                    boundingRect.right >= x &&
                    boundingRect.top <= y &&
                    boundingRect.bottom >= y;
            };
            Utilities.getSVGPlaceHolder = function (token) {
                var svg = document.createElement("div");
                svg.setAttribute("data-plugin-svg", token);
                return svg;
            };
            Utilities.setCapture = function (element) {
                if (!element) {
                    return;
                }
                try {
                    if (element.setCapture) {
                        element.setCapture(true);
                        return;
                    }
                    if (element.msSetPointerCapture) {
                        element.msSetPointerCapture(Utilities.MousePointerId);
                        return;
                    }
                    if (element.setPointerCapture) {
                        element.setPointerCapture(Utilities.MousePointerId);
                        return;
                    }
                }
                catch (e) {
                    F1Viz.getLogger().error(e.message);
                }
            };
            Utilities.releaseCapture = function (element) {
                if (!element) {
                    return;
                }
                try {
                    if (element.releaseCapture) {
                        element.releaseCapture();
                        return;
                    }
                    if (element.msReleasePointerCapture) {
                        element.msReleasePointerCapture(Utilities.MousePointerId);
                        return;
                    }
                    if (element.releasePointerCapture) {
                        element.releasePointerCapture(Utilities.MousePointerId);
                        return;
                    }
                }
                catch (e) {
                    F1Viz.getLogger().error(e.message);
                }
            };
            Utilities.MousePointerId = 1;
            return Utilities;
        }());
        F1Viz.Utilities = Utilities;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var AggregatedEvent = (function () {
            function AggregatedEvent() {
                this._eventListeners = [];
            }
            AggregatedEvent.prototype.invokeEvent = function (args) {
                this._eventListeners.forEach(function (func) { return func(args); });
            };
            AggregatedEvent.prototype.addEventListener = function (func) {
                this._eventListeners.push(func);
            };
            AggregatedEvent.prototype.removeEventListener = function (func) {
                var location = this._eventListeners.indexOf(func);
                if (location > -1) {
                    this._eventListeners.splice(location, 1);
                }
            };
            AggregatedEvent.prototype.dispose = function () {
                this._eventListeners = null;
            };
            return AggregatedEvent;
        }());
        F1Viz.AggregatedEvent = AggregatedEvent;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var ChartColorScheme = (function () {
            function ChartColorScheme(lineColorString, lineFillColorString) {
                this._lineColorString = "#FF0000";
                this._lineFillColorString = "#FF0000";
                this._lineColorString = lineColorString;
                this._lineFillColorString = lineFillColorString;
            }
            Object.defineProperty(ChartColorScheme.prototype, "lineColor", {
                get: function () {
                    return this._lineColorString;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ChartColorScheme.prototype, "lineFillColor", {
                get: function () {
                    return this._lineFillColorString;
                },
                enumerable: true,
                configurable: true
            });
            return ChartColorScheme;
        }());
        F1Viz.ChartColorScheme = ChartColorScheme;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var ControlDecorator = (function () {
            function ControlDecorator(decorated) {
                this._decoratedControl = decorated;
            }
            Object.defineProperty(ControlDecorator.prototype, "container", {
                get: function () {
                    return this._decoratedControl.container;
                },
                enumerable: true,
                configurable: true
            });
            ControlDecorator.prototype.onDataUpdate = function (timestampNs) {
                if (this._decoratedControl.onDataUpdate) {
                    this._decoratedControl.onDataUpdate(timestampNs);
                }
            };
            ControlDecorator.prototype.resize = function (evt) {
                if (this._decoratedControl.resize) {
                    this._decoratedControl.resize(evt);
                }
            };
            ControlDecorator.prototype.onViewportChanged = function (viewportArgs) {
                if (this._decoratedControl.onViewportChanged) {
                    this._decoratedControl.onViewportChanged(viewportArgs);
                }
            };
            ControlDecorator.prototype.dispose = function () {
                if (this._decoratedControl.dispose) {
                    this._decoratedControl.dispose();
                }
            };
            return ControlDecorator;
        }());
        F1Viz.ControlDecorator = ControlDecorator;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        (function (ScaleType) {
            ScaleType[ScaleType["Left"] = 0] = "Left";
            ScaleType[ScaleType["Right"] = 1] = "Right";
        })(F1Viz.ScaleType || (F1Viz.ScaleType = {}));
        var ScaleType = F1Viz.ScaleType;
        (function (TickMarkType) {
            TickMarkType[TickMarkType["Big"] = 0] = "Big";
            TickMarkType[TickMarkType["Medium"] = 1] = "Medium";
            TickMarkType[TickMarkType["Small"] = 2] = "Small";
        })(F1Viz.TickMarkType || (F1Viz.TickMarkType = {}));
        var TickMarkType = F1Viz.TickMarkType;
        (function (PointToFind) {
            PointToFind[PointToFind["LessThanOrEqual"] = 0] = "LessThanOrEqual";
            PointToFind[PointToFind["Nearest"] = 1] = "Nearest";
            PointToFind[PointToFind["GreaterThanOrEqual"] = 2] = "GreaterThanOrEqual";
        })(F1Viz.PointToFind || (F1Viz.PointToFind = {}));
        var PointToFind = F1Viz.PointToFind;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var DataCursor = (function () {
            function DataCursor(parent, series, viewport, swimlaneId, scaleMin, scaleMax) {
                var _this = this;
                this._parentClientWidth = 0;
                this._parentClientHeight = 0;
                this._timePerPixel = F1Viz.BigNumber.one;
                this._cursors = [];
                this._showingTooltip = false;
                this._tooltipTimer = null;
                this._viewEventManager = Microsoft.F1Viz.getViewEventManager();
                this._parent = parent;
                this._series = series;
                this._viewport = viewport;
                this._previousTime = this._viewport.begin;
                this._selectionTimeAnchor = this._previousTime;
                this._scaleMin = scaleMin;
                this._scaleMax = scaleMax;
                this._container = document.createElement("div");
                this._container.classList.add("dataCursor");
                this._container.classList.add("hidden");
                this._cursors = series.map(function (dataSeries) {
                    var cursorDomElement = dataSeries.marker.cloneNode(true);
                    cursorDomElement.classList.add("dataCursorPoint");
                    document.body.appendChild(cursorDomElement);
                    var width = cursorDomElement.clientWidth + 2;
                    var height = cursorDomElement.clientHeight + 2;
                    document.body.removeChild(cursorDomElement);
                    cursorDomElement.style.left = (-width / 2) + "px";
                    cursorDomElement.style.width = width + "px";
                    cursorDomElement.style.height = height + "px";
                    _this._container.appendChild(cursorDomElement);
                    return {
                        domElement: cursorDomElement,
                        width: width,
                        height: height
                    };
                });
                this._onMouseEnterBoundFunction = this.onMouseEnter.bind(this);
                this._onMouseMoveBoundFunction = this.onMouseMove.bind(this);
                this._onMouseLeaveBoundFunction = this.onMouseLeave.bind(this);
                this._onKeyDownBoundFunction = this.onKeyDown.bind(this);
                this._onKeyUpBoundFunction = this.onKeyUp.bind(this);
                this._parent.setAttribute("role", "slider");
                this._parent.setAttribute("aria-live", "polite");
                this._parent.addEventListener("mouseenter", this._onMouseEnterBoundFunction);
                this._parent.addEventListener("mousemove", this._onMouseMoveBoundFunction);
                this._parent.addEventListener("mouseleave", this._onMouseLeaveBoundFunction);
                this._parent.addEventListener("keydown", this._onKeyDownBoundFunction);
                this._parent.addEventListener("keyup", this._onKeyUpBoundFunction);
            }
            Object.defineProperty(DataCursor.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            DataCursor.prototype.dispose = function () {
                this._parent.removeEventListener("mouseenter", this._onMouseEnterBoundFunction);
                this._parent.removeEventListener("mousemove", this._onMouseMoveBoundFunction);
                this._parent.removeEventListener("mouseleave", this._onMouseLeaveBoundFunction);
                this._parent.removeEventListener("keydown", this._onKeyDownBoundFunction);
                this._parent.removeEventListener("keyup", this._onKeyUpBoundFunction);
            };
            DataCursor.prototype.resize = function (evt) {
                this._parentClientWidth = this._parent.clientWidth;
                this._parentClientHeight = this._parent.clientHeight;
                this._timePerPixel = this._parentClientWidth !== 0 ? F1Viz.BigNumber.divideNumber(this._viewport.elapsed, this._parentClientWidth) : F1Viz.BigNumber.one;
            };
            DataCursor.prototype.onViewportChanged = function (viewportArgs) {
                if (this._viewport.equals(viewportArgs.currentTimespan)) {
                    return;
                }
                this._viewport = viewportArgs.currentTimespan;
                this._previousTime = this._viewport.begin;
                this._selectionTimeAnchor = this._previousTime;
                this._timePerPixel = this._parentClientWidth !== 0 ? F1Viz.BigNumber.divideNumber(this._viewport.elapsed, this._parentClientWidth) : F1Viz.BigNumber.one;
                this.dismissTooltip();
                this._container.classList.add("hidden");
            };
            DataCursor.prototype.onScaleChanged = function (scaleArgs) {
                this._scaleMin = scaleArgs.minimum;
                this._scaleMax = scaleArgs.maximum;
            };
            DataCursor.prototype.onKeyDown = function (event) {
                if (event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.Ctrl) {
                    this._selectionTimeAnchor = this._previousTime;
                    return;
                }
                if (event.keyCode !== F1Viz.Common.KeyCodes.ArrowLeft &&
                    event.keyCode !== F1Viz.Common.KeyCodes.ArrowRight) {
                    return;
                }
                event.preventDefault();
                var boundingRect = event.currentTarget.getBoundingClientRect();
                var previousTimestamp = this._previousTime;
                var pointToFind;
                if (event.keyCode === F1Viz.Common.KeyCodes.ArrowRight) {
                    this._previousTime = F1Viz.BigNumber.add(this._previousTime, this._timePerPixel);
                    pointToFind = F1Viz.PointToFind.GreaterThanOrEqual;
                }
                else {
                    this._previousTime = this._previousTime.greater(this._timePerPixel) ? F1Viz.BigNumber.subtract(this._previousTime, this._timePerPixel) : F1Viz.BigNumber.zero;
                    pointToFind = F1Viz.PointToFind.LessThanOrEqual;
                }
                var currentPoints = this.getPointsAt(this._previousTime, pointToFind);
                if (currentPoints.length === 0) {
                    return;
                }
                var nearestTimestamp = currentPoints[0].seriesElement.timestamp;
                if (nearestTimestamp.equals(previousTimestamp) ||
                    nearestTimestamp.greater(this._viewport.end) ||
                    this._viewport.begin.greater(nearestTimestamp)) {
                    this._previousTime = event.keyCode === F1Viz.Common.KeyCodes.ArrowRight ? this._viewport.begin : this._viewport.end;
                    currentPoints = this.getPointsAt(this._previousTime, pointToFind);
                    nearestTimestamp = currentPoints[0].seriesElement.timestamp;
                }
                this._previousTime = nearestTimestamp;
                this.updateCursorLocation(nearestTimestamp, currentPoints);
                this.dismissTooltip();
                this.displayTooltip(boundingRect, nearestTimestamp, currentPoints);
                if (event.ctrlKey) {
                    this._viewEventManager.selectionChanged.invokeEvent({
                        position: new F1Viz.JsonTimespan(F1Viz.BigNumber.min(this._selectionTimeAnchor, this._previousTime), F1Viz.BigNumber.max(this._selectionTimeAnchor, this._previousTime)),
                        isIntermittent: true
                    });
                }
            };
            DataCursor.prototype.onKeyUp = function (event) {
                if (event.keyCode !== F1Viz.Common.KeyCodes.Ctrl) {
                    return;
                }
                this._viewEventManager.selectionChanged.invokeEvent({
                    position: new F1Viz.JsonTimespan(F1Viz.BigNumber.min(this._selectionTimeAnchor, this._previousTime), F1Viz.BigNumber.max(this._selectionTimeAnchor, this._previousTime)),
                    isIntermittent: false
                });
            };
            DataCursor.prototype.onMouseEnter = function (event) {
                this._container.classList.remove("hidden");
            };
            DataCursor.prototype.onMouseMove = function (event) {
                var boundingRect = event.currentTarget.getBoundingClientRect();
                var mouseTimestamp = F1Viz.Utilities.getTimestampAtPixel(event.clientX - boundingRect.left, this._parentClientWidth, this._viewport);
                if (mouseTimestamp.equals(this._previousTime)) {
                    return;
                }
                this._previousTime = mouseTimestamp;
                var boundingRect = event.currentTarget.getBoundingClientRect();
                var points = this.getPointsAt(mouseTimestamp);
                if (points.length === 0) {
                    this._container.classList.add("hidden");
                    return;
                }
                var nearestTimestamp = points[0].seriesElement.timestamp;
                var delta = F1Viz.BigNumber.subtract(F1Viz.BigNumber.max(nearestTimestamp, mouseTimestamp), F1Viz.BigNumber.min(nearestTimestamp, mouseTimestamp));
                var threshold = F1Viz.BigNumber.multiplyNumber(this._timePerPixel, DataCursor.SnapThresholdInPixels);
                var isInterpolating = delta.greater(threshold);
                if (isInterpolating) {
                    this._container.classList.add("interpolating");
                    this.updateCursorLocation(mouseTimestamp, points);
                }
                else {
                    this._container.classList.remove("interpolating");
                    this.updateCursorLocation(nearestTimestamp, points);
                }
                this.dismissTooltip();
                this.displayTooltip(boundingRect, mouseTimestamp, points, isInterpolating);
            };
            DataCursor.prototype.onMouseLeave = function (event) {
                var mouseTimestamp = F1Viz.Utilities.getTimestampAtPixel(event.x, this._parentClientWidth, this._viewport);
                if (this._showingTooltip && mouseTimestamp.equals(this._previousTime)) {
                    return;
                }
                this.dismissTooltip();
                this._container.classList.add("hidden");
                this._previousTime = this._viewport.begin;
            };
            DataCursor.prototype.getPointsAt = function (timestamp, pointToFind) {
                var _this = this;
                if (pointToFind === void 0) { pointToFind = F1Viz.PointToFind.Nearest; }
                return this._series.map(function (series, seriesNumber) {
                    return {
                        seriesElement: series.getPointAtTimestamp(timestamp, pointToFind),
                        cursor: _this._cursors[seriesNumber]
                    };
                }).filter(function (point) {
                    return point.seriesElement !== null;
                }).sort(function (point1, point2) {
                    switch (pointToFind) {
                        case F1Viz.PointToFind.GreaterThanOrEqual:
                            var p1Greater = point1.seriesElement.timestamp.greaterOrEqual(timestamp);
                            var p2Greater = point2.seriesElement.timestamp.greaterOrEqual(timestamp);
                            if (p1Greater === p2Greater) {
                                break;
                            }
                            return p1Greater ? -1 : 1;
                        case F1Viz.PointToFind.LessThanOrEqual:
                            var p1Less = timestamp.greaterOrEqual(point1.seriesElement.timestamp);
                            var p2Less = timestamp.greaterOrEqual(point2.seriesElement.timestamp);
                            if (p1Less === p2Less) {
                                break;
                            }
                            return p1Less ? -1 : 1;
                        default:
                            break;
                    }
                    var delta1 = F1Viz.BigNumber.subtract(F1Viz.BigNumber.max(timestamp, point1.seriesElement.timestamp), F1Viz.BigNumber.min(timestamp, point1.seriesElement.timestamp));
                    var delta2 = F1Viz.BigNumber.subtract(F1Viz.BigNumber.max(timestamp, point2.seriesElement.timestamp), F1Viz.BigNumber.min(timestamp, point2.seriesElement.timestamp));
                    return delta1.compareTo(delta2);
                }).filter(function (element, index, sortedElements) {
                    var delta = F1Viz.BigNumber.subtract(F1Viz.BigNumber.max(sortedElements[0].seriesElement.timestamp, element.seriesElement.timestamp), F1Viz.BigNumber.min(sortedElements[0].seriesElement.timestamp, element.seriesElement.timestamp));
                    return _this._timePerPixel.greater(delta);
                });
            };
            DataCursor.prototype.updateCursorLocation = function (timestamp, elements) {
                var _this = this;
                var x = F1Viz.Utilities.convertToPixel(timestamp, this._viewport, this._parentClientWidth);
                this._container.style.left = Math.floor(x) + "px";
                this._cursors.forEach(function (cursor) { return cursor.domElement.style.visibility = "hidden"; });
                elements.forEach(function (element) {
                    if (typeof (element.seriesElement.value) === "number") {
                        var y = F1Viz.Utilities.scaleToRange(element.seriesElement.value, _this._scaleMin, _this._scaleMax, 0, _this._parentClientHeight);
                        element.cursor.domElement.style.bottom = (y - element.cursor.height / 2) + "px";
                        element.cursor.domElement.style.visibility = "visible";
                    }
                    else {
                        element.cursor.domElement.style.visibility = "visible";
                    }
                });
                this._container.classList.remove("hidden");
            };
            DataCursor.prototype.displayTooltip = function (boundingRect, timestamp, elements, isInterpolating) {
                if (isInterpolating === void 0) { isInterpolating = false; }
                this._tooltipTimer = null;
                this._showingTooltip = true;
                var x = F1Viz.Utilities.convertToPixel(timestamp, this._viewport, this._parentClientWidth);
                var toolTips = elements.map(function (element) { return element.seriesElement.tooltip; });
                if (isInterpolating) {
                    toolTips.unshift(Microsoft.Plugin.Resources.getString("DataCursorInterpolatingTooltip"));
                }
                if (toolTips.length > 0) {
                    var tooltip = toolTips.join("\n");
                    var ariaLabel = Microsoft.Plugin.Resources.getString("ChartSeriesFormattableTimeLabel", F1Viz.RulerUtilities.formatTime(timestamp, F1Viz.UnitFormat.fullName)) + "\n" + tooltip;
                    this._parent.setAttribute("aria-valuenow", ariaLabel);
                    this._parent.setAttribute("aria-valuetext", ariaLabel);
                    this._tooltipTimer = setTimeout(function () {
                        var message = Microsoft.Plugin.Resources.getString("ChartSeriesFormattableTimeLabel", F1Viz.RulerUtilities.formatTime(timestamp)) + "\n" + tooltip;
                        var config = {
                            content: message,
                            delay: 0,
                            x: x + boundingRect.left + 10,
                            y: boundingRect.top
                        };
                        Microsoft.Plugin.Tooltip.show(config);
                    }, F1Viz.Constants.TooltipTimeoutMs);
                }
            };
            DataCursor.prototype.dismissTooltip = function () {
                clearTimeout(this._tooltipTimer);
                this._tooltipTimer = null;
                this._showingTooltip = false;
                Microsoft.Plugin.Tooltip.dismiss();
            };
            DataCursor.SnapThresholdInPixels = 10;
            return DataCursor;
        }());
        F1Viz.DataCursor = DataCursor;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var GraphTimeAxis = (function () {
            function GraphTimeAxis(currentTimespan) {
                this._clientWidth = 0;
                this._clientHeight = 0;
                this._currentTimespan = currentTimespan;
                this._canvas = document.createElement("canvas");
                this._canvas.classList.add("graphTimeAxis");
                this._canvas.style.height = "1.3em";
                this._canvas.style.width = "100%";
                this._canvas.style.position = "absolute";
                this._canvas.style.bottom = "-1.3em";
                this._context = this._canvas.getContext("2d");
                this._context.lineWidth = 1;
                this._strokeStyle = Microsoft.Plugin.Theme.getValue("DiagnosticsHub-GraphLine-Background");
                this._fontSize = Microsoft.Plugin.Theme.getValue("plugin-font-size");
                this._fontColor = Microsoft.Plugin.Theme.getValue("plugin-color");
                this._fontFamily = Microsoft.Plugin.Theme.getValue("plugin-font-family");
                this._onThemeChangedBoundFunction = this.onThemeChanged.bind(this);
                Microsoft.Plugin.Theme.addEventListener("themechanged", this._onThemeChangedBoundFunction);
            }
            Object.defineProperty(GraphTimeAxis.prototype, "container", {
                get: function () {
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });
            GraphTimeAxis.prototype.onViewportChanged = function (viewportArgs) {
                if (this._currentTimespan.equals(viewportArgs.currentTimespan)) {
                    return;
                }
                this._currentTimespan = viewportArgs.currentTimespan;
                this.draw();
            };
            GraphTimeAxis.prototype.dispose = function () {
                Microsoft.Plugin.Theme.removeEventListener("themechanged", this._onThemeChangedBoundFunction);
            };
            GraphTimeAxis.prototype.resize = function (evt) {
                var width = this.container.clientWidth;
                if (this._clientWidth === width) {
                    return;
                }
                this._clientWidth = width;
                this._clientHeight = this.container.clientHeight;
                this._canvas.width = this._clientWidth;
                this._canvas.height = this._clientHeight;
                this.draw();
            };
            GraphTimeAxis.prototype.draw = function () {
                var _this = this;
                if (this._currentTimespan.elapsed.equals(F1Viz.BigNumber.zero)) {
                    return;
                }
                this._context.clearRect(0, 0, this._clientWidth, this._clientHeight);
                this._context.strokeStyle = this._strokeStyle;
                this._context.fillStyle = this._fontColor;
                this._context.font = this._fontSize + " " + this._fontFamily;
                this._context.textBaseline = "top";
                var bigHeight = this._clientHeight;
                var mediumHeight = this._clientHeight * .4;
                var smallHeight = this._clientHeight * .2;
                F1Viz.RulerUtilities.getTickMarksPosition(this._currentTimespan, this._clientWidth)
                    .forEach(function (tick) {
                    var position = F1Viz.Utilities.convertToPixel(tick.value, _this._currentTimespan, _this._clientWidth, false);
                    var height = 0;
                    switch (tick.type) {
                        case F1Viz.TickMarkType.Big:
                            _this._context.fillText(F1Viz.RulerUtilities.formatTime(tick.value), position + 2.5, 0);
                            height = bigHeight;
                            break;
                        case F1Viz.TickMarkType.Medium:
                            height = mediumHeight;
                            break;
                        case F1Viz.TickMarkType.Small:
                            height = smallHeight;
                            break;
                    }
                    _this._context.beginPath();
                    _this._context.moveTo(position + .5, 0);
                    _this._context.lineTo(position + .5, height);
                    _this._context.stroke();
                });
            };
            GraphTimeAxis.prototype.onThemeChanged = function () {
                this._strokeStyle = Microsoft.Plugin.Theme.getValue("DiagnosticsHub-GraphLine-Background");
                this._fontSize = Microsoft.Plugin.Theme.getValue("plugin-font-size");
                this._fontColor = Microsoft.Plugin.Theme.getValue("plugin-color");
                this._fontFamily = Microsoft.Plugin.Theme.getValue("plugin-font-family");
            };
            return GraphTimeAxis;
        }());
        F1Viz.GraphTimeAxis = GraphTimeAxis;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var GridLineRenderer = (function () {
            function GridLineRenderer(currentTimespan, horizontalLineCount) {
                this._clientWidth = 0;
                this._clientHeight = 0;
                this._container = document.createElement("canvas");
                this._container.className = "gridLines";
                this._container.style.zIndex = F1Viz.Constants.GridLineZIndex.toString();
                this._context = this._container.getContext("2d");
                this._context.lineWidth = 1;
                this._strokeStyle = Microsoft.Plugin.Theme.getValue("DiagnosticsHub-GraphLine-Background");
                this._currentTimespan = currentTimespan;
                this._horizontalLineCount = horizontalLineCount;
                this._onThemeChangeBoundFunction = this.onThemeChange.bind(this);
                Microsoft.Plugin.Theme.addEventListener("themechanged", this._onThemeChangeBoundFunction);
            }
            Object.defineProperty(GridLineRenderer.prototype, "horizontalLineCount", {
                get: function () {
                    return this._horizontalLineCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLineRenderer.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            GridLineRenderer.prototype.dispose = function () {
                Microsoft.Plugin.Theme.removeEventListener("themechanged", this._onThemeChangeBoundFunction);
            };
            GridLineRenderer.prototype.resize = function (evt) {
                this._clientWidth = this._container.clientWidth;
                this._clientHeight = this._container.clientHeight;
                this._container.width = this._clientWidth;
                this._container.height = this._clientHeight;
                this.render();
            };
            GridLineRenderer.prototype.onViewportChanged = function (viewportArgs) {
                if (this._currentTimespan.equals(viewportArgs.currentTimespan)) {
                    return;
                }
                this._currentTimespan = viewportArgs.currentTimespan;
                this.render();
            };
            GridLineRenderer.prototype.onThemeChange = function () {
                this._strokeStyle = Microsoft.Plugin.Theme.getValue("DiagnosticsHub-GraphLine-Background");
                this.render();
            };
            GridLineRenderer.prototype.render = function () {
                var _this = this;
                var tickMarks = F1Viz.RulerUtilities.getTickMarksPosition(this._currentTimespan, this._clientWidth);
                var elapsedTime = parseInt(this._currentTimespan.elapsed.value);
                this._context.clearRect(0, 0, this._clientWidth, this._clientHeight);
                this._context.strokeStyle = this._strokeStyle;
                tickMarks.forEach(function (tickMark) {
                    if (tickMark.type === F1Viz.TickMarkType.Big) {
                        var position = Math.round((_this._clientWidth * parseInt(F1Viz.BigNumber.subtract(tickMark.value, _this._currentTimespan.begin).value) / elapsedTime));
                        _this._context.beginPath();
                        _this._context.moveTo(position + .5, 0);
                        _this._context.lineTo(position + .5, _this._clientHeight);
                        _this._context.stroke();
                    }
                });
                for (var line = 0; line < this._horizontalLineCount && this._horizontalLineCount > 1; ++line) {
                    var y = (this._clientHeight / (this._horizontalLineCount - 1)) * line;
                    this._context.beginPath();
                    this._context.moveTo(0, y);
                    this._context.lineTo(this._clientWidth, y);
                    this._context.stroke();
                }
            };
            return GridLineRenderer;
        }());
        F1Viz.GridLineRenderer = GridLineRenderer;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var BigNumber = (function () {
            function BigNumber(high, low) {
                this._isHighNegative = false;
                this._isLowNegative = false;
                if (!(typeof high === "number" && high < 0x100000000 && high >= -1 * 0x80000000) ||
                    !(typeof low === "number" && low < 0x100000000 && low >= -1 * 0x80000000)) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                }
                if (high < 0) {
                    high = (high >>> 0);
                    this._isHighNegative = true;
                }
                if (low < 0) {
                    low = (low >>> 0);
                    this._isLowNegative = true;
                }
                this._value = {
                    h: high,
                    l: low
                };
            }
            Object.defineProperty(BigNumber, "oldest", {
                get: function () {
                    return BigNumber.OldestTimestampFormat;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BigNumber, "latest", {
                get: function () {
                    return BigNumber.LatestTimestampFormat;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BigNumber, "zero", {
                get: function () {
                    if (!BigNumber.Zero) {
                        BigNumber.Zero = new BigNumber(0, 0);
                    }
                    return BigNumber.Zero;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BigNumber, "one", {
                get: function () {
                    if (!BigNumber.One) {
                        BigNumber.One = new BigNumber(0, 1);
                    }
                    return BigNumber.One;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BigNumber.prototype, "jsonValue", {
                get: function () {
                    if (!this._jsonValue) {
                        var high = this._value.h;
                        if (this._isHighNegative || high > 0x7fffffff) {
                            high = high << 0;
                        }
                        var low = this._value.l;
                        if (this._isLowNegative || low > 0x7fffffff) {
                            low = low << 0;
                        }
                        this._jsonValue = {
                            h: high,
                            l: low
                        };
                    }
                    return this._jsonValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BigNumber.prototype, "value", {
                get: function () {
                    if (!this._stringValue) {
                        if (this._value.h > 0) {
                            this._stringValue = "0x" +
                                this._value.h.toString(16) +
                                BigNumber.padLeadingZeros(this._value.l.toString(16), 8);
                        }
                        else {
                            this._stringValue = "0x" + this._value.l.toString(16);
                        }
                    }
                    return this._stringValue;
                },
                enumerable: true,
                configurable: true
            });
            BigNumber.max = function (first, second) {
                return first.greaterOrEqual(second) ? first : second;
            };
            BigNumber.min = function (first, second) {
                return first.greaterOrEqual(second) ? second : first;
            };
            BigNumber.add = function (first, second) {
                return BigNumber.addition(first, second);
            };
            BigNumber.subtract = function (first, second) {
                if (second.greater(first)) {
                    return BigNumber.zero;
                }
                var otherTime = BigNumber.convertToManagedTimeFormat(second.jsonValue);
                var negateHigh = ~(otherTime.h);
                var negateLow = ~(otherTime.l);
                var twosComplement = BigNumber.addition(new BigNumber(negateHigh, negateLow), BigNumber.one, true);
                return BigNumber.addition(first, twosComplement, true);
            };
            BigNumber.multiply = function (first, second) {
                return BigNumber.multiplication(first, second);
            };
            BigNumber.divide = function (first, second) {
                return BigNumber.division(first, second, false);
            };
            BigNumber.modulo = function (first, second) {
                return BigNumber.division(first, second, true);
            };
            BigNumber.addNumber = function (first, second) {
                if (second < 0) {
                    return BigNumber.subtract(first, BigNumber.convertFromNumber(-second));
                }
                else {
                    return BigNumber.addition(first, BigNumber.convertFromNumber(second));
                }
            };
            BigNumber.subtractNumber = function (first, second) {
                if (second < 0) {
                    return BigNumber.addition(first, BigNumber.convertFromNumber(-second));
                }
                else {
                    return BigNumber.subtract(first, BigNumber.convertFromNumber(second));
                }
            };
            BigNumber.multiplyNumber = function (first, second) {
                if (second < 0) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                }
                return BigNumber.multiply(first, BigNumber.convertFromNumber(second));
            };
            BigNumber.divideNumber = function (first, second) {
                if (second < 0) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                }
                return BigNumber.divide(first, BigNumber.convertFromNumber(second));
            };
            BigNumber.moduloNumber = function (first, second) {
                if (second < 0) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                }
                return BigNumber.modulo(first, BigNumber.convertFromNumber(second));
            };
            BigNumber.convertFromNumber = function (num) {
                if ((num < 0) || !(num < 0x20000000000000)) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                }
                num = Math.floor(num);
                var low = num & 0xFFFFFFFF;
                if (num <= 0xFFFFFFFF) {
                    return new BigNumber(0, low);
                }
                var highStr = num.toString(16);
                highStr = highStr.substring(0, highStr.length - 8);
                var high = parseInt(highStr, 16);
                return new BigNumber(high, low);
            };
            BigNumber.convertFromBinaryString = function (bits) {
                if (!bits || bits.match("[^10]") || bits.length > 64) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000" + " " + bits));
                }
                var high = 0;
                var low = 0;
                if (bits.length <= 32) {
                    low = parseInt(bits, 2);
                }
                else {
                    low = parseInt(bits.slice(bits.length - 32), 2);
                    high = parseInt(bits.slice(0, bits.length - 32), 2);
                }
                return new BigNumber(high, low);
            };
            BigNumber.getBinaryString = function (timestamp) {
                var lowPart = timestamp._value.l.toString(2);
                if (timestamp._value.h > 0) {
                    return timestamp._value.h.toString(2) + Microsoft.F1Viz.BigNumber.padLeadingZeros(lowPart, 32);
                }
                else {
                    return lowPart;
                }
            };
            BigNumber.padLeadingZeros = function (value, totalLength) {
                var padded = value;
                var zeros = "00000000";
                if (padded && totalLength && totalLength > 0) {
                    while (totalLength - padded.length >= 8) {
                        padded = zeros + padded;
                    }
                    padded = zeros.substr(0, totalLength - padded.length) + padded;
                }
                return padded;
            };
            BigNumber.prototype.equals = function (other) {
                var isEqual = false;
                var otherTime = BigNumber.convertToManagedTimeFormat(other.jsonValue);
                isEqual = (this._value.h === otherTime.h && this._value.l === otherTime.l);
                return isEqual;
            };
            BigNumber.prototype.greater = function (other) {
                var isGreater = false;
                var otherTime = BigNumber.convertToManagedTimeFormat(other.jsonValue);
                if (this._value.h > otherTime.h) {
                    isGreater = true;
                }
                else if (this._value.h === otherTime.h) {
                    if (this._value.l > otherTime.l) {
                        isGreater = true;
                    }
                }
                return isGreater;
            };
            BigNumber.prototype.greaterOrEqual = function (other) {
                var isGreaterOrEqual = false;
                var otherTime = BigNumber.convertToManagedTimeFormat(other.jsonValue);
                if (this._value.h > otherTime.h) {
                    isGreaterOrEqual = true;
                }
                else if (this._value.h === otherTime.h) {
                    if (this._value.l >= otherTime.l) {
                        isGreaterOrEqual = true;
                    }
                }
                return isGreaterOrEqual;
            };
            BigNumber.prototype.compareTo = function (other) {
                if (this.greater(other)) {
                    return 1;
                }
                else if (this.equals(other)) {
                    return 0;
                }
                else {
                    return -1;
                }
            };
            BigNumber.convertToManagedTimeFormat = function (time) {
                var high = time.h < 0 ? time.h >>> 0 : time.h;
                var low = time.l < 0 ? time.l >>> 0 : time.l;
                return {
                    h: high,
                    l: low
                };
            };
            BigNumber.addition = function (first, second, ignoreOverflow) {
                if (ignoreOverflow === void 0) { ignoreOverflow = false; }
                var firstTime = BigNumber.convertToManagedTimeFormat(first.jsonValue);
                var secondTime = BigNumber.convertToManagedTimeFormat(second.jsonValue);
                var low = 0;
                var high = 0;
                var low0 = (firstTime.l & 0xff) + (secondTime.l & 0xff);
                var low8 = (low0 >>> 8) + ((firstTime.l >>> 8) & 0xff) + ((secondTime.l >>> 8) & 0xff);
                low0 = low0 & 0xff;
                var low16 = (low8 >>> 8) + ((firstTime.l >>> 16) & 0xff) + ((secondTime.l >>> 16) & 0xff);
                low8 = low8 & 0xff;
                var low24 = (low16 >>> 8) + ((firstTime.l >>> 24) & 0xff) + ((secondTime.l >>> 24) & 0xff);
                low16 = low16 & 0xff;
                var high0 = (low24 >>> 8) + (firstTime.h & 0xff) + (secondTime.h & 0xff);
                low24 = low24 & 0xff;
                var high8 = (high0 >>> 8) + ((firstTime.h >>> 8) & 0xff) + ((secondTime.h >>> 8) & 0xff);
                high0 = high0 & 0xff;
                var high16 = (high8 >>> 8) + ((firstTime.h >>> 16) & 0xff) + ((secondTime.h >>> 16) & 0xff);
                high8 = high8 & 0xff;
                var high24 = (high16 >>> 8) + ((firstTime.h >>> 24) & 0xff) + ((secondTime.h >>> 24) & 0xff);
                high16 = high16 & 0xff;
                if (!ignoreOverflow && (high24 >>> 8) > 0) {
                    Microsoft.F1Viz.getLogger().error("Addition overflow. Lost upper bits from: 0x" + high24.toString(16));
                    return new BigNumber(0xffffffff, 0xffffffff);
                }
                high24 = high24 & 0xff;
                var finalLow16 = low24 << 8 | low16;
                var finalLow0 = low8 << 8 | low0;
                var finalHigh16 = high24 << 8 | high16;
                var finalHigh0 = high8 << 8 | high0;
                low = (finalLow16 << 16) | finalLow0;
                high = (finalHigh16 << 16) | finalHigh0;
                return new BigNumber(high, low);
            };
            BigNumber.multiplication = function (first, second) {
                var firstTime = BigNumber.convertToManagedTimeFormat(first.jsonValue);
                var secondTime = BigNumber.convertToManagedTimeFormat(second.jsonValue);
                if (firstTime.h === 0 && secondTime.h === 0 &&
                    0 < firstTime.l && firstTime.l <= 0x4000000 &&
                    0 < secondTime.l && secondTime.l <= 0x4000000) {
                    var product = firstTime.l * secondTime.l;
                    return BigNumber.convertFromNumber(product);
                }
                var a1 = firstTime.l & 0xFFFF;
                var a2 = firstTime.l >>> 0x10;
                var a3 = firstTime.h & 0xFFFF;
                var a4 = firstTime.h >>> 0x10;
                var b1 = secondTime.l & 0xFFFF;
                var b2 = secondTime.l >>> 0x10;
                var b3 = secondTime.h & 0xFFFF;
                var b4 = secondTime.h >>> 0x10;
                var c1 = a1 * b1;
                var c2 = c1 >>> 0x10;
                c1 &= 0xFFFF;
                c2 += a2 * b1;
                var c3 = c2 >>> 0x10;
                c2 &= 0xFFFF;
                c2 += a1 * b2;
                c3 += c2 >>> 0x10;
                c2 &= 0xFFFF;
                c3 += a3 * b1;
                var c4 = c3 >>> 0x10;
                c3 &= 0xFFFF;
                c3 += a2 * b2;
                c4 += c3 >>> 0x10;
                c3 &= 0xFFFF;
                c3 += a1 * b3;
                c4 += c3 >>> 0x10;
                c3 &= 0xFFFF;
                c4 += a4 * b1 + a3 * b2 + a2 * b3 + a1 * b4;
                if (c4 > 0xFFFF) {
                    Microsoft.F1Viz.getLogger().error("Multiplication overflow. Lost upper 16-bits from: 0x" + c4.toString(16));
                }
                c4 &= 0xFFFF;
                var productHigh = (c4 << 0x10) | c3;
                var productLow = (c2 << 0x10) | c1;
                return new BigNumber(productHigh, productLow);
            };
            BigNumber.division = function (dividend, divisor, wantRemainder) {
                if (divisor.greater(dividend)) {
                    return wantRemainder ? dividend : BigNumber.zero;
                }
                if (divisor.equals(BigNumber.zero)) {
                    if (wantRemainder) {
                        return dividend;
                    }
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                }
                var dividendBits = BigNumber.getBinaryString(dividend);
                var divisorBits = BigNumber.getBinaryString(divisor);
                var divisorLength = divisorBits.length;
                var dividendLength = dividendBits.length;
                var timeStamp2toThe53 = new BigNumber(0x200000, 0);
                if (timeStamp2toThe53.greater(dividend)) {
                    var dividendNum = parseInt(dividend.value);
                    var divisorNum = parseInt(divisor.value);
                    return wantRemainder ? BigNumber.convertFromNumber(dividendNum % divisorNum) : BigNumber.convertFromNumber(dividendNum / divisorNum);
                }
                var quotientString = "";
                var nextIndex = divisorLength;
                var currDividend = BigNumber.convertFromBinaryString(dividendBits.substr(0, divisorLength));
                while (nextIndex <= dividendLength) {
                    if (currDividend.greater(divisor) || currDividend.equals(divisor)) {
                        quotientString += "1";
                        currDividend = BigNumber.subtract(currDividend, divisor);
                    }
                    else {
                        quotientString += "0";
                    }
                    if (nextIndex !== dividendLength) {
                        currDividend = BigNumber.convertFromBinaryString(BigNumber.getBinaryString(currDividend) + dividendBits[nextIndex]);
                    }
                    nextIndex++;
                }
                return wantRemainder ? currDividend : BigNumber.convertFromBinaryString(quotientString);
            };
            BigNumber.OldestTimestampFormat = {
                h: 0,
                l: 0
            };
            BigNumber.LatestTimestampFormat = {
                h: 0xffffffff,
                l: 0xffffffff
            };
            return BigNumber;
        }());
        F1Viz.BigNumber = BigNumber;
        var JsonTimespan = (function () {
            function JsonTimespan(begin, end) {
                if (begin.greater(end)) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                }
                this._begin = begin;
                this._end = end;
            }
            Object.defineProperty(JsonTimespan.prototype, "begin", {
                get: function () {
                    return this._begin;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JsonTimespan.prototype, "end", {
                get: function () {
                    return this._end;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JsonTimespan.prototype, "elapsed", {
                get: function () {
                    if (!this._elapsed) {
                        this._elapsed = BigNumber.subtract(this.end, this.begin);
                    }
                    return this._elapsed;
                },
                enumerable: true,
                configurable: true
            });
            JsonTimespan.prototype.equals = function (other) {
                return this.begin.equals(other.begin) && this.end.equals(other.end);
            };
            JsonTimespan.prototype.contains = function (time) {
                return time.greaterOrEqual(this.begin) && this.end.greaterOrEqual(time);
            };
            return JsonTimespan;
        }());
        F1Viz.JsonTimespan = JsonTimespan;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var MultiSeriesGraph = (function () {
            function MultiSeriesGraph(config, additionalGraphSeries) {
                var _this = this;
                this._logger = Microsoft.F1Viz.getLogger();
                this._defaultColorScheme = new F1Viz.ChartColorScheme("rgb(118, 174, 200)", "rgba(118, 174, 200, 0.65)");
                this._currentTimespan = new F1Viz.JsonTimespan(F1Viz.BigNumber.zero, F1Viz.BigNumber.zero);
                this._dataSeries = [];
                this._clientWidth = 0;
                this._clientHeight = 0;
                this._scaleIncreaseRatio = 1.1;
                this._scaleChangedEvent = new F1Viz.AggregatedEvent();
                this._container = document.createElement("div");
                this._container.classList.add("graphContainer");
                this._container.tabIndex = 0;
                this._container.style.zIndex = F1Viz.Constants.GraphContainerZIndex.toString();
                this._canvas = document.createElement("canvas");
                this._canvas.classList.add("graph-canvas");
                this._context = this._canvas.getContext("2d");
                this._unitConverter = new F1Viz.LocalizedUnitConverter(config.jsonConfig.Units, config.resources);
                this._currentTimespan = config.timeRange;
                this._scaleMin = config.scale.minimum;
                this._scaleMax = config.scale.maximum;
                this._isScaleFixed = config.scale.isFixed;
                this._onNewSeriesDataBoundFunction = this.onNewSeriesData.bind(this);
                if (config.jsonConfig.Unit) {
                    config.unit = config.resources[config.jsonConfig.Unit];
                }
                this._container.appendChild(this._canvas);
                if (additionalGraphSeries) {
                    additionalGraphSeries.forEach(function (additionalSeries) {
                        additionalSeries.newDataEvent.addEventListener(_this._onNewSeriesDataBoundFunction);
                        _this._dataSeries.push(additionalSeries);
                    });
                }
                this._dataCursor = new F1Viz.DataCursor(this._container, this._dataSeries, this._currentTimespan, config.swimlaneId, this._scaleMin, this._scaleMax);
                this._scaleChangedEvent.addEventListener(this._dataCursor.onScaleChanged.bind(this._dataCursor));
                this._container.appendChild(this._dataCursor.container);
            }
            Object.defineProperty(MultiSeriesGraph.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSeriesGraph.prototype, "scaleChangedEvent", {
                get: function () {
                    return this._scaleChangedEvent;
                },
                enumerable: true,
                configurable: true
            });
            MultiSeriesGraph.prototype.dispose = function () {
                var _this = this;
                this._dataCursor.dispose();
                this._dataSeries.forEach(function (series) {
                    series.newDataEvent.removeEventListener(_this._onNewSeriesDataBoundFunction);
                    if (series.dispose) {
                        series.dispose();
                    }
                });
                this._scaleChangedEvent.dispose();
            };
            MultiSeriesGraph.prototype.resize = function (evt) {
                var width = this._container.clientWidth;
                var height = this._container.clientHeight;
                if (this._clientWidth === width && this._clientHeight === height) {
                    return;
                }
                this._clientWidth = width;
                this._clientHeight = height;
                this._canvas.width = this._clientWidth;
                this._canvas.height = this._clientHeight;
                this._dataCursor.resize(evt);
                this.draw();
            };
            MultiSeriesGraph.prototype.onDataUpdate = function (timestampNs) {
                this._dataSeries.forEach(function (series) {
                    if (series.onDataUpdate) {
                        series.onDataUpdate(timestampNs);
                    }
                });
            };
            MultiSeriesGraph.prototype.addSeriesData = function (counterId, points, fullRender, dropOldData) {
            };
            MultiSeriesGraph.prototype.removeInvalidPoints = function (base) {
            };
            MultiSeriesGraph.prototype.render = function (fullRender, refresh) {
            };
            MultiSeriesGraph.prototype.onViewportChanged = function (viewportArgs) {
                var _this = this;
                if (viewportArgs.isIntermittent || this._currentTimespan.equals(viewportArgs.currentTimespan)) {
                    return;
                }
                this._currentTimespan = viewportArgs.currentTimespan;
                this._dataCursor.onViewportChanged(viewportArgs);
                this._dataSeries.forEach(function (series) {
                    series.onViewportChanged(_this._currentTimespan);
                });
                this.draw();
            };
            MultiSeriesGraph.prototype.onNewSeriesData = function (series) {
                var scaleChanged = false;
                if (!this._isScaleFixed && !isNaN(series.minValue) && series.minValue < this._scaleMin) {
                    this._scaleMin = series.minValue;
                    scaleChanged = true;
                }
                if (!this._isScaleFixed && !isNaN(series.maxValue) && series.maxValue * this._scaleIncreaseRatio > this._scaleMax) {
                    this._scaleMax = series.maxValue * this._scaleIncreaseRatio;
                    scaleChanged = true;
                }
                this.draw();
                if (scaleChanged) {
                    var scaledMax = this._unitConverter.scaleValue(this._scaleMax);
                    this._scaleChangedEvent.invokeEvent({
                        minimum: this._scaleMin,
                        maximum: this._scaleMax,
                        unit: scaledMax.unit
                    });
                }
            };
            MultiSeriesGraph.prototype.draw = function () {
                var _this = this;
                this._context.clearRect(0, 0, this._clientWidth, this._clientHeight);
                this._context.save();
                var graphInfo = {
                    gridX: this._currentTimespan,
                    gridY: new F1Viz.MinMaxNumber(this._scaleMin, this._scaleMax),
                    chartRect: new F1Viz.RectangleDimension(0, 0, this._clientWidth, this._clientHeight)
                };
                this._dataSeries.forEach(function (series) {
                    series.draw(_this._context, graphInfo);
                });
                this._context.restore();
            };
            return MultiSeriesGraph;
        }());
        F1Viz.MultiSeriesGraph = MultiSeriesGraph;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Scale = (function () {
            function Scale(config, scaleType, unitConverter, gridLineRenderer) {
                if (!config) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1002"));
                }
                this._minimum = config.minimum;
                this._maximum = config.maximum;
                this._axes = config.axes;
                this._axesCount = this._axes ? this._axes.length : gridLineRenderer.horizontalLineCount;
                this._unitConverter = unitConverter;
                this._scaleType = scaleType;
                this._container = document.createElement("div");
                this._container.className = this._scaleType === F1Viz.ScaleType.Left ? "graph-scale-left" : "graph-scale-right";
            }
            Object.defineProperty(Scale.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Scale.prototype.resize = function (evt) {
                var height = this._container.clientHeight;
                if (this._clientHeight === height) {
                    return;
                }
                this._clientHeight = height;
                this.render();
            };
            Scale.prototype.onScaleChanged = function (args) {
                this._minimum = args.minimum;
                this._maximum = args.maximum;
                this.render();
            };
            Scale.prototype.render = function () {
                while (this._container.childNodes.length > 0) {
                    this._container.removeChild(this._container.firstChild);
                }
                if (this._axes && this._axes.length > 0) {
                    for (var i = 0; i < this._axes.length; i++) {
                        var axis = this._axes[i];
                        this.drawAxisValue(axis.value);
                    }
                }
                else {
                    var step = (this._maximum - this._minimum) / (this._axesCount - 1);
                    for (var v = this._minimum; v < this._maximum; v += step) {
                        this.drawAxisValue(v);
                    }
                    this.drawAxisValue(this._maximum);
                }
            };
            Scale.prototype.drawAxisValue = function (value) {
                if (value > this._maximum || value < this._minimum) {
                    return;
                }
                var axisDiv = document.createElement("div");
                axisDiv.className = this._scaleType === F1Viz.ScaleType.Left ? "graph-axis-left" : "graph-axis-right";
                var scaledValue = this._unitConverter.scaleValue(value);
                axisDiv.innerHTML = F1Viz.Utilities.formatNumber(scaledValue.value, 0);
                this._container.appendChild(axisDiv);
                var top = 0;
                var y = Math.floor(((this._maximum - value) / (this._maximum - this._minimum)) * this._clientHeight) - (axisDiv.offsetHeight / 2);
                y = Math.max(0, y);
                y = Math.min(y, this._clientHeight - axisDiv.offsetHeight);
                axisDiv.style.top = y + "px";
            };
            return Scale;
        }());
        F1Viz.Scale = Scale;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var SelectionOverlay = (function (_super) {
            __extends(SelectionOverlay, _super);
            function SelectionOverlay(controlToOverlay, currentTimespan, currentSelection, sourceId) {
                _super.call(this, controlToOverlay);
                this._selectionTimeAnchor = null;
                this._animationFrameHandle = null;
                this._currentTimespan = currentTimespan;
                this._currentSelection = currentSelection;
                this._sourceId = sourceId;
                this._container = document.createElement("div");
                this._container.className = "selectionOverlay";
                this._container.style.zIndex = F1Viz.Constants.SelectionOverlayZIndex.toString();
                this._leftUnselectedRegion = document.createElement("div");
                this._rightUnselectedRegion = document.createElement("div");
                this._leftUnselectedRegion.className = "unselected";
                this._leftUnselectedRegion.style.top = "0px";
                this._rightUnselectedRegion.className = "unselected";
                this._rightUnselectedRegion.style.top = "0px";
                this._container.appendChild(this._leftUnselectedRegion);
                this._container.appendChild(controlToOverlay.container);
                this._container.appendChild(this._rightUnselectedRegion);
                this._container.onmousedown = this.onStartSelection.bind(this);
                this._container.onmousemove = this.onDragSelection.bind(this);
                this._container.onmouseup = this.onStopSelection.bind(this);
                this._viewEventManager = Microsoft.F1Viz.getViewEventManager();
            }
            Object.defineProperty(SelectionOverlay.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            SelectionOverlay.prototype.dispose = function () {
                this._container.onmousedown = null;
                this._container.onmousemove = null;
                this._container.onmouseup = null;
                _super.prototype.dispose.call(this);
            };
            SelectionOverlay.prototype.resize = function (evt) {
                this._clientWidth = this._container.clientWidth;
                this._clientRect = this._container.getBoundingClientRect();
                this.updateDom();
                _super.prototype.resize.call(this, evt);
            };
            SelectionOverlay.prototype.onViewportChanged = function (viewportArgs) {
                this._currentTimespan = viewportArgs.currentTimespan;
                this._currentSelection = viewportArgs.selectionTimespan;
                this.updateDom();
                _super.prototype.onViewportChanged.call(this, viewportArgs);
            };
            SelectionOverlay.prototype.onStartSelection = function (event) {
                if (event.which !== F1Viz.Common.MouseCodes.Left) {
                    return;
                }
                if (this._animationFrameHandle) {
                    this.onStopSelection(event);
                    return;
                }
                this._selectionTimeAnchor = F1Viz.Utilities.getTimestampAtPixel(event.clientX - this._clientRect.left, this._clientWidth, this._currentTimespan);
                this._currentSelection = new F1Viz.JsonTimespan(this._selectionTimeAnchor, F1Viz.BigNumber.addNumber(this._selectionTimeAnchor, F1Viz.Utilities.translateNumPixelToDuration(F1Viz.SwimlaneViewConstants.MinSelectionInPixels, this._clientWidth, this._currentTimespan)));
                F1Viz.Utilities.setCapture(this._container);
                this.container.classList.add("selectionActive");
                this._animationFrameHandle = window.requestAnimationFrame(this.onSelectionAnimation.bind(this));
                event.stopPropagation();
            };
            SelectionOverlay.prototype.onDragSelection = function (event) {
                if (event.target !== this._container || event.which !== F1Viz.Common.MouseCodes.Left) {
                    return;
                }
                else if (!this._animationFrameHandle) {
                    return;
                }
                var left = Math.max(event.clientX - this._clientRect.left, 0);
                left = Math.min(left, this._clientWidth);
                var xTime = F1Viz.Utilities.getTimestampAtPixel(left, this._clientWidth, this._currentTimespan);
                if (this._selectionTimeAnchor.greater(xTime)) {
                    this._currentSelection = new F1Viz.JsonTimespan(xTime, this._selectionTimeAnchor);
                }
                else {
                    this._currentSelection = new F1Viz.JsonTimespan(this._selectionTimeAnchor, xTime);
                }
                event.stopPropagation();
            };
            SelectionOverlay.prototype.onStopSelection = function (event) {
                if (event.which !== F1Viz.Common.MouseCodes.Left) {
                    return;
                }
                else if (!this._animationFrameHandle) {
                    return;
                }
                F1Viz.Utilities.releaseCapture(this._container);
                window.cancelAnimationFrame(this._animationFrameHandle);
                this._animationFrameHandle = null;
                this.container.classList.remove("selectionActive");
                this.raiseSelectionChanged(false);
                var isMinSelection = false;
                if (this._currentSelection) {
                    isMinSelection = F1Viz.Utilities.getTimestampAtPixel(F1Viz.SwimlaneViewConstants.MinSelectionInPixels, this._clientWidth, this._currentTimespan)
                        .greaterOrEqual(this._currentSelection.elapsed);
                }
            };
            SelectionOverlay.prototype.onSelectionAnimation = function () {
                this.raiseSelectionChanged(true);
                this._animationFrameHandle = window.requestAnimationFrame(this.onSelectionAnimation.bind(this));
            };
            SelectionOverlay.prototype.raiseSelectionChanged = function (isIntermittent) {
                if (isIntermittent === void 0) { isIntermittent = false; }
                this._viewEventManager.selectionChanged.invokeEvent({
                    position: this._currentSelection,
                    isIntermittent: isIntermittent
                });
            };
            SelectionOverlay.prototype.updateDom = function () {
                if (this._currentSelection) {
                    var left = F1Viz.Utilities.convertToPixel(this._currentSelection.begin, this._currentTimespan, this._clientWidth);
                    left = Math.max(left, 0);
                    var right = F1Viz.Utilities.convertToPixel(this._currentSelection.end, this._currentTimespan, this._clientWidth);
                    var rightWidth = (this._clientWidth - right);
                    rightWidth = Math.max(rightWidth, 0);
                    this._leftUnselectedRegion.style.width = left + "px";
                    this._rightUnselectedRegion.style.left = right + "px";
                    this._rightUnselectedRegion.style.width = rightWidth + "px";
                }
                else {
                    this._leftUnselectedRegion.style.width = "0px";
                    this._rightUnselectedRegion.style.left = this._clientWidth + "px";
                    this._rightUnselectedRegion.style.width = "0px";
                }
            };
            SelectionOverlay.prototype.removeSelection = function () {
                this._currentSelection = null;
                this.updateDom();
            };
            return SelectionOverlay;
        }(F1Viz.ControlDecorator));
        F1Viz.SelectionOverlay = SelectionOverlay;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var SummaryDataSeries = (function () {
            function SummaryDataSeries(viewport, title, formattableTooltipText, unitConverter, marshaler) {
                var _this = this;
                this._logger = F1Viz.getLogger();
                this._minValue = Number.MAX_VALUE;
                this._maxValue = Number.MIN_VALUE;
                this._data = [];
                this._width = 250;
                this._color = new F1Viz.ChartColorScheme("rgb(118, 174, 200)", "");
                this._newDataEvent = new F1Viz.AggregatedEvent();
                this._viewport = viewport;
                this._title = title;
                this._formattableTooltipText = formattableTooltipText;
                this._unitConverter = unitConverter;
                this._marker = document.createElement("div");
                this._marker.classList.add("countersDataSeries-marker");
                this._marker.style.backgroundColor = this._color.lineColor;
                this._marker.style.width = "7px";
                this._marker.style.height = "7px";
                marshaler.getSummaryGraphData().then(function (dto) {
                    _this._data = _this.convertDtoToIPointArray(dto);
                    _this._newDataEvent.invokeEvent(_this);
                });
            }
            Object.defineProperty(SummaryDataSeries.prototype, "minValue", {
                get: function () {
                    return this._minValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryDataSeries.prototype, "maxValue", {
                get: function () {
                    return this._maxValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryDataSeries.prototype, "marker", {
                get: function () {
                    return this._marker;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryDataSeries.prototype, "title", {
                get: function () {
                    return this._title;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryDataSeries.prototype, "newDataEvent", {
                get: function () {
                    return this._newDataEvent;
                },
                enumerable: true,
                configurable: true
            });
            SummaryDataSeries.prototype.dispose = function () {
                this._newDataEvent.dispose();
            };
            SummaryDataSeries.prototype.onDataUpdate = function (timestamp) {
            };
            SummaryDataSeries.prototype.onViewportChanged = function (viewport) {
                this._viewport = viewport;
            };
            SummaryDataSeries.prototype.draw = function (context, info) {
                if (this._data.length === 0) {
                    return;
                }
                if (info.chartRect.width !== this._width) {
                    this._width = info.chartRect.width;
                }
                var getXCoordinate = function (point) { return F1Viz.Utilities.convertToPixel(point.Timestamp, info.gridX, info.chartRect.width, false); };
                var getYCoordinate = function (point) { return info.chartRect.height - F1Viz.Utilities.scaleToRange(point.Value, info.gridY.min, info.gridY.max, 0, info.chartRect.height); };
                context.save();
                context.lineWidth = (info.chartRect.height < 100 ? 1 : 2);
                context.fillStyle = this._color.lineFillColor;
                context.strokeStyle = this._color.lineColor;
                var initialxPx = Microsoft.Plugin.F12 ? 0 : getXCoordinate(this._data[0]);
                context.beginPath();
                context.moveTo(initialxPx, getYCoordinate(this._data[0]));
                this._data.forEach(function (point) { return context.lineTo(getXCoordinate(point), getYCoordinate(point)); });
                context.stroke();
                context.restore();
            };
            SummaryDataSeries.prototype.getPointAtTimestamp = function (timestamp, pointToFind) {
                if (pointToFind === void 0) { pointToFind = F1Viz.PointToFind.Nearest; }
                if (this._data.length === 0) {
                    return null;
                }
                var point = { Timestamp: timestamp, Value: 0 };
                var pointCompare = function (left, right) {
                    return right.Timestamp.greater(left.Timestamp);
                };
                switch (pointToFind) {
                    case F1Viz.PointToFind.LessThanOrEqual:
                        var index = F1Viz.Utilities.findLessThan(this._data, point, pointCompare);
                        point = this._data[index];
                        break;
                    case F1Viz.PointToFind.GreaterThanOrEqual:
                        var index = F1Viz.Utilities.findGreaterThan(this._data, point, pointCompare);
                        point = this._data[index];
                        break;
                    case F1Viz.PointToFind.Nearest:
                        var lowIndex = F1Viz.Utilities.findLessThan(this._data, point, pointCompare);
                        var lowPoint = this._data[lowIndex];
                        if (lowIndex === this._data.length - 1 || this._data[0].Timestamp.greater(timestamp)) {
                            point.Value = lowPoint.Value;
                            point.Timestamp = lowPoint.Timestamp;
                        }
                        else {
                            var highPoint = this._data[Math.min(lowIndex + 1, this._data.length - 1)];
                            point.Value = F1Viz.Utilities.linearInterpolate(timestamp, lowPoint.Timestamp, lowPoint.Value, highPoint.Timestamp, highPoint.Value);
                        }
                        break;
                }
                return {
                    timestamp: point.Timestamp,
                    tooltip: F1Viz.Utilities.formatString(this._formattableTooltipText, this._unitConverter.formatNumber(point.Value)),
                    color: this._color,
                    value: point.Value
                };
            };
            SummaryDataSeries.prototype.convertDtoToIPointArray = function (dto) {
                var _this = this;
                return dto.map(function (dtoPoint) {
                    _this._minValue = Math.min(_this._minValue, dtoPoint.v);
                    _this._maxValue = Math.max(_this._maxValue, dtoPoint.v);
                    return {
                        Timestamp: new F1Viz.BigNumber(dtoPoint.t.h, dtoPoint.t.l),
                        Value: dtoPoint.v,
                    };
                });
            };
            return SummaryDataSeries;
        }());
        F1Viz.SummaryDataSeries = SummaryDataSeries;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var SwimlaneBase = (function () {
            function SwimlaneBase(titleConfig, contentHeight, currentTimespan, timeFilter, selectionTimespan) {
                var _this = this;
                if (timeFilter === void 0) { timeFilter = null; }
                if (selectionTimespan === void 0) { selectionTimespan = null; }
                this._clientWidth = 0;
                this._clientHeight = 0;
                this._isVisible = true;
                this._controls = [];
                this._swimlaneVisibilityChangedEvent = new F1Viz.AggregatedEvent();
                this._container = document.createElement("div");
                this._container.classList.add("swimlaneBase");
                this._currentTimespan = currentTimespan;
                this._timeFilter = timeFilter;
                this._selectionTimespan = selectionTimespan;
                this._isVisible = titleConfig.isBodyExpanded;
                this._titleRegion = document.createElement("div");
                this._contentRegion = document.createElement("div");
                this._leftRegion = document.createElement("div");
                this._mainRegion = document.createElement("div");
                this._rightRegion = document.createElement("div");
                this._titleRegion.classList.add("titleRegion");
                this._contentRegion.classList.add("contentRegion");
                this._leftRegion.classList.add("leftRegion");
                this._mainRegion.classList.add("mainRegion");
                this._rightRegion.classList.add("rightRegion");
                this._contentRegion.style.height = contentHeight + "px";
                this._contentRegion.appendChild(this._leftRegion);
                this._contentRegion.appendChild(this._mainRegion);
                this._contentRegion.appendChild(this._rightRegion);
                this._titleText = titleConfig.titleText;
                this._unit = titleConfig.unit;
                this._titleContainer = document.createElement("div");
                this._titleContainer.className = "title-container";
                this._titleCollapseExpandButton = document.createElement("div");
                this._titleCollapseExpandButton.setAttribute("role", "button");
                this._titleCollapseExpandButton.setAttribute("aria-label", this._titleText);
                this._titleCollapseExpandButton.tabIndex = 0;
                this._titleCollapseExpandButton.onclick = this.toggleVisibility.bind(this);
                this._titleCollapseExpandButton.onkeydown = this.onKeyDown.bind(this);
                this._titleContainer.appendChild(this._titleCollapseExpandButton);
                this._titleTextElement = document.createElement("div");
                this._titleTextElement.className = "title-text";
                this._titleContainer.appendChild(this._titleTextElement);
                this._container.appendChild(this._titleContainer);
                this._container.appendChild(this._titleRegion);
                this._container.appendChild(this._contentRegion);
                this.updateTitle();
                this.updateContentVisibility();
                this._collapseCallback = function (mql) {
                    if (mql.matches) {
                        _this._titleRegion.classList.add("limitedSpace");
                    }
                    else {
                        _this._titleRegion.classList.remove("limitedSpace");
                    }
                };
                this.updateCollapsingWidth();
            }
            Object.defineProperty(SwimlaneBase.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SwimlaneBase.prototype, "swimlaneVisibilityChangedEvent", {
                get: function () {
                    return this._swimlaneVisibilityChangedEvent;
                },
                enumerable: true,
                configurable: true
            });
            SwimlaneBase.prototype.dispose = function () {
                this._swimlaneVisibilityChangedEvent.dispose();
                this._titleCollapseExpandButton.onclick = null;
                this._titleCollapseExpandButton.onkeydown = null;
                this._controls.forEach(function (control) {
                    if (control.dispose) {
                        control.dispose();
                    }
                });
            };
            SwimlaneBase.prototype.resize = function (evt) {
                if (!this._clientWidth && !this._clientHeight) {
                    this.updateCollapsingWidth();
                }
                if (this._clientWidth === this._container.clientWidth && this._clientHeight === this._container.clientHeight) {
                    return;
                }
                this._clientHeight = this._container.clientHeight;
                this._clientWidth = this._container.clientWidth;
                if (!this._isVisible) {
                    return;
                }
                this._controls.forEach(function (control) {
                    if (control.resize) {
                        control.resize(evt);
                    }
                });
            };
            SwimlaneBase.prototype.onViewportChanged = function (viewportArgs) {
                this._currentTimespan = viewportArgs.currentTimespan;
                this._selectionTimespan = viewportArgs.selectionTimespan;
                if (this._isVisible) {
                    this._controls.forEach(function (control) {
                        if (control.onViewportChanged) {
                            control.onViewportChanged(viewportArgs);
                        }
                    });
                }
            };
            SwimlaneBase.prototype.onDataUpdate = function (timestampNs) {
                this._controls.forEach(function (control) {
                    if (control.onDataUpdate) {
                        control.onDataUpdate(timestampNs);
                    }
                });
            };
            SwimlaneBase.prototype.onScaleChanged = function (args) {
                this._unit = args.unit || this._unit;
                this.updateTitle();
            };
            SwimlaneBase.prototype.addTitleControl = function (control) {
                this._titleRegion.appendChild(control.container);
                this._controls.push(control);
                this.updateCollapsingWidth();
            };
            SwimlaneBase.prototype.addLeftRegionControl = function (control) {
                this._leftRegion.appendChild(control.container);
                this._controls.push(control);
            };
            SwimlaneBase.prototype.addRightRegionControl = function (control) {
                this._rightRegion.appendChild(control.container);
                this._controls.push(control);
            };
            SwimlaneBase.prototype.addMainRegionControl = function (control) {
                this._mainRegion.appendChild(control.container);
                this._controls.push(control);
            };
            SwimlaneBase.prototype.setTimeFilter = function (timeFilter) {
                this._timeFilter = timeFilter;
                this.updateTitle();
            };
            SwimlaneBase.prototype.onKeyDown = function (e) {
                if (F1Viz.Common.KeyCodes.Enter === e.keyCode) {
                    this.toggleVisibility();
                }
            };
            SwimlaneBase.prototype.toggleVisibility = function () {
                this._isVisible = !this._isVisible;
                this.updateContentVisibility();
                if (this._isVisible) {
                    this.resize(null);
                    this.onViewportChanged({
                        currentTimespan: this._currentTimespan,
                        selectionTimespan: this._selectionTimespan,
                        isIntermittent: false
                    });
                }
                this._swimlaneVisibilityChangedEvent.invokeEvent(this._isVisible);
            };
            SwimlaneBase.prototype.updateTitle = function () {
                var text = this._titleText;
                if (this._unit) {
                    text += " (" + this._unit + ")";
                }
                if (this._timeFilter) {
                    var text = Microsoft.Plugin.Resources.getString("SummaryView_GraphTitleFormattedWithTime", text, F1Viz.RulerUtilities.formatTime(this._timeFilter.begin), F1Viz.RulerUtilities.formatTime(this._timeFilter.end));
                }
                this._titleTextElement.innerHTML = text;
            };
            SwimlaneBase.prototype.updateContentVisibility = function () {
                if (this._isVisible) {
                    this._titleCollapseExpandButton.className = "title-expanded-button";
                    this._contentRegion.style.display = "-ms-grid";
                    this._titleRegion.classList.remove("collapsed");
                }
                else {
                    this._titleCollapseExpandButton.className = "title-collapsed-button";
                    this._contentRegion.style.display = "none";
                    this._titleRegion.classList.add("collapsed");
                }
                this._titleCollapseExpandButton.setAttribute("aria-expanded", String(this._isVisible));
            };
            SwimlaneBase.prototype.updateCollapsingWidth = function () {
                if (this._collapseMediaQuery) {
                    this._collapseMediaQuery.removeListener(this._collapseCallback);
                }
                var preferredWidth = this._titleContainer.offsetWidth + this._titleRegion.offsetWidth;
                this._collapseMediaQuery = window.matchMedia(F1Viz.Utilities.formatString("(max-width: {0}px)", preferredWidth.toString()));
                this._collapseMediaQuery.addListener(this._collapseCallback);
            };
            return SwimlaneBase;
        }());
        F1Viz.SwimlaneBase = SwimlaneBase;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var TimeFilterOverlay = (function (_super) {
            __extends(TimeFilterOverlay, _super);
            function TimeFilterOverlay(controlToOverlay, currentTimespan, timeFilter) {
                _super.call(this, controlToOverlay);
                this._currentTimespan = currentTimespan;
                this._timeFilter = timeFilter;
                this._container = document.createElement("div");
                this._container.className = "timeFilterOverlay";
                this._container.style.zIndex = (F1Viz.Constants.SelectionOverlayZIndex - 1).toString();
                this._timeFilterOverlay = document.createElement("div");
                this._timeFilterOverlay.className = "timeFilter";
                if (this._timeFilter === null) {
                    this._timeFilterOverlay.classList.add("hidden");
                }
                this._container.appendChild(this._timeFilterOverlay);
                this._container.appendChild(controlToOverlay.container);
            }
            Object.defineProperty(TimeFilterOverlay.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            TimeFilterOverlay.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
            };
            TimeFilterOverlay.prototype.resize = function (evt) {
                this._clientWidth = this._container.clientWidth;
                this.updateDom();
                _super.prototype.resize.call(this, evt);
            };
            TimeFilterOverlay.prototype.onViewportChanged = function (viewportArgs) {
                this._currentTimespan = viewportArgs.currentTimespan;
                this.updateDom();
                _super.prototype.onViewportChanged.call(this, viewportArgs);
            };
            TimeFilterOverlay.prototype.updateDom = function () {
                if (this._timeFilter === null) {
                    return;
                }
                var left = F1Viz.Utilities.convertToPixel(this._timeFilter.begin, this._currentTimespan, this._clientWidth);
                left = Math.max(left, 0);
                var right = F1Viz.Utilities.convertToPixel(this._timeFilter.end, this._currentTimespan, this._clientWidth);
                right = Math.max(right, 0);
                this._timeFilterOverlay.style.left = left + "px";
                this._timeFilterOverlay.style.width = (right - left) + "px";
            };
            TimeFilterOverlay.prototype.updateTimespan = function (newTimespan) {
                if (newTimespan) {
                    this._timeFilterOverlay.classList.remove("hidden");
                }
                else {
                    this._timeFilterOverlay.classList.add("hidden");
                }
                this._timeFilter = newTimespan;
                this.updateDom();
            };
            return TimeFilterOverlay;
        }(F1Viz.ControlDecorator));
        F1Viz.TimeFilterOverlay = TimeFilterOverlay;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var ViewEventManager = (function () {
            function ViewEventManager() {
                this._selectionChangedEvent = new F1Viz.AggregatedEvent();
            }
            Object.defineProperty(ViewEventManager.prototype, "selectionChanged", {
                get: function () {
                    return this._selectionChangedEvent;
                },
                enumerable: true,
                configurable: true
            });
            return ViewEventManager;
        }());
        var _viewEventManager = null;
        function getViewEventManager() {
            if (_viewEventManager === null) {
                _viewEventManager = new ViewEventManager();
            }
            return _viewEventManager;
        }
        F1Viz.getViewEventManager = getViewEventManager;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var AllocationViewModel = (function () {
            function AllocationViewModel(hasLifetimeData, additionalActions, context) {
                var _this = this;
                this._treeGrid = ko.observable();
                this._hasLifetimeData = hasLifetimeData;
                F1Viz.AllocationDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeaderConfig(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    header.sortDirection(F1Viz.SortDirection.Desc);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "Allocation_TreeGridAriaLabel"));
                    _this._hotPathToggleButton = new F1Viz.ToggleButtonViewModel('hotPathIcon', 'hotPathDisabledIcon', 'CallTree_ShowHighlighting');
                    _this._treeGrid().showHotPathHighlighting = _this._hotPathToggleButton.isChecked;
                    additionalActions([
                        { template: 'ToolbarItemView', viewModel: new F1Viz.ToolbarItemViewModel('hotItemIcon', 'CallTree_ExpandHotPath', function () { return _this.onExpandHotPath(); }) },
                        { template: 'ToggleButtonView', viewModel: _this._hotPathToggleButton },
                        { template: 'ToolbarItemView', viewModel: new F1Viz.ToolbarItemViewModel('noiseReductionIcon', 'CallTree_NoiseReduction', function () { return _this.onShowNoiseReduction(); }) },
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'Allocation_SearchAriaLabel') }
                    ]);
                    if (context && context.ctype === F1Viz.ContextType.Type) {
                        _this._treeGrid().dataLoadPromise.then(function () {
                            var allRows = _this._treeGrid().treeAsArray();
                            for (var rowIndex = 0; rowIndex < allRows.length; ++rowIndex) {
                                var row = allRows[rowIndex];
                                if (row.dto.k.ctype === context.ctype && row.dto.k.cid === context.cid) {
                                    _this._treeGrid().selectedRows.push(rowIndex);
                                    break;
                                }
                            }
                        });
                    }
                    _this.queryForInfoBar();
                    _this._treeGrid().dataLoadPromise.then(function () { return _this.onExpandHotPath(); });
                });
            }
            Object.defineProperty(AllocationViewModel.prototype, "treeGrid", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            AllocationViewModel.prototype.dispose = function () {
                this._dao.clearCache();
            };
            AllocationViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var treeRow = viewModel;
                if (!treeRow.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                var menuItems = [{
                        label: Resources.getString("ContextMenu_ExpandAll"),
                        callback: function () { return F1Viz.TreeGridUtils.expandAll(_this._treeGrid(), _this._dao); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_CollapseAll"),
                        callback: function () { return F1Viz.TreeGridUtils.collapseAll(_this._treeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ExpandSelection"),
                        callback: function () { return F1Viz.TreeGridUtils.expandSelection(_this._treeGrid(), _this._dao); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_CollapseSelection"),
                        callback: function () { return F1Viz.TreeGridUtils.collapseSelected(_this._treeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ExpandHotPath"),
                        callback: this.onExpandHotPath.bind(this),
                        type: ContextMenu.MenuItemType.command
                    }];
                if (this._hasLifetimeData && treeRow.dto.k && treeRow.dto.k.ctype === F1Viz.ContextType.Type) {
                    menuItems.push({
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ShowInLifetimeView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.ObjectLifetime, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                else if (treeRow.dto.k && treeRow.dto.k.ctype === F1Viz.ContextType.Function) {
                    menuItems.push({
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ViewSource"),
                        disabled: function () { return !treeRow.dto.rsf; },
                        callback: function () { return _this._dao.viewSource(treeRow.dto.rsf, treeRow.functionLineNumber); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInModulesView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Modules, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInFunctionsView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Functions, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowFunctionDetails"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.FunctionDetails, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCallingFunctions", treeRow.name),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.CallerCallee, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCalledFunctions", treeRow.name),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.CallerCallee, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                menuItems.push({
                    type: ContextMenu.MenuItemType.separator
                }, {
                    label: Resources.getString("ContextMenu_Copy"),
                    callback: this.onCopy.bind(this),
                    type: ContextMenu.MenuItemType.command
                }, {
                    label: Resources.getString("ContextMenu_SelectStack"),
                    callback: this.onSelectStack.bind(this),
                    type: ContextMenu.MenuItemType.command
                });
                return ContextMenu.create(menuItems);
            };
            AllocationViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            AllocationViewModel.prototype.onExpandFoldedNodes = function () {
            };
            AllocationViewModel.prototype.onExpandHotPath = function () {
                var _this = this;
                this._treeGrid().treeAsArray().forEach(function (row) {
                    row.isHotPath(false);
                    row.isHotItem(false);
                });
                var currentNode = this._treeGrid().focusedRow();
                var currentChildren = currentNode ? [currentNode] : this._treeGrid().roots();
                var expandPath = function (result) {
                    var nodeToHighlight = result.shift();
                    for (var nodeIndex = 0; nodeIndex < currentChildren.length; ++nodeIndex) {
                        currentNode = currentChildren[nodeIndex];
                        if (currentNode.id === nodeToHighlight.id) {
                            currentNode.isHotItem(nodeToHighlight.hi);
                            currentNode.isHotPath(nodeToHighlight.hp);
                            break;
                        }
                    }
                    if (result.length > 0) {
                        if (!nodeToHighlight.f) {
                            return expandPath(result);
                        }
                        else if (!currentNode.expanded()) {
                            return _this._dao.expand(currentNode, _this._treeGrid().header.sortInfo())
                                .then(function () { return currentChildren = currentNode.children(); })
                                .then(function () { return expandPath(result); });
                        }
                        else {
                            currentChildren = currentNode.children();
                            return expandPath(result);
                        }
                    }
                    ko.tasks.schedule(function () {
                        var indexToSelect = _this._treeGrid().treeAsArray().indexOf(currentNode);
                        _this._treeGrid().selectedRows([indexToSelect]);
                    });
                    return;
                };
                this._dao.expandHotPath(currentNode)
                    .then(function (path) {
                    return expandPath(path);
                }).then(function () {
                    _this._hotPathToggleButton.isEnabled(true);
                    _this._hotPathToggleButton.isChecked(true);
                });
            };
            AllocationViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid());
                window.clipboardData.setData("Text", formatted);
            };
            AllocationViewModel.prototype.onSelectStack = function () {
                F1Viz.TreeGridUtils.selectParentsOfFocusedRow(this._treeGrid());
            };
            AllocationViewModel.prototype.onShowNoiseReduction = function () {
                var _this = this;
                this._dao.showNoiseReduction()
                    .then(function (applied) {
                    if (!applied) {
                        return;
                    }
                    _this._treeGrid().reloadData();
                    return _this.queryForInfoBar();
                });
            };
            AllocationViewModel.prototype.queryForInfoBar = function () {
                var _this = this;
                return this._dao.shouldShowInfoBar().then(function (showInfoBar) {
                    var infoBarProvider = F1Viz.getInfoBarProvider();
                    if (showInfoBar) {
                        var infoBar = new F1Viz.InformationBarControl("CallTree_InfoNoiseReductionEnabled", function () { return infoBarProvider.clearInfoBars(); }, "CallTree_InfoNoiseReductionConfigureLink", function () { return _this.onShowNoiseReduction(); });
                        infoBarProvider.showInfoBar(infoBar);
                    }
                    else {
                        infoBarProvider.clearInfoBars();
                    }
                });
            };
            return AllocationViewModel;
        }());
        F1Viz.AllocationViewModel = AllocationViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var CallTreeViewModel = (function () {
            function CallTreeViewModel(additionalActions) {
                var _this = this;
                this._treeGrid = ko.observable();
                this._subscriptions = [];
                F1Viz.CallTreeDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    header.sortDirection(F1Viz.SortDirection.Desc);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "CallTree_TreeGridAriaLabel"));
                    _this._hotPathToggleButton = new F1Viz.ToggleButtonViewModel('hotPathIcon', 'hotPathDisabledIcon', 'CallTree_ShowHighlighting');
                    _this._treeGrid().showHotPathHighlighting = _this._hotPathToggleButton.isChecked;
                    additionalActions([
                        { template: 'ToolbarItemView', viewModel: new F1Viz.ToolbarItemViewModel('hotItemIcon', 'CallTree_ExpandHotPath', function () { return _this.onExpandHotPath(); }) },
                        { template: 'ToggleButtonView', viewModel: _this._hotPathToggleButton },
                        { template: 'ToolbarItemView', viewModel: new F1Viz.ToolbarItemViewModel('noiseReductionIcon', 'CallTree_NoiseReduction', function () { return _this.onShowNoiseReduction(); }) },
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'CallTree_SearchAriaLabel') }
                    ]);
                    _this.queryForInfoBar();
                    _this._subscriptions.push(_this._dao.root.subscribe(function () {
                        _this._treeGrid().reloadData();
                        _this._treeGrid().dataLoadPromise.then(function () { return _this.onExpandHotPath(); });
                    }));
                    _this._treeGrid().dataLoadPromise.then(function () { return _this.onExpandHotPath(); });
                });
            }
            Object.defineProperty(CallTreeViewModel.prototype, "treeGrid", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            CallTreeViewModel.prototype.dispose = function () {
                this._dao.clearCache();
                this._subscriptions.forEach(function (s) { return s.dispose(); });
            };
            CallTreeViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var treeRow = viewModel;
                if (!treeRow.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                var config = [{
                        label: Resources.getString("CallTree_ContextMenuSetRoot"),
                        callback: function () { return _this._dao.root(treeRow.dto); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("CallTree_ContextMenuResetRoot"),
                        callback: function () { return _this._dao.root(null); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ExpandAll"),
                        callback: function () { return F1Viz.TreeGridUtils.expandAll(_this._treeGrid(), _this._dao); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_CollapseAll"),
                        callback: function () { return F1Viz.TreeGridUtils.collapseAll(_this._treeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ExpandSelection"),
                        callback: function () { return F1Viz.TreeGridUtils.expandSelection(_this._treeGrid(), _this._dao); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_CollapseSelection"),
                        callback: function () { return F1Viz.TreeGridUtils.collapseSelected(_this._treeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ExpandHotPath"),
                        callback: this.onExpandHotPath.bind(this),
                        type: ContextMenu.MenuItemType.command
                    }, {
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ViewSource"),
                        disabled: function () { return !treeRow.dto.rsf; },
                        callback: function () { return _this._dao.viewSource(treeRow.dto.rsf, treeRow.functionLineNumber); },
                        type: ContextMenu.MenuItemType.command
                    }];
                if (treeRow.dto.k && treeRow.dto.k.ctype === F1Viz.ContextType.Function) {
                    config.push({
                        label: Resources.getString("ContextMenu_ShowInModulesView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Modules, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInFunctionsView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Functions, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowFunctionDetails"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.FunctionDetails, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCallingFunctions", treeRow.name),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.CallerCallee, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCalledFunctions", treeRow.name),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.CallerCallee, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                config.push({
                    type: ContextMenu.MenuItemType.separator
                }, {
                    label: Resources.getString("ContextMenu_Copy"),
                    callback: this.onCopy.bind(this),
                    type: ContextMenu.MenuItemType.command
                }, {
                    label: Resources.getString("ContextMenu_SelectStack"),
                    callback: function () { return F1Viz.TreeGridUtils.selectParentsOfFocusedRow(_this._treeGrid()); },
                    type: ContextMenu.MenuItemType.command,
                    disabled: function () { return _this._treeGrid().focusedRowIndex() === -1; }
                });
                return ContextMenu.create(config);
            };
            CallTreeViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            CallTreeViewModel.prototype.onExpandFoldedNodes = function () {
            };
            CallTreeViewModel.prototype.onExpandHotPath = function () {
                var _this = this;
                this._treeGrid().treeAsArray().forEach(function (row) {
                    row.isHotPath(false);
                    row.isHotItem(false);
                });
                var currentNode = this._treeGrid().focusedRow() || (this._dao.root() ? this._treeGrid().roots()[0] : null);
                var currentChildren = currentNode ? [currentNode] : this._treeGrid().roots();
                var expandPath = function (result) {
                    var nodeToHighlight = result.shift();
                    for (var nodeIndex = 0; nodeIndex < currentChildren.length; ++nodeIndex) {
                        currentNode = currentChildren[nodeIndex];
                        if (currentNode.id === nodeToHighlight.id) {
                            currentNode.isHotItem(nodeToHighlight.hi);
                            currentNode.isHotPath(nodeToHighlight.hp);
                            break;
                        }
                    }
                    if (result.length > 0) {
                        if (!nodeToHighlight.f) {
                            return expandPath(result);
                        }
                        else if (!currentNode.expanded()) {
                            return _this._dao.expand(currentNode, _this._treeGrid().header.sortInfo())
                                .then(function () { return currentChildren = currentNode.children(); })
                                .then(function () { return expandPath(result); });
                        }
                        else {
                            currentChildren = currentNode.children();
                            return expandPath(result);
                        }
                    }
                    ko.tasks.schedule(function () {
                        var indexToSelect = _this._treeGrid().treeAsArray().indexOf(currentNode);
                        if (-1 !== indexToSelect) {
                            _this._treeGrid().selectedRows([indexToSelect]);
                        }
                    });
                    return;
                };
                this._dao.expandHotPath(currentNode)
                    .then(function (path) {
                    if (!currentNode) {
                        path.shift();
                    }
                    return expandPath(path);
                }).then(function () {
                    _this._hotPathToggleButton.isEnabled(true);
                    _this._hotPathToggleButton.isChecked(true);
                });
            };
            CallTreeViewModel.prototype.onShowNoiseReduction = function () {
                var _this = this;
                this._dao.showNoiseReduction()
                    .then(function (applied) {
                    if (!applied) {
                        return;
                    }
                    _this._treeGrid().reloadData();
                    return _this.queryForInfoBar();
                });
            };
            CallTreeViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid());
                window.clipboardData.setData("Text", formatted);
            };
            CallTreeViewModel.prototype.queryForInfoBar = function () {
                var _this = this;
                return this._dao.shouldShowInfoBar().then(function (showInfoBar) {
                    var infoBarProvider = F1Viz.getInfoBarProvider();
                    if (showInfoBar) {
                        var infoBar = new F1Viz.InformationBarControl("CallTree_InfoNoiseReductionEnabled", function () { return infoBarProvider.clearInfoBars(); }, "CallTree_InfoNoiseReductionConfigureLink", function () { return _this.onShowNoiseReduction(); });
                        infoBarProvider.showInfoBar(infoBar);
                    }
                    else {
                        infoBarProvider.clearInfoBars();
                    }
                });
            };
            return CallTreeViewModel;
        }());
        F1Viz.CallTreeViewModel = CallTreeViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var CallerCallee = (function () {
            function CallerCallee(header) {
                var _this = this;
                this._data = ko.observableArray([]);
                this._selectedRows = ko.observableArray([]);
                this._focusedRowIndex = ko.pureComputed(function () { return _this.computedFocusedRowIndex(); });
                this._focusedRow = ko.pureComputed(function () { return _this.computeFocusedRow(); });
                this._scrollTop = ko.observable(0);
                this._clientHeight = ko.observable(0);
                this._selectionSubscription = this._selectedRows.subscribe(this.onSelectionChanged.bind(this), null, "arrayChange");
                this._sharedHeader = header;
            }
            Object.defineProperty(CallerCallee.prototype, "data", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCallee.prototype, "selectedRows", {
                get: function () {
                    return this._selectedRows;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCallee.prototype, "focusedRowIndex", {
                get: function () {
                    return this._focusedRowIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCallee.prototype, "focusedRow", {
                get: function () {
                    return this._focusedRow;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCallee.prototype, "header", {
                get: function () {
                    return this._sharedHeader;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCallee.prototype, "scrollTop", {
                get: function () {
                    return this._scrollTop;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCallee.prototype, "clientHeight", {
                get: function () {
                    return this._clientHeight;
                },
                enumerable: true,
                configurable: true
            });
            CallerCallee.prototype.dispose = function () {
                this._selectionSubscription.dispose();
            };
            CallerCallee.prototype.onAfterDomInsert = function (container) {
                var _this = this;
                var updateCachedSizes = function () {
                    _this._scrollTop(container.scrollTop);
                    _this._clientHeight(container.clientHeight);
                };
                updateCachedSizes();
                var onResizeBoundFunction = F1Viz.eventThrottler(updateCachedSizes, F1Viz.Constants.WindowResizeThrottle);
                container.addEventListener("scroll", updateCachedSizes);
                window.addEventListener("resize", onResizeBoundFunction);
                ko.utils.domNodeDisposal.addDisposeCallback(container, function () {
                    container.removeEventListener("scroll", updateCachedSizes);
                    window.removeEventListener("resize", onResizeBoundFunction);
                });
            };
            CallerCallee.prototype.foramtSelectedToText = function () {
                var selectedIndexes = this.selectedRows().sort(F1Viz.SortFunctions.numberComparator);
                var isColumnHidden = {};
                this.header.hiddenColumns().forEach(function (columnId) { return isColumnHidden[columnId] = true; });
                var formattedSelection = "";
                var renderedCallerCalleeCopy = document.createDocumentFragment();
                ko.renderTemplate("CopyCallerCalleeView", this, {}, renderedCallerCalleeCopy, "replaceChildren");
                var headerColumns = renderedCallerCalleeCopy.querySelectorAll("th");
                var delimiter = "";
                for (var column = 0; column < headerColumns.length; ++column) {
                    var columnId = headerColumns[column].getAttribute("data-columnid");
                    if (isColumnHidden[columnId]) {
                        continue;
                    }
                    formattedSelection += delimiter;
                    formattedSelection += headerColumns[column].innerText;
                    delimiter = "\t";
                }
                var previousIndex = -1;
                var rows = renderedCallerCalleeCopy.querySelectorAll("tbody > tr");
                for (var rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
                    var row = rows[rowIndex];
                    formattedSelection += F1Viz.TreeGridUtils.NewLine;
                    var index = this.selectedRows()[rowIndex];
                    var cells = row.querySelectorAll("td");
                    var cellDelimiter = "";
                    for (var columnIndex = 0; columnIndex < cells.length; ++columnIndex) {
                        var columnId = cells[column].getAttribute("data-columnid");
                        if (isColumnHidden[columnId]) {
                            continue;
                        }
                        formattedSelection += cellDelimiter;
                        formattedSelection += cells[columnIndex].innerText.replace(/^\s+|\s+$/g, '');
                        cellDelimiter = "\t";
                    }
                    previousIndex = index;
                }
                return formattedSelection;
            };
            CallerCallee.prototype.computedFocusedRowIndex = function () {
                var selectedRows = this._selectedRows();
                return selectedRows.length > 0 ? selectedRows[selectedRows.length - 1] : -1;
            };
            CallerCallee.prototype.computeFocusedRow = function () {
                var focusedIndex = this.computedFocusedRowIndex();
                return focusedIndex !== -1 ? this.data()[focusedIndex] : null;
            };
            CallerCallee.prototype.onSelectionChanged = function (changes) {
                var _this = this;
                changes.forEach(function (change) {
                    if (typeof change.moved !== "undefined") {
                        return;
                    }
                    if (change.status === "added") {
                        _this._data()[change.value].selected(true);
                    }
                    else if (change.status === "deleted") {
                        _this._data()[change.value].selected(false);
                    }
                });
            };
            return CallerCallee;
        }());
        F1Viz.CallerCallee = CallerCallee;
        var CallerCalleeViewModel = (function () {
            function CallerCalleeViewModel(context) {
                var _this = this;
                this._current = ko.observable(null);
                this._currentFunction = ko.observable("");
                this._header = ko.observable();
                this._focusedRow = ko.pureComputed(function () { return _this.computeFocusedRow(); });
                this._subscriptions = [];
                this._dataLoadStatus = ko.observable(F1Viz.DataLoadEvent.DataLoadCompleted);
                F1Viz.CallerCalleeDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    _this._header(new F1Viz.CallerCalleeHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn));
                    _this._caller = new CallerCallee(_this._header());
                    _this._callee = new CallerCallee(_this._header());
                    _this._dataLoadStatus(F1Viz.DataLoadEvent.DataLoadStart);
                    _this._dataLoadPromise = _this._dao.getData(_this._header().sortInfo(), context).then(function (data) {
                        _this._caller.data(data.callers);
                        _this._callee.data(data.callees);
                        _this.current(data.current);
                        _this._currentFunction(data.current.name);
                        _this._dataLoadStatus(F1Viz.DataLoadEvent.DataLoadCompleted);
                    });
                    _this._dataLoadPromise.done(function () {
                        _this._dataLoadPromise = null;
                    }, function (error) {
                        _this._dataLoadPromise = null;
                    });
                    _this._subscriptions.push(_this._header().sortInfo.subscribe(function () {
                        _this._caller.selectedRows([]);
                        _this._callee.selectedRows([]);
                        _this._current().selected(false);
                        ko.tasks.runEarly();
                        _this._dao.sort(_this._caller.data(), _this._header().sortInfo())
                            .then(function (sortedRoots) { return _this._caller.data(sortedRoots); });
                        _this._dao.sort(_this._callee.data(), _this._header().sortInfo())
                            .then(function (sortedRoots) { return _this._callee.data(sortedRoots); });
                    }));
                    _this._subscriptions.push(_this._callee.selectedRows.subscribe(function (newSelection) {
                        if (newSelection.length > 0) {
                            _this._caller.selectedRows([]);
                            _this._current().selected(false);
                        }
                    }));
                    _this._subscriptions.push(_this._caller.selectedRows.subscribe(function (newSelection) {
                        if (newSelection.length > 0) {
                            _this._callee.selectedRows([]);
                            _this._current().selected(false);
                        }
                    }));
                });
            }
            Object.defineProperty(CallerCalleeViewModel.prototype, "header", {
                get: function () {
                    return this._header;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeViewModel.prototype, "caller", {
                get: function () {
                    return this._caller;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeViewModel.prototype, "current", {
                get: function () {
                    return this._current;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeViewModel.prototype, "callee", {
                get: function () {
                    return this._callee;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeViewModel.prototype, "currentFunctionName", {
                get: function () {
                    return this._currentFunction;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeViewModel.prototype, "focusedRow", {
                get: function () {
                    return this._focusedRow;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeViewModel.prototype, "dataLoadStatus", {
                get: function () {
                    return this._dataLoadStatus;
                },
                enumerable: true,
                configurable: true
            });
            CallerCalleeViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this.onClick(viewModel, event);
                var navigator = F1Viz.getMainViewNavigator();
                return ContextMenu.create([{
                        label: Resources.getString("CallerCalleeView_ContextMenuSetFunction"),
                        callback: function () { return _this.setFunction(row).then(function () { return _this._current().selected(true); }); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ViewSource"),
                        disabled: function () { return !row.dto.rsf; },
                        callback: function () { return _this._dao.viewSource(row.dto.rsf, row.functionLineNumber); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInModulesView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Modules, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInFunctionsView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Functions, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowFunctionDetails"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.FunctionDetails, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: this.onCopy.bind(this),
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            CallerCalleeViewModel.prototype.onKeyDownCaller = function (viewModel, event) {
                var _this = this;
                if (event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C) {
                    var formatted = this._caller.foramtSelectedToText();
                    window.clipboardData.setData("Text", formatted);
                    return false;
                }
                else if (event.keyCode === F1Viz.Common.KeyCodes.Enter) {
                    if (this._caller.focusedRow()) {
                        this.setFunction(this._caller.focusedRow())
                            .then(function () { return _this._current().selected(true); });
                    }
                    return false;
                }
                return true;
            };
            CallerCalleeViewModel.prototype.onKeyDownCallee = function (viewModel, event) {
                var _this = this;
                if (event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C) {
                    var formatted = this._callee.foramtSelectedToText();
                    window.clipboardData.setData("Text", formatted);
                    return false;
                }
                else if (event.keyCode === F1Viz.Common.KeyCodes.Enter) {
                    if (this._callee.focusedRow()) {
                        this.setFunction(this._callee.focusedRow())
                            .then(function () { return _this._current().selected(true); });
                    }
                    return false;
                }
                return true;
            };
            CallerCalleeViewModel.prototype.onKeyDownCurrent = function (viewModel, event) {
                if (event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C) {
                    var tempCurrent = new CallerCallee(this.header());
                    tempCurrent.data([this._current()]);
                    tempCurrent.selectedRows(this._current().selected() ? [0] : []);
                    var formatted = tempCurrent.foramtSelectedToText();
                    window.clipboardData.setData("Text", formatted);
                    return false;
                }
                else if (event.keyCode === F1Viz.Common.KeyCodes.ArrowUp || event.keyCode === F1Viz.Common.KeyCodes.ArrowDown) {
                    this._current().selected(true);
                    this._caller.selectedRows([]);
                    this._callee.selectedRows([]);
                    return false;
                }
                return true;
            };
            CallerCalleeViewModel.prototype.onCopy = function () {
                if (this._caller.selectedRows().length > 0) {
                    var formatted = this._caller.foramtSelectedToText();
                    window.clipboardData.setData("Text", formatted);
                }
                else if (this._callee.selectedRows().length > 0) {
                    var formatted = this._callee.foramtSelectedToText();
                    window.clipboardData.setData("Text", formatted);
                }
                else if (this._current().selected()) {
                    var tempCurrent = new CallerCallee(this.header());
                    tempCurrent.data([this._current()]);
                    tempCurrent.selectedRows(this._current().selected() ? [0] : []);
                    var formatted = tempCurrent.foramtSelectedToText();
                    window.clipboardData.setData("Text", formatted);
                }
            };
            CallerCalleeViewModel.prototype.onClick = function (viewModel, event) {
                var context = ko.contextFor(event.target);
                if (!context || !context.$data.dto) {
                    return;
                }
                if (context.$parent === this) {
                    this._current().selected(true);
                    this._caller.selectedRows([]);
                    this._callee.selectedRows([]);
                    return;
                }
                var callerCallee = context.$parent;
                var rowIndex = callerCallee.data().indexOf(context.$data);
                if (event.ctrlKey) {
                    var selectedIndex = callerCallee.selectedRows.indexOf(rowIndex);
                    if (selectedIndex === -1) {
                        callerCallee.selectedRows.push(rowIndex);
                    }
                    else {
                        callerCallee.selectedRows.splice(selectedIndex, 1);
                    }
                }
                else if (event.shiftKey) {
                    var start = Math.max(Math.min(callerCallee.focusedRowIndex(), rowIndex), 0);
                    var end = Math.max(callerCallee.focusedRowIndex(), rowIndex);
                    var initialSelection = callerCallee.selectedRows();
                    var selectionToAdd = [];
                    for (var indexToSelect = start; indexToSelect <= end; ++indexToSelect) {
                        if (initialSelection.indexOf(indexToSelect) === -1) {
                            selectionToAdd.push(indexToSelect);
                        }
                    }
                    if (callerCallee.focusedRowIndex() > rowIndex) {
                        selectionToAdd.reverse();
                    }
                    selectionToAdd.forEach(function (selection) { return callerCallee.selectedRows.push(selection); });
                }
                else {
                    callerCallee.selectedRows([rowIndex]);
                }
            };
            CallerCalleeViewModel.prototype.onDblClick = function (viewModel, event) {
                if (event.which !== F1Viz.Common.MouseCodes.Left) {
                    return;
                }
                var context = ko.contextFor(event.target);
                if (!context && !context.$data.dto) {
                    return;
                }
                if (context.$parent instanceof CallerCallee && context.$parent.focusedRow() === context.$data) {
                    viewModel.setFunction(context.$data);
                }
                else {
                    this.onClick(viewModel, event);
                }
            };
            CallerCalleeViewModel.prototype.onAfterDomInsert = function (elements, viewModel) {
                var container = document.querySelector(".callerCallee");
                var callerRow = container.querySelector(".callerCallee .callers thead");
                var current = container.querySelector(".callerCallee .current thead");
                var calleeRow = container.querySelector(".callerCallee .callees thead");
                viewModel._callee.onAfterDomInsert(container.querySelector(".callerCallee .callees"));
                viewModel._caller.onAfterDomInsert(container.querySelector(".callerCallee .callers"));
                viewModel._header().onAfterDomInsert(container, callerRow, current, calleeRow);
            };
            CallerCalleeViewModel.prototype.computeFocusedRow = function () {
                return this._current() && this._current().selected() ?
                    this._current() : null;
            };
            CallerCalleeViewModel.prototype.setFunction = function (rowViewModel) {
                var _this = this;
                if (this._dataLoadPromise) {
                    this._dataLoadPromise.cancel();
                }
                this._current().selected(false);
                this._caller.selectedRows([]);
                this._callee.selectedRows([]);
                ko.tasks.runEarly();
                this._dataLoadStatus(F1Viz.DataLoadEvent.DataLoadStart);
                this._dataLoadPromise = this._dao.getData(this._header().sortInfo(), rowViewModel.dto.k)
                    .then(function (data) {
                    _this._caller.data(data.callers);
                    _this._callee.data(data.callees);
                    _this.current(data.current);
                    _this._currentFunction(data.current.name);
                    _this._dataLoadStatus(F1Viz.DataLoadEvent.DataLoadCompleted);
                });
                this._dataLoadPromise.done(function () {
                    _this._dataLoadPromise = null;
                }, function (error) {
                    _this._dataLoadPromise = null;
                });
                return this._dataLoadPromise;
            };
            CallerCalleeViewModel.prototype.dispose = function () {
                this._header().dispose();
                this._subscriptions.forEach(function (s) { return s.dispose(); });
                this._caller.dispose();
                this._callee.dispose();
            };
            return CallerCalleeViewModel;
        }());
        F1Viz.CallerCalleeViewModel = CallerCalleeViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var CallerCalleeHeaderViewModel = (function () {
            function CallerCalleeHeaderViewModel(columns, dao, defaultSortColumn) {
                var _this = this;
                this._resizers = {};
                this._hiddenColumns = ko.observableArray([]);
                this._sortDirection = ko.observable(F1Viz.SortDirection.Desc);
                this._sortInfo = ko.pureComputed(function () {
                    return {
                        columnId: _this._sortColumnId(),
                        direction: _this._sortDirection()
                    };
                });
                this._columnOrder = ko.observableArray([]);
                this._columnConfigLoadStatus = ko.observable(F1Viz.DataLoadEvent.DataLoadStart);
                this._logger = Microsoft.F1Viz.getLogger();
                this._subscriptions = [];
                this._columns = columns;
                this._dao = dao;
                this._sortColumnId = ko.observable(defaultSortColumn);
                this._columnOrder(columns.map(function (column) { return column.id; }));
            }
            Object.defineProperty(CallerCalleeHeaderViewModel.prototype, "visibilityContextMenuBinding", {
                get: function () {
                    return {
                        hiddenColumns: this._hiddenColumns,
                        columns: this._columns
                            .filter(function (column) { return column.hideable; })
                            .map(function (column) { return {
                            id: column.id,
                            text: column.text
                        }; })
                    };
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeHeaderViewModel.prototype, "columns", {
                get: function () {
                    return this._columns;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeHeaderViewModel.prototype, "hiddenColumns", {
                get: function () {
                    return this._hiddenColumns;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeHeaderViewModel.prototype, "columnOrder", {
                get: function () {
                    return this._columnOrder;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeHeaderViewModel.prototype, "sortInfo", {
                get: function () {
                    return this._sortInfo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeHeaderViewModel.prototype, "sortColumnId", {
                get: function () {
                    return this._sortColumnId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeHeaderViewModel.prototype, "sortDirection", {
                get: function () {
                    return this._sortDirection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CallerCalleeHeaderViewModel.prototype, "columnConfigLoadStatus", {
                get: function () {
                    return this._columnConfigLoadStatus;
                },
                enumerable: true,
                configurable: true
            });
            CallerCalleeHeaderViewModel.prototype.onAfterDomInsert = function (callerCalleeContainer, callerRow, currentRow, calleeRow) {
                var _this = this;
                this._callerCalleeContainer = callerCalleeContainer;
                this._columnProvider = new F1Viz.CallerCalleeColumnProvider(this._dao, callerRow, currentRow, calleeRow);
                this._resizers = {};
                var columnsToHide = [];
                this._columnProvider.getColumnSettings()
                    .done(function (columnSettings) {
                    var header = _this._callerCalleeContainer.querySelector(".callerCallee .header table");
                    header.querySelector("tr").tabIndex = 0;
                    var headerColumns = header.querySelectorAll("th");
                    var rightSibling = null;
                    columnSettings.forEach(function (column) {
                        var headerColumn = header.querySelector("th[data-columnid='" + column.columnId + "']");
                        var caller = callerRow.querySelector("th[data-columnid='" + column.columnId + "']");
                        var current = currentRow.querySelector("th[data-columnid='" + column.columnId + "']");
                        var callee = calleeRow.querySelector("th[data-columnid='" + column.columnId + "']");
                        headerColumn.tabIndex = -1;
                        caller.style.width = column.width + "px";
                        current.style.width = column.width + "px";
                        callee.style.width = column.width + "px";
                        var resizer = new F1Viz.ColumnResizer(headerColumn, header, document.createElement("div"), document.createElement("div"), column, _this._columnProvider);
                        _this._resizers[column.columnId] = resizer;
                        if (column.isHidden) {
                            columnsToHide.push(column.columnId);
                        }
                        resizer.resizedEvent.addEventListener(function () { return _this.adjustResizerLocation(); });
                    });
                    _this.adjustResizerLocation();
                    _this._subscriptions.push(_this._hiddenColumns.subscribe(_this.onHiddenColumnsChanged.bind(_this), null, "arrayChange"));
                    _this._columnProvider.updateLinkedScrollBarWidth();
                    _this._hiddenColumns(columnsToHide);
                    _this._columnConfigLoadStatus(F1Viz.DataLoadEvent.DataLoadCompleted);
                });
            };
            CallerCalleeHeaderViewModel.prototype.onHiddenColumnsChanged = function (changes) {
                var _this = this;
                changes.forEach(function (change) {
                    if (change.status === "added") {
                        var resizer = _this._resizers[change.value];
                        resizer.onColumnVisiblityChanged(false);
                        _this._columnProvider.onColumnChanged(resizer.columnConfig);
                    }
                    else if (change.status === "deleted") {
                        _this._callerCalleeContainer.classList.remove("hide" + change.value);
                        _this._resizers[change.value].onColumnVisiblityChanged(true);
                        _this._columnProvider.onColumnChanged(_this._resizers[change.value].columnConfig);
                    }
                });
            };
            CallerCalleeHeaderViewModel.prototype.dispose = function () {
                this._subscriptions.forEach(function (s) { return s.dispose(); });
            };
            CallerCalleeHeaderViewModel.prototype.adjustResizerLocation = function () {
                var _this = this;
                ko.tasks.runEarly();
                ko.tasks.schedule(function () {
                    for (var id in _this._resizers) {
                        _this._resizers[id].resetLocation();
                    }
                });
            };
            return CallerCalleeHeaderViewModel;
        }());
        F1Viz.CallerCalleeHeaderViewModel = CallerCalleeHeaderViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var ContentionViewModel = (function () {
            function ContentionViewModel(additionalActions, context) {
                var _this = this;
                this._treeGrid = ko.observable();
                F1Viz.ContentionDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    header.sortDirection(F1Viz.SortDirection.Desc);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "Contention_TreeGridAriaLabel"));
                    if (context && context.ctype === F1Viz.ContextType.Resource) {
                        _this._treeGrid().dataLoadPromise.then(function () {
                            var allRows = _this._treeGrid().treeAsArray();
                            for (var rowIndex = 0; rowIndex < allRows.length; ++rowIndex) {
                                var row = allRows[rowIndex];
                                if (row.dto.k.ctype === context.ctype && row.dto.k.cid === context.cid) {
                                    _this._treeGrid().selectedRows.push(rowIndex);
                                    break;
                                }
                            }
                        });
                    }
                    _this._hotPathToggleButton = new F1Viz.ToggleButtonViewModel('hotPathIcon', 'hotPathDisabledIcon', 'CallTree_ShowHighlighting');
                    _this._treeGrid().showHotPathHighlighting = _this._hotPathToggleButton.isChecked;
                    additionalActions([
                        { template: 'ToolbarItemView', viewModel: new F1Viz.ToolbarItemViewModel('hotItemIcon', 'CallTree_ExpandHotPath', function () { return _this.onExpandHotPath(); }) },
                        { template: 'ToggleButtonView', viewModel: _this._hotPathToggleButton },
                        { template: 'ToolbarItemView', viewModel: new F1Viz.ToolbarItemViewModel('noiseReductionIcon', 'CallTree_NoiseReduction', function () { return _this.onShowNoiseReduction(); }) },
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'Contention_SearchAriaLabel') }
                    ]);
                    _this.queryForInfoBar();
                    _this._treeGrid().dataLoadPromise.then(function () { return _this.onExpandHotPath(); });
                });
            }
            Object.defineProperty(ContentionViewModel.prototype, "treeGrid", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            ContentionViewModel.prototype.dispose = function () {
                this._dao.clearCache();
            };
            ContentionViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var treeRow = viewModel;
                if (!treeRow.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                var menuItems = [{
                        label: Resources.getString("ContextMenu_ExpandAll"),
                        callback: function () { return F1Viz.TreeGridUtils.expandAll(_this._treeGrid(), _this._dao); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_CollapseAll"),
                        callback: function () { return F1Viz.TreeGridUtils.collapseAll(_this._treeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ExpandSelection"),
                        callback: function () { return F1Viz.TreeGridUtils.expandSelection(_this._treeGrid(), _this._dao); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_CollapseSelection"),
                        callback: function () { return F1Viz.TreeGridUtils.collapseSelected(_this._treeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ExpandHotPath"),
                        callback: this.onExpandHotPath.bind(this),
                        type: ContextMenu.MenuItemType.command
                    }];
                if (treeRow.dto.k && treeRow.dto.k.ctype === F1Viz.ContextType.Resource) {
                    menuItems.push({
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ShowInResourceDetailsView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.ResourceDetails, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                else if (treeRow.dto.k && treeRow.dto.k.ctype === F1Viz.ContextType.Function) {
                    menuItems.push({
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ViewSource"),
                        disabled: function () { return !treeRow.dto.rsf; },
                        callback: function () { return _this._dao.viewSource(treeRow.dto.rsf, treeRow.functionLineNumber); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInModulesView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Modules, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInFunctionsView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Functions, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowFunctionDetails"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.FunctionDetails, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCallingFunctions", treeRow.name),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.CallerCallee, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCalledFunctions", treeRow.name),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.CallerCallee, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                menuItems.push({
                    type: ContextMenu.MenuItemType.separator
                }, {
                    label: Resources.getString("ContextMenu_Copy"),
                    callback: this.onCopy.bind(this),
                    type: ContextMenu.MenuItemType.command
                }, {
                    label: Resources.getString("ContextMenu_SelectStack"),
                    callback: this.onSelectStack.bind(this),
                    type: ContextMenu.MenuItemType.command
                });
                return ContextMenu.create(menuItems);
            };
            ContentionViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            ContentionViewModel.prototype.onExpandFoldedNodes = function () {
            };
            ContentionViewModel.prototype.onExpandHotPath = function () {
                var _this = this;
                this._treeGrid().treeAsArray().forEach(function (row) {
                    row.isHotPath(false);
                    row.isHotItem(false);
                });
                var currentNode = this._treeGrid().focusedRow();
                var currentChildren = currentNode ? [currentNode] : this._treeGrid().roots();
                var expandPath = function (result) {
                    var nodeToHighlight = result.shift();
                    for (var nodeIndex = 0; nodeIndex < currentChildren.length; ++nodeIndex) {
                        currentNode = currentChildren[nodeIndex];
                        if (currentNode.id === nodeToHighlight.id) {
                            currentNode.isHotItem(nodeToHighlight.hi);
                            currentNode.isHotPath(nodeToHighlight.hp);
                            break;
                        }
                    }
                    if (result.length > 0) {
                        if (!nodeToHighlight.f) {
                            return expandPath(result);
                        }
                        else if (!currentNode.expanded()) {
                            return _this._dao.expand(currentNode, _this._treeGrid().header.sortInfo())
                                .then(function () { return currentChildren = currentNode.children(); })
                                .then(function () { return expandPath(result); });
                        }
                        else {
                            currentChildren = currentNode.children();
                            return expandPath(result);
                        }
                    }
                    ko.tasks.schedule(function () {
                        var indexToSelect = _this._treeGrid().treeAsArray().indexOf(currentNode);
                        _this._treeGrid().selectedRows([indexToSelect]);
                    });
                    return;
                };
                this._dao.expandHotPath(currentNode)
                    .then(function (path) {
                    return expandPath(path);
                }).then(function () {
                    _this._hotPathToggleButton.isEnabled(true);
                    _this._hotPathToggleButton.isChecked(true);
                });
            };
            ContentionViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid());
                window.clipboardData.setData("Text", formatted);
            };
            ContentionViewModel.prototype.onSelectStack = function () {
                F1Viz.TreeGridUtils.selectParentsOfFocusedRow(this._treeGrid());
            };
            ContentionViewModel.prototype.onShowNoiseReduction = function () {
                var _this = this;
                this._dao.showNoiseReduction()
                    .then(function (applied) {
                    if (!applied) {
                        return;
                    }
                    _this._treeGrid().reloadData();
                    return _this.queryForInfoBar();
                });
            };
            ContentionViewModel.prototype.queryForInfoBar = function () {
                var _this = this;
                return this._dao.shouldShowInfoBar().then(function (showInfoBar) {
                    var infoBarProvider = F1Viz.getInfoBarProvider();
                    if (showInfoBar) {
                        var infoBar = new F1Viz.InformationBarControl("CallTree_InfoNoiseReductionEnabled", function () { return infoBarProvider.clearInfoBars(); }, "CallTree_InfoNoiseReductionConfigureLink", function () { return _this.onShowNoiseReduction(); });
                        infoBarProvider.showInfoBar(infoBar);
                    }
                    else {
                        infoBarProvider.clearInfoBars();
                    }
                });
            };
            return ContentionViewModel;
        }());
        F1Viz.ContentionViewModel = ContentionViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var DynamicTreeRowViewModel = (function () {
            function DynamicTreeRowViewModel(parent, dto, columnConfig, depth, onInvoke) {
                var _this = this;
                this._selected = ko.observable(false);
                this._expanded = null;
                this._isHotPath = ko.observable(false);
                this._isHotItem = ko.observable(false);
                this._parent = parent;
                this._dto = dto;
                this._columnConfig = columnConfig;
                this._depth = depth;
                this._onInvoke = onInvoke;
                if (dto.c !== null && typeof dto.c !== "undefined") {
                    this._expanded = ko.observable(false);
                    this._children = ko.observableArray(dto.c.map(function (childDto) { return new DynamicTreeRowViewModel(_this, childDto, columnConfig, _this._depth + 1); }));
                }
            }
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "templateName", {
                get: function () {
                    return "DynamicTreeRowView";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "id", {
                get: function () {
                    return this._dto.id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "depth", {
                get: function () {
                    return this._depth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "dto", {
                get: function () {
                    return this._dto;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "columns", {
                get: function () {
                    var frag = document.createDocumentFragment();
                    for (var i = 0; i < this._dto.d.length; ++i) {
                        var colData = this._dto.d[i];
                        var colConfig = this._columnConfig[i];
                        var col = document.createElement("td");
                        col.setAttribute("role", "gridcell");
                        col.setAttribute("data-columnid", colData.i);
                        switch (colConfig.justification) {
                            case F1Viz.ColumnJustification.Center:
                                col.style.textAlign = "center";
                                break;
                            case F1Viz.ColumnJustification.Right:
                                col.style.textAlign = "right";
                                break;
                            case F1Viz.ColumnJustification.Left:
                            default:
                                col.style.textAlign = "left";
                                break;
                        }
                        if (i === 0) {
                            var indent = document.createElement("span");
                            indent.innerHTML = "&nbsp;";
                            indent.setAttribute("data-bind", "rowIndent: depth");
                            col.appendChild(indent);
                            var expander = document.createElement("div");
                            expander.setAttribute("data-bind", "treeGridExpander: expanded");
                            col.appendChild(expander);
                            var hot = document.createElement("div");
                            hot.className = "hotHighlight";
                            hot.setAttribute("data-bind", "css: { hotPath: isHotPath() && $parent.showHotPathHighlighting(), hotItem: isHotItem() && $parent.showHotPathHighlighting() }");
                            col.appendChild(hot);
                            var text = document.createElement("span");
                            text.innerText = this.formatValue(colData.v, colConfig.displayType, colConfig.type);
                            col.appendChild(text);
                        }
                        else {
                            col.innerText = this.formatValue(colData.v, colConfig.displayType, colConfig.type);
                        }
                        frag.appendChild(col);
                    }
                    return frag;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "isHotPath", {
                get: function () {
                    return this._isHotPath;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "isHotItem", {
                get: function () {
                    return this._isHotItem;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "functionLineNumber", {
                get: function () {
                    for (var i = 0; i < this._dto.d.length; ++i) {
                        if (this._dto.d[i].i === "LineNumber") {
                            return this._dto.d[i].v;
                        }
                    }
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "name", {
                get: function () {
                    for (var i = 0; i < this._dto.d.length; ++i) {
                        if (this._dto.d[i].i === "Name"
                            || this._dto.d[i].i === "FunctionName"
                            || this._dto.d[i].i === "TypeFunctionName"
                            || this._dto.d[i].i === "ProcThreadName") {
                            return this._dto.d[i].v;
                        }
                    }
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "commandText", {
                get: function () {
                    for (var i = 0; i < this._dto.d.length; ++i) {
                        if (this._dto.d[i].i === "CommandText") {
                            return this._dto.d[i].v;
                        }
                    }
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "selected", {
                get: function () {
                    return this._selected;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "expanded", {
                get: function () {
                    return this._expanded;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTreeRowViewModel.prototype, "children", {
                get: function () {
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            DynamicTreeRowViewModel.prototype.invoke = function () {
                if (!this._onInvoke) {
                    return;
                }
                this._onInvoke(this._dto);
            };
            DynamicTreeRowViewModel.prototype.formatValue = function (value, displayType, columnType) {
                if (displayType === F1Viz.ColumnDisplayType.Hex) {
                    return value.toString(16);
                }
                else if (displayType === F1Viz.ColumnDisplayType.Time) {
                    if (F1Viz.getTimeDisplay() === F1Viz.TimeType.Milliseconds) {
                        return F1Viz.CpuSamplingUtilities.localizeNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                    else {
                        return F1Viz.CpuSamplingUtilities.localizeNumber(value);
                    }
                }
                else if (columnType === F1Viz.ColumnType.Percent) {
                    return F1Viz.CpuSamplingUtilities.localizeNumber(value, { style: 'percent', minimumFractionDigits: 2 });
                }
                else if (displayType === F1Viz.ColumnDisplayType.Counter && (columnType === F1Viz.ColumnType.Counter || columnType === F1Viz.ColumnType.SignedCounter)) {
                    return F1Viz.CpuSamplingUtilities.localizeNumber(value);
                }
                else {
                    return value;
                }
            };
            return DynamicTreeRowViewModel;
        }());
        F1Viz.DynamicTreeRowViewModel = DynamicTreeRowViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var FunctionDetailsFunctionViewModel = (function () {
            function FunctionDetailsFunctionViewModel(dto, metricTooltip) {
                this._metricTooltips = [];
                this._dto = dto;
                this._inclusive = this.dto.metric.inclusive;
                this._exclusive = this.dto.metric.exclusive;
                this._inclusiveTooltip = metricTooltip.inclusive;
                this._exclusiveTooltip = metricTooltip.exclusive;
                this._localizedInclusive = Microsoft.F1Viz.CpuSamplingUtilities.localizeNumber(this.dto.metric.type === F1Viz.PerfMetricType.Percent ? this.inclusive * 100 : this.inclusive, { maximumFractionDigits: 2 });
                this._localizedExclusive = Microsoft.F1Viz.CpuSamplingUtilities.localizeNumber(this.dto.metric.type === F1Viz.PerfMetricType.Percent ? this.exclusive * 100 : this.exclusive, { maximumFractionDigits: 2 });
            }
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "dto", {
                get: function () {
                    return this._dto;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "name", {
                get: function () {
                    return this._dto.name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "canNavigateTo", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "moduleName", {
                get: function () {
                    return this._dto.moduleName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "inclusive", {
                get: function () {
                    return this._inclusive;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "exclusive", {
                get: function () {
                    return this._exclusive;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "localizedInclusive", {
                get: function () {
                    return this._localizedInclusive;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "localizedExclusive", {
                get: function () {
                    return this._localizedExclusive;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "inclusiveTooltip", {
                get: function () {
                    return this._inclusiveTooltip;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "exclusiveTooltip", {
                get: function () {
                    return this._exclusiveTooltip;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "ariaLabel", {
                get: function () {
                    return Microsoft.Plugin.Resources.getString(this._inclusiveTooltip, this.name, this._localizedInclusive);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsFunctionViewModel.prototype, "ariaLabelFunctionBody", {
                get: function () {
                    return Microsoft.Plugin.Resources.getString(this._exclusiveTooltip, this.name, this._localizedExclusive);
                },
                enumerable: true,
                configurable: true
            });
            return FunctionDetailsFunctionViewModel;
        }());
        F1Viz.FunctionDetailsFunctionViewModel = FunctionDetailsFunctionViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var FunctionDetailsViewModel = (function () {
            function FunctionDetailsViewModel(reportType, context) {
                var _this = this;
                this._dao = new F1Viz.FunctionDetailsDAO();
                this._callers = ko.observableArray([]);
                this._currentFunction = ko.observable(null);
                this._callees = ko.observableArray([]);
                this._currentFunctionHasFocus = ko.observable(false);
                this._currentFunctionName = ko.pureComputed(function () { return _this.computeCurrentFunctionName(); });
                this._currentModuleName = ko.pureComputed(function () { return _this.computeCurrentModuleName(); });
                this._atTopOfStack = ko.pureComputed(function () { return _this._callers().length === 0; });
                this._atBottomOfStack = ko.pureComputed(function () { return _this._callees().length === 0; });
                this._currentPerformanceMetric = ko.observable(FunctionDetailsViewModel.currentMetric);
                this._performanceMetrics = [];
                this._performanceMetricTooltips = [];
                this._functionLimit = 5;
                this._subscriptions = [];
                this._navigator = F1Viz.getMainViewNavigator();
                switch (reportType) {
                    case (F1Viz.ReportType.Sampling):
                        this._performanceMetrics.push({ metricIndex: 0, localizedName: Microsoft.Plugin.Resources.getString("FunctionDetails_PerformanceMetricInclusiveSamples") });
                        this._performanceMetrics.push({ metricIndex: 1, localizedName: Microsoft.Plugin.Resources.getString("FunctionDetails_PerformanceMetricInclusiveSamplesPercent") });
                        this._performanceMetricTooltips.push({
                            inclusive: "FunctionDetails_InclusiveSamplesTooltip",
                            exclusive: "FunctionDetails_ExclusiveSamplesTooltip"
                        });
                        this._performanceMetricTooltips.push({
                            inclusive: "FunctionDetails_InclusiveSamplesPercentTooltip",
                            exclusive: "FunctionDetails_ExclusiveSamplesPercentTooltip"
                        });
                        break;
                    case (F1Viz.ReportType.Instrumentation):
                        this._performanceMetrics.push({ metricIndex: 0, localizedName: Microsoft.Plugin.Resources.getString("FunctionDetails_PerformanceMetricElapsedInclusiveTime") });
                        this._performanceMetrics.push({ metricIndex: 1, localizedName: Microsoft.Plugin.Resources.getString("FunctionDetails_PerformanceMetricAverageElapsedTime") });
                        this._performanceMetricTooltips.push({
                            inclusive: "FunctionDetails_ElapsedInclusiveTimePercentTooltip",
                            exclusive: "FunctionDetails_ElapsedExclusiveTimePercentTooltip"
                        });
                        this._performanceMetricTooltips.push({
                            inclusive: "FunctionDetails_AverageElapsedInclusiveTimeTooltip",
                            exclusive: "FunctionDetails_AverageElapsedExclusiveTimeTooltip"
                        });
                        break;
                    case (F1Viz.ReportType.Concurrency):
                        this._performanceMetrics.push({ metricIndex: 0, localizedName: Microsoft.Plugin.Resources.getString("FunctionDetails_PerformanceMetricInclusiveContentions") });
                        this._performanceMetrics.push({ metricIndex: 1, localizedName: Microsoft.Plugin.Resources.getString("FunctionDetails_PerformanceMetricInclusiveBlockedTime") });
                        this._performanceMetricTooltips.push({
                            inclusive: "FunctionDetails_InclusiveContentionsTooltip",
                            exclusive: "FunctionDetails_ExclusiveContentionsTooltip"
                        });
                        this._performanceMetricTooltips.push({
                            inclusive: "FunctionDetails_InclusiveBlockedTimeTooltip",
                            exclusive: "FunctionDetails_ExclusiveBlockedTimeTooltip"
                        });
                        break;
                    case (F1Viz.ReportType.Memory):
                        this._performanceMetrics.push({ metricIndex: 0, localizedName: Microsoft.Plugin.Resources.getString("FunctionDetails_PerformanceMetricInclusiveAllocations") });
                        this._performanceMetrics.push({ metricIndex: 1, localizedName: Microsoft.Plugin.Resources.getString("FunctionDetails_PerformanceMetricInclusiveBytes") });
                        this._performanceMetricTooltips.push({
                            inclusive: "FunctionDetails_InclusiveAllocationsTooltip",
                            exclusive: "FunctionDetails_ExclusiveAllocationsTooltip"
                        });
                        this._performanceMetricTooltips.push({
                            inclusive: "FunctionDetails_InclusiveBytesTooltip",
                            exclusive: "FunctionDetails_ExclusiveBytesTooltip"
                        });
                        break;
                }
                this._subscriptions.push(this._currentFunction.subscribe(function () { return _this._dao.updateSourceBrowser(_this._currentFunction().dto.context.cid, FunctionDetailsViewModel.currentMetric); }));
                if (context) {
                    this._subscriptions.push(this._currentFunction.subscribe(function () { return _this._currentFunctionHasFocus(true); }));
                }
                this.loadData(context);
                this._subscriptions.push(this._currentPerformanceMetric.subscribe(function () {
                    FunctionDetailsViewModel.currentMetric = _this._currentPerformanceMetric();
                    _this.loadData(_this._currentFunction().dto.context);
                }));
            }
            Object.defineProperty(FunctionDetailsViewModel.prototype, "callers", {
                get: function () {
                    return this._callers;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "currentFunction", {
                get: function () {
                    return this._currentFunction;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "currentFunctionHasFocus", {
                get: function () {
                    return this._currentFunctionHasFocus;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "currentFunctionName", {
                get: function () {
                    return this._currentFunctionName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "currentModuleName", {
                get: function () {
                    return this._currentModuleName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "callees", {
                get: function () {
                    return this._callees;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "atTopOfStack", {
                get: function () {
                    return this._atTopOfStack;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "atBottomOfStack", {
                get: function () {
                    return this._atBottomOfStack;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "performanceMetrics", {
                get: function () {
                    return this._performanceMetrics;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FunctionDetailsViewModel.prototype, "currentPerformanceMetric", {
                get: function () {
                    return this._currentPerformanceMetric;
                },
                enumerable: true,
                configurable: true
            });
            FunctionDetailsViewModel.prototype.dispose = function () {
                this._subscriptions.forEach(function (s) { return s.dispose(); });
                if (this._dataLoadPromise) {
                    this._dataLoadPromise.cancel();
                }
            };
            FunctionDetailsViewModel.prototype.navigateTo = function (viewModel, event) {
                var context = ko.contextFor(event.target);
                if (context && context.$data && context.$data.dto) {
                    var dto = context.$data.dto;
                    this._navigator.navigateToView(F1Viz.MainViews.FunctionDetails, dto.context);
                    return false;
                }
                return true;
            };
            FunctionDetailsViewModel.prototype.moveToNextFunction = function (viewModel, event) {
                var focusTarget;
                var targetElement = event.target;
                if (event.keyCode === F1Viz.Common.KeyCodes.ArrowDown) {
                    if (targetElement.classList.contains("functions")) {
                        focusTarget = targetElement.firstElementChild;
                    }
                    else if (targetElement.classList.contains("function")) {
                        focusTarget = targetElement.nextElementSibling;
                    }
                }
                else if (event.keyCode === F1Viz.Common.KeyCodes.ArrowUp) {
                    if (targetElement.classList.contains("functions")) {
                        focusTarget = targetElement.lastElementChild;
                    }
                    else if (targetElement.classList.contains("function")) {
                        focusTarget = targetElement.previousElementSibling;
                    }
                }
                else {
                    return true;
                }
                if (focusTarget) {
                    focusTarget.focus();
                }
                return false;
            };
            FunctionDetailsViewModel.prototype.navigateToCallerCallee = function (viewModel, event) {
                var cxt = viewModel.currentFunction().dto.context;
                this._navigator.navigateToView(F1Viz.MainViews.CallerCallee, cxt);
            };
            FunctionDetailsViewModel.prototype.navigateToFunctions = function (viewModel, event) {
                var cxt = viewModel.currentFunction().dto.context;
                this._navigator.navigateToView(F1Viz.MainViews.Functions, cxt);
            };
            FunctionDetailsViewModel.prototype.computeCurrentFunctionName = function () {
                var currentFunction = this.currentFunction();
                return currentFunction ? currentFunction.name : "";
            };
            FunctionDetailsViewModel.prototype.computeCurrentModuleName = function () {
                var currentFunction = this.currentFunction();
                return currentFunction ? currentFunction.moduleName : "";
            };
            FunctionDetailsViewModel.prototype.loadData = function (context) {
                var _this = this;
                this._dataLoadPromise = this._dao.getData(FunctionDetailsViewModel.currentMetric, context)
                    .then(function (result) {
                    if (result === null) {
                        _this._currentFunction(null);
                        _this._callers([]);
                        _this._callees([]);
                        return;
                    }
                    var metricTooltip = _this._performanceMetricTooltips[FunctionDetailsViewModel.currentMetric];
                    var callers = result.callers
                        .map(function (caller) { return new F1Viz.FunctionDetailsFunctionViewModel(caller, metricTooltip); });
                    var callees = result.callees
                        .map(function (callee) { return new F1Viz.FunctionDetailsFunctionViewModel(callee, metricTooltip); });
                    _this._currentFunction(new F1Viz.FunctionDetailsFunctionViewModel(result.current, metricTooltip));
                    _this._callers(callers);
                    _this._callees(callees);
                });
                this._dataLoadPromise.done(function () {
                    _this._dataLoadPromise = null;
                }, function (error) {
                    _this._dataLoadPromise = null;
                });
            };
            FunctionDetailsViewModel.currentMetric = 0;
            return FunctionDetailsViewModel;
        }());
        F1Viz.FunctionDetailsViewModel = FunctionDetailsViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var FunctionsViewModel = (function () {
            function FunctionsViewModel(additionalActions, context) {
                var _this = this;
                this._treeGrid = ko.observable();
                F1Viz.FunctionsDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    header.sortDirection(F1Viz.SortDirection.Desc);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "FunctionsView_TableAriaLabel"));
                    additionalActions([
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'FunctionsView_SearchAriaLabel') }
                    ]);
                    if (!context) {
                        return;
                    }
                    _this._treeGrid().dataLoadPromise.then(function () {
                        var allRows = _this._treeGrid().treeAsArray();
                        for (var rowIndex = 0; rowIndex < allRows.length; ++rowIndex) {
                            var row = allRows[rowIndex];
                            if (row.dto.k.cid === context.cid) {
                                _this._treeGrid().selectedRows.push(rowIndex);
                                break;
                            }
                        }
                    });
                });
            }
            Object.defineProperty(FunctionsViewModel.prototype, "functionsList", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            FunctionsViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                return ContextMenu.create([{
                        label: Resources.getString("ContextMenu_ViewSource"),
                        disabled: function () { return !row.dto.rsf; },
                        callback: function () { return _this._dao.viewSource(row.dto.rsf, row.functionLineNumber); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInModulesView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Modules, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowFunctionDetails"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.FunctionDetails, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCallingFunctions", row.name),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.CallerCallee, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCalledFunctions", row.name),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.CallerCallee, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: this.onCopy.bind(this),
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            FunctionsViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            FunctionsViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid(), false);
                window.clipboardData.setData("Text", formatted);
            };
            return FunctionsViewModel;
        }());
        F1Viz.FunctionsViewModel = FunctionsViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var IpViewModel = (function () {
            function IpViewModel(additionalActions, context) {
                var _this = this;
                this._treeGrid = ko.observable();
                F1Viz.IpDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    header.sortDirection(F1Viz.SortDirection.Desc);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "IpView_TableAriaLabel"));
                    additionalActions([
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'IpView_SearchAriaLabel') }
                    ]);
                    if (context && context.ctype === F1Viz.ContextType.Ip) {
                        _this._treeGrid().dataLoadPromise.then(function () {
                            var allRows = _this._treeGrid().treeAsArray();
                            for (var rowIndex = 0; rowIndex < allRows.length; ++rowIndex) {
                                var row = allRows[rowIndex];
                                if (row.dto.k && row.dto.k.cid === context.cid) {
                                    _this._treeGrid().selectedRows.push(rowIndex);
                                    break;
                                }
                            }
                        });
                    }
                });
            }
            Object.defineProperty(IpViewModel.prototype, "ipsList", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            IpViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                return ContextMenu.create([{
                        label: Resources.getString("ContextMenu_ViewSource"),
                        disabled: function () { return !row.dto.rsf; },
                        callback: function () { return _this._dao.viewSource(row.dto.rsf, row.functionLineNumber); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInModulesView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Modules, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: this.onCopy.bind(this),
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            IpViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            IpViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid(), false);
                window.clipboardData.setData("Text", formatted);
            };
            return IpViewModel;
        }());
        F1Viz.IpViewModel = IpViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var LinesViewModel = (function () {
            function LinesViewModel(additionalActions, context) {
                var _this = this;
                this._treeGrid = ko.observable();
                this._logger = Microsoft.F1Viz.getLogger();
                F1Viz.LinesDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "LinesView_TableAriaLabel"));
                    additionalActions([
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'LinesView_SearchAriaLabel') }
                    ]);
                    if (context && context.ctype === F1Viz.ContextType.Line) {
                        _this._treeGrid().dataLoadPromise.then(function () {
                            var allRows = _this._treeGrid().treeAsArray();
                            for (var rowIndex = 0; rowIndex < allRows.length; ++rowIndex) {
                                var row = allRows[rowIndex];
                                if (row.dto.k && row.dto.k.cid === context.cid) {
                                    _this._treeGrid().selectedRows.push(rowIndex);
                                    break;
                                }
                            }
                        });
                    }
                });
            }
            Object.defineProperty(LinesViewModel.prototype, "linesList", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            LinesViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                return ContextMenu.create([{
                        label: Resources.getString("ContextMenu_ViewSource"),
                        disabled: function () { return !row.dto.rsf; },
                        callback: function () { return _this._dao.viewSource(row.dto.rsf, row.functionLineNumber); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInModulesView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Modules, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: this.onCopy.bind(this),
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            LinesViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            LinesViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid(), false);
                window.clipboardData.setData("Text", formatted);
            };
            return LinesViewModel;
        }());
        F1Viz.LinesViewModel = LinesViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var MarksViewModel = (function () {
            function MarksViewModel(additionalActions) {
                var _this = this;
                this._treeGrid = ko.observable();
                F1Viz.MarksDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    header.sortDirection(F1Viz.SortDirection.Asc);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "MarksView_TableAriaLabel"));
                    additionalActions([
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'MarksView_SearchAriaLabel') }
                    ]);
                });
            }
            Object.defineProperty(MarksViewModel.prototype, "treeGrid", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            MarksViewModel.prototype.onAfterDomInsert = function (elements, viewModel) {
                viewModel.onAfterDomInsert(elements, viewModel);
            };
            MarksViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                return ContextMenu.create([{
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: function () { return _this.onCopy(); },
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            MarksViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            MarksViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this.treeGrid(), false);
                window.clipboardData.setData("Text", formatted);
            };
            return MarksViewModel;
        }());
        F1Viz.MarksViewModel = MarksViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var ModulesViewModel = (function () {
            function ModulesViewModel(additionalActions, context) {
                var _this = this;
                this._treeGrid = ko.observable();
                this._navigator = F1Viz.getMainViewNavigator();
                F1Viz.ModulesDAO.create(context)
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "Modules_TreeGridAriaLabel"));
                    additionalActions([
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'Modules_SearchAriaLabel') }
                    ]);
                    if (!context) {
                        return;
                    }
                    _this._treeGrid().dataLoadPromise.then(function () {
                        var allRows = _this._treeGrid().treeAsArray();
                        for (var rowIndex = 0; rowIndex < allRows.length; ++rowIndex) {
                            var row = allRows[rowIndex];
                            if (row.dto.k.ctype === context.ctype && row.dto.k.cid === context.cid) {
                                _this._treeGrid().selectedRows.push(rowIndex);
                                break;
                            }
                        }
                    });
                });
            }
            Object.defineProperty(ModulesViewModel.prototype, "treeGrid", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            ModulesViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                var treeRow = viewModel;
                if (!treeRow.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var config = [{
                        label: Resources.getString("ContextMenu_ExpandAll"),
                        callback: function () { return F1Viz.TreeGridUtils.expandAll(_this._treeGrid(), _this._dao); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_CollapseAll"),
                        callback: function () { return F1Viz.TreeGridUtils.collapseAll(_this._treeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }];
                if (treeRow.dto.k && treeRow.dto.k.ctype == F1Viz.ContextType.Function) {
                    config.push({
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ShowInFunctionsView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.Functions, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowFunctionDetails"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.FunctionDetails, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCallingFunctions", treeRow.name),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.CallerCallee, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCalledFunctions", treeRow.name),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.CallerCallee, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                else if (treeRow.dto.k && treeRow.dto.k.ctype == F1Viz.ContextType.Line) {
                    config.push({
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ShowInLineView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.Lines, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                else if (treeRow.dto.k && treeRow.dto.k.ctype == F1Viz.ContextType.Ip) {
                    config.push({
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ShowInIpView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.Ips, treeRow.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                config.push({
                    type: ContextMenu.MenuItemType.separator
                }, {
                    label: Resources.getString("ContextMenu_Copy"),
                    callback: this.onCopy.bind(this),
                    type: ContextMenu.MenuItemType.command
                });
                return ContextMenu.create(config);
            };
            ModulesViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            ModulesViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid());
                window.clipboardData.setData("Text", formatted);
            };
            return ModulesViewModel;
        }());
        F1Viz.ModulesViewModel = ModulesViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var ObjectLifetimeViewModel = (function () {
            function ObjectLifetimeViewModel(additionalActions, context) {
                var _this = this;
                this._treeGrid = ko.observable();
                F1Viz.ObjectLifetimeDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    header.sortDirection(F1Viz.SortDirection.Desc);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "ObjectLifetime_TableAriaLabel"));
                    additionalActions([
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'ObjectLifetime_SearchAriaLabel') }
                    ]);
                    if (!context || context.ctype !== F1Viz.ContextType.Type) {
                        return;
                    }
                    _this._treeGrid().dataLoadPromise.then(function () {
                        var allRows = _this._treeGrid().treeAsArray();
                        for (var rowIndex = 0; rowIndex < allRows.length; ++rowIndex) {
                            var row = allRows[rowIndex];
                            if (row.dto.k.cid === context.cid) {
                                _this._treeGrid().selectedRows.push(rowIndex);
                                break;
                            }
                        }
                    });
                });
            }
            Object.defineProperty(ObjectLifetimeViewModel.prototype, "typesList", {
                get: function () {
                    return this._treeGrid();
                },
                enumerable: true,
                configurable: true
            });
            ObjectLifetimeViewModel.prototype.contextMenu = function (viewModel, event) {
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                return ContextMenu.create([{
                        label: Resources.getString("ContextMenu_ShowInAllocationView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.Allocation, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: this.onCopy.bind(this),
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            ObjectLifetimeViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            ObjectLifetimeViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid(), false);
                window.clipboardData.setData("Text", formatted);
            };
            return ObjectLifetimeViewModel;
        }());
        F1Viz.ObjectLifetimeViewModel = ObjectLifetimeViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var ProcessesViewModel = (function () {
            function ProcessesViewModel(reportType, additionalActions, context) {
                var _this = this;
                this._treeGrid = ko.observable();
                this._reportType = reportType;
                F1Viz.ProcessesDAO.create()
                    .then(function (dao) { return _this._dao = dao; })
                    .then(function () { return _this._dao.getHeader(); })
                    .then(function (config) {
                    var header = new F1Viz.TreeGridHeaderViewModel(config, _this._dao, _this._dao.defaultSortColumn);
                    header.sortDirection(F1Viz.SortDirection.Asc);
                    _this._treeGrid(new F1Viz.TreeGridViewModel(_this._dao, header, "ProcessesView_TableAriaLabel"));
                    if (context && context.ctype === F1Viz.ContextType.Thread) {
                        _this._treeGrid().dataLoadPromise.then(function () {
                            var allRows = _this._treeGrid().treeAsArray();
                            for (var rowIndex = 0; rowIndex < allRows.length; ++rowIndex) {
                                var row = allRows[rowIndex];
                                if (row.dto.k && row.dto.k.cid === context.cid) {
                                    _this._treeGrid().selectedRows.push(rowIndex);
                                    break;
                                }
                            }
                        });
                    }
                    additionalActions([
                        { template: 'SearchControlView', viewModel: new F1Viz.SearchControlViewModel(_this._treeGrid(), true, 'Processes_SearchAriaLabel') }
                    ]);
                });
            }
            Object.defineProperty(ProcessesViewModel.prototype, "processesList", {
                get: function () {
                    return this._treeGrid;
                },
                enumerable: true,
                configurable: true
            });
            ProcessesViewModel.prototype.contextMenu = function (viewModel, event) {
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._treeGrid().onClick(this._treeGrid(), event);
                var menuItems = [];
                var navigator = F1Viz.getMainViewNavigator();
                if (this._reportType === F1Viz.ReportType.Concurrency && row.dto.k && row.dto.k.ctype === F1Viz.ContextType.Thread) {
                    menuItems.push({
                        label: Resources.getString("ContextMenu_ShowInThreadDetailsView"),
                        callback: function () { return navigator.navigateToView(F1Viz.MainViews.ThreadDetails, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        type: ContextMenu.MenuItemType.separator
                    });
                }
                menuItems.push({
                    label: Resources.getString("ContextMenu_Copy"),
                    callback: this.onCopy.bind(this),
                    type: ContextMenu.MenuItemType.command
                });
                return ContextMenu.create(menuItems);
            };
            ProcessesViewModel.prototype.onKeyDown = function (viewModel, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy();
                return false;
            };
            ProcessesViewModel.prototype.onCopy = function () {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(this._treeGrid());
                window.clipboardData.setData("Text", formatted);
            };
            return ProcessesViewModel;
        }());
        F1Viz.ProcessesViewModel = ProcessesViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        (function (ResourceThreadPivot) {
            ResourceThreadPivot[ResourceThreadPivot["Resource"] = 0] = "Resource";
            ResourceThreadPivot[ResourceThreadPivot["Thread"] = 1] = "Thread";
        })(F1Viz.ResourceThreadPivot || (F1Viz.ResourceThreadPivot = {}));
        var ResourceThreadPivot = F1Viz.ResourceThreadPivot;
        var ResourceThreadDetailsViewModel = (function () {
            function ResourceThreadDetailsViewModel(pivot, context) {
                var _this = this;
                this._mainTreeGrid = ko.observable();
                this._detailsTreeGrid = ko.observable();
                this._context = ko.observable(null);
                this._title = ko.pureComputed(function () { return _this.computeTitle(); });
                this._subtitle = ko.pureComputed(function () { return _this.computeSubtitle(); });
                this._contentionsTitle = ko.pureComputed(function () { return _this.computeContentionsTitle(); });
                this._showCallStack = ko.pureComputed(function () { return _this.computeShowCallStack(); });
                this._callStackItems = ko.observableArray([]);
                this._subscriptions = [];
                this._pivot = pivot;
                var mainPromise = F1Viz.ResourceThreadDetailsDAO.create(pivot)
                    .then(function (dao) { return _this._mainDAO = dao; })
                    .then(function () { return _this._mainDAO.getHeader(); });
                var detailsPromise = F1Viz.ContentionInstancesDAO.create(pivot)
                    .then(function (dao) { return _this._detailsDAO = dao; })
                    .then(function () { return _this._detailsDAO.getHeader(); });
                Microsoft.Plugin.Promise.join([mainPromise, detailsPromise])
                    .then(function (results) {
                    var mainHeader = new F1Viz.TreeGridHeaderViewModel(results[0], _this._mainDAO, _this._mainDAO.defaultSortColumn);
                    mainHeader.sortDirection(F1Viz.SortDirection.Desc);
                    _this._mainTreeGrid(new F1Viz.TreeGridViewModel(_this._mainDAO, mainHeader, "ResourceThreadDetails_TreeGridAriaLabel"));
                    var detailsHeader = new F1Viz.TreeGridHeaderViewModel(results[1], _this._detailsDAO, _this._detailsDAO.defaultSortColumn);
                    detailsHeader.sortDirection(F1Viz.SortDirection.Asc);
                    _this._detailsTreeGrid(new F1Viz.TreeGridViewModel(_this._detailsDAO, detailsHeader, "ContentionInstances_TableAriaLabel"));
                    _this._subscriptions.push(_this._mainTreeGrid().selectedRows.subscribe(_this.onResourceSelectionChanged.bind(_this)));
                    _this._subscriptions.push(_this._detailsTreeGrid().focusedRow.subscribe(_this.onContentionSelectionChanged.bind(_this)));
                    _this._showOverlay = ko.pureComputed(function () { return _this._mainTreeGrid().selectedRows().length === 0; });
                    _this._subscriptions.push(_this._context.subscribe(_this.onContextChanged.bind(_this)));
                    _this._mainDAO.getContextInfo(context)
                        .then(function (threadInfo) { return _this._context(threadInfo); });
                });
            }
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "pivot", {
                get: function () {
                    return this._pivot;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "contentions", {
                get: function () {
                    return this._detailsTreeGrid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "resourceThreadDetails", {
                get: function () {
                    return this._mainTreeGrid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "title", {
                get: function () {
                    return this._title;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "subtitle", {
                get: function () {
                    return this._subtitle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "contentionsTitle", {
                get: function () {
                    return this._contentionsTitle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "showOverlay", {
                get: function () {
                    return this._showOverlay;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "showCallStack", {
                get: function () {
                    return this._showCallStack;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceThreadDetailsViewModel.prototype, "callStackItems", {
                get: function () {
                    return this._callStackItems;
                },
                enumerable: true,
                configurable: true
            });
            ResourceThreadDetailsViewModel.prototype.dispose = function () {
                this._detailsDAO.clearCache();
                this._subscriptions.forEach(function (s) { return s.dispose(); });
            };
            ResourceThreadDetailsViewModel.prototype.contextMenuMain = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._mainTreeGrid().onClick(this._mainTreeGrid(), event);
                var navigator = F1Viz.getMainViewNavigator();
                return ContextMenu.create([{
                        label: Resources.getString(this._pivot === ResourceThreadPivot.Resource
                            ? "ContextMenu_ShowInThreadDetailsView"
                            : "ContextMenu_ShowInResourceDetailsView"),
                        callback: function () { return navigator.navigateToView(_this._pivot === ResourceThreadPivot.Resource ? F1Viz.MainViews.ThreadDetails : F1Viz.MainViews.ResourceDetails, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString(this._pivot === ResourceThreadPivot.Resource
                            ? "ContextMenu_ShowInProcessesView"
                            : "ContextMenu_ShowInContentionView"),
                        callback: function () { return navigator.navigateToView(_this._pivot === ResourceThreadPivot.Resource ? F1Viz.MainViews.Processes : F1Viz.MainViews.Contention, row.dto.k); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: function () { return _this.onCopy(_this._mainTreeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            ResourceThreadDetailsViewModel.prototype.contextMenuDetails = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._detailsTreeGrid().onClick(this._detailsTreeGrid(), event);
                return ContextMenu.create([{
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: function () { return _this.onCopy(_this._detailsTreeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            ResourceThreadDetailsViewModel.prototype.onKeyDownMain = function (viewModel, event) {
                return this.onKeyDown(this._mainTreeGrid(), event);
            };
            ResourceThreadDetailsViewModel.prototype.onKeyDownDetails = function (viewModel, event) {
                return this.onKeyDown(this._detailsTreeGrid(), event);
            };
            ResourceThreadDetailsViewModel.prototype.onKeyDown = function (treeGrid, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy(treeGrid);
                return false;
            };
            ResourceThreadDetailsViewModel.prototype.onCopy = function (treeGrid) {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(treeGrid, false);
                window.clipboardData.setData("Text", formatted);
            };
            ResourceThreadDetailsViewModel.prototype.onContextChanged = function (threadContext) {
                if (!threadContext) {
                    return;
                }
                this._mainDAO.context = threadContext.k;
                this._detailsDAO.context = threadContext.k;
                this._mainTreeGrid().reloadData();
            };
            ResourceThreadDetailsViewModel.prototype.onResourceSelectionChanged = function (selection) {
                var _this = this;
                if (selection.length === 0) {
                    return;
                }
                var keys = selection.map(function (i) {
                    var row = _this._mainTreeGrid().treeAsArray()[i];
                    var resourceThreadRow = row;
                    return resourceThreadRow.id;
                });
                this._detailsDAO.contentionContextKeys = keys;
                this._detailsTreeGrid().reloadData();
            };
            ResourceThreadDetailsViewModel.prototype.onContentionSelectionChanged = function (selection) {
                var _this = this;
                var row = selection;
                if (!selection || !row.dto) {
                    return;
                }
                this._detailsDAO.getCallStack(row.dto.id)
                    .then(function (callStackItems) { return _this._callStackItems(callStackItems); });
            };
            ResourceThreadDetailsViewModel.prototype.computeContentionsTitle = function () {
                var _this = this;
                if (!this._mainTreeGrid() || this._mainTreeGrid().selectedRows().length === 0) {
                    return Resources.getString("ContentionInstances_TableEmptyTitle");
                }
                var names = this._mainTreeGrid().selectedRows().map(function (i) {
                    var row = _this._mainTreeGrid().treeAsArray()[i];
                    var resourceRow = row;
                    return _this.getName(resourceRow.dto);
                }).join(", ");
                return Resources.getString("ContentionInstances_TableTitle", names);
            };
            ResourceThreadDetailsViewModel.prototype.computeShowCallStack = function () {
                var focusedRow = this._detailsTreeGrid().focusedRow();
                var row = focusedRow;
                return focusedRow && row.dto && row.dto.rsf !== null;
            };
            ResourceThreadDetailsViewModel.prototype.computeTitle = function () {
                var context = this._context();
                if (!context) {
                    return "";
                }
                return this._pivot === ResourceThreadPivot.Resource
                    ? Resources.getString("ResourceDetails_Title", this.getName(context))
                    : Resources.getString("ThreadDetails_Title", this.getName(context), this.getThreadId(context));
            };
            ResourceThreadDetailsViewModel.prototype.computeSubtitle = function () {
                var context = this._context();
                return context
                    ? Resources.getString("ResourceThreadDetails_Subtitle", this.getContentions(context), Microsoft.F1Viz.CpuSamplingUtilities.localizeNumber(this.getBlockedTime(context)))
                    : "";
            };
            ResourceThreadDetailsViewModel.prototype.onCallStackItemClicked = function (viewModel) {
                var navigator = F1Viz.getMainViewNavigator();
                navigator.navigateToView(F1Viz.MainViews.FunctionDetails, viewModel.context);
            };
            ResourceThreadDetailsViewModel.prototype.getName = function (row) {
                for (var i = 0; i < row.d.length; ++i) {
                    if (row.d[i].i === "name") {
                        return row.d[i].v;
                    }
                }
                return "";
            };
            ResourceThreadDetailsViewModel.prototype.getContentions = function (row) {
                for (var i = 0; i < row.d.length; ++i) {
                    if (row.d[i].i === "ct") {
                        return row.d[i].v;
                    }
                }
                return 0;
            };
            ResourceThreadDetailsViewModel.prototype.getBlockedTime = function (row) {
                for (var i = 0; i < row.d.length; ++i) {
                    if (row.d[i].i === "bt") {
                        return row.d[i].v;
                    }
                }
                return 0;
            };
            ResourceThreadDetailsViewModel.prototype.getThreadId = function (row) {
                for (var i = 0; i < row.d.length; ++i) {
                    if (row.d[i].i === "tid" || row.d[i].i === "ctid") {
                        return row.d[i].v;
                    }
                }
                return 0;
            };
            return ResourceThreadDetailsViewModel;
        }());
        F1Viz.ResourceThreadDetailsViewModel = ResourceThreadDetailsViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var SearchControlViewModel = (function () {
            function SearchControlViewModel(model, isEnabled, ariaLabelToken) {
                var _this = this;
                this._showSettings = ko.observable(false);
                this._searchInputHasFocus = ko.observable(false);
                this._searchSubmitHasFocus = ko.observable(false);
                this._isRegularExpression = ko.observable(false);
                this._isRegularExpressionHasFocus = ko.observable(false);
                this._isCaseSensitive = ko.observable(false);
                this._isCaseSensitiveHasFocus = ko.observable(false);
                this._searchTerm = ko.observable("");
                this._autoCollapseTimeoutMs = null;
                this._isDisabled = ko.observable(false);
                this._model = model;
                this._ariaLabelToken = ariaLabelToken;
                this._isRegularExpression.subscribe(function (newValue) {
                    window.clearTimeout(_this._autoCollapseTimeoutMs);
                    _this._autoCollapseTimeoutMs = window.setTimeout(function () { return _this.showSettings(false); }, SearchControlViewModel.autoCollapseTimeMs);
                });
                this._isCaseSensitive.subscribe(function (newValue) {
                    window.clearTimeout(_this._autoCollapseTimeoutMs);
                    _this._autoCollapseTimeoutMs = window.setTimeout(function () { return _this.showSettings(false); }, SearchControlViewModel.autoCollapseTimeMs);
                });
                this._showSettings.subscribe(function (visible) {
                    window.clearTimeout(_this._autoCollapseTimeoutMs);
                    _this._autoCollapseTimeoutMs = null;
                });
                this._hasFocus = ko.pureComputed(function () {
                    return !_this._isDisabled() && (_this._searchInputHasFocus() || _this._searchSubmitHasFocus());
                });
                this._isDisabled(!isEnabled);
            }
            Object.defineProperty(SearchControlViewModel.prototype, "ariaLabelToken", {
                get: function () {
                    return this._ariaLabelToken;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "showSettings", {
                get: function () {
                    return this._showSettings;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "isDisabled", {
                get: function () {
                    return this._isDisabled;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "hasFocus", {
                get: function () {
                    return this._hasFocus;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "searchInputHasFocus", {
                get: function () {
                    return this._searchInputHasFocus;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "searchSubmitHasFocus", {
                get: function () {
                    return this._searchSubmitHasFocus;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "isCaseSensitive", {
                get: function () {
                    return this._isCaseSensitive;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "isCaseSensitiveHasFocus", {
                get: function () {
                    return this._isCaseSensitiveHasFocus;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "isRegularExpression", {
                get: function () {
                    return this._isRegularExpression;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "isRegularExpressionHasFocus", {
                get: function () {
                    return this._isRegularExpressionHasFocus;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel.prototype, "searchTerm", {
                get: function () {
                    return this._searchTerm;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SearchControlViewModel, "autoCollapseTimeMs", {
                get: function () {
                    return 2000;
                },
                enumerable: true,
                configurable: true
            });
            SearchControlViewModel.prototype.onAfterDomInsert = function (elements, viewModel) {
                var element = elements[0].parentNode;
                var onMouseDown = function (event) {
                    if (!viewModel.showSettings() || viewModel.isDisabled()) {
                        return;
                    }
                    if (!element.contains(event.target)) {
                        viewModel.showSettings(false);
                    }
                };
                var onKeyDown = function (event) {
                    if (event.keyCode === F1Viz.Common.KeyCodes.F3) {
                        viewModel.search();
                        event.preventDefault();
                    }
                };
                var onBlur = function (event) {
                    if (viewModel.showSettings() && !element.contains(document.activeElement)) {
                        viewModel.showSettings(false);
                    }
                };
                element.addEventListener("blur", onBlur, true);
                window.addEventListener("keydown", onKeyDown);
                window.addEventListener("mousedown", onMouseDown);
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    window.removeEventListener("keydown", onKeyDown);
                    window.removeEventListener("mousedown", onMouseDown);
                    element.removeEventListener("blur", onBlur);
                });
            };
            SearchControlViewModel.prototype.search = function () {
                if (this.isDisabled()) {
                    return;
                }
                this._model.search(this._searchTerm(), this._isCaseSensitive(), this._isRegularExpression());
            };
            SearchControlViewModel.prototype.onDropDownClick = function (viewModel, event) {
                if (this.isDisabled()) {
                    return false;
                }
                this._showSettings(!this._showSettings());
                return false;
            };
            SearchControlViewModel.prototype.onSearchBoxKeyDown = function (viewModel, event) {
                if (this.isDisabled()) {
                    return true;
                }
                if (F1Viz.Common.KeyCodes.Enter === event.keyCode) {
                    this.search();
                    return false;
                }
                else if (F1Viz.Common.KeyCodes.Escape === event.keyCode) {
                    this._searchTerm("");
                    return false;
                }
                else if (F1Viz.Common.KeyCodes.ArrowDown === event.keyCode) {
                    this._showSettings(true);
                    this.isRegularExpressionHasFocus(true);
                    return false;
                }
                return true;
            };
            SearchControlViewModel.prototype.onFlyoutKeyDown = function (viewModel, event) {
                if (F1Viz.Common.KeyCodes.ArrowUp === event.keyCode || F1Viz.Common.KeyCodes.ArrowDown === event.keyCode) {
                    var toggleFocus = this.isRegularExpressionHasFocus();
                    this.isRegularExpressionHasFocus(!toggleFocus);
                    this.isCaseSensitiveHasFocus(toggleFocus);
                    return false;
                }
                else if (F1Viz.Common.KeyCodes.Escape === event.keyCode) {
                    this._showSettings(false);
                    return false;
                }
                return true;
            };
            return SearchControlViewModel;
        }());
        F1Viz.SearchControlViewModel = SearchControlViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var SummaryViewModel = (function () {
            function SummaryViewModel(reportSummary) {
                var _this = this;
                this._navigator = F1Viz.getMainViewNavigator();
                this._dao = new F1Viz.SummaryDAO();
                this._hotPath = ko.observableArray([]);
                this._functionsList = ko.observableArray([]);
                this._haveFilter = ko.observable(false);
                this._isJmcEnabled = ko.observable(true);
                this._haveViewGuidance = ko.observable(false);
                this._haveMarks = ko.observable(false);
                this._reportMetricTotal = ko.observable(0);
                this._resourcesList = ko.observableArray([]);
                this._threadsList = ko.observableArray([]);
                this._typesMemoryList = ko.observableArray([]);
                this._typesInstancesList = ko.observableArray([]);
                this._summaryGraph = ko.observable(null);
                this._graphConfig = {
                    height: 180,
                    loadCss: function () { },
                    jsonConfig: {},
                    scale: {},
                    timeRange: new F1Viz.JsonTimespan(F1Viz.BigNumber.zero, F1Viz.BigNumber.zero),
                    legend: [],
                    unit: ""
                };
                this._graphTitleConfig = {
                    isBodyExpanded: true
                };
                this._reportType = reportSummary.type;
                this._collectionMechanism = reportSummary.collectionMechanism;
                this._graphConfig.timeRange = reportSummary.totalTime;
                this._showGraph = reportSummary.additionalReportData.indexOf(F1Viz.AdditionalReportData.Counters) !== -1;
                this._hasLifetimeData = reportSummary.additionalReportData.indexOf(F1Viz.AdditionalReportData.ObjectLifetime) !== -1;
                this._dao.isJmcEnabled().then(function (isJmcEnabled) { return _this._isJmcEnabled(isJmcEnabled); });
                this._dao.haveViewGuidance().then(function (haveViewGuidance) { return _this._haveViewGuidance(haveViewGuidance); });
                this._dao.haveMarks().then(function (haveMarks) { return _this._haveMarks(haveMarks); });
                if (this._showGraph) {
                    this.createSummaryGraph(reportSummary.isSerialized);
                }
                this.loadData();
                this.queryForInfoBar();
            }
            Object.defineProperty(SummaryViewModel.prototype, "collectionMechanism", {
                get: function () {
                    return this._collectionMechanism;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "reportType", {
                get: function () {
                    return this._reportType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "reportMetricTotal", {
                get: function () {
                    return this._reportMetricTotal;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "showGraph", {
                get: function () {
                    return this._showGraph;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "haveFilter", {
                get: function () {
                    return this._haveFilter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "isJmcEnabled", {
                get: function () {
                    return this._isJmcEnabled;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "haveViewGuidance", {
                get: function () {
                    return this._haveViewGuidance;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "haveMarks", {
                get: function () {
                    return this._haveMarks;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "hotPath", {
                get: function () {
                    return this._hotPath;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "functionsList", {
                get: function () {
                    return this._functionsList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "resourcesList", {
                get: function () {
                    return this._resourcesList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "threadsList", {
                get: function () {
                    return this._threadsList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "typesMemoryList", {
                get: function () {
                    return this._typesMemoryList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "typesInstancesList", {
                get: function () {
                    return this._typesInstancesList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SummaryViewModel.prototype, "summaryGraph", {
                get: function () {
                    return this._summaryGraph;
                },
                enumerable: true,
                configurable: true
            });
            SummaryViewModel.prototype.dispose = function () {
                F1Viz.getViewEventManager().selectionChanged.removeEventListener(this._viewportChangedBoundFunction);
                window.removeEventListener("resize", this._onResizeBoundFunction);
                var graph = this._summaryGraph();
                if (graph) {
                    graph.dispose();
                }
            };
            SummaryViewModel.prototype.contextMenu = function (viewModel, event) {
                var _this = this;
                if (!viewModel.name) {
                    return;
                }
                var config = [];
                if (viewModel.context && viewModel.context.ctype === F1Viz.ContextType.Function) {
                    config.push({
                        label: Resources.getString("ContextMenu_ViewSource"),
                        disabled: function () { return !viewModel.rsf; },
                        callback: function () { return _this._dao.viewSource(viewModel.rsf, typeof viewModel.functionLineNumber === "number" ? viewModel.functionLineNumber : 1); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_ShowInModulesView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.Modules, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInFunctionsView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.Functions, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowFunctionDetails"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.FunctionDetails, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCallingFunctions", viewModel.name),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.CallerCallee, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowCalledFunctions", viewModel.name),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.CallerCallee, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                else if (viewModel.context && viewModel.context.ctype === F1Viz.ContextType.Type) {
                    config.push({
                        label: Resources.getString("ContextMenu_ShowInAllocationView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.Allocation, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    });
                    if (this._hasLifetimeData) {
                        config.push({
                            label: Resources.getString("ContextMenu_ShowInLifetimeView"),
                            callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.ObjectLifetime, viewModel.context); },
                            type: ContextMenu.MenuItemType.command
                        });
                    }
                }
                else if (viewModel.context && viewModel.context.ctype === F1Viz.ContextType.Resource) {
                    config.push({
                        label: Resources.getString("ContextMenu_ShowInContentionView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.Contention, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInResourceDetailsView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.ResourceDetails, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                else if (viewModel.context && viewModel.context.ctype === F1Viz.ContextType.Thread) {
                    config.push({
                        label: Resources.getString("ContextMenu_ShowInProcessesView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.Processes, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        label: Resources.getString("ContextMenu_ShowInThreadDetailsView"),
                        callback: function () { return _this._navigator.navigateToView(F1Viz.MainViews.ThreadDetails, viewModel.context); },
                        type: ContextMenu.MenuItemType.command
                    });
                }
                if (config.length !== 0) {
                    config.push({
                        type: ContextMenu.MenuItemType.separator
                    });
                }
                config.push({
                    label: Resources.getString("ContextMenu_Copy"),
                    callback: this.onContextMenuCopy.bind(this),
                    type: ContextMenu.MenuItemType.command
                });
                return ContextMenu.create(config);
            };
            SummaryViewModel.prototype.onSelectionChanged = function (selectionArgs) {
                this._currentSelection = selectionArgs.position;
                if (!this._summaryGraph()) {
                    return;
                }
                this._summaryGraph().onViewportChanged({
                    currentTimespan: this._graphConfig.timeRange,
                    selectionTimespan: selectionArgs.position,
                    isIntermittent: selectionArgs.isIntermittent
                });
            };
            SummaryViewModel.prototype.onHotPathItemClicked = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.FunctionDetails, viewModel.context);
            };
            SummaryViewModel.prototype.onFunctionClicked = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.FunctionDetails, viewModel.context);
            };
            SummaryViewModel.prototype.onResourceClicked = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.ResourceDetails, viewModel.context);
            };
            SummaryViewModel.prototype.onThreadClicked = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.ThreadDetails, viewModel.context);
            };
            SummaryViewModel.prototype.onTypeClicked = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.Allocation, viewModel.context);
            };
            SummaryViewModel.prototype.onNavigateToCallTree = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.CallTree);
            };
            SummaryViewModel.prototype.onNavigateToFunctions = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.Functions);
            };
            SummaryViewModel.prototype.toggleJmc = function (viewModel, event) {
                var _this = this;
                this._isJmcEnabled(!this._isJmcEnabled());
                this._dao.toggleJmc()
                    .then(function () { return _this.loadData(); })
                    .then(function () { return _this._navigator.resetNavigationStack(); });
            };
            SummaryViewModel.prototype.onSetTimeFilter = function () {
                var _this = this;
                this._dao.setTimeFilter(this._currentSelection)
                    .then(function () { return _this.loadData(); })
                    .then(function () {
                    _this._timeFilterOverlay.updateTimespan(_this._currentSelection);
                    _this._timeSelectionOverlay.removeSelection();
                    _this._haveFilter(true);
                    if (_this._summaryGraph()) {
                        _this.updateGraphLabel(_this._currentSelection);
                        _this._summaryGraph().setTimeFilter(_this._currentSelection);
                    }
                    _this._currentSelection = null;
                    _this.queryForInfoBar();
                });
            };
            SummaryViewModel.prototype.onClearFilter = function (viewModel, event) {
                var _this = this;
                viewModel._dao.setTimeFilter(null)
                    .then(function () { return _this.loadData(); })
                    .then(function () {
                    _this._timeFilterOverlay.updateTimespan(null);
                    _this._haveFilter(false);
                    if (_this._summaryGraph()) {
                        _this.updateGraphLabel(null);
                        _this._summaryGraph().setTimeFilter(null);
                    }
                    _this._currentSelection = null;
                    _this.queryForInfoBar();
                });
            };
            SummaryViewModel.prototype.onViewGuidance = function (viewModel, event) {
                this._dao.showGuidance();
            };
            SummaryViewModel.prototype.onShowMarks = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.Marks);
            };
            SummaryViewModel.prototype.onShowHotLines = function (viewModel, event) {
                this._navigator.navigateToView(F1Viz.MainViews.Lines);
            };
            SummaryViewModel.prototype.onShowTrimmedCallTree = function (viewModel, event) {
                var _this = this;
                F1Viz.CallTreeDAO.create()
                    .then(function (dao) { return dao.trimCallTree(); })
                    .then(function () { return _this._navigator.navigateToView(F1Viz.MainViews.CallTree); });
            };
            SummaryViewModel.prototype.onCompareReports = function (viewModel, event) {
                this._dao.compareReports();
            };
            SummaryViewModel.prototype.onExportReportData = function (viewModel, event) {
                (new F1Viz.ReportDAO()).exportReport();
            };
            SummaryViewModel.prototype.onSaveAnalyzedReport = function (viewModel, event) {
                this._dao.saveAnalyzedReport();
            };
            SummaryViewModel.prototype.onToggleFullscreen = function (viewModel, event) {
                this._dao.toggleFullscreen();
            };
            SummaryViewModel.prototype.onSetSymbolPath = function (viewModel, event) {
                this._dao.showSymbolsOptions();
            };
            SummaryViewModel.prototype.onContextMenuCopy = function () {
            };
            SummaryViewModel.prototype.loadData = function () {
                var _this = this;
                this._dao.getMetricTotal().then(function (metricTotal) { return _this._reportMetricTotal(metricTotal); });
                if (this._reportType === F1Viz.ReportType.Concurrency) {
                    this._dao.getResourcesListData().then(function (dto) { return _this._resourcesList(dto); });
                    this._dao.getThreadsListData().then(function (dto) { return _this._threadsList(dto); });
                }
                else {
                    this._dao.getFunctionsListData().then(function (dto) { return _this._functionsList(dto); });
                    if (this._reportType === F1Viz.ReportType.Memory) {
                        this._dao.getTypesMemoryListData().then(function (dto) { return _this._typesMemoryList(dto); });
                        this._dao.getTypesInstancesListData().then(function (dto) { return _this._typesInstancesList(dto); });
                    }
                    else {
                        this._dao.getHotPathData().then(function (hotPathDto) { return _this._hotPath(hotPathDto); });
                    }
                }
            };
            SummaryViewModel.prototype.createSummaryGraph = function (isSerialized) {
                var _this = this;
                var seriesTitle;
                var seriesTooltip;
                var graphAriaLabel;
                if (this._reportType === F1Viz.ReportType.Concurrency) {
                    this._graphConfig.scale = {
                        isFixed: false,
                        minimum: 0,
                        maximum: 1,
                    };
                    this._graphTitleConfig.titleText = Resources.getString("SummaryView_ConcurrencyGraphTitle");
                    this._graphTitleConfig.unit = Resources.getString("SummaryView_ConcurrencyGraphUnit");
                    this._graphTitleConfig.description = Resources.getString("SummaryView_ConcurrencyGraphTitle");
                    seriesTitle = Resources.getString("SummaryView_ConcurrencySeriesTitle");
                    seriesTooltip = Resources.getString("SummaryView_ConcurrencySeriesTooltip");
                }
                else {
                    this._graphConfig.scale = {
                        isFixed: true,
                        minimum: 0,
                        maximum: 100,
                        axes: [{ value: 0 }, { value: 20 }, { value: 40 }, { value: 60 }, { value: 80 }, { value: 100 }]
                    };
                    this._graphTitleConfig.titleText = Resources.getString("SummaryView_CpuGraphTitle");
                    this._graphTitleConfig.unit = Resources.getString("SummaryView_CpuGraphUnit");
                    this._graphTitleConfig.description = Resources.getString("SummaryView_CpuGraphTitle");
                    seriesTitle = Resources.getString("SummaryView_CpuSeriesTitle");
                    seriesTooltip = Resources.getString("SummaryView_CpuSeriesTooltip");
                }
                this._dao.timeFilter().then(function (timeFilter) {
                    _this._haveFilter(timeFilter !== null);
                    var unitConverter = new F1Viz.LocalizedUnitConverter();
                    var dataSeries = new F1Viz.SummaryDataSeries(_this._graphConfig.timeRange, seriesTitle, seriesTooltip, unitConverter, _this._dao);
                    _this._graph = new F1Viz.MultiSeriesGraph(_this._graphConfig, [dataSeries]);
                    _this.updateGraphLabel(timeFilter);
                    var summaryGraphBase = new F1Viz.SwimlaneBase(_this._graphTitleConfig, _this._graphConfig.height, _this._graphConfig.timeRange, timeFilter);
                    if (!isSerialized) {
                        _this._timeFilterOverlay = new F1Viz.TimeFilterOverlay(_this._graph, _this._graphConfig.timeRange, timeFilter);
                        _this._timeSelectionOverlay = new F1Viz.SelectionOverlay(_this._timeFilterOverlay, _this._graphConfig.timeRange, null);
                        summaryGraphBase.addMainRegionControl(_this._timeSelectionOverlay);
                    }
                    else {
                        summaryGraphBase.addMainRegionControl(_this._graph);
                    }
                    summaryGraphBase.addMainRegionControl(new F1Viz.GraphTimeAxis(_this._graphConfig.timeRange));
                    var gridLineControl = new F1Viz.GridLineRenderer(_this._graphConfig.timeRange, 6);
                    summaryGraphBase.addMainRegionControl(gridLineControl);
                    var dataScale = new F1Viz.Scale(_this._graphConfig.scale, F1Viz.ScaleType.Left, unitConverter, gridLineControl);
                    _this._graph.scaleChangedEvent.addEventListener(dataScale.onScaleChanged.bind(dataScale));
                    summaryGraphBase.addLeftRegionControl(dataScale);
                    _this._viewportChangedBoundFunction = _this.onSelectionChanged.bind(_this);
                    _this._onResizeBoundFunction = F1Viz.eventThrottler(function (evt) { return summaryGraphBase.resize(evt); }, F1Viz.Constants.WindowResizeThrottle);
                    if (!isSerialized) {
                        var graphContextMenu = ContextMenu.create([{
                                label: Resources.getString("SummaryView_ContextMenuFilterBySelection"),
                                disabled: function () { return !_this._currentSelection; },
                                callback: _this.onSetTimeFilter.bind(_this),
                                type: ContextMenu.MenuItemType.command,
                                iconEnabled: "filter",
                                iconDisabled: "filter"
                            }]);
                        summaryGraphBase.container.addEventListener("contextmenu", function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                            graphContextMenu.show(event.clientX, event.clientY);
                        });
                        ko.utils.domNodeDisposal.addDisposeCallback(summaryGraphBase.container, function () { return graphContextMenu.dispose(); });
                    }
                    _this._summaryGraph(summaryGraphBase);
                    F1Viz.getViewEventManager().selectionChanged.addEventListener(_this._viewportChangedBoundFunction);
                    window.addEventListener("resize", _this._onResizeBoundFunction);
                });
            };
            SummaryViewModel.prototype.updateGraphLabel = function (timeFilter) {
                var graphAriaLabel = this._reportType === F1Viz.ReportType.Concurrency ?
                    Resources.getString("SummaryView_ConcurrencyGraphAriaLabel") :
                    Resources.getString("SummaryView_CpuGraphAriaLabel");
                if (timeFilter) {
                    graphAriaLabel += "\n" + Resources.getString("SummaryView_CpuGraphTimeFilter", F1Viz.RulerUtilities.formatTime(timeFilter.begin), F1Viz.RulerUtilities.formatTime(timeFilter.end));
                }
                this._graph.container.setAttribute("aria-label", graphAriaLabel);
            };
            SummaryViewModel.prototype.queryForInfoBar = function () {
                var _this = this;
                var dataQueryPromise = this._dao.containsData();
                var jmcQueryPromise = this._dao.isJmcEnabled();
                return Microsoft.Plugin.Promise.join([dataQueryPromise, jmcQueryPromise]).then(function (results) {
                    if (results.length != 2) {
                        return;
                    }
                    var containsData = results[0];
                    var jmcEnabled = results[1];
                    var infoBarProvider = F1Viz.getInfoBarProvider();
                    infoBarProvider.clearInfoBars();
                    if (!containsData) {
                        if (jmcEnabled) {
                            var infoBar = new F1Viz.InformationBarControl("SummaryView_NoDataJmcMessage", function () { return infoBarProvider.removeInfoBar("SummaryView_NoDataJmcMessage"); }, "SummaryView_ShowAllCodeButtonLabel", function () { return _this.toggleJmc(_this, null); });
                            infoBarProvider.showInfoBar(infoBar);
                        }
                        if (_this._haveFilter()) {
                            var infoBar = new F1Viz.InformationBarControl("SummaryView_NoDataTimeFilterMessage", function () { return infoBarProvider.removeInfoBar("SummaryView_NoDataTimeFilterMessage"); }, "SummaryView_ClearFilterButtonLabel", function () { return _this.onClearFilter(_this, null); });
                            infoBarProvider.showInfoBar(infoBar);
                        }
                    }
                });
            };
            return SummaryViewModel;
        }());
        F1Viz.SummaryViewModel = SummaryViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var Resources = Microsoft.Plugin.Resources;
        var ContextMenu = Microsoft.Plugin.ContextMenu;
        var TierInteractionsViewModel = (function () {
            function TierInteractionsViewModel() {
                var _this = this;
                this._mainTreeGrid = ko.observable();
                this._detailsTreeGrid = ko.observable();
                this._subscriptions = [];
                var mainPromise = F1Viz.TierInteractionsDAO.create()
                    .then(function (dao) { return _this._mainDAO = dao; })
                    .then(function () { return _this._mainDAO.getHeader(); });
                var detailsPromise = F1Viz.DatabaseCommandsDAO.create()
                    .then(function (dao) { return _this._detailsDAO = dao; })
                    .then(function () { return _this._detailsDAO.getHeader(); });
                Microsoft.Plugin.Promise.join([mainPromise, detailsPromise])
                    .then(function (results) {
                    _this._showOverlay = ko.pureComputed(function () { return _this.computeShowOverlay(); });
                    var mainHeader = new F1Viz.TreeGridHeaderViewModel(results[0], _this._mainDAO, _this._mainDAO.defaultSortColumn);
                    _this._mainTreeGrid(new F1Viz.TreeGridViewModel(_this._mainDAO, mainHeader, "TierInteractions_TreeGridAriaLabel"));
                    var detailsHeader = new F1Viz.TreeGridHeaderViewModel(results[1], _this._detailsDAO, _this._detailsDAO.defaultSortColumn);
                    _this._detailsTreeGrid(new F1Viz.TreeGridViewModel(_this._detailsDAO, detailsHeader, "TierInteractions_DatabaseCommandsTableAriaLabel"));
                    _this._subscriptions.push(_this._mainTreeGrid().focusedRow.subscribe(function (selection) {
                        if (!selection) {
                            return;
                        }
                        var row = selection;
                        _this._detailsDAO.tierInteraction = row;
                        _this._detailsTreeGrid().reloadData();
                    }));
                });
            }
            Object.defineProperty(TierInteractionsViewModel.prototype, "databaseCommands", {
                get: function () {
                    return this._detailsTreeGrid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TierInteractionsViewModel.prototype, "tierInteractions", {
                get: function () {
                    return this._mainTreeGrid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TierInteractionsViewModel.prototype, "showOverlay", {
                get: function () {
                    return this._showOverlay;
                },
                enumerable: true,
                configurable: true
            });
            TierInteractionsViewModel.prototype.showHelp = function () {
                this._mainDAO.showHelp();
            };
            TierInteractionsViewModel.prototype.contextMenuMain = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._mainTreeGrid().onClick(this._mainTreeGrid(), event);
                return ContextMenu.create([{
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: function () { return _this.onCopy(_this._mainTreeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            TierInteractionsViewModel.prototype.contextMenuDetails = function (viewModel, event) {
                var _this = this;
                var row = viewModel;
                if (!row.dto) {
                    return null;
                }
                this._detailsTreeGrid().onClick(this._detailsTreeGrid(), event);
                return ContextMenu.create([{
                        label: Resources.getString("TierInteractions_ContextMenuViewCommand"),
                        callback: function () { return _this._detailsDAO.viewCommandText(row.commandText); },
                        type: ContextMenu.MenuItemType.command
                    }, {
                        type: ContextMenu.MenuItemType.separator
                    }, {
                        label: Resources.getString("ContextMenu_Copy"),
                        callback: function () { return _this.onCopy(_this._detailsTreeGrid()); },
                        type: ContextMenu.MenuItemType.command
                    }]);
            };
            TierInteractionsViewModel.prototype.onKeyDownMain = function (viewModel, event) {
                return this.onKeyDown(this._mainTreeGrid(), event);
            };
            TierInteractionsViewModel.prototype.onKeyDownDetails = function (viewModel, event) {
                return this.onKeyDown(this._detailsTreeGrid(), event);
            };
            TierInteractionsViewModel.prototype.onKeyDown = function (treeGrid, event) {
                if (!(event.ctrlKey && event.keyCode === F1Viz.Common.KeyCodes.C)) {
                    return true;
                }
                this.onCopy(treeGrid);
                return false;
            };
            TierInteractionsViewModel.prototype.onCopy = function (treeGrid) {
                var formatted = F1Viz.TreeGridUtils.formatTreeGridSelectedToText(treeGrid);
                window.clipboardData.setData("Text", formatted);
            };
            TierInteractionsViewModel.prototype.computeShowOverlay = function () {
                if (!this._mainTreeGrid() || !this._detailsTreeGrid()) {
                    return true;
                }
                var focusedRow = this._mainTreeGrid().focusedRow();
                var row = focusedRow;
                return !focusedRow || !row.parent;
            };
            TierInteractionsViewModel.prototype.dispose = function () {
                this._subscriptions.forEach(function (s) { return s.dispose(); });
            };
            return TierInteractionsViewModel;
        }());
        F1Viz.TierInteractionsViewModel = TierInteractionsViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var ToggleButtonViewModel = (function () {
            function ToggleButtonViewModel(svgIcon, svgDisabledIcon, ariaLabel) {
                var _this = this;
                this._isEnabled = ko.observable(false);
                this._isChecked = ko.observable(false);
                this._svgIcon = ko.pureComputed(function () { return _this._isEnabled() ? svgIcon : svgDisabledIcon; });
                this._ariaLabel = ariaLabel;
            }
            Object.defineProperty(ToggleButtonViewModel.prototype, "svgIcon", {
                get: function () {
                    return this._svgIcon;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToggleButtonViewModel.prototype, "ariaLabel", {
                get: function () {
                    return this._ariaLabel;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToggleButtonViewModel.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToggleButtonViewModel.prototype, "isChecked", {
                get: function () {
                    return this._isChecked;
                },
                enumerable: true,
                configurable: true
            });
            ToggleButtonViewModel.prototype.onClick = function (viewModel, event) {
                if (this._isEnabled()) {
                    this.isChecked(!this.isChecked());
                    return false;
                }
                return true;
            };
            return ToggleButtonViewModel;
        }());
        F1Viz.ToggleButtonViewModel = ToggleButtonViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var F1Viz;
    (function (F1Viz) {
        "use strict";
        var ToolbarItemViewModel = (function () {
            function ToolbarItemViewModel(svgIcon, ariaLabel, callback) {
                this._svgIcon = svgIcon;
                this._ariaLabel = ariaLabel;
                this._callback = callback;
            }
            Object.defineProperty(ToolbarItemViewModel.prototype, "svgIcon", {
                get: function () {
                    return this._svgIcon;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToolbarItemViewModel.prototype, "ariaLabel", {
                get: function () {
                    return this._ariaLabel;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToolbarItemViewModel.prototype, "callback", {
                get: function () {
                    return this._callback;
                },
                enumerable: true,
                configurable: true
            });
            return ToolbarItemViewModel;
        }());
        F1Viz.ToolbarItemViewModel = ToolbarItemViewModel;
    })(F1Viz = Microsoft.F1Viz || (Microsoft.F1Viz = {}));
})(Microsoft || (Microsoft = {}));

// SIG // Begin signature block
// SIG // MIIkVwYJKoZIhvcNAQcCoIIkSDCCJEQCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // NToa3e4uf+PzHsfmBnV2Rr1k3ys9drXZABxdCdhvjZig
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
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFi4w
// SIG // ghYqAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAEDXiUcmR+jHrgAAAAAAQMwDQYJYIZI
// SIG // AWUDBAIBBQCggawwGQYJKoZIhvcNAQkDMQwGCisGAQQB
// SIG // gjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcC
// SIG // ARUwLwYJKoZIhvcNAQkEMSIEIDCFgtYaIWcHpycbCY9e
// SIG // SBZhtoXiMJZ9uovyJ1AUjAVcMEAGCisGAQQBgjcCAQwx
// SIG // MjAwoBKAEABmADEAdgBpAHoALgBqAHOhGoAYaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUA
// SIG // BIIBAJIzPSwU72igoeURpSfTTHwY4bRrJNkDdDwkWT74
// SIG // etMSibtx6WV3xOk0KSsQROkKIdR7erzrHJkiGdHg81cH
// SIG // 4JOHrdJhSOwZVF4j5jNYXgb1l/bEsW3DGc/l0pXU7D8Q
// SIG // okMaJOmp2c371scCg11mnjkHbssnbBCEvAVkPVkaH9oO
// SIG // /KvFkwbZ+vHhPRFRSuTbDcPuCyFEgl9RhJgg9Jpcmwkj
// SIG // gpdqc+ZzzA5MSMHi6QpieZlYhCfzjYVxUwsWfwIWvATg
// SIG // IMMv8q19bT4uxytsmbjtX1foojHqWJkRC2M5nkko4azG
// SIG // B6jgj8ewCVGa2D6n/5oukhhQEm03rkR4lNapXPuhghO6
// SIG // MIITtgYKKwYBBAGCNwMDATGCE6YwghOiBgkqhkiG9w0B
// SIG // BwKgghOTMIITjwIBAzEPMA0GCWCGSAFlAwQCAQUAMIIB
// SIG // WAYLKoZIhvcNAQkQAQSgggFHBIIBQzCCAT8CAQEGCisG
// SIG // AQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQgIs4HCOfm
// SIG // 0F+Gos4GbPugNjPfhCqpYD7sERoAGLPn1dICBlxKAFeU
// SIG // wRgTMjAxOTAyMDYxOTUzMzMuNzgyWjAHAgEBgAIB9KCB
// SIG // 1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UE
// SIG // CxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJp
// SIG // Y28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkIxQjct
// SIG // RjY3Ri1GRUMyMSUwIwYDVQQDExxNaWNyb3NvZnQgVGlt
// SIG // ZS1TdGFtcCBTZXJ2aWNloIIPIjCCBPUwggPdoAMCAQIC
// SIG // EzMAAADSuONabcRbGncAAAAAANIwDQYJKoZIhvcNAQEL
// SIG // BQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMd
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcN
// SIG // MTgwODIzMjAyNjM0WhcNMTkxMTIzMjAyNjM0WjCBzjEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9z
// SIG // b2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28xJjAkBgNV
// SIG // BAsTHVRoYWxlcyBUU1MgRVNOOkIxQjctRjY3Ri1GRUMy
// SIG // MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBT
// SIG // ZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
// SIG // CgKCAQEAvqqUKB2JtJqhuuoEqM44x2sGz7/ZDCDO6485
// SIG // +Z0JMFC42zulbKxDf08QaoSkdFjSIZQZg2CmfM+eUbYx
// SIG // SYyIZrGc6S9bv8X106QzZiwJVkZqTM7h+KWFQ+gEkpxJ
// SIG // xO6A4bmjjcLdW2X7NuK7HaWyNMWTTDeMUh/0VQPXn6yy
// SIG // RZnRw5+Ed7YFB9ZpOkmPSzdpLhJOxabdLZVWFtfqVma2
// SIG // Oqh3ujxbHw+kJWkYDKApNAw2k2BUqpXbtTcNhiGGaGJ0
// SIG // Eu+KrOB8DfS1QM7P1tcyuDb0xrSm8Vp+UgBWdag0BlVx
// SIG // iqsZd3vKVrgjqzszCrByKw3TREqVdWcyvpKVujiXRQID
// SIG // AQABo4IBGzCCARcwHQYDVR0OBBYEFOysOHF1+pfJI/lS
// SIG // cmVJ4D2id+DOMB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8
// SIG // RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6
// SIG // Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1
// SIG // Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNybDBa
// SIG // BggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWlj
// SIG // VGltU3RhUENBXzIwMTAtMDctMDEuY3J0MAwGA1UdEwEB
// SIG // /wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZI
// SIG // hvcNAQELBQADggEBAEbPQylxHA69NndBer0VZ7CAAnIq
// SIG // JpIWmCi5+Wz5ZfgDI9CYP8ucH5lwlHktCege91Z5CLMf
// SIG // 2VbxKduJK2ycfWZU8hzjk2Hs+8ocuN2uR7crLge3lWJw
// SIG // oBm7Xy90vfFTjZ5Q6QwbgXqcvmckHINNOnnW/E5P9b9Z
// SIG // LXY9lmZzA2zqdkqtNP9OYbRBc2RnQovmSkX8JHv9O07w
// SIG // 9VD1yII6X/7a2ekenCPxTdey8tooByT1HOmhYdDh0XfN
// SIG // 5EpZcDupbql7G8VfqeYn8oUmx+1EBXBn9nmYL4s4hwmW
// SIG // WfhlMQAoRb4c9/KOX4FLnIiXd2qGdUW6S3lAuxaUo1RA
// SIG // pPl82fswggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0G
// SIG // CSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZp
// SIG // Y2F0ZSBBdXRob3JpdHkgMjAxMDAeFw0xMDA3MDEyMTM2
// SIG // NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOC
// SIG // AQ8AMIIBCgKCAQEAqR0NvHcRijog7PwTl/X6f2mUa3RU
// SIG // ENWlCgCChfvtfGhLLF/Fw+Vhwna3PmYrW/AVUycEMR9B
// SIG // GxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs
// SIG // 1nMwVyaCo0UN0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeR
// SIG // X4FUsc+TTJLBxKZd0WETbijGGvmGgLvfYfxGwScdJGcS
// SIG // chohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHRD5wGPmd/
// SIG // 9WbAA5ZEfu/QS/1u5ZrKsajyeioKMfDaTgaRtogINeh4
// SIG // HLDpmc085y9Euqf03GS9pAHBIAmTeM38vMDJRF1eFpwB
// SIG // BU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGCNxUBBAMC
// SIG // AQAwHQYDVR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1V
// SIG // MBkGCSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBBMAsGA1Ud
// SIG // DwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8GA1UdIwQY
// SIG // MBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRP
// SIG // ME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0NlckF1dF8y
// SIG // MDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYI
// SIG // KwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYt
// SIG // MjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQB
// SIG // gjcuAzCBgTA9BggrBgEFBQcCARYxaHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL1BLSS9kb2NzL0NQUy9kZWZhdWx0
// SIG // Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwA
// SIG // XwBQAG8AbABpAGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0
// SIG // AC4gHTANBgkqhkiG9w0BAQsFAAOCAgEAB+aIUQ3ixuCY
// SIG // P4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkws8LFZslq
// SIG // 3/Xn8Hi9x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2
// SIG // zEBAQZvcXBf/XPleFzWYJFZLdO9CEMivv3/Gf/I3fVo/
// SIG // HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO9sp6AG9LMEQk
// SIG // IjzP7QOllo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a
// SIG // 21dA6fHOmWaQjP9qYn/dxUoLkSbiOewZSnFjnXshbcOc
// SIG // o6I8+n99lmqQeKZt0uGc+R38ONiU9MalCpaGpL2eGq4E
// SIG // QoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooP
// SIG // iRa6YacRy5rYDkeagMXQzafQ732D8OE7cQnfXXSYIghh
// SIG // 2rBQHm+98eEA3+cxB6STOvdlR3jo+KhIq/fecn5ha293
// SIG // qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rI
// SIG // DVWZeodzOwjmmC3qjeAzLhIp9cAvVCch98isTtoouLGp
// SIG // 25ayp0Kiyc8ZQU3ghvkqmqMRZjDTu3QyS99je/WZii8b
// SIG // xyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/
// SIG // XU/pnR4ZOC+8z1gFLu8NoFA12u8JJxzVs341Hgi62jbb
// SIG // 01+P3nSISRKhggOwMIICmAIBATCB/qGB1KSB0TCBzjEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9z
// SIG // b2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28xJjAkBgNV
// SIG // BAsTHVRoYWxlcyBUU1MgRVNOOkIxQjctRjY3Ri1GRUMy
// SIG // MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBT
// SIG // ZXJ2aWNloiUKAQEwCQYFKw4DAhoFAAMVAHD4KH/VUjOZ
// SIG // RWk4Nw6/5TmY7vPCoIHeMIHbpIHYMIHVMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEnMCUGA1UECxMebkNp
// SIG // cGhlciBOVFMgRVNOOjRERTktMEM1RS0zRTA5MSswKQYD
// SIG // VQQDEyJNaWNyb3NvZnQgVGltZSBTb3VyY2UgTWFzdGVy
// SIG // IENsb2NrMA0GCSqGSIb3DQEBBQUAAgUA4AWQMTAiGA8y
// SIG // MDE5MDIwNzAwNTYxN1oYDzIwMTkwMjA4MDA1NjE3WjB3
// SIG // MD0GCisGAQQBhFkKBAExLzAtMAoCBQDgBZAxAgEAMAoC
// SIG // AQACAhN2AgH/MAcCAQACAhbdMAoCBQDgBuGxAgEAMDYG
// SIG // CisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwGgCjAI
// SIG // AgEAAgMW42ChCjAIAgEAAgMHoSAwDQYJKoZIhvcNAQEF
// SIG // BQADggEBAG/jV9vEF9Z/yrYjM5EV2s9aTrBfOSffN8r9
// SIG // GbS/F621T/MhFDxhv0QtrjZX1ryU/gwo04vM3dUWhUd1
// SIG // LFbbkZvDosVEtaIkZO8i22ymSJceI2SsPl6pOm2Dmo1O
// SIG // uZIw+8HbsDyBlF8ApVWOwpwXoH/dE3BJ0scdbNcYGqQM
// SIG // sYcvl0Wwmh4Ip8Dx1m+BIPSF0LUX6LN8TSwY3PvepDTe
// SIG // WoD8rJcFqpNfxno9lnU66DPh3Xca2zGmyOU+2sK/TMc2
// SIG // 7JQ6jCW0AOFj1Ik3B1oK+fXW1wYrOMOhu6j+X8aFIOpV
// SIG // wiI/79eB2RWnl6e4bvtH3cL9DbnlzghKIVIdwpTMZGcx
// SIG // ggL1MIIC8QIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
// SIG // Q0EgMjAxMAITMwAAANK441ptxFsadwAAAAAA0jANBglg
// SIG // hkgBZQMEAgEFAKCCATIwGgYJKoZIhvcNAQkDMQ0GCyqG
// SIG // SIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCD7x3FpbgU9
// SIG // obsnQljuYMU/azMZ2kYY/AyZ66IDFD8C0zCB4gYLKoZI
// SIG // hvcNAQkQAgwxgdIwgc8wgcwwgbEEFHD4KH/VUjOZRWk4
// SIG // Nw6/5TmY7vPCMIGYMIGApH4wfDELMAkGA1UEBhMCVVMx
// SIG // EzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1Jl
// SIG // ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
// SIG // dGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3Rh
// SIG // bXAgUENBIDIwMTACEzMAAADSuONabcRbGncAAAAAANIw
// SIG // FgQUzT7LQq+P3pXXib22moikSPzOdoMwDQYJKoZIhvcN
// SIG // AQELBQAEggEAZ9cy8isj1hRh2HphU5vzJh3PzUpGdfcS
// SIG // /nkJgZBeftsXghFlkjCKhJuET+L1zXYb3HcvQYCHSygk
// SIG // 4OoQb8DjBcrE5zN8ncKLPmOriTzleVe5K37sNcWiyfij
// SIG // DydO2ntDnCgL4hneez9yYSEGtOuI7JqnSRxJ0Cf045nj
// SIG // +UvwHegPhYx1/wzRqM4XrlorpJsEohs+VmjU7N1jIJyh
// SIG // Q6tohWYqFf8OTTuqNA3qNJHq4sCnxBHuf/1FFRfU9IFN
// SIG // R+lQKZayPYlv1bvUPkiA0yk+C+JHGCgaf6dzEW96BUIb
// SIG // JQa/312C+91gGGlFmY4oVbLLwQZzKPkkHUVX4XE7BDxcEQ==
// SIG // End signature block
