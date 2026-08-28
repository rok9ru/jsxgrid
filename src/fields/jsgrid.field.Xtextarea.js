(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.TextAreaField, only jsGrid.Field.

    var Field = jsGrid.Field;

    var Xtextarea = function (config) {
        Field.call(this, config);
    };

    Xtextarea.prototype = new Field({
        autosearch: true,
        readOnly: false,
        maxShowSymbols: 50,
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

        filterValue: function () {
            return this.filterControl.val();
        },

        insertTemplate: function () {
            if (!this.inserting)
                return "";

            return this.insertControl = this._createTextArea();
        },

        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createTextArea();
            $result.val(value);
            return $result;
        },

        insertValue: function () {
            return this.insertControl.val();
        },

        editValue: function () {
            return this.editControl.val();
        },

        _createTextBox: function () {
            return $("<input>").attr("type", "text")
                .prop("readonly", !!this.readOnly);
        },

        _createTextArea: function () {
            return $("<textarea>").prop("readonly", !!this.readOnly);
        },

        itemTemplate: function (value, item) {
            value = value == null ? '' : String(value);

            if (value.length <= this.maxShowSymbols) {
                return $("<div>").text(value);
            }
            var str = value.slice(0, this.maxShowSymbols);
            var div = $("<div>").text(str + ' ...').one("click",function () {
                div.text(value);
                return false;
            });

            return div;
        }

    });

    jsGrid.fields.Xtextarea = Xtextarea;

}(jsGrid, jQuery));