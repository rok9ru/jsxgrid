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
        defaultSelected: null,//value to preset the filter input with, applied once on first filter render then reset

        filterTemplate: function () {
            if (!this.filtering)
                return "";

            var grid = this._grid,
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

            return $result;
        },

        insertTemplate: function () {
            if (!this.inserting)
                return "";

            return this.insertControl = this._createTextBox();
        },

        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createTextBox();
            $result.val(value);
            return $result;
        },

        filterValue: function () {
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
