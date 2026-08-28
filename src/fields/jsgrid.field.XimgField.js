(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.TextField, only jsGrid.Field.

    var Field = jsGrid.Field;

    var XimgField = function (config) {
        Field.call(this, config);
    };

    XimgField.prototype = new Field({
        autosearch: true,
        readOnly: false,
        fm_callback: null,
        editButtonText: 'Open FM',
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

        itemTemplate: function (value) {
            var img = $('<img class="jsgrid-img" src="">');
            img.attr("src", value || '');
            img.css('max-height', '50px');
            img.css('max-width', '50px');

            return img;
        }
        , editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);
            var fm = this.fm_callback;

            var editControl = this.editControl = $('<input type="text">').val(value || '');
            if (fm) {
                return $('<button class="jsgrid-imgField-button">' + this.editButtonText + '</button>').click(function () {
                    fm(editControl);
                });
            }
            return editControl;

        },
        insertTemplate: function () {
            if (!this.inserting)
                return "";
            var fm = this.fm_callback;

            var insertControl = this.insertControl = $('<input type="text">');
            if (typeof fm == 'function') {
                return $('<button class="jsgrid-imgField-button">'+this.editButtonText+'</button>').click(function () {
                    fm(insertControl);
                });
            }
            return insertControl;
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
        }

    });

    jsGrid.fields.XimgField = XimgField;

}(jsGrid, jQuery));