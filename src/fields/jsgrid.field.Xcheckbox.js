(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.CheckboxField, only jsGrid.Field.
    // Same tri-state (checked/unchecked/indeterminate) filter behavior as
    // CheckboxField, reimplemented here directly instead of inherited.

    var Field = jsGrid.Field;

    var Xcheckbox = function (config) {
        Field.call(this, config);
    };

    Xcheckbox.prototype = new Field({
        sorter: "number",
        align: "center",
        autosearch: true,
        defaultSelected: null,//value (0/1/true/false) to preset the filter checkbox with, applied once on first filter render then reset

        filterTemplate: function () {
            if (!this.filtering)
                return "";

            var grid = this._grid,
                $result = this.filterControl = this._createCheckbox();

            $result.prop({
                readOnly: true,
                indeterminate: true
            });

            $result.on("click", function () {
                var $cb = $(this);

                if ($cb.prop("readOnly")) {
                    $cb.prop({
                        checked: false,
                        readOnly: false
                    });
                } else if (!$cb.prop("checked")) {
                    $cb.prop({
                        readOnly: true,
                        indeterminate: true
                    });
                }
            });

            if (this.autosearch) {
                $result.on("click", function () {
                    grid.search();
                });
            }

            if (this.defaultSelected !== null) {
                $result.prop({
                    checked: !!this.defaultSelected,
                    indeterminate: false,
                    readOnly: false
                });
                this.defaultSelected = null;
            }

            return $result;
        },

        filterValue: function () {
            return this.filterControl.get(0).indeterminate
                ? undefined
                : (this.filterControl.is(":checked") ? 1 : 0);
        },

        insertTemplate: function () {
            if (!this.inserting)
                return "";

            return this.insertControl = this._createCheckbox();
        },

        insertValue: function () {
            return +(this.insertControl.is(":checked"));
        },

        editValue: function () {
            return +(this.editControl.is(":checked"));
        },
        itemTemplate: function (value) {
            return this._createCheckbox().prop({
                checked: +value,
                disabled: true
            });
        },
        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createCheckbox();
            $result.prop("checked", +value);
            return $result;
        },

        _createCheckbox: function () {
            return $("<input>").attr("type", "checkbox");
        }

    });

    jsGrid.fields.Xcheckbox = Xcheckbox;

}(jsGrid, jQuery));