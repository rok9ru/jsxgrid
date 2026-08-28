(function(jsGrid, $, undefined) {

    var Xtextarea = function (config) {
        jsGrid.TextAreaField.call(this, config);
    };

    Xtextarea.prototype = new jsGrid.TextAreaField({
        maxShowSymbols: 50,
        defaultSelected: null,//value to preset the filter input with, applied once on first filter render then reset

        filterTemplate: function () {
            var $result = jsGrid.TextAreaField.prototype.filterTemplate.call(this);

            if (this.filtering && this.defaultSelected !== null) {
                this.filterControl.val(this.defaultSelected);
                this.defaultSelected = null;
            }

            return $result;
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