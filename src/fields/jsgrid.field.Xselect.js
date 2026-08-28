(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.SelectField, only jsGrid.Field.

    var Field = jsGrid.Field;
    var NUMBER_VALUE_TYPE = "number";

    var Xselect = function (config) {
        this.items = [];
        this.selectedIndex = -1;
        this.valueField = "";
        this.textField = "";

        if (config.valueField && config.items && config.items.length) {
            var firstItemValue = config.items[0][config.valueField];
            this.valueType = (typeof firstItemValue) === NUMBER_VALUE_TYPE ? NUMBER_VALUE_TYPE : "string";
        }

        this.sorter = this.valueType;

        Field.call(this, config);
    };

    Xselect.prototype = new Field({
        align: "center",
        autosearch: true,
        valueType: NUMBER_VALUE_TYPE,
        pseudoElement: null,//pseudoElement that will be unsifted to start of select data in filters
        select2: null,
        defaultSelected: null,

        itemTemplate: function (value) {
            var items = this.items,
                valueField = this.valueField,
                textField = this.textField,
                resultItem;

            if (valueField) {
                if (typeof(value) === "object") {
                    resultItem = value;
                } else {
                    resultItem = $.grep(items, function (item) {
                        return item[valueField] === value;
                    })[0] || {};
                }
            } else {
                resultItem = items[value];
            }

            var result = (textField ? resultItem[textField] : resultItem);

            return (result === undefined || result === null) ? "" : result;
        },

        insertTemplate: function () {
            if (!this.inserting)
                return "";

            return this.insertControl = this._createSelect();
        },

        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createSelect();
            var editValue = value;
            if (typeof(value) === "object") {
                editValue = value[this.valueField];
            }
            (editValue !== undefined) && $result.val(editValue);
            return $result;
        },

        insertValue: function () {
            var val = this.insertControl.val();
            return this.valueType === NUMBER_VALUE_TYPE ? parseInt(val || 0, 10) : val;
        },

        editValue: function () {
            var val = this.editControl.val();
            return this.valueType === NUMBER_VALUE_TYPE ? parseInt(val || 0, 10) : val;
        },

        filterTemplate: function () {
            if (!this.filtering)
                return "";
            var data;
            if (Array.isArray(this.items)) {
                data = this.items.slice(0);
                if (this.pseudoElement) {
                    data.unshift(this.pseudoElement);
                } else {
                    var d = {};
                    d[this.textField] = '';
                    d[this.valueField] = null;
                    data.unshift(d);
                }
            } else if (typeof this.items === 'object') {
                data = Object.assign({}, this.items);
                if ((typeof this.pseudoElement === 'object') && this.pseudoElement) {
                    data = Object.assign({}, data, this.pseudoElement);
                } else {
                    data = Object.assign({}, {'': null}, data);
                }
            }
            if (this.defaultSelected !== null) {
                var valueField = this.valueField;
                var targetValue = this.defaultSelected;
                var foundIndex = -1;

                $.each(data, function (index, item) {
                    var value = valueField ? item[valueField] : index;
                    if (value == targetValue) {
                        foundIndex = index;
                        return false;
                    }
                });
                if (foundIndex !== -1) {
                    this.selectedIndex = foundIndex;
                }
                this.defaultSelected = null;
            }

            var grid = this._grid,
                $result = this.filterControl = this._createSelect(data);

            if (this.autosearch) {
                $result.on("change", function (e) {
                    grid.search();
                });
            }

            return $result;
        },

        filterValue: function () {
            var val = this.filterControl.val();
            return this.valueType === NUMBER_VALUE_TYPE ? parseInt(val || 0, 10) : val;
        },

        _createSelect: function (data) {
            var $result = $("<select>"),
                valueField = this.valueField,
                textField = this.textField,
                selectedIndex = this.selectedIndex;

            $.each((data || this.items), function (index, item) {
                var value = valueField ? item[valueField] : index,
                    text = textField ? item[textField] : item;

                var $option = $("<option>")
                    .attr("value", value)
                    .text(text)
                    .appendTo($result);

                $option.prop("selected", (selectedIndex === index));
            });

            $result.prop("disabled", !!this.readOnly);

            if(this.select2){
                var s2 = Object.assign({}, this.select2, {width: '100%'});
                setTimeout(function() {
                    $result.select2(s2);
                }, 0);
            }

            return $result;
        }

    });

    jsGrid.fields.Xselect = Xselect;

}(jsGrid, jQuery));