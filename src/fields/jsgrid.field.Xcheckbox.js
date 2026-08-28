(function(jsGrid, $, undefined) {

    var Xcheckbox = function (config) {
        jsGrid.CheckboxField.call(this, config);
    };

    Xcheckbox.prototype = new jsGrid.CheckboxField({
        defaultSelected: null,//value (0/1/true/false) to preset the filter checkbox with, applied once on first filter render then reset

        filterTemplate: function () {
            var $result = jsGrid.CheckboxField.prototype.filterTemplate.call(this);

            if (this.filtering && this.defaultSelected !== null) {
                this.filterControl.prop({
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
        }

    });

    jsGrid.fields.Xcheckbox = Xcheckbox;

}(jsGrid, jQuery));