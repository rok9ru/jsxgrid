$(function() {

    var Grid = jsGrid.Grid,

        JSGRID = "JSGrid",
        JSGRID_DATA_KEY = JSGRID;

    Grid.prototype.updateOnResize = false;

    QUnit.module("basic");

    QUnit.test("default creation", function(assert) {
        var gridOptions = {
                simpleOption: "test",
                complexOption: {
                    a: "subtest",
                    b: 1,
                    c: {}
                }
            },

            grid = new Grid("#jsGrid", gridOptions);

        assert.equal(grid._container[0], $("#jsGrid")[0], "container saved");
        assert.equal(grid.simpleOption, "test", "primitive option extended");
        assert.equal(grid.complexOption, gridOptions.complexOption, "non-primitive option extended");
    });

    QUnit.test("jquery adapter creation", function(assert) {
        var gridOptions = {
                option: "test"
            },
            $element = $("#jsGrid"),
            result = $element.jsGrid(gridOptions),
            grid = $element.data(JSGRID_DATA_KEY);

        assert.equal(result, $element, "jquery fn returned source jQueryElement");
        assert.ok(grid instanceof Grid, "jsGrid saved to jquery data");
        assert.equal(grid.option, "test", "options provided");
    });

    QUnit.test("destroy", function(assert) {
        var $element = $("#jsGrid"),
            grid;

        $element.jsGrid({});
        grid = $element.data(JSGRID_DATA_KEY);

        grid.destroy();

        assert.strictEqual($element.html(), "", "content is removed");
        assert.strictEqual($element.data(JSGRID_DATA_KEY), undefined, "jquery data is removed");
    });

    QUnit.test("jquery adapter second call changes option value", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                option: "test"
            },
            grid;

        $element.jsGrid(gridOptions);
        grid = $element.data(JSGRID_DATA_KEY);

        gridOptions.option = "new test";
        $element.jsGrid(gridOptions);

        assert.equal(grid, $element.data(JSGRID_DATA_KEY), "instance was not changed");
        assert.equal(grid.option, "new test", "option changed");
    });

    QUnit.test("jquery adapter invokes jsGrid method", function(assert) {
        var methodResult = "",
            $element = $("#jsGrid"),
            gridOptions = {
                method: function(str) {
                    methodResult = "test_" + str;
                }
            };

        $element.jsGrid(gridOptions);
        $element.jsGrid("method", "invoke");

        assert.equal(methodResult, "test_invoke", "method invoked");
    });

    QUnit.test("onInit callback", function(assert) {
        var $element = $("#jsGrid"),
            onInitArguments,
            gridOptions = {
                onInit: function(args) {
                    onInitArguments = args;
                }
            };

        var grid = new Grid($element, gridOptions);

        assert.equal(onInitArguments.grid, grid, "grid instance is provided in onInit callback arguments");
    });

    QUnit.test("controller methods are $.noop when not specified", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                controller: {}
            },
            testOption;

        $element.jsGrid(gridOptions);

        assert.deepEqual($element.data(JSGRID_DATA_KEY)._controller, {
            loadData: $.noop,
            insertItem: $.noop,
            updateItem: $.noop,
            deleteItem: $.noop
        }, "controller has stub methods");
    });

    QUnit.test("option method", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                test: "value"
            },
            testOption;

        $element.jsGrid(gridOptions);

        testOption = $element.jsGrid("option", "test");
        assert.equal(testOption, "value", "read option value");

        $element.jsGrid("option", "test", "new_value");
        testOption = $element.jsGrid("option", "test");
        assert.equal(testOption, "new_value", "set option value");
    });

    QUnit.test("fieldOption method", function(assert) {
        var dataLoadedCount = 0;
        var $element = $("#jsGrid"),
            gridOptions = {
                loadMessage: "",

                autoload: true,

                controller: {
                    loadData: function() {
                        dataLoadedCount++;
                        return [{ prop1: "value1", prop2: "value2", prop3: "value3" }];
                    }
                },

                fields: [
                    { name: "prop1", title: "_" }
                ]
            };

        $element.jsGrid(gridOptions);

        var fieldOptionValue = $element.jsGrid("fieldOption", "prop1", "name");
        assert.equal(fieldOptionValue, "prop1", "read field option");

        $element.jsGrid("fieldOption", "prop1", "name", "prop2");
        assert.equal($element.text(), "_value2", "set field option by field name");
        assert.equal(dataLoadedCount, 1, "data not reloaded on field option change");

        $element.jsGrid("fieldOption", 0, "name", "prop3");
        assert.equal($element.text(), "_value3", "set field option by field index");
    });

    QUnit.test("option changing event handlers", function(assert) {
        var $element = $("#jsGrid"),
            optionChangingEventArgs,
            optionChangedEventArgs,

            gridOptions = {
                test: "testValue",
                another: "anotherValue",
                onOptionChanging: function(e) {
                    optionChangingEventArgs = $.extend({}, e);

                    e.option = "another";
                    e.newValue = e.newValue + "_" + this.another;
                },
                onOptionChanged: function(e) {
                    optionChangedEventArgs = $.extend({}, e);
                }
            },
            anotherOption;

        $element.jsGrid(gridOptions);

        $element.jsGrid("option", "test", "newTestValue");
        assert.equal(optionChangingEventArgs.option, "test", "option name is provided in args of optionChanging");
        assert.equal(optionChangingEventArgs.oldValue, "testValue", "old option value is provided in args of optionChanging");
        assert.equal(optionChangingEventArgs.newValue, "newTestValue", "new option value is provided in args of optionChanging");

        anotherOption = $element.jsGrid("option", "another");
        assert.equal(anotherOption, "newTestValue_anotherValue", "option changing handler changed option and value");

        assert.equal(optionChangedEventArgs.option, "another", "option name is provided in args of optionChanged");
        assert.equal(optionChangedEventArgs.value, "newTestValue_anotherValue", "option value is provided in args of optionChanged");
    });

    QUnit.test("common layout rendering", function(assert) {
        var $element = $("#jsGrid"),
            grid = new Grid($element, {}),
            $headerGrid,
            $headerGridTable,
            $bodyGrid,
            $bodyGridTable;

        assert.ok($element.hasClass(grid.containerClass), "container class attached");
        assert.ok($element.children().eq(0).hasClass(grid.gridHeaderClass), "grid header");
        assert.ok($element.children().eq(1).hasClass(grid.gridBodyClass), "grid body");
        assert.ok($element.children().eq(2).hasClass(grid.pagerContainerClass), "pager container");

        $headerGrid = $element.children().eq(0);
        $headerGridTable = $headerGrid.children().first();
        assert.ok($headerGridTable.hasClass(grid.tableClass), "header table");
        assert.equal($headerGrid.find("." + grid.headerRowClass).length, 1, "header row");
        assert.equal($headerGrid.find("." + grid.filterRowClass).length, 1, "filter row");
        assert.equal($headerGrid.find("." + grid.insertRowClass).length, 1, "insert row");
        assert.ok(grid._headerRow.hasClass(grid.headerRowClass), "header row class");
        assert.ok(grid._filterRow.hasClass(grid.filterRowClass), "filter row class");
        assert.ok(grid._insertRow.hasClass(grid.insertRowClass), "insert row class");

        $bodyGrid = $element.children().eq(1);
        $bodyGridTable = $bodyGrid.children().first();
        assert.ok($bodyGridTable.hasClass(grid.tableClass), "body table");
        assert.equal(grid._content.parent()[0], $bodyGridTable[0], "content is tbody in body table");
        assert.equal($bodyGridTable.find("." + grid.noDataRowClass).length, 1, "no data row");
        assert.equal($bodyGridTable.text(), grid.noDataContent, "no data text");
    });

    QUnit.test("set default options with setDefaults", function(assert) {
        jsGrid.setDefaults({
            defaultOption: "test"
        });

        var $element = $("#jsGrid").jsGrid({});

        assert.equal($element.jsGrid("option", "defaultOption"), "test", "default option set");
    });


    QUnit.module("loading");

    QUnit.test("loading with controller", function(assert) {
        var $element = $("#jsGrid"),
            data = [
                { test: "test1" },
                { test: "test2" }
            ],

            gridOptions = {
                controller: {
                    loadData: function() {
                        return data;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.loadData();

        assert.equal(grid.option("data"), data, "loadData loads data");
    });

    QUnit.test("loadData throws exception when controller method not found", function(assert) {
        var $element = $("#jsGrid");
        var grid = new Grid($element);
        grid._controller = {};

        assert.throws(function() {
            grid.loadData();
        }, /loadData/, "loadData threw an exception");
    });

    QUnit.test("onError event should be fired on controller fail", function(assert) {
        var done = assert.async();
        var errorArgs,
            errorFired = 0,
            $element = $("#jsGrid"),

            gridOptions = {
                controller: {
                    loadData: function() {
                        return $.Deferred().reject({ value: 1 }, "test").promise();
                    }
                },
                onError: function(args) {
                    errorFired++;
                    errorArgs = args;
                }
            },

            grid = new Grid($element, gridOptions);

        grid.loadData();

        // jQuery 3+ resolves/rejects Deferreds as a microtask (Promises/A+
        // compliance), even when already settled - so onError no longer
        // fires synchronously here. Flush the microtask queue before asserting.
        setTimeout(function() {
            assert.equal(errorFired, 1, "onError handler fired");
            assert.deepEqual(errorArgs, { grid: grid, args: [{ value: 1 }, "test"] }, "error has correct params");
            done();
        }, 0);
    });

    QUnit.test("autoload should call loadData after render", function(assert) {
        assert.expect(1);
        var done = assert.async();
        new Grid($("#jsGrid"), {
            autoload: true,
            controller: {
                loadData: function() {
                    assert.ok(true, "autoload calls loadData on creation");
                    done();
                    return [];
                }
            }
        });
    });

    QUnit.test("loading filtered data", function(assert) {
        var filteredData,
            loadingArgs,
            loadedArgs,
            $element = $("#jsGrid"),
            data = [
                { field: "test" },
                { field: "test_another" },
                { field: "test_another" },
                { field: "test" }
            ],

            gridOptions = {
                filtering: true,
                fields: [
                    {
                        name: "field",
                        filterValue: function(value) {
                            return "test";
                        }
                    }
                ],
                onDataLoading: function(e) {
                    loadingArgs = $.extend(true, {}, e);
                },
                onDataLoaded: function(e) {
                    loadedArgs = $.extend(true, {}, e);
                },
                controller: {
                    loadData: function(filter) {
                        filteredData = $.grep(data, function(item) {
                            return item.field === filter.field;
                        });
                        return filteredData;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.loadData();

        assert.equal(loadingArgs.filter.field, "test");
        assert.equal(grid.option("data").length, 2, "filtered data loaded");
        assert.deepEqual(loadedArgs.data, filteredData);
    });

    QUnit.test("loading indication", function(assert) {
        var done = assert.async();
        var timeout = 10,
            stage = "initial",
            $element = $("#jsGrid"),

            gridOptions = {
                loadIndication: true,
                loadIndicationDelay: timeout,
                loadMessage: "loading...",

                loadIndicator: function(config) {
                    assert.equal(config.message, gridOptions.loadMessage, "message provided");
                    assert.ok(config.container.jquery, "grid container is provided");

                    return {
                        show: function() {
                            stage = "started";
                        },
                        hide: function() {
                            stage = "finished";
                        }
                    };
                },

                fields: [
                    { name: "field" }
                ],

                controller: {
                    loadData: function() {
                        var deferred = $.Deferred();

                        assert.equal(stage, "initial", "initial stage");

                        setTimeout(function() {
                            assert.equal(stage, "started", "loading started");

                            deferred.resolve([]);

                            // jQuery 3+ resolves Deferreds as a microtask, so
                            // the .done() handler that hides the load
                            // indicator hasn't run yet at this point - flush
                            // the microtask queue before asserting.
                            setTimeout(function() {
                                assert.equal(stage, "finished", "loading finished");
                                done();
                            }, 0);
                        }, timeout);

                        return deferred.promise();
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.loadData();
    });

    QUnit.test("loadingIndication=false should not show loading", function(assert) {
        assert.expect(0);
        var done = assert.async();
        var $element = $("#jsGrid"),
            timeout = 10,

            gridOptions = {
                loadIndication: false,
                loadIndicationDelay: timeout,

                loadIndicator: function() {
                    return {
                        show: function() {
                            assert.ok(false, "should not call show");
                        },
                        hide: function() {
                            assert.ok(false, "should not call hide");
                        }
                    };
                },

                fields: [
                    { name: "field" }
                ],

                controller: {
                    loadData: function() {
                        var deferred = $.Deferred();

                        setTimeout(function() {
                            deferred.resolve([]);
                            done();
                        }, timeout);

                        return deferred.promise();
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.loadData();
    });

    QUnit.test("search", function(assert) {
        var $element = $("#jsGrid"),
            data = [
                { field: "test" },
                { field: "test_another" },
                { field: "test_another" },
                { field: "test" }
            ],

            gridOptions = {
                pageIndex: 2,
                _sortField: "field",
                _sortOrder: "desc",
                filtering: true,
                fields: [
                    {
                        name: "field",
                        filterValue: function(value) {
                            return "test";
                        }
                    }
                ],
                controller: {
                    loadData: function(filter) {
                        var filteredData = $.grep(data, function(item) {
                            return item.field === filter.field;
                        });
                        return filteredData;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.search();
        assert.equal(grid.option("data").length, 2, "data filtered");
        assert.strictEqual(grid.option("pageIndex"), 1, "pageIndex reset");
        assert.strictEqual(grid._sortField, null, "sortField reset");
        assert.strictEqual(grid._sortOrder, "asc", "sortOrder reset");
    });

    QUnit.test("change loadStrategy on the fly", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {
            controller: {
                loadData: function() {
                    return [];
                }
            }
        };

        var grid = new Grid($element, gridOptions);

        grid.option("loadStrategy", {
            firstDisplayIndex: function() {
                return 0;
            },

            lastDisplayIndex: function() {
                return 1;
            },

            itemsCount: function() {
                return 1;
            },

            loadParams: function() {
                return [];
            },

            finishLoad: function() {
                grid.option("data", [{}]);
            }
        });

        grid.loadData();

        assert.equal(grid.option("data").length, 1, "new load strategy is applied");
    });


    QUnit.module("filtering");

    QUnit.test("filter rendering", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                filtering: true,
                fields: [
                    {
                        name: "test",
                        align: "right",
                        filtercss: "filter-class",
                        filterTemplate: function() {
                            var result = this.filterControl = $("<input>").attr("type", "text").addClass("filter-input");
                            return result;
                        }
                    }
                ]
            },
            grid = new Grid($element, gridOptions);

        assert.equal(grid._filterRow.find(".filter-class").length, 1, "filtercss class is attached");
        assert.equal(grid._filterRow.find(".filter-input").length, 1, "filter control rendered");
        assert.equal(grid._filterRow.find("." + grid.cellClass).length, 1, "cell class is attached");
        assert.ok(grid._filterRow.find(".filter-class").hasClass("jsgrid-align-right"), "align class is attached");
        assert.ok(grid.fields[0].filterControl.is("input[type=text]"), "filter control saved in field");
    });

    QUnit.test("filter get/clear", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                filtering: true,
                controller: {
                    loadData: function() {
                        return [];
                    }
                },
                fields: [
                    {
                        name: "field",
                        filterTemplate: function() {
                            return this.filterControl = $("<input>").attr("type", "text");
                        },
                        filterValue: function() {
                            return this.filterControl.val();
                        }
                    }
                ]
            },
            grid = new Grid($element, gridOptions);

        grid.fields[0].filterControl.val("test");
        assert.deepEqual(grid.getFilter(), { field: "test" }, "get filter");

        grid.clearFilter();
        assert.deepEqual(grid.getFilter(), { field: "" }, "filter cleared");
        assert.equal(grid.fields[0].filterControl.val(), "", "grid field filterControl cleared");
    });

    QUnit.test("field without filtering", function(assert) {
        var $element = $("#jsGrid"),
            jsGridFieldConfig = {
                filterTemplate: function() {
                    var result = this.filterControl = $("<input>").attr("type", "text");
                    return result;
                },
                filterValue: function(value) {
                    if(!arguments.length) {
                        return this.filterControl.val();
                    }
                    this.filterControl.val(value);
                }
            },

            gridOptions = {
                filtering: true,
                fields: [
                    $.extend({}, jsGridFieldConfig, {
                        name: "field1",
                        filtering: false
                    }),
                    $.extend({}, jsGridFieldConfig, {
                        name: "field2"
                    })
                ]
            },

            grid = new Grid($element, gridOptions);

        grid.fields[0].filterControl.val("test1");
        grid.fields[1].filterControl.val("test2");
        assert.deepEqual(grid.getFilter(), { field2: "test2" }, "field with filtering=false is not included in filter");
    });

    QUnit.test("search with filter", function(assert) {
        var $element = $("#jsGrid"),
            data = [
                { field: "test" },
                { field: "test_another" },
                { field: "test_another" },
                { field: "test" }
            ],

            gridOptions = {
                fields: [
                    {
                        name: "field"
                    }
                ],
                controller: {
                    loadData: function(filter) {
                        var filteredData = $.grep(data, function(item) {
                            return item.field === filter.field;
                        });
                        return filteredData;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.search({ field: "test" });
        assert.equal(grid.option("data").length, 2, "data filtered");
    });

    QUnit.test("filtering with static data should not do actual filtering", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                filtering: true,
                fields: [
                    { type: "text", name: "field" }
                ],
                data: [
                    { name: "value1" },
                    { name: "value2" }
                ]
            },
            grid = new Grid($element, gridOptions);

        grid._filterRow.find("input").val("1");

        grid.search();
        assert.equal(grid.option("data").length, 2, "data is not filtered");
    });


    QUnit.module("nodatarow");

    QUnit.test("nodatarow after bind on empty array", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {},
            grid = new Grid($element, gridOptions);

        grid.option("data", []);

        assert.equal(grid._content.find("." + grid.noDataRowClass).length, 1, "no data row rendered");
        assert.equal(grid._content.find("." + grid.cellClass).length, 1, "grid cell class attached");
        assert.equal(grid._content.text(), grid.noDataContent, "no data text rendered");
    });

    QUnit.test("nodatarow customize content", function(assert) {
        var noDataMessage = "NoData Custom Content",
            $element = $("#jsGrid"),
            gridOptions = {
                noDataContent: function() {
                    return noDataMessage;
                }
            },
            grid = new Grid($element, gridOptions);

        grid.option("data", []);

        assert.equal(grid._content.find("." + grid.cellClass).length, 1, "grid cell class attached");
        assert.equal(grid._content.text(), noDataMessage, "custom noDataContent");
    });


    QUnit.module("row rendering", {
        beforeEach: function() {
            this.testData = [
                { id: 1, text: "test1" },
                { id: 2, text: "test2" },
                { id: 3, text: "test3" }
            ];
        }
    });

    QUnit.test("rows rendered correctly", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                data: this.testData
            },
            grid = new Grid($element, gridOptions);

        assert.equal(grid._content.children().length, 3, "rows rendered");
        assert.equal(grid._content.find("." + grid.oddRowClass).length, 2, "two odd rows for 3 items");
        assert.equal(grid._content.find("." + grid.evenRowClass).length, 1, "one even row for 3 items");
    });

    QUnit.test("custom rowClass", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                data: this.testData,
                rowClass: "custom-row-cls"
            },
            grid = new Grid($element, gridOptions);

        assert.equal(grid._content.find("." + grid.oddRowClass).length, 2);
        assert.equal(grid._content.find("." + grid.evenRowClass).length, 1);
        assert.equal(grid._content.find(".custom-row-cls").length, 3, "custom row class");
    });

    QUnit.test("custom rowClass callback", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                data: this.testData,
                rowClass: function(item, index) {
                    return item.text;
                }
            },
            grid = new Grid($element, gridOptions);

        assert.equal(grid._content.find("." + grid.oddRowClass).length, 2);
        assert.equal(grid._content.find("." + grid.evenRowClass).length, 1);
        assert.equal(grid._content.find(".test1").length, 1, "custom row class");
        assert.equal(grid._content.find(".test2").length, 1, "custom row class");
        assert.equal(grid._content.find(".test3").length, 1, "custom row class");
    });

    QUnit.test("rowClick standard handler", function(assert) {
        var $element = $("#jsGrid"),
            $secondRow,
            grid = new Grid($element, { editing: true });

        grid.option("data", this.testData);

        $secondRow = grid._content.find("." + grid.evenRowClass);
        $secondRow.trigger("click", $.Event($secondRow));

        assert.equal(grid._editingRow.get(0), $secondRow.get(0), "clicked row is editingRow");
    });

    QUnit.test("rowClick handler", function(assert) {
        var rowClickArgs,
            $element = $("#jsGrid"),
            $secondRow,
            gridOptions = {
                rowClick: function(args) {
                    rowClickArgs = args;
                }
            },
            grid = new Grid($element, gridOptions);

        grid.option("data", this.testData);

        $secondRow = grid._content.find("." + grid.evenRowClass);
        $secondRow.trigger("click", $.Event($secondRow));

        assert.ok(rowClickArgs.event instanceof jQuery.Event, "jquery event arg");
        assert.equal(rowClickArgs.item, this.testData[1], "item arg");
        assert.equal(rowClickArgs.itemIndex, 1, "itemIndex arg");
    });

    QUnit.test("row selecting with selectedRowClass", function(assert) {
        var $element = $("#jsGrid"),
            $secondRow,
            gridOptions = {
                selecting: true
            },
            grid = new Grid($element, gridOptions);

        grid.option("data", this.testData);

        $secondRow = grid._content.find("." + grid.evenRowClass);

        $secondRow.trigger("mouseenter", $.Event($secondRow));
        assert.ok($secondRow.hasClass(grid.selectedRowClass), "mouseenter adds selectedRowClass");

        $secondRow.trigger("mouseleave", $.Event($secondRow));
        assert.ok(!$secondRow.hasClass(grid.selectedRowClass), "mouseleave removes selectedRowClass");
    });

    QUnit.test("no row selecting while selection is disabled", function(assert) {
        var $element = $("#jsGrid"),
            $secondRow,
            gridOptions = {
                selecting: false
            },
            grid = new Grid($element, gridOptions);

        grid.option("data", this.testData);

        $secondRow = grid._content.find("." + grid.evenRowClass);
        $secondRow.trigger("mouseenter", $.Event($secondRow));
        assert.ok(!$secondRow.hasClass(grid.selectedRowClass), "mouseenter doesn't add selectedRowClass");
    });

    QUnit.test("refreshing and refreshed callbacks", function(assert) {
        var refreshingEventArgs,
            refreshedEventArgs,
            $element = $("#jsGrid"),
            grid = new Grid($element, {});

        grid.onRefreshing = function(e) {
            refreshingEventArgs = e;
            assert.equal(grid._content.find("." + grid.oddRowClass).length, 0, "no items before refresh");
        };

        grid.onRefreshed = function(e) {
            refreshedEventArgs = e;
            assert.equal(grid._content.find("." + grid.oddRowClass).length, 2, "items rendered after refresh");
        };

        grid.option("data", this.testData);

        assert.equal(refreshingEventArgs.grid, grid, "grid provided in args for refreshing event");
        assert.equal(refreshedEventArgs.grid, grid, "grid provided in args for refreshed event");
        assert.equal(grid._content.find("." + grid.oddRowClass).length, 2, "items rendered");
    });

    QUnit.test("grid fields normalization", function(assert) {
        var CustomField = function(config) {
            $.extend(true, this, config);
        };

        jsGrid.fields.custom = CustomField;

        try {
            var $element = $("#jsGrid"),
                gridOptions = {
                    fields: [
                        new jsGrid.Field({
                            name: "text1",
                            title: "title1"
                        }),
                        {
                            name: "text2",
                            title: "title2"
                        },
                        {
                            name: "text3",
                            type: "custom"
                        }
                    ]
                },
                grid = new Grid($element, gridOptions);

            var field1 = grid.fields[0];
            assert.ok(field1 instanceof jsGrid.Field);
            assert.equal(field1.name, "text1", "name is set for field");
            assert.equal(field1.title, "title1", "title field");

            var field2 = grid.fields[1];
            assert.ok(field2 instanceof jsGrid.Field);
            assert.equal(field2.name, "text2", "name is set for field");
            assert.equal(field2.title, "title2", "title field");

            var field3 = grid.fields[2];
            assert.ok(field3 instanceof CustomField);
            assert.equal(field3.name, "text3", "name is set for field");
        } finally {
            delete jsGrid.fields.custom;
        }
    });

    QUnit.test("'0' itemTemplate should be rendered", function(assert) {
        var $element = $("#jsGrid"),
            grid = new Grid($element, {
                data: [{}],
                fields: [
                    new jsGrid.Field({ name: "id", itemTemplate: function() { return 0; } })
                ]
            });

        assert.equal(grid._bodyGrid.text(), "0", "item template is rendered");
    });

    QUnit.test("grid field name used for header if title is not specified", function(assert) {
        var $element = $("#jsGrid"),
            grid = new Grid($element, {
                fields: [
                    new jsGrid.Field({ name: "id" })
                ]
            });

        assert.equal(grid._headerRow.text(), "id", "name is rendered in header");
    });

    QUnit.test("grid fields header and item rendering", function(assert) {
        var $element = $("#jsGrid"),
            $secondRow,
            gridOptions = {
                fields: [
                    new jsGrid.Field({
                        name: "text",
                        title: "title",
                        css: "cell-class",
                        headercss: "header-class",
                        align: "right"
                    })
                ]
            },
            grid = new Grid($element, gridOptions);

        grid.option("data", this.testData);

        assert.equal(grid._headerRow.text(), "title", "header rendered");
        assert.equal(grid._headerRow.find("." + grid.headerCellClass).length, 1, "header cell class is attached");
        assert.equal(grid._headerRow.find(".header-class").length, 1, "headercss class is attached");
        assert.ok(grid._headerRow.find(".header-class").hasClass("jsgrid-align-right"), "align class is attached");

        $secondRow = grid._content.find("." + grid.evenRowClass);
        assert.equal($secondRow.text(), "test2", "item rendered");
        assert.equal($secondRow.find(".cell-class").length, 1, "css class added to cell");
        assert.equal($secondRow.find("." + grid.cellClass).length, 1, "cell class is attached");
        assert.ok($secondRow.find(".cell-class").hasClass("jsgrid-align-right"), "align class added to cell");
    });

    QUnit.test("grid field cellRenderer", function(assert) {
        var testItem = { text: "test" },
            args;

        var $grid = $("#jsGrid");

        var gridOptions = {
            data: [testItem],
            fields: [
                {
                    name: "text",
                    cellRenderer: function(value, item) {
                        args = {
                            value: value,
                            item: item
                        };
                        return $("<td>").addClass("custom-class").text(value);
                    }
                }
            ]
        };

        var grid = new Grid($grid, gridOptions);
        var $customCell = $grid.find(".custom-class");

        assert.equal($customCell.length, 1, "custom cell rendered");
        assert.equal($customCell.text(), "test");
        assert.deepEqual(args, { value: "test", item: testItem }, "cellRenderer args provided");
    });

    QUnit.test("grid field 'visible' option", function(assert) {
        var $grid = $("#jsGrid");

        var gridOptions = {
            editing: true,
            fields: [
                { name: "id", visible: false },
                { name: "test" }
            ]
        };

        var grid = new Grid($grid, gridOptions);

        assert.equal($grid.find("." + grid.noDataRowClass).children().eq(0).prop("colspan"), 1, "no data row colspan only for visible cells");

        grid.option("data", this.testData);
        grid.editItem(this.testData[2]);

        assert.equal($grid.find("." + grid.headerRowClass).children().length, 1, "header single cell");
        assert.equal($grid.find("." + grid.filterRowClass).children().length, 1, "filter single cell");
        assert.equal($grid.find("." + grid.insertRowClass).children().length, 1, "insert single cell");
        assert.equal($grid.find("." + grid.editRowClass).children().length, 1, "edit single cell");
        assert.equal($grid.find("." + grid.oddRowClass).eq(0).children().length, 1, "odd data row single cell");
        assert.equal($grid.find("." + grid.evenRowClass).eq(0).children().length, 1, "even data row single cell");
    });


    QUnit.module("inserting");

    QUnit.test("inserting rendering", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                inserting: true,
                fields: [
                    {
                        name: "test",
                        align: "right",
                        insertcss: "insert-class",
                        insertTemplate: function() {
                            var result = this.insertControl = $("<input>").attr("type", "text").addClass("insert-input");
                            return result;
                        }
                    }
                ]
            },
            grid = new Grid($element, gridOptions);

        assert.equal(grid._insertRow.find(".insert-class").length, 1, "insertcss class is attached");
        assert.equal(grid._insertRow.find(".insert-input").length, 1, "insert control rendered");
        assert.equal(grid._insertRow.find("." + grid.cellClass).length, 1, "cell class is attached");
        assert.ok(grid._insertRow.find(".insert-class").hasClass("jsgrid-align-right"), "align class is attached");
        assert.ok(grid.fields[0].insertControl.is("input[type=text]"), "insert control saved in field");
    });

    QUnit.test("field without inserting", function(assert) {
        var $element = $("#jsGrid"),
            jsGridFieldConfig = {
                insertTemplate: function() {
                    var result = this.insertControl = $("<input>").attr("type", "text");
                    return result;
                },
                insertValue: function() {
                    return this.insertControl.val();
                }
            },

            gridOptions = {
                inserting: true,
                fields: [
                    $.extend({}, jsGridFieldConfig, {
                        name: "field1",
                        inserting: false
                    }),
                    $.extend({}, jsGridFieldConfig, {
                        name: "field2"
                    })
                ]
            },

            grid = new Grid($element, gridOptions);

        grid.fields[0].insertControl.val("test1");
        grid.fields[1].insertControl.val("test2");
        assert.deepEqual(grid._getInsertItem(), { field2: "test2" }, "field with inserting=false is not included in inserting item");
    });

    QUnit.test("insert data with default location", function(assert) {
        var $element = $("#jsGrid"),

            inserted = false,
            insertingArgs,
            insertedArgs,

            gridOptions = {
                inserting: true,
                data: [{field: "default"}],
                fields: [
                    {
                        name: "field",
                        insertTemplate: function() {
                            var result = this.insertControl = $("<input>").attr("type", "text");
                            return result;
                        },
                        insertValue: function() {
                            return this.insertControl.val();
                        }
                    }
                ],
                onItemInserting: function(e) {
                    insertingArgs = $.extend(true, {}, e);
                },
                onItemInserted: function(e) {
                    insertedArgs = $.extend(true, {}, e);
                },
                controller: {
                    insertItem: function() {
                        inserted = true;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.fields[0].insertControl.val("test");
        grid.insertItem();

        assert.equal(insertingArgs.item.field, "test", "field is provided in inserting args");
        assert.equal(grid.option("data").length, 2, "data is inserted");
        assert.ok(inserted, "controller insertItem was called");
        assert.deepEqual(grid.option("data")[1], { field: "test" }, "correct data is inserted");
        assert.equal(insertedArgs.item.field, "test", "field is provided in inserted args");
    });
    
    QUnit.test("insert data with specified insert location", function(assert) {
        var $element = $("#jsGrid"),

            inserted = false,
            insertingArgs,
            insertedArgs,

            gridOptions = {
                inserting: true,
                insertRowLocation: "top",
                data: [{field: "default"}],
                fields: [
                    {
                        name: "field",
                        insertTemplate: function() {
                            var result = this.insertControl = $("<input>").attr("type", "text");
                            return result;
                        },
                        insertValue: function() {
                            return this.insertControl.val();
                        }
                    }
                ],
                onItemInserting: function(e) {
                    insertingArgs = $.extend(true, {}, e);
                },
                onItemInserted: function(e) {
                    insertedArgs = $.extend(true, {}, e);
                },
                controller: {
                    insertItem: function() {
                        inserted = true;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.fields[0].insertControl.val("test");
        grid.insertItem();

        assert.equal(insertingArgs.item.field, "test", "field is provided in inserting args");
        assert.equal(grid.option("data").length, 2, "data is inserted");
        assert.ok(inserted, "controller insertItem was called");
        assert.deepEqual(grid.option("data")[0], { field: "test" }, "correct data is inserted at the beginning");
        assert.equal(insertedArgs.item.field, "test", "field is provided in inserted args");
    });

    QUnit.test("insertItem accepts item to insert", function(assert) {
        var $element = $("#jsGrid"),
            itemToInsert = { field: "test" },
            insertedItem,

            gridOptions = {
                data: [],
                fields: [
                    {
                        name: "field"
                    }
                ],
                controller: {
                    insertItem: function(item) {
                        insertedItem = item;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.insertItem(itemToInsert);
        assert.deepEqual(grid.option("data")[0], itemToInsert, "data is inserted");
        assert.deepEqual(insertedItem, itemToInsert, "controller insertItem was called with correct item");
    });


    QUnit.module("editing");

    QUnit.test("editing rendering", function(assert) {
        var $element = $("#jsGrid"),
            $editRow,
            data = [{
                test: "value"
            }],

            gridOptions = {
                editing: true,
                fields: [
                    {
                        name: "test",
                        align: "right",
                        editcss: "edit-class",
                        editTemplate: function(value) {
                            var result = this.editControl = $("<input>").attr("type", "text").val(value).addClass("edit-input");
                            return result;
                        }
                    }
                ]
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        assert.equal(grid._content.find("." + grid.editRowClass).length, 0, "no edit row after initial rendering");

        grid.editItem(data[0]);

        $editRow = grid._content.find("." + grid.editRowClass);
        assert.equal($editRow.length, 1, "edit row rendered");
        assert.equal($editRow.find(".edit-class").length, 1, "editcss class is attached");
        assert.equal($editRow.find(".edit-input").length, 1, "edit control rendered");
        assert.equal($editRow.find("." + grid.cellClass).length, 1, "cell class is attached");
        assert.ok($editRow.find(".edit-class").hasClass("jsgrid-align-right"), "align class is attached");

        assert.ok(grid.fields[0].editControl.is("input[type=text]"), "edit control saved in field");
        assert.equal(grid.fields[0].editControl.val(), "value", "edit control value");
    });

    QUnit.test("editItem accepts row to edit", function(assert) {
        var $element = $("#jsGrid"),
            $editRow,
            data = [
                { test: "value" }
            ],

            gridOptions = {
                editing: true,
                fields: [
                    { name: "test" }
                ]
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        var $row = $element.find("." + grid.oddRowClass).eq(0);

        grid.editItem($row);
        $editRow = grid._content.find("." + grid.editRowClass);
        assert.equal($editRow.length, 1, "edit row rendered");

        grid.cancelEdit();

        grid.editItem($row.get(0));
        $editRow = grid._content.find("." + grid.editRowClass);
        assert.equal($editRow.length, 1, "edit row rendered");
    });

    QUnit.test("edit item", function(assert) {
        var $element = $("#jsGrid"),
            editingArgs,
            editingRow,
            updated = false,
            updatingArgs,
            updatingRow,
            updatedRow,
            updatedArgs,
            data = [{
                field: "value"
            }],

            gridOptions = {
                editing: true,
                fields: [
                    {
                        name: "field",
                        editTemplate: function(value) {
                            var result = this.editControl = $("<input>").attr("type", "text").val(value);
                            return result;
                        },
                        editValue: function() {
                            return this.editControl.val();
                        }
                    }
                ],
                controller: {
                    updateItem: function(updatingItem) {
                        updated = true;
                    }
                },
                onItemEditing: function(e) {
                    editingArgs = $.extend(true, {}, e);
                    editingRow = grid.rowByItem(data[0])[0];
                },
                onItemUpdating: function(e) {
                    updatingArgs = $.extend(true, {}, e);
                    updatingRow = grid.rowByItem(data[0])[0];
                },
                onItemUpdated: function(e) {
                    updatedArgs = $.extend(true, {}, e);
                    updatedRow = grid.rowByItem(data[0])[0];
                }
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        grid.editItem(data[0]);

        assert.deepEqual(editingArgs.item, { field: "value" }, "item before editing is provided in editing event args");
        assert.equal(editingArgs.itemIndex, 0, "itemIndex is provided in editing event args");
        assert.equal(editingArgs.row[0], editingRow, "row element is provided in editing event args");

        grid.fields[0].editControl.val("new value");
        grid.updateItem();

        assert.deepEqual(updatingArgs.previousItem, { field: "value" }, "item before editing is provided in updating event args");
        assert.deepEqual(updatingArgs.item, { field: "new value" }, "updating item is provided in updating event args");
        assert.equal(updatingArgs.itemIndex, 0, "itemIndex is provided in updating event args");
        assert.equal(updatingArgs.row[0], updatingRow, "row element is provided in updating event args");
        assert.ok(updated, "controller updateItem called");
        assert.deepEqual(grid.option("data")[0], { field: "new value" }, "correct data updated");
        assert.equal(grid._content.find("." + grid.editRowClass).length, 0, "edit row removed");
        assert.equal(grid._content.find("." + grid.oddRowClass).length, 1, "data row rendered");
        assert.deepEqual(updatedArgs.previousItem, { field: "value" }, "item before editing is provided in updated event args");
        assert.deepEqual(updatedArgs.item, { field: "new value" }, "updated item is provided in updated event args");
        assert.equal(updatedArgs.itemIndex, 0, "itemIndex is provided in updated event args");
        assert.equal(updatedArgs.row[0], updatedRow, "row element is provided in updated event args");
    });

    QUnit.test("failed update should not change original item", function(assert) {
        var $element = $("#jsGrid"),
            data = [{
                field: "value"
            }],

            gridOptions = {
                editing: true,
                fields: [
                    {
                        name: "field",
                        editTemplate: function(value) {
                            var result = this.editControl = $("<input>").attr("type", "text").val(value);
                            return result;
                        },
                        editValue: function() {
                            return this.editControl.val();
                        }
                    }
                ],
                controller: {
                    updateItem: function(updatingItem) {
                        return $.Deferred().reject();
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        grid.editItem(data[0]);

        grid.fields[0].editControl.val("new value");
        grid.updateItem();

        assert.deepEqual(grid.option("data")[0], { field: "value" }, "value is not updated");
    });

    QUnit.test("cancel edit", function(assert) {
        var $element = $("#jsGrid"),
            updated = false,
            cancellingArgs,
            cancellingRow,
            data = [{
                field: "value"
            }],

            gridOptions = {
                editing: true,
                fields: [
                    {
                        name: "field",
                        editTemplate: function(value) {
                            var result = this.editControl = $("<input>").attr("type", "text").val(value);
                            return result;
                        },
                        editValue: function() {
                            return this.editControl.val();
                        }
                    }
                ],
                controller: {
                    updateData: function(updatingItem) {
                        updated = true;
                    }
                },
                onItemEditCancelling: function(e) {
                    cancellingArgs = $.extend(true, {}, e);
                    cancellingRow = grid.rowByItem(data[0])[0];
                }
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        grid.editItem(data[0]);
        grid.fields[0].editControl.val("new value");
        grid.cancelEdit();

        assert.deepEqual(cancellingArgs.item, { field: "value" }, "item before cancel is provided in cancelling event args");
        assert.equal(cancellingArgs.itemIndex, 0, "itemIndex is provided in cancelling event args");
        assert.equal(cancellingArgs.row[0], cancellingRow, "row element is provided in cancelling event args");

        assert.ok(!updated, "controller updateItem was not called");
        assert.deepEqual(grid.option("data")[0], { field: "value" }, "data were not updated");
        assert.equal(grid._content.find("." + grid.editRowClass).length, 0, "edit row removed");
        assert.equal(grid._content.find("." + grid.oddRowClass).length, 1, "data row restored");
    });

    QUnit.test("updateItem accepts item to update and new item", function(assert) {
        var $element = $("#jsGrid"),
            updatingItem,
            data = [{
                field: "value"
            }],

            gridOptions = {
                fields: [
                    { name: "field" }
                ],
                controller: {
                    updateItem: function(item) {
                        return updatingItem = item;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        grid.updateItem(data[0], { field: "new value" });

        assert.deepEqual(updatingItem, { field: "new value" }, "controller updateItem called correctly");
        assert.deepEqual(grid.option("data")[0], { field: "new value" }, "correct data updated");
    });

    QUnit.test("updateItem accepts single argument - item to update", function(assert) {
        var $element = $("#jsGrid"),
            updatingItem,
            data = [{
                field: "value"
            }],

            gridOptions = {
                fields: [
                    { name: "field" }
                ],
                controller: {
                    updateItem: function(item) {
                        return updatingItem = item;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        data[0].field = "new value";

        grid.updateItem(data[0]);

        assert.deepEqual(updatingItem, { field: "new value" }, "controller updateItem called correctly");
        assert.deepEqual(grid.option("data")[0], { field: "new value" }, "correct data updated");
    });

    QUnit.test("editRowRenderer", function(assert) {
        var $element = $("#jsGrid"),

            data = [
                { value: "test" }
            ],

            gridOptions = {
                data: data,
                editing: true,

                editRowRenderer: function(item, itemIndex) {
                    return $("<tr>").addClass("custom-edit-row").append($("<td>").text(itemIndex + ":" + item.value));
                },

                fields: [
                    { name: "value" }
                ]
            },

            grid = new Grid($element, gridOptions);

        grid.editItem(data[0]);

        var $editRow = grid._content.find(".custom-edit-row");
        assert.equal($editRow.length, 1, "edit row rendered");
        assert.equal($editRow.text(), "0:test", "custom edit row renderer rendered");
    });


    QUnit.module("deleting");

    QUnit.test("delete item", function(assert) {
        var $element = $("#jsGrid"),
            deleted = false,
            deletingArgs,
            deletedArgs,
            data = [{
                field: "value"
            }],

            gridOptions = {
                confirmDeleting: false,
                fields: [
                    { name: "field" }
                ],
                controller: {
                    deleteItem: function(deletingItem) {
                        deleted = true;
                    }
                },
                onItemDeleting: function(e) {
                    deletingArgs = $.extend(true, {}, e);
                },
                onItemDeleted: function(e) {
                    deletedArgs = $.extend(true, {}, e);
                }
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        grid.deleteItem(data[0]);

        assert.deepEqual(deletingArgs.item, { field: "value" }, "field and value is provided in deleting event args");
        assert.equal(deletingArgs.itemIndex, 0, "itemIndex is provided in updating event args");
        assert.equal(deletingArgs.row.length, 1, "row element is provided in updating event args");
        assert.ok(deleted, "controller deleteItem called");
        assert.equal(grid.option("data").length, 0, "data row deleted");
        assert.deepEqual(deletedArgs.item, { field: "value" }, "item is provided in updating event args");
        assert.equal(deletedArgs.itemIndex, 0, "itemIndex is provided in updating event args");
        assert.equal(deletedArgs.row.length, 1, "row element is provided in updating event args");
    });

    QUnit.test("deleteItem accepts row", function(assert) {
        var $element = $("#jsGrid"),
            deletedItem,
            itemToDelete = {
                field: "value"
            },
            data = [itemToDelete],

            gridOptions = {
                confirmDeleting: false,
                fields: [
                    { name: "field" }
                ],
                controller: {
                    deleteItem: function(deletingItem) {
                        deletedItem = deletingItem;
                    }
                }
            },

            grid = new Grid($element, gridOptions);

        grid.option("data", data);

        var $row = $element.find("." + grid.oddRowClass).eq(0);

        grid.deleteItem($row);

        assert.deepEqual(deletedItem, itemToDelete, "controller deleteItem called correctly");
        assert.equal(grid.option("data").length, 0, "data row deleted");
    });


    QUnit.module("paging");

    QUnit.test("pager is rendered if necessary", function(assert) {
        var $element = $("#jsGrid"),

            grid = new Grid($element, {
                data: [{}, {}, {}],
                paging: false,
                pageSize: 2
            });

        assert.ok(grid._pagerContainer.is(":hidden"), "pager is hidden when paging=false");
        assert.equal(grid._pagerContainer.html(), "", "pager is not rendered when paging=false");

        grid.option("paging", true);

        assert.ok(grid._pagerContainer.is(":visible"), "pager is visible when paging=true");
        assert.ok(grid._pagerContainer.html(), "pager is rendered when paging=true");

        grid.option("data", [{}, {}]);
        assert.ok(grid._pagerContainer.is(":hidden"), "pager is hidden for single page");
        assert.ok(grid._pagerContainer.html(), "pager is rendered for single page when paging=true");
    });

    QUnit.test("external pagerContainer", function(assert) {
        var $pagerContainer = $("<div>").appendTo("#qunit-fixture").hide(),
            $element = $("#jsGrid");

        new Grid($element, {
            data: [{}, {}, {}],
            pagerContainer: $pagerContainer,
            paging: true,
            pageSize: 2
        });

        assert.ok($pagerContainer.is(":visible"), "external pager shown");
        assert.ok($pagerContainer.html(), "external pager rendered");
    });

    QUnit.test("pager functionality", function(assert) {
        var $element = $("#jsGrid"),
            pager,
            pageChangedArgs,
            grid = new Grid($element, {
                data: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
                onPageChanged: function(args) {
                    pageChangedArgs = args;
                },
                paging: true,
                pageSize: 2,
                pageButtonCount: 3
            });

        assert.equal(grid._pagesCount(), 5, "correct page count");
        assert.equal(grid.option("pageIndex"), 1, "pageIndex is initialized");
        assert.equal(grid._firstDisplayingPage, 1, "_firstDisplayingPage is initialized");

        pager = grid._pagerContainer;
        assert.equal(pager.find("." + grid.currentPageClass).length, 1, "there is one current page");
        assert.ok(pager.find("." + grid.pageClass).eq(0).hasClass(grid.currentPageClass), "first page is current");
        assert.equal(pager.find("." + grid.pageClass).length, 3, "three pages displayed");
        assert.equal(pager.find("." + grid.pagerNavButtonClass).length, 5, "five nav buttons displayed: Fisrt Prev Next Last ...");
        assert.equal(pager.find("." + grid.pagerNavButtonInactiveClass).length, 2, "two nav buttons inactive: Fisrt Prev");

        grid.openPage(2);
        assert.equal(pager.find("." + grid.currentPageClass).length, 1, "there is one current page");
        assert.ok(pager.find("." + grid.pageClass).eq(1).hasClass(grid.currentPageClass), "second page is current");
        assert.equal(pager.find("." + grid.pageClass).length, 3, "three pages displayed");
        assert.equal(pager.find("." + grid.pagerNavButtonClass).length, 5, "five nav buttons displayed: First Prev Next Last and ...");
        assert.equal(pageChangedArgs.pageIndex, 2, "onPageChanged callback provides pageIndex in arguments");

        grid.showNextPages();
        assert.equal(grid._firstDisplayingPage, 3, "navigate by pages forward");

        grid.showPrevPages();
        assert.equal(grid._firstDisplayingPage, 1, "navigate by pages backward");

        grid.openPage(5);
        assert.equal(grid._firstDisplayingPage, 3, "opening next non-visible page moves first displaying page forward");

        grid.openPage(2);
        assert.equal(grid._firstDisplayingPage, 1, "opening prev non-visible page re-centers the window on it (clamped to the first page)");
    });

    QUnit.test("pager format", function(assert) {
        var $element = $("#jsGrid"),
            grid = new Grid($element, {
                data: [{}, {}, {}, {}, {}, {}],
                paging: true,
                pageSize: 2,
                pageIndex: 2,
                pageButtonCount: 1,
                pagerFormat: "a {pageIndex} {first} {prev} {pages} {next} {last} {pageCount} {itemCount} z",
                pagePrevText: "<",
                pageNextText: ">",
                pageFirstText: "<<",
                pageLastText: ">>",
                pageNavigatorNextText: "np",
                pageNavigatorPrevText: "pp"
            });

        grid._firstDisplayingPage = 2;
        grid._refreshPager();

        assert.equal($.trim(grid._pagerContainer.text()), "a 2 << < pp2np > >> 3 6 z", "pager text follows the format specified");
    });

    QUnit.test("pagerRenderer", function(assert) {
        var $element = $("#jsGrid");
        var pagerRendererConfig;
        var pageSize = 2;
        var items = [{}, {}, {}, {}, {}, {}, {}];
        var pageCount = Math.ceil(items.length / pageSize);

        var grid = new Grid($element, {
            data: items,
            paging: true,
            pageSize: pageSize,
            pagerRenderer: function(pagerConfig) {
                pagerRendererConfig = pagerConfig;
            }
        });

        assert.deepEqual(pagerRendererConfig, { pageIndex: 1, pageCount: pageCount });

        grid.openPage(2);
        assert.deepEqual(pagerRendererConfig, { pageIndex: 2, pageCount: pageCount });
    });

    QUnit.test("loading by page", function(assert) {
        var $element = $("#jsGrid"),
            data = [],
            itemCount = 20;

        for(var i = 1; i <= itemCount; i += 1) {
            data.push({
                value: i
            });
        }

        var gridOptions = {
            pageLoading: true,
            paging: true,
            pageSize: 7,
            fields: [
                { name: "value" }
            ],
            controller: {
                loadData: function(filter) {
                    var startIndex = (filter.pageIndex - 1) * filter.pageSize,
                        result = data.slice(startIndex, startIndex + filter.pageSize);
                    return {
                        data: result,
                        itemsCount: data.length
                    };
                }
            }
        };

        var grid = new Grid($element, gridOptions);

        grid.loadData();

        var pager = grid._pagerContainer;
        var gridData = grid.option("data");

        assert.equal(gridData.length, 7, "loaded one page of data");
        assert.equal(gridData[0].value, 1, "loaded right data start value");
        assert.equal(gridData[gridData.length - 1].value, 7, "loaded correct data end value");
        assert.ok(pager.find("." + grid.pageClass).eq(0).hasClass(grid.currentPageClass), "first page is current");
        assert.equal(pager.find("." + grid.pageClass).length, 3, "three pages displayed");

        grid.openPage(3);
        gridData = grid.option("data");

        assert.equal(gridData.length, 6, "loaded last page of data");
        assert.equal(gridData[0].value, 15, "loaded right data start value");
        assert.equal(gridData[gridData.length - 1].value, 20, "loaded right data end value");
        assert.ok(pager.find("." + grid.pageClass).eq(2).hasClass(grid.currentPageClass), "third page is current");
        assert.equal(pager.find("." + grid.pageClass).length, 3, "three pages displayed");
    });

    QUnit.test("'openPage' method ignores indexes out of range", function(assert) {
        var $element = $("#jsGrid"),
            grid = new Grid($element, {
                data: [{}, {}],
                paging: true,
                pageSize: 1
            });

        grid.openPage(0);
        assert.equal(grid.option("pageIndex"), 1, "too small index is ignored");

        grid.openPage(3);
        assert.equal(grid.option("pageIndex"), 1, "too big index is ignored");
    });


    QUnit.module("sorting");

    QUnit.test("sorting", function(assert) {
        var $element = $("#jsGrid"),

            gridOptions = {
                sorting: true,
                data: [
                    { value: 3 },
                    { value: 2 },
                    { value: 1 }
                ],
                fields: [
                    { name: "value", sorter: "number" }
                ]
            },
            grid = new Grid($element, gridOptions);

        var gridData = grid.option("data");

        var $th = grid._headerRow.find("th").eq(0);
        $th.trigger("click");

        assert.equal(grid._sortOrder, "asc", "asc sorting order for first click");
        assert.equal(grid._sortField, grid.fields[0], "sort field is set");
        assert.equal(gridData[0].value, 1);
        assert.equal(gridData[1].value, 2);
        assert.equal(gridData[2].value, 3);
        assert.ok($th.hasClass(grid.sortableClass));
        assert.ok($th.hasClass(grid.sortAscClass));

        $th.trigger("click");

        assert.equal(grid._sortOrder, "desc", "desc sorting order for second click");
        assert.equal(grid._sortField, grid.fields[0], "sort field is set");
        assert.equal(gridData[0].value, 3);
        assert.equal(gridData[1].value, 2);
        assert.equal(gridData[2].value, 1);
        assert.ok(!$th.hasClass(grid.sortAscClass));
        assert.ok($th.hasClass(grid.sortDescClass));
    });

    QUnit.test("sorting with pageLoading", function(assert) {
        var $element = $("#jsGrid"),
            loadFilter,

            gridOptions = {
                sorting: true,
                pageLoading: true,
                data: [
                    { value: 3 },
                    { value: 2 },
                    { value: 1 }
                ],
                controller: {
                    loadData: function(filter) {
                        loadFilter = filter;
                        return {
                            itemsCount: 0,
                            data: []
                        };
                    }
                },
                fields: [
                    { name: "value", sorter: "number" }
                ]
            },

            grid = new Grid($element, gridOptions);

        var $th = grid._headerRow.find("th").eq(0);
        $th.trigger("click");

        assert.equal(grid._sortOrder, "asc", "asc sorting order for first click");
        assert.equal(grid._sortField, grid.fields[0], "sort field is set");
        assert.equal(loadFilter.sortOrder, "asc", "sort direction is provided in loadFilter");
        assert.equal(loadFilter.sortField, "value", "sort field is provided in loadFilter");

        $th.trigger("click");

        assert.equal(grid._sortOrder, "desc", "desc sorting order for second click");
        assert.equal(grid._sortField, grid.fields[0], "sort field is set");
        assert.equal(loadFilter.sortOrder, "desc", "sort direction is provided in loadFilter");
        assert.equal(loadFilter.sortField, "value", "sort field is provided in loadFilter");
    });

    QUnit.test("no sorting for column with sorting = false", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {
            sorting: true,
            data: [
                { value: 3 },
                { value: 2 },
                { value: 1 }
            ],
            fields: [
                { name: "value", sorting: false }
            ]
        };

        var grid = new Grid($element, gridOptions);

        var gridData = grid.option("data");

        var $th = grid._headerRow.find("th").eq(0);
        $th.trigger("click");

        assert.equal(grid._sortField, null, "sort field is not set for the field with sorting=false");
        assert.equal(gridData[0].value, 3);
        assert.equal(gridData[1].value, 2);
        assert.equal(gridData[2].value, 1);
        assert.equal($th.hasClass(grid.sortableClass), false, "no sorting css for field with sorting=false");
        assert.equal($th.hasClass(grid.sortAscClass), false, "no sorting css for field with sorting=false");
    });

    QUnit.test("sort accepts sorting config", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                sorting: true,
                data: [
                    { value: 3 },
                    { value: 2 },
                    { value: 1 }
                ],
                fields: [
                    { name: "value", sorter: "number" }
                ]
            },
            grid = new Grid($element, gridOptions);

        var gridData = grid.option("data");

        grid.sort({ field: "value", order: "asc" });
        assert.equal(grid._sortOrder, "asc", "asc sorting order is set");
        assert.equal(grid._sortField, grid.fields[0], "sort field is set");
        assert.equal(gridData[0].value, 1);
        assert.equal(gridData[1].value, 2);
        assert.equal(gridData[2].value, 3);

        grid.sort({ field: 0 });
        assert.equal(grid._sortOrder, "desc", "desc sorting order for already set asc sorting");
        assert.equal(grid._sortField, grid.fields[0], "sort field is set");
        assert.equal(gridData[0].value, 3);
        assert.equal(gridData[1].value, 2);
        assert.equal(gridData[2].value, 1);

        grid.sort("value", "asc");
        assert.equal(grid._sortOrder, "asc", "asc sorting order is set");
        assert.equal(grid._sortField, grid.fields[0], "sort field is set");

        grid.sort(0);
        assert.equal(grid._sortOrder, "desc", "desc sorting order for already set asc sorting");
        assert.equal(grid._sortField, grid.fields[0], "sort field is set");
    });

    QUnit.test("getSorting returns current sorting", function(assert) {
        var $element = $("#jsGrid"),
            gridOptions = {
                sorting: true,
                data: [
                    { value: 3 },
                    { value: 2 },
                    { value: 1 }
                ],
                fields: [
                    { name: "value", sorter: "number" }
                ]
            },
            grid = new Grid($element, gridOptions);

        assert.deepEqual(grid.getSorting(), { field: undefined, order: undefined }, "undefined field and order before sorting");

        grid.sort("value");
        assert.deepEqual(grid.getSorting(), { field: "value", order: "asc" }, "current sorting returned");
    });

    QUnit.test("sorting css attached correctly when a field is hidden", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {
            sorting: true,
            data: [],
            fields: [
                { name: "field1", visible: false },
                { name: "field2" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        var gridData = grid.option("data");

        var $th = grid._headerRow.find("th").eq(0);
        $th.trigger("click");

        assert.equal($th.hasClass(grid.sortAscClass), true, "sorting css is attached to first field");
    });

    QUnit.module("canceling events");

    QUnit.test("cancel item edit", function(assert) {
        var $element = $("#jsGrid");
        var data = [{}];

        var gridOptions = {
            editing: true,

            onItemEditing: function(e) {
                e.cancel = true;
            },

            controller: {
                loadData: function() {
                    return data;
                }
            },

            fields: [
                { name: "test" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.loadData();
        grid.editItem(data[0]);
        assert.strictEqual(grid._editingRow, null, "no editing row");
    });

    QUnit.test("cancel controller.loadData", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {

            onDataLoading: function(e) {
                e.cancel = true;
            },

            controller: {
                loadData: function() {
                    return [{}];
                }
            },

            fields: [
                { name: "test" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.loadData();

        assert.equal(grid.option("data").length, 0, "no data loaded");
    });

    QUnit.test("cancel controller.insertItem", function(assert) {
        var $element = $("#jsGrid");
        var insertedItem = null;

        var gridOptions = {

            onItemInserting: function(e) {
                e.cancel = true;
            },

            controller: {
                insertItem: function(item) {
                    insertedItem = item;
                }
            },

            fields: [
                { name: "test" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.insertItem({ test: "value" });

        assert.strictEqual(insertedItem, null, "item was not inserted");
    });

    QUnit.test("cancel controller.updateItem", function(assert) {
        var $element = $("#jsGrid");
        var updatedItem = null;
        var existingItem = { test: "value" };

        var gridOptions = {

            data: [
                existingItem
            ],

            onItemUpdating: function(e) {
                e.cancel = true;
            },

            controller: {
                updateItem: function(item) {
                    updatedItem = item;
                }
            },

            fields: [
                { name: "test" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.updateItem(existingItem, { test: "new_value" });

        assert.strictEqual(updatedItem, null, "item was not updated");
    });

    QUnit.test("cancel controller.deleteItem", function(assert) {
        var $element = $("#jsGrid");
        var deletingItem = { test: "value" };
        var deletedItem = null;

        var gridOptions = {

            data: [
                deletingItem
            ],

            confirmDeleting: false,

            onItemDeleting: function(e) {
                e.cancel = true;
            },

            controller: {
                deleteItem: function(item) {
                    deletedItem = item;
                }
            },

            fields: [
                { name: "test" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.deleteItem(deletingItem);

        assert.strictEqual(deletedItem, null, "item was not deleted");
    });


    QUnit.module("complex properties binding");

    QUnit.test("rendering", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {

            loadMessage: "",

            data: [
                { complexProp: { prop: "test" } }
            ],

            fields: [
                { name: "complexProp.prop", title: "" }
            ]
        };

        new Grid($element, gridOptions);

        assert.equal($element.text(), "test", "complex property value rendered");
    });

    QUnit.test("editing", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {

            editing: true,

            data: [
                { complexProp: { prop: "test" } }
            ],

            fields: [
                { type: "text", name: "complexProp.prop" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.editItem(gridOptions.data[0]);
        assert.equal(grid.fields[0].editControl.val(), "test", "complex property value set in editor");
    });

    QUnit.test("should not fail if property is absent", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {

            loadMessage: "",

            data: [
                { complexProp: { } }
            ],

            fields: [
                { name: "complexProp.subprop.prop", title: "" }
            ]
        };

        new Grid($element, gridOptions);

        assert.equal($element.text(), "", "rendered empty value");
    });

    QUnit.test("inserting", function(assert) {
        var $element = $("#jsGrid");
        var insertingItem;

        var gridOptions = {
            inserting: true,

            fields: [
                { type: "text", name: "complexProp.prop" }
            ],

            onItemInserting: function(args) {
                insertingItem = args.item;
            }
        };

        var grid = new Grid($element, gridOptions);

        grid.fields[0].insertControl.val("test");
        grid.insertItem();

        assert.deepEqual(insertingItem, { complexProp: { prop: "test" } }, "inserting item has complex properties");
    });

    QUnit.test("filtering", function(assert) {
        var $element = $("#jsGrid");
        var loadFilter;

        var gridOptions = {
            filtering: true,

            fields: [
                { type: "text", name: "complexProp.prop" }
            ],

            controller: {
                loadData: function(filter) {
                    loadFilter = filter;
                }
            }
        };

        var grid = new Grid($element, gridOptions);

        grid.fields[0].filterControl.val("test");
        grid.search();

        assert.deepEqual(loadFilter, { complexProp: { prop: "test" } }, "filter has complex properties");
    });

    QUnit.test("updating", function(assert) {
        var $element = $("#jsGrid");
        var updatingItem;

        var gridOptions = {
            editing: true,

            data: [
                { complexProp: { } }
            ],

            fields: [
                { type: "text", name: "complexProp.prop" }
            ],

            onItemUpdating: function(args) {
                updatingItem = args.item;
            }
        };

        var grid = new Grid($element, gridOptions);

        grid.editItem(gridOptions.data[0]);
        grid.fields[0].editControl.val("test");
        grid.updateItem();

        assert.deepEqual(updatingItem, { complexProp: { prop: "test" } }, "updating item has complex properties");
    });

    QUnit.test("update nested prop", function(assert) {
        var $element = $("#jsGrid");
        var updatingItem;
        var previousItem;

        var gridOptions = {
            editing: true,

            data: [
                { prop: { subprop1: "test1", subprop2: "test2" } }
            ],

            fields: [
                { type: "text", name: "prop.subprop1" },
                { type: "text", name: "prop.subprop2" }
            ],

            onItemUpdating: function(args) {
                updatingItem = args.item;
            }
        };

        var grid = new Grid($element, gridOptions);

        grid.editItem(gridOptions.data[0]);
        grid.fields[0].editControl.val("new_test1");
        grid.updateItem();

        var expectedUpdatingItem = {
            prop: {
                subprop1: "new_test1",
                subprop2: "test2"
            }
        };

        assert.deepEqual(updatingItem, expectedUpdatingItem, "updating item has nested properties");
    });

    QUnit.test("updating deeply nested prop", function(assert) {
        var $element = $("#jsGrid");
        var updatingItem;
        var previousItem;

        var gridOptions = {
            editing: true,

            data: [
                { complexProp: { subprop1: { another_prop: "test" } } }
            ],

            fields: [
                { type: "text", name: "complexProp.subprop1.prop1" },
                { type: "text", name: "complexProp.subprop1.subprop2.prop12" }
            ],

            onItemUpdating: function(args) {
                updatingItem = $.extend(true, {}, args.item);
                previousItem = $.extend(true, {}, args.previousItem);
            }
        };

        var grid = new Grid($element, gridOptions);

        grid.editItem(gridOptions.data[0]);
        grid.fields[0].editControl.val("test1");
        grid.fields[1].editControl.val("test2");
        grid.updateItem();

        var expectedUpdatingItem = {
            complexProp: {
                subprop1: {
                    another_prop: "test",
                    prop1: "test1",
                    subprop2: { prop12: "test2" }
                }
            }
        };

        var expectedPreviousItem = {
            complexProp: {
                subprop1: {
                    another_prop: "test"
                }
            }
        };

        assert.deepEqual(updatingItem, expectedUpdatingItem, "updating item has deeply nested properties");
        assert.deepEqual(previousItem, expectedPreviousItem, "previous item preserved correctly");
    });


    QUnit.module("validation");

    QUnit.test("insertItem should call validation.validate", function(assert) {
        var $element = $("#jsGrid");
        var fieldValidationRules = { test: "value" };
        var validatingArgs;

        var gridOptions = {
            data: [],
            inserting: true,
            invalidNotify: $.noop,
            validation: {
                validate: function(args) {
                    validatingArgs = args;
                    return [];
                }
            },
            fields: [
                { type: "text", name: "Name", validate: fieldValidationRules }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.fields[0].insertControl.val("test");
        grid.insertItem();

        assert.deepEqual(validatingArgs, { value: "test", item: { Name: "test" }, itemIndex: -1,
            row: grid._insertRow, rules: fieldValidationRules }, "validating args is provided");
    });

    QUnit.test("insertItem rejected when data is not valid", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {
            data: [],
            inserting: true,
            invalidNotify: $.noop,
            validation: {
                validate: function() {
                    return ["Error"];
                }
            },
            fields: [
                { type: "text", name: "Name", validate: true }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.fields[0].insertControl.val("test");
        grid.insertItem().done(function() {
            assert.ok(false, "insertItem should not be completed");
        }).fail(function() {
            assert.ok(true, "insertItem should fail");
        });
    });

    QUnit.test("invalidClass is attached on invalid cell on inserting", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {
            data: [],
            inserting: true,
            invalidNotify: $.noop,
            validation: {
                validate: function() {
                    return ["Error"];
                }
            },
            fields: [
                { type: "text", name: "Id", visible: false },
                { type: "text", name: "Name", validate: true }
            ]
        };

        var grid = new Grid($element, gridOptions);
        var $insertCell = grid._insertRow.children().eq(0);

        grid.insertItem();

        assert.ok($insertCell.hasClass(grid.invalidClass), "invalid class is attached");
        assert.equal($insertCell.attr("title"), "Error", "cell tooltip contains error message");
    });

    QUnit.test("onItemInvalid callback", function(assert) {
        var $element = $("#jsGrid");
        var errors = ["Error"];
        var onItemInvalidCalled = 0;
        var onItemInvalidArgs;

        var gridOptions = {
            data: [],
            inserting: true,
            invalidNotify: $.noop,
            onItemInvalid: function(args) {
                onItemInvalidCalled++;
                onItemInvalidArgs = args;
            },

            validation: {
                validate: function(args) {
                    return !args.value ? errors : [];
                }
            },
            fields: [
                { type: "text", name: "Name", validate: true }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.insertItem();

        assert.equal(onItemInvalidCalled, 1, "onItemInvalid is called, when item data is invalid");
        assert.deepEqual(onItemInvalidArgs, { grid: grid, errors: [{ field: grid.fields[0], message: "Error" }],
            item: { Name: "" }, itemIndex: -1, row: grid._insertRow }, "arguments provided");

        grid.fields[0].insertControl.val("test");
        grid.insertItem();

        assert.equal(onItemInvalidCalled, 1, "onItemInvalid was not called, when data is valid");
    });

    QUnit.test("invalidNotify", function(assert) {
        var $element = $("#jsGrid");
        var errors = ["Error"];
        var invalidNotifyCalled = 0;
        var invalidNotifyArgs;

        var gridOptions = {
            data: [],
            inserting: true,

            invalidNotify: function(args) {
                invalidNotifyCalled++;
                invalidNotifyArgs = args;
            },

            validation: {
                validate: function(args) {
                    return !args.value ? errors : [];
                }
            },
            fields: [
                { type: "text", name: "Name", validate: true }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.insertItem();

        assert.equal(invalidNotifyCalled, 1, "invalidNotify is called, when item data is invalid");
        assert.deepEqual(invalidNotifyArgs, { grid: grid, errors: [{ field: grid.fields[0], message: "Error" }],
            row: grid._insertRow, item: { Name: "" }, itemIndex: -1 }, "arguments provided");

        grid.fields[0].insertControl.val("test");
        grid.insertItem();

        assert.equal(invalidNotifyCalled, 1, "invalidNotify was not called, when data is valid");
    });

    QUnit.test("invalidMessage", function(assert) {
        var $element = $("#jsGrid");
        var invalidMessage;
        var originalAlert = window.alert;

        window.alert = function(message) {
            invalidMessage = message;
        };

        try {
            Grid.prototype.invalidMessage = "InvalidTest";
            Grid.prototype.invalidNotify({ errors: [{ message: "Message1" }, { message: "Message2" }] });

            var expectedInvalidMessage = ["InvalidTest", "Message1", "Message2"].join("\n");
            assert.equal(invalidMessage, expectedInvalidMessage, "message contains invalidMessage and field error messages");
        } finally {
            window.alert = originalAlert;
        }
    });

    QUnit.test("updateItem should call validation.validate", function(assert) {
        var $element = $("#jsGrid");
        var validatingArgs;

        var gridOptions = {
            data: [{ Name: "" }],
            editing: true,

            invalidNotify: $.noop,
            validation: {
                validate: function(args) {
                    validatingArgs = args;
                    return ["Error"];
                }
            },

            fields: [
                { type: "text", name: "Name", validate: "required" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.editItem(gridOptions.data[0]);

        grid.fields[0].editControl.val("test");
        grid.updateItem();

        assert.deepEqual(validatingArgs, { value: "test", item: { Name: "test" }, itemIndex: 0,
            row: grid._getEditRow(), rules: "required" }, "validating args is provided");
    });

    QUnit.test("invalidClass is attached on invalid cell on updating", function(assert) {
        var $element = $("#jsGrid");

        var gridOptions = {
            data: [{}],
            editing: true,
            invalidNotify: $.noop,
            validation: {
                validate: function() {
                    return ["Error"];
                }
            },
            fields: [
                { type: "text", name: "Name", validate: true }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.editItem(gridOptions.data[0]);
        var $editCell = grid._getEditRow().children().eq(0);

        grid.updateItem();

        assert.ok($editCell.hasClass(grid.invalidClass), "invalid class is attached");
        assert.equal($editCell.attr("title"), "Error", "cell tooltip contains error message");
    });

    QUnit.test("validation should ignore not editable fields", function(assert) {
        var invalidNotifyCalled = 0;
        var $element = $("#jsGrid");
        var validatingArgs;

        var gridOptions = {
            data: [{ Name: "" }],
            editing: true,

            invalidNotify: function() {
                invalidNotifyCalled++;
            },
            validation: {
                validate: function() {
                    return ["Error"];
                }
            },

            fields: [
                { type: "text", name: "Name", editing: false, validate: "required" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.editItem(gridOptions.data[0]);
        grid.updateItem();
        assert.equal(invalidNotifyCalled, 0, "data is valid");
    });

    QUnit.module("api");

    QUnit.test("reset method should go the first page when pageLoading is truned on", function(assert) {
        var items = [{ Name: "1" }, { Name: "2" }];
        var $element = $("#jsGrid");

        var gridOptions = {
            paging: true,
            pageSize: 1,
            pageLoading: true,
            autoload: true,
            controller: {
                loadData: function(args) {
                    return {
                        data: [items[args.pageIndex - 1]],
                        itemsCount: items.length
                    };
                }
            },

            fields: [
                { type: "text", name: "Name" }
            ]
        };

        var grid = new Grid($element, gridOptions);

        grid.openPage(2);
        grid.reset();
        assert.equal(grid._bodyGrid.text(), "1", "grid content reset");
    });


    QUnit.module("i18n");

    QUnit.test("set locale by name", function(assert) {
        jsGrid.locales.my_lang = {
            grid: {
                test: "test_text"
            }
        };

        jsGrid.locale("my_lang");

        var $element = $("#jsGrid").jsGrid({});

        assert.equal($element.jsGrid("option", "test"), "test_text", "option localized");
    });

    QUnit.test("set locale by config", function(assert) {
        jsGrid.locale( {
            grid: {
                test: "test_text"
            }
        });

        var $element = $("#jsGrid").jsGrid({});

        assert.equal($element.jsGrid("option", "test"), "test_text", "option localized");
    });

    QUnit.test("locale throws exception for unknown locale", function(assert) {
        assert.throws(function() {
            jsGrid.locale("unknown_lang");
        }, /unknown_lang/, "locale threw an exception");
    });


    QUnit.module("controller promise");

    QUnit.test("should support jQuery promise success callback", function(assert) {
        assert.expect(1);
        var done = assert.async();
        var data = [];
        var gridOptions = {
            autoload: false,
            controller: {
                loadData: function() {
                    var d = $.Deferred();

                    setTimeout(function() {
                        d.resolve(data);
                        done();
                    });

                    return d.promise();
                }
            }
        };

        var grid = new Grid($("#jsGrid"), gridOptions);

        var promise = grid._controllerCall("loadData", {}, false, $.noop);
        promise.done(function(result) {
            assert.equal(result, data, "data provided to done callback");
        });
    });

    QUnit.test("should support jQuery promise fail callback", function(assert) {
        assert.expect(1);
        var done = assert.async();
        var failArgs = {};
        var gridOptions = {
            autoload: false,
            controller: {
                loadData: function() {
                    var d = $.Deferred();

                    setTimeout(function() {
                        d.reject(failArgs);
                        done();
                    });

                    return d.promise();
                }
            }
        };

        var grid = new Grid($("#jsGrid"), gridOptions);

        var promise = grid._controllerCall("loadData", {}, false, $.noop);
        promise.fail(function(result) {
            assert.equal(result, failArgs, "fail args provided to fail callback");
        });
    });

    QUnit.test("should support JS promise success callback", function(assert) {
        assert.expect(1);
        var done = assert.async();
        if(typeof Promise === "undefined") {
            assert.ok(true, "Promise not supported");
            done();
            return;
        }

        var data = [];
        var gridOptions = {
            autoload: false,
            controller: {
                loadData: function() {
                    return new Promise(function(resolve, reject) {
                        setTimeout(function() {
                            resolve(data);
                            done();
                        });
                    });
                }
            }
        };

        var grid = new Grid($("#jsGrid"), gridOptions);

        var promise = grid._controllerCall("loadData", {}, false, $.noop);
        promise.done(function(result) {
            assert.equal(result, data, "data provided to done callback");
        });
    });

    QUnit.test("should support JS promise fail callback", function(assert) {
        assert.expect(1);
        var done = assert.async();
        if(typeof Promise === "undefined") {
            assert.ok(true, "Promise not supported");
            done();
            return;
        }

        var failArgs = {};
        var gridOptions = {
            autoload: false,
            controller: {
                loadData: function() {
                    return new Promise(function(resolve, reject) {
                        setTimeout(function() {
                            reject(failArgs);
                            done();
                        });
                    });
                }
            }
        };

        var grid = new Grid($("#jsGrid"), gridOptions);

        var promise = grid._controllerCall("loadData", {}, false, $.noop);
        promise.fail(function(result) {
            assert.equal(result, failArgs, "fail args provided to fail callback");
        });
    });

    QUnit.test("should support non-promise result", function(assert) {
        assert.expect(1);
        var data = [];
        var gridOptions = {
            autoload: false,
            controller: {
                loadData: function() {
                    return data;
                }
            }
        };

        var grid = new Grid($("#jsGrid"), gridOptions);

        var promise = grid._controllerCall("loadData", {}, false, $.noop);
        promise.done(function(result) {
            assert.equal(result, data, "data provided to done callback");
        });
    });


    QUnit.module("renderTemplate");

    QUnit.test("should pass undefined and null arguments to the renderer", function(assert) {
        var rendererArgs;
        var rendererContext;
        var context = {};

        var renderer = function() {
            rendererArgs = arguments;
            rendererContext = this;
        };

        Grid.prototype.renderTemplate(renderer, context, { arg1: undefined, arg2: null, arg3: "test" });

        assert.equal(rendererArgs.length, 3);
        assert.strictEqual(rendererArgs[0], undefined, "undefined passed");
        assert.strictEqual(rendererArgs[1], null, "null passed");
        assert.strictEqual(rendererArgs[2], "test", "null passed");
        assert.strictEqual(rendererContext, context, "context is preserved");
    });
    
    QUnit.module("Data Export", {
        beforeEach: function() {
            
            this.exportConfig = {};
            this.exportConfig.type = "csv";
            this.exportConfig.subset = "all";
            this.exportConfig.delimiter = "|";
            this.exportConfig.includeHeaders = true;
            this.exportConfig.encapsulate = true;
            
            this.element = $("#jsGrid");
            
            this.gridOptions = {
                width: "100%",
                height: "400px",
 
                inserting: true,
                editing: true,
                sorting: true,
                paging: true,
                pageSize: 2,
 
                data: [
                    { "Name": "Otto Clay", "Country": 1, "Married": false },
                    { "Name": "Connor Johnston", "Country": 2, "Married": true },
                    { "Name": "Lacey Hess", "Country": 2, "Married": false },
                    { "Name": "Timothy Henson", "Country": 1, "Married": true }
                ],
 
                fields: [
                    { name: "Name", type: "text", width: 150, validate: "required" },
                    { name: "Country", type: "select", items: [{ Name: "United States", Id: 1 },{ Name: "Canada", Id: 2 }], valueField: "Id", textField: "Name" },
                    { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
                    { type: "control" }
                ]
            }
        
        }
        
    });
    
    /* Base Choice Criteria 
        type: csv
        subset: all
        delimiter: |
        includeHeaders: true
        encapsulate: true
    */
    QUnit.test("Should export data: Base Choice", function(assert) {
        var grid = new Grid($(this.element), this.gridOptions);
        var data = grid.exportData(this.exportConfig);
        
        var expected = "";
            expected += '"Name"|"Country"|"Is Married"\r\n';
            expected += '"Otto Clay"|"United States"|"false"\r\n';
            expected += '"Connor Johnston"|"Canada"|"true"\r\n';
            expected += '"Lacey Hess"|"Canada"|"false"\r\n';
            expected += '"Timothy Henson"|"United States"|"true"\r\n';
            
        assert.equal(data, expected, "Output CSV configured to Base Choice Criteria -- Check Source");
    });
    
    QUnit.test("Should export data: defaults = BCC", function(assert) {
        var grid = new Grid($(this.element), this.gridOptions);
        var data = grid.exportData();
        
        var expected = "";
            expected += '"Name"|"Country"|"Is Married"\r\n';
            expected += '"Otto Clay"|"United States"|"false"\r\n';
            expected += '"Connor Johnston"|"Canada"|"true"\r\n';
            expected += '"Lacey Hess"|"Canada"|"false"\r\n';
            expected += '"Timothy Henson"|"United States"|"true"\r\n';
            
        assert.equal(data, expected, "Output CSV with all defaults -- Should be equal to Base Choice");
    });
    
    QUnit.test("Should export data: subset=visible", function(assert) {
        var grid = new Grid($(this.element), this.gridOptions);
        this.exportConfig.subset = "visible";
        var data = grid.exportData(this.exportConfig);
        
        var expected = "";
            expected += '"Name"|"Country"|"Is Married"\r\n';
            expected += '"Otto Clay"|"United States"|"false"\r\n';
            expected += '"Connor Johnston"|"Canada"|"true"\r\n';
            //expected += '"Lacey Hess"|"Canada"|"false"\r\n';
            //expected += '"Timothy Henson"|"United States"|"true"\r\n';
            
        assert.equal(data, expected, "Output CSV of visible records");
    });
    
    QUnit.test("Should export data: delimiter=;", function(assert) {
        var grid = new Grid($(this.element), this.gridOptions);
        this.exportConfig.delimiter = ";";
        var data = grid.exportData(this.exportConfig);
        
        var expected = "";
            expected += '"Name";"Country";"Is Married"\r\n';
            expected += '"Otto Clay";"United States";"false"\r\n';
            expected += '"Connor Johnston";"Canada";"true"\r\n';
            expected += '"Lacey Hess";"Canada";"false"\r\n';
            expected += '"Timothy Henson";"United States";"true"\r\n';
            
        assert.equal(data, expected, "Output CSV with non-default delimiter");
    });
    
    QUnit.test("Should export data: headers=false", function(assert) {
        var grid = new Grid($(this.element), this.gridOptions);
        this.exportConfig.includeHeaders = false;
        var data = grid.exportData(this.exportConfig);
        
        var expected = "";
            //expected += '"Name"|"Country"|"Is Married"\r\n';
            expected += '"Otto Clay"|"United States"|"false"\r\n';
            expected += '"Connor Johnston"|"Canada"|"true"\r\n';
            expected += '"Lacey Hess"|"Canada"|"false"\r\n';
            expected += '"Timothy Henson"|"United States"|"true"\r\n';
            
        assert.equal(data, expected, "Output CSV without Headers");
    });
    
    QUnit.test("Should export data: encapsulate=false", function(assert) {
        var grid = new Grid($(this.element), this.gridOptions);
        this.exportConfig.encapsulate = false;
        var data = grid.exportData(this.exportConfig);
        
        var expected = "";
            expected += 'Name|Country|Is Married\r\n';
            expected += 'Otto Clay|United States|false\r\n';
            expected += 'Connor Johnston|Canada|true\r\n';
            expected += 'Lacey Hess|Canada|false\r\n';
            expected += 'Timothy Henson|United States|true\r\n';
            
        assert.equal(data, expected, "Output CSV without encapsulation");
    });
    
    QUnit.test("Should export filtered data", function(assert) {
        var grid = new Grid($(this.element), this.gridOptions);
        this.exportConfig['filter'] = function(item){
                if (item["Name"].indexOf("O") === 0)
                    return true
        };
        var data = grid.exportData(this.exportConfig);
        
        var expected = "";
            expected += '"Name"|"Country"|"Is Married"\r\n';
            expected += '"Otto Clay"|"United States"|"false"\r\n';
            //expected += '"Connor Johnston"|"Canada"|"true"\r\n';
            //expected += '"Lacey Hess"|"Canada"|"false"\r\n';
            //expected += '"Timothy Henson"|"United States"|"true"\r\n';
            
        assert.equal(data, expected, "Output CSV filtered to show names starting with O");
    });
    
    QUnit.test("Should export data: transformed value", function(assert) {
        var grid = new Grid($(this.element), this.gridOptions);
        this.exportConfig['transforms'] = {};
        this.exportConfig.transforms['Married'] = function(value){
                if (value === true) return "Yes"
                if (value === false) return "No"
        };
        var data = grid.exportData(this.exportConfig);
        
        var expected = "";
            expected += '"Name"|"Country"|"Is Married"\r\n';
            expected += '"Otto Clay"|"United States"|"No"\r\n';
            expected += '"Connor Johnston"|"Canada"|"Yes"\r\n';
            expected += '"Lacey Hess"|"Canada"|"No"\r\n';
            expected += '"Timothy Henson"|"United States"|"Yes"\r\n';
            
        assert.equal(data, expected, "Output CSV column value transformed properly");
    });


    QUnit.module("Export rows", {
        beforeEach: function() {
            this.element = $("#jsGrid");

            this.people = [
                { Name: "Otto Clay", Country: 1, Married: false },
                { Name: "Connor Johnston", Country: 2, Married: true },
                { Name: "Lacey Hess", Country: 2, Married: false },
                { Name: "Timothy Henson", Country: 1, Married: true },
                { Name: "Ann \"Q\" Lee", Country: 1, Married: false }
            ];

            this.fields = [
                { name: "Name", type: "text", title: "Full name" },
                { name: "Country", type: "select", items: [{ Name: "United States", Id: 1 }, { Name: "Canada", Id: 2 }], valueField: "Id", textField: "Name" },
                { name: "Married", type: "checkbox", sorting: false },
                { type: "control" }
            ];

            // a server-paged controller; remembers every call it got
            var that = this;
            this.calls = [];
            this.controller = {
                loadData: function(filter) {
                    that.calls.push($.extend(true, {}, filter));
                    var start = (filter.pageIndex - 1) * filter.pageSize;
                    return {
                        data: that.people.slice(start, start + filter.pageSize),
                        itemsCount: that.people.length
                    };
                }
            };
        },

        names: function(rows) {
            return $.map(rows, function(row) { return row.Name; });
        }
    });

    QUnit.test("direct loading: page is the visible slice, all is everything", function(assert) {
        var grid = new Grid(this.element, {
            paging: true,
            pageSize: 2,
            pageIndex: 2,
            data: this.people,
            fields: this.fields
        });

        var page, all;
        grid.exportRows().done(function(rows) { page = rows; });
        grid.exportRows({ scope: "all" }).done(function(rows) { all = rows; });

        assert.deepEqual(this.names(page), ["Lacey Hess", "Timothy Henson"], "default scope is the current page");
        assert.equal(all.length, 5, "all rows");
        assert.notStrictEqual(all, this.people, "a copy, not the grid's own array");
    });

    QUnit.test("direct loading without paging: page is everything", function(assert) {
        var grid = new Grid(this.element, { data: this.people, fields: this.fields });

        var page;
        grid.exportRows({ scope: "page" }).done(function(rows) { page = rows; });

        assert.equal(page.length, 5);
    });

    QUnit.test("page loading: page is the loaded page, controller is not called again", function(assert) {
        var grid = new Grid(this.element, {
            paging: true,
            pageLoading: true,
            pageSize: 2,
            autoload: true,
            controller: this.controller,
            fields: this.fields
        });

        var calls = this.calls.length, page;
        grid.exportRows({ scope: "page" }).done(function(rows) { page = rows; });

        assert.deepEqual(this.names(page), ["Otto Clay", "Connor Johnston"]);
        assert.equal(this.calls.length, calls, "no extra request");
    });

    QUnit.test("page loading: all is fetched chunk by chunk and leaves the grid alone", function(assert) {
        var grid = new Grid(this.element, {
            paging: true,
            pageLoading: true,
            pageSize: 2,
            exportChunkSize: 2,
            autoload: true,
            controller: this.controller,
            fields: this.fields
        });

        this.calls.length = 0;

        var all;
        grid.exportRows({ scope: "all" }).done(function(rows) { all = rows; });

        assert.equal(all.length, 5, "all rows collected");
        assert.deepEqual(this.names(all), $.map(this.people, function(p) { return p.Name; }), "in order");
        assert.deepEqual($.map(this.calls, function(c) { return c.pageIndex; }), [1, 2, 3], "three requests, one per chunk");
        assert.equal(this.calls[0].pageSize, 2, "chunk size sent as pageSize");

        assert.equal(grid.option("data").length, 2, "displayed page untouched");
        assert.equal(grid.pageIndex, 1, "pager untouched");
    });

    QUnit.test("page loading: chunkSize option overrides exportChunkSize, a chunk bigger than the data is one request", function(assert) {
        var grid = new Grid(this.element, {
            paging: true,
            pageLoading: true,
            pageSize: 2,
            exportChunkSize: 2,
            autoload: true,
            controller: this.controller,
            fields: this.fields
        });

        this.calls.length = 0;

        var all;
        grid.exportRows({ scope: "all", chunkSize: 100 }).done(function(rows) { all = rows; });

        assert.equal(all.length, 5);
        assert.equal(this.calls.length, 1);
    });

    QUnit.test("page loading: all replays the filter of the last load, not the filter row", function(assert) {
        var grid = new Grid(this.element, {
            paging: true,
            pageLoading: true,
            pageSize: 2,
            exportChunkSize: 3,
            controller: this.controller,
            fields: this.fields
        });

        grid.loadData({ q: "abc", range: { from: "1", to: "9" } });
        this.calls.length = 0;

        grid.exportRows({ scope: "all" });

        assert.equal(this.calls.length, 2, "two chunks of 3 for 5 rows");
        assert.equal(this.calls[0].q, "abc", "filter replayed");
        assert.deepEqual(this.calls[0].range, { from: "1", to: "9" }, "nested filter values replayed");
        assert.equal(this.calls[1].pageIndex, 2);
    });

    QUnit.test("page loading: a failing request rejects and fires onError", function(assert) {
        var done = assert.async();
        var errors = 0, calls = 0, that = this;
        var grid = new Grid(this.element, {
            paging: true,
            pageLoading: true,
            pageSize: 2,
            controller: {
                loadData: function(filter) {
                    calls++;
                    return filter.pageIndex === 1
                        ? { data: that.people.slice(0, 2), itemsCount: 5 }
                        : $.Deferred().reject().promise();
                }
            },
            onError: function() { errors++; },
            fields: this.fields
        });

        // a controller promise is adopted through jQuery 3 then(), i.e. asynchronously
        grid.exportRows({ scope: "all", chunkSize: 2 }).fail(function() {
            assert.equal(calls, 2, "stopped at the failing chunk");
            assert.equal(errors, 1, "onError fired");

            done();
        });
    });

    QUnit.test("exportFields: visible named fields, no buttons, no includeInDataExport: false", function(assert) {
        var grid = new Grid(this.element, {
            data: this.people,
            fields: [
                { name: "Name", type: "text" },
                { name: "Hidden", type: "text", visible: false },
                { name: "Skipped", type: "text", includeInDataExport: false },
                { name: "Country", type: "select", items: [{ Name: "United States", Id: 1 }], valueField: "Id", textField: "Name" },
                { type: "control" }
            ]
        });

        assert.deepEqual($.map(grid.exportFields(), function(field) { return field.name; }), ["Name", "Country"]);
    });

    QUnit.test("exportCellValue: raw value, select text, empty for missing", function(assert) {
        var grid = new Grid(this.element, {
            data: [],
            fields: [
                { name: "Price", type: "number" },
                { name: "Country", type: "select", items: [{ Name: "United States", Id: 1 }, { Name: "Canada", Id: 2 }], valueField: "Id", textField: "Name" },
                { name: "Kind", type: "select", items: { a: "Alpha", b: "Beta" } },
                { name: "Nested.Value", type: "text" }
            ]
        });

        var fields = grid.fields;
        var item = { Price: 1500, Country: "2", Kind: "b", Nested: { Value: "deep" }, Missing: null };

        assert.strictEqual(grid.exportCellValue(item, fields[0]), 1500, "a number stays a number");
        assert.strictEqual(grid.exportCellValue(item, fields[1]), "Canada", "array items: text by valueField (loose match, as the code is a string here)");
        assert.strictEqual(grid.exportCellValue(item, fields[2]), "Beta", "object items: text by key");
        assert.strictEqual(grid.exportCellValue(item, fields[3]), "deep", "nested field name");
        assert.strictEqual(grid.exportCellValue({ Price: null }, fields[0]), "", "null gives an empty string");
        assert.strictEqual(grid.exportCellValue({}, fields[0]), "", "missing gives an empty string");
        assert.strictEqual(grid.exportCellValue({ Kind: "zzz" }, fields[2]), "zzz", "unknown code is kept as it is");
    });

    QUnit.test("onDataExporting gets the scope", function(assert) {
        var scope;
        var grid = new Grid(this.element, {
            data: this.people,
            fields: this.fields,
            onDataExporting: function(args) { scope = args.scope; }
        });

        grid.exportRows({ scope: "all" });

        assert.equal(scope, "all");
    });

    QUnit.test("exportCsv: headers, select text, quoting, no control column", function(assert) {
        var done = assert.async();
        var grid = new Grid(this.element, { data: this.people, fields: this.fields });

        grid.exportCsv({ scope: "all" }).done(function(csv) {
            var lines = csv.split("\r\n");

            assert.equal(lines[0], '"Full name";"Country";"Married"', "titles, control column left out");
            assert.equal(lines[1], '"Otto Clay";"United States";"false"');
            assert.equal(lines[2], '"Connor Johnston";"Canada";"true"');
            assert.equal(lines[5], '"Ann ""Q"" Lee";"United States";"false"', "quotes doubled");
            assert.equal(lines[6], "", "trailing newline");

            done();
        });
    });

    QUnit.test("exportCsv: custom delimiter, no headers, no encapsulation", function(assert) {
        var done = assert.async();
        var grid = new Grid(this.element, { data: this.people.slice(0, 2), fields: this.fields });

        grid.exportCsv({ delimiter: "|", includeHeaders: false, encapsulate: false, newline: "\n" }).done(function(csv) {
            assert.equal(csv, "Otto Clay|United States|false\nConnor Johnston|Canada|true\n");

            done();
        });
    });

});
