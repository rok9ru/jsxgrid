(function(jsGrid, $, undefined) {

    var XimgField = function (config) {
        jsGrid.TextField.call(this, config);
    };

    XimgField.prototype = new jsGrid.TextField({
        fm_callback: null,
        editButtonText: 'Open FM',
        defaultSelected: null,//value to preset the filter input with, applied once on first filter render then reset

        filterTemplate: function () {
            var $result = jsGrid.TextField.prototype.filterTemplate.call(this);

            if (this.filtering && this.defaultSelected !== null) {
                this.filterControl.val(this.defaultSelected);
                this.defaultSelected = null;
            }

            return $result;
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
        }


    });

    jsGrid.fields.XimgField = XimgField;

}(jsGrid, jQuery));