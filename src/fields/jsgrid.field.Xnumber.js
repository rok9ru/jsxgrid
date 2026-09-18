(function(jsGrid, $, undefined) {

    if (!jsGrid) {
        if (window.console) {
            console.error("[jsxgrid] jsgrid.field.Xnumber.js was loaded before the jsxgrid engine (jsxgrid.js) - include the engine first.");
        }
        return;
    }


    // Standalone: does not extend jsGrid.NumberField or Xtext, only jsGrid.Field.

    var Field = jsGrid.Field;

    var Xnumber = function (config) {
        Field.call(this, config);
    };

    Xnumber.prototype = new Field({
        sorter: "number",
        align: "right",
        autosearch: true,
        readOnly: false,
        numberRange: false,//when true, the filter renders two number inputs (from/to) instead of one, and filterValue() returns {from, to}
        defaultSelected: null,//value (or {from, to} when numberRange is true) to preset the filter with, applied once on first filter render then reset
        defaultValue: null,//value to prefill the insert row with, applied every time a fresh insert row is built (not reset after use, unlike defaultSelected) - always a single value, numberRange only affects filtering

        filterTemplate: function () {
            if (!this.filtering)
                return "";

            var grid = this._grid, $result;

            if (this.numberRange) {
                var $startInput = this._createTextBox().addClass("jsgrid-number-start");
                var $endInput = this._createTextBox().addClass("jsgrid-number-end");
                var $container = $("<div class='jsgrid-number-range-wrapper'>").append($startInput).append($endInput);

                $container.val = function () {
                    return {
                        from: $startInput.val(),
                        to: $endInput.val()
                    };
                };

                $result = this.filterControl = $container;

                if (this.defaultSelected !== null) {
                    var range = this.defaultSelected || {};
                    $startInput.val(range.from || '');
                    $endInput.val(range.to || '');
                    this.defaultSelected = null;
                }

                if (this.autosearch) {
                    $result.on("keypress", "input", function (e) {
                        if (e.which === 13) {
                            grid.search();
                            e.preventDefault();
                        }
                    });
                }
            } else {
                $result = this.filterControl = this._createTextBox();

                if (this.autosearch) {
                    $result.on("keypress", function (e) {
                        if (e.which === 13) {
                            grid.search();
                            e.preventDefault();
                        }
                    });
                }

                if (this.defaultSelected !== null) {
                    $result.val(this.defaultSelected);
                    this.defaultSelected = null;
                }
            }

            return $result;
        },

        insertTemplate: function () {
            if (!this.inserting)
                return "";

            var $result = this.insertControl = this._createTextBox();
            if (this.defaultValue !== null) {
                $result.val(this.defaultValue);
            }
            return $result;
        },

        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createTextBox();
            $result.val(value);
            return $result;
        },

        filterValue: function () {
            if (this.numberRange) {
                var range = this.filterControl.val();
                return {
                    from: range.from ? parseInt(range.from, 10) : undefined,
                    to: range.to ? parseInt(range.to, 10) : undefined
                };
            }

            return this.filterControl.val()
                ? parseInt(this.filterControl.val() || 0, 10)
                : undefined;
        },

        insertValue: function () {
            return this.insertControl.val()
                ? parseInt(this.insertControl.val() || 0, 10)
                : undefined;
        },

        editValue: function () {
            return this.editControl.val()
                ? parseInt(this.editControl.val() || 0, 10)
                : undefined;
        },

        _createTextBox: function () {
            return $("<input>").attr("type", "number")
                .prop("readonly", !!this.readOnly);
        }
    });

    jsGrid.fields.Xnumber = Xnumber;

}(window.jsGrid, window.jQuery));
