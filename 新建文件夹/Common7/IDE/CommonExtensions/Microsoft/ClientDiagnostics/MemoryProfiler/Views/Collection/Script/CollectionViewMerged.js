var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//
// Copyright (C) Microsoft. All rights reserved.
//
//--------
// External CommonMerged references.  These are included explicitly in the csproj
// as the CommonMerged.d.ts is generated at build-time.
// If we reference them here, TSC 1.8.10 includes the source in the merged JS file
// which is not what we want.
//--------
// <reference path="../../Common/Controls/templateControl.ts" />
// <reference path="../../Common/Util/formattingHelpers.ts" />
// <reference path="../../Common/controls/componentModel.ts" />
// <reference path="../../Common/Profiler/Snapshot.ts" />
//--------
/// <reference path="../../../../../common/script/Hub/plugin.redirect.d.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    var Collection;
    (function (Collection) {
        "use strict";
        var SnapshotTileViewModel = (function () {
            function SnapshotTileViewModel(summary) {
                this._summary = summary;
            }
            Object.defineProperty(SnapshotTileViewModel.prototype, "summaryData", {
                get: function () {
                    return this._summary;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SnapshotTileViewModel.prototype, "timeTaken", {
                get: function () {
                    var date = new Date(this._summary.timestamp);
                    return "(" + date.toLocaleTimeString() + ")";
                },
                enumerable: true,
                configurable: true
            });
            return SnapshotTileViewModel;
        }());
        Collection.SnapshotTileViewModel = SnapshotTileViewModel;
        var SnapshotTileView = (function (_super) {
            __extends(SnapshotTileView, _super);
            function SnapshotTileView(model) {
                _super.call(this, "SnapshotTileTemplate");
                this._model = model;
                this._snapshotTile = this.findElement("snapshotTile");
                this._tileHeader = this.findElement("snapshotTileHeader");
                this._screenshotNotAvailableMessage = this.findElement("screenshotNotAvailableMessage");
                this.findElement("snapshotTileTitle").innerText = Microsoft.Plugin.Resources.getString("SnapshotNumber", this._model.summaryData.id);
                if (this._model.summaryData.screenshotFile) {
                    var imgHolder = this.findElement("snapshotTileImage");
                    imgHolder.src = this._model.summaryData.screenshotFile;
                    this._screenshotNotAvailableMessage.style.display = "none";
                }
                this.findElement("snapshotTakenDate").innerText = this._model.timeTaken;
                this.findElement("stopToSeeSnapshotDetails").innerText = Microsoft.Plugin.Resources.getString("StopToSeeSnapshotMessage");
                this._screenshotNotAvailableMessage.innerText = Microsoft.Plugin.Resources.getString("ScreenshotNotAvailable");
            }
            return SnapshotTileView;
        }(MemoryProfiler.Common.Controls.TemplateControl));
        Collection.SnapshotTileView = SnapshotTileView;
    })(Collection = MemoryProfiler.Collection || (MemoryProfiler.Collection = {}));
})(MemoryProfiler || (MemoryProfiler = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
//--------
// External CommonMerged references.  These are included explicitly in the csproj
// as the CommonMerged.d.ts is generated at build-time.
// If we reference them here, TSC 1.8.10 includes the source in the merged JS file
// which is not what we want.
//--------
// <reference path="../../../../../common/script/util/notifications.ts" />
// <reference path="../../common/controls/componentModel.ts" />
// <reference path="../../common/controls/templateControl.ts" />
// <reference path="../../common/util/EnumHelper.ts" />
// <reference path="../../common/Profiler/MemoryNotifications.ts" />
// <reference path="../../common/util/errorFormatter.ts" />
// <reference path="../../common/Profiler/MemoryProfilerViewHost.ts" />
// <reference path="../../common/Profiler/SnapshotEngine.ts" />
// <reference path="../../common/Profiler/ClrSnapshotAgent.ts" />
// <reference path="../../common/Profiler/ScreenshotSnapshotAgent.ts" />
// <reference path="../../common/Profiler/FeedbackConstants.ts" />
//--------
/// <reference path="../../../../../common/script/Hub/Plugin.redirect.d.ts" />
/// <reference path="../../../../../common/script/Hub/DiagnosticsHub.redirect.d.ts" />
/// <reference path="CollectionAgentTask.ts" />
/// <reference path="snapshotTileView.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    var Collection;
    (function (Collection) {
        "use strict";
        var CollectionViewController = (function () {
            function CollectionViewController(initializeView) {
                var _this = this;
                if (initializeView === void 0) { initializeView = true; }
                this._screenshotHeight = 150;
                this._screenshotKeepAspectRatio = true;
                this._screenshotWidth = 200;
                this._agentGuid = "2E8E6F4B-6107-4F46-8BEA-A920EA880452"; // This is the guid of MemoryProfilerCollectionAgent
                this._activeCollectionAgentTasks = [];
                this.model = new CollectionViewModel();
                if (initializeView) {
                    this.view = new CollectionView(this, this.model);
                }
                this._takeSnapshotTask = new Collection.TakeSnapshotTask(this);
                this._forceGcTask = new Collection.ForceGcCollectionAgentTask(this);
                MemoryProfiler.Common.MemoryProfilerViewHost.session.getSessionInfo().then(function (info) {
                    _this._agentGuid = info.agentGuid;
                    _this._standardCollector = Microsoft.VisualStudio.DiagnosticsHub.Collectors.getStandardTransportService();
                    if (_this._standardCollector) {
                        _this._standardCollector.addMessageListener(new Microsoft.VisualStudio.DiagnosticsHub.Guid(_this._agentGuid), _this.onMessageReceived.bind(_this));
                    }
                });
            }
            Object.defineProperty(CollectionViewController.prototype, "isCollectionAgentTaskActive", {
                get: function () {
                    return this._activeCollectionAgentTasks.length > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewController.prototype, "managedDataSeen", {
                get: function () {
                    return this._managedDataSeen;
                },
                set: function (v) {
                    this._managedDataSeen = v;
                },
                enumerable: true,
                configurable: true
            });
            CollectionViewController.prototype.takeSnapshot = function () {
                this._activeCollectionAgentTasks.push(this._takeSnapshotTask);
                return this._takeSnapshotTask.start();
            };
            CollectionViewController.prototype.forceGarbageCollection = function () {
                this._activeCollectionAgentTasks.push(this._forceGcTask);
                return this._forceGcTask.start();
            };
            CollectionViewController.prototype.setScreenshotSize = function (targetWidth, targetHeight, keepAspectRatio) {
                // Set the size of all future screenshots that are taken of the application
                this._screenshotWidth = targetWidth;
                this._screenshotHeight = targetHeight;
                this._screenshotKeepAspectRatio = keepAspectRatio;
            };
            CollectionViewController.prototype.reset = function () {
                CollectionViewController._nextIdentifier = 1;
                this.model.snapshotSummaryCollection.clear();
                MemoryProfiler.Common.MemoryProfilerViewHost.onIdle();
            };
            CollectionViewController.prototype.sendStringToCollectionAgent = function (request) {
                return this._standardCollector.sendStringToCollectionAgent(this._agentGuid, request);
            };
            CollectionViewController.prototype.downloadFile = function (targetFilePath, localFilePath) {
                var transportService = Microsoft.VisualStudio.DiagnosticsHub.Collectors.getStandardTransportService();
                return transportService.downloadFile(targetFilePath, localFilePath);
            };
            CollectionViewController.prototype.getSnapshotSummary = function (snapshotId) {
                var foundSnapshotSummary = null;
                for (var i = 0; i < this.model.snapshotSummaryCollection.length; i++) {
                    var snapshotSummary = this.model.snapshotSummaryCollection.getItem(i);
                    if (snapshotSummary.id === snapshotId) {
                        foundSnapshotSummary = snapshotSummary;
                        break;
                    }
                }
                return foundSnapshotSummary;
            };
            CollectionViewController.prototype.onMessageReceived = function (message) {
                if (message) {
                    var obj = JSON.parse(message);
                    if (obj) {
                        if (obj.eventName) {
                            switch (obj.eventName) {
                                case "notifyManagedPresent":
                                    this.managedDataSeen = true;
                                    MemoryProfiler.Common.MemoryProfilerViewHost.session.getSessionInfo().then(function (info) {
                                        if (info.targetRuntime === MemoryProfiler.Common.Extensions.TargetRuntime.managed || info.targetRuntime === MemoryProfiler.Common.Extensions.TargetRuntime.mixed) {
                                            Collection.CollectionViewHost.CommandChain.onTargetIsManaged();
                                        }
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }
                        else if (obj.cmd) {
                            switch (obj.cmd) {
                                case "log":
                                    MemoryProfiler.Common.MemoryProfilerViewHost.logMessage(obj.msg);
                                    break;
                                default:
                                    MemoryProfiler.Common.MemoryProfilerViewHost.logMessage("Unexpected Command from agent: " + message);
                                    break;
                            }
                            return; // Commands are not passed on to active tasks - eventName messages (and everything else) are.
                        }
                    }
                }
                for (var i = this._activeCollectionAgentTasks.length - 1; i >= 0; i--) {
                    if (this._activeCollectionAgentTasks[i].isCompleted(message)) {
                        this._activeCollectionAgentTasks.splice(i, 1);
                    }
                }
            };
            CollectionViewController.prototype.sendMessage = function (message) {
                this._standardCollector.sendStringToCollectionAgent(this._agentGuid, message).done(function (response) {
                    if (response && response.length > 0) {
                        var obj = JSON.parse(response);
                        if (!obj.succeeded) {
                            throw new Error(obj.errorMessage);
                        }
                    }
                });
            };
            CollectionViewController._snapshotChunkSize = 32768;
            CollectionViewController._nextIdentifier = 1;
            return CollectionViewController;
        }());
        Collection.CollectionViewController = CollectionViewController;
        var CollectionViewModel = (function (_super) {
            __extends(CollectionViewModel, _super);
            function CollectionViewModel() {
                _super.call(this);
                this._warningMessage = "";
                this._latestSnapshotError = null;
                this._isTakingSnapshot = false;
                this._isForcingGarbageCollection = false;
                this._snapshotSummaryCollection = new MemoryProfiler.Common.Controls.ObservableCollection();
            }
            Object.defineProperty(CollectionViewModel.prototype, "snapshotSummaryCollection", {
                get: function () { return this._snapshotSummaryCollection; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewModel.prototype, "warningMessage", {
                get: function () { return this._warningMessage; },
                set: function (v) {
                    if (this._warningMessage !== v) {
                        this._warningMessage = v;
                        this.raisePropertyChanged("warningMessage");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewModel.prototype, "latestSnapshotError", {
                get: function () { return this._latestSnapshotError; },
                set: function (v) {
                    if (this._latestSnapshotError !== v) {
                        this._latestSnapshotError = v;
                        this.raisePropertyChanged("latestSnapshotError");
                        // Create the WER
                        MemoryProfiler.Common.MemoryProfilerViewHost.reportError(v, "SnapshotCapturingFailure");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewModel.prototype, "isTakingSnapshot", {
                get: function () { return this._isTakingSnapshot; },
                set: function (v) {
                    if (this._isTakingSnapshot !== v) {
                        this._isTakingSnapshot = v;
                        this.raisePropertyChanged("isTakingSnapshot");
                        this.raisePropertyChanged("isViewBusy");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewModel.prototype, "isForcingGarbageCollection", {
                get: function () { return this._isForcingGarbageCollection; },
                set: function (v) {
                    if (this._isForcingGarbageCollection !== v) {
                        this._isForcingGarbageCollection = v;
                        this.raisePropertyChanged("isForcingGarbageCollection");
                        this.raisePropertyChanged("isViewBusy");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewModel.prototype, "isViewBusy", {
                get: function () { return this._isForcingGarbageCollection || this._isTakingSnapshot; },
                enumerable: true,
                configurable: true
            });
            return CollectionViewModel;
        }(MemoryProfiler.Common.Controls.ObservableViewModel));
        Collection.CollectionViewModel = CollectionViewModel;
        var CollectionView = (function (_super) {
            __extends(CollectionView, _super);
            function CollectionView(controller, model) {
                _super.call(this, "CollectionViewTemplate");
                this._screenshotWidth = 280;
                this._screenshotHeight = 160;
                this._screenshotKeepAspectRatio = true;
                this._controller = controller;
                this._model = model;
                this.rootElement.classList.add("collectionViewRoot");
                this._model.registerPropertyChanged(this);
                this._model.snapshotSummaryCollection.registerCollectionChanged(this);
                this._snapshotTileViewModelCollection = [];
                this._tilesContainer = this.findElement("tilesContainer");
                this._warningSection = this.findElement("warningSection");
                this._onSnapshotClickHandler = this.onSnapshotClick.bind(this);
                this._takeSnapshotTile = this.findElement("takeSnapshotTile");
                this._snapshotError = this.findElement("snapshotError");
                this._snapshotErrorMsg = this.findElement("snapshotErrorMsg");
                this._snapshotProgress = this.findElement("takeSnapshotProgress");
                this._snapshotButton = this.findElement("takeSnapshotButton");
                this._snapshotLabel = this.findElement("takeSnapshotLabel");
                this._snapshotIcon = this.findElement("takeSnapshotIcon");
                this._snapshotLabel.innerText = Microsoft.Plugin.Resources.getString("TakeSnapshot");
                this._snapshotProgress.innerText = Microsoft.Plugin.Resources.getString("Loading");
                this.toggleProgress(this._model.isViewBusy);
                this.updateTakeSnapshotButton();
                this._snapshotButton.addEventListener("click", this._onSnapshotClickHandler);
                this._controller.setScreenshotSize(this._screenshotWidth, this._screenshotHeight, this._screenshotKeepAspectRatio);
                Microsoft.Plugin.Theme.processInjectedSvg(this.rootElement);
            }
            Object.defineProperty(CollectionView.prototype, "snapshotTileViewModelCollection", {
                get: function () {
                    return this._snapshotTileViewModelCollection;
                },
                enumerable: true,
                configurable: true
            });
            CollectionView.prototype.onPropertyChanged = function (propertyName) {
                switch (propertyName) {
                    case "warningMessage":
                        this.showWarningMessage(this._model.warningMessage);
                        break;
                    case "latestSnapshotError":
                        this.showSnapshotError(this._model.latestSnapshotError);
                        break;
                    case "isTakingSnapshot":
                        this.toggleProgress(this._model.isViewBusy);
                        this.updateTakeSnapshotButton();
                        break;
                    case "isForcingGarbageCollection":
                        this.updateTakeSnapshotButton();
                        break;
                }
            };
            CollectionView.prototype.onCollectionChanged = function (eventArgs) {
                switch (eventArgs.action) {
                    case MemoryProfiler.Common.Controls.NotifyCollectionChangedAction.Add:
                        this.createTile(eventArgs.newItems[0]);
                        break;
                    case MemoryProfiler.Common.Controls.NotifyCollectionChangedAction.Reset:
                        this.removeSnapshotTiles();
                        break;
                }
            };
            CollectionView.prototype.createTile = function (snapshotSummary) {
                // Create the model and the view
                var model = new Collection.SnapshotTileViewModel(snapshotSummary);
                var newTile = new Collection.SnapshotTileView(model);
                this._snapshotTileViewModelCollection.push(model);
                this._tilesContainer.insertBefore(newTile.rootElement, this._takeSnapshotTile);
                newTile.rootElement.focus();
            };
            CollectionView.prototype.removeSnapshotTiles = function () {
                while (this._tilesContainer.hasChildNodes()) {
                    this._tilesContainer.removeChild(this._tilesContainer.firstChild);
                }
                this._tilesContainer.appendChild(this._takeSnapshotTile);
                this._snapshotTileViewModelCollection = [];
            };
            CollectionView.prototype.toggleProgress = function (show) {
                if (this._snapshotProgress && this._snapshotError) {
                    if (show) {
                        this._snapshotLabel.style.display = "none";
                        this._snapshotIcon.style.display = "none";
                        this._snapshotProgress.style.display = "block";
                        this._snapshotError.style.display = "none";
                        this._snapshotButton.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("Loading"));
                    }
                    else {
                        this._snapshotLabel.style.display = "";
                        this._snapshotIcon.style.display = "";
                        this._snapshotProgress.style.display = "none";
                        this._snapshotButton.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("TakeSnapshot"));
                    }
                }
            };
            CollectionView.prototype.showSnapshotError = function (error) {
                if (this._snapshotErrorMsg && this._snapshotError) {
                    if (error) {
                        // Show the message
                        this._snapshotErrorMsg.innerText = MemoryProfiler.Common.ErrorFormatter.format(error);
                        this._snapshotError.style.display = "block";
                    }
                    else {
                        // Hide the message
                        this._snapshotErrorMsg.innerText = "";
                        this._snapshotError.style.display = "none";
                    }
                }
            };
            CollectionView.prototype.showWarningMessage = function (warning) {
                if (!this._warningSection) {
                    return;
                }
                if (warning) {
                    this._warningSection.innerHTML = warning;
                    this._warningSection.style.display = "inline";
                }
                else {
                    this._warningSection.innerHTML = "";
                    this._warningSection.style.display = "none";
                }
            };
            CollectionView.prototype.onSnapshotClick = function (e) {
                this._controller.takeSnapshot();
            };
            CollectionView.prototype.updateTakeSnapshotButton = function () {
                if (this._snapshotButton) {
                    if (!this._model.isViewBusy) {
                        this._snapshotButton.classList.remove("disabled");
                        this._snapshotButton.disabled = false;
                    }
                    else {
                        if (this._model.isForcingGarbageCollection)
                            this._snapshotButton.classList.add("disabled");
                        this._snapshotButton.disabled = true;
                    }
                }
            };
            return CollectionView;
        }(MemoryProfiler.Common.Controls.TemplateControl));
        Collection.CollectionView = CollectionView;
    })(Collection = MemoryProfiler.Collection || (MemoryProfiler.Collection = {}));
})(MemoryProfiler || (MemoryProfiler = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
//--------
// External CommonMerged references.  These are included explicitly in the csproj
// as the CommonMerged.d.ts is generated at build-time.
// If we reference them here, TSC 1.8.10 includes the source in the merged JS file
// which is not what we want.
//--------
// <reference path="../../common/controls/componentModel.ts" />
// <reference path="../../common/controls/templateControl.ts" />
//--------
/// <reference path="CollectionView.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    var Collection;
    (function (Collection) {
        "use strict";
        var TakeSnapshotTask = (function () {
            function TakeSnapshotTask(controller) {
                this._snapshotAgents = [];
                this._controller = controller;
                this._snapshotAgents.push(new MemoryProfiler.Common.ClrSnapshotAgent());
                this._snapshotAgents.push(new MemoryProfiler.Common.ScreenshotSnapshotAgent());
                this._snapshotAgents.push(new MemoryProfiler.Common.NativeSnapshotAgent());
            }
            TakeSnapshotTask.prototype.start = function () {
                var _this = this;
                return new Microsoft.Plugin.Promise(function (completed, error) {
                    if (!_this.takeSnapshotInternal()) {
                        if (error) {
                            error(new Error("Snapshot Not Currently Enabled"));
                        }
                    }
                    else {
                        _this._snapshotCompleted = completed;
                        _this._snapshotError = error;
                    }
                });
            };
            TakeSnapshotTask.prototype.isCompleted = function (message) {
                if (message) {
                    var obj = JSON.parse(message);
                    if (obj.eventName) {
                        if (obj.eventName === "snapshotData") {
                            if (this._controller.model.isViewBusy) {
                                var snapshotData = obj;
                                if (this._activeSnapshot && snapshotData.id == this._activeSnapshot.id) {
                                    this._activeSnapshot.processAgentData(snapshotData.data.agent, snapshotData.data.data);
                                }
                            }
                        }
                    }
                    else {
                        if (this._controller.model.isViewBusy) {
                            if (obj.snapshotResults) {
                                this.onSnapshotResult(obj);
                            }
                            else {
                                var response = obj;
                                this.onSnapshotFailed(new Error(response.errorMessage));
                            }
                            return true;
                        }
                    }
                }
                return false;
            };
            TakeSnapshotTask.prototype.takeSnapshotInternal = function () {
                if (this._controller.model.isViewBusy) {
                    return false;
                }
                MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.TakeSnapshot, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.CollectionView);
                MemoryProfiler.Common.MemoryProfilerViewHost.startCodeMarker(MemoryProfiler.Common.CodeMarkerValues.perfMP_TakeSnapshotStart, MemoryProfiler.Common.CodeMarkerValues.perfMP_TakeSnapshotEnd);
                this._controller.model.isTakingSnapshot = true;
                this._activeSnapshot = new MemoryProfiler.Common.SnapshotEngine(Collection.CollectionViewController._nextIdentifier, this._snapshotAgents, this._controller);
                var message = "{ \"commandName\": \"takeSnapshot\", \"snapshotId\": \"" + Collection.CollectionViewController._nextIdentifier + "\", \"agentMask\": \"65535\" }";
                this._controller.sendMessage(message);
                return true;
            };
            TakeSnapshotTask.prototype.onSnapshotResult = function (snapshotResult) {
                var _this = this;
                if (!snapshotResult) {
                    throw new Error("<move to resources>: snapshotAsync ended with no response");
                }
                if (!this._activeSnapshot) {
                    this._controller.model.isTakingSnapshot = false;
                }
                else {
                    this._activeSnapshot.processSnapshotResults(snapshotResult.snapshotResults, function (snapshot) {
                        MemoryProfiler.Common.MemoryProfilerViewHost.session.addSnapshot(snapshot).then(function () {
                            _this.onSnapshotCompleted(_this._activeSnapshot.snapshot);
                        });
                    }, this.onSnapshotFailed);
                }
            };
            TakeSnapshotTask.prototype.onSnapshotCompleted = function (snapshot) {
                if (this._snapshotCompleted) {
                    this._snapshotCompleted(Microsoft.Plugin.Promise.wrap(snapshot));
                }
                this._snapshotCompleted = null;
                this._snapshotError = null;
                if (!snapshot) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("MemProf.1014"));
                }
                Collection.CollectionViewController._nextIdentifier++;
                this._controller.model.snapshotSummaryCollection.add(snapshot);
                this._controller.model.isTakingSnapshot = false;
                this._activeSnapshot = null;
                MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(MemoryProfiler.Common.CodeMarkerValues.perfMP_TakeSnapshotStart);
            };
            TakeSnapshotTask.prototype.onSnapshotFailed = function (error) {
                if (!error) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("MemProf.1015"));
                }
                error.message = Microsoft.Plugin.Resources.getString("SnapshotCreationFailed", error.message);
                this._controller.model.latestSnapshotError = error;
                this._controller.model.isTakingSnapshot = false;
                this._activeSnapshot = null;
                if (this._snapshotError) {
                    this._snapshotError(error);
                }
                this._snapshotCompleted = null;
                this._snapshotError = null;
                MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(MemoryProfiler.Common.CodeMarkerValues.perfMP_TakeSnapshotStart);
                MemoryProfiler.Common.MemoryProfilerViewHost.onIdle();
            };
            return TakeSnapshotTask;
        }());
        Collection.TakeSnapshotTask = TakeSnapshotTask;
        var ForceGcCollectionAgentTask = (function () {
            function ForceGcCollectionAgentTask(controller) {
                this._controller = controller;
            }
            ForceGcCollectionAgentTask.prototype.start = function () {
                var _this = this;
                MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.ForceGarbageCollection, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.CollectionView);
                MemoryProfiler.Common.MemoryProfilerViewHost.startCodeMarker(MemoryProfiler.Common.CodeMarkerValues.prefMP_ForceGarbageCollectionStart, MemoryProfiler.Common.CodeMarkerValues.prefMP_ForceGarbageCollectionEnd);
                return new Microsoft.Plugin.Promise(function (completed) {
                    _this._controller.model.isForcingGarbageCollection = true;
                    var message = "{ \"commandName\": \"forceGarbageCollection\"}";
                    _this._controller.sendMessage(message);
                    _this._forceGcCompleted = completed;
                });
            };
            ForceGcCollectionAgentTask.prototype.isCompleted = function (message) {
                var result = false;
                if (message) {
                    var obj = JSON.parse(message);
                    if (obj.eventName && obj.eventName === "forcedGarbageCollectionComplete") {
                        this._controller.model.isForcingGarbageCollection = false;
                        MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(MemoryProfiler.Common.CodeMarkerValues.prefMP_ForceGarbageCollectionStart);
                        result = true;
                    }
                }
                if (this._forceGcCompleted) {
                    this._forceGcCompleted();
                }
                this._forceGcCompleted = null;
                return result;
            };
            return ForceGcCollectionAgentTask;
        }());
        Collection.ForceGcCollectionAgentTask = ForceGcCollectionAgentTask;
    })(Collection = MemoryProfiler.Collection || (MemoryProfiler.Collection = {}));
})(MemoryProfiler || (MemoryProfiler = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
//--------
// External CommonMerged references.  These are included explicitly in the csproj
// as the CommonMerged.d.ts is generated at build-time.
// If we reference them here, TSC 1.8.10 includes the source in the merged JS file
// which is not what we want.
//--------
// <reference path="../../Common/controls/componentModel.ts" />
//--------
/// <reference path="../../../../../Common/Script/Hub/plugin.redirect.d.ts" />
/// <reference path="CollectionViewHost.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    var Collection;
    (function (Collection) {
        "use strict";
        var CommandBase = (function (_super) {
            __extends(CommandBase, _super);
            function CommandBase(host, commandBinding) {
                _super.call(this, commandBinding);
                this._host = host;
            }
            CommandBase.prototype.setNext = function (nextCommand) {
                this._nextCommand = nextCommand;
            };
            CommandBase.prototype.onCollectionFinishing = function () {
                this.setEnabled(false);
                if (this._nextCommand) {
                    this._nextCommand.onCollectionFinishing();
                }
            };
            CommandBase.prototype.onTargetIsManaged = function () {
                if (this._nextCommand) {
                    this._nextCommand.onTargetIsManaged();
                }
            };
            CommandBase.prototype.onPropertyChanged = function (propertyName) {
                if (propertyName === "isViewBusy") {
                    this.setEnabled(this.shouldEnable());
                }
                if (this._nextCommand) {
                    this._nextCommand.onPropertyChanged(propertyName);
                }
            };
            CommandBase.prototype.onClose = function () {
                this.setEnabled(false);
                if (this._nextCommand) {
                    this._nextCommand.onClose();
                }
            };
            CommandBase.prototype.shouldEnable = function () {
                return !this._host.collectionViewController.model.isViewBusy;
            };
            return CommandBase;
        }(Microsoft.VisualStudio.DiagnosticsHub.ToolbarButton));
        Collection.CommandBase = CommandBase;
        var TakeSnapshotCommand = (function (_super) {
            __extends(TakeSnapshotCommand, _super);
            function TakeSnapshotCommand(host) {
                _super.call(this, host, {
                    callback: function () { return host.collectionViewController.takeSnapshot(); },
                    label: Microsoft.Plugin.Resources.getString("TakeSnapshot"),
                    iconEnabled: "image-snapshot",
                    iconDisabled: "image-snapshot-disabled",
                    disabled: function () { return host.collectionViewController.model.isViewBusy; },
                    displayOnToolbar: true
                });
            }
            return TakeSnapshotCommand;
        }(CommandBase));
        Collection.TakeSnapshotCommand = TakeSnapshotCommand;
        var ForceGcCommand = (function (_super) {
            __extends(ForceGcCommand, _super);
            function ForceGcCommand(host) {
                _super.call(this, host, {
                    callback: function () { return host.collectionViewController.forceGarbageCollection(); },
                    label: Microsoft.Plugin.Resources.getString("ForceGc"),
                    iconEnabled: "image-forceGc",
                    iconDisabled: "image-forceGc-disabled",
                    displayOnToolbar: true
                });
                this.isManaged = false;
                this.setEnabled(false);
                this.container.hidden = true;
            }
            ForceGcCommand.prototype.onTargetIsManaged = function () {
                this.isManaged = true;
                this.setEnabled(this.shouldEnable());
                _super.prototype.onTargetIsManaged.call(this);
            };
            ForceGcCommand.prototype.shouldEnable = function () {
                return this.isManaged && _super.prototype.shouldEnable.call(this);
            };
            return ForceGcCommand;
        }(CommandBase));
        Collection.ForceGcCommand = ForceGcCommand;
    })(Collection = MemoryProfiler.Collection || (MemoryProfiler.Collection = {}));
})(MemoryProfiler || (MemoryProfiler = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
//--------
// External CommonMerged references.  These are included explicitly in the csproj
// as the CommonMerged.d.ts is generated at build-time.
// If we reference them here, TSC 1.8.10 includes the source in the merged JS file
// which is not what we want.
//--------
// <reference path="../../Common/Extensions/Session.ts" />
// <reference path="../../Common/controls/control.ts" />
// <reference path="../../Common/controls/componentModel.ts" />
// <reference path="../../Common/Profiler/MemoryProfilerViewHost.ts" />
//--------
/// <reference path="../../../../../common/script/Hub/Plugin.redirect.d.ts" />
/// <reference path="../../../../../common/script/Hub/DiagnosticsHub.redirect.d.ts" />
/// <reference path="CollectionView.ts" />
/// <reference path="VsPluginCommandHelper.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    var Collection;
    (function (Collection) {
        "use strict";
        var CollectionViewHost = (function (_super) {
            __extends(CollectionViewHost, _super);
            function CollectionViewHost() {
                _super.call(this);
            }
            CollectionViewHost.prototype.sessionStateChanged = function (eventArgs) {
                var currentState = eventArgs.currentState;
                switch (currentState) {
                    case 400 /* CollectionFinishing */:
                        CollectionViewHost.CommandChain.onCollectionFinishing();
                        break;
                    case 500 /* CollectionFinished */:
                        Microsoft.VisualStudio.DiagnosticsHub.getCurrentSession().removeStateChangedEventListener(this.sessionStateChanged);
                        // Have session persist our session metadata now
                        var eventCompleteDeferral = eventArgs.getDeferral();
                        var onSaveCompleted = function (success) {
                            eventCompleteDeferral.complete();
                        };
                        this.session.save(this.collectionViewController.managedDataSeen === true).done(onSaveCompleted);
                        break;
                }
            };
            CollectionViewHost.prototype.onPropertyChanged = function (propertyName) {
                CollectionViewHost.CommandChain.onPropertyChanged(propertyName);
            };
            CollectionViewHost.prototype.initializeView = function (sessionInfo) {
                this.collectionViewController = new Collection.CollectionViewController();
                document.getElementById('mainContainer').appendChild(this.collectionViewController.view.rootElement);
                this.collectionViewController.model.registerPropertyChanged(this);
                Microsoft.VisualStudio.DiagnosticsHub.getCurrentSession().addStateChangedEventListener(this.sessionStateChanged.bind(this));
                Microsoft.Plugin.addEventListener("close", function () {
                    CollectionViewHost.CommandChain.onClose();
                });
                this.initCommands();
            };
            CollectionViewHost.prototype.initCommands = function () {
                if (Microsoft.Plugin.VS && Microsoft.Plugin.VS.Commands) {
                    var takeSnapshotCommand = new Collection.TakeSnapshotCommand(this);
                    var forceGcCommand = new Collection.ForceGcCommand(this);
                    takeSnapshotCommand.setNext(forceGcCommand);
                    CollectionViewHost.CommandChain = takeSnapshotCommand;
                    var toolbarSection = document.getElementsByClassName('toolbarSection')[0];
                    var toolbar = new Microsoft.VisualStudio.DiagnosticsHub.Toolbar();
                    toolbar.addToolbarItem(takeSnapshotCommand);
                    toolbar.addToolbarItem(forceGcCommand);
                    toolbarSection.appendChild(toolbar.container);
                }
            };
            return CollectionViewHost;
        }(MemoryProfiler.Common.MemoryProfilerViewHostBase));
        Collection.CollectionViewHost = CollectionViewHost;
        Collection.CollectionViewHostInstance = new CollectionViewHost();
    })(Collection = MemoryProfiler.Collection || (MemoryProfiler.Collection = {}));
})(MemoryProfiler || (MemoryProfiler = {}));
MemoryProfiler.Collection.CollectionViewHostInstance.loadView();
//# sourceMappingURL=CollectionViewMerged.js.map
// SIG // Begin signature block
// SIG // MIIkWQYJKoZIhvcNAQcCoIIkSjCCJEYCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // r1JqyCsZvF1S1NAQ3FeDFIhiaGOaUNnrZh1//wLqu4yg
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
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFjAw
// SIG // ghYsAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAEDXiUcmR+jHrgAAAAAAQMwDQYJYIZI
// SIG // AWUDBAIBBQCgga4wGQYJKoZIhvcNAQkDMQwGCisGAQQB
// SIG // gjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcC
// SIG // ARUwLwYJKoZIhvcNAQkEMSIEIFs3b0DHYhLgEgL1Vu9A
// SIG // YgUYIXaXw6WGr7/gJhhpNpiCMEIGCisGAQQBgjcCAQwx
// SIG // NDAyoBSAEgBNAGkAYwByAG8AcwBvAGYAdKEagBhodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEB
// SIG // BQAEggEAkMhsEm8QqgueEUV9CpOZWUsdWRcSRrNBr4nA
// SIG // OzEGOtL1ceQSAiKkAIw4zC0r4IYToZnGiY/nKEg4wBEq
// SIG // 4g+B5BGUq8mRdlnyO93kcn/J/pkv64UCxZxYVKUDTk5H
// SIG // QkmiGs9UhaKCZMUmdU3t9P7Kp8xwrhqWKeUwqZxqEjzQ
// SIG // tUZ1yV2DJP1dFpRYtRdQQ0yyP2GtpqQ4g0nCgt1iEJA7
// SIG // /Yn34Keb3IP7PbneTMoDksyGdmPfDSUMZ4pS1LpYaarE
// SIG // BlfQfZ97a0UR1Ki28SPJaiH7EhCR85c4WNtPPTctJ5hS
// SIG // xXN2Rrgmuba4/lFvLGsBT21hHDgwD8PDRrIEkgaNBqGC
// SIG // E7owghO2BgorBgEEAYI3AwMBMYITpjCCE6IGCSqGSIb3
// SIG // DQEHAqCCE5MwghOPAgEDMQ8wDQYJYIZIAWUDBAIBBQAw
// SIG // ggFYBgsqhkiG9w0BCRABBKCCAUcEggFDMIIBPwIBAQYK
// SIG // KwYBBAGEWQoDATAxMA0GCWCGSAFlAwQCAQUABCAC+9Rx
// SIG // F4zU/n9hy/wbgSkxad5O2BOxexQR8HiwTMgMigIGW4ht
// SIG // zzWCGBMyMDE4MDkwODAzMjc0Mi4zMzVaMAcCAQGAAgH0
// SIG // oIHUpIHRMIHOMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYD
// SIG // VQQLEyBNaWNyb3NvZnQgT3BlcmF0aW9ucyBQdWVydG8g
// SIG // UmljbzEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046QkJF
// SIG // Qy0zMENBLTJEQkUxJTAjBgNVBAMTHE1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFNlcnZpY2Wggg8iMIIE9TCCA92gAwIB
// SIG // AgITMwAAAM4g435QamikLgAAAAAAzjANBgkqhkiG9w0B
// SIG // AQsFADB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQD
// SIG // Ex1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAe
// SIG // Fw0xODA4MjMyMDI2MjZaFw0xOTExMjMyMDI2MjZaMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046QkJFQy0zMENBLTJE
// SIG // QkUxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
// SIG // ggEKAoIBAQC2bqnOZlvBUTrc4Qln0rCYUdOd0w+w5und
// SIG // SitVIe26KxsGB127wR9jdj98Vd9HKGb/Yt4Ur3gIYsOT
// SIG // bpOdTPZCc3ehLzqnPgDmGEIGzyXwzO5M+r91JyFzGaeg
// SIG // RrSeHJSJ5aJK9+rBQUfu4t2dk7LX4KZj1FCdrUGWAra1
// SIG // XrJGRWVfgi6VQvCiQMq6M8K4NnDlgwnSzIvxBn5gjEkT
// SIG // egG4LunEjz/d5hzs1DLI8iQF8PAbQSMZ3YMV8an2cFtG
// SIG // NV8OmLh3vC74PfxuFj87XhRwnLw5tfQeTTTi9kCgx1C6
// SIG // kX6a4TMmG1AWUMY8oRk9TyfmKZIuDURpH9pgKh/l5RlV
// SIG // AgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQUSBgx0LqAqIun
// SIG // 4iK1T7Y3v+bMBX8wHwYDVR0jBBgwFoAU1WM6XIoxkPND
// SIG // e3xGG8UzaFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0
// SIG // cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJv
// SIG // ZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3Js
// SIG // MFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0
// SIG // cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9N
// SIG // aWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
// SIG // AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkq
// SIG // hkiG9w0BAQsFAAOCAQEAa36h9Uh2bOXZxZLpzSWWmLF4
// SIG // aEE6yv7BCoPt8Ehf6HS8ATu6kFLZe21a45Av7WMwd4kT
// SIG // Mos55U2+JiOYktLZIf4V1vFGFQqEzZXwyVUM3sEki7eu
// SIG // 1rdd7jILFBd8xZMZzZIR3UEC4VOOClmCM+9CaLKH6FNy
// SIG // 496QIcdgxFnlYVkoq3Ma9Lo15+bu9av1a9718Y2xvhZh
// SIG // 8E1DHxzY+ymLu6j2eulkAi3YgEI78e4nRdZdg3Ow+PH6
// SIG // fKEtTAAjaTfEamsTNAweENcqF3u8bpUbQN0JTIzk/D80
// SIG // VSPp6/7vOJukHCFygkW0XhU25gXJDxVx8G9A/JwKt4Xh
// SIG // kSTYc7cSSTCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIw
// SIG // DQYJKoZIhvcNAQELBQAwgYgxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xMjAwBgNVBAMTKU1pY3Jvc29mdCBSb290IENlcnRp
// SIG // ZmljYXRlIEF1dGhvcml0eSAyMDEwMB4XDTEwMDcwMTIx
// SIG // MzY1NVoXDTI1MDcwMTIxNDY1NVowfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTAwggEiMA0GCSqGSIb3DQEBAQUA
// SIG // A4IBDwAwggEKAoIBAQCpHQ28dxGKOiDs/BOX9fp/aZRr
// SIG // dFQQ1aUKAIKF++18aEssX8XD5WHCdrc+Zitb8BVTJwQx
// SIG // H0EbGpUdzgkTjnxhMFmxMEQP8WCIhFRDDNdNuDgIs0Ld
// SIG // k6zWczBXJoKjRQ3Q6vVHgc2/JGAyWGBG8lhHhjKEHnRh
// SIG // Z5FfgVSxz5NMksHEpl3RYRNuKMYa+YaAu99h/EbBJx0k
// SIG // ZxJyGiGKr0tkiVBisV39dx898Fd1rL2KQk1AUdEPnAY+
// SIG // Z3/1ZsADlkR+79BL/W7lmsqxqPJ6Kgox8NpOBpG2iAg1
// SIG // 6HgcsOmZzTznL0S6p/TcZL2kAcEgCZN4zfy8wMlEXV4W
// SIG // nAEFTyJNAgMBAAGjggHmMIIB4jAQBgkrBgEEAYI3FQEE
// SIG // AwIBADAdBgNVHQ4EFgQU1WM6XIoxkPNDe3xGG8UzaFqF
// SIG // bVUwGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEwCwYD
// SIG // VR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0j
// SIG // BBgwFoAU1fZWy4/oolxiaNE9lJBb186aGMQwVgYDVR0f
// SIG // BE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9vQ2VyQXV0
// SIG // XzIwMTAtMDYtMjMuY3JsMFoGCCsGAQUFBwEBBE4wTDBK
// SIG // BggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXRfMjAxMC0w
// SIG // Ni0yMy5jcnQwgaAGA1UdIAEB/wSBlTCBkjCBjwYJKwYB
// SIG // BAGCNy4DMIGBMD0GCCsGAQUFBwIBFjFodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vUEtJL2RvY3MvQ1BTL2RlZmF1
// SIG // bHQuaHRtMEAGCCsGAQUFBwICMDQeMiAdAEwAZQBnAGEA
// SIG // bABfAFAAbwBsAGkAYwB5AF8AUwB0AGEAdABlAG0AZQBu
// SIG // AHQALiAdMA0GCSqGSIb3DQEBCwUAA4ICAQAH5ohRDeLG
// SIG // 4Jg/gXEDPZ2joSFvs+umzPUxvs8F4qn++ldtGTCzwsVm
// SIG // yWrf9efweL3HqJ4l4/m87WtUVwgrUYJEEvu5U4zM9GAS
// SIG // inbMQEBBm9xcF/9c+V4XNZgkVkt070IQyK+/f8Z/8jd9
// SIG // Wj8c8pl5SpFSAK84Dxf1L3mBZdmptWvkx872ynoAb0sw
// SIG // RCQiPM/tA6WWj1kpvLb9BOFwnzJKJ/1Vry/+tuWOM7ti
// SIG // X5rbV0Dp8c6ZZpCM/2pif93FSguRJuI57BlKcWOdeyFt
// SIG // w5yjojz6f32WapB4pm3S4Zz5Hfw42JT0xqUKloakvZ4a
// SIG // rgRCg7i1gJsiOCC1JeVk7Pf0v35jWSUPei45V3aicaoG
// SIG // ig+JFrphpxHLmtgOR5qAxdDNp9DvfYPw4TtxCd9ddJgi
// SIG // CGHasFAeb73x4QDf5zEHpJM692VHeOj4qEir995yfmFr
// SIG // b3epgcunCaw5u+zGy9iCtHLNHfS4hQEegPsbiSpUObJb
// SIG // 2sgNVZl6h3M7COaYLeqN4DMuEin1wC9UJyH3yKxO2ii4
// SIG // sanblrKnQqLJzxlBTeCG+SqaoxFmMNO7dDJL32N79ZmK
// SIG // LxvHIa9Zta7cRDyXUHHXodLFVeNp3lfB0d4wwP3M5k37
// SIG // Db9dT+mdHhk4L7zPWAUu7w2gUDXa7wknHNWzfjUeCLra
// SIG // NtvTX4/edIhJEqGCA7AwggKYAgEBMIH+oYHUpIHRMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046QkJFQy0zMENBLTJE
// SIG // QkUxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2WiJQoBATAJBgUrDgMCGgUAAxUAiW6VvDeX
// SIG // gQG1mbXKsgr5AItfbZGggd4wgdukgdgwgdUxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBP
// SIG // cGVyYXRpb25zIFB1ZXJ0byBSaWNvMScwJQYDVQQLEx5u
// SIG // Q2lwaGVyIE5UUyBFU046NTdGNi1DMUUwLTU1NEMxKzAp
// SIG // BgNVBAMTIk1pY3Jvc29mdCBUaW1lIFNvdXJjZSBNYXN0
// SIG // ZXIgQ2xvY2swDQYJKoZIhvcNAQEFBQACBQDfPZW+MCIY
// SIG // DzIwMTgwOTA4MDgyNjM4WhgPMjAxODA5MDkwODI2Mzha
// SIG // MHcwPQYKKwYBBAGEWQoEATEvMC0wCgIFAN89lb4CAQAw
// SIG // CgIBAAICAuECAf8wBwIBAAICGsswCgIFAN8+5z4CAQAw
// SIG // NgYKKwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAaAK
// SIG // MAgCAQACAxbjYKEKMAgCAQACAwehIDANBgkqhkiG9w0B
// SIG // AQUFAAOCAQEAKE3qTeePD+FfBjDp09EN5YSrDz8afw2v
// SIG // D6FeUNSvpKLCqL4ebegD5g5lclok/bxXIc0v5WbjcQ9U
// SIG // u6/xAIZe/zqyQBFcs30swBQ1AC5WUtqQRpnl+PnYFgg6
// SIG // h3OySD9jQAHjsFD9EwfGjXVIXZivuyRKoQcY3RNyFJuS
// SIG // ThGEp8TijhtRZcYo9UW5D7zqAtYPPSHPPWHKBVX39uS4
// SIG // aMxYvMRb8UNZHdc18WjZQcTWt5P5r9uME4+HNJlkyE6p
// SIG // +T4qrNZ//NhiRFmQcrKPNot9MZ2P8sEUsPt1E77nWppy
// SIG // Eau+5Fh9Ff9aDlg5//t6EpRSvXxby0v69Kbphd9VUgqx
// SIG // JTGCAvUwggLxAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAAAziDjflBqaKQuAAAAAADOMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBMjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIGo5InVk
// SIG // rtvtv5+F935GIp71KbNotymRSZc8FpUlZjP2MIHiBgsq
// SIG // hkiG9w0BCRACDDGB0jCBzzCBzDCBsQQUiW6VvDeXgQG1
// SIG // mbXKsgr5AItfbZEwgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAM4g435QamikLgAAAAAA
// SIG // zjAWBBQxgZiT0oIUZK0MExWeGAXfYXj+CTANBgkqhkiG
// SIG // 9w0BAQsFAASCAQAw7vFQL7R7bOGSLjZERtToxnhZ9jJ2
// SIG // 2ZZ1Cxk7NtYuVAmgALuYAFAEh1b8caXppv2NTc1o2rwU
// SIG // pCyVAfE8e7OPftt5R10A9CGz7JL4xapO5Fy8uZ1aB14e
// SIG // my5Py9mEG6uFLDUgJkvQlaUsr8xxX3GPDV6jbb3F3WXQ
// SIG // /EzqzZBt5AHx3xv+CcjEAHyd/qEsG8xNuF9hj6HX6cMs
// SIG // U3yK+vY/HDwG5UjxytF1rkMA7xeVkhofk3oJXrWRkowY
// SIG // de/W4441S/SodA93IV+KfjKVBW/TLC0GvFyt8GeXUNCV
// SIG // sHdTzwQiDXH9q67vED+YN5qz80kYQs0GvS2rPLG2UZjW
// SIG // j+pu
// SIG // End signature block
