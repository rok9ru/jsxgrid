(function(jsGrid, $, undefined) {

    if (!jsGrid) {
        if (window.console) {
            console.error("[jsxgrid] jsgrid.field.Xcontrol.js was loaded before the jsxgrid engine (jsxgrid.js) - include the engine first.");
        }
        return;
    }


    // Already standalone - the native control field extends jsGrid.Field
    // directly, same as every X-field. X-branded purely for naming parity,
    // so it can be used instead of "control" once the native fields bundle
    // is dropped in favor of the X set.

    var Field = jsGrid.Field;

    function Xcontrol(config) {
        Field.call(this, config);
        this.includeInDataExport = false;
        this._configInitialized = false;
    }

    Xcontrol.prototype = new Field({
        css: "jsgrid-control-field",
        align: "center",
        width: 50,
        filtering: false,
        inserting: false,
        editing: false,
        sorting: false,

        buttonClass: "jsgrid-button",
        modeButtonClass: "jsgrid-mode-button",

        modeOnButtonClass: "jsgrid-mode-on-button",
        searchModeButtonClass: "jsgrid-search-mode-button",
        insertModeButtonClass: "jsgrid-insert-mode-button",
        editButtonClass: "jsgrid-edit-button",
        deleteButtonClass: "jsgrid-delete-button",
        searchButtonClass: "jsgrid-search-button",
        clearFilterButtonClass: "jsgrid-clear-filter-button",
        insertButtonClass: "jsgrid-insert-button",
        updateButtonClass: "jsgrid-update-button",
        cancelEditButtonClass: "jsgrid-cancel-edit-button",

        searchModeButtonTooltip: "Switch to searching",
        insertModeButtonTooltip: "Switch to inserting",
        editButtonTooltip: "Edit",
        deleteButtonTooltip: "Delete",
        searchButtonTooltip: "Search",
        clearFilterButtonTooltip: "Clear filter",
        insertButtonTooltip: "Insert",
        updateButtonTooltip: "Update",
        cancelEditButtonTooltip: "Cancel edit",

        editButton: true,
        deleteButton: true,
        clearFilterButton: true,
        modeSwitchButton: true,

        // jsxgrid extension, not in upstream jsGrid: an export button in the header. When the grid
        // pages (and has more than one page) it opens a small menu to pick the volume - the current
        // page or all records (see grid.exportRows); otherwise it exports everything right away.
        // The rows go to exportHandler(rows, {scope, grid, field}); without one a CSV file is
        // downloaded. Off by default.
        exportButton: false,
        exportHandler: null,
        exportFileName: "export.csv",
        exportButtonClass: "jsgrid-export-button",
        exportMenuClass: "jsgrid-export-menu",
        exportMenuItemClass: "jsgrid-export-menu-item",
        exportButtonTooltip: "Export",
        exportPageText: "Current page",
        exportAllText: "All records",

        _initConfig: function() {
            this._hasFiltering = this._grid.filtering;
            this._hasInserting = this._grid.inserting;

            if(this._hasInserting && this.modeSwitchButton) {
                this._grid.inserting = false;
            }

            this._configInitialized = true;
        },

        headerTemplate: function() {
            var $modeButton = this._createHeaderModeButton();

            if(!this.exportButton)
                return $modeButton;

            return $($modeButton).add(this._createExportButton());
        },

        _createHeaderModeButton: function() {
            if(!this._configInitialized) {
                this._initConfig();
            }

            var hasFiltering = this._hasFiltering;
            var hasInserting = this._hasInserting;

            if(!this.modeSwitchButton || (!hasFiltering && !hasInserting))
                return "";

            if(hasFiltering && !hasInserting)
                return this._createFilterSwitchButton();

            if(hasInserting && !hasFiltering)
                return this._createInsertSwitchButton();

            return this._createModeSwitchButton();
        },

        itemTemplate: function(value, item) {
            var $result = $([]);

            if(this.editButton) {
                $result = $result.add(this._createEditButton(item));
            }

            if(this.deleteButton) {
                $result = $result.add(this._createDeleteButton(item));
            }

            return $result;
        },

        filterTemplate: function() {
            var $result = this._createSearchButton();
            return this.clearFilterButton ? $result.add(this._createClearFilterButton()) : $result;
        },

        insertTemplate: function() {
            return this._createInsertButton();
        },

        editTemplate: function() {
            return this._createUpdateButton().add(this._createCancelEditButton());
        },

        _createExportButton: function() {
            var field = this,
                grid = this._grid;

            var $button = $("<input>").addClass(this.buttonClass + " " + this.exportButtonClass)
                .attr({
                    type: "button",
                    title: this.exportButtonTooltip
                })
                .on("click", function(e) {
                    // the document-level "click outside closes the menu" handler must not see the
                    // click that opens it
                    e.stopPropagation();

                    if(field._closeExportMenu())
                        return;

                    // one page worth of data (or no paging at all): nothing to choose between
                    if(!grid.paging || grid._itemsCount() <= grid.pageSize) {
                        field._runExport("all", $button);
                    } else {
                        field._openExportMenu($button);
                    }
                });

            return $button;
        },

        _openExportMenu: function($button) {
            var field = this;

            var $menu = $("<div>").addClass(this.exportMenuClass).appendTo(document.body);

            $.each([["page", this.exportPageText], ["all", this.exportAllText]], function(_, item) {
                $("<div>").addClass(field.exportMenuItemClass)
                    .text(item[1])
                    .on("click", function(e) {
                        e.stopPropagation();
                        field._closeExportMenu();
                        field._runExport(item[0], $button);
                    })
                    .appendTo($menu);
            });

            // body-level (not inside the header cell): the grid's header container clips overflow
            var rect = $button[0].getBoundingClientRect();
            $menu.css({
                position: "absolute",
                top: rect.bottom + window.pageYOffset + 2,
                left: rect.left + window.pageXOffset
            });

            this._exportMenu = $menu;

            $(document).on("click.jsgridExportMenu", $.proxy(this._closeExportMenu, this))
                .on("keydown.jsgridExportMenu", $.proxy(function(e) {
                    if(e.which === 27) {
                        this._closeExportMenu();
                    }
                }, this));
        },

        // true if a menu was open (and is closed now)
        _closeExportMenu: function() {
            if(!this._exportMenu)
                return false;

            this._exportMenu.remove();
            this._exportMenu = null;
            $(document).off(".jsgridExportMenu");

            return true;
        },

        _runExport: function(scope, $button) {
            var field = this,
                grid = this._grid;

            $button.prop("disabled", true);

            grid.exportRows({ scope: scope }).done(function(rows) {
                var handler = field.exportHandler || field._downloadCsv;
                handler.call(field, rows, { scope: scope, grid: grid, field: field });
            }).always(function() {
                $button.prop("disabled", false);
            });
        },

        // default exportHandler: a UTF-8 CSV with BOM (Excel needs it to read Cyrillic properly)
        _downloadCsv: function(rows, info) {
            var csv = info.grid._rowsToCsv(rows, {});
            var blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
            var url = URL.createObjectURL(blob);

            var $link = $("<a>").attr({ href: url, download: this.exportFileName }).appendTo(document.body);
            $link[0].click();
            $link.remove();

            setTimeout(function() {
                URL.revokeObjectURL(url);
            }, 1000);
        },

        _createFilterSwitchButton: function() {
            return this._createOnOffSwitchButton("filtering", this.searchModeButtonClass, true);
        },

        _createInsertSwitchButton: function() {
            return this._createOnOffSwitchButton("inserting", this.insertModeButtonClass, false);
        },

        _createOnOffSwitchButton: function(option, cssClass, isOnInitially) {
            var isOn = isOnInitially;

            var updateButtonState = $.proxy(function() {
                $button.toggleClass(this.modeOnButtonClass, isOn);
            }, this);

            var $button = this._createGridButton(this.modeButtonClass + " " + cssClass, "", function(grid) {
                isOn = !isOn;
                grid.option(option, isOn);
                updateButtonState();
            });

            updateButtonState();

            return $button;
        },

        _createModeSwitchButton: function() {
            var isInserting = false;

            var updateButtonState = $.proxy(function() {
                $button.attr("title", isInserting ? this.searchModeButtonTooltip : this.insertModeButtonTooltip)
                    .toggleClass(this.insertModeButtonClass, !isInserting)
                    .toggleClass(this.searchModeButtonClass, isInserting);
            }, this);

            var $button = this._createGridButton(this.modeButtonClass, "", function(grid) {
                isInserting = !isInserting;
                grid.option("inserting", isInserting);
                grid.option("filtering", !isInserting);
                updateButtonState();
            });

            updateButtonState();

            return $button;
        },

        _createEditButton: function(item) {
            return this._createGridButton(this.editButtonClass, this.editButtonTooltip, function(grid, e) {
                grid.editItem(item);
                e.stopPropagation();
            });
        },

        _createDeleteButton: function(item) {
            return this._createGridButton(this.deleteButtonClass, this.deleteButtonTooltip, function(grid, e) {
                grid.deleteItem(item);
                e.stopPropagation();
            });
        },

        _createSearchButton: function() {
            return this._createGridButton(this.searchButtonClass, this.searchButtonTooltip, function(grid) {
                grid.search();
            });
        },

        _createClearFilterButton: function() {
            return this._createGridButton(this.clearFilterButtonClass, this.clearFilterButtonTooltip, function(grid) {
                grid.clearFilter();
            });
        },

        _createInsertButton: function() {
            return this._createGridButton(this.insertButtonClass, this.insertButtonTooltip, function(grid) {
                grid.insertItem().done(function() {
                    grid.clearInsert();
                });
            });
        },

        _createUpdateButton: function() {
            return this._createGridButton(this.updateButtonClass, this.updateButtonTooltip, function(grid, e) {
                grid.updateItem();
                e.stopPropagation();
            });
        },

        _createCancelEditButton: function() {
            return this._createGridButton(this.cancelEditButtonClass, this.cancelEditButtonTooltip, function(grid, e) {
                grid.cancelEdit();
                e.stopPropagation();
            });
        },

        _createGridButton: function(cls, tooltip, clickHandler) {
            var grid = this._grid;

            return $("<input>").addClass(this.buttonClass)
                .addClass(cls)
                .attr({
                    type: "button",
                    title: tooltip
                })
                .on("click", function(e) {
                    clickHandler(grid, e);
                });
        },

        editValue: function() {
            return "";
        }

    });

    jsGrid.fields.Xcontrol = Xcontrol;

}(window.jsGrid, window.jQuery));
