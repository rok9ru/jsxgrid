(function(jsGrid, $, undefined) {
    var XDateTimeField = function (config) {
        jsGrid.Field.call(this, config);
    };
    XDateTimeField.prototype = new jsGrid.Field({

        css: "date-field",            // redefine general property 'css'
        align: "center",              // redefine general property 'align'
        datePickerType: "datetime-local",
        dateRange: false,
        defaultSelected: null,//value (or {from, to} when dateRange is true) to preset the filter with, applied once on first filter render then reset
        sorter: function (date1, date2) {
            return new Date(date1) - new Date(date2);
        },

        filterTemplate: function () {
            if (!this.filtering)
                return "";


            var grid = this._grid;
            var $result = $();
            if(this.dateRange){
                var $container = $("<div class='jsgrid-date-range-wrapper'>");

                var $startInput = $("<input>", {
                    "class": "jsgrid-date-picker jsgrid-date-start",
                    "type": this.datePickerType,
                    "title": "Period date start"
                });

                var $endInput = $("<input>", {
                    "class": "jsgrid-date-picker jsgrid-date-end",
                    "type": this.datePickerType,
                    "title": "Period date end"
                });

                $container.val = function () {
                    var fromVal = $startInput.val();
                    var toVal = $endInput.val();

                    return {
                        from: fromVal,
                        to: toVal
                    };
                };

                $result = this.filterControl = $container.append($startInput).append($endInput);

                if (this.defaultSelected !== null) {
                    var range = this.defaultSelected || {};
                    $startInput.val(range.from || '');
                    $endInput.val(range.to || '');
                    this.defaultSelected = null;
                }

                if (this.autosearch) {
                    $result.on("change", ".jsgrid-date-picker", function (e) {
                        grid.search();
                    });
                }
            }else{
                $result = this.filterControl = this._createPicker();

                if (this.defaultSelected !== null) {
                    $result.val(this.defaultSelected);
                    this.defaultSelected = null;
                }

                if (this.autosearch) {
                    $result.on("change", function (e) {
                        grid.search();
                    });
                }
            }

            return $result;
        },

        filterValue: function () {
            return this.filterControl.val();
        },

        itemTemplate: function (value) {
            if (!value) {
                return '';
            }
            var options = this.options || {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            return new Date(value.replace(' ', 'T')).toLocaleDateString(undefined, options);
        },

        insertTemplate: function () {
            return this._insertPicker = this._createPicker();
        },

        editTemplate: function (value) {
            return this._editPicker = this._createPicker().val(value);
        },

        insertValue: function () {
            return this._insertPicker.val();
        },

        editValue: function () {
            return this._editPicker.val();
        },
        _createPicker: function () {
            return $("<input class='date-picker'>").attr("type", this.datePickerType);
        }
    });


    jsGrid.fields.XDateTimeField = XDateTimeField;
}(jsGrid, jQuery));